import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  FieldPath,
  deleteField
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  RecaptchaVerifier,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0RxeHkphyME9sziVGmT-0qXRkMA1J9V0",
  authDomain: "paa-results-portal.firebaseapp.com",
  projectId: "paa-results-portal",
  storageBucket: "paa-results-portal.firebasestorage.app",
  messagingSenderId: "645732828809",
  appId: "1:645732828809:web:dd9bb222c98a2855e26858"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const appStateRef = doc(db, "appState", "markhub");
const splitRootCollection = "sessionData";
const classListMarkKeyPrefix = "__classList__::";
let phoneConfirmationResult = null;
let phoneRecaptchaVerifier = null;
const duplicatedActiveSessionFields = [
  "classes",
  "workingDays",
  "attendance",
  "measurements",
  "marks",
  "published",
  "dataEntryUpdates",
  "studentProfiles",
  "studentEnrolments",
  "studentProfileAudit"
];

const splitSessionFields = [
  "classes",
  "workingDays",
  "attendance",
  "measurements",
  "marks",
  "published",
  "publishedMarksheets",
  "dataEntryUpdates"
];

function compactStateForFirestore(state = {}) {
  const compactState = sanitizeFirestoreValue({ ...state }, ["state"]);
  duplicatedActiveSessionFields.forEach((field) => delete compactState[field]);
  if (compactState.sessions && typeof compactState.sessions === "object") {
    compactState.sessions = Object.fromEntries(
      Object.entries(compactState.sessions)
        .map(([session, sessionData]) => {
          const sessionShell = { ...(sessionData || {}) };
          splitSessionFields.forEach((field) => delete sessionShell[field]);
          return [session, sessionShell];
        })
    );
  }
  return compactState;
}

function isPlainObject(value) {
  if (!value || Object.prototype.toString.call(value) !== "[object Object]") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isFirestoreFieldValue(value) {
  return value
    && typeof value === "object"
    && (typeof value._methodName === "string"
      || String(value.constructor?.name || "").includes("FieldValue"));
}

function sanitizeFirestoreValue(value, path = []) {
  if (value === undefined) {
    console.warn("[Firestore] Converted undefined value to null before saving.", { path: fieldPathLabel(path) });
    return null;
  }
  if (typeof value === "number" && !Number.isFinite(value)) {
    console.warn("[Firestore] Converted invalid number to null before saving.", { path: fieldPathLabel(path), value });
    return null;
  }
  if (typeof value === "function" || typeof value === "symbol") {
    console.warn("[Firestore] Removed unsupported value before saving.", { path: fieldPathLabel(path), type: typeof value });
    return null;
  }
  if (isFirestoreFieldValue(value)) {
    console.warn("[Firestore] Removed Firestore field sentinel from full-state save.", { path: fieldPathLabel(path) });
    return null;
  }
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.toISOString();
  if (Array.isArray(value)) return value.map((item, index) => sanitizeFirestoreValue(item, [...path, String(index)]));
  if (!isPlainObject(value)) {
    console.warn("[Firestore] Converted custom object before saving.", {
      path: fieldPathLabel(path),
      type: Object.prototype.toString.call(value)
    });
    try {
      return sanitizeFirestoreValue(JSON.parse(JSON.stringify(value)), path);
    } catch {
      return null;
    }
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => {
        const validKey = String(key).trim() !== "" && !/^__.*__$/.test(String(key));
        if (!validKey) {
          console.warn("[Firestore] Removed invalid field name before saving.", {
            path: fieldPathLabel([...path, String(key)]),
            key
          });
        }
        return validKey;
      })
      .map(([key, entryValue]) => [key, sanitizeFirestoreValue(entryValue, [...path, key])])
  );
}

function shouldRewriteCompactState(error, fallbackState) {
  if (!fallbackState) return false;
  const code = String(error?.code || "").replace(/^firestore\//, "");
  const message = String(error?.message || "").toLowerCase();
  return [
    "not-found",
    "resource-exhausted",
    "invalid-argument"
  ].includes(code)
    || message.includes("invalid argument")
    || message.includes("unsupported field value")
    || message.includes("invalid data");
}

function fieldPathLabel(path = []) {
  return path.map((segment) => String(segment ?? "")).join(" > ");
}

function splitDocId(value) {
  return encodeURIComponent(String(value || "blank").trim() || "blank")
    .replace(/\./g, "%2E")
    .replace(/%/g, "_");
}

function splitDocLabel(id) {
  const encoded = String(id || "")
    .replace(/_([0-9A-Fa-f]{2})/g, "%$1");
  try {
    return decodeURIComponent(encoded);
  } catch {
    return String(id || "");
  }
}

function termFromSplitKey(key) {
  const parts = splitDocLabel(key).split("::");
  return parts.length > 1 ? parts.slice(1).join("::") : "";
}

function splitDocRef(session, collectionName, id) {
  return doc(db, splitRootCollection, splitDocId(session), collectionName, splitDocId(id));
}

function normalizeApprovedIdentifier(identifier = "") {
  const value = String(identifier || "").trim();
  if (!value) return "";
  if (value.includes("@")) return value.toLowerCase();
  return value.replace(/[\s().-]/g, "");
}

function approvedUserRef(identifier = "") {
  const normalized = normalizeApprovedIdentifier(identifier);
  if (!normalized || normalized.includes("/")) return null;
  return doc(db, "approvedUsers", normalized);
}

function authProfileFromApprovedDoc(identifier, data = {}, firebaseUser = null) {
  const rawRole = String(data.role || "teacher").trim().toLowerCase();
  const staffRole = ["admin", "principal", "headmaster", "teacher"].includes(rawRole) ? rawRole : "teacher";
  const displayName = String(data.name || firebaseUser?.displayName || firebaseUser?.email || firebaseUser?.phoneNumber || identifier || staffRole).trim();
  return {
    username: String(data.username || (staffRole === "principal" ? "principal" : staffRole === "headmaster" ? "headmaster" : firebaseUser?.uid || normalizeApprovedIdentifier(identifier))).trim(),
    role: staffRole === "admin" ? "admin" : staffRole === "headmaster" ? "headmaster" : "user",
    staffRole,
    name: displayName,
    email: firebaseUser?.email || data.email || "",
    phoneNumber: firebaseUser?.phoneNumber || data.phoneNumber || "",
    uid: firebaseUser?.uid || "",
    photoURL: firebaseUser?.photoURL || data.photoURL || "",
    authProvider: "firebase"
  };
}

async function getApprovedPortalUser(identifier, firebaseUser = null) {
  const candidates = [
    identifier,
    firebaseUser?.email,
    firebaseUser?.phoneNumber
  ].map(normalizeApprovedIdentifier).filter(Boolean);
  for (const candidate of [...new Set(candidates)]) {
    const ref = approvedUserRef(candidate);
    if (!ref) continue;
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) continue;
    const data = snapshot.data() || {};
    if (data.active === false) return null;
    return authProfileFromApprovedDoc(candidate, data, firebaseUser);
  }
  return null;
}

function requireApprovedPortalUser(profile) {
  if (!profile) throw new Error("This email or phone number is not approved for this portal.");
  return profile;
}

function ensurePhoneRecaptcha() {
  if (phoneRecaptchaVerifier) return phoneRecaptchaVerifier;
  phoneRecaptchaVerifier = new RecaptchaVerifier(auth, "phoneRecaptcha", { size: "invisible" });
  return phoneRecaptchaVerifier;
}

function classListMarkKey(className) {
  return `${classListMarkKeyPrefix}${String(className || "").trim()}`;
}

function markDocPayload(data = {}) {
  return {
    className: data.className || "",
    exam: data.exam || "",
    subject: data.subject || "",
    markKey: data.markKey || "",
    marks: sanitizeFirestoreValue(data.marks || {}, ["marks"]),
    dataEntryUpdate: sanitizeFirestoreValue(data.dataEntryUpdate
      ? { ...data.dataEntryUpdate, key: data.dataEntryKey || "" }
      : null, ["dataEntryUpdate"]),
    updatedAt: data.updatedAt || new Date().toISOString(),
    updatedBy: data.updatedBy || ""
  };
}

function classListDocPayload(data = {}) {
  const className = data.className || "";
  return {
    type: "classList",
    className,
    markKey: classListMarkKey(className),
    students: sanitizeFirestoreValue(Array.isArray(data.students) ? data.students : [], ["students"]),
    updatedAt: data.updatedAt || new Date().toISOString(),
    updatedBy: data.updatedBy || ""
  };
}

function attendanceDocPayload(data = {}) {
  return {
    className: data.className || "",
    term: data.term || "",
    attendanceKey: data.attendanceKey || "",
    workingDays: sanitizeFirestoreValue(data.workingDays ?? 0, ["workingDays"]),
    attendance: sanitizeFirestoreValue(data.attendance || {}, ["attendance"]),
    dataEntryUpdate: sanitizeFirestoreValue(data.dataEntryUpdate
      ? { ...data.dataEntryUpdate, key: data.dataEntryKey || "" }
      : null, ["dataEntryUpdate"]),
    updatedAt: data.updatedAt || new Date().toISOString(),
    updatedBy: data.updatedBy || ""
  };
}

function measurementsDocPayload(data = {}) {
  return {
    className: data.className || "",
    term: data.term || "",
    attendanceKey: data.attendanceKey || "",
    measurements: sanitizeFirestoreValue(data.measurements || {}, ["measurements"]),
    dataEntryUpdate: sanitizeFirestoreValue(data.dataEntryUpdate
      ? { ...data.dataEntryUpdate, key: data.dataEntryKey || "" }
      : null, ["dataEntryUpdate"]),
    updatedAt: data.updatedAt || new Date().toISOString(),
    updatedBy: data.updatedBy || ""
  };
}

function publicationDocPayload(data = {}) {
  return {
    className: data.className || "",
    exam: data.exam || "",
    key: data.key || "",
    value: sanitizeFirestoreValue(data.value || null, ["publication"]),
    updatedAt: data.updatedAt || new Date().toISOString(),
    updatedBy: data.updatedBy || ""
  };
}

function studentProfileDocPayload(profile = {}) {
  const allowed = [
    "studentId",
    "studentName",
    "normalizedName",
    "schoolIdNo",
    "gender",
    "dateOfBirth",
    "bloodGroup",
    "address",
    "landmark",
    "studentContact",
    "primaryParentContact",
    "alternateContact",
    "pen",
    "aadhaarNo",
    "aparId",
    "fatherName",
    "fatherContact",
    "motherName",
    "motherContact",
    "guardianName",
    "guardianRelationship",
    "guardianContact",
    "parentGuardianAadhaar",
    "nationality",
    "religion",
    "denomination",
    "bplAay",
    "admissionNo",
    "dateOfAdmission",
    "photoURL",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy"
  ];
  return sanitizeFirestoreValue(Object.fromEntries(
    allowed.map((field) => [field, profile[field] ?? ""])
  ), ["studentProfile"]);
}

function studentEnrolmentDocPayload(enrolment = {}) {
  const allowed = [
    "studentId",
    "academicSessionId",
    "className",
    "section",
    "rollNumber",
    "houseColour",
    "residentialStatus",
    "admissionType",
    "skillDevelopmentProgramme",
    "skillDevelopmentGroup",
    "instructor",
    "studentStatus",
    "promotedFromClass",
    "createdAt",
    "updatedAt"
  ];
  return sanitizeFirestoreValue(Object.fromEntries(
    allowed.map((field) => [field, enrolment[field] ?? ""])
  ), ["studentEnrolment"]);
}

window.MarkHubFirebase = {
  app,
  db,
  auth,
  async signInApprovedUser({ identifier, password } = {}) {
    const email = normalizeApprovedIdentifier(identifier);
    if (!email || !email.includes("@")) throw new Error("Enter an approved email address.");
    if (!password) throw new Error("Enter your password.");
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getApprovedPortalUser(email, credential.user);
    if (!profile) {
      await signOut(auth);
      throw new Error("This email is not approved for this portal.");
    }
    return profile;
  },
  async registerApprovedEmailUser({ identifier, password } = {}) {
    const email = normalizeApprovedIdentifier(identifier);
    if (!email || !email.includes("@")) throw new Error("Enter an approved email address.");
    if (!password || password.length < 6) throw new Error("Password must be at least 6 characters.");
    const approved = await getApprovedPortalUser(email);
    if (!approved) throw new Error("This email is not pre-approved. Ask Admin to add it first.");
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return requireApprovedPortalUser(await getApprovedPortalUser(email, credential.user));
  },
  async sendApprovedPasswordReset(identifier) {
    const email = normalizeApprovedIdentifier(identifier);
    if (!email || !email.includes("@")) throw new Error("Enter your approved email address first.");
    const approved = await getApprovedPortalUser(email);
    if (!approved) throw new Error("This email is not pre-approved. Ask Admin to add it first.");
    await sendPasswordResetEmail(auth, email);
    return true;
  },
  async sendApprovedPhoneCode(phoneNumber) {
    const phone = normalizeApprovedIdentifier(phoneNumber);
    if (!phone || !phone.startsWith("+")) throw new Error("Enter phone number with country code, for example +919876543210.");
    const approved = await getApprovedPortalUser(phone);
    if (!approved) throw new Error("This phone number is not pre-approved. Ask Admin to add it first.");
    phoneConfirmationResult = await signInWithPhoneNumber(auth, phone, ensurePhoneRecaptcha());
    return true;
  },
  async confirmApprovedPhoneCode(code) {
    if (!phoneConfirmationResult) throw new Error("Send the phone OTP first.");
    const credential = await phoneConfirmationResult.confirm(String(code || "").trim());
    phoneConfirmationResult = null;
    const profile = await getApprovedPortalUser(credential.user.phoneNumber, credential.user);
    if (!profile) {
      await signOut(auth);
      throw new Error("This phone number is not approved for this portal.");
    }
    return profile;
  },
  listenApprovedAuthState(onUser, onError) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        onUser(null);
        return;
      }
      try {
        const profile = await getApprovedPortalUser(firebaseUser.email || firebaseUser.phoneNumber, firebaseUser);
        if (!profile) {
          await signOut(auth);
          onUser(null);
          return;
        }
        onUser(profile);
      } catch (error) {
        onError?.(error);
      }
    }, onError);
  },
  async signOutApprovedUser() {
    await signOut(auth);
  },
  listenResultByRoll(rollNumber, onResult, onError) {
    const roll = String(rollNumber || "").trim();
    if (!roll) return () => {};

    console.log(`[Firestore] Listening to results/${roll}`);
    return onSnapshot(
      doc(db, "results", roll),
      (snapshot) => {
        console.log(`[Firestore] Listener received update from results/${roll}`, {
          exists: snapshot.exists(),
          fromCache: snapshot.metadata.fromCache,
          hasPendingWrites: snapshot.metadata.hasPendingWrites
        });
        onResult(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      },
      onError
    );
  },
  listenAppState(onState, onError) {
    console.log("[Firestore] Listening to appState/markhub");
    return onSnapshot(
      appStateRef,
      (snapshot) => {
        console.log("[Firestore] Listener received update from appState/markhub", {
          exists: snapshot.exists(),
          fromCache: snapshot.metadata.fromCache,
          hasPendingWrites: snapshot.metadata.hasPendingWrites,
          updatedAt: snapshot.data()?.updatedAt || null
        });
        onState(snapshot.exists() ? snapshot.data().state : null);
      },
      onError
    );
  },
  async getAppStateOnce() {
    console.log("[Firestore] Reading appState/markhub for Excel export");
    const snapshot = await getDoc(appStateRef);
    console.log("[Firestore] Excel export appState read completed", {
      exists: snapshot.exists(),
      fromCache: snapshot.metadata.fromCache
    });
    return snapshot.exists() ? snapshot.data().state : null;
  },
  async getAllResultsOnce() {
    console.log("[Firestore] Reading all documents from results for Excel export");
    const snapshot = await getDocs(collection(db, "results"));
    const rows = snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));
    console.log("[Firestore] Excel export results collection read completed", {
      count: rows.length
    });
    return rows;
  },
  async saveAppState(state) {
    const payload = {
      state: compactStateForFirestore(state),
      updatedAt: new Date().toISOString()
    };
    await setDoc(appStateRef, payload);
    console.log("[Firestore] Write success to appState/markhub", {
      updatedAt: payload.updatedAt
    });
  },
  async saveSplitMarks(data) {
    const payload = markDocPayload(data);
    await setDoc(splitDocRef(data.session, "marks", payload.markKey), payload, { merge: true });
    console.log("[Firestore] Split marks write success", {
      session: data.session,
      markKey: payload.markKey,
      count: Object.keys(payload.marks || {}).length
    });
  },
  async saveSplitAttendance(data) {
    const payload = attendanceDocPayload(data);
    await setDoc(splitDocRef(data.session, "attendance", payload.attendanceKey), payload, { merge: true });
    console.log("[Firestore] Split attendance write success", {
      session: data.session,
      attendanceKey: payload.attendanceKey,
      count: Object.keys(payload.attendance || {}).length
    });
  },
  async saveSplitMeasurements(data) {
    const payload = measurementsDocPayload(data);
    await setDoc(splitDocRef(data.session, "measurements", payload.attendanceKey), payload, { merge: true });
    console.log("[Firestore] Split measurements write success", {
      session: data.session,
      attendanceKey: payload.attendanceKey,
      count: Object.keys(payload.measurements || {}).length
    });
  },
  async saveSplitClasses(data) {
    const payload = classListDocPayload(data);
    await setDoc(splitDocRef(data.session, "marks", payload.markKey), payload, { merge: true });
    console.log("[Firestore] Split class list write success through marks collection", {
      session: data.session,
      className: payload.className,
      count: payload.students.length
    });
  },
  async saveSplitPublication(data) {
    const collectionName = data.type === "marksheet" ? "publishedMarksheets" : "published";
    const payload = publicationDocPayload(data);
    await setDoc(splitDocRef(data.session, collectionName, payload.key), payload, { merge: true });
    console.log("[Firestore] Split publication write success", {
      session: data.session,
      type: data.type || "result",
      key: payload.key,
      published: Boolean(payload.value)
    });
  },
  async saveStudentProfileRecord(data = {}) {
    const profile = studentProfileDocPayload(data.profile || {});
    const enrolment = studentEnrolmentDocPayload(data.enrolment || {});
    const session = data.session || enrolment.academicSessionId || "2026 - 2027";
    if (!profile.studentId) throw new Error("Student profile is missing studentId.");
    await setDoc(doc(db, "students", profile.studentId), profile, { merge: true });
    await setDoc(doc(db, "academicSessions", splitDocId(session), "enrolments", profile.studentId), {
      ...enrolment,
      academicSessionId: session,
      studentId: profile.studentId
    }, { merge: true });
    console.log("[Firestore] Student profile write success", {
      session,
      studentId: profile.studentId
    });
  },
  async deleteStudentProfileRecord(data = {}) {
    const studentId = String(data.studentId || "").trim();
    const session = data.session || "2026 - 2027";
    if (!studentId) return;
    await deleteDoc(doc(db, "academicSessions", splitDocId(session), "enrolments", studentId));
    await deleteDoc(doc(db, "students", studentId));
    console.log("[Firestore] Student profile delete success", { session, studentId });
  },
  async uploadStudentPhoto(studentId, fileOrBlob) {
    const cleanStudentId = String(studentId || "").trim();
    if (!cleanStudentId || !fileOrBlob) throw new Error("Student photo upload is missing required data.");
    const target = storageRef(storage, `studentPhotos/${cleanStudentId}/profile.webp`);
    await uploadBytes(target, fileOrBlob, { contentType: fileOrBlob.type || "image/webp" });
    return getDownloadURL(target);
  },
  async deleteStudentPhoto(studentId) {
    const cleanStudentId = String(studentId || "").trim();
    if (!cleanStudentId) return;
    await deleteObject(storageRef(storage, `studentPhotos/${cleanStudentId}/profile.webp`));
  },
  listenSplitSession(session, onPatch, onError) {
    const sessionId = splitDocId(session);
    const unsubs = [];
    const listenCollection = (collectionName, mapDoc) => {
      console.log(`[Firestore] Listening to ${splitRootCollection}/${sessionId}/${collectionName}`);
      const unsubscribe = onSnapshot(
        collection(db, splitRootCollection, sessionId, collectionName),
        (snapshot) => {
          const patch = { session, [collectionName]: {} };
          snapshot.docs.forEach((docSnapshot) => {
            const mapped = mapDoc(docSnapshot.data(), docSnapshot.id);
            if (!mapped?.key) return;
            const targetCollection = mapped.targetCollection || collectionName;
            patch[targetCollection] = patch[targetCollection] || {};
            patch[targetCollection][mapped.key] = mapped.value;
            if (collectionName === "attendance" && mapped.term && mapped.workingDays !== undefined) {
              patch.workingDays = patch.workingDays || {};
              patch.workingDays[mapped.term] = mapped.workingDays;
            }
            if (mapped.dataEntryKey) {
              patch.dataEntryUpdates = patch.dataEntryUpdates || {};
              patch.dataEntryUpdates[mapped.dataEntryKey] = mapped.dataEntryUpdate || null;
            }
          });
          console.log(`[Firestore] Split listener received ${collectionName} update`, {
            session,
            count: Object.keys(patch[collectionName]).length,
            fromCache: snapshot.metadata.fromCache,
            hasPendingWrites: snapshot.metadata.hasPendingWrites
          });
          onPatch(patch);
        },
        onError
      );
      unsubs.push(unsubscribe);
    };

    listenCollection("marks", (data, id) => {
      const key = splitDocLabel(data.markKey || id);
      if (data.type === "classList" || key.startsWith(classListMarkKeyPrefix)) {
        return {
          targetCollection: "classes",
          key: data.className || key.slice(classListMarkKeyPrefix.length),
          value: Array.isArray(data.students) ? data.students : []
        };
      }
      return {
        key,
        value: data.marks || {},
        dataEntryKey: data.dataEntryUpdate?.key || "",
        dataEntryUpdate: data.dataEntryUpdate
      };
    });
    listenCollection("attendance", (data, id) => {
      const key = splitDocLabel(data.attendanceKey || id);
      return {
        key,
        value: data.attendance || {},
        term: data.term || termFromSplitKey(key),
        workingDays: data.workingDays,
        dataEntryKey: data.dataEntryUpdate?.key || "",
        dataEntryUpdate: data.dataEntryUpdate
      };
    });
    listenCollection("measurements", (data, id) => ({
      key: splitDocLabel(data.attendanceKey || id),
      value: data.measurements || {},
      dataEntryKey: data.dataEntryUpdate?.key || "",
      dataEntryUpdate: data.dataEntryUpdate
    }));
    listenCollection("published", (data, id) => ({
      key: splitDocLabel(data.key || id),
      value: data.value || null
    }));
    listenCollection("publishedMarksheets", (data, id) => ({
      key: splitDocLabel(data.key || id),
      value: data.value || null
    }));

    const unsubscribeStudents = onSnapshot(
      collection(db, "students"),
      (snapshot) => {
        const patch = { session, studentProfiles: {} };
        snapshot.docs.forEach((docSnapshot) => {
          const data = docSnapshot.data() || {};
          const studentId = String(data.studentId || docSnapshot.id || "").trim();
          if (!studentId) return;
          patch.studentProfiles[studentId] = { ...data, studentId };
        });
        console.log("[Firestore] Student profile listener update", {
          count: Object.keys(patch.studentProfiles).length,
          fromCache: snapshot.metadata.fromCache,
          hasPendingWrites: snapshot.metadata.hasPendingWrites
        });
        onPatch(patch);
      },
      onError
    );
    unsubs.push(unsubscribeStudents);

    const unsubscribeEnrolments = onSnapshot(
      collection(db, "academicSessions", sessionId, "enrolments"),
      (snapshot) => {
        const patch = { session, studentEnrolments: { [session]: {} } };
        snapshot.docs.forEach((docSnapshot) => {
          const data = docSnapshot.data() || {};
          const studentId = String(data.studentId || docSnapshot.id || "").trim();
          if (!studentId) return;
          patch.studentEnrolments[session][studentId] = {
            ...data,
            academicSessionId: session,
            studentId
          };
        });
        console.log("[Firestore] Student enrolment listener update", {
          session,
          count: Object.keys(patch.studentEnrolments[session]).length,
          fromCache: snapshot.metadata.fromCache,
          hasPendingWrites: snapshot.metadata.hasPendingWrites
        });
        onPatch(patch);
      },
      onError
    );
    unsubs.push(unsubscribeEnrolments);

    return () => {
      unsubs.forEach((unsubscribe) => unsubscribe());
    };
  },
  deleteFieldValue() {
    return deleteField();
  },
  async updateAppStateFields(fieldUpdates, fallbackState = null) {
    if (!Array.isArray(fieldUpdates) || fieldUpdates.length === 0) return;

    const updatedAt = new Date().toISOString();
    const validUpdates = fieldUpdates.filter(({ path }) =>
      Array.isArray(path) && path.length > 0 && path.every((segment) => String(segment ?? "").trim() !== ""));
    const updateArgs = [];
    validUpdates.forEach(({ path, value }) => {
      updateArgs.push(
        new FieldPath(...path.map((segment) => String(segment))),
        isFirestoreFieldValue(value) ? value : sanitizeFirestoreValue(value, path)
      );
    });
    updateArgs.push(new FieldPath("updatedAt"), updatedAt);

    try {
      await updateDoc(appStateRef, ...updateArgs);
      console.log("[Firestore] Batched mark field update success to appState/markhub", {
        fields: validUpdates.length,
        updatedAt
      });
    } catch (error) {
      const code = String(error?.code || "").replace(/^firestore\//, "");
      if (code === "invalid-argument" && !fallbackState) {
        console.warn("[Firestore] Batched field update rejected. Retrying one field at a time.", {
          fields: validUpdates.length,
          message: error?.message || ""
        });
        for (const { path, value } of validUpdates) {
          const safeValue = isFirestoreFieldValue(value) ? value : sanitizeFirestoreValue(value, path);
          try {
            await updateDoc(appStateRef, new FieldPath(...path.map((segment) => String(segment))), safeValue);
          } catch (fieldError) {
            console.error("[Firestore] Single field update failed", {
              path: fieldPathLabel(path),
              value: safeValue,
              code: fieldError?.code || "unknown",
              message: fieldError?.message || ""
            });
            fieldError.message = `${fieldError.message || "Firestore field update failed"} Path: ${fieldPathLabel(path)}`;
            throw fieldError;
          }
        }
        await updateDoc(appStateRef, new FieldPath("updatedAt"), updatedAt);
        console.log("[Firestore] Field-by-field update success to appState/markhub", {
          fields: validUpdates.length,
          updatedAt
        });
        return;
      }
      if (shouldRewriteCompactState(error, fallbackState)) {
        console.warn("[Firestore] Rewriting appState/markhub in compact session format", {
          code: error?.code || "unknown"
        });
        await this.saveAppState(fallbackState);
        return;
      }
      throw error;
    }
  }
};

export { app, db, auth };
