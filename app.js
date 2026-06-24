const storageKey = "results-desk-state-v1";
const authKey = "markhub-current-user-v1";
const mobileAuthKey = "markhub-mobile-current-user-v1";
const uiKey = "markhub-ui-state-v1";

const users = {
  admin: { password: "admin_#123", role: "admin", name: "Admin" },
  teacher: { password: "teacher123", role: "user", name: "Teacher" }
};

const classNames = [
  "LKG",
  "UKG",
  "Class I",
  "Class II",
  "Class III",
  "Class IV",
  "Class V",
  "Class VI",
  "Class VII",
  "Class VIII",
  "Class IX",
  "Class X"
];

const examNames = [
  "FT Unit Test 1",
  "FT Unit Test 2",
  "CT1",
  "CT2",
  "First Term",
  "ST Unit Test 1",
  "ST Unit Test 2",
  "CT3",
  "CT4",
  "Second Term",
  "Third Term"
];

const examGroups = {
  earlyYears: ["First Term", "Second Term", "Third Term"],
  primaryMiddle: [
    "FT Unit Test 1",
    "FT Unit Test 2",
    "ST Unit Test 1",
    "ST Unit Test 2",
    "First Term",
    "Second Term",
    "Third Term"
  ],
  high: ["CT1", "CT2", "CT3", "CT4", "First Term", "Second Term", "Third Term"]
};

const subjectGroups = {
  lkg: ["Moral", "English", "Alphabets", "Numbers", "Conversation", "Rhymes", "A.E."],
  ukg: ["Moral", "English", "Science", "Numbers", "Mathematics", "A.E."],
  lowerPrimaryRegular: ["Mizo", "English", "Mathematics", "Moral", "A.E."],
  upperPrimaryRegular: ["Mizo", "English", "Hindi", "Mathematics", "E.V.S.", "Moral", "A.E."],
  middleRegular: ["Mizo", "English", "Hindi", "Mathematics", "Science", "Social Science", "Moral", "W.E."],
  lowerPrimaryTerm: activityExamSubjects(["Mizo", "English", "Mathematics", "Moral"], "A.E."),
  upperPrimaryTerm: activityExamSubjects(["Mizo", "English", "Hindi", "Mathematics", "E.V.S.", "Moral"], "A.E."),
  middleTerm: activityExamSubjects(["Mizo", "English", "Hindi", "Mathematics", "Science", "Social Science", "Moral"], "W.E."),
  highContinuous: ["English", "Mizo", "Mathematics", "Science", "Social Science"],
  highTerm: ["English", "Mizo", "Mathematics", "Science", "Social Science", "Moral", "W.E.", "Skill Development"]
};

const termExams = ["First Term", "Second Term", "Third Term"];
const primaryUnitTests = ["FT Unit Test 1", "FT Unit Test 2", "ST Unit Test 1", "ST Unit Test 2"];
const highContinuousTests = ["CT1", "CT2", "CT3", "CT4"];
const highSplitPartSubjects = ["English", "Mathematics", "Social Science"];

const defaultState = {
  academicSession: "2026 - 2027",
  exams: examNames,
  maxMarks: createExamMarks(100),
  passMarks: createExamMarks(33),
  ...createEmptySessionData(),
  sessions: {}
};

let state = loadState();
let activeView = loadSavedUiState().activeView || "entry";
let currentUser = loadCurrentUser();
let editingStudentRoll = null;
let applyingRemoteState = false;
let firebaseStateSyncStarted = false;
let firebaseStateSaveTimer = null;
let firebaseStateSaveRetryTimer = null;
let firebaseStateUnsubscribe = null;
let firebaseStateWriteInFlight = false;
let pendingFirebaseStateJson = "";
let lastSyncedFirebaseStateJson = "";
const firebaseStateSaveDelay = 900;
const unsavedMarkChanges = new Map();
let marksSaveInProgress = false;
let unsavedAttendanceChanges = false;
let attendanceSaveInProgress = false;
let deferredFullStateSaveAfterMarks = false;
const firebaseResultListeners = {
  app: null,
  public: null
};

const els = {
  loginScreen: document.querySelector("#loginScreen"),
  appShell: document.querySelector("#appShell"),
  loginForm: document.querySelector("#loginForm"),
  usernameInput: document.querySelector("#usernameInput"),
  passwordInput: document.querySelector("#passwordInput"),
  publicFirebaseResultSearch: document.querySelector("#publicFirebaseResultSearch"),
  publicFirebaseRollInput: document.querySelector("#publicFirebaseRollInput"),
  publicFirebaseResultStatus: document.querySelector("#publicFirebaseResultStatus"),
  publicFirebaseResultCard: document.querySelector("#publicFirebaseResultCard"),
  publicClearFirebaseResultBtn: document.querySelector("#publicClearFirebaseResultBtn"),
  academicSessionInput: document.querySelector("#academicSessionInput"),
  classSelect: document.querySelector("#classSelect"),
  examSelect: document.querySelector("#examSelect"),
  subjectSelect: document.querySelector("#subjectSelect"),
  mainFilters: document.querySelector("#mainFilters"),
  classField: document.querySelector("#classField"),
  examField: document.querySelector("#examField"),
  subjectField: document.querySelector("#subjectField"),
  workingDaysInput: document.querySelector("#workingDaysInput"),
  saveAttendanceBtn: document.querySelector("#saveAttendanceBtn"),
  clearAttendanceBtn: document.querySelector("#clearAttendanceBtn"),
  attendanceClassSelect: document.querySelector("#attendanceClassSelect"),
  attendanceTermSelect: document.querySelector("#attendanceTermSelect"),
  attendanceBody: document.querySelector("#attendanceBody"),
  studentsClassSelect: document.querySelector("#studentsClassSelect"),
  studentCsvInput: document.querySelector("#studentCsvInput"),
  importStudentsBtn: document.querySelector("#importStudentsBtn"),
  downloadStudentTemplateBtn: document.querySelector("#downloadStudentTemplateBtn"),
  marksCsvInput: document.querySelector("#marksCsvInput"),
  importMarksBtn: document.querySelector("#importMarksBtn"),
  downloadMarksTemplateBtn: document.querySelector("#downloadMarksTemplateBtn"),
  saveMarksBtn: document.querySelector("#saveMarksBtn"),
  entrySaveHint: document.querySelector("#entrySaveHint"),
  marksHead: document.querySelector("#marksHead"),
  marksBody: document.querySelector("#marksBody"),
  studentsBody: document.querySelector("#studentsBody"),
  resultsHead: document.querySelector("#resultsHead"),
  resultsBody: document.querySelector("#resultsBody"),
  resultsTable: document.querySelector(".results-table"),
  resultSummary: document.querySelector("#resultSummary"),
  firebaseResultSearch: document.querySelector("#firebaseResultSearch"),
  firebaseRollInput: document.querySelector("#firebaseRollInput"),
  firebaseResultStatus: document.querySelector("#firebaseResultStatus"),
  firebaseResultCard: document.querySelector("#firebaseResultCard"),
  clearFirebaseResultBtn: document.querySelector("#clearFirebaseResultBtn"),
  marksheetBody: document.querySelector("#marksheetBody"),
  marksheetNameSearchInput: document.querySelector("#marksheetNameSearchInput"),
  printMarksheetsBtn: document.querySelector("#printMarksheetsBtn"),
  marksheetZoomInput: document.querySelector("#marksheetZoomInput"),
  marksheetZoomValue: document.querySelector("#marksheetZoomValue"),
  zoomOutMarksheetBtn: document.querySelector("#zoomOutMarksheetBtn"),
  zoomInMarksheetBtn: document.querySelector("#zoomInMarksheetBtn"),
  printResultsBtn: document.querySelector("#printResultsBtn"),
  printResultsTitle: document.querySelector("#printResultsTitle"),
  resultNotice: document.querySelector("#resultNotice"),
  publishStatus: document.querySelector("#publishStatus"),
  publishMeta: document.querySelector("#publishMeta"),
  publishBtn: document.querySelector("#publishBtn"),
  unpublishBtn: document.querySelector("#unpublishBtn"),
  exportExcelBtn: document.querySelector("#exportExcelBtn"),
  logoutBtn: document.querySelector("#logoutBtn"),
  userBadge: document.querySelector("#userBadge"),
  resetBtn: document.querySelector("#resetBtn"),
  viewTitle: document.querySelector("#viewTitle"),
  toast: document.querySelector("#toast"),
  studentCount: document.querySelector("#studentCount"),
  enteredCount: document.querySelector("#enteredCount"),
  averageMarks: document.querySelector("#averageMarks"),
  highestMarks: document.querySelector("#highestMarks"),
  lowestMarks: document.querySelector("#lowestMarks")
};

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return structuredClone(defaultState);

  try {
    return normalizeState(JSON.parse(saved));
  } catch {
    return structuredClone(defaultState);
  }
}

function normalizeState(existingState = {}) {
  const parsed = { ...structuredClone(defaultState), ...(existingState || {}) };
  parsed.academicSession = currentSessionKey(parsed.academicSession);
  parsed.exams = examNames;
  parsed.maxMarks = normalizeExamMarks(parsed.maxMarks, 100);
  parsed.passMarks = normalizeExamMarks(parsed.passMarks, 33);
  parsed.sessions = normalizeSessions(parsed.sessions);

  const migratedActiveData = normalizeSessionData({
    classes: existingState.classes ?? parsed.classes,
    workingDays: existingState.workingDays ?? parsed.workingDays,
    attendance: existingState.attendance ?? parsed.attendance,
    measurements: existingState.measurements ?? parsed.measurements,
    marks: existingState.marks ?? parsed.marks,
    published: existingState.published ?? parsed.published
  });
  if (!parsed.sessions[parsed.academicSession]) {
    parsed.sessions[parsed.academicSession] = migratedActiveData;
  }
  setActiveSessionData(parsed, parsed.sessions[parsed.academicSession]);
  return parsed;
}

function currentSessionKey(session = defaultState?.academicSession || "2026 - 2027") {
  return String(session || "2026 - 2027").trim() || "2026 - 2027";
}

function createEmptySessionData() {
  return {
    classes: createEmptyClasses(),
    workingDays: createTermMarks(0),
    attendance: {},
    measurements: {},
    marks: {},
    published: {}
  };
}

function normalizeSessionData(data = {}) {
  return {
    classes: normalizeClasses(data.classes),
    workingDays: normalizeTermMarks(data.workingDays, 0),
    attendance: data.attendance || {},
    measurements: data.measurements || {},
    marks: data.marks || {},
    published: data.published || {}
  };
}

function normalizeSessions(sessions = {}) {
  return Object.fromEntries(
    Object.entries(sessions || {}).map(([session, data]) => [currentSessionKey(session), normalizeSessionData(data)])
  );
}

function getActiveSessionData() {
  return normalizeSessionData({
    classes: state.classes,
    workingDays: state.workingDays,
    attendance: state.attendance,
    measurements: state.measurements,
    marks: state.marks,
    published: state.published
  });
}

function setActiveSessionData(targetState, data) {
  const normalizedData = normalizeSessionData(data);
  targetState.classes = normalizedData.classes;
  targetState.workingDays = normalizedData.workingDays;
  targetState.attendance = normalizedData.attendance;
  targetState.measurements = normalizedData.measurements;
  targetState.marks = normalizedData.marks;
  targetState.published = normalizedData.published;
}

function syncActiveSessionData() {
  state.sessions = state.sessions || {};
  state.academicSession = currentSessionKey(state.academicSession);
  state.sessions[state.academicSession] = getActiveSessionData();
}

function switchAcademicSession(nextSession) {
  const previousSession = currentSessionKey(state.academicSession);
  const session = currentSessionKey(nextSession);
  state.sessions = state.sessions || {};
  state.sessions[previousSession] = getActiveSessionData();
  state.academicSession = session;
  if (!state.sessions[session]) {
    state.sessions[session] = createEmptySessionData();
  }
  setActiveSessionData(state, state.sessions[session]);
}

function createEmptyClasses() {
  return Object.fromEntries(classNames.map((className) => [className, []]));
}

function normalizeClasses(existingClasses = {}) {
  return Object.fromEntries(classNames.map((className) => [
    className,
    (existingClasses[className] || []).map(normalizeStudent)
  ]));
}

function normalizeStudent(student) {
  return {
    roll: student.roll,
    idNo: student.idNo || "",
    name: student.name || "",
    dateOfBirth: student.dateOfBirth || "",
    fatherName: student.fatherName || "",
    motherName: student.motherName || "",
    address: student.address || "",
    pen: student.pen || "",
    aadhaarNo: student.aadhaarNo || ""
  };
}

function createExamMarks(defaultValue) {
  return Object.fromEntries(examNames.map((examName) => [examName, defaultValue]));
}

function normalizeExamMarks(existingMarks = {}, defaultValue) {
  return Object.fromEntries(examNames.map((examName) => [examName, existingMarks[examName] ?? defaultValue]));
}

function createTermMarks(defaultValue) {
  return Object.fromEntries(termExams.map((examName) => [examName, defaultValue]));
}

function normalizeTermMarks(existingMarks = {}, defaultValue) {
  return Object.fromEntries(termExams.map((examName) => [examName, existingMarks[examName] ?? defaultValue]));
}

function activityExamSubjects(subjects, finalSubject) {
  return [
    ...subjects.flatMap((subject) => [`${subject} (Activities)`, `${subject} (Exam)`]),
    finalSubject
  ];
}

function saveState() {
  syncActiveSessionData();
  localStorage.setItem(storageKey, JSON.stringify(state));
  if (hasUnsavedLocalChanges()) {
    deferredFullStateSaveAfterMarks = true;
    console.log("[Firestore] App state save deferred until unsaved local changes are saved.");
    return;
  }
  queueFirebaseStateSave();
}

function hasUnsavedMarkChanges() {
  return unsavedMarkChanges.size > 0;
}

function unsavedMarkChangeId(className, exam, subject, roll = "*subject*") {
  return `${className}::${exam}::${subject}::${roll}`;
}

function trackUnsavedMarkChange(className = selectedClass(), exam = selectedExam(), subject = selectedSubject(), roll = null) {
  const key = markKey(className, exam, subject);
  unsavedMarkChanges.set(unsavedMarkChangeId(className, exam, subject, roll), {
    type: "mark",
    session: currentSessionKey(state.academicSession),
    className,
    exam,
    subject,
    markKey: key,
    roll: String(roll)
  });
  syncActiveSessionData();
  refreshMarksSaveControls();
}

function trackSubjectMarksCleared(className = selectedClass(), exam = selectedExam(), subject = selectedSubject()) {
  const key = markKey(className, exam, subject);
  [...unsavedMarkChanges.keys()].forEach((changeId) => {
    if (changeId.startsWith(`${className}::${exam}::${subject}::`)) {
      unsavedMarkChanges.delete(changeId);
    }
  });
  unsavedMarkChanges.set(unsavedMarkChangeId(className, exam, subject), {
    type: "deleteSubject",
    session: currentSessionKey(state.academicSession),
    className,
    exam,
    subject,
    markKey: key
  });
  syncActiveSessionData();
  refreshMarksSaveControls();
}

function refreshMarksSaveControls() {
  if (!els.saveMarksBtn) return;
  const changedCount = unsavedMarkChanges.size;
  els.saveMarksBtn.disabled = marksSaveInProgress || changedCount === 0;
  els.saveMarksBtn.textContent = marksSaveInProgress ? "Saving..." : "Save";
  if (els.entrySaveHint) {
    els.entrySaveHint.textContent = changedCount
      ? `${changedCount} unsaved mark ${changedCount === 1 ? "change" : "changes"}. Click Save.`
      : "Enter marks, then click Save.";
  }
}

function hasUnsavedAttendanceChanges() {
  return unsavedAttendanceChanges;
}

function hasUnsavedLocalChanges() {
  return hasUnsavedMarkChanges() || hasUnsavedAttendanceChanges();
}

function trackUnsavedAttendanceChange() {
  unsavedAttendanceChanges = true;
  syncActiveSessionData();
  refreshAttendanceSaveControls();
}

function refreshAttendanceSaveControls() {
  if (!els.saveAttendanceBtn) return;
  els.saveAttendanceBtn.disabled = attendanceSaveInProgress || !unsavedAttendanceChanges;
  els.saveAttendanceBtn.textContent = attendanceSaveInProgress ? "Saving..." : "Save";
}

async function saveAttendanceData() {
  if (attendanceSaveInProgress) return;
  if (hasUnsavedMarkChanges()) {
    showToast("Save marks before saving attendance.");
    return;
  }
  if (!unsavedAttendanceChanges) {
    showToast("No attendance changes to save.");
    return;
  }

  attendanceSaveInProgress = true;
  refreshAttendanceSaveControls();

  try {
    syncActiveSessionData();
    unsavedAttendanceChanges = false;
    saveState();
    showToast("Attendance saved successfully.");
  } catch (error) {
    unsavedAttendanceChanges = true;
    console.error("[Firestore] Save attendance failed", error);
    showToast("Could not save attendance. Please try again.");
  } finally {
    attendanceSaveInProgress = false;
    refreshAttendanceSaveControls();
  }
}

function buildUnsavedMarkFieldUpdates() {
  const deletes = new Set(
    [...unsavedMarkChanges.values()]
      .filter((change) => change.type === "deleteSubject")
      .map((change) => `${change.session}::${change.markKey}`)
  );
  const updates = [];
  const deleteValue = window.MarkHubFirebase?.deleteFieldValue;

  unsavedMarkChanges.forEach((change) => {
    if (change.type === "deleteSubject") {
      if (!deleteValue) return;
      updates.push(
        { path: ["state", "marks", change.markKey], value: deleteValue() },
        { path: ["state", "sessions", change.session, "marks", change.markKey], value: deleteValue() }
      );
      return;
    }

    if (deletes.has(`${change.session}::${change.markKey}`)) return;
    const value = state.marks?.[change.markKey]?.[change.roll] || { value: "" };
    updates.push(
      { path: ["state", "marks", change.markKey, change.roll], value },
      { path: ["state", "sessions", change.session, "marks", change.markKey, change.roll], value }
    );
  });

  return updates;
}

async function saveAllMarks() {
  if (marksSaveInProgress) return;
  if (!hasUnsavedMarkChanges()) {
    showToast("No mark changes to save.");
    return;
  }

  marksSaveInProgress = true;
  refreshMarksSaveControls();

  try {
    syncActiveSessionData();
    const stateJson = JSON.stringify(state);
    const fieldUpdates = buildUnsavedMarkFieldUpdates();
    const hadPendingFullStateSave = (pendingFirebaseStateJson && pendingFirebaseStateJson !== lastSyncedFirebaseStateJson)
      || deferredFullStateSaveAfterMarks;

    if (window.MarkHubFirebase?.updateAppStateFields && fieldUpdates.length > 0) {
      await window.MarkHubFirebase.updateAppStateFields(fieldUpdates, structuredClone(state));
    } else if (window.MarkHubFirebase?.saveAppState) {
      await window.MarkHubFirebase.saveAppState(structuredClone(state));
    } else {
      throw new Error("Firebase is not ready.");
    }

    localStorage.setItem(storageKey, stateJson);
    if (hadPendingFullStateSave && pendingFirebaseStateJson !== stateJson) {
      deferredFullStateSaveAfterMarks = false;
      queueFirebaseStateSave();
    } else {
      deferredFullStateSaveAfterMarks = false;
      lastSyncedFirebaseStateJson = stateJson;
      if (pendingFirebaseStateJson === stateJson) pendingFirebaseStateJson = "";
    }
    unsavedMarkChanges.clear();
    showToast("Marks saved successfully.");
  } catch (error) {
    console.error("[Firestore] Save marks failed", error);
    showToast("Could not save marks. Please try again.");
  } finally {
    marksSaveInProgress = false;
    refreshMarksSaveControls();
  }
}

function loadSavedUiState() {
  const fallback = { activeView: "entry" };
  const saved = localStorage.getItem(uiKey);
  if (!saved) return fallback;

  try {
    const parsed = JSON.parse(saved);
    const allowedViews = ["entry", "attendance", "results", "marksheet", "students"];
    return {
      ...parsed,
      activeView: allowedViews.includes(parsed.activeView) ? parsed.activeView : "entry"
    };
  } catch {
    return fallback;
  }
}

function saveUiState() {
  if (!els.classSelect) return;
  localStorage.setItem(uiKey, JSON.stringify({
    activeView,
    className: selectedClass(),
    exam: selectedExam(),
    subject: selectedSubject(),
    studentsClass: els.studentsClassSelect?.value || selectedClass(),
    attendanceClass: selectedAttendanceClass(),
    attendanceTerm: selectedAttendanceTerm(),
    marksheetNameSearch: els.marksheetNameSearchInput?.value || ""
  }));
}

function queueFirebaseStateSave() {
  if (applyingRemoteState) return;
  const stateJson = JSON.stringify(state);
  if (stateJson === lastSyncedFirebaseStateJson && !pendingFirebaseStateJson) return;
  pendingFirebaseStateJson = stateJson;
  clearTimeout(firebaseStateSaveTimer);
  firebaseStateSaveTimer = setTimeout(flushFirebaseStateSave, firebaseStateSaveDelay);
}

function flushFirebaseStateSave(force = false) {
  if (applyingRemoteState) return;

  clearTimeout(firebaseStateSaveTimer);
  if (!pendingFirebaseStateJson) return;
  if (pendingFirebaseStateJson === lastSyncedFirebaseStateJson) {
    pendingFirebaseStateJson = "";
    return;
  }
  if (firebaseStateWriteInFlight && !force) return;

  if (!window.MarkHubFirebase?.saveAppState) {
    clearTimeout(firebaseStateSaveRetryTimer);
    firebaseStateSaveRetryTimer = setTimeout(flushFirebaseStateSave, 1000);
    return;
  }

  clearTimeout(firebaseStateSaveRetryTimer);
  const stateJson = pendingFirebaseStateJson;
  let statePayload;
  try {
    statePayload = JSON.parse(stateJson);
  } catch (error) {
    console.error("[Firestore] Could not serialize app state for sync", error);
    return;
  }

  firebaseStateWriteInFlight = true;
  window.MarkHubFirebase.saveAppState(statePayload)
    .then(() => {
      lastSyncedFirebaseStateJson = stateJson;
      if (pendingFirebaseStateJson === stateJson) pendingFirebaseStateJson = "";
      console.log("[Firestore] App state write completed from MarkHub UI.");
    })
    .catch((error) => {
      console.error("[Firestore] App state write failed", error);
      showToast("Could not sync live data to Firestore.");
    })
    .finally(() => {
      firebaseStateWriteInFlight = false;
      if (pendingFirebaseStateJson && pendingFirebaseStateJson !== lastSyncedFirebaseStateJson) {
        firebaseStateSaveTimer = setTimeout(flushFirebaseStateSave, 300);
      }
    });
}

function stopFirebaseStateSync() {
  if (typeof firebaseStateUnsubscribe === "function") firebaseStateUnsubscribe();
  firebaseStateUnsubscribe = null;
  firebaseStateSyncStarted = false;
}

function startFirebaseStateSync(attempt = 0) {
  if (firebaseStateSyncStarted) return;

  if (!window.MarkHubFirebase?.listenAppState || !window.MarkHubFirebase?.saveAppState) {
    if (attempt < 80) {
      setTimeout(() => startFirebaseStateSync(attempt + 1), 250);
    }
    return;
  }

  firebaseStateSyncStarted = true;
  firebaseStateUnsubscribe = window.MarkHubFirebase.listenAppState((remoteState) => {
    console.log("[Firestore] MarkHub UI received appState update.");
    if (hasUnsavedLocalChanges()) {
      console.log("[Firestore] App state update held because the page has unsaved local changes.");
      return;
    }
    if (!remoteState) {
      queueFirebaseStateSave();
      return;
    }

    const uiState = captureUiState();
    applyingRemoteState = true;
    state = normalizeState(remoteState);
    const remoteStateJson = JSON.stringify(state);
    lastSyncedFirebaseStateJson = remoteStateJson;
    if (pendingFirebaseStateJson === remoteStateJson) pendingFirebaseStateJson = "";
    localStorage.setItem(storageKey, remoteStateJson);
    applyRemoteStateToCurrentView(uiState);
    applyingRemoteState = false;
  }, (error) => {
    console.error(error);
    showToast("Live Firestore updates are not available.");
  });
}

function captureUiState() {
  const activeElement = document.activeElement;
  return {
    activeView,
    className: selectedClass(),
    exam: selectedExam(),
    subject: selectedSubject(),
    attendanceClass: selectedAttendanceClass(),
    attendanceTerm: selectedAttendanceTerm(),
    marksheetNameSearch: els.marksheetNameSearchInput?.value || "",
    focusedSelector: getFocusSelector(activeElement),
    selectionStart: activeElement instanceof HTMLInputElement ? activeElement.selectionStart : null,
    selectionEnd: activeElement instanceof HTMLInputElement ? activeElement.selectionEnd : null
  };
}

function getFocusSelector(element) {
  if (!(element instanceof HTMLElement) || !element.id) return "";
  return `#${CSS.escape(element.id)}`;
}

function restoreFocus(uiState) {
  if (!uiState.focusedSelector) return;
  const element = document.querySelector(uiState.focusedSelector);
  if (!(element instanceof HTMLInputElement)) return;
  element.focus({ preventScroll: true });
  if (uiState.selectionStart !== null && uiState.selectionEnd !== null) {
    try {
      element.setSelectionRange(uiState.selectionStart, uiState.selectionEnd);
    } catch {
      // Number inputs do not support selection ranges.
    }
  }
}

function applyRemoteStateToCurrentView(uiState) {
  els.academicSessionInput.value = state.academicSession || "2026 - 2027";
  populateSelect(els.classSelect, Object.keys(state.classes));
  populateSelect(els.studentsClassSelect, Object.keys(state.classes));
  populateSelect(els.attendanceClassSelect, Object.keys(state.classes));
  populateSelect(els.attendanceTermSelect, termExams);

  activeView = uiState.activeView || activeView;
  setSelectValueIfAvailable(els.classSelect, uiState.className);
  setSelectValueIfAvailable(els.attendanceClassSelect, uiState.attendanceClass);
  setSelectValueIfAvailable(els.attendanceTermSelect, uiState.attendanceTerm);
  syncStudentsClassSelect();
  updateExamSelect();
  setSelectValueIfAvailable(els.examSelect, uiState.exam);
  updateSubjectSelect();
  setSelectValueIfAvailable(els.subjectSelect, uiState.subject);
  if (els.marksheetNameSearchInput) {
    els.marksheetNameSearchInput.value = uiState.marksheetNameSearch || "";
  }
  updateAttendanceInputs();

  if (isFocusedEntryMarkInput()) {
    renderPublishStatus();
    syncEntryInputsFromState();
    return;
  }

  renderActiveViewOnly();
  restoreFocus(uiState);
}

function setSelectValueIfAvailable(select, value) {
  if (!select || value === undefined || value === null) return;
  const values = [...select.options].map((option) => option.value);
  if (values.includes(value)) select.value = value;
}

function renderActiveViewOnly() {
  renderPublishStatus();
  if (activeView === "entry") {
    renderEntry();
  } else if (activeView === "attendance") {
    renderAttendance();
  } else if (activeView === "results") {
    renderResults();
  } else if (activeView === "marksheet") {
    renderMarksheets();
  } else if (activeView === "students") {
    renderStudents();
  } else {
    render();
  }
}

function refreshStateControls() {
  const uiState = captureUiState();
  applyRemoteStateToCurrentView(uiState);
}

function loadCurrentUser() {
  const saved = isMobileView()
    ? sessionStorage.getItem(mobileAuthKey)
    : localStorage.getItem(authKey);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved);
    return users[parsed.username] ? parsed : null;
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  currentUser = user;
  if (user) {
    if (isMobileView()) {
      sessionStorage.setItem(mobileAuthKey, JSON.stringify(user));
      localStorage.removeItem(authKey);
    } else {
      localStorage.setItem(authKey, JSON.stringify(user));
      sessionStorage.removeItem(mobileAuthKey);
    }
  } else {
    localStorage.removeItem(authKey);
    sessionStorage.removeItem(mobileAuthKey);
  }
  renderAuth();
}

function isMobileView() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function isAdmin() {
  return currentUser?.role === "admin";
}

function renderAuth() {
  const signedIn = Boolean(currentUser);
  els.loginScreen.classList.toggle("hidden", signedIn);
  els.appShell.classList.toggle("hidden", !signedIn);

  if (!signedIn) {
    stopFirebaseStateSync();
    return;
  }

  startFirebaseStateSync();

  els.userBadge.textContent = `You logged in as ${currentUser.role === "admin" ? "Admin" : "Teacher"}`;
  els.publishBtn.classList.toggle("hidden", !isAdmin());
  els.unpublishBtn.classList.toggle("hidden", !isAdmin());
  els.resetBtn.classList.toggle("hidden", !isAdmin());
  els.exportExcelBtn?.classList.toggle("hidden", !isAdmin());
  els.importMarksBtn.classList.toggle("hidden", !isAdmin());
  els.downloadMarksTemplateBtn.classList.toggle("hidden", !isAdmin());
  els.importStudentsBtn?.classList.toggle("hidden", !isAdmin());
  els.downloadStudentTemplateBtn?.classList.toggle("hidden", !isAdmin());
  els.academicSessionInput.disabled = !isAdmin();
}

function handleLogin(event) {
  event.preventDefault();
  const username = els.usernameInput.value.trim().toLowerCase();
  const password = els.passwordInput.value;
  const account = users[username];

  if (!account || account.password !== password) {
    showToast("Invalid username or password.");
    return;
  }

  saveCurrentUser({ username, role: account.role, name: account.name });
  els.loginForm.reset();
  showToast(`Logged in as ${account.name}.`);
  renderAuth();
  render();
}

function logout() {
  if (hasUnsavedLocalChanges() && !window.confirm("You have unsaved changes. Leave without saving?")) return;
  flushFirebaseStateSave(true);
  stopFirebaseStateSync();
  unsavedMarkChanges.clear();
  unsavedAttendanceChanges = false;
  deferredFullStateSaveAfterMarks = false;
  refreshMarksSaveControls();
  refreshAttendanceSaveControls();
  saveCurrentUser(null);
  showToast("Logged out.");
}

function selectedClass() {
  return els.classSelect.value;
}

function selectedExam() {
  return els.examSelect.value;
}

function selectedSubject() {
  return els.subjectSelect.value;
}

function selectedAttendanceClass() {
  return els.attendanceClassSelect.value;
}

function selectedAttendanceTerm() {
  return els.attendanceTermSelect.value;
}

function examKey(className = selectedClass(), exam = selectedExam()) {
  return `${className}::${exam}`;
}

function markKey(className = selectedClass(), exam = selectedExam(), subject = selectedSubject()) {
  return `${className}::${exam}::${subject}`;
}

function getMaxMarks(className = selectedClass(), exam = selectedExam()) {
  if (isPrimaryUnitTest(className, exam)) return 15;
  if (isHighContinuousTest(className, exam)) return 25;
  if (isHighClass(className) && termExams.includes(exam)) return 100;
  return state.maxMarks[exam] || 100;
}

function getPassMarks(className = selectedClass(), exam = selectedExam()) {
  if (className === "LKG" || className === "UKG") return getSubjectPassMarks(className, exam, selectedSubject());
  if (isPrimaryUnitTest(className, exam)) return 7;
  if (isHighContinuousTest(className, exam)) return 8;
  if (isHighClass(className) && exam === "Third Term" && selectedSubject().endsWith(" (Exam)")) return 26;
  if (isHighClass(className) && termExams.includes(exam)) return 33;
  return state.passMarks[exam] ?? 33;
}

function getSubjectMaxMarks(className = selectedClass(), exam = selectedExam(), subject = selectedSubject()) {
  if (className === "LKG" && (subject === "Rhymes" || subject === "A.E.")) return 50;
  if (className === "UKG" && subject === "A.E.") return 50;
  if (isHighClass(className) && exam === "Third Term" && subject.endsWith(" (Assignment)")) return 2;
  if (isHighClass(className) && exam === "Third Term" && subject.endsWith(" (Exam)")) return 80;
  if (isHighThirdTermNumericSubject(className, exam, subject)) return 80;
  if (isThirdTermWeightedSubject(className, exam, subject)) return 40;
  if (["Class I", "Class II", "Class III", "Class IV", "Class V"].includes(className)
    && exam === "Third Term" && subject === "A.E.") return 50;
  if (["Class VI", "Class VII", "Class VIII"].includes(className) && subject === "W.E.") return 50;
  if (isStructuredTermResult(className, exam)) {
    if (subject.endsWith(" (Activities)")) return 20;
    if (subject.endsWith(" (Exam)") || subject === "A.E.") return 50;
  }
  return getMaxMarks(className, exam);
}

function getSubjectPassMarks(className = selectedClass(), exam = selectedExam(), subject = selectedSubject()) {
  if (className === "LKG" || className === "UKG") {
    return getSubjectMaxMarks(className, exam, subject) === 50 ? 20 : 40;
  }
  return getPassMarks(className, exam);
}

function getMarkWarningLimit(className = selectedClass(), exam = selectedExam(), subject = selectedSubject()) {
  if (isStructuredTermResult(className, exam) && subject.endsWith(" (Activities)")) return 15;
  if (isStructuredTermResult(className, exam) && subject.endsWith(" (Exam)")) return 50;
  if (isPrimaryUnitTest(className, exam)) return 15;
  if (isHighContinuousTest(className, exam)) return 25;
  return getSubjectMaxMarks(className, exam, subject);
}

function isNoPassMarkSubject(className = selectedClass(), exam = selectedExam(), subject = selectedSubject()) {
  return isGradeSubject(subject, className)
    || (isHighClass(className) && exam === "Third Term" && subject.endsWith(" (Assignment)"))
    || (["Class VI", "Class VII", "Class VIII"].includes(className) && subject === "W.E.")
    || (isStructuredTermResult(className, exam)
      && (subject.endsWith(" (Activities)") || subject.endsWith(" (Exam)") || subject === "A.E."));
}

function getWorkingDays(exam = selectedExam()) {
  return state.workingDays[exam] || 0;
}

function isTermExam(exam = selectedExam()) {
  return termExams.includes(exam);
}

function isHighClass(className = selectedClass()) {
  return className === "Class IX" || className === "Class X";
}

function isLkgToClassEight(className = selectedClass()) {
  return !isHighClass(className);
}

function isLkgToClassSeven(className = selectedClass()) {
  return classNames.slice(0, classNames.indexOf("Class VIII")).includes(className);
}

function isClassOneToEight(className = selectedClass()) {
  return ["Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII"].includes(className);
}

function isPrimaryUnitTest(className = selectedClass(), exam = selectedExam()) {
  return ["Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII"].includes(className)
    && primaryUnitTests.includes(exam);
}

function isHighContinuousTest(className = selectedClass(), exam = selectedExam()) {
  return isHighClass(className) && highContinuousTests.includes(exam);
}

function isGradeSubject(subject = selectedSubject(), className = selectedClass()) {
  return (isHighClass(className) && subject === "W.E.")
    || (isHighClass(className) && subject === "Moral")
    || (["Class VI", "Class VII", "Class VIII", "Class IX", "Class X"].includes(className) && subject === "Skill Development");
}

function baseSubjectName(subject = selectedSubject()) {
  return String(subject).replace(/\s+\((Exam|Assignment)\)$/, "");
}

function isSplitPartSubject(subject = selectedSubject(), className = selectedClass()) {
  return isHighClass(className)
    && !String(subject).endsWith(" (Assignment)")
    && highSplitPartSubjects.includes(baseSubjectName(subject));
}

function currentSubjects(className = selectedClass(), exam = selectedExam()) {
  const activityExamTerm = exam === "First Term" || exam === "Second Term";

  if (className === "LKG") return subjectGroups.lkg;
  if (className === "UKG") return subjectGroups.ukg;

  if (className === "Class I" || className === "Class II") {
    const subjects = activityExamTerm ? subjectGroups.lowerPrimaryTerm : subjectGroups.lowerPrimaryRegular;
    return subjects.filter((subject) => subject !== "A.E.");
  }

  if (className === "Class III" || className === "Class IV") {
    const subjects = activityExamTerm ? subjectGroups.upperPrimaryTerm : subjectGroups.upperPrimaryRegular;
    return subjects.filter((subject) => subject !== "A.E.");
  }

  if (className === "Class V") {
    const subjects = activityExamTerm ? subjectGroups.upperPrimaryTerm : subjectGroups.upperPrimaryRegular;
    return subjects.filter((subject) => subject !== "A.E.");
  }

  if (["Class VI", "Class VII", "Class VIII"].includes(className)) {
    const subjects = activityExamTerm ? subjectGroups.middleTerm : subjectGroups.middleRegular;
    const unitTestSubjects = isPrimaryUnitTest(className, exam) ? subjects.filter((subject) => subject !== "W.E.") : subjects;
    return termExams.includes(exam) ? [...unitTestSubjects, "Skill Development"] : unitTestSubjects;
  }

  return highContinuousTests.includes(exam)
    ? subjectGroups.highContinuous
    : subjectGroups.highTerm;
}

function marksEntrySubjects(className = selectedClass(), exam = selectedExam()) {
  const subjects = currentSubjects(className, exam);
  if (!isHighClass(className) || exam !== "Third Term") return subjects;

  return [
    "English (Exam)",
    "English (Assignment)",
    "Mizo (Exam)",
    "Mizo (Assignment)",
    "Mathematics (Exam)",
    "Mathematics (Assignment)",
    "Science (Exam)",
    "Science (Assignment)",
    "Social Science (Exam)",
    "Social Science (Assignment)",
    "Moral",
    "W.E.",
    "Skill Development"
  ];
}

function currentExams(className = selectedClass()) {
  if (className === "LKG" || className === "UKG") return examGroups.earlyYears;
  if (className === "Class IX" || className === "Class X") return examGroups.high;
  return examGroups.primaryMiddle;
}

function markSubjects(className = selectedClass()) {
  return currentSubjects(className).filter((subject) => !isGradeSubject(subject, className));
}

function marksMaximum(subjects = markSubjects(), className = selectedClass(), exam = selectedExam()) {
  return subjects.reduce((sum, subject) => sum + getSubjectMaxMarks(className, exam, subject), 0);
}

function outcomeMarkValues(student, subjects = markSubjects()) {
  return subjects
    .filter((subject) => !isNoPassMarkSubject(selectedClass(), selectedExam(), subject))
    .map((subject) => ({
      value: getStudentMark(student, subject).value,
      passMarks: getSubjectPassMarks(selectedClass(), selectedExam(), subject)
    }));
}

function getStudentMark(student, subject = selectedSubject()) {
  const stored = getStoredStudentMark(student, selectedClass(), selectedExam(), subject);
  if (!isActivitiesSubject(subject, selectedClass(), selectedExam())) return stored;

  const attendanceMarks = getAttendanceMarks(
    getStudentAttendance(student, selectedClass(), selectedExam()),
    getWorkingDays(selectedExam()),
    selectedClass()
  );
  const project = getActivityProjectMark(stored, attendanceMarks);
  return {
    ...stored,
    project,
    attendanceMarks,
    value: project === "" ? "" : Number(project) + attendanceMarks
  };
}

function isActivitiesSubject(subject = selectedSubject(), className = selectedClass(), exam = selectedExam()) {
  return isStructuredTermResult(className, exam) && subject.endsWith(" (Activities)");
}

function getActivityProjectMark(mark, attendanceMarks) {
  if (mark.project !== undefined && mark.project !== null && mark.project !== "") return mark.project;
  if (mark.value === "" || mark.value === undefined || mark.value === null) return "";
  return clamp(Number(mark.value) - attendanceMarks, 0, 15);
}

function getStoredStudentMark(student, className, exam, subject) {
  const subjectMarks = state.marks[markKey(className, exam, subject)] || {};
  const stored = subjectMarks[String(student.roll)] || { value: "" };
  return normalizeSplitPartMark(stored, className, subject);
}

function setStudentMark(roll, patch, options = {}) {
  const className = selectedClass();
  const exam = selectedExam();
  const subject = selectedSubject();
  const key = markKey();
  state.marks[key] = state.marks[key] || {};
  state.marks[key][String(roll)] = { ...(state.marks[key][String(roll)] || {}), ...patch };
  if (options.save === false) {
    trackUnsavedMarkChange(className, exam, subject, roll);
    return;
  }
  saveState();
}

function normalizeSplitPartMark(mark, className = selectedClass(), subject = selectedSubject()) {
  if (!isSplitPartSubject(subject, className)) return mark;
  const partA = mark.partA ?? "";
  const partB = mark.partB ?? "";
  const hasPartMarks = partA !== "" || partB !== "";
  if (!hasPartMarks) return { ...mark, partA, partB, value: mark.value ?? "" };
  return {
    ...mark,
    partA,
    partB,
    value: roundMarkTotal(numericMark(partA) + numericMark(partB))
  };
}

function roundMarkTotal(value) {
  return Math.round(Number(value) * 100) / 100;
}

function attendanceKey(className = selectedClass(), exam = selectedExam()) {
  return `${className}::${exam}`;
}

function getStudentAttendance(student, className = selectedClass(), exam = selectedExam()) {
  const classAttendance = state.attendance[attendanceKey(className, exam)] || {};
  return classAttendance[String(student.roll)] ?? "";
}

function setStudentAttendance(roll, value, className = selectedClass(), exam = selectedExam(), options = {}) {
  const key = attendanceKey(className, exam);
  state.attendance[key] = state.attendance[key] || {};
  state.attendance[key][String(roll)] = value;
  if (options.save === false) {
    trackUnsavedAttendanceChange();
    return;
  }
  saveState();
}

function getAttendanceMarks(attendance, workingDays, className) {
  if (!workingDays || attendance === "") return 0;
  const percentage = (Number(attendance) / Number(workingDays)) * 100;

  if (className === "Class IX" || className === "Class X") {
    if (percentage >= 96) return 3;
    if (percentage >= 86) return 2;
    if (percentage >= 75) return 1;
    return 0;
  }

  if (percentage >= 96) return 5;
  if (percentage >= 91) return 4;
  if (percentage >= 86) return 3;
  if (percentage >= 81) return 2;
  if (percentage >= 75) return 1;
  return 0;
}

function getStudentMeasurement(student, className = selectedClass(), exam = selectedExam()) {
  const classMeasurements = state.measurements[attendanceKey(className, exam)] || {};
  return classMeasurements[String(student.roll)] || { height: "", weight: "" };
}

function setStudentMeasurement(roll, patch, className = selectedClass(), exam = selectedExam(), options = {}) {
  const key = attendanceKey(className, exam);
  state.measurements[key] = state.measurements[key] || {};
  state.measurements[key][String(roll)] = {
    ...(state.measurements[key][String(roll)] || {}),
    ...patch
  };
  if (options.save === false) {
    trackUnsavedAttendanceChange();
    return;
  }
  saveState();
}

function isPublished() {
  return Boolean(state.published[examKey()]);
}

function canViewResult() {
  return isPublished() || isAdmin();
}

function populateSelect(select, options) {
  select.innerHTML = options.map((option) => `<option value="${option}">${option}</option>`).join("");
}

function init() {
  const savedUiState = loadSavedUiState();
  activeView = savedUiState.activeView || activeView;

  els.academicSessionInput.value = state.academicSession || "2026 - 2027";
  populateSelect(els.classSelect, Object.keys(state.classes));
  setSelectValueIfAvailable(els.classSelect, savedUiState.className);
  populateSelect(els.studentsClassSelect, Object.keys(state.classes));
  setSelectValueIfAvailable(els.studentsClassSelect, savedUiState.studentsClass || selectedClass());
  updateExamSelect();
  setSelectValueIfAvailable(els.examSelect, savedUiState.exam);
  updateSubjectSelect();
  setSelectValueIfAvailable(els.subjectSelect, savedUiState.subject);
  populateSelect(els.attendanceClassSelect, Object.keys(state.classes));
  setSelectValueIfAvailable(els.attendanceClassSelect, savedUiState.attendanceClass || selectedClass());
  populateSelect(els.attendanceTermSelect, termExams);
  setSelectValueIfAvailable(els.attendanceTermSelect, savedUiState.attendanceTerm);
  if (els.marksheetNameSearchInput) {
    els.marksheetNameSearchInput.value = savedUiState.marksheetNameSearch || "";
  }
  updateAttendanceInputs();

  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });

  els.classSelect.addEventListener("change", () => {
    syncStudentsClassSelect();
    cancelStudentEdit();
    updateExamSelect();
    updateSubjectSelect();
    saveUiState();
    render();
  });

  els.studentsClassSelect.addEventListener("change", () => {
    els.classSelect.value = els.studentsClassSelect.value;
    cancelStudentEdit();
    updateExamSelect();
    updateSubjectSelect();
    saveUiState();
    render();
  });

  els.examSelect.addEventListener("change", () => {
    updateSubjectSelect();
    saveUiState();
    render();
  });

  els.subjectSelect.addEventListener("change", () => {
    saveUiState();
    render();
  });

  els.workingDaysInput.addEventListener("change", () => {
    const value = Number(els.workingDaysInput.value);
    state.workingDays[selectedAttendanceTerm()] = Number.isFinite(value) && value >= 0 ? value : 0;
    trackUnsavedAttendanceChange();
    renderAttendance();
  });
  els.saveAttendanceBtn?.addEventListener("click", saveAttendanceData);
  els.clearAttendanceBtn.addEventListener("click", clearAttendanceData);

  els.academicSessionInput.addEventListener("change", () => {
    if (!isAdmin()) return;
    switchAcademicSession(els.academicSessionInput.value);
    els.academicSessionInput.value = state.academicSession;
    saveState();
    cancelStudentEdit();
    render();
  });

  els.attendanceClassSelect.addEventListener("change", () => {
    saveUiState();
    renderAttendance();
  });
  els.attendanceTermSelect.addEventListener("change", () => {
    updateAttendanceInputs();
    saveUiState();
    renderAttendance();
  });

  els.loginForm.addEventListener("submit", handleLogin);
  els.publicFirebaseResultSearch?.addEventListener("submit", searchPublicFirebaseResult);
  els.publicClearFirebaseResultBtn?.addEventListener("click", clearPublicFirebaseResultSearch);
  els.logoutBtn.addEventListener("click", logout);
  els.publishBtn.addEventListener("click", publishCurrentResult);
  els.unpublishBtn.addEventListener("click", unpublishCurrentResult);
  document.querySelector("#exportBtn").addEventListener("click", exportCsv);
  els.exportExcelBtn?.addEventListener("click", exportExcelFromFirestore);
  document.querySelector("#resetBtn").addEventListener("click", resetDemo);
  document.querySelector("#clearMarksBtn").addEventListener("click", clearMarks);
  els.saveMarksBtn?.addEventListener("click", saveAllMarks);
  document.querySelector("#studentForm").addEventListener("submit", addStudent);
  document.querySelector("#cancelStudentEditBtn").addEventListener("click", cancelStudentEdit);
  els.importStudentsBtn.addEventListener("click", () => els.studentCsvInput.click());
  els.studentCsvInput.addEventListener("change", importStudentsCsv);
  els.downloadStudentTemplateBtn.addEventListener("click", downloadStudentCsvTemplate);
  els.importMarksBtn.addEventListener("click", () => els.marksCsvInput.click());
  els.marksCsvInput.addEventListener("change", importMarksCsv);
  els.downloadMarksTemplateBtn.addEventListener("click", downloadMarksCsvTemplate);
  els.printMarksheetsBtn.addEventListener("click", printMarksheets);
  els.printResultsBtn.addEventListener("click", printResults);
  els.firebaseResultSearch?.addEventListener("submit", searchFirebaseResult);
  els.clearFirebaseResultBtn?.addEventListener("click", clearFirebaseResultSearch);
  els.marksheetNameSearchInput?.addEventListener("input", () => {
    saveUiState();
    renderMarksheets();
  });
  els.marksheetZoomInput.addEventListener("input", updateMarksheetZoom);
  els.zoomOutMarksheetBtn.addEventListener("click", () => stepMarksheetZoom(-10));
  els.zoomInMarksheetBtn.addEventListener("click", () => stepMarksheetZoom(10));
  document.addEventListener("keydown", handleEnterAsTab);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushFirebaseStateSave(true);
      stopFirebaseStateSync();
    } else if (currentUser) {
      startFirebaseStateSync();
    }
  });
  window.addEventListener("beforeunload", (event) => {
    if (hasUnsavedLocalChanges()) {
      event.preventDefault();
      event.returnValue = "";
      return "";
    }
    flushFirebaseStateSave(true);
    return undefined;
  });
  updateMarksheetZoom();
  renderAuth();

  render();
}

function updateMarksheetZoom() {
  const zoom = clamp(Number(els.marksheetZoomInput.value), 50, 150);
  els.marksheetZoomInput.value = zoom;
  els.marksheetZoomValue.value = `${zoom}%`;
  els.marksheetBody.style.setProperty("--marksheet-zoom", zoom / 100);
}

function stepMarksheetZoom(amount) {
  els.marksheetZoomInput.value = clamp(Number(els.marksheetZoomInput.value) + amount, 50, 150);
  updateMarksheetZoom();
}

function updateSubjectSelect() {
  const previousSubject = selectedSubject();
  const subjects = marksEntrySubjects();
  populateSelect(els.subjectSelect, subjects);
  if (subjects.includes(previousSubject)) {
    els.subjectSelect.value = previousSubject;
  }
}

function updateExamSelect() {
  const previousExam = selectedExam();
  const exams = activeView === "marksheet" ? termExams : currentExams();
  populateSelect(els.examSelect, exams);
  if (exams.includes(previousExam)) {
    els.examSelect.value = previousExam;
  }
}

function updateAttendanceInputs() {
  els.workingDaysInput.value = state.workingDays[selectedAttendanceTerm()] ?? 0;
}

function syncStudentsClassSelect() {
  if (els.studentsClassSelect) els.studentsClassSelect.value = selectedClass();
}

function handleEnterAsTab(event) {
  if (!["Enter", "Tab"].includes(event.key) || event.isComposing) return;
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type === "hidden") return;
  if (!target.closest("#entryView.active, #attendanceView.active, #studentsView.active")) return;
  const direction = event.shiftKey ? -1 : 1;

  const fields = [...document.querySelectorAll(
    "#entryView.active input:not([type='hidden']), #attendanceView.active input:not([type='hidden']), #studentsView.active input:not([type='hidden'])"
  )].filter((field) => !field.disabled && !field.readOnly && field.offsetParent !== null);
  const currentIndex = fields.indexOf(target);
  if (currentIndex === -1) return;

  event.preventDefault();
  const verticalField = getVerticalEnterTarget(target, direction);
  const nextField = verticalField || fields[clamp(currentIndex + direction, 0, fields.length - 1)];
  if (isEntryMarkInput(target)) {
    target.dispatchEvent(new Event("input", { bubbles: true }));
    if (nextField instanceof HTMLInputElement) {
      nextField.focus({ preventScroll: true });
      nextField.select?.();
    }
    return;
  }

  const restoreSelector = getInputRestoreSelector(nextField);
  target.dispatchEvent(new Event("change", { bubbles: true }));
  setTimeout(() => {
    const field = restoreSelector ? document.querySelector(restoreSelector) : nextField;
    if (field instanceof HTMLInputElement) {
      field.focus({ preventScroll: true });
      field.select?.();
    }
  }, 0);
}

function getVerticalEnterTarget(input, direction = 1) {
  const selector = getVerticalEnterSelector(input);
  if (!selector) return null;
  const fields = [...document.querySelectorAll(selector)]
    .filter((field) => field instanceof HTMLInputElement && !field.disabled && !field.readOnly && field.offsetParent !== null);
  const currentIndex = fields.indexOf(input);
  return currentIndex === -1 ? null : fields[clamp(currentIndex + direction, 0, fields.length - 1)] || null;
}

function getVerticalEnterSelector(input) {
  if (input.dataset.partRoll !== undefined) {
    return `#entryView.active [data-part-key="${CSS.escape(input.dataset.partKey || "")}"]`;
  }
  if (input.dataset.attendanceRoll !== undefined) return "#attendanceView.active [data-attendance-roll]";
  if (input.dataset.heightRoll !== undefined) return "#attendanceView.active [data-height-roll]";
  if (input.dataset.weightRoll !== undefined) return "#attendanceView.active [data-weight-roll]";
  return "";
}

function getInputRestoreSelector(input) {
  if (!(input instanceof HTMLInputElement)) return "";
  if (input.dataset.partRoll !== undefined) {
    return `[data-part-roll="${CSS.escape(input.dataset.partRoll)}"][data-part-key="${CSS.escape(input.dataset.partKey || "")}"]`;
  }
  const dataKeys = [
    "roll",
    "projectRoll",
    "gradeRoll",
    "attendanceRoll",
    "heightRoll",
    "weightRoll"
  ];
  const key = dataKeys.find((name) => input.dataset[name] !== undefined);
  if (key) {
    const attr = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    return `[data-${attr}="${CSS.escape(input.dataset[key])}"]`;
  }
  return input.id ? `#${CSS.escape(input.id)}` : "";
}

function switchView(view) {
  activeView = view;
  updateExamSelect();
  updateSubjectSelect();
  saveUiState();
  render();
}

function renderActiveViewChrome() {
  document.body.classList.toggle("entry-active", activeView === "entry");
  document.body.classList.toggle("attendance-active", activeView === "attendance");
  document.body.classList.toggle("results-active", activeView === "results");
  document.body.classList.toggle("students-active", activeView === "students");
  document.body.classList.toggle("marksheet-active", activeView === "marksheet");
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === activeView));
  document.querySelectorAll(".view").forEach((panel) => panel.classList.toggle("active", panel.id === `${activeView}View`));
  const titles = {
    entry: "Marks Entry",
    attendance: "Attendance and Physical Measurement",
    results: "Results",
    marksheet: "Marksheets",
    students: "Students"
  };
  els.viewTitle.textContent = titles[activeView] || "Marks Entry";
}

function render() {
  renderViewFilters();
  renderPublishStatus();
  renderEntry();
  renderAttendance();
  renderResults();
  renderMarksheets();
  renderStudents();
}

function renderViewFilters() {
  renderActiveViewChrome();
  syncStudentsClassSelect();
  const showMainFilters = activeView !== "attendance" && activeView !== "students";
  els.mainFilters.classList.toggle("hidden", !showMainFilters);
  els.classField.classList.toggle("hidden", !showMainFilters);
  els.examField.classList.toggle("hidden", activeView === "students" || !showMainFilters);
  els.subjectField.classList.toggle("hidden", activeView !== "entry");
}

function renderPublishStatus() {
  const status = isPublished();
  els.publishStatus.textContent = status ? "Published" : isAdmin() ? "Admin preview" : "Not published";
  els.publishMeta.textContent = isAdmin()
    ? status
      ? `${selectedClass()} - ${selectedExam()}`
      : `${selectedClass()} - ${selectedExam()} | Visible to admin only`
    : `${selectedClass()} - ${selectedExam()} | Admin only`;
  els.publishBtn.classList.toggle("hidden", !isAdmin());
  els.unpublishBtn.classList.toggle("hidden", !isAdmin());
}

function renderEntry() {
  const students = sortedStudents();
  const maxMarks = getSubjectMaxMarks();
  const passMarks = getPassMarks();
  const gradeSubject = isGradeSubject();
  const activitiesSubject = isActivitiesSubject();
  const splitPartSubject = isSplitPartSubject();
  const noPassMark = isNoPassMarkSubject();
  let entered = 0;
  let total = 0;
  let highest = 0;
  let lowest = Infinity;

  els.marksHead.innerHTML = activitiesSubject
    ? `<th>Roll No.</th>
      <th>Student Name</th>
      <th>Project, Assign., Book Maintenance</th>
      <th>Attendance Marks</th>
      <th>Marks / Grade</th>
      <th>Status</th>`
    : splitPartSubject
      ? `<th>Roll No.</th>
        <th>Student Name</th>
        <th>Part A</th>
        <th>Part B</th>
        <th>Marks / Grade</th>
        <th>Status</th>`
    : `<th>Roll No.</th><th>Student Name</th><th>Marks / Grade</th><th>Status</th>`;

  els.marksBody.innerHTML = students.map((student, index) => {
    const mark = getStudentMark(student);
    const value = mark.value ?? "";
    const numericValue = Number(value);
    const hasNumber = !gradeSubject && value !== "" && !Number.isNaN(numericValue);
    const status = gradeSubject
      ? getGradeStatus(value)
      : noPassMark
        ? { label: value === "" ? "Pending" : "Entered", className: value === "" ? "" : "pass" }
        : getStatus(value, passMarks);

    if (hasNumber) {
      entered += 1;
      total += numericValue;
      highest = Math.max(highest, numericValue);
      lowest = Math.min(lowest, numericValue);
    } else if (gradeSubject && value !== "") {
      entered += 1;
    }

    return `
      <tr>
        <td>${student.roll}</td>
        <td>${escapeHtml(student.name)}</td>
        ${activitiesSubject
          ? `<td><input class="mark-input activity-project-input" type="number" inputmode="decimal" enterkeyhint="next" min="0" max="15" step="0.01" tabindex="${index + 1}"
                value="${escapeAttr(mark.project ?? "")}" data-project-roll="${student.roll}"
                aria-label="Project, assignment, and book maintenance marks for ${escapeAttr(student.name)}"></td>
            <td><strong>${mark.attendanceMarks}</strong></td>
            <td><output class="calculated-mark">${value === "" ? "-" : escapeHtml(value)}</output></td>`
          : splitPartSubject
            ? `<td><input class="mark-input split-part-input" type="number" inputmode="decimal" enterkeyhint="next" min="0" max="${maxMarks}" step="0.01" tabindex="${index + 1}"
                value="${escapeAttr(mark.partA ?? "")}" data-part-roll="${student.roll}" data-part-key="partA"
                aria-label="Part A marks for ${escapeAttr(student.name)}"></td>
            <td><input class="mark-input split-part-input" type="number" inputmode="decimal" enterkeyhint="next" min="0" max="${maxMarks}" step="0.01" tabindex="${students.length + index + 1}"
                value="${escapeAttr(mark.partB ?? "")}" data-part-roll="${student.roll}" data-part-key="partB"
                aria-label="Part B marks for ${escapeAttr(student.name)}"></td>
            <td><output class="calculated-mark">${value === "" ? "-" : escapeHtml(value)}</output></td>`
          : `<td>
          ${gradeSubject
            ? `<input class="mark-input" type="text" maxlength="1" tabindex="${index + 1}" value="${escapeAttr(value)}" data-grade-roll="${student.roll}" aria-label="Grade for ${escapeAttr(student.name)}">`
            : `<input class="mark-input" type="number" inputmode="decimal" enterkeyhint="next" min="0" max="${maxMarks}" step="0.01" tabindex="${index + 1}"
                value="${value}" data-roll="${student.roll}" aria-label="Marks for ${escapeAttr(student.name)}">`}
        </td>`}
        <td><span class="status-pill ${status.className}">${status.label}</span></td>
      </tr>
    `;
  }).join("");

  els.studentCount.textContent = students.length;
  els.enteredCount.textContent = entered;
  els.averageMarks.textContent = gradeSubject ? "Grade" : entered ? `${Math.round((total / (entered * maxMarks)) * 100)}%` : "0%";
  els.highestMarks.textContent = gradeSubject ? "-" : entered ? `${highest}/${maxMarks}` : "0";
  els.lowestMarks.textContent = gradeSubject ? "-" : entered ? `${lowest}/${maxMarks}` : "0";
  refreshMarksSaveControls();

  document.querySelectorAll("[data-roll]").forEach((input) => {
    input.addEventListener("input", () => saveEntryInputInPlace(input));
    input.addEventListener("change", () => saveEntryInputInPlace(input, { showWarning: true }));
  });

  document.querySelectorAll("[data-project-roll]").forEach((input) => {
    input.addEventListener("input", () => saveEntryInputInPlace(input));
    input.addEventListener("change", () => saveEntryInputInPlace(input, { showWarning: true }));
  });

  document.querySelectorAll("[data-part-roll]").forEach((input) => {
    input.addEventListener("input", () => saveEntryInputInPlace(input));
    input.addEventListener("change", () => saveEntryInputInPlace(input, { showWarning: true }));
  });

  document.querySelectorAll("[data-grade-roll]").forEach((input) => {
    input.addEventListener("input", () => saveEntryInputInPlace(input));
    input.addEventListener("change", () => saveEntryInputInPlace(input, { showWarning: true }));
  });

}

function isEntryMarkInput(input) {
  return input instanceof HTMLInputElement
    && Boolean(input.closest("#entryView.active"))
    && (input.dataset.roll !== undefined
      || input.dataset.projectRoll !== undefined
      || input.dataset.partRoll !== undefined
      || input.dataset.gradeRoll !== undefined);
}

function isFocusedEntryMarkInput() {
  return isEntryMarkInput(document.activeElement);
}

function normalizeNumberInputValue(input, limit, showWarning, message) {
  const rawValue = input.value.trim();
  if (rawValue === "") return "";
  const numericValue = Number(rawValue);
  if (!Number.isFinite(numericValue)) return "";
  if (numericValue > limit) {
    if (showWarning || input.dataset.warnedLimit !== String(limit)) {
      showToast(message);
      input.dataset.warnedLimit = String(limit);
    }
    input.value = "";
    return "";
  }
  delete input.dataset.warnedLimit;
  const value = clamp(numericValue, 0, limit);
  if (!showWarning) return rawValue;
  input.value = value;
  return value;
}

function saveEntryInputInPlace(input, options = {}) {
  const { showWarning = false } = options;
  if (input.dataset.roll !== undefined) {
    const limit = getMarkWarningLimit();
    const value = normalizeNumberInputValue(input, limit, showWarning, `Entry value is higher than the limit of ${limit} for ${selectedSubject()}.`);
    setStudentMark(input.dataset.roll, { value }, { save: false });
    updateEntryRow(input);
    return;
  }

  if (input.dataset.projectRoll !== undefined) {
    const project = normalizeNumberInputValue(input, 15, showWarning, "Entry value is higher than the limit of 15 for Project, Assign., Book Maintenance.");
    const student = { roll: input.dataset.projectRoll };
    const attendanceMarks = getAttendanceMarks(
      getStudentAttendance(student),
      getWorkingDays(),
      selectedClass()
    );
    setStudentMark(input.dataset.projectRoll, {
      project,
      value: project === "" ? "" : Number(project) + attendanceMarks
    }, { save: false });
    updateEntryRow(input);
    return;
  }

  if (input.dataset.partRoll !== undefined) {
    saveSplitPartInput(input, showWarning);
    updateEntryRow(input);
    return;
  }

  if (input.dataset.gradeRoll !== undefined) {
    const value = input.value.trim().toUpperCase().slice(0, 1);
    if (value && !["A", "B", "C", "D", "E"].includes(value)) {
      if (showWarning) showToast("Enter grade A, B, C, D, or E.");
      input.value = "";
      setStudentMark(input.dataset.gradeRoll, { value: "" }, { save: false });
    } else {
      input.value = value;
      setStudentMark(input.dataset.gradeRoll, { value }, { save: false });
    }
    updateEntryRow(input);
  }
}

function saveSplitPartInput(input, showWarning = false) {
  const row = input.closest("tr");
  const partKey = input.dataset.partKey;
  const otherKey = partKey === "partA" ? "partB" : "partA";
  const otherInput = row?.querySelector(`[data-part-key="${otherKey}"]`);
  const limit = getMarkWarningLimit();
  let partA = partKey === "partA" ? input.value.trim() : otherInput?.value.trim() || "";
  let partB = partKey === "partB" ? input.value.trim() : otherInput?.value.trim() || "";

  const currentValue = partKey === "partA" ? partA : partB;
  const currentNumber = Number(currentValue);
  const otherValue = partKey === "partA" ? partB : partA;
  const otherNumber = numericMark(otherValue);

  if (currentValue !== "" && !Number.isFinite(currentNumber)) return;

  if (currentNumber < 0) {
    input.value = "0";
    if (partKey === "partA") partA = "0";
    if (partKey === "partB") partB = "0";
  }

  if (currentValue !== "" && currentNumber + otherNumber > limit) {
    if (showWarning || input.dataset.warnedLimit !== String(limit)) {
      showToast(`Entry value is higher than the limit of ${limit} for ${selectedSubject()}.`);
      input.dataset.warnedLimit = String(limit);
    }
    input.value = "";
    if (partKey === "partA") partA = "";
    if (partKey === "partB") partB = "";
  } else {
    delete input.dataset.warnedLimit;
  }

  const hasPartMarks = partA !== "" || partB !== "";
  setStudentMark(input.dataset.partRoll, {
    partA,
    partB,
    value: hasPartMarks ? roundMarkTotal(numericMark(partA) + numericMark(partB)) : ""
  }, { save: false });
}

function updateEntryRow(input) {
  const row = input.closest("tr");
  if (!row) return;
  const roll = input.dataset.roll || input.dataset.projectRoll || input.dataset.partRoll || input.dataset.gradeRoll;
  const mark = getStudentMark({ roll });
  const value = mark.value ?? "";
  const gradeSubject = isGradeSubject();
  const noPassMark = isNoPassMarkSubject();
  const passMarks = getPassMarks();
  const status = gradeSubject
    ? getGradeStatus(value)
    : noPassMark
      ? { label: value === "" ? "Pending" : "Entered", className: value === "" ? "" : "pass" }
      : getStatus(value, passMarks);
  const statusPill = row.querySelector(".status-pill");
  if (statusPill) {
    statusPill.className = `status-pill ${status.className}`.trim();
    statusPill.textContent = status.label;
  }
  const calculatedMark = row.querySelector(".calculated-mark");
  if (calculatedMark) calculatedMark.textContent = value === "" ? "-" : value;
  updateEntrySummaryFromState();
}

function updateEntrySummaryFromState() {
  const students = sortedStudents();
  const maxMarks = getSubjectMaxMarks();
  const gradeSubject = isGradeSubject();
  let entered = 0;
  let total = 0;
  let highest = 0;
  let lowest = Infinity;

  students.forEach((student) => {
    const value = getStudentMark(student).value ?? "";
    const numericValue = Number(value);
    if (!gradeSubject && value !== "" && !Number.isNaN(numericValue)) {
      entered += 1;
      total += numericValue;
      highest = Math.max(highest, numericValue);
      lowest = Math.min(lowest, numericValue);
    } else if (gradeSubject && value !== "") {
      entered += 1;
    }
  });

  els.enteredCount.textContent = entered;
  els.averageMarks.textContent = gradeSubject ? "Grade" : entered ? `${Math.round((total / (entered * maxMarks)) * 100)}%` : "0%";
  els.highestMarks.textContent = gradeSubject ? "-" : entered ? `${highest}/${maxMarks}` : "0";
  els.lowestMarks.textContent = gradeSubject ? "-" : entered ? `${lowest}/${maxMarks}` : "0";
}

function syncEntryInputsFromState() {
  document.querySelectorAll("#entryView [data-roll], #entryView [data-project-roll], #entryView [data-part-roll], #entryView [data-grade-roll]").forEach((input) => {
    if (!(input instanceof HTMLInputElement) || input === document.activeElement) return;
    const roll = input.dataset.roll || input.dataset.projectRoll || input.dataset.partRoll || input.dataset.gradeRoll;
    const mark = getStudentMark({ roll });
    if (input.dataset.projectRoll !== undefined) {
      input.value = mark.project ?? "";
    } else if (input.dataset.partRoll !== undefined) {
      input.value = mark[input.dataset.partKey] ?? "";
    } else {
      input.value = mark.value ?? "";
    }
    updateEntryRow(input);
  });
  updateEntrySummaryFromState();
}

function renderAttendance() {
  const className = selectedAttendanceClass();
  const term = selectedAttendanceTerm();
  const students = [...(state.classes[className] || [])].sort((a, b) => a.roll - b.roll);
  const workingDays = getWorkingDays(term);

  els.attendanceBody.innerHTML = students.map((student, index) => {
    const attendance = getStudentAttendance(student, className, term);
    const measurement = getStudentMeasurement(student, className, term);
    const previousTerm = getPreviousTerm(term);
    const previousHeight = previousTerm ? getStudentMeasurement(student, className, previousTerm).height : "";
    const attendanceMarks = getAttendanceMarks(attendance, workingDays, className);

    return `
      <tr>
        <td>${student.roll}</td>
        <td>${escapeHtml(student.name)}</td>
        <td><input class="mark-input" type="number" inputmode="numeric" enterkeyhint="next" min="0" max="${workingDays}" step="1" tabindex="${index + 1}"
          value="${attendance}" data-attendance-roll="${student.roll}" aria-label="Attendance for ${escapeAttr(student.name)}"></td>
        <td><strong>${attendanceMarks}</strong></td>
        <td><input class="mark-input" type="number" inputmode="decimal" enterkeyhint="next" min="${previousHeight === "" ? 0 : previousHeight}" step="0.1" tabindex="${students.length + index + 1}"
          value="${measurement.height}" data-height-roll="${student.roll}" aria-label="Height for ${escapeAttr(student.name)}"></td>
        <td><input class="mark-input" type="number" inputmode="decimal" enterkeyhint="next" min="0" step="0.1" tabindex="${(students.length * 2) + index + 1}"
          value="${measurement.weight}" data-weight-roll="${student.roll}" aria-label="Weight for ${escapeAttr(student.name)}"></td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll("[data-attendance-roll]").forEach((input) => {
    input.addEventListener("change", () => {
      const value = input.value === "" ? "" : clamp(Number(input.value), 0, getWorkingDays(term));
      input.value = value;
      setStudentAttendance(input.dataset.attendanceRoll, value, className, term, { save: false });
      renderAttendance();
    });
  });

  document.querySelectorAll("[data-height-roll]").forEach((input) => {
    input.addEventListener("change", () => {
      const previousTerm = getPreviousTerm(term);
      const previousHeight = previousTerm
        ? getStudentMeasurement({ roll: input.dataset.heightRoll }, className, previousTerm).height
        : "";
      if (input.value !== "" && previousHeight !== "" && Number(input.value) < Number(previousHeight)) {
        showToast(`Height cannot be less than the ${previousTerm} height (${previousHeight} cm).`);
        input.value = getStudentMeasurement({ roll: input.dataset.heightRoll }, className, term).height;
        return;
      }
      setStudentMeasurement(input.dataset.heightRoll, { height: input.value }, className, term, { save: false });
    });
  });

  document.querySelectorAll("[data-weight-roll]").forEach((input) => {
    input.addEventListener("change", () => {
      setStudentMeasurement(input.dataset.weightRoll, { weight: input.value }, className, term, { save: false });
    });
  });

  refreshAttendanceSaveControls();
}

function clearAttendanceData() {
  const className = selectedAttendanceClass();
  const term = selectedAttendanceTerm();
  if (!window.confirm(`Clear attendance, height, and weight data for ${className} ${term}?`)) return;
  const key = attendanceKey(className, term);
  delete state.attendance[key];
  delete state.measurements[key];
  trackUnsavedAttendanceChange();
  renderAttendance();
  showToast(`${className} ${term} attendance data cleared. Click Save to save.`);
}

function getPreviousTerm(term) {
  if (term === "Second Term") return "First Term";
  if (term === "Third Term") return "Second Term";
  return "";
}

async function searchFirebaseResult(event) {
  return searchFirebaseResultWithControls(event, {
    listenerKey: "app",
    input: els.firebaseRollInput,
    status: els.firebaseResultStatus,
    card: els.firebaseResultCard
  });
}

async function searchPublicFirebaseResult(event) {
  return searchFirebaseResultWithControls(event, {
    listenerKey: "public",
    input: els.publicFirebaseRollInput,
    status: els.publicFirebaseResultStatus,
    card: els.publicFirebaseResultCard
  });
}

async function searchFirebaseResultWithControls(event, controls) {
  event.preventDefault();
  const roll = controls.input.value.trim();

  if (!roll) {
    setFirebaseResultStatus(controls.status, "Enter a roll number.", "error");
    controls.card.classList.add("hidden");
    return;
  }

  if (!window.MarkHubFirebase?.listenResultByRoll) {
    setFirebaseResultStatus(controls.status, "Firebase is not ready. Check internet connection.", "error");
    controls.card.classList.add("hidden");
    return;
  }

  stopFirebaseResultListener(controls.listenerKey);
  setFirebaseResultStatus(controls.status, "Listening for live result...", "");
  controls.card.classList.add("hidden");

  try {
    firebaseResultListeners[controls.listenerKey] = window.MarkHubFirebase.listenResultByRoll(
      roll,
      (result) => {
        if (!result) {
          setFirebaseResultStatus(controls.status, `No result found for Roll No. ${roll}.`, "error");
          controls.card.classList.add("hidden");
          return;
        }

        renderFirebaseResult(result, controls.card);
        setFirebaseResultStatus(controls.status, `Live result loaded for Roll No. ${roll}.`, "success");
      },
      (error) => {
        console.error(error);
        setFirebaseResultStatus(controls.status, "Could not load live result from Firestore.", "error");
        controls.card.classList.add("hidden");
      }
    );
  } catch (error) {
    console.error(error);
    setFirebaseResultStatus(controls.status, "Could not load result from Firestore.", "error");
  }
}

function clearFirebaseResultSearch() {
  clearFirebaseResultControls({
    listenerKey: "app",
    input: els.firebaseRollInput,
    status: els.firebaseResultStatus,
    card: els.firebaseResultCard
  });
}

function clearPublicFirebaseResultSearch() {
  clearFirebaseResultControls({
    listenerKey: "public",
    input: els.publicFirebaseRollInput,
    status: els.publicFirebaseResultStatus,
    card: els.publicFirebaseResultCard
  });
}

function clearFirebaseResultControls(controls) {
  stopFirebaseResultListener(controls.listenerKey);
  controls.input.value = "";
  controls.status.textContent = "";
  controls.status.className = "firebase-result-status";
  controls.card.innerHTML = "";
  controls.card.classList.add("hidden");
}

function stopFirebaseResultListener(listenerKey) {
  if (!listenerKey || typeof firebaseResultListeners[listenerKey] !== "function") return;
  firebaseResultListeners[listenerKey]();
  firebaseResultListeners[listenerKey] = null;
}

function setFirebaseResultStatus(statusElement, message, type) {
  statusElement.textContent = message;
  statusElement.className = `firebase-result-status ${type || ""}`.trim();
}

function renderFirebaseResult(result, cardElement = els.firebaseResultCard) {
  const fields = ["Name", "Class", "Percentage", "Division"];
  const title = result.Name || `Roll No. ${result.id}`;

  cardElement.innerHTML = `
    <div class="firebase-result-card-head">
      <div>
        <span>Firestore Result</span>
        <h4>${escapeHtml(title)}</h4>
      </div>
      <strong>Document ID: ${escapeHtml(result.id)}</strong>
    </div>
    <div class="table-wrap firebase-result-table-wrap">
      <table class="firebase-result-table">
        <tbody>
          ${fields.map((field) => `
            <tr>
              <th>${field}</th>
              <td>${formatFirebaseValue(result[field])}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
  cardElement.classList.remove("hidden");
}

function formatFirebaseFieldName(fieldName) {
  return String(fieldName)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatFirebaseValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value?.toDate === "function") return escapeHtml(value.toDate().toLocaleDateString());
  if (Array.isArray(value)) {
    return value.length
      ? `<ul class="firebase-value-list">${value.map((item) => `<li>${formatFirebaseValue(item)}</li>`).join("")}</ul>`
      : "-";
  }
  if (typeof value === "object") {
    const rows = Object.entries(value);
    return rows.length
      ? `<table class="firebase-nested-table"><tbody>${rows.map(([key, nestedValue]) => `
          <tr>
            <th>${escapeHtml(formatFirebaseFieldName(key))}</th>
            <td>${formatFirebaseValue(nestedValue)}</td>
          </tr>
        `).join("")}</tbody></table>`
      : "-";
  }
  return escapeHtml(value);
}

function renderResults() {
  const students = sortedStudents();
  const published = isPublished();
  const viewable = canViewResult();
  const maxMarks = getMaxMarks();
  const passMarks = getPassMarks();
  const subjects = currentSubjects();
  const subjectsForMarks = markSubjects();
  const term = isTermExam();
  const workingDays = getWorkingDays();
  els.resultsTable.classList.toggle("structured-results", isStructuredResultSheet());
  els.resultsTable.classList.toggle("high-third-term-results", isHighThirdTermResult());
  els.resultsTable.style.width = "";
  els.resultsTable.style.removeProperty("--student-name-width");
  els.resultsTable.style.setProperty("--student-name-width", `${getStudentNameColumnWidth(students)}px`);
  els.resultsTable.style.setProperty("--mobile-student-name-width", `${getMobileStudentNameColumnWidth(students)}px`);
  els.printResultsTitle.textContent = `${selectedClass()} ${selectedExam()} Result : ${formatAcademicSession(state.academicSession)}`;

  els.resultNotice.textContent = published
    ? `${selectedClass()} ${selectedExam()} is published.`
    : isAdmin()
      ? `${selectedClass()} ${selectedExam()} is in admin preview. Publish when ready for other users.`
      : `Publish ${selectedClass()} ${selectedExam()} to show final results.`;

  if (isStructuredResultSheet()) {
    renderStructuredTermResults(students, viewable, subjects, subjectsForMarks, maxMarks, passMarks, workingDays);
    return;
  }

  els.resultSummary.innerHTML = "";
  const showMeasurements = term && !isHighClass();
  const totalHeading = isHighClass() ? "Grand Total" : "Total";
  els.resultsHead.innerHTML = `
    <tr>
      <th>Roll No.</th>
      <th>Student Name</th>
      ${subjects.map((subject) => `<th>${subject}</th>`).join("")}
      ${term ? "<th>Attendance</th>" : ""}
      ${showMeasurements ? "<th>Height (in cm)</th><th>Weight (in kg)</th>" : ""}
      <th>${totalHeading}</th>
      <th>Percentage</th>
      <th>Division</th>
      <th>Result</th>
    </tr>
  `;
  updateResultStickyHeaderMetrics();

  if (!viewable) {
    els.resultsBody.innerHTML = `
      <tr>
        <td colspan="${subjects.length + 6 + (term ? 1 : 0) + (showMeasurements ? 2 : 0)}">No published result for this class and exam yet.</td>
      </tr>
    `;
    updateResultStickyHeaderMetrics();
    return;
  }

  const records = students.map((student) => {
    const subjectValues = subjects.map((subject) => getStudentMark(student, subject).value);
    const markValues = subjectsForMarks.map((subject) => getStudentMark(student, subject).value);
    const resultMarkValues = outcomeMarkValues(student, subjectsForMarks);
    const gradeValues = subjects.filter((subject) => isGradeSubject(subject)).map((subject) => getStudentMark(student, subject).value);
    const numbers = markValues.map((value) => Number(value)).filter((value) => !Number.isNaN(value));
    const total = Math.round(numbers.reduce((sum, value) => sum + value, 0));
    const maximumTotal = marksMaximum(subjectsForMarks);
    const percent = roundUpPercentage(total, maximumTotal);
    const appeared = subjectValues.some((value) => value !== "");
    const calculatedOutcome = calculateOutcome(resultMarkValues, passMarks, Number(percent), selectedClass(), selectedExam(), gradeValues);
    const outcome = appeared ? calculatedOutcome : emptyResultOutcome();
    const attendance = getStudentAttendance(student);
    const measurement = getStudentMeasurement(student);

    return {
      student,
      subjectValues,
      total,
      maximumTotal,
      percent,
      outcome,
      attendance,
      measurement,
      appeared
    };
  });

  els.resultsBody.innerHTML = records.map((record) => {
    return `
      <tr>
        <td>${record.student.roll}</td>
        <td>${escapeHtml(record.student.name)}</td>
        ${record.subjectValues.map((value, index) => formatResultMark(subjects[index], value, passMarks)).join("")}
        ${term
          ? `<td>${record.attendance === "" ? "-" : `${record.attendance}/${workingDays}`}</td>`
          : ""}
        ${showMeasurements
          ? `<td>${record.measurement.height === "" ? "-" : record.measurement.height}</td>
            <td>${record.measurement.weight === "" ? "-" : record.measurement.weight}</td>`
          : ""}
        <td>${record.total}/${record.maximumTotal}</td>
        <td>${record.percent}%</td>
        <td>${record.outcome.division}</td>
        <td>${formatResultStatus(record.outcome.result)}</td>
      </tr>
    `;
  }).join("");

  renderResultSummary(records, students.length);
  updateResultStickyHeaderMetrics();
}

function isStructuredTermResult(className = selectedClass(), exam = selectedExam()) {
  return ["Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII"].includes(className)
    && (exam === "First Term" || exam === "Second Term");
}

function isStructuredResultSheet(className = selectedClass(), exam = selectedExam()) {
  return (["Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII"].includes(className)
    && termExams.includes(exam))
    || (isHighClass(className) && exam === "Third Term");
}

function isStructuredMarksheet(className = selectedClass(), exam = selectedExam()) {
  return ["Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII"].includes(className)
    && termExams.includes(exam);
}

function isHighThirdTermResult(className = selectedClass(), exam = selectedExam()) {
  return isHighClass(className) && exam === "Third Term";
}

function isHighThirdTermNumericSubject(className = selectedClass(), exam = selectedExam(), subject = selectedSubject()) {
  return isHighThirdTermResult(className, exam)
    && !subject.endsWith(" (Assignment)")
    && !isGradeSubject(subject, className);
}

function isThirdTermWeightedSubject(className = selectedClass(), exam = selectedExam(), subject = selectedSubject()) {
  return ["Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII"].includes(className)
    && exam === "Third Term"
    && !["A.E.", "W.E.", "Skill Development"].includes(subject);
}

function renderStructuredTermResults(students, published, subjects, subjectsForMarks, maxMarks, passMarks, workingDays) {
  const structure = getTermSubjectStructure(subjects);
  const thirdTermSheet = selectedExam() === "Third Term";
  const highThirdTermSheet = isHighThirdTermResult();
  const componentsPerSubject = highThirdTermSheet ? 3 : 4;
  const finalColumns = 5;
  const columnCount = 2 + (structure.groups.length * componentsPerSubject) + structure.standalone.length + finalColumns;
  const studentNameColumnWidth = getStudentNameColumnWidth(students);
  const mobileStudentNameColumnWidth = getMobileStudentNameColumnWidth(students);
  const tableWidth = 54 + studentNameColumnWidth + (structure.groups.length * (componentsPerSubject * 32))
    + (structure.standalone.length * 48) + 220;
  els.resultsTable.style.setProperty("--student-name-width", `${studentNameColumnWidth}px`);
  els.resultsTable.style.setProperty("--mobile-student-name-width", `${mobileStudentNameColumnWidth}px`);
  els.resultsTable.style.width = `${tableWidth}px`;

  els.resultsHead.innerHTML = `
    <tr>
      <th rowspan="2" class="roll-column">Roll No.</th>
      <th rowspan="2" class="student-name-column">Student Name</th>
      ${structure.groups.map((group) => `<th colspan="${componentsPerSubject}" class="subject-group">${escapeHtml(group.name)}</th>`).join("")}
      ${structure.standalone.map((subject) => {
        if (highThirdTermSheet && subject === "Skill Development") {
          return '<th rowspan="2" class="standalone-column vertical-header skill-development-header"><span>Skill Development</span></th>';
        }
        const vertical = thirdTermSheet || subject === "Skill Development";
        return `<th rowspan="2" class="standalone-column ${vertical ? "vertical-header" : ""}">${vertical ? `<span>${escapeHtml(subject)}</span>` : escapeHtml(subject)}</th>`;
      }).join("")}
      <th rowspan="2" class="attendance-column vertical-header"><span>Attendance</span></th>
      <th rowspan="2" class="outcome-column">Grand<br>Total</th>
      <th rowspan="2" class="outcome-column">%</th>
      <th rowspan="2" class="outcome-column vertical-header"><span>Division</span></th>
      <th rowspan="2" class="result-column vertical-header"><span>Result</span></th>
    </tr>
    <tr>
      ${structure.groups.map(() => highThirdTermSheet
        ? '<th class="component-column subject-start vertical-header third-term-component-header"><span>F.A.</span></th><th class="component-column vertical-header third-term-component-header"><span>S.A.</span></th><th class="component-column subject-end vertical-header third-term-component-header"><span>Total</span></th>'
        : thirdTermSheet
          ? '<th class="component-column subject-start vertical-header third-term-component-header"><span>First Term (30%)</span></th><th class="component-column vertical-header third-term-component-header"><span>Second Term (30%)</span></th><th class="component-column vertical-header third-term-component-header"><span>Third Term (40%)</span></th><th class="component-column subject-end vertical-header third-term-component-header"><span>Total</span></th>'
        : '<th class="component-column subject-start vertical-header"><span>Activities</span></th><th class="component-column vertical-header"><span>Unit Test</span></th><th class="component-column vertical-header"><span>Exam</span></th><th class="component-column subject-end vertical-header"><span>Total</span></th>').join("")}
    </tr>
  `;
  updateResultStickyHeaderMetrics();

  if (!published) {
    els.resultsBody.innerHTML = `<tr><td colspan="${columnCount}">No published result for this class and exam yet.</td></tr>`;
    els.resultSummary.innerHTML = "";
    updateResultStickyHeaderMetrics();
    return;
  }

  const records = students.map((student) => {
    const subjectResults = structure.groups.map((group) => getStructuredSubjectResult(student, group));
    const standaloneResults = structure.standalone.map((subject) => getStructuredStandaloneResult(student, subject));
    const resultSubjects = highThirdTermSheet
      ? subjectResults.map((subjectResult) => ({
        value: subjectResult.total,
        failed: subjectResult.activities === "" || numericMark(subjectResult.activities) < 7
          || subjectResult.exam === "" || numericMark(subjectResult.exam) < 26
      }))
      : subjectResults.map((subjectResult) => subjectResult.total);
    const gradeValues = standaloneResults.filter((subjectResult) => subjectResult.graded).map((subjectResult) => subjectResult.value);
    const total = Math.round(subjectResults.reduce((sum, subjectResult) => sum + numericMark(subjectResult.total), 0)
      + standaloneResults.filter((subjectResult) => subjectResult.countsForTotal)
        .reduce((sum, subjectResult) => sum + numericMark(subjectResult.value), 0));
    const maximumTotal = (subjectResults.length * 100)
      + standaloneResults.filter((subjectResult) => subjectResult.countsForTotal)
        .reduce((sum, subjectResult) => sum + subjectResult.maxMarks, 0);
    const percentage = roundUpPercentage(total, maximumTotal);
    const appeared = subjectResults.some((subjectResult) => subjectResult.hasMark)
      || standaloneResults.some((subjectResult) => subjectResult.value !== "");
    const calculatedOutcome = calculateStructuredTermOutcome(resultSubjects, Number(percentage), gradeValues);
    return {
      student,
      subjectResults,
      standaloneResults,
      total,
      maximumTotal,
      percentage,
      outcome: appeared ? calculatedOutcome : emptyResultOutcome(),
      appeared,
      attendance: getStudentAttendance(student)
    };
  });

  els.resultsBody.innerHTML = records.map((record) => `
    <tr>
      <td>${record.student.roll}</td>
      <td>${escapeHtml(record.student.name)}</td>
      ${record.subjectResults.map((subjectResult) => {
        return `<td class="subject-start">${formatComponentMark(subjectResult.activities, highThirdTermSheet ? 7 : null)}</td>
          ${highThirdTermSheet ? "" : `<td>${formatComponentMark(subjectResult.unitTest)}</td>`}
          <td>${formatComponentMark(subjectResult.exam, highThirdTermSheet ? 26 : null)}</td>
          ${formatStructuredTotal(subjectResult.total, highThirdTermSheet ? 33 : 50)}`;
      }).join("")}
      ${record.standaloneResults.map((subjectResult) => formatStructuredStandalone(subjectResult)).join("")}
      <td>${record.attendance === "" ? "-" : `${record.attendance}/${workingDays}`}</td>
      <td><strong>${record.total}/${record.maximumTotal}</strong></td>
      <td>${record.percentage}%</td>
      <td>${record.outcome.division}</td>
      <td>${formatResultStatus(record.outcome.result)}</td>
    </tr>
  `).join("");

  const appearedRecords = records.filter((record) => record.appeared);
  renderResultSummary(appearedRecords.map((record) => ({ ...record, appeared: true })), students.length);
  updateResultStickyHeaderMetrics();
}

function getStudentNameColumnWidth(students) {
  const names = students.map((student) => String(student.name || "").trim()).filter(Boolean);
  const longestNameLength = names.reduce((longest, name) => Math.max(longest, name.length), 0);
  const estimatedWidth = longestNameLength * 7.2;
  let measuredWidth = 0;
  if (names.length && typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = getComputedStyle(els.resultsTable || document.body).font || "12px Inter, sans-serif";
      measuredWidth = names.reduce((widest, name) => Math.max(widest, context.measureText(name).width), 0);
    }
  }
  return Math.max(72, Math.ceil(Math.max(estimatedWidth, measuredWidth)) + 14);
}

function getMobileStudentNameColumnWidth(students) {
  const names = students.map((student) => String(student.name || "").trim()).filter(Boolean);
  const longestNameLength = names.reduce((longest, name) => Math.max(longest, name.length), 0);
  return Math.max(54, Math.ceil(longestNameLength * 5.8) + 12);
}

function updateResultStickyHeaderMetrics() {
  const firstHeaderRow = els.resultsHead?.querySelector("tr:first-child");
  const firstHeaderCell = firstHeaderRow?.querySelector("th:first-child");
  const headerHeight = Math.ceil(firstHeaderRow?.getBoundingClientRect().height || 0);
  const rollWidth = Math.ceil(firstHeaderCell?.getBoundingClientRect().width || 0);

  if (headerHeight) {
    els.resultsTable.style.setProperty("--results-header-row-height", `${headerHeight}px`);
  }
  if (rollWidth) {
    els.resultsTable.style.setProperty("--results-roll-sticky-width", `${rollWidth}px`);
  }
}

function renderResultSummary(records, studentCount) {
  const appearedRecords = records.filter((record) => record.appeared);
  const appeared = appearedRecords.length;
  const absent = studentCount - appeared;
  const passCount = appearedRecords.filter((record) => record.outcome.result !== "Fail").length;
  const failCount = appeared - passCount;
  const passPercentage = appeared ? Math.round((passCount / appeared) * 10000) / 100 : 0;
  const divisionCount = (division) => appearedRecords.filter((record) => record.outcome.division === division).length;

  els.resultSummary.innerHTML = `
    ${summaryItem("No. of Students", studentCount)}
    ${summaryItem("Absent", absent)}
    ${summaryItem("Appeared", appeared)}
    ${summaryItem("Pass Percentage", `${passPercentage}%`)}
    ${summaryItem("No. of Passed", passCount)}
    ${summaryItem("No. of Failed", failCount)}
    ${summaryItem("No. of Distinction", divisionCount("Dist."))}
    ${summaryItem("No. of First Division", divisionCount("I"))}
    ${summaryItem("No. of Second Division", divisionCount("II"))}
    ${summaryItem("No. of Third Division", divisionCount("III"))}
  `;
}

function getStructuredSubjectResult(student, group) {
  if (isHighThirdTermResult()) {
    const continuousTestValues = highContinuousTests.map((exam) =>
      getStoredStudentMark(student, selectedClass(), exam, group.name).value);
    const firstTermValue = getStoredStudentMark(student, selectedClass(), "First Term", group.name).value;
    const secondTermValue = getStoredStudentMark(student, selectedClass(), "Second Term", group.name).value;
    const thirdTermValue = getStoredStudentMark(student, selectedClass(), "Third Term", `${group.name} (Exam)`).value;
    const assignmentValue = getStoredStudentMark(student, selectedClass(), "Third Term", `${group.name} (Assignment)`).value;
    const attendance = getStudentAttendance(student, selectedClass(), "Third Term");
    const attendanceMarks = getAttendanceMarks(attendance, getWorkingDays("Third Term"), selectedClass());
    const continuousTestTotal = continuousTestValues.reduce((sum, value) => sum + numericMark(value), 0);
    const higherTermMark = Math.max(numericMark(firstTermValue), numericMark(secondTermValue));
    const hasMark = continuousTestValues.some((value) => value !== "")
      || firstTermValue !== ""
      || secondTermValue !== ""
      || thirdTermValue !== ""
      || assignmentValue !== "";
    const formativeAssessment = hasMark
      ? Math.round(((((continuousTestTotal / 100) * 15) + ((higherTermMark / 100) * 15)) / 2)
        + attendanceMarks + numericMark(assignmentValue))
      : "";
    return {
      activities: formativeAssessment,
      unitTest: "",
      exam: thirdTermValue,
      hasMark,
      total: hasMark ? Math.round(numericMark(formativeAssessment) + numericMark(thirdTermValue)) : ""
    };
  }

  if (selectedExam() === "Third Term") {
    const firstTermTotal = getStoredStructuredTermTotal(student, group.name, "First Term");
    const secondTermTotal = getStoredStructuredTermTotal(student, group.name, "Second Term");
    const exam = getStoredStudentMark(student, selectedClass(), "Third Term", group.name).value;
    const firstTerm = weightedTermMark(firstTermTotal);
    const secondTerm = weightedTermMark(secondTermTotal);
    const hasMark = firstTermTotal !== "" || secondTermTotal !== "" || exam !== "";
    return {
      activities: firstTerm,
      unitTest: secondTerm,
      exam,
      hasMark,
      total: hasMark ? Math.round(numericMark(firstTerm) + numericMark(secondTerm) + numericMark(exam)) : ""
    };
  }

  const activities = getStudentMark(student, group.activities).value;
  const exam = getStudentMark(student, group.exam).value;
  const unitTest = getStructuredUnitTestMark(student, group.name);
  const hasMark = activities !== "" || unitTest !== "" || exam !== "";
  return {
    activities,
    unitTest,
    exam,
    hasMark,
    total: hasMark ? Math.round(numericMark(activities) + numericMark(unitTest) + numericMark(exam)) : ""
  };
}

function getStructuredUnitTestMark(student, subject) {
  const exams = selectedExam() === "First Term"
    ? ["FT Unit Test 1", "FT Unit Test 2"]
    : ["ST Unit Test 1", "ST Unit Test 2"];
  const values = exams.map((exam) => getStoredStudentMark(student, selectedClass(), exam, subject).value);
  return values.every((value) => value === "") ? "" : values.reduce((sum, value) => sum + numericMark(value), 0);
}

function getStoredStructuredTermTotal(student, subject, term) {
  const activities = getStoredStudentMark(student, selectedClass(), term, `${subject} (Activities)`).value;
  const exam = getStoredStudentMark(student, selectedClass(), term, `${subject} (Exam)`).value;
  const unitTests = term === "First Term"
    ? ["FT Unit Test 1", "FT Unit Test 2"]
    : ["ST Unit Test 1", "ST Unit Test 2"];
  const unitTestValues = unitTests.map((unitTest) => getStoredStudentMark(student, selectedClass(), unitTest, subject).value);
  const values = [activities, exam, ...unitTestValues];
  return values.every((value) => value === "")
    ? ""
    : values.reduce((sum, value) => sum + numericMark(value), 0);
}

function weightedTermMark(value) {
  return weightedMark(value, 30);
}

function weightedMark(value, percentage) {
  return value === "" ? "" : (Math.ceil(numericMark(value) * percentage) / 100).toFixed(2);
}

function roundUpToTwoDecimals(value) {
  return Math.ceil(Number(value) * 100) / 100;
}

function getStructuredStandaloneResult(student, subject) {
  const value = getStudentMark(student, subject).value;
  const graded = isGradeSubject(subject);
  const noPassMark = subject === "A.E."
    || (["Class VI", "Class VII", "Class VIII"].includes(selectedClass()) && subject === "W.E.");
  return {
    subject,
    value,
    graded,
    countsForResult: !graded && !noPassMark,
    countsForTotal: !graded,
    maxMarks: (subject === "A.E." || subject === "W.E.") ? 50 : 100
  };
}

function calculateStructuredTermOutcome(markValues, percentage, gradeValues = []) {
  const passMark = isHighThirdTermResult() ? 33 : 50;
  const numericFailCount = markValues.filter((entry) => {
    if (entry && typeof entry === "object") return entry.failed;
    return entry === "" || numericMark(entry) < passMark;
  }).length;
  const gradeFailCount = gradeValues.filter((value) => getGradeStatus(value).className !== "pass").length;
  const failCount = numericFailCount + gradeFailCount;
  const result = failCount === 0 ? "Pass" : failCount === 1 ? "Simple Pass" : "Fail";
  return {
    failCount,
    result,
    division: result === "Pass"
      ? (isHighThirdTermResult() ? getDivision(percentage, false) : getPrimaryDivision(percentage))
      : "-",
    grade: isHighThirdTermResult() ? "-" : getPrimaryGrade(percentage)
  };
}

function formatComponentMark(value, passMark = null) {
  const displayValue = value === "" ? "AB" : escapeHtml(value);
  const failed = value === "" || (passMark !== null && numericMark(value) < passMark);
  return failed ? `<span class="failed-mark">${displayValue}</span>` : displayValue;
}

function formatStructuredTotal(value, passMark = 50) {
  const displayValue = value === "" ? "AB" : value;
  const failed = value === "" || numericMark(value) < passMark;
  return `<td class="subject-total subject-end">${failed
    ? `<span class="failed-mark">${escapeHtml(displayValue)}</span>`
    : escapeHtml(displayValue)}</td>`;
}

function formatStructuredStandalone(subjectResult) {
  const displayValue = subjectResult.value === "" ? "AB" : subjectResult.value;
  const failed = subjectResult.value === ""
    || (subjectResult.countsForResult && numericMark(subjectResult.value) < 50);
  return `<td class="standalone-value">${failed
    ? `<span class="failed-mark">${escapeHtml(displayValue)}</span>`
    : escapeHtml(displayValue)}</td>`;
}

function getTermSubjectStructure(subjects) {
  if (selectedExam() === "Third Term") {
    const isStandalone = (subject) => isHighThirdTermResult()
      ? isGradeSubject(subject)
      : ["A.E.", "W.E.", "Skill Development"].includes(subject);
    return {
      groups: subjects
        .filter((subject) => !isStandalone(subject))
        .map((subject) => ({ name: subject })),
      standalone: subjects.filter(isStandalone)
    };
  }

  const groups = [];
  const groupMap = new Map();
  const standalone = [];

  subjects.forEach((subject) => {
    const match = subject.match(/^(.*) \((Activities|Exam)\)$/);
    if (!match) {
      standalone.push(subject);
      return;
    }

    const [, name, component] = match;
    if (!groupMap.has(name)) {
      const group = { name, activities: "", exam: "" };
      groupMap.set(name, group);
      groups.push(group);
    }
    groupMap.get(name)[component.toLowerCase()] = subject;
  });

  return { groups, standalone };
}

function numericMark(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function summaryItem(label, value) {
  return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function formatAcademicSession(session) {
  return String(session).replace(/(\d{4})\s*-\s*(\d{2})(\d{2})/, "$1 - $3");
}

function filteredMarksheetStudents(students) {
  const query = (els.marksheetNameSearchInput?.value || "").trim().toLowerCase();
  if (!query) return students;
  return students.filter((student) => String(student.name || "").toLowerCase().includes(query));
}

function renderMarksheets() {
  const allStudents = sortedStudents();
  const students = filteredMarksheetStudents(allStudents);
  const subjects = currentSubjects();
  const subjectsForMarks = markSubjects();
  const structuredTerm = isStructuredMarksheet();
  const highThirdTermMarksheet = isHighThirdTermResult();
  const structure = structuredTerm ? getTermSubjectStructure(subjects) : null;
  const maxMarks = getMaxMarks();
  const passMarks = getPassMarks();
  const term = isTermExam();
  const workingDays = getWorkingDays();

  if (!canViewResult()) {
    els.marksheetBody.innerHTML = `
      <div class="table-wrap">
        <table>
          <tbody><tr><td>No published marksheets for ${escapeHtml(selectedClass())} ${escapeHtml(selectedExam())}.</td></tr></tbody>
        </table>
      </div>
    `;
    return;
  }

  if (!students.length) {
    els.marksheetBody.innerHTML = `
      <div class="table-wrap">
        <table>
          <tbody><tr><td>No marksheets found for the selected class and name.</td></tr></tbody>
        </table>
      </div>
    `;
    return;
  }

  els.marksheetBody.innerHTML = students.map((student) => {
    const markValues = subjectsForMarks.map((subject) => getStudentMark(student, subject).value);
    const resultMarkValues = outcomeMarkValues(student, subjectsForMarks);
    const gradeValues = subjects.filter((subject) => isGradeSubject(subject)).map((subject) => getStudentMark(student, subject).value);
    const structuredSubjects = structuredTerm ? structure.groups.map((group) => getStructuredSubjectResult(student, group)) : [];
    const structuredStandalone = structuredTerm ? structure.standalone.map((subject) => getStructuredStandaloneResult(student, subject)) : [];
    const moveSkillDevelopment = ["Class VI", "Class VII", "Class VIII"].includes(selectedClass())
      && (selectedExam() === "First Term" || selectedExam() === "Second Term");
    const displayedStructuredStandalone = moveSkillDevelopment
      ? structuredStandalone.filter((result) => result.subject !== "Skill Development")
      : structuredStandalone;
    const termSkillDevelopment = moveSkillDevelopment
      ? structuredStandalone.filter((result) => result.subject === "Skill Development")
        .map((result) => ({ subject: result.subject, value: result.value }))
      : [];
    const highThirdTermSubjects = highThirdTermMarksheet ? subjects.filter((subject) => !isGradeSubject(subject)) : [];
    const highThirdTermResults = highThirdTermSubjects.map((subject) => getStructuredSubjectResult(student, { name: subject }));
    const highThirdTermGrades = highThirdTermMarksheet
      ? subjects.filter((subject) => isGradeSubject(subject)).map((subject) => ({ subject, value: getStudentMark(student, subject).value }))
      : [];
    const highClassGrades = isHighClass() && !highThirdTermMarksheet
      ? subjects.filter((subject) => isGradeSubject(subject)).map((subject) => ({ subject, value: getStudentMark(student, subject).value }))
      : [];
    const highClassNumericSubjects = isHighClass()
      ? subjects.filter((subject) => !isGradeSubject(subject))
      : subjects;
    const numbers = markValues.map(Number).filter((value) => !Number.isNaN(value));
    const total = highThirdTermMarksheet
      ? Math.round(highThirdTermResults.reduce((sum, subjectResult) => sum + numericMark(subjectResult.total), 0))
      : structuredTerm
      ? Math.round(structuredSubjects.reduce((sum, subjectResult) => sum + numericMark(subjectResult.total), 0)
        + structuredStandalone.filter((subjectResult) => subjectResult.countsForTotal)
        .reduce((sum, subjectResult) => sum + numericMark(subjectResult.value), 0))
      : Math.round(numbers.reduce((sum, value) => sum + value, 0));
    const maximumTotal = highThirdTermMarksheet
      ? highThirdTermResults.length * 100
      : structuredTerm
      ? (structuredSubjects.length * 100)
        + structuredStandalone.filter((subjectResult) => subjectResult.countsForTotal)
          .reduce((sum, subjectResult) => sum + subjectResult.maxMarks, 0)
      : marksMaximum(subjectsForMarks);
    const percentage = roundUpPercentage(total, maximumTotal);
    const outcome = highThirdTermMarksheet
      ? calculateStructuredTermOutcome(
        highThirdTermResults.map((subjectResult) => ({
          value: subjectResult.total,
          failed: subjectResult.activities === "" || numericMark(subjectResult.activities) < 7
            || subjectResult.exam === "" || numericMark(subjectResult.exam) < 26
        })),
        Number(percentage),
        highThirdTermGrades.map((subject) => subject.value)
      )
      : structuredTerm
      ? calculateStructuredTermOutcome([
        ...structuredSubjects.map((subjectResult) => subjectResult.total),
        ...structuredStandalone.filter((subjectResult) => subjectResult.countsForResult)
          .map((subjectResult) => subjectResult.value)
      ], Number(percentage))
      : calculateOutcome(resultMarkValues, passMarks, Number(percentage), selectedClass(), selectedExam(), gradeValues);
    const attendance = getStudentAttendance(student);
    const measurement = getStudentMeasurement(student);

    return `
      <article class="marksheet${isHighClass() ? " high-class-marksheet" : ""}${highThirdTermMarksheet ? " high-third-term-marksheet" : ""}${isClassOneToEight() ? " class-one-eight-marksheet" : ""}${isLkgToClassSeven() ? " lower-class-marksheet" : ""}">
        <div class="marksheet-title">
          <h3>PINEHILL ADVENTIST ACADEMY</h3>
          <p class="marksheet-location">CHAMPHAI : MIZORAM</p>
          <p class="marksheet-session">${escapeHtml(selectedClass())} ${escapeHtml(selectedExam())} Marksheet | Academic Session : ${escapeHtml(state.academicSession)}</p>
        </div>
        <div class="student-details">
          ${studentDetail("Name", student.name)}
          ${studentDetail("Roll No.", student.roll)}
          ${studentDetail("ID No.", student.idNo)}
          ${studentDetail("D.O.B.", formatDisplayDate(student.dateOfBirth))}
          ${studentDetail("Father's Name", student.fatherName)}
          ${studentDetail("Mother's Name", student.motherName)}
          ${studentDetail("Address", student.address)}
          ${studentDetail("PEN", student.pen)}
          ${studentDetail("Aadhaar No.", student.aadhaarNo)}
        </div>
        <div class="table-wrap">
          ${structuredTerm
            ? renderStructuredMarksheetTable(structure, structuredSubjects, displayedStructuredStandalone, total, maximumTotal)
            : highThirdTermMarksheet
              ? renderHighThirdTermMarksheetTable(highThirdTermSubjects, highThirdTermResults)
            : isHighClass()
              ? renderHighClassMarksheetTable(student, highClassNumericSubjects, passMarks, maxMarks)
              : renderLowerClassMarksheetTable(student, subjects, passMarks)
            }
        </div>
        <div class="marksheet-summary">
          <span>Percentage: ${percentage}%</span>
          <span>Division: ${outcome.division}</span>
          <span>Result: ${outcome.result}</span>
        </div>
        ${highThirdTermMarksheet ? renderMarksheetGradedSubjects(highThirdTermGrades) : ""}
        ${highClassGrades.length ? renderMarksheetGradedSubjects(highClassGrades) : ""}
        ${termSkillDevelopment.length ? renderMarksheetGradedSubjects(termSkillDevelopment, "term-skill-development") : ""}
        ${term
          ? `<div class="marksheet-measurements">
              ${studentDetail("Class Strength", allStudents.length)}
              ${studentDetail("Attendance", attendance === "" ? "" : `${attendance}/${workingDays}`)}
              ${studentDetail("Height (in cm)", measurement.height)}
              ${studentDetail("Weight (in kg)", measurement.weight)}
              ${studentDetail("Remark", getMarksheetRemark(outcome))}
            </div>`
          : ""}
        <div class="marksheet-signatures">
          <span>Class Teacher's Signature</span>
          <span>Parent's Signature</span>
          <span>Principal's Signature</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderHighThirdTermMarksheetTable(subjects, subjectResults) {
  const obtainedTotal = subjectResults.reduce((sum, result) => sum + numericMark(result.total), 0);
  return `
    <table class="high-class-marksheet-table">
      <thead>
        <tr><th>Subject</th><th>Full Marks</th><th>Pass Marks</th><th>Marks Obtained</th></tr>
      </thead>
      <tbody>
        ${subjects.map((subject, index) => {
          const result = subjectResults[index];
          const failed = result.total === ""
            || numericMark(result.activities) < 7
            || numericMark(result.exam) < 26;
          const displayValue = result.total === "" ? "AB" : result.total;
          return `<tr>
            <td>${escapeHtml(subject)}</td>
            <td>100</td>
            <td>33</td>
            <td><strong>${failed ? `<span class="failed-mark">${displayValue}</span>` : displayValue}</strong></td>
          </tr>`;
        }).join("")}
        <tr class="grand-total-row">
          <td>Grand Total</td>
          <td>${subjects.length * 100}</td>
          <td>${subjects.length * 33}</td>
          <td><strong>${obtainedTotal}</strong></td>
        </tr>
      </tbody>
    </table>
  `;
}

function renderMarksheetGradedSubjects(subjects, extraClass = "") {
  return `<div class="marksheet-graded-subjects ${extraClass}">
    ${subjects.map(({ subject, value }) => {
      const displayValue = value || "AB";
      const failed = getGradeStatus(value).className !== "pass";
      return `<span>${escapeHtml(subject)}: <strong>${failed ? `<span class="failed-mark">${escapeHtml(displayValue)}</span>` : escapeHtml(displayValue)}</strong></span>`;
    }).join("")}
  </div>`;
}

function renderStructuredMarksheetTable(structure, subjectResults, standaloneResults, total, maximumTotal) {
  const thirdTermSheet = selectedExam() === "Third Term";
  const passMarksTotal = structure.groups.length * 50;
  return `
    <table class="structured-marksheet-table">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Full Marks</th>
          <th>Pass Marks</th>
          <th>${thirdTermSheet ? "First Term (30%)" : "Activities"}</th>
          <th>${thirdTermSheet ? "Second Term (30%)" : "Unit Test"}</th>
          <th>${thirdTermSheet ? "Exam (40%)" : "Exam"}</th>
          <th>Marks Obtained</th>
        </tr>
      </thead>
      <tbody>
        ${structure.groups.map((group, index) => {
          const result = subjectResults[index];
          return `<tr>
            <td>${escapeHtml(group.name)}</td>
            <td>100</td>
            <td>50</td>
            <td>${marksheetComponentValue(result.activities)}</td>
            <td>${marksheetComponentValue(result.unitTest)}</td>
            <td>${marksheetComponentValue(result.exam)}</td>
            <td><strong>${marksheetTotalValue(result.total)}</strong></td>
          </tr>`;
        }).join("")}
        ${standaloneResults.map((result) => `<tr>
          <td>${escapeHtml(result.subject)}</td>
          <td>${result.subject === "A.E." || result.subject === "W.E." ? 50 : ""}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td><strong>${marksheetStandaloneValue(result)}</strong></td>
        </tr>`).join("")}
        <tr class="grand-total-row">
          <td>Grand Total</td>
          <td>${maximumTotal}</td>
          <td>${passMarksTotal}</td>
          <td></td>
          <td></td>
          <td></td>
          <td><strong>${total}</strong></td>
        </tr>
      </tbody>
    </table>
  `;
}

function renderHighClassMarksheetTable(student, subjects, passMarks, maxMarks) {
  const numericSubjects = subjects.filter((subject) => !isGradeSubject(subject));
  const fullMarksTotal = numericSubjects.reduce((sum, subject) => sum + getSubjectMaxMarks(selectedClass(), selectedExam(), subject), 0);
  const passMarksTotal = numericSubjects.reduce((sum, subject) => sum + getSubjectPassMarks(selectedClass(), selectedExam(), subject), 0);
  const obtainedTotal = numericSubjects.reduce((sum, subject) => sum + numericMark(getStudentMark(student, subject).value), 0);
  return `
    <table class="high-class-marksheet-table">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Full Marks</th>
          <th>Pass Marks</th>
          <th>Marks Obtained</th>
        </tr>
      </thead>
      <tbody>
        ${subjects.map((subject) => {
          const value = getStudentMark(student, subject).value;
          const graded = isGradeSubject(subject);
          return `<tr>
            <td>${escapeHtml(subject)}</td>
            <td>${graded ? "-" : maxMarks}</td>
            <td>${graded ? "-" : passMarks}</td>
            <td><strong>${marksheetHighClassValue(subject, value, passMarks)}</strong></td>
          </tr>`;
        }).join("")}
        <tr class="grand-total-row">
          <td>Grand Total</td>
          <td>${fullMarksTotal}</td>
          <td>${passMarksTotal}</td>
          <td><strong>${obtainedTotal}</strong></td>
        </tr>
      </tbody>
    </table>
  `;
}

function renderLowerClassMarksheetTable(student, subjects, passMarks) {
  const numericSubjects = subjects.filter((subject) => !isGradeSubject(subject));
  const fullMarksTotal = numericSubjects.reduce((sum, subject) => sum + getSubjectMaxMarks(selectedClass(), selectedExam(), subject), 0);
  const passMarksTotal = numericSubjects.reduce((sum, subject) => {
    const noPassMark = isNoPassMarkSubject(selectedClass(), selectedExam(), subject) || subject === "A.E." || subject === "W.E.";
    const earlyYearsSubject = selectedClass() === "LKG" || selectedClass() === "UKG";
    return sum + (noPassMark && !earlyYearsSubject ? 0 : getSubjectPassMarks(selectedClass(), selectedExam(), subject));
  }, 0);
  const obtainedTotal = numericSubjects.reduce((sum, subject) => sum + numericMark(getStudentMark(student, subject).value), 0);
  return `
    <table class="lower-class-marksheet-table">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Full Marks</th>
          <th>Pass Marks</th>
          <th>Marks Obtained</th>
        </tr>
      </thead>
      <tbody>
        ${subjects.map((subject) => {
          const value = getStudentMark(student, subject).value;
          const graded = isGradeSubject(subject);
          const noPassMark = isNoPassMarkSubject(selectedClass(), selectedExam(), subject) || subject === "A.E." || subject === "W.E.";
          const subjectPassMarks = getSubjectPassMarks(selectedClass(), selectedExam(), subject);
          const displayValue = marksheetDisplayValue(value);
          const earlyYearsSubject = selectedClass() === "LKG" || selectedClass() === "UKG";
          const hasNoPassMark = noPassMark && !earlyYearsSubject;
          const failed = value === "" || (!graded && !hasNoPassMark && getStatus(value, subjectPassMarks).className !== "pass")
            || (graded && getGradeStatus(value).className !== "pass");
          return `<tr>
            <td>${escapeHtml(subject)}</td>
            <td>${graded ? "-" : getSubjectMaxMarks(selectedClass(), selectedExam(), subject)}</td>
            <td>${graded || hasNoPassMark ? "-" : subjectPassMarks}</td>
            <td><strong>${failed ? `<span class="failed-mark">${displayValue}</span>` : displayValue}</strong></td>
          </tr>`;
        }).join("")}
        <tr class="grand-total-row">
          <td>Grand Total</td>
          <td>${fullMarksTotal}</td>
          <td>${passMarksTotal}</td>
          <td><strong>${obtainedTotal}</strong></td>
        </tr>
      </tbody>
    </table>
  `;
}

function marksheetHighClassValue(subject, value, passMarks) {
  const displayValue = marksheetDisplayValue(value);
  const failed = isGradeSubject(subject)
    ? getGradeStatus(value).className !== "pass"
    : getStatus(value, passMarks).className !== "pass";
  return failed ? `<span class="failed-mark">${displayValue}</span>` : displayValue;
}

function marksheetDisplayValue(value) {
  return value === "" ? "AB" : escapeHtml(value);
}

function marksheetComponentValue(value) {
  return value === "" ? '<span class="failed-mark">AB</span>' : escapeHtml(value);
}

function marksheetTotalValue(value) {
  const displayValue = marksheetDisplayValue(value);
  return value === "" || numericMark(value) < 50 ? `<span class="failed-mark">${displayValue}</span>` : displayValue;
}

function marksheetStandaloneValue(result) {
  const displayValue = marksheetDisplayValue(result.value);
  const failed = result.value === "" || (result.countsForResult && numericMark(result.value) < 50);
  return failed ? `<span class="failed-mark">${displayValue}</span>` : displayValue;
}

function studentDetail(label, value) {
  return `<div>${escapeHtml(label)}<strong>${escapeHtml(value || "-")}</strong></div>`;
}

function getMarksheetRemark(outcome) {
  if (outcome.result === "Fail") return "Turn setbacks into strength.";
  if (outcome.result === "Simple Pass") return "Success is still within reach.";
  if (outcome.division === "Dist.") return "A remarkable academic achievement.";
  if (outcome.division === "I") return "An excellent performance indeed.";
  if (outcome.division === "II") return "A good effort displayed.";
  if (outcome.division === "III") return "A satisfactory outcome achieved.";
  return "-";
}

function formatResultMark(subject, value, passMarks) {
  const displayValue = value === "" ? "AB" : value;
  const subjectPassMarks = getSubjectPassMarks(selectedClass(), selectedExam(), subject);
  const failed = isGradeSubject(subject)
    ? getGradeStatus(value).className !== "pass"
    : !isNoPassMarkSubject(selectedClass(), selectedExam(), subject)
      && getStatus(value, subjectPassMarks).className !== "pass";
  return `<td>${failed
    ? `<span class="failed-mark">${escapeHtml(displayValue)}</span>`
    : escapeHtml(displayValue)}</td>`;
}

function printResults() {
  if (!canViewResult()) {
    showToast("Publish the result before printing results.");
    return;
  }
  printView("results");
}

function saveResultsPdf() {
  if (!canViewResult()) {
    showToast("Publish the result before saving PDF.");
    return;
  }
  showToast('Choose "Save as PDF" in the print dialog.');
  printView("results");
}

function printMarksheets() {
  if (!canViewResult()) {
    showToast("Publish the result before printing marksheets.");
    return;
  }
  printView("marksheets");
}

function saveMarksheetsPdf() {
  if (!canViewResult()) {
    showToast("Publish the result before saving PDF.");
    return;
  }
  showToast('Choose "Save as PDF" in the print dialog.');
  printView("marksheets");
}

function printView(view) {
  document.body.classList.remove("print-results", "print-marksheets");
  document.body.classList.add(`print-${view}`);
  window.print();
  setTimeout(() => document.body.classList.remove(`print-${view}`), 0);
}

function renderStudents() {
  const admin = isAdmin();
  els.studentsBody.innerHTML = sortedStudents().map((student) => `
    <tr>
      <td>${student.roll}</td>
      <td>${escapeHtml(student.idNo || "-")}</td>
      <td>${escapeHtml(student.name)}</td>
      <td>${escapeHtml(formatDisplayDate(student.dateOfBirth) || "-")}</td>
      <td>${escapeHtml(student.fatherName || "-")}</td>
      <td>${escapeHtml(student.motherName || "-")}</td>
      <td>${escapeHtml(student.address || "-")}</td>
      <td>${escapeHtml(student.pen || "-")}</td>
      <td>${escapeHtml(student.aadhaarNo || "-")}</td>
      <td>
        ${admin ? `<div class="row-actions">
          <button class="ghost-button" type="button" data-edit-roll="${student.roll}">Edit</button>
          <button class="ghost-button danger" type="button" data-remove-roll="${student.roll}">Remove</button>
        </div>` : "-"}
      </td>
    </tr>
  `).join("");

  document.querySelectorAll("[data-edit-roll]").forEach((button) => {
    button.addEventListener("click", () => editStudent(Number(button.dataset.editRoll)));
  });
  document.querySelectorAll("[data-remove-roll]").forEach((button) => {
    button.addEventListener("click", () => removeStudent(Number(button.dataset.removeRoll)));
  });
}

function sortedStudents() {
  return [...(state.classes[selectedClass()] || [])].sort((a, b) => a.roll - b.roll);
}

function getStatus(value, passMarks) {
  if (value === "" || value === undefined || value === null) return { label: "Absent", className: "absent" };
  const number = Number(value);
  if (Number.isNaN(number)) return { label: "Absent", className: "absent" };
  return number >= passMarks
    ? { label: "Pass", className: "pass" }
    : { label: "Fail", className: "fail" };
}

function getGradeStatus(value) {
  if (value === "" || value === undefined || value === null) return { label: "Absent", className: "absent" };
  const grade = String(value).trim().toUpperCase();
  return ["A", "B", "C", "D"].includes(grade)
    ? { label: "Pass", className: "pass" }
    : { label: "Fail", className: "fail" };
}

function roundUpPercentage(total, maximum) {
  return maximum ? (Math.ceil((total / maximum) * 10000) / 100).toFixed(2) : "0.00";
}

function calculateOutcome(markValues, passMarks, percentage, className = selectedClass(), exam = selectedExam(), gradeValues = []) {
  const numericFailCount = markValues.filter((entry) => {
    const value = entry && typeof entry === "object" ? entry.value : entry;
    const requiredPassMarks = entry && typeof entry === "object" ? entry.passMarks : passMarks;
    return getStatus(value, requiredPassMarks).className !== "pass";
  }).length;
  const gradeFailCount = gradeValues.filter((value) => getGradeStatus(value).className !== "pass").length;
  const failCount = numericFailCount + gradeFailCount;

  if (isPrimaryUnitTest(className, exam)) {
    const division = failCount === 0 ? getPrimaryDivision(percentage) : "-";
    const result = failCount === 0 ? "Pass" : failCount === 1 ? "Simple Pass" : "Fail";
    return {
      failCount,
      result,
      division,
      grade: getPrimaryGrade(percentage)
    };
  }

  if (isHighContinuousTest(className, exam)) {
    const division = failCount === 0 ? getHighContinuousDivision(percentage) : "-";
    const result = failCount === 0 ? "Pass" : failCount === 1 ? "Simple Pass" : "Fail";
    return {
      failCount,
      result,
      division,
      grade: result === "Pass" ? getHighContinuousGrade(percentage) : "-"
    };
  }

  const failed = failCount > 0;
  const result = failCount === 0 ? "Pass" : failCount === 1 ? "Simple Pass" : "Fail";
  const lowerClass = isLkgToClassEight(className);
  return {
    failCount,
    result,
    division: result === "Pass"
      ? (lowerClass ? getPrimaryDivision(percentage) : getDivision(percentage, false))
      : "-",
    grade: lowerClass ? getPrimaryGrade(percentage) : "-"
  };
}

function getPrimaryDivision(percentage) {
  if (percentage >= 80) return "Dist.";
  if (percentage >= 70) return "I";
  if (percentage >= 60) return "II";
  if (percentage >= 50) return "III";
  return "-";
}

function getHighContinuousDivision(percentage) {
  if (percentage >= 75) return "Dist.";
  if (percentage >= 60) return "I";
  if (percentage >= 50) return "II";
  if (percentage >= 33) return "III";
  return "-";
}

function getHighContinuousGrade(percentage) {
  if (percentage >= 75) return "O";
  if (percentage >= 60) return "A";
  if (percentage >= 50) return "B";
  if (percentage >= 33) return "C";
  return "-";
}

function getPrimaryGrade(percentage) {
  if (percentage >= 80) return "O";
  if (percentage >= 70) return "A";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  return "D";
}

function resultStatusClass(result) {
  if (result === "Fail") return "fail";
  if (result === "Simple Pass") return "absent";
  return "pass";
}

function emptyResultOutcome() {
  return { failCount: 0, result: "-", division: "-", grade: "-" };
}

function formatResultStatus(result) {
  return result === "-"
    ? "-"
    : `<span class="status-pill ${resultStatusClass(result)}">${escapeHtml(result)}</span>`;
}

function getDivision(percentage, failed) {
  if (failed || percentage < 33) return "Fail";
  if (percentage >= 75) return "Dist.";
  if (percentage >= 60) return "I";
  if (percentage >= 45) return "II";
  return "III";
}

function publishCurrentResult() {
  if (!isAdmin()) {
    showToast("Only admin can publish results.");
    return;
  }
  if (hasUnsavedLocalChanges()) {
    showToast("Save changes before publishing results.");
    return;
  }

  state.published[examKey()] = {
    publishedAt: new Date().toISOString()
  };
  saveState();
  render();
  showToast(`${selectedClass()} ${selectedExam()} published.`);
}

function unpublishCurrentResult() {
  if (!isAdmin()) {
    showToast("Only admin can unpublish results.");
    return;
  }
  if (hasUnsavedLocalChanges()) {
    showToast("Save changes before unpublishing results.");
    return;
  }

  delete state.published[examKey()];
  saveState();
  render();
  showToast(`${selectedClass()} ${selectedExam()} unpublished.`);
}

function exportCsv() {
  const students = sortedStudents();
  const maxMarks = getMaxMarks();
  const passMarks = getPassMarks();
  const subjects = currentSubjects();
  const subjectsForMarks = markSubjects();
  const term = isTermExam();
  const showMeasurements = term && !isHighClass();
  const workingDays = getWorkingDays();
  const rows = [
    ["Roll No.", "Student Name", ...subjects, ...(term ? ["Attendance"] : []), ...(showMeasurements ? ["Height (in cm)", "Weight (in kg)"] : []), isHighClass() ? "Grand Total" : "Total", "Percentage", "Division", "Result"]
  ];

  students.forEach((student) => {
    const values = subjects.map((subject) => getStudentMark(student, subject).value);
    const markValues = subjectsForMarks.map((subject) => getStudentMark(student, subject).value);
    const resultMarkValues = outcomeMarkValues(student, subjectsForMarks);
    const gradeValues = subjects.filter((subject) => isGradeSubject(subject)).map((subject) => getStudentMark(student, subject).value);
    const numbers = markValues.map((value) => Number(value)).filter((value) => !Number.isNaN(value));
    const total = Math.round(numbers.reduce((sum, value) => sum + value, 0));
    const percent = roundUpPercentage(total, marksMaximum(subjectsForMarks));
    const appeared = values.some((value) => value !== "");
    const calculatedOutcome = calculateOutcome(resultMarkValues, passMarks, Number(percent), selectedClass(), selectedExam(), gradeValues);
    const outcome = appeared ? calculatedOutcome : emptyResultOutcome();
    const attendance = getStudentAttendance(student);
    const measurement = getStudentMeasurement(student);
    rows.push([
      student.roll,
      student.name,
      ...values.map((value) => value === "" ? "AB" : value),
      ...(term ? [attendance === "" ? "" : `${attendance}/${workingDays}`] : []),
      ...(showMeasurements ? [measurement.height, measurement.weight] : []),
      total,
      `${percent}%`,
      outcome.division,
      outcome.result
    ]);
  });

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${selectedClass()}-${selectedExam()}-results.csv`.replaceAll(" ", "-");
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

async function exportExcelFromFirestore() {
  if (!isAdmin()) {
    showToast("Only admin can export Excel files.");
    return;
  }
  if (hasUnsavedLocalChanges()) {
    showToast("Save changes before exporting to Excel.");
    return;
  }
  if (!window.XLSX) {
    showToast("Excel export library is still loading. Please try again.");
    return;
  }
  if (!window.MarkHubFirebase?.getAppStateOnce) {
    showToast("Firestore is not ready for Excel export.");
    return;
  }

  const button = els.exportExcelBtn;
  const previousLabel = button?.textContent;
  if (button) {
    button.disabled = true;
    button.textContent = "Exporting...";
  }

  const previousState = state;
  const uiState = captureUiState();

  try {
    const remoteState = await window.MarkHubFirebase.getAppStateOnce();
    let exportPackage = null;

    if (remoteState) {
      state = normalizeState(remoteState);
      exportPackage = buildExcelExportFromAppState();
    } else if (window.MarkHubFirebase?.getAllResultsOnce) {
      const resultDocs = await window.MarkHubFirebase.getAllResultsOnce();
      exportPackage = buildExcelExportFromResultDocs(resultDocs);
    }

    if (!exportPackage || exportPackage.rows.length === 0) {
      showToast("No Firestore result data found to export.");
      return;
    }

    downloadExcelWorkbook(exportPackage.rows, exportPackage.headers);
    showToast("Excel file exported successfully.");
  } catch (error) {
    console.error("[Firestore] Excel export failed", error);
    showToast("Could not export Excel file. Please try again.");
  } finally {
    state = previousState;
    applyRemoteStateToCurrentView(uiState);
    if (button) {
      button.disabled = false;
      button.textContent = previousLabel || "Export to Excel";
    }
  }
}

function buildExcelExportFromAppState() {
  const headers = [
    "Academic Session",
    "Exam",
    "Roll Number",
    "Name",
    "Class",
    "Percentage",
    "Division",
    "Result",
    "Total",
    "Full Marks"
  ];
  const rows = [];

  Object.keys(state.classes || {}).forEach((className) => {
    currentExams(className).forEach((exam) => {
      runWithExportSelection(className, exam, () => {
        const students = [...(state.classes[className] || [])].sort((a, b) => a.roll - b.roll);
        students.forEach((student) => {
          const record = calculateExcelResultRecord(student);
          const row = {
            "Academic Session": state.academicSession,
            Exam: exam,
            "Roll Number": student.roll,
            Name: student.name,
            Class: className,
            Percentage: record.percentage === "-" ? "-" : `${record.percentage}%`,
            Division: record.outcome.division,
            Result: record.outcome.result,
            Total: record.total,
            "Full Marks": record.maximumTotal
          };
          addExcelSubjectMarks(row, headers, student, record);
          rows.push(row);
        });
      });
    });
  });

  return { headers, rows };
}

function buildExcelExportFromResultDocs(resultDocs) {
  const headers = ["Roll Number"];
  const rows = resultDocs.map((result) => {
    const row = { "Roll Number": result.id || "" };
    Object.entries(result).forEach(([key, value]) => {
      if (key === "id") return;
      addExcelHeader(headers, key);
      row[key] = value ?? "";
    });
    return row;
  });
  return { headers, rows };
}

function runWithExportSelection(className, exam, callback) {
  const previousClass = els.classSelect.value;
  const previousExam = els.examSelect.value;
  const previousSubject = els.subjectSelect.value;

  els.classSelect.value = className;
  updateExamSelect();
  setSelectValueIfAvailable(els.examSelect, exam);
  updateSubjectSelect();

  try {
    return callback();
  } finally {
    setSelectValueIfAvailable(els.classSelect, previousClass);
    updateExamSelect();
    setSelectValueIfAvailable(els.examSelect, previousExam);
    updateSubjectSelect();
    setSelectValueIfAvailable(els.subjectSelect, previousSubject);
  }
}

function calculateExcelResultRecord(student) {
  if (isStructuredResultSheet()) return calculateStructuredExcelRecord(student);

  const subjects = currentSubjects();
  const subjectsForMarks = markSubjects();
  const values = subjects.map((subject) => getStudentMark(student, subject).value);
  const markValues = subjectsForMarks.map((subject) => getStudentMark(student, subject).value);
  const resultMarkValues = outcomeMarkValues(student, subjectsForMarks);
  const gradeValues = subjects.filter((subject) => isGradeSubject(subject)).map((subject) => getStudentMark(student, subject).value);
  const numbers = markValues.map((value) => Number(value)).filter((value) => !Number.isNaN(value));
  const total = Math.round(numbers.reduce((sum, value) => sum + value, 0));
  const maximumTotal = marksMaximum(subjectsForMarks);
  const percentage = roundUpPercentage(total, maximumTotal);
  const appeared = values.some((value) => value !== "");
  const calculatedOutcome = calculateOutcome(resultMarkValues, getPassMarks(), Number(percentage), selectedClass(), selectedExam(), gradeValues);

  return {
    total,
    maximumTotal,
    percentage,
    outcome: appeared ? calculatedOutcome : emptyResultOutcome(),
    appeared,
    structured: false
  };
}

function calculateStructuredExcelRecord(student) {
  const subjects = currentSubjects();
  const structure = getTermSubjectStructure(subjects);
  const highThirdTermSheet = isHighThirdTermResult();
  const subjectResults = structure.groups.map((group) => getStructuredSubjectResult(student, group));
  const standaloneResults = structure.standalone.map((subject) => getStructuredStandaloneResult(student, subject));
  const resultSubjects = highThirdTermSheet
    ? subjectResults.map((subjectResult) => ({
      value: subjectResult.total,
      failed: subjectResult.activities === "" || numericMark(subjectResult.activities) < 7
        || subjectResult.exam === "" || numericMark(subjectResult.exam) < 26
    }))
    : subjectResults.map((subjectResult) => subjectResult.total);
  const gradeValues = standaloneResults.filter((subjectResult) => subjectResult.graded).map((subjectResult) => subjectResult.value);
  const total = Math.round(subjectResults.reduce((sum, subjectResult) => sum + numericMark(subjectResult.total), 0)
    + standaloneResults.filter((subjectResult) => subjectResult.countsForTotal)
      .reduce((sum, subjectResult) => sum + numericMark(subjectResult.value), 0));
  const maximumTotal = (subjectResults.length * 100)
    + standaloneResults.filter((subjectResult) => subjectResult.countsForTotal)
      .reduce((sum, subjectResult) => sum + subjectResult.maxMarks, 0);
  const percentage = roundUpPercentage(total, maximumTotal);
  const appeared = subjectResults.some((subjectResult) => subjectResult.hasMark)
    || standaloneResults.some((subjectResult) => subjectResult.value !== "");

  return {
    total,
    maximumTotal,
    percentage,
    outcome: appeared ? calculateStructuredTermOutcome(resultSubjects, Number(percentage), gradeValues) : emptyResultOutcome(),
    appeared,
    structured: true,
    structure,
    subjectResults,
    standaloneResults
  };
}

function addExcelSubjectMarks(row, headers, student, record) {
  marksEntrySubjects(selectedClass(), selectedExam()).forEach((subject) => {
    const mark = getStudentMark(student, subject);
    addExcelHeader(headers, subject);
    row[subject] = mark.value ?? "";

    if (mark.partA !== undefined || mark.partB !== undefined) {
      addExcelHeader(headers, `${subject} Part A`);
      addExcelHeader(headers, `${subject} Part B`);
      row[`${subject} Part A`] = mark.partA ?? "";
      row[`${subject} Part B`] = mark.partB ?? "";
    }
  });

  if (!record.structured) return;

  record.structure.groups.forEach((group, index) => {
    const subjectResult = record.subjectResults[index];
    const prefix = group.name;
    const componentNames = isHighThirdTermResult()
      ? ["F.A.", "S.A.", "Total"]
      : selectedExam() === "Third Term"
        ? ["First Term (30%)", "Second Term (30%)", "Third Term (40%)", "Total"]
        : ["Activities", "Unit Test", "Exam", "Total"];
    const componentValues = isHighThirdTermResult()
      ? [subjectResult.activities, subjectResult.exam, subjectResult.total]
      : [subjectResult.activities, subjectResult.unitTest, subjectResult.exam, subjectResult.total];

    componentNames.forEach((componentName, componentIndex) => {
      const header = `${prefix} ${componentName}`;
      addExcelHeader(headers, header);
      row[header] = componentValues[componentIndex] ?? "";
    });
  });
}

function addExcelHeader(headers, header) {
  if (!headers.includes(header)) headers.push(header);
}

function downloadExcelWorkbook(rows, headers) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  worksheet["!cols"] = headers.map((header) => ({
    wch: Math.max(12, Math.min(32, String(header).length + 3))
  }));
  XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
  XLSX.writeFile(workbook, `Results_${todayStamp()}.xlsx`);
}

function todayStamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function downloadStudentCsvTemplate() {
  if (!isAdmin()) {
    showToast("Only admin can download student CSV templates.");
    return;
  }
  const rows = [
    ["Roll No.", "ID No.", "Name", "Date of Birth", "Father's Name", "Mother's Name", "Address", "PEN", "Aadhaar No."],
    [1, "ID-001", "Student Name", "2015-01-01", "Father Name", "Mother Name", "Address", "PEN", "Aadhaar No."]
  ];
  downloadCsv(rows, `${selectedClass()}-student-import-template.csv`);
}

function downloadMarksCsvTemplate() {
  if (!isAdmin()) {
    showToast("Only admin can download marks CSV templates.");
    return;
  }
  const splitPartSubject = isSplitPartSubject();
  const valueHeader = isGradeSubject()
    ? "Grade"
    : isActivitiesSubject()
      ? "Project, Assign., Book Maintenance"
      : splitPartSubject
        ? "Marks"
      : "Marks";
  const headers = splitPartSubject ? ["Roll No.", "Name", "Part A", "Part B", valueHeader] : ["Roll No.", "Name", valueHeader];
  const rows = [
    headers,
    ...sortedStudents().map((student) => {
      const mark = getStudentMark(student);
      if (splitPartSubject) return [student.roll, student.name, mark.partA ?? "", mark.partB ?? "", mark.value];
      return [student.roll, student.name, isActivitiesSubject() ? mark.project : mark.value];
    })
  ];
  downloadCsv(rows, `${selectedClass()}-${selectedExam()}-${selectedSubject()}-marks-template.csv`);
}

async function importMarksCsv(event) {
  if (!isAdmin()) {
    event.target.value = "";
    showToast("Only admin can import marks CSV.");
    return;
  }
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const rows = parseCsv(await file.text());
    const result = mergeMarksFromCsv(rows);
    render();
    showToast(`${result.updated} marks imported, ${result.skipped} rows skipped. Click Save to save.`);
  } catch (error) {
    showToast(error.message || "Could not import marks CSV.");
  } finally {
    event.target.value = "";
  }
}

function mergeMarksFromCsv(rows) {
  if (rows.length < 2) {
    throw new Error("CSV must include a header and at least one marks row.");
  }

  const headers = rows[0].map(normalizeCsvHeader);
  const rollIndex = headers.findIndex((header) => header === "roll" || header === "rollno" || header === "rollnumber");
  const partAIndex = headers.findIndex((header) => header === "parta");
  const partBIndex = headers.findIndex((header) => header === "partb");
  const valueIndex = headers.findIndex((header) => header === "marks" || header === "mark" || header === "grade"
    || header === "projectassignbookmaintenance");
  const splitPartSubject = isSplitPartSubject();

  if (rollIndex === -1 || (!splitPartSubject && valueIndex === -1) || (splitPartSubject && partAIndex === -1 && partBIndex === -1 && valueIndex === -1)) {
    throw new Error('CSV headers must include "Roll No." and "Marks" or "Grade".');
  }

  const studentsByRoll = new Map(sortedStudents().map((student) => [student.roll, student]));
  const gradeSubject = isGradeSubject();
  const activitiesSubject = isActivitiesSubject();
  const maxMarks = getSubjectMaxMarks();
  let updated = 0;
  let skipped = 0;

  rows.slice(1).forEach((row) => {
    if (row.every((cell) => String(cell).trim() === "")) return;

    const roll = Number(String(row[rollIndex] ?? "").trim());
    const rawValue = String(row[valueIndex] ?? "").trim();

    const hasSplitPartCsvValue = splitPartSubject
      && ((partAIndex !== -1 && String(row[partAIndex] ?? "").trim() !== "")
        || (partBIndex !== -1 && String(row[partBIndex] ?? "").trim() !== ""));

    if (!Number.isInteger(roll) || !studentsByRoll.has(roll) || (!hasSplitPartCsvValue && rawValue === "")) {
      skipped += 1;
      return;
    }

    if (gradeSubject) {
      const grade = rawValue.toUpperCase();
      if (!["A", "B", "C", "D", "E"].includes(grade)) {
        skipped += 1;
        return;
      }
      setStudentMark(roll, { value: grade }, { save: false });
      updated += 1;
      return;
    }

    if (splitPartSubject) {
      const rawPartA = partAIndex === -1 ? "" : String(row[partAIndex] ?? "").trim();
      const rawPartB = partBIndex === -1 ? "" : String(row[partBIndex] ?? "").trim();
      const hasParts = rawPartA !== "" || rawPartB !== "";
      const partA = rawPartA === "" ? "" : Number(rawPartA);
      const partB = rawPartB === "" ? "" : Number(rawPartB);
      const directValue = rawValue === "" ? "" : Number(rawValue);
      const value = hasParts ? roundMarkTotal(numericMark(partA) + numericMark(partB)) : directValue;
      if ((rawPartA !== "" && (!Number.isFinite(partA) || partA < 0))
        || (rawPartB !== "" && (!Number.isFinite(partB) || partB < 0))
        || value === "" || !Number.isFinite(value) || value < 0 || value > maxMarks) {
        skipped += 1;
        return;
      }
      setStudentMark(roll, {
        partA: rawPartA === "" ? "" : partA,
        partB: rawPartB === "" ? "" : partB,
        value
      }, { save: false });
      updated += 1;
      return;
    }

    const mark = Number(rawValue);
    const allowedMaximum = activitiesSubject ? 15 : maxMarks;
    if (!Number.isFinite(mark) || mark < 0 || mark > allowedMaximum) {
      skipped += 1;
      return;
    }

    if (activitiesSubject) {
      const attendanceMarks = getAttendanceMarks(
        getStudentAttendance({ roll }),
        getWorkingDays(),
        selectedClass()
      );
      setStudentMark(roll, { project: mark, value: mark + attendanceMarks }, { save: false });
    } else {
      setStudentMark(roll, { value: mark }, { save: false });
    }
    updated += 1;
  });

  return { updated, skipped };
}

async function importStudentsCsv(event) {
  if (!isAdmin()) {
    event.target.value = "";
    showToast("Only admin can import students CSV.");
    return;
  }
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const rows = parseCsv(await file.text());
    const result = mergeStudentsFromCsv(rows);
    saveState();
    render();
    showToast(`${result.added} added, ${result.updated} updated, ${result.skipped} skipped.`);
  } catch (error) {
    showToast(error.message || "Could not import CSV.");
  } finally {
    event.target.value = "";
  }
}

function mergeStudentsFromCsv(rows) {
  if (rows.length < 2) {
    throw new Error("CSV must include a header and at least one student.");
  }

  const headers = rows[0].map(normalizeCsvHeader);
  const rollIndex = headers.findIndex((header) => header === "roll" || header === "rollno" || header === "rollnumber");
  const idNoIndex = headers.findIndex((header) => header === "idno" || header === "idnumber");
  const nameIndex = headers.findIndex((header) => header === "name" || header === "studentname");
  const dobIndex = headers.findIndex((header) => header === "dateofbirth" || header === "dob");
  const fatherIndex = headers.findIndex((header) => header === "fathersname" || header === "fathername");
  const motherIndex = headers.findIndex((header) => header === "mothersname" || header === "mothername");
  const addressIndex = headers.findIndex((header) => header === "address");
  const penIndex = headers.findIndex((header) => header === "pen");
  const aadhaarIndex = headers.findIndex((header) => header === "aadhaarno" || header === "aadharnumber" || header === "aadhaarnumber");

  if (rollIndex === -1 || nameIndex === -1) {
    throw new Error('CSV headers must include "Roll No." and "Name".');
  }

  const students = state.classes[selectedClass()];
  const studentsByRoll = new Map(students.map((student) => [student.roll, student]));
  const importedByRoll = new Map();
  let skipped = 0;

  rows.slice(1).forEach((row) => {
    if (row.every((cell) => String(cell).trim() === "")) return;

    const rollText = String(row[rollIndex] ?? "").trim();
    const name = String(row[nameIndex] ?? "").trim();
    const roll = Number(rollText);

    if (!Number.isInteger(roll) || roll < 1 || !name) {
      skipped += 1;
      return;
    }

    importedByRoll.set(roll, {
      roll,
      idNo: csvValue(row, idNoIndex),
      name,
      dateOfBirth: formatDateForInput(csvValue(row, dobIndex)) || csvValue(row, dobIndex),
      fatherName: csvValue(row, fatherIndex),
      motherName: csvValue(row, motherIndex),
      address: csvValue(row, addressIndex),
      pen: csvValue(row, penIndex),
      aadhaarNo: csvValue(row, aadhaarIndex)
    });
  });

  let added = 0;
  let updated = 0;

  importedByRoll.forEach((imported, roll) => {
    const existing = studentsByRoll.get(roll);
    if (existing) {
      const changed = ["idNo", "name", "dateOfBirth", "fatherName", "motherName", "address", "pen", "aadhaarNo"]
        .some((field) => existing[field] !== imported[field]);
      if (changed) {
        Object.assign(existing, imported);
        updated += 1;
      }
      return;
    }

    students.push(imported);
    added += 1;
  });

  return { added, updated, skipped };
}

function csvValue(row, index) {
  return index === -1 ? "" : String(row[index] ?? "").trim();
}

function normalizeCsvHeader(value) {
  return String(value)
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (character === '"' && quoted && nextCharacter === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (quoted) throw new Error("CSV contains an unclosed quoted value.");
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function downloadCsv(rows, filename) {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.replaceAll(" ", "-");
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function formatDisplayDate(value) {
  const text = String(value || "").trim();
  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!isoMatch) return text;
  return `${isoMatch[3]}-${isoMatch[2]}-${isoMatch[1]}`;
}

function formatDateForInput(value) {
  const text = String(value || "").trim();
  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return text;
  const displayMatch = text.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (displayMatch) return `${displayMatch[3]}-${displayMatch[2]}-${displayMatch[1]}`;
  return "";
}

function resetDemo() {
  if (!isAdmin()) {
    showToast("Only admin can reset data.");
    return;
  }
  if (hasUnsavedLocalChanges() && !window.confirm("You have unsaved changes. Reset without saving?")) return;
  unsavedMarkChanges.clear();
  unsavedAttendanceChanges = false;
  deferredFullStateSaveAfterMarks = false;
  state = structuredClone(defaultState);
  saveState();
  els.academicSessionInput.value = state.academicSession;
  populateSelect(els.classSelect, Object.keys(state.classes));
  populateSelect(els.studentsClassSelect, Object.keys(state.classes));
  syncStudentsClassSelect();
  updateExamSelect();
  updateSubjectSelect();
  populateSelect(els.attendanceClassSelect, Object.keys(state.classes));
  populateSelect(els.attendanceTermSelect, termExams);
  updateAttendanceInputs();
  render();
  showToast("Demo data reset.");
}

function clearMarks() {
  const subject = selectedSubject();
  const className = selectedClass();
  const exam = selectedExam();
  const key = markKey(className, exam, subject);
  if (!window.confirm(`Clear all ${subject} marks for ${className} ${exam}?`)) return;
  state.marks[key] = {};
  delete state.marks[key];
  trackSubjectMarksCleared(className, exam, subject);
  render();
  showToast(`${subject} marks cleared. Click Save to save.`);
}

function addStudent(event) {
  event.preventDefault();
  const roll = Number(document.querySelector("#rollInput").value);
  const idNo = document.querySelector("#idNoInput").value.trim();
  const name = document.querySelector("#nameInput").value.trim();
  let dateOfBirth = document.querySelector("#dobInput").value;
  const fatherName = document.querySelector("#fatherNameInput").value.trim();
  const motherName = document.querySelector("#motherNameInput").value.trim();
  const address = document.querySelector("#addressInput").value.trim();
  const pen = document.querySelector("#penInput").value.trim();
  const aadhaarNo = document.querySelector("#aadhaarNoInput").value.trim();
  const students = state.classes[selectedClass()];

  if (!roll || !name) return;
  if (students.some((student) => student.roll === roll && student.roll !== editingStudentRoll)) {
    showToast("That roll number already exists.");
    return;
  }

  if (editingStudentRoll !== null) {
    const index = students.findIndex((student) => student.roll === editingStudentRoll);
    if (index !== -1 && dateOfBirth === "" && students[index].dateOfBirth) {
      dateOfBirth = students[index].dateOfBirth;
    }
    if (index !== -1) students[index] = { roll, idNo, name, dateOfBirth, fatherName, motherName, address, pen, aadhaarNo };
    if (roll !== editingStudentRoll) moveStudentRecords(editingStudentRoll, roll);
  } else {
    students.push({ roll, idNo, name, dateOfBirth, fatherName, motherName, address, pen, aadhaarNo });
  }
  saveState();
  const message = editingStudentRoll !== null ? `${name} updated.` : `${name} added.`;
  cancelStudentEdit();
  render();
  showToast(message);
}

function editStudent(roll) {
  const student = state.classes[selectedClass()].find((item) => item.roll === roll);
  if (!student) return;
  editingStudentRoll = roll;
  document.querySelector("#rollInput").value = student.roll;
  document.querySelector("#idNoInput").value = student.idNo;
  document.querySelector("#nameInput").value = student.name;
  document.querySelector("#dobInput").value = formatDateForInput(student.dateOfBirth);
  document.querySelector("#fatherNameInput").value = student.fatherName;
  document.querySelector("#motherNameInput").value = student.motherName;
  document.querySelector("#addressInput").value = student.address;
  document.querySelector("#penInput").value = student.pen;
  document.querySelector("#aadhaarNoInput").value = student.aadhaarNo;
  document.querySelector("#studentSubmitBtn").textContent = "Update Student";
  document.querySelector("#cancelStudentEditBtn").classList.remove("hidden");
  document.querySelector("#studentForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelStudentEdit() {
  editingStudentRoll = null;
  document.querySelector("#studentForm").reset();
  document.querySelector("#studentSubmitBtn").textContent = "Add Student";
  document.querySelector("#cancelStudentEditBtn").classList.add("hidden");
}

function moveStudentRecords(oldRoll, newRoll) {
  [state.marks, state.attendance, state.measurements].forEach((collection) => {
    Object.keys(collection).forEach((key) => {
      if (!key.startsWith(`${selectedClass()}::`) || collection[key]?.[String(oldRoll)] === undefined) return;
      collection[key][String(newRoll)] = collection[key][String(oldRoll)];
      delete collection[key][String(oldRoll)];
    });
  });
}

function removeStudent(roll) {
  const student = (state.classes[selectedClass()] || []).find((entry) => entry.roll === roll);
  const studentLabel = student ? `${student.name} (Roll No. ${student.roll})` : `Roll No. ${roll}`;
  const confirmed = window.confirm(`Remove ${studentLabel}? This will also delete this student's marks, attendance, and measurements for ${selectedClass()}.`);
  if (!confirmed) return;

  state.classes[selectedClass()] = state.classes[selectedClass()].filter((student) => student.roll !== roll);
  Object.keys(state.marks).forEach((key) => {
    if (key.startsWith(`${selectedClass()}::`)) {
      delete state.marks[key][String(roll)];
    }
  });
  Object.keys(state.attendance).forEach((key) => {
    if (key.startsWith(`${selectedClass()}::`)) {
      delete state.attendance[key][String(roll)];
    }
  });
  Object.keys(state.measurements).forEach((key) => {
    if (key.startsWith(`${selectedClass()}::`)) {
      delete state.measurements[key][String(roll)];
    }
  });
  saveState();
  render();
  showToast("Student removed.");
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return "";
  return Math.min(Math.max(value, min), max);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

init();
