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

const analysisSectionClasses = {
  "All Classes": classNames,
  "Foundational Stage": ["LKG", "UKG", "Class I", "Class II"],
  "Preparatory Stage": ["Class III", "Class IV", "Class V"],
  "Elementary": ["Class VI", "Class VII", "Class VIII"],
  "High School": ["Class IX", "Class X"]
};

const analysisExamAll = "All Exams";

const analysisSubjectReasonAbbreviations = {
  English: "E",
  Mizo: "Mz",
  Hindi: "H",
  Mathematics: "M",
  "E.V.S.": "Ev",
  Science: "Sc",
  "Social Science": "SS",
  Moral: "Mo"
};

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

const entryAccessGroups = {
  classes1to8: {
    title: "Classes I-VIII",
    classRange: "Classes I-VIII",
    exams: [
      { key: "FTUT1", label: "First Term Unit Test 1", appExam: "FT Unit Test 1" },
      { key: "FTUT2", label: "First Term Unit Test 2", appExam: "FT Unit Test 2" },
      { key: "FirstTerm", label: "First Term Examination", appExam: "First Term" },
      { key: "STUT1", label: "Second Term Unit Test 1", appExam: "ST Unit Test 1" },
      { key: "STUT2", label: "Second Term Unit Test 2", appExam: "ST Unit Test 2" },
      { key: "SecondTerm", label: "Second Term Examination", appExam: "Second Term" },
      { key: "ThirdTerm", label: "Third Term Examination", appExam: "Third Term" }
    ]
  },
  classes9to10: {
    title: "Classes IX-X",
    classRange: "Classes IX-X",
    exams: [
      { key: "CT1", label: "Class Test 1 (CT1)", appExam: "CT1" },
      { key: "CT2", label: "Class Test 2 (CT2)", appExam: "CT2" },
      { key: "FirstTerm", label: "First Term Examination", appExam: "First Term" },
      { key: "CT3", label: "Class Test 3 (CT3)", appExam: "CT3" },
      { key: "CT4", label: "Class Test 4 (CT4)", appExam: "CT4" },
      { key: "SecondTerm", label: "Second Term Examination", appExam: "Second Term" },
      { key: "ThirdTerm", label: "Third Term Examination", appExam: "Third Term" }
    ]
  }
};

const attendanceAccessGroups = {
  classesLkgTo8: {
    title: "LKG-Class VIII Attendance",
    classRange: "LKG-Class VIII",
    exams: [
      { key: "FirstTerm", label: "First Term Attendance", appExam: "First Term" },
      { key: "SecondTerm", label: "Second Term Attendance", appExam: "Second Term" },
      { key: "ThirdTerm", label: "Third Term Attendance", appExam: "Third Term" }
    ]
  },
  classes9to10: {
    title: "Classes IX-X Attendance",
    classRange: "Classes IX-X",
    exams: [
      { key: "FirstTerm", label: "First Term Attendance", appExam: "First Term" },
      { key: "SecondTerm", label: "Second Term Attendance", appExam: "Second Term" },
      { key: "ThirdTerm", label: "Third Term Attendance", appExam: "Third Term" }
    ]
  }
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
  entryAccess: createDefaultEntryAccess(),
  attendanceAccess: createDefaultAttendanceAccess(),
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
let entryAccessDraft = normalizeEntryAccess(state.entryAccess);
let attendanceAccessDraft = normalizeAttendanceAccess(state.attendanceAccess);
let entryAccessDirty = false;
let entryAccessSaveInProgress = false;
let activePrintClass = "";
let printCleanupTimer = null;
let restoreMarksheetsAfterPrint = false;
let analysisCurrentData = null;
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
  mobileMenuBtn: document.querySelector("#mobileMenuBtn"),
  mobileMenuCloseBtn: document.querySelector("#mobileMenuCloseBtn"),
  mobileNavDrawer: document.querySelector("#mobileNavDrawer"),
  mobileNavOverlay: document.querySelector("#mobileNavOverlay"),
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
  attendanceAccessNotice: document.querySelector("#attendanceAccessNotice"),
  attendanceClassSelect: document.querySelector("#attendanceClassSelect"),
  attendanceTermSelect: document.querySelector("#attendanceTermSelect"),
  attendanceBody: document.querySelector("#attendanceBody"),
  entryAccessDashboard: document.querySelector("#entryAccessDashboard"),
  entryAccessStatus: document.querySelector("#entryAccessStatus"),
  saveEntryAccessBtn: document.querySelector("#saveEntryAccessBtn"),
  unlockAllEntryAccessBtn: document.querySelector("#unlockAllEntryAccessBtn"),
  lockAllEntryAccessBtn: document.querySelector("#lockAllEntryAccessBtn"),
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
  marksheetPrintArea: document.querySelector("#marksheet-print-area"),
  marksheetBody: document.querySelector("#marksheetBody"),
  marksheetNameSearchInput: document.querySelector("#marksheetNameSearchInput"),
  printCurrentMarksheetBtn: document.querySelector("#printCurrentMarksheetBtn"),
  printAllMarksheetsBtn: document.querySelector("#printAllMarksheetsBtn"),
  downloadMarksheetPdfBtn: document.querySelector("#downloadMarksheetPdfBtn"),
  marksheetZoomInput: document.querySelector("#marksheetZoomInput"),
  marksheetZoomValue: document.querySelector("#marksheetZoomValue"),
  zoomOutMarksheetBtn: document.querySelector("#zoomOutMarksheetBtn"),
  zoomInMarksheetBtn: document.querySelector("#zoomInMarksheetBtn"),
  printResultsBtn: document.querySelector("#printResultsBtn"),
  downloadResultsPdfBtn: document.querySelector("#downloadResultsPdfBtn"),
  analysisSessionSelect: document.querySelector("#analysisSessionSelect"),
  analysisSectionSelect: document.querySelector("#analysisSectionSelect"),
  analysisClassSelect: document.querySelector("#analysisClassSelect"),
  analysisExamSelect: document.querySelector("#analysisExamSelect"),
  analysisSubjectSelect: document.querySelector("#analysisSubjectSelect"),
  analysisStatusSelect: document.querySelector("#analysisStatusSelect"),
  analysisSupportThreshold: document.querySelector("#analysisSupportThreshold"),
  analysisReport: document.querySelector("#analysisReport"),
  analysisReportSubtitle: document.querySelector("#analysisReportSubtitle"),
  analysisOverview: document.querySelector("#analysisOverview"),
  analysisClassChart: document.querySelector("#analysisClassChart"),
  analysisClassHighlight: document.querySelector("#analysisClassHighlight"),
  analysisTrendChart: document.querySelector("#analysisTrendChart"),
  analysisSubjectChart: document.querySelector("#analysisSubjectChart"),
  analysisSubjectHighlight: document.querySelector("#analysisSubjectHighlight"),
  analysisSubjectBody: document.querySelector("#analysisSubjectBody"),
  analysisDivisionChart: document.querySelector("#analysisDivisionChart"),
  analysisPassFailChart: document.querySelector("#analysisPassFailChart"),
  analysisAttendance: document.querySelector("#analysisAttendance"),
  analysisDistributionChart: document.querySelector("#analysisDistributionChart"),
  analysisTopStudents: document.querySelector("#analysisTopStudents"),
  analysisSupportBody: document.querySelector("#analysisSupportBody"),
  analysisStrengths: document.querySelector("#analysisStrengths"),
  analysisWeaknesses: document.querySelector("#analysisWeaknesses"),
  analysisRecommendations: document.querySelector("#analysisRecommendations"),
  downloadAnalysisPdfBtn: document.querySelector("#downloadAnalysisPdfBtn"),
  exportAnalysisExcelBtn: document.querySelector("#exportAnalysisExcelBtn"),
  printAnalysisBtn: document.querySelector("#printAnalysisBtn"),
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
  parsed.entryAccess = normalizeEntryAccess(existingState.entryAccess || parsed.entryAccess);
  parsed.attendanceAccess = normalizeAttendanceAccess(existingState.attendanceAccess || parsed.attendanceAccess);
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

function createDefaultEntryAccess(enabled = false) {
  return Object.fromEntries(
    Object.entries(entryAccessGroups).map(([groupKey, group]) => [
      groupKey,
      Object.fromEntries(group.exams.map((exam) => [exam.key, { enabled }]))
    ])
  );
}

function normalizeEntryAccess(existingAccess = {}) {
  const defaults = createDefaultEntryAccess(false);
  Object.entries(entryAccessGroups).forEach(([groupKey, group]) => {
    group.exams.forEach((exam) => {
      const stored = existingAccess?.[groupKey]?.[exam.key];
      defaults[groupKey][exam.key] = {
        enabled: Boolean(stored?.enabled ?? stored === true)
      };
    });
  });
  return defaults;
}

function createDefaultAttendanceAccess(enabled = false) {
  return Object.fromEntries(
    Object.entries(attendanceAccessGroups).map(([groupKey, group]) => [
      groupKey,
      Object.fromEntries(group.exams.map((exam) => [exam.key, { enabled }]))
    ])
  );
}

function normalizeAttendanceAccess(existingAccess = {}) {
  const defaults = createDefaultAttendanceAccess(false);
  Object.entries(attendanceAccessGroups).forEach(([groupKey, group]) => {
    group.exams.forEach((exam) => {
      const stored = existingAccess?.[groupKey]?.[exam.key];
      defaults[groupKey][exam.key] = {
        enabled: Boolean(stored?.enabled ?? stored === true)
      };
    });
  });
  return defaults;
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
  const locked = selectedMarksEntryLocked();
  els.saveMarksBtn.disabled = marksSaveInProgress || locked || changedCount === 0;
  els.saveMarksBtn.textContent = marksSaveInProgress ? "Saving..." : "Save";
  if (els.entrySaveHint) {
    els.entrySaveHint.textContent = locked
      ? entryAccessLockedMessage(selectedClass(), selectedExam())
      : changedCount
      ? `${changedCount} unsaved mark ${changedCount === 1 ? "change" : "changes"}. Click Save.`
      : "Enter marks, then click Save.";
    els.entrySaveHint.classList.toggle("entry-locked-text", locked);
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
  const locked = selectedAttendanceEntryLocked();
  els.saveAttendanceBtn.disabled = attendanceSaveInProgress || locked || !unsavedAttendanceChanges;
  els.saveAttendanceBtn.textContent = attendanceSaveInProgress ? "Saving..." : "Save";
  els.clearAttendanceBtn.disabled = attendanceSaveInProgress || locked;
  els.workingDaysInput.disabled = locked;
  if (els.attendanceAccessNotice) {
    els.attendanceAccessNotice.textContent = locked
      ? attendanceAccessLockedMessage(selectedAttendanceClass(), selectedAttendanceTerm())
      : "Attendance entry is active for this term.";
    els.attendanceAccessNotice.classList.remove("hidden");
    els.attendanceAccessNotice.classList.toggle("locked", locked);
  }
}

async function saveAttendanceData() {
  if (attendanceSaveInProgress) return;
  if (selectedAttendanceEntryLocked()) {
    showToast("This attendance entry is locked by Administrator.");
    return;
  }
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
  if (selectedMarksEntryLocked()) {
    showToast("This marks entry is locked by Administrator.");
    return;
  }
  const lockedChange = [...unsavedMarkChanges.values()].find((change) => !isEntryAccessOpen(change.className, change.exam));
  if (lockedChange) {
    showToast(`${lockedChange.exam} is locked by Administrator. It was not saved.`);
    return;
  }
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
  const routeView = viewFromLocationHash();
  const saved = localStorage.getItem(uiKey);
  if (!saved) return { ...fallback, activeView: routeView || fallback.activeView };

  try {
    const parsed = JSON.parse(saved);
    const allowedViews = ["entry", "attendance", "results", "marksheet", "students", "analysis", "entryAccess"];
    return {
      ...parsed,
      activeView: allowedViews.includes(routeView) ? routeView : allowedViews.includes(parsed.activeView) ? parsed.activeView : "entry"
    };
  } catch {
    return { ...fallback, activeView: routeView || fallback.activeView };
  }
}

function viewFromLocationHash() {
  const hash = window.location.hash.replace(/^#/, "");
  const routeView = new URLSearchParams(hash).get("view") || hash.replace(/^view=/, "");
  const allowedViews = ["entry", "attendance", "results", "marksheet", "students", "analysis", "entryAccess"];
  return allowedViews.includes(routeView) ? routeView : "";
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
    marksheetNameSearch: els.marksheetNameSearchInput?.value || "",
    analysisSession: els.analysisSessionSelect?.value || state.academicSession,
    analysisSection: els.analysisSectionSelect?.value || "All Classes",
    analysisClass: els.analysisClassSelect?.value || "All Classes",
    analysisExam: els.analysisExamSelect?.value || "First Term",
    analysisSubject: els.analysisSubjectSelect?.value || "All Subjects",
    analysisStatus: els.analysisStatusSelect?.value || "all",
    analysisThreshold: els.analysisSupportThreshold?.value || "50"
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
      const remoteEntryAccess = normalizeEntryAccess(remoteState?.entryAccess);
      if (JSON.stringify(remoteEntryAccess) !== JSON.stringify(state.entryAccess)) {
        state.entryAccess = remoteEntryAccess;
        entryAccessDraft = normalizeEntryAccess(remoteEntryAccess);
        entryAccessDirty = false;
        localStorage.setItem(storageKey, JSON.stringify(state));
        refreshEntryAccessUiOnly();
      }
      const remoteAttendanceAccess = normalizeAttendanceAccess(remoteState?.attendanceAccess);
      if (JSON.stringify(remoteAttendanceAccess) !== JSON.stringify(state.attendanceAccess)) {
        state.attendanceAccess = remoteAttendanceAccess;
        attendanceAccessDraft = normalizeAttendanceAccess(remoteAttendanceAccess);
        entryAccessDirty = false;
        localStorage.setItem(storageKey, JSON.stringify(state));
        refreshEntryAccessUiOnly();
      }
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
    entryAccessDraft = normalizeEntryAccess(state.entryAccess);
    attendanceAccessDraft = normalizeAttendanceAccess(state.attendanceAccess);
    entryAccessDirty = false;
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
  initializeAnalysisFilters(savedUiState);

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
  } else if (activeView === "entryAccess") {
    renderEntryAccessControl();
  } else if (activeView === "results") {
    renderResults();
  } else if (activeView === "marksheet") {
    renderMarksheets();
  } else if (activeView === "students") {
    renderStudents();
  } else if (activeView === "analysis") {
    renderAcademicAnalysis();
  } else {
    render();
  }
}

function refreshStateControls() {
  const uiState = captureUiState();
  applyRemoteStateToCurrentView(uiState);
}

function refreshEntryAccessUiOnly() {
  if (activeView === "entry") {
    applyMarksEntryAccessState();
  } else if (activeView === "attendance") {
    applyAttendanceEntryAccessState();
  } else if (activeView === "entryAccess") {
    renderEntryAccessControl();
  }
  refreshMarksSaveControls();
  refreshAttendanceSaveControls();
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

function entryAccessGroupForClass(className = selectedClass()) {
  return isHighClass(className) ? "classes9to10" : "classes1to8";
}

function entryAccessExamForAppExam(className = selectedClass(), exam = selectedExam()) {
  const group = entryAccessGroups[entryAccessGroupForClass(className)];
  return group?.exams.find((item) => item.appExam === exam) || null;
}

function isEntryAccessOpen(className = selectedClass(), exam = selectedExam(), access = state.entryAccess) {
  const groupKey = entryAccessGroupForClass(className);
  const examConfig = entryAccessExamForAppExam(className, exam);
  if (!examConfig) return true;
  return Boolean(access?.[groupKey]?.[examConfig.key]?.enabled);
}

function currentEntryAccessLabel(className = selectedClass(), exam = selectedExam()) {
  const group = entryAccessGroups[entryAccessGroupForClass(className)];
  const examConfig = entryAccessExamForAppExam(className, exam);
  return {
    classRange: group?.classRange || className,
    examLabel: examConfig?.label || exam
  };
}

function selectedMarksEntryLocked() {
  return !isEntryAccessOpen(selectedClass(), selectedExam());
}

function attendanceAccessGroupForClass(className = selectedAttendanceClass()) {
  return isHighClass(className) ? "classes9to10" : "classesLkgTo8";
}

function attendanceAccessExamForTerm(className = selectedAttendanceClass(), term = selectedAttendanceTerm()) {
  const group = attendanceAccessGroups[attendanceAccessGroupForClass(className)];
  return group?.exams.find((item) => item.appExam === term) || null;
}

function isAttendanceAccessOpen(className = selectedAttendanceClass(), term = selectedAttendanceTerm(), access = state.attendanceAccess) {
  const groupKey = attendanceAccessGroupForClass(className);
  const examConfig = attendanceAccessExamForTerm(className, term);
  if (!examConfig) return true;
  return Boolean(access?.[groupKey]?.[examConfig.key]?.enabled);
}

function selectedAttendanceEntryLocked() {
  return !isAttendanceAccessOpen(selectedAttendanceClass(), selectedAttendanceTerm());
}

function attendanceAccessLockedMessage(className, term) {
  const group = attendanceAccessGroups[attendanceAccessGroupForClass(className)];
  const examConfig = attendanceAccessExamForTerm(className, term);
  return `${String.fromCodePoint(0x1F512)} Locked by Administrator - ${group?.classRange || className} ${examConfig?.label || term}`;
}

function entryAccessLockedMessage(className, exam) {
  const { classRange, examLabel } = currentEntryAccessLabel(className, exam);
  return `${String.fromCodePoint(0x1F512)} Locked by Administrator - ${classRange} ${examLabel}`;
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
  document.querySelectorAll("[data-admin-only]").forEach((element) => element.classList.toggle("hidden", !isAdmin()));
  if (!isAdmin() && activeView === "entryAccess") activeView = "entry";
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
  if (!isEntryAccessOpen(className, exam)) {
    showToast("This marks entry is locked by Administrator.");
    return;
  }
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
  if (!isAttendanceAccessOpen(className, exam)) {
    showToast("This attendance entry is locked by Administrator.");
    return;
  }
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
  if (!isAttendanceAccessOpen(className, exam)) {
    showToast("This measurement entry is locked by Administrator.");
    return;
  }
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
  setupMobileNavigation();

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
    if (selectedAttendanceEntryLocked()) {
      showToast("This attendance entry is locked by Administrator.");
      updateAttendanceInputs();
      return;
    }
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
  els.unpublishBtn.addEventListener("click", toggleResultPublication);
  document.querySelector("#exportBtn").addEventListener("click", exportCsv);
  els.exportExcelBtn?.addEventListener("click", exportExcelFromFirestore);
  document.querySelector("#resetBtn").addEventListener("click", resetDemo);
  document.querySelector("#clearMarksBtn").addEventListener("click", clearMarks);
  els.saveMarksBtn?.addEventListener("click", saveAllMarks);
  els.saveEntryAccessBtn?.addEventListener("click", () => saveEntryAccessSettings());
  els.unlockAllEntryAccessBtn?.addEventListener("click", () => setAllEntryAccess(true));
  els.lockAllEntryAccessBtn?.addEventListener("click", () => setAllEntryAccess(false));
  document.querySelector("#studentForm").addEventListener("submit", addStudent);
  document.querySelector("#cancelStudentEditBtn").addEventListener("click", cancelStudentEdit);
  els.importStudentsBtn.addEventListener("click", () => els.studentCsvInput.click());
  els.studentCsvInput.addEventListener("change", importStudentsCsv);
  els.downloadStudentTemplateBtn.addEventListener("click", downloadStudentCsvTemplate);
  els.importMarksBtn.addEventListener("click", () => els.marksCsvInput.click());
  els.marksCsvInput.addEventListener("change", importMarksCsv);
  els.downloadMarksTemplateBtn.addEventListener("click", downloadMarksCsvTemplate);
  els.printCurrentMarksheetBtn?.addEventListener("click", printCurrentMarksheet);
  els.printAllMarksheetsBtn?.addEventListener("click", printAllMarksheets);
  els.downloadMarksheetPdfBtn?.addEventListener("click", downloadMarksheetPDF);
  els.printResultsBtn.addEventListener("click", printResults);
  els.downloadResultsPdfBtn?.addEventListener("click", downloadResultsPDF);
  [
    els.analysisSessionSelect,
    els.analysisSectionSelect,
    els.analysisClassSelect,
    els.analysisExamSelect,
    els.analysisSubjectSelect,
    els.analysisStatusSelect,
    els.analysisSupportThreshold
  ].filter(Boolean).forEach((control) => {
    control.addEventListener("change", () => {
      if (control === els.analysisSectionSelect) updateAnalysisClassOptions();
      if (control === els.analysisSectionSelect) updateAnalysisExamOptions();
      if (control === els.analysisClassSelect) updateAnalysisExamOptions();
      if (control === els.analysisSectionSelect || control === els.analysisClassSelect || control === els.analysisExamSelect) {
        updateAnalysisSubjectOptions();
      }
      saveUiState();
      renderAcademicAnalysis();
    });
  });
  els.downloadAnalysisPdfBtn?.addEventListener("click", downloadAnalysisPDF);
  els.exportAnalysisExcelBtn?.addEventListener("click", exportAnalysisExcel);
  els.printAnalysisBtn?.addEventListener("click", printAcademicAnalysis);
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
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileMenu();
  });
  window.addEventListener("hashchange", () => {
    const routeView = viewFromLocationHash();
    if (routeView) switchView(routeView);
  });
  window.addEventListener("afterprint", clearPrintMode);
  window.addEventListener("resize", scheduleResultTableLayout, { passive: true });
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
  if (view === "entryAccess" && !isAdmin()) {
    showToast("Only admin can open Entry Access Control.");
    view = "entry";
  }
  activeView = view;
  updateExamSelect();
  updateSubjectSelect();
  saveUiState();
  render();
  closeMobileMenu();
}

function setupMobileNavigation() {
  if (!els.mobileMenuBtn || !els.mobileNavDrawer || !els.mobileNavOverlay) return;

  els.mobileMenuBtn.addEventListener("click", openMobileMenu);
  els.mobileMenuCloseBtn?.addEventListener("click", closeMobileMenu);
  els.mobileNavOverlay.addEventListener("click", closeMobileMenu);

  document.querySelectorAll("[data-mobile-view]").forEach((item) => {
    item.addEventListener("click", () => switchView(item.dataset.mobileView));
  });

  els.mobileNavDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  let touchStartX = null;
  els.mobileNavDrawer.addEventListener("touchstart", (event) => {
    touchStartX = event.touches?.[0]?.clientX ?? null;
  }, { passive: true });
  els.mobileNavDrawer.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const touchEndX = event.changedTouches?.[0]?.clientX ?? touchStartX;
    if (touchEndX - touchStartX > 70) closeMobileMenu();
    touchStartX = null;
  }, { passive: true });

  updateMobileNavActiveState();
}

function openMobileMenu() {
  if (!els.mobileMenuBtn || !els.mobileNavDrawer || !els.mobileNavOverlay) return;
  document.body.classList.add("mobile-nav-open");
  els.mobileNavOverlay.hidden = false;
  els.mobileNavDrawer.setAttribute("aria-hidden", "false");
  els.mobileMenuBtn.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  if (!els.mobileMenuBtn || !els.mobileNavDrawer || !els.mobileNavOverlay) return;
  document.body.classList.remove("mobile-nav-open");
  els.mobileNavDrawer.setAttribute("aria-hidden", "true");
  els.mobileMenuBtn.setAttribute("aria-expanded", "false");
  setTimeout(() => {
    if (!document.body.classList.contains("mobile-nav-open")) {
      els.mobileNavOverlay.hidden = true;
    }
  }, 220);
}

function updateMobileNavActiveState() {
  document.querySelectorAll("[data-mobile-view]").forEach((item) => {
    item.classList.toggle("active", item.dataset.mobileView === activeView);
  });
}

function renderActiveViewChrome() {
  document.body.classList.toggle("entry-active", activeView === "entry");
  document.body.classList.toggle("attendance-active", activeView === "attendance");
  document.body.classList.toggle("results-active", activeView === "results");
  document.body.classList.toggle("students-active", activeView === "students");
  document.body.classList.toggle("marksheet-active", activeView === "marksheet");
  document.body.classList.toggle("analysis-active", activeView === "analysis");
  document.body.classList.toggle("entry-access-active", activeView === "entryAccess");
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === activeView));
  document.querySelectorAll(".view").forEach((panel) => panel.classList.toggle("active", panel.id === `${activeView}View`));
  updateMobileNavActiveState();
  const titles = {
    entry: "Marks Entry",
    attendance: "Attendance and Physical Measurement",
    results: "Results",
    marksheet: "Marksheets",
    students: "Students",
    analysis: "Academic Analysis",
    entryAccess: "Entry Access Control"
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
  renderAcademicAnalysis();
  renderEntryAccessControl();
}

function renderViewFilters() {
  renderActiveViewChrome();
  syncStudentsClassSelect();
  const showMainFilters = !["attendance", "students", "analysis", "entryAccess"].includes(activeView);
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
  els.unpublishBtn.textContent = status ? "Unpublish" : "Publish";
  els.unpublishBtn.classList.toggle("primary-button", !status);
  els.unpublishBtn.classList.toggle("ghost-button", status);
  els.unpublishBtn.classList.toggle("danger", status);
  els.unpublishBtn.setAttribute(
    "aria-label",
    status ? "Unpublish selected class result" : "Publish selected class result"
  );
}

function renderEntry() {
  const students = sortedStudents();
  const maxMarks = getSubjectMaxMarks();
  const passMarks = getPassMarks();
  const gradeSubject = isGradeSubject();
  const activitiesSubject = isActivitiesSubject();
  const splitPartSubject = isSplitPartSubject();
  const noPassMark = isNoPassMarkSubject();
  const locked = selectedMarksEntryLocked();
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
        <td><span class="status-pill ${locked ? "locked" : status.className}">${locked ? "Locked" : status.label}</span></td>
      </tr>
    `;
  }).join("");

  els.studentCount.textContent = students.length;
  els.enteredCount.textContent = entered;
  els.averageMarks.textContent = gradeSubject ? "Grade" : entered ? `${Math.round((total / (entered * maxMarks)) * 100)}%` : "0%";
  els.highestMarks.textContent = gradeSubject ? "-" : entered ? `${highest}/${maxMarks}` : "0";
  els.lowestMarks.textContent = gradeSubject ? "-" : entered ? `${lowest}/${maxMarks}` : "0";
  refreshMarksSaveControls();
  applyMarksEntryAccessState();

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

function applyMarksEntryAccessState() {
  const locked = selectedMarksEntryLocked();
  document.querySelector("#clearMarksBtn").disabled = locked || marksSaveInProgress;
  document.querySelectorAll("#entryView input, #entryView select").forEach((field) => {
    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
      field.disabled = locked;
    }
  });
  els.marksBody?.classList.toggle("entry-locked", locked);
  refreshMarksSaveControls();
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
  if (rawValue === "") {
    clearContextMessage(input);
    return "";
  }
  const numericValue = Number(rawValue);
  if (!Number.isFinite(numericValue)) {
    if (showWarning) showContextMessage(input, "Enter a valid number.", { type: "error" });
    return "";
  }
  if (numericValue > limit) {
    if (showWarning || input.dataset.warnedLimit !== String(limit)) {
      showContextMessage(input, message, { type: "error", duration: 4500 });
      input.dataset.warnedLimit = String(limit);
    }
    input.value = "";
    return "";
  }
  delete input.dataset.warnedLimit;
  clearContextMessage(input);
  const value = clamp(numericValue, 0, limit);
  if (!showWarning) return rawValue;
  input.value = value;
  return value;
}

function saveEntryInputInPlace(input, options = {}) {
  if (selectedMarksEntryLocked()) {
    showContextMessage(input, "This marks entry is locked by Administrator.", { type: "error" });
    syncEntryInputsFromState();
    return;
  }
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
      if (showWarning) showContextMessage(input, "Enter grade A, B, C, D, or E.", { type: "error" });
      input.value = "";
      setStudentMark(input.dataset.gradeRoll, { value: "" }, { save: false });
    } else {
      clearContextMessage(input);
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
      showContextMessage(input, `Entry value is higher than the limit of ${limit} for ${selectedSubject()}.`, {
        type: "error",
        duration: 4500
      });
      input.dataset.warnedLimit = String(limit);
    }
    input.value = "";
    if (partKey === "partA") partA = "";
    if (partKey === "partB") partB = "";
  } else {
    delete input.dataset.warnedLimit;
    clearContextMessage(input);
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
  const locked = selectedAttendanceEntryLocked();

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
        <td><input class="mark-input" type="number" inputmode="numeric" enterkeyhint="next" min="0" max="${workingDays}" step="1" tabindex="${index + 1}" ${locked ? "disabled" : ""}
          value="${attendance}" data-attendance-roll="${student.roll}" aria-label="Attendance for ${escapeAttr(student.name)}"></td>
        <td><strong>${attendanceMarks}</strong></td>
        <td><input class="mark-input" type="number" inputmode="decimal" enterkeyhint="next" min="${previousHeight === "" ? 0 : previousHeight}" step="0.1" tabindex="${students.length + index + 1}" ${locked ? "disabled" : ""}
          value="${measurement.height}" data-height-roll="${student.roll}" aria-label="Height for ${escapeAttr(student.name)}"></td>
        <td><input class="mark-input" type="number" inputmode="decimal" enterkeyhint="next" min="0" step="0.1" tabindex="${(students.length * 2) + index + 1}" ${locked ? "disabled" : ""}
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
        showContextMessage(input, `Height cannot be less than the ${previousTerm} height (${previousHeight} cm).`, {
          type: "error",
          duration: 4500
        });
        input.value = getStudentMeasurement({ roll: input.dataset.heightRoll }, className, term).height;
        return;
      }
      clearContextMessage(input);
      setStudentMeasurement(input.dataset.heightRoll, { height: input.value }, className, term, { save: false });
    });
  });

  document.querySelectorAll("[data-weight-roll]").forEach((input) => {
    input.addEventListener("change", () => {
      setStudentMeasurement(input.dataset.weightRoll, { weight: input.value }, className, term, { save: false });
    });
  });

  refreshAttendanceSaveControls();
  applyAttendanceEntryAccessState();
}

function applyAttendanceEntryAccessState() {
  const locked = selectedAttendanceEntryLocked();
  els.workingDaysInput.disabled = locked;
  els.clearAttendanceBtn.disabled = attendanceSaveInProgress || locked;
  document.querySelectorAll("#attendanceView input").forEach((field) => {
    if (field instanceof HTMLInputElement) field.disabled = locked;
  });
  els.attendanceBody?.classList.toggle("entry-locked", locked);
  refreshAttendanceSaveControls();
}

function clearAttendanceData() {
  const className = selectedAttendanceClass();
  const term = selectedAttendanceTerm();
  if (!isAttendanceAccessOpen(className, term)) {
    showToast("This attendance entry is locked by Administrator.");
    return;
  }
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
      <th>${resultSheetLabel("Roll No.")}</th>
      <th>Student Name</th>
      ${subjects.map((subject) => `<th>${escapeHtml(resultSheetLabel(subject))}</th>`).join("")}
      ${term ? `<th>${resultSheetLabel("Attendance")}</th>` : ""}
      ${showMeasurements ? "<th>Height (in cm)</th><th>Weight (in kg)</th>" : ""}
      <th>${resultSheetLabel(totalHeading)}</th>
      <th>${resultSheetLabel("Percentage")}</th>
      <th>${resultSheetLabel("Division")}</th>
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
        <td>${formatDivisionLabel(record.outcome.division)}</td>
        <td>${formatResultStatus(record.outcome.result)}</td>
      </tr>
    `;
  }).join("");

  renderResultSummary(records, students.length);
  optimizeResultTableLayout();
  updateResultStickyHeaderMetrics();
}

function isStructuredTermResult(className = selectedClass(), exam = selectedExam()) {
  return ["Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII"].includes(className)
    && (exam === "First Term" || exam === "Second Term");
}

function resultSheetLabel(label) {
  const replacements = {
    "ROLL NO.": "R. No.",
    "ROLL NO": "R. No.",
    MATHEMATICS: "MATHS",
    "SOCIAL SCIENCE": "S.S.",
    PERCENTAGE: "%",
    DIVISION: "DIV.",
    "SKILL DEVELOPMENT": "SKILL DEV.",
    ATTENDANCE: "ATTND.",
    "GRAND TOTAL": "G. TOTAL"
  };
  const text = String(label || "").trim();
  return replacements[text.toUpperCase()] || text;
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
      <th rowspan="2" class="roll-column">${resultSheetLabel("Roll No.")}</th>
      <th rowspan="2" class="student-name-column">Student Name</th>
      ${structure.groups.map((group) => `<th colspan="${componentsPerSubject}" class="subject-group">${escapeHtml(resultSheetLabel(group.name))}</th>`).join("")}
      ${structure.standalone.map((subject) => {
        if (highThirdTermSheet && subject === "Skill Development") {
          return `<th rowspan="2" class="standalone-column vertical-header skill-development-header"><span>${resultSheetLabel(subject)}</span></th>`;
        }
        const vertical = thirdTermSheet || subject === "Skill Development";
        const displaySubject = escapeHtml(resultSheetLabel(subject));
        return `<th rowspan="2" class="standalone-column ${vertical ? "vertical-header" : ""}">${vertical ? `<span>${displaySubject}</span>` : displaySubject}</th>`;
      }).join("")}
      <th rowspan="2" class="attendance-column vertical-header"><span>${resultSheetLabel("Attendance")}</span></th>
      <th rowspan="2" class="outcome-column">${resultSheetLabel("Grand Total")}</th>
      <th rowspan="2" class="outcome-column">%</th>
      <th rowspan="2" class="outcome-column vertical-header"><span>${resultSheetLabel("Division")}</span></th>
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
      <td>${formatDivisionLabel(record.outcome.division)}</td>
      <td>${formatResultStatus(record.outcome.result)}</td>
    </tr>
  `).join("");

  const appearedRecords = records.filter((record) => record.appeared);
  renderResultSummary(appearedRecords.map((record) => ({ ...record, appeared: true })), students.length);
  optimizeResultTableLayout();
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

function getResultHeaderGrid(table, columnCount) {
  const placements = [];
  const activeRowspans = Array(columnCount).fill(0);

  table.querySelectorAll("thead tr").forEach((row) => {
    let cursor = 0;
    row.querySelectorAll("th").forEach((cell) => {
      while (activeRowspans[cursor] > 0) cursor += 1;
      const span = Math.max(1, Number(cell.colSpan) || 1);
      const rowspan = Math.max(1, Number(cell.rowSpan) || 1);
      placements.push({ cell, start: cursor, span });
      for (let index = cursor; index < Math.min(columnCount, cursor + span); index += 1) {
        activeRowspans[index] = Math.max(activeRowspans[index], rowspan);
      }
      cursor += span;
    });
    activeRowspans.forEach((value, index) => {
      activeRowspans[index] = Math.max(0, value - 1);
    });
  });

  return placements;
}

function getResultColumnRole(index, labels, columnCount, table) {
  const label = labels.join(" ").replace(/\s+/g, " ").trim().toUpperCase();
  if (index === 0 || /ROLL(\s+NO)?/.test(label)) return "roll";
  if (index === 1 || label.includes("STUDENT NAME") || label === "NAME") return "name";
  if (label.includes("REMARK")) return "remarks";
  if (label.includes("ATTENDANCE") || label.includes("ATTD") || label.includes("ATTND")) return "attendance";
  if (label.includes("HEIGHT") || label.includes("WEIGHT")) return "measurement";
  if (label === "%" || label.includes("PERCENT")) return "percentage";
  if (label.includes("DIVISION") || label === "DIV." || label === "DIV") return "division";
  if (label.includes("GRADE")) return "grade";
  if (label.includes("RESULT") || index === columnCount - 1) return "result";
  if (label.includes("GRAND TOTAL") || label.includes("G. TOTAL")) return "total";
  if (table.classList.contains("structured-results")
    && /(ACTIVITIES|UNIT TEST|EXAM|FIRST TERM|SECOND TERM|THIRD TERM|F\.A\.|S\.A\.|TOTAL)/.test(label)) {
    return "component";
  }
  return "subject";
}

function getResultColumnLimits(role) {
  const limits = {
    roll: { min: 46, max: 68, grow: 0.35 },
    name: { min: 104, max: 270, grow: 0 },
    remarks: { min: 150, max: 340, grow: 5 },
    attendance: { min: 54, max: 88, grow: 0.55 },
    measurement: { min: 58, max: 92, grow: 0.7 },
    percentage: { min: 52, max: 92, grow: 1.1 },
    division: { min: 48, max: 80, grow: 0.85 },
    grade: { min: 38, max: 54, grow: 0.25 },
    result: { min: 48, max: 78, grow: 0.45 },
    total: { min: 58, max: 104, grow: 1.25 },
    component: { min: 27, max: 48, grow: 0.6 },
    subject: { min: 46, max: 112, grow: 1.5 }
  };
  return limits[role] || limits.subject;
}

function resultCellText(cell) {
  return String(cell?.textContent || "").replace(/\s+/g, " ").trim();
}

function optimizeResultTableLayout() {
  const table = els.resultsTable;
  const wrapper = table?.closest(".table-wrap");
  const bodyRows = [...(table?.tBodies?.[0]?.rows || [])];
  if (!table || !wrapper || wrapper.clientWidth < 120 || !bodyRows.length) return;

  const firstDataRow = bodyRows.find((row) => row.cells.length > 1);
  const columnCount = firstDataRow?.cells.length || 0;
  if (!columnCount) return;

  table.querySelector('colgroup[data-result-layout="true"]')?.remove();
  table.classList.add("result-layout-optimized");

  const canvas = optimizeResultTableLayout.canvas || (optimizeResultTableLayout.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  if (!context) return;
  const measureCache = new Map();
  const measure = (text, bold = false) => {
    const key = `${bold ? "b" : "n"}:${text}`;
    if (measureCache.has(key)) return measureCache.get(key);
    context.font = `${bold ? "700" : "400"} 13.333px Arial, sans-serif`;
    const width = context.measureText(text).width;
    measureCache.set(key, width);
    return width;
  };

  const placements = getResultHeaderGrid(table, columnCount);
  const labels = Array.from({ length: columnCount }, () => []);
  placements.forEach(({ cell, start, span }) => {
    const text = resultCellText(cell);
    for (let index = start; index < Math.min(columnCount, start + span); index += 1) {
      if (text) labels[index].push(text);
    }
  });

  const columns = Array.from({ length: columnCount }, (_, index) => {
    const role = getResultColumnRole(index, labels[index], columnCount, table);
    const limits = getResultColumnLimits(role);
    let measured = 0;
    bodyRows.forEach((row) => {
      const cell = row.cells[index];
      if (cell) measured = Math.max(measured, measure(resultCellText(cell)));
    });
    placements.forEach(({ cell, start, span }) => {
      if (index < start || index >= start + span || cell.classList.contains("vertical-header")) return;
      measured = Math.max(measured, measure(resultCellText(cell), true) / span);
    });
    const padding = table.classList.contains("structured-results") ? 10 : 20;
    const width = Math.min(limits.max, Math.max(limits.min, Math.ceil(measured + padding)));
    return {
      role,
      ...limits,
      max: role === "name" ? width : limits.max,
      width
    };
  });

  const minimumWidth = columns.reduce((sum, column) => sum + column.min, 0);
  const availableWidth = Math.max(1, Math.floor(wrapper.clientWidth - 2));
  const targetWidth = Math.max(availableWidth, minimumWidth);
  let currentWidth = columns.reduce((sum, column) => sum + column.width, 0);

  if (currentWidth > targetWidth) {
    let excess = currentWidth - targetWidth;
    for (let pass = 0; pass < 4 && excess > 0.5; pass += 1) {
      const shrinkable = columns.filter((column) => column.width > column.min + 0.1);
      const capacity = shrinkable.reduce((sum, column) => sum + ((column.width - column.min) / Math.max(column.grow, 0.25)), 0);
      if (!capacity) break;
      shrinkable.forEach((column) => {
        const share = excess * (((column.width - column.min) / Math.max(column.grow, 0.25)) / capacity);
        const reduction = Math.min(column.width - column.min, share);
        column.width -= reduction;
      });
      currentWidth = columns.reduce((sum, column) => sum + column.width, 0);
      excess = currentWidth - targetWidth;
    }
  } else if (currentWidth < targetWidth) {
    let spare = targetWidth - currentWidth;
    for (let pass = 0; pass < 4 && spare > 0.5; pass += 1) {
      const expandable = columns.filter((column) => column.width < column.max - 0.1);
      const weight = expandable.reduce((sum, column) => sum + column.grow, 0);
      if (!weight) break;
      expandable.forEach((column) => {
        const addition = Math.min(column.max - column.width, spare * (column.grow / weight));
        column.width += addition;
      });
      currentWidth = columns.reduce((sum, column) => sum + column.width, 0);
      spare = targetWidth - currentWidth;
    }
  }

  const finalWidth = Math.max(targetWidth, columns.reduce((sum, column) => sum + column.width, 0));
  const colgroup = document.createElement("colgroup");
  colgroup.dataset.resultLayout = "true";
  columns.forEach((column) => {
    const col = document.createElement("col");
    col.style.width = `${(column.width / finalWidth) * 100}%`;
    col.dataset.resultRole = column.role;
    colgroup.appendChild(col);
  });
  table.insertBefore(colgroup, table.firstChild);
  table.style.setProperty("--result-layout-table-width", `${Math.ceil(finalWidth)}px`);

  const fontSteps = [10, 9, 8, 7];
  const cellFits = [];
  const collectCellFit = (cell, width, role, isHeader = false) => {
    if (!cell) return;
    const text = resultCellText(cell);
    const vertical = cell.classList.contains("vertical-header");
    const padding = table.classList.contains("structured-results") ? 8 : 16;
    const usableWidth = Math.max(8, width - padding);
    const baseWidth = measure(text, isHeader);
    const mayWrap = role === "name" && !isHeader;
    const requiredSize = vertical || mayWrap || !text
      ? 10
      : fontSteps.find((size) => baseWidth * (size / 10) <= usableWidth) || 7;
    cellFits.push({ cell, baseWidth, usableWidth, mayWrap, vertical, requiredSize });
  };

  bodyRows.forEach((row) => {
    [...row.cells].forEach((cell, index) => {
      const role = columns[index]?.role || "subject";
      cell.dataset.resultRole = role;
      collectCellFit(cell, columns[index]?.width || 50, role);
    });
  });
  placements.forEach(({ cell, start, span }) => {
    const width = columns.slice(start, start + span).reduce((sum, column) => sum + column.width, 0);
    const role = columns[start]?.role || "subject";
    cell.dataset.resultRole = role;
    collectCellFit(cell, width, role, true);
  });

  const uniformFontSize = Math.max(7, Math.min(10, ...cellFits.map((item) => item.requiredSize)));
  table.style.setProperty("--result-table-uniform-font", `${uniformFontSize}pt`);
  cellFits.forEach(({ cell, baseWidth, usableWidth, mayWrap, vertical }) => {
    cell.dataset.resultFontPt = String(uniformFontSize);
    cell.style.setProperty("--result-cell-font-size", `${uniformFontSize}pt`);
    cell.classList.toggle("result-cell-wrap", mayWrap && !vertical && baseWidth * (uniformFontSize / 10) > usableWidth);
  });
}

function scheduleResultTableLayout() {
  if (activeView !== "results" || !els.resultsTable) return;
  cancelAnimationFrame(scheduleResultTableLayout.frame);
  scheduleResultTableLayout.frame = requestAnimationFrame(() => {
    optimizeResultTableLayout();
    updateResultStickyHeaderMetrics();
  });
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
  const present = appearedRecords.length;
  const passCount = appearedRecords.filter((record) => record.outcome.result !== "Fail").length;
  const passSummary = calculateClassPassSummary(studentCount, present, passCount);
  const divisionCount = (division) => appearedRecords.filter((record) => record.outcome.division === division).length;

  els.resultSummary.innerHTML = `
    ${summaryItem("Total Students", passSummary.total)}
    ${summaryItem("Present", passSummary.present)}
    ${summaryItem("Absent", passSummary.absent)}
    ${summaryItem("Passed", passSummary.passed)}
    ${summaryItem("Failed", passSummary.failed)}
    ${summaryItem("Pass Percentage", `${passSummary.passPercentage.toFixed(2)}%`)}
    ${summaryItem("No. of Distinction", divisionCount("Dist."))}
    ${summaryItem("No. of First Division", divisionCount("I"))}
    ${summaryItem("No. of Second Division", divisionCount("II"))}
    ${summaryItem("No. of Third Division", divisionCount("III"))}
  `;
}

function calculateClassPassSummary(totalStudents, presentStudents, passedStudents) {
  const total = Math.max(0, Number(totalStudents) || 0);
  const present = Math.min(total, Math.max(0, Number(presentStudents) || 0));
  const passed = Math.min(present, Math.max(0, Number(passedStudents) || 0));
  const absent = total - present;
  const failed = total - passed;
  const passPercentage = total ? Math.round((passed / total) * 10000) / 100 : 0;
  return { total, present, absent, passed, failed, passPercentage };
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

function renderMarksheets({ ignoreSearch = false } = {}) {
  const allStudents = sortedStudents();
  const students = ignoreSearch ? allStudents : filteredMarksheetStudents(allStudents);
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
      <article class="marksheet${(["LKG", "UKG"].includes(selectedClass()) || isHighClass()) ? " legacy-marksheet-format" : ""}${isHighClass() ? " high-class-marksheet" : ""}${highThirdTermMarksheet ? " high-third-term-marksheet" : ""}${isClassOneToEight() ? " class-one-eight-marksheet" : ""}${selectedClass() === "Class VI" ? " class-six-marksheet" : ""}${["Class VI", "Class VII", "Class VIII"].includes(selectedClass()) ? " upper-middle-marksheet" : ""}${isLkgToClassSeven() ? " lower-class-marksheet" : ""}"
        data-student-name="${escapeAttr(student.name)}" data-class-name="${escapeAttr(selectedClass())}" data-roll-no="${escapeAttr(student.roll)}">
        <div class="marksheet-title">
          <h3>PINEHILL ADVENTIST ACADEMY</h3>
          <p class="marksheet-location">CHAMPHAI : MIZORAM</p>
          <p class="marksheet-session">${escapeHtml(selectedClass())} ${escapeHtml(selectedExam())} Marksheet : Academic Session ${escapeHtml(state.academicSession)}</p>
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
              ${marksheetRemarkDetail(getMarksheetRemark(outcome))}
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
      return `<span${marksheetSpecialSubjectAttr(subject)}>${escapeHtml(subject)}: <strong>${failed ? `<span class="failed-mark">${escapeHtml(displayValue)}</span>` : escapeHtml(displayValue)}</strong></span>`;
    }).join("")}
  </div>`;
}

function marksheetSpecialSubjectAttr(subject) {
  return ["Skill Development", "W.E.", "Moral"].includes(subject) ? ' class="marksheet-special-subject"' : "";
}

function formatFullPassMarks(fullMarks, passMarks = "") {
  if (fullMarks === "" && passMarks === "") return "";
  return passMarks === "" || passMarks === null || passMarks === undefined
    ? escapeHtml(fullMarks)
    : `${escapeHtml(fullMarks)}/${escapeHtml(passMarks)}`;
}

function renderStructuredMarksheetTable(structure, subjectResults, standaloneResults, total, maximumTotal) {
  const thirdTermSheet = selectedExam() === "Third Term";
  const passMarksTotal = structure.groups.length * 50;
  return `
    <table class="structured-marksheet-table">
      <thead>
        <tr>
          <th>Subject</th>
          <th>F.M./P.M.</th>
          <th>${thirdTermSheet ? "First Term (30%)" : "Activities"}</th>
          <th>${thirdTermSheet ? "Second Term (30%)" : "Unit Test"}</th>
          <th>${thirdTermSheet ? "Exam (40%)" : "Exam"}</th>
          <th>M.O.</th>
        </tr>
      </thead>
      <tbody>
        ${structure.groups.map((group, index) => {
          const result = subjectResults[index];
          return `<tr>
            <td${marksheetSpecialSubjectAttr(group.name)}>${escapeHtml(group.name)}</td>
            <td>${formatFullPassMarks(100, 50)}</td>
            <td>${marksheetComponentValue(result.activities)}</td>
            <td>${marksheetComponentValue(result.unitTest)}</td>
            <td>${marksheetComponentValue(result.exam)}</td>
            <td><strong>${marksheetTotalValue(result.total)}</strong></td>
          </tr>`;
        }).join("")}
        ${standaloneResults.map((result) => `<tr>
          <td${marksheetSpecialSubjectAttr(result.subject)}>${escapeHtml(result.subject)}</td>
          <td>${result.subject === "A.E." || result.subject === "W.E." ? formatFullPassMarks(50) : ""}</td>
          <td></td>
          <td></td>
          <td></td>
          <td><strong>${marksheetStandaloneValue(result)}</strong></td>
        </tr>`).join("")}
        <tr class="grand-total-row">
          <td>Grand Total</td>
          <td>${formatFullPassMarks(maximumTotal, passMarksTotal)}</td>
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
          const subjectMaxMarks = getSubjectMaxMarks(selectedClass(), selectedExam(), subject);
          const subjectPassMarks = getSubjectPassMarks(selectedClass(), selectedExam(), subject);
          return `<tr>
            <td${marksheetSpecialSubjectAttr(subject)}>${escapeHtml(subject)}</td>
            <td>${graded ? "" : subjectMaxMarks}</td>
            <td>${graded ? "" : subjectPassMarks}</td>
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
  const legacyFormat = selectedClass() === "LKG" || selectedClass() === "UKG";
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
          ${legacyFormat
            ? "<th>Full Marks</th><th>Pass Marks</th><th>Marks Obtained</th>"
            : "<th>F.M./P.M.</th><th>M.O.</th>"}
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
          const subjectMaxMarks = getSubjectMaxMarks(selectedClass(), selectedExam(), subject);
          return `<tr>
            <td${marksheetSpecialSubjectAttr(subject)}>${escapeHtml(subject)}</td>
            ${legacyFormat
              ? `<td>${graded ? "" : subjectMaxMarks}</td><td>${graded || hasNoPassMark ? "" : subjectPassMarks}</td>`
              : `<td>${graded ? "" : formatFullPassMarks(subjectMaxMarks, hasNoPassMark ? "" : subjectPassMarks)}</td>`}
            <td><strong>${failed ? `<span class="failed-mark">${displayValue}</span>` : displayValue}</strong></td>
          </tr>`;
        }).join("")}
        <tr class="grand-total-row">
          <td>Grand Total</td>
          ${legacyFormat
            ? `<td>${fullMarksTotal}</td><td>${passMarksTotal}</td>`
            : `<td>${formatFullPassMarks(fullMarksTotal, passMarksTotal)}</td>`}
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

function marksheetRemarkDetail(value) {
  return `<div class="marksheet-remarks">Remarks: ${escapeHtml(value || "-")}</div>`;
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

function initializeAnalysisFilters(savedFilters = null) {
  if (!els.analysisSessionSelect) return;
  syncActiveSessionData();
  const previousSession = savedFilters?.analysisSession || els.analysisSessionSelect.value || state.academicSession;
  const sessions = [...new Set([state.academicSession, ...Object.keys(state.sessions || {})])].sort();
  populateSelect(els.analysisSessionSelect, sessions);
  setSelectValueIfAvailable(els.analysisSessionSelect, previousSession);

  const previousSection = savedFilters?.analysisSection || els.analysisSectionSelect.value || "All Classes";
  populateSelect(els.analysisSectionSelect, Object.keys(analysisSectionClasses));
  setSelectValueIfAvailable(els.analysisSectionSelect, previousSection);

  const previousClass = savedFilters?.analysisClass || els.analysisClassSelect.value || "All Classes";
  updateAnalysisClassOptions(previousClass);
  updateAnalysisExamOptions();
  setSelectValueIfAvailable(els.analysisExamSelect, savedFilters?.analysisExam);
  updateAnalysisSubjectOptions();
  setSelectValueIfAvailable(els.analysisSubjectSelect, savedFilters?.analysisSubject);
  setSelectValueIfAvailable(els.analysisStatusSelect, savedFilters?.analysisStatus);
  if (savedFilters?.analysisThreshold !== undefined) {
    els.analysisSupportThreshold.value = savedFilters.analysisThreshold;
  }
}

function analysisClassesForSection(section = els.analysisSectionSelect?.value || "All Classes") {
  return analysisSectionClasses[section] || classNames;
}

function updateAnalysisClassOptions(preferredClass = "") {
  if (!els.analysisClassSelect) return;
  const previous = preferredClass || els.analysisClassSelect.value || "All Classes";
  populateSelect(els.analysisClassSelect, ["All Classes", ...analysisClassesForSection()]);
  setSelectValueIfAvailable(els.analysisClassSelect, previous);
}

function selectedAnalysisClasses() {
  const className = els.analysisClassSelect?.value || "All Classes";
  return className === "All Classes" ? analysisClassesForSection() : [className];
}

function updateAnalysisExamOptions() {
  if (!els.analysisExamSelect) return;
  const previous = els.analysisExamSelect.value || selectedExam() || "First Term";
  const exams = [...new Set(selectedAnalysisClasses().flatMap((name) => currentExams(name)))];
  populateSelect(els.analysisExamSelect, [analysisExamAll, ...exams]);
  setSelectValueIfAvailable(els.analysisExamSelect, previous);
  if (!els.analysisExamSelect.value && exams.length) els.analysisExamSelect.value = exams[0];
}

function analysisSubjectNames(className, exam) {
  if (exam === analysisExamAll) {
    return [...new Set(currentExams(className).flatMap((examName) => analysisSubjectNames(className, examName)))];
  }
  if (!currentExams(className).includes(exam)) return [];
  const subjects = currentSubjects(className, exam);
  if (isStructuredResultSheet(className, exam)) {
    if (exam === "Third Term") {
      return subjects.filter((subject) => subject !== "W.E." && !isGradeSubject(subject, className));
    }
    return [...new Set(subjects.map((subject) => subject.replace(/\s+\((Activities|Exam)\)$/, "")))]
      .filter((subject) => subject !== "W.E." && !isGradeSubject(subject, className));
  }
  return subjects
    .filter((subject) => subject !== "W.E." && !isGradeSubject(subject, className))
    .map((subject) => baseSubjectName(subject));
}

function updateAnalysisSubjectOptions() {
  if (!els.analysisSubjectSelect) return;
  const previous = els.analysisSubjectSelect.value || "All Subjects";
  const exam = els.analysisExamSelect.value;
  const subjects = [...new Set(selectedAnalysisClasses().flatMap((className) => analysisSubjectNames(className, exam)))];
  populateSelect(els.analysisSubjectSelect, ["All Subjects", ...subjects]);
  setSelectValueIfAvailable(els.analysisSubjectSelect, previous);
}

function runWithAnalysisSession(session, callback) {
  syncActiveSessionData();
  const previousSession = state.academicSession;
  const previousData = getActiveSessionData();
  const nextSession = currentSessionKey(session || previousSession);
  const nextData = nextSession === previousSession
    ? previousData
    : normalizeSessionData(state.sessions?.[nextSession] || createEmptySessionData());
  state.academicSession = nextSession;
  setActiveSessionData(state, nextData);
  try {
    return callback();
  } finally {
    state.academicSession = previousSession;
    setActiveSessionData(state, previousData);
  }
}

function analysisSubjectEntries(student, resultRecord) {
  if (resultRecord.structured) {
    const passMark = isHighThirdTermResult() ? 33 : 50;
    const grouped = resultRecord.structure.groups.map((group, index) => {
      const result = resultRecord.subjectResults[index];
      return {
        name: group.name,
        value: result.hasMark ? numericMark(result.total) : "",
        maximum: 100,
        passMark,
        present: result.hasMark,
        passed: result.hasMark && numericMark(result.total) >= passMark
      };
    });
    const standalone = resultRecord.standaloneResults
      .filter((result) => !result.graded)
      .map((result) => ({
        name: result.subject,
        value: result.value,
        maximum: result.maxMarks,
        passMark: result.countsForResult ? 50 : 0,
        present: result.value !== "",
        passed: result.value !== "" && (!result.countsForResult || numericMark(result.value) >= 50)
      }));
    return [...grouped, ...standalone];
  }

  return currentSubjects()
    .filter((subject) => !isGradeSubject(subject))
    .map((subject) => {
      const mark = getStudentMark(student, subject);
      const maximum = getSubjectMaxMarks(selectedClass(), selectedExam(), subject);
      const passMark = getSubjectPassMarks(selectedClass(), selectedExam(), subject);
      const noPassMark = isNoPassMarkSubject(selectedClass(), selectedExam(), subject);
      return {
        name: baseSubjectName(subject),
        value: mark.value,
        maximum,
        passMark: noPassMark ? 0 : passMark,
        present: mark.value !== "",
        passed: mark.value !== "" && (noPassMark || numericMark(mark.value) >= passMark)
      };
    });
}

function buildAcademicAnalysisRecords(session, classes, exam) {
  return runWithAnalysisSession(session, () => {
    const records = [];
    classes.filter((className) => currentExams(className).includes(exam)).forEach((className) => {
      runWithExportSelection(className, exam, () => {
        const workingDays = getWorkingDays(exam);
        (state.classes[className] || []).forEach((student) => {
          const resultRecord = calculateExcelResultRecord(student);
          const percentage = resultRecord.appeared ? Number(resultRecord.percentage) || 0 : 0;
          const attendance = getStudentAttendance(student, className, exam);
          const subjects = analysisSubjectEntries(student, resultRecord);
          records.push({
            roll: student.roll,
            name: student.name,
            className,
            exam,
            appeared: resultRecord.appeared,
            percentage,
            result: resultRecord.outcome.result,
            division: resultRecord.outcome.division,
            attendance,
            workingDays,
            subjects,
            failedSubjects: subjects
              .filter((subject) => subject.present && !subject.passed)
              .map((subject) => subject.name)
          });
        });
      });
    });
    return records;
  });
}

function aggregateAcademicAnalysisRecords(records) {
  const students = new Map();
  records.forEach((record) => {
    const key = `${record.className}\u0000${record.roll}`;
    if (!students.has(key)) students.set(key, []);
    students.get(key).push(record);
  });

  return [...students.values()].map((studentRecords) => {
    const first = studentRecords[0];
    const appearedRecords = studentRecords.filter((record) => record.appeared);
    const percentage = average(appearedRecords.map((record) => record.percentage));
    const result = !appearedRecords.length
      ? "-"
      : appearedRecords.some((record) => record.result === "Fail")
        ? "Fail"
        : appearedRecords.some((record) => record.result === "Simple Pass")
          ? "Simple Pass"
          : "Pass";
    const subjectGroups = new Map();

    studentRecords.forEach((record) => {
      record.subjects.forEach((subject) => {
        if (!subjectGroups.has(subject.name)) subjectGroups.set(subject.name, []);
        subjectGroups.get(subject.name).push(subject);
      });
    });

    const subjects = [...subjectGroups.entries()].map(([name, entries]) => {
      const present = entries.filter((entry) => entry.present);
      const percentages = present.map((entry) =>
        entry.maximum ? (numericMark(entry.value) / entry.maximum) * 100 : 0);
      return {
        name,
        value: average(percentages),
        maximum: 100,
        passMark: 50,
        present: present.length > 0,
        passed: present.length > 0 && present.every((entry) => entry.passed)
      };
    });

    return {
      ...first,
      exam: analysisExamAll,
      appeared: appearedRecords.length > 0,
      percentage,
      result,
      division: result === "Fail" || !appearedRecords.length
        ? "-"
        : (isHighClass(first.className) ? getDivision(percentage, false) : getPrimaryDivision(percentage)),
      attendance: studentRecords.reduce((sum, record) => sum + (Number(record.attendance) || 0), 0),
      workingDays: studentRecords.reduce((sum, record) => sum + (Number(record.workingDays) || 0), 0),
      subjects,
      failedSubjects: [...new Set(studentRecords.flatMap((record) => record.failedSubjects || []))]
    };
  });
}

function buildAcademicAnalysisSelectionRecords(session, classes, exam) {
  if (exam !== analysisExamAll) return buildAcademicAnalysisRecords(session, classes, exam);
  const exams = [...new Set(classes.flatMap((className) => currentExams(className)))];
  const records = exams.flatMap((examName) => buildAcademicAnalysisRecords(session, classes, examName));
  return aggregateAcademicAnalysisRecords(records);
}

function filteredAnalysisRecord(record, subjectFilter) {
  if (!subjectFilter || subjectFilter === "All Subjects") return record;
  const subject = record.subjects.find((entry) => entry.name === subjectFilter);
  if (!subject) {
    return { ...record, appeared: false, percentage: 0, result: "-", division: "-", failedSubjects: [] };
  }
  const percentage = subject.present && subject.maximum
    ? Math.round((numericMark(subject.value) / subject.maximum) * 10000) / 100
    : 0;
  return {
    ...record,
    appeared: subject.present,
    percentage,
    result: subject.present ? (subject.passed ? "Pass" : "Fail") : "-",
    failedSubjects: subject.present && !subject.passed ? [subject.name] : [],
    division: subject.present && subject.passed
      ? (isHighClass(record.className) ? getDivision(percentage, false) : getPrimaryDivision(percentage))
      : "-"
  };
}

function average(values) {
  const numbers = values.map(Number).filter(Number.isFinite);
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : 0;
}

function abbreviatedAnalysisFailedSubjects(record) {
  return [...new Set(record.failedSubjects || [])]
    .map((subject) => analysisSubjectReasonAbbreviations[subject] || subject)
    .join(", ");
}

function analysisOverviewMetrics(records) {
  const total = records.length;
  const presentRecords = records.filter((record) => record.appeared);
  const passed = presentRecords.filter((record) => record.result !== "Fail").length;
  const summary = calculateClassPassSummary(total, presentRecords.length, passed);
  const divisionCount = (division) => presentRecords.filter((record) => record.division === division).length;
  return {
    ...summary,
    schoolAverage: average(presentRecords.map((record) => record.percentage)),
    distinction: divisionCount("Dist."),
    first: divisionCount("I"),
    second: divisionCount("II"),
    third: divisionCount("III"),
    simplePass: presentRecords.filter((record) => record.result === "Simple Pass").length
  };
}

function analysisClassMetrics(records) {
  return [...new Set(records.map((record) => record.className))].map((className) => {
    const classRecords = records.filter((record) => record.className === className);
    const present = classRecords.filter((record) => record.appeared);
    const passed = present.filter((record) => record.result !== "Fail").length;
    const summary = calculateClassPassSummary(classRecords.length, present.length, passed);
    const percentages = present.map((record) => record.percentage);
    return {
      className,
      passPercentage: summary.passPercentage,
      average: average(percentages),
      highest: percentages.length ? Math.max(...percentages) : 0,
      lowest: percentages.length ? Math.min(...percentages) : 0
    };
  });
}

function analysisSubjectMetrics(records, subjectFilter) {
  const entries = new Map();
  records.forEach((record) => {
    record.subjects.forEach((subject) => {
      if (subject.name === "W.E.") return;
      if (subjectFilter !== "All Subjects" && subject.name !== subjectFilter) return;
      const key = subject.name;
      if (!entries.has(key)) entries.set(key, { name: key, values: [], total: 0, present: 0, passed: 0 });
      const metric = entries.get(key);
      metric.total += 1;
      if (subject.present) {
        metric.present += 1;
        metric.values.push(subject.maximum ? (numericMark(subject.value) / subject.maximum) * 100 : 0);
        if (subject.passed) metric.passed += 1;
      }
    });
  });
  return [...entries.values()].map((metric) => ({
    name: metric.name,
    highest: metric.values.length ? Math.max(...metric.values) : 0,
    lowest: metric.values.length ? Math.min(...metric.values) : 0,
    average: average(metric.values),
    passPercentage: metric.total ? (metric.passed / metric.total) * 100 : 0,
    passed: metric.passed,
    failed: metric.total - metric.passed
  }));
}

function analysisBarChart(items, valueKey, labelKey, suffix = "%") {
  if (!items.length) return '<p class="analysis-empty">No data available.</p>';
  const max = Math.max(100, ...items.map((item) => Number(item[valueKey]) || 0));
  return `<div class="analysis-bar-chart">${items.map((item) => {
    const value = Number(item[valueKey]) || 0;
    return `<div class="analysis-bar-row">
      <span>${escapeHtml(item[labelKey])}</span>
      <div class="analysis-bar-track"><i style="width:${Math.min(100, (value / max) * 100)}%"></i></div>
      <strong>${value.toFixed(2)}${suffix}</strong>
    </div>`;
  }).join("")}</div>`;
}

function analysisTopStudentsChart(records) {
  if (!records.length) return '<p class="analysis-empty">No data available.</p>';
  return `<div class="analysis-bar-chart analysis-top-students-chart">${records.map((record, index) => {
    const value = Math.max(0, Math.min(100, Number(record.percentage) || 0));
    return `<div class="analysis-bar-row">
      <span><b>${index + 1}. ${escapeHtml(record.name)}</b><small>(${escapeHtml(record.className)})</small></span>
      <div class="analysis-bar-track"><i style="width:${value}%"></i></div>
      <strong>${value.toFixed(2)}%</strong>
    </div>`;
  }).join("")}</div>`;
}

function analysisColumnChart(items, valueKey, labelKey) {
  if (!items.length) return '<p class="analysis-empty">No data available.</p>';
  return `<div class="analysis-column-chart">${items.map((item) => {
    const value = Math.max(0, Math.min(100, Number(item[valueKey]) || 0));
    const label = String(item[labelKey] ?? "");
    const columnWidth = Math.max(58, Math.min(118, Math.ceil(label.length * 6.2)));
    return `<div class="analysis-column-item" style="--analysis-column-width:${columnWidth}px">
      <strong>${value.toFixed(1)}%</strong>
      <div class="analysis-column-track"><i style="height:${value}%"></i></div>
      <span>${escapeHtml(label)}</span>
    </div>`;
  }).join("")}</div>`;
}

function analysisDonutChart(items, centerText) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let cursor = 0;
  const segments = items.map((item) => {
    const start = total ? (cursor / total) * 360 : 0;
    cursor += item.value;
    const end = total ? (cursor / total) * 360 : 0;
    return `${item.color} ${start}deg ${end}deg`;
  });
  return `<div class="analysis-donut-layout">
    <div class="analysis-donut" style="background:conic-gradient(${segments.join(",") || "#d9e1e8 0deg 360deg"})"><strong>${escapeHtml(centerText)}</strong></div>
    <div class="analysis-legend">${items.map((item) => `<span><i style="background:${item.color}"></i>${escapeHtml(item.label)} <strong>${item.value}</strong></span>`).join("")}</div>
  </div>`;
}

function analysisLineChart(items) {
  if (!items.length) return '<p class="analysis-empty">No trend data available.</p>';
  const width = 720;
  const height = 220;
  const padX = 42;
  const padY = 26;
  const step = items.length > 1 ? (width - (padX * 2)) / (items.length - 1) : 0;
  const points = items.map((item, index) => {
    const x = padX + (index * step);
    const y = height - padY - ((Math.max(0, Math.min(100, item.average)) / 100) * (height - (padY * 2)));
    return { ...item, x, y };
  });
  return `<div class="analysis-line-chart"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Average percentage trend">
    <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" class="chart-axis"/>
    <polyline points="${points.map((point) => `${point.x},${point.y}`).join(" ")}" class="chart-line"/>
    ${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4" class="chart-point"/><text x="${point.x}" y="${point.y - 10}" class="chart-value">${point.average.toFixed(1)}%</text><text x="${point.x}" y="${height - 7}" class="chart-label">${escapeHtml(point.label)}</text>`).join("")}
  </svg></div>`;
}

function analysisDistribution(records) {
  const bands = [
    { label: "90-100", min: 90, max: 100 },
    { label: "80-89", min: 80, max: 89.999 },
    { label: "70-79", min: 70, max: 79.999 },
    { label: "60-69", min: 60, max: 69.999 },
    { label: "50-59", min: 50, max: 59.999 },
    { label: "40-49", min: 40, max: 49.999 },
    { label: "Below 40", min: 0, max: 39.999 }
  ];
  const present = records.filter((record) => record.appeared);
  return bands.map((band) => ({
    label: band.label,
    value: present.filter((record) => record.percentage >= band.min && record.percentage <= band.max).length
  }));
}

function analysisHistogram(items) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return `<div class="analysis-histogram">${items.map((item) => `<div class="analysis-histogram-item">
    <strong>${item.value}</strong><div><i style="height:${(item.value / max) * 100}%"></i></div><span>${escapeHtml(item.label)}</span>
  </div>`).join("")}</div>`;
}

function buildAnalysisTrend(session, classes, subjectFilter, status) {
  const availableExams = new Set(classes.flatMap((className) => currentExams(className)));
  const trendExamOrder = [
    "FT Unit Test 1",
    "FT Unit Test 2",
    "CT1",
    "CT2",
    "First Term",
    "ST Unit Test 1",
    "ST Unit Test 2",
    "Second Term",
    "Third Term"
  ];
  const exams = trendExamOrder.filter((exam) => availableExams.has(exam));
  return exams.map((exam) => {
    const records = buildAcademicAnalysisRecords(session, classes, exam)
      .map((record) => filteredAnalysisRecord(record, subjectFilter))
      .filter((record) => status === "all"
        || (status === "present" && record.appeared)
        || (status === "absent" && !record.appeared))
      .filter((record) => record.appeared);
    return { label: exam.replace(" Unit Test ", " UT "), average: average(records.map((record) => record.percentage)) };
  }).filter((item) => item.average > 0);
}

function renderAcademicAnalysis() {
  if (!els.analysisReport || activeView !== "analysis") return;
  initializeAnalysisFilters();
  const session = els.analysisSessionSelect.value || state.academicSession;
  const sectionFilter = els.analysisSectionSelect.value || "All Classes";
  const classFilter = els.analysisClassSelect.value || "All Classes";
  const exam = els.analysisExamSelect.value || "First Term";
  const subjectFilter = els.analysisSubjectSelect.value || "All Subjects";
  const status = els.analysisStatusSelect.value || "all";
  const threshold = Math.max(0, Math.min(100, Number(els.analysisSupportThreshold.value) || 50));
  const classes = selectedAnalysisClasses();
  const baseRecords = buildAcademicAnalysisSelectionRecords(session, classes, exam);
  const subjectAdjusted = baseRecords.map((record) => filteredAnalysisRecord(record, subjectFilter));
  const records = subjectAdjusted.filter((record) => status === "all"
    || (status === "present" && record.appeared)
    || (status === "absent" && !record.appeared));
  const overview = analysisOverviewMetrics(records);
  const classMetrics = analysisClassMetrics(records);
  const subjectMetrics = analysisSubjectMetrics(baseRecords.filter((record) => status === "all"
    || (status === "present" && record.appeared)
    || (status === "absent" && !record.appeared)), subjectFilter);
  const topStudents = records.filter((record) => record.appeared).sort((a, b) => b.percentage - a.percentage).slice(0, 10);
  const support = records.filter((record) => !record.appeared
    || record.result === "Fail"
    || record.result === "Simple Pass"
    || record.percentage < threshold);
  const bestClass = [...classMetrics].sort((a, b) => b.average - a.average)[0];
  const weakClass = [...classMetrics].sort((a, b) => a.average - b.average)[0];
  const strongSubject = [...subjectMetrics].sort((a, b) => b.passPercentage - a.passPercentage)[0];
  const weakSubject = [...subjectMetrics].sort((a, b) => a.passPercentage - b.passPercentage)[0];
  const workingDays = Math.max(...baseRecords.map((record) => Number(record.workingDays) || 0), 0);
  const attendancePossible = workingDays * baseRecords.length;
  const attendanceTotal = baseRecords.reduce((sum, record) => sum + (Number(record.attendance) || 0), 0);
  const attendancePercentage = attendancePossible ? (attendanceTotal / attendancePossible) * 100 : 0;
  const trend = buildAnalysisTrend(session, classes, subjectFilter, status);

  analysisCurrentData = {
    session, sectionFilter, classFilter, exam, subjectFilter, status, threshold, records, baseRecords,
    overview, classMetrics, subjectMetrics, topStudents, support, trend, attendancePercentage
  };
  const scopeLabel = classFilter === "All Classes" ? sectionFilter : classFilter;
  els.analysisReportSubtitle.textContent = `${scopeLabel} ${exam} | Academic Session ${formatAcademicSession(session)}`;
  const cards = [
    ["Total Enrolment", overview.total],
    ["Present", overview.present],
    ["Absent", overview.absent],
    ["Passed", overview.passed],
    ["Failed", overview.failed],
    ["Pass Percentage", `${overview.passPercentage.toFixed(2)}%`],
    ["School Average", `${overview.schoolAverage.toFixed(2)}%`],
    ["Distinction Rate", `${overview.total ? ((overview.distinction / overview.total) * 100).toFixed(2) : "0.00"}%`],
    ["Failure Rate", `${overview.total ? ((overview.failed / overview.total) * 100).toFixed(2) : "0.00"}%`],
    ["Distinction", overview.distinction],
    ["First Division", overview.first],
    ["Second Division", overview.second],
    ["Third Division", overview.third],
    ["Simple Pass", overview.simplePass]
  ];
  els.analysisOverview.innerHTML = cards.map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("");
  els.analysisClassChart.innerHTML = `${analysisBarChart(classMetrics, "passPercentage", "className")}
    <div class="analysis-table-wrap analysis-class-table-wrap"><table class="analysis-table analysis-class-table">
      <thead><tr><th>Class</th><th>Pass %</th><th>Average</th><th>Highest</th><th>Lowest</th></tr></thead>
      <tbody>${classMetrics.map((metric) => `<tr><td>${metric.className}</td><td>${metric.passPercentage.toFixed(2)}%</td><td>${metric.average.toFixed(2)}%</td><td>${metric.highest.toFixed(2)}%</td><td>${metric.lowest.toFixed(2)}%</td></tr>`).join("") || '<tr><td colspan="5">No class data available.</td></tr>'}</tbody>
    </table></div>`;
  els.analysisClassHighlight.textContent = bestClass
    ? `Best: ${bestClass.className} | Needs focus: ${weakClass.className}`
    : "No class data";
  els.analysisTrendChart.innerHTML = analysisLineChart(trend);
  els.analysisSubjectChart.innerHTML = `<div class="analysis-subject-column-scroll">${analysisColumnChart(subjectMetrics, "average", "name")}</div>
    <h5 class="analysis-subchart-title">Subject Pass Percentage</h5>
    <div class="analysis-subject-pass-scroll">${analysisBarChart(subjectMetrics, "passPercentage", "name")}</div>`;
  els.analysisSubjectHighlight.textContent = strongSubject
    ? `Strongest: ${strongSubject.name} | Weakest: ${weakSubject.name}`
    : "No subject data";
  els.analysisSubjectBody.innerHTML = subjectMetrics.length
    ? subjectMetrics.map((metric) => `<tr><td>${escapeHtml(metric.name)}</td><td>${metric.highest.toFixed(2)}%</td><td>${metric.lowest.toFixed(2)}%</td><td>${metric.average.toFixed(2)}%</td><td>${metric.passPercentage.toFixed(2)}%</td><td>${metric.passed}</td><td>${metric.failed}</td></tr>`).join("")
    : '<tr><td colspan="7">No subject data available.</td></tr>';
  els.analysisDivisionChart.innerHTML = analysisDonutChart([
    { label: "Distinction", value: overview.distinction, color: "#7b2cbf" },
    { label: "First", value: overview.first, color: "#157347" },
    { label: "Second", value: overview.second, color: "#1769aa" },
    { label: "Third", value: overview.third, color: "#c45a00" },
    { label: "Simple Pass", value: overview.simplePass, color: "#8a5a00" },
    { label: "Fail", value: overview.failed, color: "#b42318" }
  ], `${overview.total} Students`);
  els.analysisPassFailChart.innerHTML = analysisDonutChart([
    { label: "Passed", value: overview.passed, color: "#157347" },
    { label: "Failed", value: overview.failed, color: "#b42318" }
  ], `${overview.passPercentage.toFixed(1)}% Pass`);
  els.analysisAttendance.innerHTML = `<div class="attendance-analysis-value"><strong>${attendancePercentage.toFixed(2)}%</strong><span>Attendance</span></div>
    <dl><div><dt>Total Students</dt><dd>${baseRecords.length}</dd></div><div><dt>Present Results</dt><dd>${overview.present}</dd></div><div><dt>Absent Results</dt><dd>${overview.absent}</dd></div></dl>`;
  els.analysisDistributionChart.innerHTML = analysisHistogram(analysisDistribution(records));
  els.analysisTopStudents.innerHTML = analysisTopStudentsChart(topStudents);
  els.analysisSupportBody.innerHTML = support.length
    ? support.map((record) => {
      const reasons = [];
      const failedSubjects = abbreviatedAnalysisFailedSubjects(record);
      if (!record.appeared) reasons.push("Absent");
      if (failedSubjects) reasons.push(`Failed: ${failedSubjects}`);
      else if (record.result === "Fail") reasons.push("Failed");
      else if (record.result === "Simple Pass") reasons.push("Simple Pass");
      if (record.appeared && record.percentage < threshold) reasons.push(`Below ${threshold}%`);
      return `<tr><td>${record.roll}</td><td>${escapeHtml(record.name)}</td><td>${record.className}</td><td>${record.appeared ? formatResultStatus(record.result) : "Absent"}</td><td>${record.appeared ? `${record.percentage.toFixed(2)}%` : "-"}</td><td>${escapeHtml(reasons.join(", "))}</td></tr>`;
    }).join("")
    : '<tr><td colspan="6">No students currently meet the support criteria.</td></tr>';

  if (status === "absent") {
    els.analysisStrengths.innerHTML = "";
    els.analysisWeaknesses.innerHTML = "";
    els.analysisRecommendations.innerHTML = "";
    return;
  }

  const strengths = [];
  const weaknesses = [];
  const recommendations = [];
  if (strongSubject) strengths.push(`${strongSubject.name} has the highest pass percentage (${strongSubject.passPercentage.toFixed(2)}%).`);
  if (bestClass) strengths.push(`${bestClass.className} has the highest average percentage (${bestClass.average.toFixed(2)}%).`);
  if (overview.distinction) strengths.push(`${overview.distinction} student(s) achieved Distinction.`);
  if (weakSubject) {
    weaknesses.push(`${weakSubject.name} has the lowest pass percentage (${weakSubject.passPercentage.toFixed(2)}%).`);
    recommendations.push(`Provide focused practice and remedial support in ${weakSubject.name}.`);
  }
  if (weakClass) {
    weaknesses.push(`${weakClass.className} has the lowest average percentage (${weakClass.average.toFixed(2)}%).`);
    recommendations.push(`Review learning gaps and intervention plans for ${weakClass.className}.`);
  }
  if (overview.absent) {
    weaknesses.push(`${overview.absent} student(s) are absent from the selected result.`);
    recommendations.push("Follow up on attendance and missed assessments.");
  }
  if (support.length) recommendations.push(`Monitor the ${support.length} student(s) listed under Students Needing Support.`);
  if (!strengths.length) strengths.push("More completed result data is needed to identify strengths.");
  if (!weaknesses.length) weaknesses.push("No major weakness is visible in the selected data.");
  if (!recommendations.length) recommendations.push("Continue regular monitoring and enrichment activities.");
  els.analysisStrengths.innerHTML = strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  els.analysisWeaknesses.innerHTML = weaknesses.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  els.analysisRecommendations.innerHTML = recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

async function downloadAnalysisPDF() {
  if (!analysisCurrentData || !window.html2canvas || !window.jspdf?.jsPDF) {
    showToast("Academic analysis is not ready for PDF download.");
    return;
  }
  const button = els.downloadAnalysisPdfBtn;
  if (button?.disabled) return;
  const previousText = button.textContent;
  let captureSource = null;
  try {
    button.disabled = true;
    button.textContent = "Generating Analysis PDF...";
    captureSource = els.analysisReport.cloneNode(true);
    captureSource.classList.add("analysis-pdf-capture");
    document.body.appendChild(captureSource);
    const canvas = await window.html2canvas(captureSource, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false
    });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a3", compress: true });
    const margin = 7;
    const pageWidth = 297;
    const pageHeight = 420;
    const imageWidth = pageWidth - (margin * 2);
    const imageHeight = (canvas.height * imageWidth) / canvas.width;
    const printableHeight = pageHeight - (margin * 2);
    const image = canvas.toDataURL("image/jpeg", 0.94);
    let offset = 0;
    let page = 0;
    while (offset < imageHeight) {
      if (page > 0) pdf.addPage("a3", "portrait");
      pdf.addImage(image, "JPEG", margin, margin - offset, imageWidth, imageHeight, undefined, "FAST");
      offset += printableHeight;
      page += 1;
    }
    pdf.save(`Academic_Analysis_${fileSafeName(analysisCurrentData.classFilter)}_${fileSafeName(analysisCurrentData.exam)}_${fileSafeName(analysisCurrentData.session)}.pdf`);
  } catch (error) {
    console.error("Could not generate Academic Analysis PDF", error);
    showToast("Could not generate analysis PDF. Please try again.");
  } finally {
    captureSource?.remove();
    button.disabled = false;
    button.textContent = previousText;
  }
}

function exportAnalysisExcel() {
  if (!analysisCurrentData || !window.XLSX) {
    showToast("Academic analysis is not ready for Excel export.");
    return;
  }
  const data = analysisCurrentData;
  const workbook = window.XLSX.utils.book_new();
  const overviewRows = Object.entries(data.overview).map(([metric, value]) => ({ Metric: formatFirebaseFieldName(metric), Value: value }));
  const classRows = data.classMetrics.map((item) => ({
    Class: item.className,
    "Pass Percentage": item.passPercentage,
    "Average Percentage": item.average,
    Highest: item.highest,
    Lowest: item.lowest
  }));
  const subjectRows = data.subjectMetrics.map((item) => ({
    Subject: item.name,
    Highest: item.highest,
    Lowest: item.lowest,
    Average: item.average,
    "Pass Percentage": item.passPercentage,
    Passed: item.passed,
    Failed: item.failed
  }));
  const supportRows = data.support.map((record) => ({
    "Roll Number": record.roll,
    Name: record.name,
    Class: record.className,
    Present: record.appeared ? "Yes" : "No",
    Percentage: record.appeared ? record.percentage : "",
    Result: record.result
  }));
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(overviewRows), "Overview");
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(classRows), "Class Analysis");
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(subjectRows), "Subject Analysis");
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(supportRows), "Students Needing Support");
  window.XLSX.writeFile(workbook, `Academic_Analysis_${fileSafeName(data.session)}.xlsx`);
}

function printAcademicAnalysis() {
  if (!analysisCurrentData) {
    showToast("Academic analysis is not ready to print.");
    return;
  }
  startPrintMode("print-analysis");
}

function printResults() {
  if (!isAdmin()) {
    showToast("Only Admin can print results.");
    return;
  }
  if (!canViewResult()) {
    showToast("Publish the result before printing results.");
    return;
  }
  printView("results");
}

async function downloadResultsPDF() {
  const button = els.downloadResultsPdfBtn;
  if (!canViewResult()) {
    showToast("Publish the result before downloading results.");
    return;
  }
  if (!window.html2canvas || !window.jspdf?.jsPDF) {
    showToast("Could not generate PDF. Please try again.");
    return;
  }

  const rows = visibleResultRows();
  if (!rows.length) {
    showToast("No result records are available to download.");
    return;
  }

  if (button?.disabled) return;
  const previousText = button?.textContent || "Download PDF";
  const layout = resultPdfLayout(selectedClass(), selectedExam());
  let host = null;

  try {
    if (button) {
      clearContextMessage(button);
      button.disabled = true;
      button.classList.add("is-downloading");
      button.textContent = "Downloading Result sheet";
    }
    if (document.fonts?.ready) await document.fonts.ready;

    host = document.createElement("div");
    host.className = "result-pdf-capture-host";
    host.style.width = `${layout.contentWidth}mm`;
    document.body.appendChild(host);

    const pages = paginateResultRows(rows, host, layout);
    pages.forEach((page, index) => {
      const pageNumber = page.querySelector(".result-pdf-page-number");
      if (pageNumber) pageNumber.textContent = `Page ${index + 1} of ${pages.length}`;
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: layout.orientation,
      unit: "mm",
      format: "a3",
      compress: true,
      precision: 16
    });

    for (const [index, page] of pages.entries()) {
      const canvas = await captureResultPdfPage(page);
      if (index > 0) pdf.addPage("a3", layout.orientation);
      addResultCanvasToPdf(pdf, canvas, layout);
      page.remove();
      canvas.width = 1;
      canvas.height = 1;
    }

    pdf.save(resultPdfFilename());
  } catch (error) {
    console.error("Could not generate Result PDF", error);
    showToast("Could not generate PDF. Please try again.");
  } finally {
    host?.remove();
    if (button) {
      button.disabled = false;
      button.classList.remove("is-downloading");
      button.textContent = previousText;
    }
  }
}

function visibleResultRows() {
  return [...(els.resultsBody?.querySelectorAll("tr") || [])].filter((row) => {
    if (row.hidden || row.getAttribute("aria-hidden") === "true") return false;
    if (window.getComputedStyle(row).display === "none") return false;
    return row.querySelectorAll("td").length > 1;
  });
}

function resultPdfLayout(className, exam = selectedExam()) {
  const earlyClass = ["LKG", "UKG"].includes(className);
  const termSheetClass = [
    "Class I", "Class II", "Class III", "Class IV",
    "Class V", "Class VI", "Class VII", "Class VIII"
  ].includes(className);
  const landscape = earlyClass
    || (termSheetClass && termExams.includes(exam))
    || (["Class IX", "Class X"].includes(className) && exam === "Third Term");
  const pageWidth = landscape ? 420 : 297;
  const pageHeight = landscape ? 297 : 420;
  const margin = 5;
  return {
    orientation: landscape ? "landscape" : "portrait",
    pageWidth,
    pageHeight,
    margin,
    contentWidth: pageWidth - (margin * 2),
    contentHeight: pageHeight - (margin * 2)
  };
}

function paginateResultRows(rows, host, layout) {
  const pages = [];
  let rowIndex = 0;
  const rowsPerPage = layout.orientation === "portrait" ? 30 : 28;

  while (rowIndex < rows.length) {
    const page = createResultPdfPage({
      layout,
      includeSummary: pages.length === 0,
      rows
    });
    host.appendChild(page);
    const tableBody = page.querySelector("tbody");
    const pageEnd = Math.min(rowIndex + rowsPerPage, rows.length);
    while (rowIndex < pageEnd) {
      const row = rows[rowIndex].cloneNode(true);
      abbreviateResultPdfRow(row);
      tableBody.appendChild(row);
      rowIndex += 1;
    }
    pages.push(page);
  }

  fitResultPdfPages(pages);
  return pages;
}

function fitResultPdfPages(pages) {
  let scale = 1;
  for (let pass = 0; pass < 5; pass += 1) {
    pages.forEach((page) => applyResultPdfTableScale(page, scale));
    let fitRatio = 1;
    pages.forEach((page) => {
      const body = page.querySelector(".result-pdf-table-body");
      const table = page.querySelector(".result-pdf-table");
      if (!body || !table) return;
      const widthRatio = body.clientWidth / Math.max(table.scrollWidth, 1);
      const heightRatio = body.clientHeight / Math.max(table.scrollHeight, 1);
      fitRatio = Math.min(fitRatio, widthRatio, heightRatio);
    });
    if (fitRatio >= 0.995) break;
    scale *= Math.max(0.72, fitRatio * 0.985);
    scale = Math.max(0.48, scale);
  }
  pages.forEach((page) => applyResultPdfTableScale(page, scale));
}

function applyResultPdfTableScale(page, scale) {
  const table = page.querySelector(".result-pdf-table");
  if (!table) return;
  const structured = table.classList.contains("structured-results");
  const referenceTwelvePoint = table.classList.contains("result-pdf-reference-twelve-point");
  const largeOneLine = table.classList.contains("result-pdf-large-one-line");
  const bodyFont = structured ? (largeOneLine ? 13 : 10.24) : (largeOneLine ? 19 : 16);
  const headFont = structured ? (largeOneLine ? 12 : 10.24) : (largeOneLine ? 16 : 12.48);
  const verticalFont = structured ? (largeOneLine ? 10 : 8.64) : (largeOneLine ? 16 : 12.48);
  const paddingY = referenceTwelvePoint ? 12 : (structured ? 5 : 12);
  const paddingX = referenceTwelvePoint ? 14 : (structured ? 4 : 14);
  table.style.setProperty("--result-pdf-body-font", `${Math.max(6, bodyFont * scale)}px`);
  table.style.setProperty("--result-pdf-head-font", `${Math.max(6, headFont * scale)}px`);
  table.style.setProperty("--result-pdf-vertical-font", `${Math.max(5.5, verticalFont * scale)}px`);
  table.style.setProperty("--result-pdf-padding-y", `${Math.max(1, paddingY * scale)}px`);
  table.style.setProperty("--result-pdf-padding-x", `${Math.max(1, paddingX * scale)}px`);
  table.querySelectorAll("[data-result-font-pt]").forEach((cell) => {
    const baseFont = Number(cell.dataset.resultFontPt) || 10;
    const isHeader = Boolean(cell.closest("thead"));
    const role = cell.dataset.resultRole || "";
    const referenceCellTwelvePoint = !isHeader
      && referenceTwelvePoint
      && ["roll", "name", "subject", "component", "total", "percentage", "division"].includes(role);
    const pdfBaseFont = referenceCellTwelvePoint ? 12 : (!isHeader && baseFont === 10 ? 12 : baseFont);
    const pdfFont = referenceCellTwelvePoint ? 12 : Math.max(7, pdfBaseFont * scale);
    cell.style.setProperty("--result-pdf-cell-font", `${pdfFont}pt`);
  });
}

function createResultPdfPage({ layout, includeSummary, rows }) {
  const page = document.createElement("section");
  page.className = `result-pdf-page result-pdf-${layout.orientation}`;
  page.style.width = `${layout.contentWidth}mm`;
  page.style.height = `${layout.contentHeight}mm`;

  if (includeSummary) {
    const header = document.createElement("header");
    header.className = "result-pdf-header";
    const heading = document.createElement("div");
    heading.innerHTML = `
      <h3>PINEHILL ADVENTIST ACADEMY</h3>
      <p>${escapeHtml(`${selectedClass()} ${selectedExam()} Result : Academic Session ${formatAcademicSession(state.academicSession)}`)}</p>
    `;
    header.appendChild(heading);
    page.appendChild(header);
    page.appendChild(createResultPdfSummary(rows));
  }

  const tableBody = document.createElement("div");
  tableBody.className = "result-pdf-table-body";
  const table = els.resultsTable.cloneNode(false);
  table.style.width = "100%";
  table.classList.add("result-pdf-table");
  applyResultPdfTableProfile(table, selectedClass(), selectedExam());
  const resultLayoutColumns = els.resultsTable.querySelector('colgroup[data-result-layout="true"]');
  if (resultLayoutColumns) table.appendChild(resultLayoutColumns.cloneNode(true));
  fitResultPdfNameColumn(table, rows, layout);
  table.appendChild(els.resultsHead.cloneNode(true));
  table.appendChild(document.createElement("tbody"));
  if (table.classList.contains("result-pdf-large-one-line")) {
    table.querySelectorAll("thead th br").forEach((breakElement) => breakElement.replaceWith(" "));
  }
  abbreviateHighClassResultPdfHeaders(table, selectedClass(), selectedExam());
  abbreviateUnitTestResultPdfHeaders(table, selectedExam());
  tableBody.appendChild(table);
  page.appendChild(tableBody);

  const pageNumber = document.createElement("div");
  pageNumber.className = "result-pdf-page-number";
  page.appendChild(pageNumber);
  return page;
}

function fitResultPdfNameColumn(table, rows, layout) {
  const columns = [...table.querySelectorAll('colgroup[data-result-layout="true"] col')];
  const nameColumn = columns.find((column) => column.dataset.resultRole === "name");
  if (!nameColumn || !columns.length) return;

  const names = rows
    .map((row) => String(row.cells?.[1]?.textContent || "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const canvas = fitResultPdfNameColumn.canvas || (fitResultPdfNameColumn.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  if (!context) return;
  context.font = "400 16px Arial, sans-serif";
  const longestNameWidth = names.reduce(
    (widest, name) => Math.max(widest, context.measureText(name).width),
    context.measureText("STUDENT NAME").width
  );
  const tableWidthPx = layout.contentWidth * (96 / 25.4);
  const desiredNameWidth = Math.min(280, Math.max(108, Math.ceil(longestNameWidth + 20)));
  const desiredPercent = Math.min(24, Math.max(8, (desiredNameWidth / tableWidthPx) * 100));
  const otherColumns = columns.filter((column) => column !== nameColumn);
  const otherWidthTotal = otherColumns.reduce(
    (sum, column) => sum + (Number.parseFloat(column.style.width) || 0),
    0
  );

  nameColumn.style.width = `${desiredPercent}%`;
  if (otherWidthTotal <= 0) return;
  const remainingPercent = 100 - desiredPercent;
  otherColumns.forEach((column) => {
    const currentWidth = Number.parseFloat(column.style.width) || 0;
    column.style.width = `${(currentWidth / otherWidthTotal) * remainingPercent}%`;
  });
}

function applyResultPdfTableProfile(table, className, exam) {
  const term = termExams.includes(exam);
  const lowerClassPdf = classNames.slice(0, classNames.indexOf("Class IX")).includes(className);
  const largeOneLine = (
    ["LKG", "UKG"].includes(className)
    || ["Class I", "Class II", "Class III", "Class IV", "Class VII", "Class VIII"].includes(className)
  ) && term;
  const subjectHeadOneLine = [
    "Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI"
  ].includes(className)
    && primaryUnitTests.includes(exam);
  const highClassAbbreviated = ["Class IX", "Class X"].includes(className) && term;
  table.classList.toggle(
    "result-pdf-reference-twelve-point",
    [
      "LKG",
      "UKG",
      "Class I",
      "Class II",
      "Class III",
      "Class IV",
      "Class VII",
      "Class VIII",
      "Class IX",
      "Class X"
    ].includes(className)
  );
  table.classList.toggle("result-pdf-lkg-class-viii", lowerClassPdf);
  table.classList.toggle("result-pdf-large-one-line", largeOneLine);
  table.classList.toggle("result-pdf-subject-head-one-line", subjectHeadOneLine);
  table.classList.toggle("result-pdf-high-abbreviated", highClassAbbreviated);
}

function abbreviateHighClassResultPdfHeaders(table, className, exam) {
  if (!["Class IX", "Class X"].includes(className) || !termExams.includes(exam)) return;
  const replacements = {
    ENGLISH: "ENG",
    MIZO: "MZ",
    MATHEMATICS: "MATHS",
    SCIENCE: "SC",
    "SOCIAL SCIENCE": "S.S.",
    "SKILL DEVELOPMENT": "SKILL DEV",
    ATTENDANCE: "ATTD.",
    "GRAND TOTAL": "G. TOTAL",
    GRANDTOTAL: "G. TOTAL",
    PERCENTAGE: "%",
    DIVISION: "DIV."
  };
  table.querySelectorAll("thead th").forEach((cell) => {
    const label = cell.querySelector("span") || cell;
    const key = String(label.textContent || "").replace(/\s+/g, " ").trim().toUpperCase();
    const replacement = replacements[key];
    if (replacement) label.textContent = replacement;
  });
}

function abbreviateUnitTestResultPdfHeaders(table, exam) {
  if (!primaryUnitTests.includes(exam)) return;
  const replacements = {
    MATHEMATICS: "MATHS",
    "SKILL DEVELOPMENT": "SKILL DEV.",
    ATTENDANCE: "ATTND.",
    PERCENTAGE: "%",
    DIVISION: "DIV."
  };
  table.querySelectorAll("thead th").forEach((cell) => {
    const label = cell.querySelector("span") || cell;
    const key = String(label.textContent || "").replace(/\s+/g, " ").trim().toUpperCase();
    const replacement = replacements[key];
    if (replacement) label.textContent = replacement;
  });
}

function abbreviateResultPdfRow(row) {
  row.querySelectorAll(".status-pill").forEach((status) => {
    if (String(status.textContent || "").trim().toLowerCase() === "simple pass") {
      status.textContent = "S.P.";
    }
  });
}

function createResultPdfSummary(rows) {
  const summary = document.createElement("div");
  summary.className = "result-summary result-pdf-summary";
  const records = rows.map((row) => {
    const cells = row.querySelectorAll("td");
    return {
      result: String(cells[cells.length - 1]?.textContent || "").trim(),
      division: String(cells[cells.length - 2]?.textContent || "").trim()
    };
  });
  const appearedRecords = records.filter((record) => record.result && record.result !== "-");
  const present = appearedRecords.length;
  const passed = appearedRecords.filter((record) => record.result !== "Fail").length;
  const passSummary = calculateClassPassSummary(records.length, present, passed);
  const divisionCount = (division) => appearedRecords.filter((record) => record.division === division).length;

  summary.innerHTML = `
    ${summaryItem("Total Students", passSummary.total)}
    ${summaryItem("Present", passSummary.present)}
    ${summaryItem("Absent", passSummary.absent)}
    ${summaryItem("Passed", passSummary.passed)}
    ${summaryItem("Failed", passSummary.failed)}
    ${summaryItem("Pass Percentage", `${passSummary.passPercentage.toFixed(2)}%`)}
    ${summaryItem("No. of Distinction", divisionCount("Dist."))}
    ${summaryItem("No. of First Division", divisionCount("I"))}
    ${summaryItem("No. of Second Division", divisionCount("II"))}
    ${summaryItem("No. of Third Division", divisionCount("III"))}
  `;
  return summary;
}

async function captureResultPdfPage(page) {
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  return window.html2canvas(page, {
    backgroundColor: "#ffffff",
    scale: 3,
    useCORS: true,
    allowTaint: true,
    logging: false,
    imageTimeout: 15000,
    removeContainer: true,
    scrollX: 0,
    scrollY: 0,
    windowWidth: page.scrollWidth,
    windowHeight: page.scrollHeight
  });
}

function addResultCanvasToPdf(pdf, canvas, layout) {
  const imageRatio = canvas.width / canvas.height;
  const contentRatio = layout.contentWidth / layout.contentHeight;
  let imageWidth = layout.contentWidth;
  let imageHeight = layout.contentHeight;
  if (imageRatio > contentRatio) {
    imageHeight = imageWidth / imageRatio;
  } else {
    imageWidth = imageHeight * imageRatio;
  }
  const x = layout.margin + ((layout.contentWidth - imageWidth) / 2);
  const y = layout.margin + ((layout.contentHeight - imageHeight) / 2);
  pdf.addImage(
    canvas.toDataURL("image/png"),
    "PNG",
    x,
    y,
    imageWidth,
    imageHeight,
    undefined,
    "SLOW"
  );
}

function resultPdfFilename() {
  const session = String(state.academicSession || "").replace(/\s+/g, "");
  return `Results_${fileSafeName(selectedClass())}_${fileSafeName(selectedExam())}_${fileSafeName(session)}.pdf`;
}

function saveResultsPdf() {
  if (!canViewResult()) {
    showToast("Publish the result before saving PDF.");
    return;
  }
  showToast('Choose "Save as PDF" in the print dialog.');
  printView("results");
}

function printCurrentMarksheet() {
  if (!isAdmin()) {
    showToast("Only Admin can print marksheets.");
    return;
  }
  if (!canViewResult()) {
    showToast("Publish the result before printing marksheets.");
    return;
  }
  if (!els.marksheetBody?.querySelector(".marksheet")) {
    showToast("No marksheet available to print.");
    return;
  }
  const currentMarksheet = getCurrentVisibleMarksheet();
  if (!currentMarksheet) {
    showToast("No marksheet available on the current screen.");
    return;
  }
  clearCurrentPrintTarget();
  currentMarksheet.classList.add("print-current-target");
  startPrintMode("print-marksheets", "print-current-marksheet");
}

function printAllMarksheets() {
  if (!isAdmin()) {
    showToast("Only Admin can print marksheets.");
    return;
  }
  if (!canViewResult()) {
    showToast("Publish the result before printing marksheets.");
    return;
  }
  const hasSearch = Boolean((els.marksheetNameSearchInput?.value || "").trim());
  if (hasSearch) {
    restoreMarksheetsAfterPrint = true;
    renderMarksheets({ ignoreSearch: true });
  }
  if (!els.marksheetBody?.querySelector(".marksheet")) {
    restoreMarksheetsAfterPrint = false;
    renderMarksheets();
    showToast("No marksheet available to print.");
    return;
  }
  clearCurrentPrintTarget();
  startPrintMode("print-marksheets");
}

function saveMarksheetsPdf() {
  if (!canViewResult()) {
    showToast("Publish the result before saving PDF.");
    return;
  }
  showToast('Choose "Save as PDF" in the print dialog.');
  printView("marksheets");
}

async function downloadMarksheetPDF() {
  if (!canViewResult()) {
    showToast("Publish the result before downloading marksheets.");
    return;
  }
  if (!window.html2canvas || !window.jspdf?.jsPDF) {
    showToast("Could not generate PDF. Please try again.");
    return;
  }

  const button = els.downloadMarksheetPdfBtn;
  const previousText = button?.textContent || "Download PDF";
  if (button?.disabled) return;

  const allMarksheets = [...(els.marksheetBody?.querySelectorAll(".marksheet") || [])];
  const hasStudentFilter = Boolean((els.marksheetNameSearchInput?.value || "").trim());
  const currentMarksheet = getCurrentVisibleMarksheet();
  const marksheetsToDownload = hasStudentFilter
    ? (currentMarksheet ? [currentMarksheet] : [])
    : allMarksheets;

  if (!marksheetsToDownload.length) {
    showToast("No marksheet available to download.");
    return;
  }

  let host = null;
  try {
    if (button) {
      button.disabled = true;
      button.textContent = "Generating PDF...";
    }
    showToast("Generating PDF...");

    host = document.createElement("div");
    host.className = "pdf-capture-host";
    document.body.appendChild(host);

    if (document.fonts?.ready) await document.fonts.ready;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });

    for (const [index, marksheet] of marksheetsToDownload.entries()) {
      const canvas = await captureMarksheetCanvas(marksheet, host);
      if (index > 0) pdf.addPage("a5", "portrait");
      addMarksheetCanvasToPdf(pdf, canvas);
    }

    pdf.save(marksheetsToDownload.length === 1
      ? marksheetPdfFilename(marksheetsToDownload[0])
      : allMarksheetsPdfFilename());
  } catch (error) {
    console.error("Could not generate marksheet PDF", error);
    showToast("Could not generate PDF. Please try again.");
  } finally {
    marksheetsToDownload.forEach((marksheet) => marksheet.classList.remove("pdf-capture-source"));
    host?.remove();
    if (button) {
      button.disabled = false;
      button.textContent = previousText;
    }
  }
}

async function captureMarksheetCanvas(marksheet, host) {
  marksheet.classList.add("pdf-capture-source");
  const clone = marksheet.cloneNode(true);
  clone.classList.add("pdf-capture-target");
  clone.classList.remove("print-current-target");
  const logoWatermark = await createPdfLogoWatermark();
  if (logoWatermark) clone.prepend(logoWatermark);
  host.replaceChildren(clone);
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  return window.html2canvas(clone, {
    backgroundColor: "#ffffff",
    scale: Math.min(3, Math.max(2, window.devicePixelRatio || 1)),
    useCORS: true,
    allowTaint: true,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: clone.scrollWidth,
    windowHeight: clone.scrollHeight
  });
}

async function createPdfLogoWatermark() {
  const source = document.querySelector('img[src*="school-logo.png"]');
  if (!source) return null;

  const watermark = document.createElement("img");
  watermark.className = "pdf-capture-logo-watermark";
  watermark.alt = "";
  watermark.setAttribute("aria-hidden", "true");

  try {
    if (!source.complete || !source.naturalWidth) {
      await source.decode();
    }
    const canvas = document.createElement("canvas");
    canvas.width = source.naturalWidth;
    canvas.height = source.naturalHeight;
    canvas.getContext("2d").drawImage(source, 0, 0);
    watermark.src = canvas.toDataURL("image/png");
  } catch (error) {
    console.warn("Using the original school logo for PDF capture", error);
    watermark.src = source.currentSrc || source.src;
  }

  try {
    await watermark.decode();
  } catch (error) {
    console.warn("School logo could not be decoded for PDF capture", error);
  }
  return watermark;
}

function addMarksheetCanvasToPdf(pdf, canvas) {
  const pageWidth = 148;
  const pageHeight = 210;
  const margin = 3;
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;
  const imageRatio = canvas.width / canvas.height;
  let imageWidth = usableWidth;
  let imageHeight = imageWidth / imageRatio;
  if (imageHeight > usableHeight) {
    imageHeight = usableHeight;
    imageWidth = imageHeight * imageRatio;
  }
  const imageX = margin + (usableWidth - imageWidth) / 2;
  const imageY = margin + (usableHeight - imageHeight) / 2;
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", imageX, imageY, imageWidth, imageHeight, undefined, "FAST");
}

function marksheetPdfFilename(marksheet) {
  const studentName = marksheet?.dataset?.studentName || "Student";
  const className = marksheet?.dataset?.className || selectedClass();
  const rollNo = marksheet?.dataset?.rollNo || "RollNo";
  return `Marksheet_${fileSafeName(studentName)}_${fileSafeName(className)}_${fileSafeName(rollNo)}.pdf`;
}

function allMarksheetsPdfFilename() {
  return `Marksheets_${fileSafeName(selectedClass())}_${fileSafeName(selectedExam())}.pdf`;
}

function fileSafeName(value) {
  return String(value || "")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_")
    || "NA";
}

function printView(view) {
  startPrintMode(`print-${view}`);
}

function getCurrentVisibleMarksheet() {
  const marksheets = [...(els.marksheetBody?.querySelectorAll(".marksheet") || [])];
  if (!marksheets.length) return null;
  const viewport = els.marksheetPrintArea?.getBoundingClientRect?.()
    || els.marksheetBody?.getBoundingClientRect?.()
    || { top: 0, bottom: window.innerHeight };
  let best = marksheets[0];
  let bestVisible = -1;

  marksheets.forEach((marksheet) => {
    const rect = marksheet.getBoundingClientRect();
    const visible = Math.max(0, Math.min(rect.bottom, viewport.bottom) - Math.max(rect.top, viewport.top));
    if (visible > bestVisible) {
      best = marksheet;
      bestVisible = visible;
    }
  });

  return best;
}

function clearCurrentPrintTarget() {
  els.marksheetBody?.querySelectorAll(".print-current-target").forEach((marksheet) => {
    marksheet.classList.remove("print-current-target");
  });
}

function startPrintMode(printClass, extraClass = "") {
  clearTimeout(printCleanupTimer);
  document.body.classList.remove("print-results", "print-marksheets", "print-current-marksheet", "print-analysis");
  activePrintClass = printClass;
  document.body.classList.add(printClass);
  if (extraClass) document.body.classList.add(extraClass);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.print();
      printCleanupTimer = setTimeout(clearPrintMode, 30000);
    });
  });
}

function clearPrintMode() {
  clearTimeout(printCleanupTimer);
  printCleanupTimer = null;
  document.body.classList.remove("print-results", "print-marksheets", "print-current-marksheet", "print-analysis");
  clearCurrentPrintTarget();
  activePrintClass = "";
  if (restoreMarksheetsAfterPrint) {
    restoreMarksheetsAfterPrint = false;
    renderMarksheets();
  }
}

function renderEntryAccessControl() {
  if (!els.entryAccessDashboard) return;
  if (!isAdmin()) {
    els.entryAccessDashboard.innerHTML = "";
    return;
  }

  if (!entryAccessDirty) {
    entryAccessDraft = normalizeEntryAccess(state.entryAccess);
    attendanceAccessDraft = normalizeAttendanceAccess(state.attendanceAccess);
  }

  els.entryAccessDashboard.innerHTML = `
    <div class="entry-access-section-title">
      <span class="eyebrow">Marks Entry</span>
      <h3>Marks Entry Access</h3>
    </div>
    ${renderMarksAccessTable()}
    <div class="entry-access-section-title">
      <span class="eyebrow">Attendance</span>
      <h3>Attendance Access</h3>
    </div>
    ${renderAttendanceAccessTable()}
  `;

  document.querySelectorAll("[data-entry-access-kind]").forEach((input) => {
    input.addEventListener("change", () => {
      const kind = input.dataset.entryAccessKind;
      const groupKey = input.dataset.entryAccessGroup;
      const examKeyValue = input.dataset.entryAccessExam;
      if (kind === "attendanceAll") {
        attendanceAccessDraft = normalizeAttendanceAccess(attendanceAccessDraft);
        Object.keys(attendanceAccessDraft).forEach((attendanceGroupKey) => {
          if (attendanceAccessDraft[attendanceGroupKey]?.[examKeyValue]) {
            attendanceAccessDraft[attendanceGroupKey][examKeyValue].enabled = input.checked;
          }
        });
      } else if (kind === "attendance") {
        attendanceAccessDraft = normalizeAttendanceAccess(attendanceAccessDraft);
        attendanceAccessDraft[groupKey][examKeyValue].enabled = input.checked;
      } else {
        entryAccessDraft = normalizeEntryAccess(entryAccessDraft);
        entryAccessDraft[groupKey][examKeyValue].enabled = input.checked;
      }
      entryAccessDirty = true;
      renderEntryAccessControl();
      updateEntryAccessSaveStatus();
    });
  });

  updateEntryAccessSaveStatus();
}

function accessStatusCell(enabled) {
  return `<span class="entry-status-badge ${enabled ? "active" : "locked"}">${enabled ? "ACTIVE" : `${String.fromCodePoint(0x1F512)} LOCKED`}</span>`;
}

function accessToggleCell(kind, groupKey, exam, enabled, label) {
  return `<label class="toggle-switch" aria-label="${escapeAttr(label)}">
    <input type="checkbox" data-entry-access-kind="${kind}" data-entry-access-group="${groupKey}" data-entry-access-exam="${exam.key}" ${enabled ? "checked" : ""}>
    <span></span>
  </label>`;
}

function renderMarksAccessTable() {
  const lowerGroupKey = "classes1to8";
  const highGroupKey = "classes9to10";
  const lowerGroup = entryAccessGroups[lowerGroupKey];
  const highGroup = entryAccessGroups[highGroupKey];
  const rowCount = Math.max(lowerGroup.exams.length, highGroup.exams.length);

  return `
    <article class="entry-access-card wide">
      <div class="entry-access-table-wrap">
        <table class="entry-access-table combined-access-table marks-access-table">
          <thead>
            <tr>
              <th>Classes I-VIII</th>
              <th>Status</th>
              <th>Allow</th>
              <th>Classes IX-X</th>
              <th>Status</th>
              <th>Allow</th>
            </tr>
          </thead>
          <tbody>
            ${Array.from({ length: rowCount }, (_, index) => {
              const lowerExam = lowerGroup.exams[index];
              const highExam = highGroup.exams[index];
              const lowerEnabled = lowerExam ? Boolean(entryAccessDraft?.[lowerGroupKey]?.[lowerExam.key]?.enabled) : false;
              const highEnabled = highExam ? Boolean(entryAccessDraft?.[highGroupKey]?.[highExam.key]?.enabled) : false;
              return `<tr>
                <td>${lowerExam ? escapeHtml(lowerExam.label) : ""}</td>
                <td>${lowerExam ? accessStatusCell(lowerEnabled) : ""}</td>
                <td>${lowerExam ? accessToggleCell("marks", lowerGroupKey, lowerExam, lowerEnabled, `Allow marks entry for ${lowerGroup.title} ${lowerExam.label}`) : ""}</td>
                <td>${highExam ? escapeHtml(highExam.label) : ""}</td>
                <td>${highExam ? accessStatusCell(highEnabled) : ""}</td>
                <td>${highExam ? accessToggleCell("marks", highGroupKey, highExam, highEnabled, `Allow marks entry for ${highGroup.title} ${highExam.label}`) : ""}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </article>
  `;
}

function attendanceTermStatus(termKey) {
  const values = Object.values(attendanceAccessDraft || {})
    .map((group) => Boolean(group?.[termKey]?.enabled));
  const activeCount = values.filter(Boolean).length;
  if (activeCount === values.length) return { enabled: true, label: "ACTIVE", className: "active" };
  if (activeCount === 0) return { enabled: false, label: `${String.fromCodePoint(0x1F512)} LOCKED`, className: "locked" };
  return { enabled: true, label: "MIXED", className: "mixed" };
}

function renderAttendanceAccessTable() {
  const terms = attendanceAccessGroups.classesLkgTo8.exams;
  return `
    <article class="entry-access-card wide">
      <div class="entry-access-table-wrap">
        <table class="entry-access-table combined-access-table attendance-access-table">
          <thead>
            <tr>
              <th>LKG-Class X Term</th>
              <th>Status</th>
              <th>Allow Entry</th>
            </tr>
          </thead>
          <tbody>
            ${terms.map((term) => {
              const status = attendanceTermStatus(term.key);
              return `<tr>
                <td>${escapeHtml(term.label)}</td>
                <td><span class="entry-status-badge ${status.className}">${status.label}</span></td>
                <td>${accessToggleCell("attendanceAll", "", term, status.enabled, `Allow attendance entry for LKG-Class X ${term.label}`)}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </article>
  `;
}

function updateEntryAccessSaveStatus(message = "") {
  if (!els.entryAccessStatus) return;
  els.entryAccessStatus.textContent = message || (entryAccessDirty
    ? "Unsaved access changes. Click Save Settings."
    : "Live Firestore access settings.");
  els.entryAccessStatus.classList.toggle("dirty", entryAccessDirty);
  if (els.saveEntryAccessBtn) {
    els.saveEntryAccessBtn.disabled = entryAccessSaveInProgress || !entryAccessDirty;
    els.saveEntryAccessBtn.textContent = entryAccessSaveInProgress ? "Saving..." : "Save Settings";
  }
}

function summarizeAccessChanges(groups, access) {
  return Object.entries(groups).map(([groupKey, group]) => {
    const enabled = group.exams
      .filter((exam) => access?.[groupKey]?.[exam.key]?.enabled)
      .map((exam) => exam.label);
    return `${group.title}: ${enabled.length ? enabled.join(", ") : "all locked"}`;
  }).join("; ");
}

function summarizeEntryAccessChanges(nextEntryAccess, nextAttendanceAccess) {
  return `Marks Entry - ${summarizeAccessChanges(entryAccessGroups, nextEntryAccess)}. Attendance - ${summarizeAccessChanges(attendanceAccessGroups, nextAttendanceAccess)}.`;
}

async function saveEntryAccessSettings(access = entryAccessDraft, attendanceAccess = attendanceAccessDraft, options = {}) {
  if (!isAdmin()) {
    showToast("Only admin can modify Entry Access Control.");
    return;
  }
  const nextAccess = normalizeEntryAccess(access);
  const nextAttendanceAccess = normalizeAttendanceAccess(attendanceAccess);
  const summary = summarizeEntryAccessChanges(nextAccess, nextAttendanceAccess);
  const message = options.message || `You are about to set entry access as follows: ${summary}. Do you want to continue?`;
  if (!options.skipConfirm && !window.confirm(message)) return;

  entryAccessSaveInProgress = true;
  updateEntryAccessSaveStatus("Saving entry access settings...");

  try {
    state.entryAccess = nextAccess;
    state.attendanceAccess = nextAttendanceAccess;
    entryAccessDraft = normalizeEntryAccess(nextAccess);
    attendanceAccessDraft = normalizeAttendanceAccess(nextAttendanceAccess);
    entryAccessDirty = false;
    const stateJson = JSON.stringify(state);
    localStorage.setItem(storageKey, stateJson);
    if (window.MarkHubFirebase?.updateAppStateFields) {
      await window.MarkHubFirebase.updateAppStateFields([
        { path: ["state", "entryAccess"], value: nextAccess },
        { path: ["state", "attendanceAccess"], value: nextAttendanceAccess }
      ], structuredClone(state));
      lastSyncedFirebaseStateJson = stateJson;
    } else if (window.MarkHubFirebase?.saveAppState) {
      await window.MarkHubFirebase.saveAppState(structuredClone(state));
      lastSyncedFirebaseStateJson = stateJson;
    }
    updateEntryAccessSaveStatus("Entry access settings saved.");
    renderEntryAccessControl();
    refreshEntryAccessUiOnly();
    showToast("Entry access settings saved.");
  } catch (error) {
    console.error("[Firestore] Save entry access failed", error);
    entryAccessDirty = true;
    updateEntryAccessSaveStatus("Could not save entry access settings.");
    showToast("Could not save Entry Access Control. Please try again.");
  } finally {
    entryAccessSaveInProgress = false;
    updateEntryAccessSaveStatus();
  }
}

function setAllEntryAccess(enabled) {
  const nextAccess = createDefaultEntryAccess(enabled);
  const nextAttendanceAccess = createDefaultAttendanceAccess(enabled);
  const action = enabled ? "unlock all marks and attendance entries" : "lock all marks and attendance entries";
  saveEntryAccessSettings(nextAccess, nextAttendanceAccess, {
    message: `You are about to ${action}. Do you want to continue?`
  });
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
  const displayResult = result === "Simple Pass" ? "S.P." : result;
  return result === "-"
    ? "-"
    : `<span class="status-pill ${resultStatusClass(result)}">${escapeHtml(displayResult)}</span>`;
}

function formatDivisionLabel(division) {
  const classNames = {
    "Dist.": "distinction",
    I: "first",
    II: "second",
    III: "third"
  };
  const className = classNames[division];
  return className
    ? `<span class="division-label ${className}">${escapeHtml(division)}</span>`
    : escapeHtml(division);
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

function toggleResultPublication() {
  if (isPublished()) {
    unpublishCurrentResult();
  } else {
    publishCurrentResult();
  }
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
  if (selectedMarksEntryLocked()) {
    event.target.value = "";
    showToast("This marks entry is locked by Administrator.");
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
  if (!isEntryAccessOpen(className, exam)) {
    showToast("This marks entry is locked by Administrator.");
    return;
  }
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

function getContextMessageRecord(target) {
  if (!target || !target.isConnected) return null;
  showContextMessage.records = showContextMessage.records || new WeakMap();
  const existing = showContextMessage.records.get(target);
  if (existing) return existing;

  const isField = target.matches("input, select, textarea");
  const message = document.createElement("span");
  message.className = isField ? "context-message context-field-message" : "context-message context-button-message";
  message.setAttribute("aria-live", "polite");
  message.hidden = true;
  if (isField) {
    const group = target.parentElement;
    group.classList.add("context-field-message-host");
    target.insertAdjacentElement("afterend", message);
    const record = { group, message, timer: null, target, isField: true };
    showContextMessage.records.set(target, record);
    return record;
  } else {
    const group = document.createElement("span");
    group.className = "context-message-group context-button-message-group";
    target.parentNode.insertBefore(group, target);
    group.appendChild(target);
    group.insertBefore(message, target);
    const record = { group, message, timer: null, target, isField: false };
    showContextMessage.records.set(target, record);
    return record;
  }
}

function showContextMessage(target, text, options = {}) {
  if (!target || !target.isConnected) {
    showToast(text);
    return;
  }
  const { type = "info", duration = 3200 } = options;
  const record = getContextMessageRecord(target);
  if (!record) {
    showToast(text);
    return;
  }
  clearTimeout(record.timer);
  record.message.textContent = text;
  record.message.className = `${record.message.classList.contains("context-field-message") ? "context-message context-field-message" : "context-message context-button-message"} ${type}`;
  record.message.setAttribute("role", type === "error" ? "alert" : "status");
  if (record.isField) {
    record.message.style.left = `${target.offsetLeft}px`;
    record.message.style.top = `${target.offsetTop + target.offsetHeight + 4}px`;
  }
  record.message.hidden = false;
  if (duration > 0) {
    record.timer = setTimeout(() => clearContextMessage(target), duration);
  }
}

function clearContextMessage(target) {
  const record = showContextMessage.records?.get(target);
  if (!record) return;
  clearTimeout(record.timer);
  record.timer = null;
  record.message.hidden = true;
  record.message.textContent = "";
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

init();
