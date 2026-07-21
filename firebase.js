import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  FieldPath,
  deleteField
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
const appStateRef = doc(db, "appState", "markhub");
const duplicatedActiveSessionFields = [
  "classes",
  "workingDays",
  "attendance",
  "measurements",
  "marks",
  "published",
  "dataEntryUpdates"
];

function compactStateForFirestore(state = {}) {
  const compactState = sanitizeFirestoreValue({ ...state }, ["state"]);
  duplicatedActiveSessionFields.forEach((field) => delete compactState[field]);
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
    && typeof value._methodName === "string";
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

window.MarkHubFirebase = {
  app,
  db,
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
      updateArgs.push(new FieldPath(...path.map((segment) => String(segment))), value);
    });
    updateArgs.push(new FieldPath("updatedAt"), updatedAt);

    try {
      await updateDoc(appStateRef, ...updateArgs);
      console.log("[Firestore] Batched mark field update success to appState/markhub", {
        fields: validUpdates.length,
        updatedAt
      });
    } catch (error) {
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

export { app, db };
