const storageKey = "results-desk-state-v1";
const authKey = "markhub-current-user-v1";
const mobileAuthKey = "markhub-mobile-current-user-v1";
const uiKey = "markhub-ui-state-v1";
const dashboardNotificationSeenKey = "markhub-dashboard-notifications-seen-at-v1";

const users = {
  admin: { password: "admin_#123", role: "admin", name: "Admin" },
  teacher: { password: "teacher123", role: "user", name: "Teacher" },
  principal: { password: "principal#123", role: "user", name: "Principal" }
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
  "Elementary Stage": ["Class VI", "Class VII", "Class VIII"],
  "Secondary Stage": ["Class IX", "Class X"]
};

const analysisExamAll = "All Exams";
const performanceChangeTolerance = 5;

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
  teacherAssignments: [],
  teacherAssessment: createDefaultTeacherAssessmentData(),
  ...createEmptySessionData(),
  sessions: {}
};

let state = loadState();
let activeView = loadSavedUiState().activeView || "dashboard";
let currentUser = loadCurrentUser();
let editingStudentRoll = null;
let dashboardStudentHighlight = null;
let applyingRemoteState = false;
let firebaseStateSyncStarted = false;
let firebaseStateSaveTimer = null;
let firebaseStateSaveRetryTimer = null;
let firebaseStateUnsubscribe = null;
let firebaseSplitSessionUnsubscribe = null;
let firebaseSplitSessionKey = "";
const firebaseSplitSessionPatchCache = new Map();
let firebaseStateWriteInFlight = false;
let pendingFirebaseStateJson = "";
let lastSyncedFirebaseStateJson = "";
const firebaseStateSaveDelay = 900;
const splitClassListSeededSessions = new Set();
const unsavedMarkChanges = new Map();
let marksSaveInProgress = false;
let unsavedAttendanceChanges = false;
const unsavedAttendanceSections = new Set();
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
let teacherAnalyticsCurrentData = null;
let editingTeacherAssignmentId = "";
let selectedTeacherAssessmentId = "";
let activeTeacherAssessmentTab = "overview";
let editingTeacherAssessmentRecord = null;
let teacherAssessmentCurrentData = null;
let publicationSaveInProgress = false;
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
  dashboardGreeting: document.querySelector("#dashboardGreeting"),
  dashboardSession: document.querySelector("#dashboardSession"),
  dashboardSearchInput: document.querySelector("#dashboardSearchInput"),
  dashboardNotificationBtn: document.querySelector("#dashboardNotificationBtn"),
  dashboardNotificationBadge: document.querySelector("#dashboardNotificationBadge"),
  dashboardAvatar: document.querySelector("#dashboardAvatar"),
  dashboardUserName: document.querySelector("#dashboardUserName"),
  dashboardUserRole: document.querySelector("#dashboardUserRole"),
  dashboardTotalStudents: document.querySelector("#dashboardTotalStudents"),
  dashboardTotalTeachers: document.querySelector("#dashboardTotalTeachers"),
  dashboardTotalClasses: document.querySelector("#dashboardTotalClasses"),
  dashboardOverallPass: document.querySelector("#dashboardOverallPass"),
  dashboardExamSelect: document.querySelector("#dashboardExamSelect"),
  dashboardResultMeta: document.querySelector("#dashboardResultMeta"),
  dashboardResultDonut: document.querySelector("#dashboardResultDonut"),
  dashboardResultLegend: document.querySelector("#dashboardResultLegend"),
  dashboardFullReportBtn: document.querySelector("#dashboardFullReportBtn"),
  dashboardRecentActivities: document.querySelector("#dashboardRecentActivities"),
  dashboardClassPerformance: document.querySelector("#dashboardClassPerformance"),
  dashboardMonthSelect: document.querySelector("#dashboardMonthSelect"),
  dashboardAttendanceCircle: document.querySelector("#dashboardAttendanceCircle"),
  dashboardAttendancePercent: document.querySelector("#dashboardAttendancePercent"),
  dashboardAttendanceStudents: document.querySelector("#dashboardAttendanceStudents"),
  dashboardAttendanceAverage: document.querySelector("#dashboardAttendanceAverage"),
  dashboardAttendancePresent: document.querySelector("#dashboardAttendancePresent"),
  dashboardAttendanceWorkingDays: document.querySelector("#dashboardAttendanceWorkingDays"),
  dashboardAttendanceLowCount: document.querySelector("#dashboardAttendanceLowCount"),
  dashboardAttendanceClassChart: document.querySelector("#dashboardAttendanceClassChart"),
  dashboardAttendanceRiskList: document.querySelector("#dashboardAttendanceRiskList"),
  dashboardAttendanceAbsent: document.querySelector("#dashboardAttendanceAbsent"),
  dashboardAttendanceLeave: document.querySelector("#dashboardAttendanceLeave"),
  dashboardAttendanceMeta: document.querySelector("#dashboardAttendanceMeta"),
  dashboardAttendanceBtn: document.querySelector("#dashboardAttendanceBtn"),
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
  mobileEntrySaveHint: document.querySelector("#mobileEntrySaveHint"),
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
  marksheetPublishBtn: document.querySelector("#marksheetPublishBtn"),
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
  analysisProgressClassSelect: document.querySelector("#analysisProgressClassSelect"),
  analysisProgressFromExamSelect: document.querySelector("#analysisProgressFromExamSelect"),
  analysisProgressToExamSelect: document.querySelector("#analysisProgressToExamSelect"),
  analysisGrowthSummary: document.querySelector("#analysisGrowthSummary"),
  analysisGrowthBody: document.querySelector("#analysisGrowthBody"),
  analysisGrowthTableWrap: document.querySelector("#analysisGrowthTableWrap"),
  toggleAnalysisGrowthListBtn: document.querySelector("#toggleAnalysisGrowthListBtn"),
  analysisEarlyWarningSummary: document.querySelector("#analysisEarlyWarningSummary"),
  analysisEarlyWarningBody: document.querySelector("#analysisEarlyWarningBody"),
  analysisRiskTableWrap: document.querySelector("#analysisRiskTableWrap"),
  toggleAnalysisRiskListBtn: document.querySelector("#toggleAnalysisRiskListBtn"),
  performanceChangeSessionSelect: document.querySelector("#performanceChangeSessionSelect"),
  performanceChangeClassSelect: document.querySelector("#performanceChangeClassSelect"),
  performanceChangeFromExamSelect: document.querySelector("#performanceChangeFromExamSelect"),
  performanceChangeToExamSelect: document.querySelector("#performanceChangeToExamSelect"),
  performanceChangeSubjectSelect: document.querySelector("#performanceChangeSubjectSelect"),
  performanceChangeStudentSelect: document.querySelector("#performanceChangeStudentSelect"),
  performanceChangeSortSelect: document.querySelector("#performanceChangeSortSelect"),
  performanceChangeMessage: document.querySelector("#performanceChangeMessage"),
  performanceChangeSummary: document.querySelector("#performanceChangeSummary"),
  performanceChangeClassSummary: document.querySelector("#performanceChangeClassSummary"),
  performanceChangeClassBody: document.querySelector("#performanceChangeClassBody"),
  performanceChangeOverallChart: document.querySelector("#performanceChangeOverallChart"),
  performanceChangeDistributionChart: document.querySelector("#performanceChangeDistributionChart"),
  performanceChangeExamChart: document.querySelector("#performanceChangeExamChart"),
  performanceChangeSubjectChart: document.querySelector("#performanceChangeSubjectChart"),
  performanceChangeSubjectBody: document.querySelector("#performanceChangeSubjectBody"),
  performanceChangeBody: document.querySelector("#performanceChangeBody"),
  performanceChangeStudentDetail: document.querySelector("#performanceChangeStudentDetail"),
  analysisSupportBody: document.querySelector("#analysisSupportBody"),
  analysisSupportTableWrap: document.querySelector("#analysisSupportTableWrap"),
  toggleAnalysisSupportListBtn: document.querySelector("#toggleAnalysisSupportListBtn"),
  analysisStrengths: document.querySelector("#analysisStrengths"),
  analysisWeaknesses: document.querySelector("#analysisWeaknesses"),
  analysisRecommendations: document.querySelector("#analysisRecommendations"),
  downloadAnalysisPdfBtn: document.querySelector("#downloadAnalysisPdfBtn"),
  exportAnalysisExcelBtn: document.querySelector("#exportAnalysisExcelBtn"),
  printAnalysisBtn: document.querySelector("#printAnalysisBtn"),
  teacherAnalyticsAccessDenied: document.querySelector("#teacherAnalyticsAccessDenied"),
  teacherAnalyticsContent: document.querySelector("#teacherAnalyticsContent"),
  teacherAssignmentForm: document.querySelector("#teacherAssignmentForm"),
  teacherAssignmentNameInput: document.querySelector("#teacherAssignmentNameInput"),
  teacherAssignmentClassSelect: document.querySelector("#teacherAssignmentClassSelect"),
  teacherAssignmentSubjectSelect: document.querySelector("#teacherAssignmentSubjectSelect"),
  teacherAssignmentPartSelect: document.querySelector("#teacherAssignmentPartSelect"),
  saveTeacherAssignmentBtn: document.querySelector("#saveTeacherAssignmentBtn"),
  cancelTeacherAssignmentEditBtn: document.querySelector("#cancelTeacherAssignmentEditBtn"),
  teacherAssignmentBody: document.querySelector("#teacherAssignmentBody"),
  teacherAssignmentTableWrap: document.querySelector("#teacherAssignmentTableWrap"),
  toggleTeacherAssignmentTableBtn: document.querySelector("#toggleTeacherAssignmentTableBtn"),
  teacherAnalyticsSessionSelect: document.querySelector("#teacherAnalyticsSessionSelect"),
  teacherAnalyticsExamSelect: document.querySelector("#teacherAnalyticsExamSelect"),
  teacherAnalyticsTeacherSelect: document.querySelector("#teacherAnalyticsTeacherSelect"),
  teacherAnalyticsClassSelect: document.querySelector("#teacherAnalyticsClassSelect"),
  teacherAnalyticsSubjectSelect: document.querySelector("#teacherAnalyticsSubjectSelect"),
  teacherAnalyticsReport: document.querySelector("#teacherAnalyticsReport"),
  teacherAnalyticsSubtitle: document.querySelector("#teacherAnalyticsSubtitle"),
  teacherAnalyticsInsightSummary: document.querySelector("#teacherAnalyticsInsightSummary"),
  teacherAnalyticsAssignmentSummary: document.querySelector("#teacherAnalyticsAssignmentSummary"),
  teacherAnalyticsOverview: document.querySelector("#teacherAnalyticsOverview"),
  teacherAnalyticsTrendChart: document.querySelector("#teacherAnalyticsTrendChart"),
  teacherAnalyticsPassChart: document.querySelector("#teacherAnalyticsPassChart"),
  teacherAnalyticsClassChart: document.querySelector("#teacherAnalyticsClassChart"),
  teacherAnalyticsComparisonChart: document.querySelector("#teacherAnalyticsComparisonChart"),
  teacherAnalyticsClassHighlight: document.querySelector("#teacherAnalyticsClassHighlight"),
  teacherAnalyticsClassBody: document.querySelector("#teacherAnalyticsClassBody"),
  teacherAnalyticsLastUpdated: document.querySelector("#teacherAnalyticsLastUpdated"),
  teacherAnalyticsCompletion: document.querySelector("#teacherAnalyticsCompletion"),
  teacherAnalyticsSupportChart: document.querySelector("#teacherAnalyticsSupportChart"),
  teacherAnalyticsSupportBody: document.querySelector("#teacherAnalyticsSupportBody"),
  teacherAnalyticsStrengths: document.querySelector("#teacherAnalyticsStrengths"),
  teacherAnalyticsWeaknesses: document.querySelector("#teacherAnalyticsWeaknesses"),
  teacherAnalyticsRecommendations: document.querySelector("#teacherAnalyticsRecommendations"),
  downloadTeacherAnalysisPdfBtn: document.querySelector("#downloadTeacherAnalysisPdfBtn"),
  exportTeacherAnalysisExcelBtn: document.querySelector("#exportTeacherAnalysisExcelBtn"),
  printTeacherAnalysisBtn: document.querySelector("#printTeacherAnalysisBtn"),
  teacherAssessmentAccessDenied: document.querySelector("#teacherAssessmentAccessDenied"),
  teacherAssessmentContent: document.querySelector("#teacherAssessmentContent"),
  teacherAssessmentSessionSelect: document.querySelector("#teacherAssessmentSessionSelect"),
  teacherAssessmentMonthSelect: document.querySelector("#teacherAssessmentMonthSelect"),
  teacherAssessmentTeacherSelect: document.querySelector("#teacherAssessmentTeacherSelect"),
  teacherAssessmentDepartmentSelect: document.querySelector("#teacherAssessmentDepartmentSelect"),
  teacherAssessmentSubjectSelect: document.querySelector("#teacherAssessmentSubjectSelect"),
  teacherAssessmentClassSelect: document.querySelector("#teacherAssessmentClassSelect"),
  teacherAssessmentStatusSelect: document.querySelector("#teacherAssessmentStatusSelect"),
  teacherAssessmentSearchInput: document.querySelector("#teacherAssessmentSearchInput"),
  addTeacherAssessmentProfileBtn: document.querySelector("#addTeacherAssessmentProfileBtn"),
  teacherAssessmentCards: document.querySelector("#teacherAssessmentCards"),
  teacherAssessmentReport: document.querySelector("#teacherAssessmentReport"),
  teacherAssessmentReportSubtitle: document.querySelector("#teacherAssessmentReportSubtitle"),
  teacherAssessmentHero: document.querySelector("#teacherAssessmentHero"),
  teacherAssessmentTabs: document.querySelector("#teacherAssessmentTabs"),
  teacherAssessmentTabContent: document.querySelector("#teacherAssessmentTabContent"),
  downloadTeacherAssessmentPdfBtn: document.querySelector("#downloadTeacherAssessmentPdfBtn"),
  exportTeacherAssessmentExcelBtn: document.querySelector("#exportTeacherAssessmentExcelBtn"),
  printTeacherAssessmentBtn: document.querySelector("#printTeacherAssessmentBtn"),
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
  parsed.teacherAssignments = normalizeTeacherAssignments(existingState.teacherAssignments || parsed.teacherAssignments);
  parsed.teacherAssessment = normalizeTeacherAssessmentData(existingState.teacherAssessment || parsed.teacherAssessment);
  parsed.sessions = normalizeSessions(parsed.sessions);

  const migratedActiveData = normalizeSessionData({
    classes: existingState.classes ?? parsed.classes,
    workingDays: existingState.workingDays ?? parsed.workingDays,
    attendance: existingState.attendance ?? parsed.attendance,
    measurements: existingState.measurements ?? parsed.measurements,
    marks: existingState.marks ?? parsed.marks,
    published: existingState.published ?? parsed.published,
    publishedMarksheets: existingState.publishedMarksheets ?? parsed.publishedMarksheets,
    dataEntryUpdates: existingState.dataEntryUpdates ?? parsed.dataEntryUpdates
  });
  if (!parsed.sessions[parsed.academicSession]) {
    parsed.sessions[parsed.academicSession] = migratedActiveData;
  } else {
    const mergedSessionClasses = mergeMissingClassLists(
      parsed.sessions[parsed.academicSession].classes,
      migratedActiveData.classes
    );
    parsed.sessions[parsed.academicSession] = normalizeSessionData({
      ...parsed.sessions[parsed.academicSession],
      classes: mergedSessionClasses
    });
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
    published: {},
    publishedMarksheets: {},
    dataEntryUpdates: {}
  };
}

function normalizeSessionData(data = {}) {
  return {
    classes: normalizeClasses(data.classes),
    workingDays: normalizeTermMarks(data.workingDays, 0),
    attendance: data.attendance || {},
    measurements: data.measurements || {},
    marks: data.marks || {},
    published: data.published || {},
    publishedMarksheets: data.publishedMarksheets || {},
    dataEntryUpdates: data.dataEntryUpdates || {}
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
    published: state.published,
    publishedMarksheets: state.publishedMarksheets,
    dataEntryUpdates: state.dataEntryUpdates
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
  targetState.publishedMarksheets = normalizedData.publishedMarksheets;
  targetState.dataEntryUpdates = normalizedData.dataEntryUpdates;
}

function preserveLocalClassesIfRemoteMissing(remoteState, localState = state) {
  const normalized = normalizeState(remoteState);
  const session = currentSessionKey(normalized.academicSession);
  const localSession = normalizeSessionData((localState.sessions || {})[session] || {
    classes: localState.classes
  });
  let changed = false;

  classNames.forEach((className) => {
    const remoteStudents = normalized.classes?.[className] || [];
    const localStudents = localSession.classes?.[className] || localState.classes?.[className] || [];
    if (remoteStudents.length === 0 && localStudents.length > 0) {
      normalized.classes[className] = localStudents.map(normalizeStudent);
      normalized.sessions[session] = normalized.sessions[session] || createEmptySessionData();
      normalized.sessions[session].classes[className] = normalized.classes[className];
      changed = true;
    }
  });

  if (changed) {
    console.log("[Firestore] Preserved local student lists while waiting for split class-list sync.");
  }
  return normalized;
}

function normalizeTeacherAssignments(assignments = []) {
  return (Array.isArray(assignments) ? assignments : []).map((assignment, index) => ({
    id: String(assignment.id || `teacher-assignment-${index + 1}`),
    teacherId: String(assignment.teacherId || slugifyTeacherName(assignment.teacherName || "teacher")),
    teacherName: String(assignment.teacherName || "").trim(),
    className: classNames.includes(assignment.className) ? assignment.className : "Class I",
    subject: String(assignment.subject || "").trim(),
    part: ["Part A", "Part B"].includes(assignment.part) ? assignment.part : "Whole Subject"
  })).filter((assignment) => assignment.teacherName && assignment.subject);
}

function createDefaultTeacherAssessmentData() {
  return {
    profiles: [],
    lessonPlans: [],
    lessonTracking: [],
    syllabus: [],
    activities: [],
    attendance: [],
    observations: [],
    remarks: [],
    documents: [],
    history: []
  };
}

function normalizeTeacherAssessmentData(data = {}) {
  const normalized = createDefaultTeacherAssessmentData();
  Object.keys(normalized).forEach((key) => {
    normalized[key] = (Array.isArray(data?.[key]) ? data[key] : []).map((record, index) => ({
      ...record,
      id: String(record.id || `${key}-${index + 1}`),
      teacherId: String(record.teacherId || ""),
      session: currentSessionKey(record.session || "2026 - 2027")
    }));
  });
  normalized.profiles = normalized.profiles.map((profile) => ({
    ...profile,
    name: String(profile.name || "").trim(),
    designation: String(profile.designation || "Teacher").trim() || "Teacher",
    department: String(profile.department || "General").trim() || "General",
    photoUrl: String(profile.photoUrl || "").trim()
  })).filter((profile) => profile.teacherId && profile.name);
  return normalized;
}

function slugifyTeacherName(name) {
  return String(name || "teacher")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "teacher";
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

function mergeMissingClassLists(primaryClasses = {}, fallbackClasses = {}) {
  const normalizedPrimary = normalizeClasses(primaryClasses);
  const normalizedFallback = normalizeClasses(fallbackClasses);
  classNames.forEach((className) => {
    if ((normalizedPrimary[className] || []).length === 0 && (normalizedFallback[className] || []).length > 0) {
      normalizedPrimary[className] = normalizedFallback[className];
    }
  });
  return normalizedPrimary;
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

async function saveClassStudents(className = selectedClass()) {
  syncActiveSessionData();
  localStorage.setItem(storageKey, JSON.stringify(state));
  const students = normalizeClasses({ [className]: state.classes?.[className] || [] })[className] || [];
  const session = currentSessionKey(state.academicSession);
  if (window.MarkHubFirebase?.saveSplitClasses) {
    await window.MarkHubFirebase.saveSplitClasses({
      session,
      className,
      students,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.name || currentUser?.username || "Unknown"
    });
    lastSyncedFirebaseStateJson = JSON.stringify(state);
    return;
  }
  if (window.MarkHubFirebase?.saveAppState) {
    await window.MarkHubFirebase.saveAppState(structuredClone(state));
    lastSyncedFirebaseStateJson = JSON.stringify(state);
    return;
  }
  throw new Error("Firebase is not ready.");
}

function hasUnsavedMarkChanges() {
  return unsavedMarkChanges.size > 0;
}

function unsavedMarkChangeId(className, exam, subject, roll = "*subject*", fieldKey = "value") {
  return `${className}::${exam}::${subject}::${roll}::${fieldKey}`;
}

function trackUnsavedMarkChange(
  className = selectedClass(),
  exam = selectedExam(),
  subject = selectedSubject(),
  roll = null,
  fieldKey = "value"
) {
  const key = markKey(className, exam, subject);
  unsavedMarkChanges.set(unsavedMarkChangeId(className, exam, subject, roll, fieldKey), {
    type: "mark",
    session: currentSessionKey(state.academicSession),
    className,
    exam,
    subject,
    markKey: key,
    roll: String(roll),
    fieldKey
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
    const saveHintText = locked
      ? entryAccessLockedMessage(selectedClass(), selectedExam())
      : changedCount
      ? `${changedCount} unsaved mark ${changedCount === 1 ? "change" : "changes"}. Click Save.`
      : "Enter marks, then click Save.";
    els.entrySaveHint.textContent = saveHintText;
    els.entrySaveHint.classList.toggle("entry-locked-text", locked);
    if (els.mobileEntrySaveHint) {
      els.mobileEntrySaveHint.textContent = saveHintText;
      els.mobileEntrySaveHint.classList.toggle("entry-locked-text", locked);
    }
  }
}

function hasUnsavedAttendanceChanges() {
  return unsavedAttendanceChanges;
}

function hasUnsavedLocalChanges() {
  return hasUnsavedMarkChanges() || hasUnsavedAttendanceChanges();
}

function hasUnsavedResultChanges(className = selectedClass(), exam = selectedExam()) {
  const hasMarks = [...unsavedMarkChanges.values()].some((change) =>
    change.className === className && change.exam === exam);
  const hasAttendance = unsavedAttendanceChanges
    && termExams.includes(exam)
    && selectedAttendanceClass() === className
    && selectedAttendanceTerm() === exam;
  return hasMarks || hasAttendance;
}

function trackUnsavedAttendanceChange(section = "attendance") {
  unsavedAttendanceSections.add(section);
  unsavedAttendanceChanges = true;
  syncActiveSessionData();
  refreshAttendanceSaveControls();
}

function refreshAttendanceSaveControls() {
  if (!els.saveAttendanceBtn) return;
  const locked = selectedAttendanceEntryLocked();
  els.saveAttendanceBtn.disabled = Boolean(attendanceSaveInProgress) || locked
    || unsavedAttendanceSections.size === 0;
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

function attendanceSectionInputs(section) {
  const selector = {
    attendance: "#attendanceView.active [data-attendance-roll]",
    height: "#attendanceView.active [data-height-roll]",
    weight: "#attendanceView.active [data-weight-roll]"
  }[section];
  return selector ? [...document.querySelectorAll(selector)] : [];
}

function buildAttendanceSectionFieldUpdates(section, className, term) {
  const session = currentSessionKey(state.academicSession);
  const key = attendanceKey(className, term);
  const students = state.classes[className] || [];
  const updates = [];

  if (section === "attendance") {
    updates.push({
      path: ["state", "sessions", session, "workingDays", term],
      value: state.workingDays[term]
    });
    students.forEach((student) => {
      const rollKey = studentRollFieldKey(student);
      if (!rollKey) return;
      updates.push({
        path: ["state", "sessions", session, "attendance", key, rollKey],
        value: getStudentAttendance(student, className, term)
      });
    });
  } else {
    students.forEach((student) => {
      const rollKey = studentRollFieldKey(student);
      if (!rollKey) return;
      updates.push({
        path: ["state", "sessions", session, "measurements", key, rollKey, section],
        value: getStudentMeasurement(student, className, term)[section]
      });
    });
  }
  return updates;
}

function studentRollFieldKey(student) {
  return String(student?.roll ?? "").trim();
}

function invalidStudentRollMessage(className) {
  const invalidStudents = (state.classes[className] || [])
    .map((student, index) => ({ student, index }))
    .filter(({ student }) => !studentRollFieldKey(student));
  if (invalidStudents.length === 0) return "";
  const names = invalidStudents
    .slice(0, 3)
    .map(({ student, index }) => student?.name || `row ${index + 1}`)
    .join(", ");
  return `Cannot save ${className}: blank Roll No. found for ${names}. Fix Roll No. in Students page.`;
}

function findInvalidFirestoreValue(value, path = []) {
  if (value === undefined) return { path, reason: "blank/undefined value" };
  if (typeof value === "number" && !Number.isFinite(value)) return { path, reason: "invalid number" };
  if (typeof value === "function" || typeof value === "symbol") return { path, reason: "unsupported value" };
  if (value === null || typeof value !== "object") return null;
  if (typeof value._methodName === "string") return null;
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const invalid = findInvalidFirestoreValue(value[index], [...path, String(index)]);
      if (invalid) return invalid;
    }
    return null;
  }
  for (const [key, nestedValue] of Object.entries(value)) {
    const invalid = findInvalidFirestoreValue(nestedValue, [...path, key]);
    if (invalid) return invalid;
  }
  return null;
}

function invalidFirestoreUpdateMessage(fieldUpdates) {
  const badPathUpdate = fieldUpdates.find(({ path }) =>
    !Array.isArray(path) || path.some((segment) => String(segment ?? "").trim() === ""));
  if (badPathUpdate) {
    const path = (badPathUpdate.path || []).map((segment) => String(segment ?? ""));
    if (path.includes("workingDays")) return "Select a Term before saving attendance.";
    return "Cannot save because one Firestore field path is blank. Check Class, Term and Roll No.";
  }
  const badUpdate = fieldUpdates.find(({ value }) => findInvalidFirestoreValue(value));
  if (!badUpdate) return "";
  const invalidValue = findInvalidFirestoreValue(badUpdate.value);
  const path = (badUpdate.path || []).map(String);
  const attendanceIndex = path.indexOf("attendance");
  const measurementsIndex = path.indexOf("measurements");
  const marksIndex = path.indexOf("marks");
  const section = attendanceIndex !== -1
    ? "Attendance"
    : measurementsIndex !== -1
      ? attendanceSectionLabel(path[measurementsIndex + 3])
      : marksIndex !== -1
        ? `Marks${path[marksIndex + 1] ? ` for ${path[marksIndex + 1].split("::")[2] || "subject"}` : ""}`
        : "Value";
  const roll = attendanceIndex !== -1
    ? path[attendanceIndex + 2]
    : measurementsIndex !== -1
      ? path[measurementsIndex + 2]
      : marksIndex !== -1
        ? path[marksIndex + 2]
        : "";
  const rollText = roll ? ` for Roll No. ${roll}` : "";
  return `${section}${rollText} has ${invalidValue.reason}. Clear and re-enter it before saving.`;
}

function attendanceSectionLabel(section) {
  return section === "attendance" ? "Attendance" : section === "height" ? "Height" : "Weight";
}

function firestoreSaveErrorMessage(action, error) {
  const code = String(error?.code || "").replace(/^firestore\//, "");
  if (String(error?.message || "").includes("Firebase is not ready")) {
    return `Could not ${action}: Firebase is not ready. Refresh the page and try again.`;
  }
  if (String(error?.message || "").includes("Firebase field updates are not ready")) {
    return `Could not ${action}: save marks first, then try attendance again.`;
  }
  if (code === "permission-denied") {
    return `Could not ${action}: Firestore write permission was denied.`;
  }
  if (code === "resource-exhausted") {
    return `Could not ${action}: Firestore storage limit was reached.`;
  }
  if (code === "unavailable") {
    return `Could not ${action}: internet or Firestore connection is unavailable.`;
  }
  if (code === "invalid-argument") {
    const pathMatch = String(error?.message || "").match(/Path:\s*(.+)$/);
    const detail = pathMatch
      ? pathMatch[1]
      : String(error?.message || "").replace(/\s+/g, " ").slice(0, 180);
    return `Could not ${action}: Firestore rejected one value as invalid${detail ? ` (${detail})` : ""}.`;
  }
  return `Could not ${action}${code ? ` (${code})` : ""}. Please try again.`;
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
  const changedSections = [...unsavedAttendanceSections];
  if (changedSections.length === 0) {
    showToast("No attendance or measurement changes to save.");
    return;
  }
  const className = selectedAttendanceClass();
  const rollMessage = invalidStudentRollMessage(className);
  if (rollMessage) {
    showToast(rollMessage);
    return;
  }
  if (changedSections.includes("attendance")
    && els.workingDaysInput
    && els.workingDaysInput.value.trim() === "") {
    showContextMessage(els.workingDaysInput, "No. of Working Days cannot be blank.", {
      type: "error",
      duration: 5000
    });
    els.workingDaysInput.focus();
    return;
  }
  for (const section of changedSections) {
    const blankInput = attendanceSectionInputs(section)
      .find((input) => !input.disabled && input.value.trim() === "");
    if (blankInput) {
      showContextMessage(blankInput, `${attendanceSectionLabel(section)} cannot be blank. Enter -1 for Absent or -2 for Not yet enrolled.`, {
        type: "error",
        duration: 5000
      });
      blankInput.focus();
      return;
    }
  }

  attendanceSaveInProgress = true;
  refreshAttendanceSaveControls();

  try {
    const term = selectedAttendanceTerm();
    const updatedAt = new Date().toISOString();
    state.dataEntryUpdates = state.dataEntryUpdates || {};
    const updateTypes = new Set(changedSections.map((section) =>
      section === "attendance" ? "attendance" : "measurement"));
    const updateKeys = [...updateTypes].map((updateType) => {
      const updateKey = dataEntryUpdateKey(updateType, className, term);
      state.dataEntryUpdates[updateKey] = {
        updatedAt,
        updatedBy: currentUser?.name || currentUser?.username || "Unknown"
      };
      return updateKey;
    });
    syncActiveSessionData();
    const fieldUpdates = [
      ...changedSections.flatMap((section) =>
        buildAttendanceSectionFieldUpdates(section, className, term)),
      ...updateKeys.map((updateKey) => ({
        path: ["state", "sessions", currentSessionKey(state.academicSession), "dataEntryUpdates", updateKey],
        value: state.dataEntryUpdates[updateKey]
      }))
    ];
    const splitSaves = [];
    const session = currentSessionKey(state.academicSession);
    const attendanceKeyValue = attendanceKey(className, term);
    const updatedBy = currentUser?.name || currentUser?.username || "Unknown";
    if (window.MarkHubFirebase?.saveSplitAttendance && changedSections.includes("attendance")) {
      const updateKey = dataEntryUpdateKey("attendance", className, term);
      splitSaves.push(window.MarkHubFirebase.saveSplitAttendance({
        session,
        className,
        term,
        attendanceKey: attendanceKeyValue,
        workingDays: state.workingDays[term],
        attendance: state.attendance[attendanceKeyValue] || {},
        dataEntryKey: updateKey,
        dataEntryUpdate: state.dataEntryUpdates[updateKey],
        updatedAt,
        updatedBy
      }));
    }
    if (window.MarkHubFirebase?.saveSplitMeasurements
      && (changedSections.includes("height") || changedSections.includes("weight"))) {
      const updateKey = dataEntryUpdateKey("measurement", className, term);
      splitSaves.push(window.MarkHubFirebase.saveSplitMeasurements({
        session,
        className,
        term,
        attendanceKey: attendanceKeyValue,
        measurements: state.measurements[attendanceKeyValue] || {},
        dataEntryKey: updateKey,
        dataEntryUpdate: state.dataEntryUpdates[updateKey],
        updatedAt,
        updatedBy
      }));
    }

    if (splitSaves.length > 0) {
      await Promise.all(splitSaves);
    } else if (window.MarkHubFirebase?.updateAppStateFields && fieldUpdates.length > 0) {
      await window.MarkHubFirebase.updateAppStateFields(fieldUpdates, null);
    } else if (window.MarkHubFirebase?.saveAppState) {
      await window.MarkHubFirebase.saveAppState(structuredClone(state));
    } else {
      throw new Error("Firebase is not ready.");
    }
    changedSections.forEach((section) => unsavedAttendanceSections.delete(section));
    unsavedAttendanceChanges = unsavedAttendanceSections.size > 0;
    localStorage.setItem(storageKey, JSON.stringify(state));
    showToast("Attendance data saved successfully.");
  } catch (error) {
    unsavedAttendanceChanges = true;
    changedSections.forEach((section) => unsavedAttendanceSections.add(section));
    console.error("[Firestore] Save attendance data failed", error);
    showToast(firestoreSaveErrorMessage("save attendance data", error));
  } finally {
    attendanceSaveInProgress = "";
    refreshAttendanceSaveControls();
  }
}

function cleanEntryRecordForFirestore(record = {}, change = {}) {
  const cleaned = {};
  ["value", "project", "partA", "partB"].forEach((field) => {
    if (!Object.prototype.hasOwnProperty.call(record, field)) return;
    const value = record[field];
    cleaned[field] = value === undefined || value === null ? "" : value;
  });
  if (!Object.keys(cleaned).length) cleaned.value = "";
  if (isActivitiesSubject(change.subject, change.className, change.exam)) {
    delete cleaned.attendanceMarks;
    if (!Object.prototype.hasOwnProperty.call(cleaned, "project")) {
      cleaned.project = cleaned.value;
    }
  }
  return cleaned;
}

function buildUnsavedMarkFieldUpdates(changes = [...unsavedMarkChanges.values()]) {
  const deletes = new Set(
    changes
      .filter((change) => change.type === "deleteSubject")
      .map((change) => `${change.session}::${change.markKey}`)
  );
  const updates = new Map();
  const deleteValue = window.MarkHubFirebase?.deleteFieldValue;
  const addUpdate = (path, value) => {
    updates.set(JSON.stringify(path), { path, value });
  };

  changes.forEach((change) => {
    if (change.type === "deleteSubject") {
      if (!deleteValue) return;
      addUpdate(
        ["state", "sessions", change.session, "marks", change.markKey],
        deleteValue()
      );
      return;
    }

    if (deletes.has(`${change.session}::${change.markKey}`)) return;
    const value = cleanEntryRecordForFirestore(state.marks?.[change.markKey]?.[change.roll] || { value: "" }, change);
    const basePath = ["state", "sessions", change.session, "marks", change.markKey, change.roll];
    if (change.fieldKey === "partA" || change.fieldKey === "partB") {
      addUpdate([...basePath, change.fieldKey], value[change.fieldKey] ?? "");
      addUpdate([...basePath, "value"], value.value ?? "");
    } else {
      addUpdate(basePath, value);
    }
  });

  return [...updates.values()];
}

function markInputsRequiredForSave() {
  const allInputs = [...document.querySelectorAll("#entryView.active .mark-input")];
  if (!isSplitPartSubject()) return allInputs;

  const changedPartKeys = new Set(
    [...unsavedMarkChanges.values()]
      .filter((change) =>
        change.type === "mark"
        && change.className === selectedClass()
        && change.exam === selectedExam()
        && change.subject === selectedSubject()
        && (change.fieldKey === "partA" || change.fieldKey === "partB"))
      .map((change) => change.fieldKey)
  );
  if (changedPartKeys.size === 0) return allInputs;
  return allInputs.filter((input) => changedPartKeys.has(input.dataset.partKey));
}

async function saveAllMarks() {
  if (marksSaveInProgress) return;
  if (selectedMarksEntryLocked()) {
    showToast("This marks entry is locked by Administrator.");
    return;
  }
  const blankMarkInput = markInputsRequiredForSave()
    .find((input) => !input.disabled && input.value.trim() === "");
  if (blankMarkInput) {
    showContextMessage(blankMarkInput, "This field cannot be blank. Enter -1 for Absent or -2 for Not yet enrolled.", {
      type: "error",
      duration: 5000
    });
    blankMarkInput.focus();
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
    const currentContextChanges = [...unsavedMarkChanges.values()].filter((change) =>
      change.className === selectedClass()
      && change.exam === selectedExam()
      && change.subject === selectedSubject());
    if (currentContextChanges.length === 0) {
      showToast("No mark changes to save.");
      return;
    }
    const changedContexts = [...new Map(
      currentContextChanges.map((change) => [
        `${change.className}\u0000${change.exam}\u0000${change.subject}`,
        change
      ])
    ).values()];
    const updatedAt = new Date().toISOString();
    state.dataEntryUpdates = state.dataEntryUpdates || {};
    changedContexts.forEach((change) => {
      state.dataEntryUpdates[dataEntryUpdateKey("marks", change.className, change.exam, change.subject)] = {
        updatedAt,
        updatedBy: currentUser?.name || currentUser?.username || "Unknown"
      };
    });
    syncActiveSessionData();
    const stateJson = JSON.stringify(state);
    const fieldUpdates = [
      ...buildUnsavedMarkFieldUpdates(currentContextChanges),
      ...changedContexts.flatMap((change) => {
        const key = dataEntryUpdateKey("marks", change.className, change.exam, change.subject);
        const value = state.dataEntryUpdates[key];
        return [
          { path: ["state", "sessions", change.session, "dataEntryUpdates", key], value }
        ];
      })
    ];
    const hadPendingFullStateSave = (pendingFirebaseStateJson && pendingFirebaseStateJson !== lastSyncedFirebaseStateJson)
      || deferredFullStateSaveAfterMarks;
    let savedWithSplitMarks = false;
    if (window.MarkHubFirebase?.saveSplitMarks && changedContexts.length === 1) {
      const change = changedContexts[0];
      const updateKey = dataEntryUpdateKey("marks", change.className, change.exam, change.subject);
      const marksForSubject = Object.fromEntries(
        Object.entries(state.marks?.[change.markKey] || {})
          .map(([roll, record]) => [roll, cleanEntryRecordForFirestore(record, change)])
      );
      await window.MarkHubFirebase.saveSplitMarks({
        session: change.session,
        className: change.className,
        exam: change.exam,
        subject: change.subject,
        markKey: change.markKey,
        marks: marksForSubject,
        dataEntryKey: updateKey,
        dataEntryUpdate: state.dataEntryUpdates[updateKey],
        updatedAt,
        updatedBy: currentUser?.name || currentUser?.username || "Unknown"
      });
      savedWithSplitMarks = true;
    } else if (window.MarkHubFirebase?.updateAppStateFields && fieldUpdates.length > 0) {
      await window.MarkHubFirebase.updateAppStateFields(fieldUpdates, null);
    } else if (window.MarkHubFirebase?.saveAppState) {
      await window.MarkHubFirebase.saveAppState(structuredClone(state));
    } else {
      throw new Error("Firebase is not ready.");
    }

    localStorage.setItem(storageKey, stateJson);
    if (!savedWithSplitMarks && hadPendingFullStateSave && pendingFirebaseStateJson !== stateJson) {
      deferredFullStateSaveAfterMarks = false;
      queueFirebaseStateSave();
    } else {
      deferredFullStateSaveAfterMarks = false;
      lastSyncedFirebaseStateJson = stateJson;
      if (pendingFirebaseStateJson === stateJson) pendingFirebaseStateJson = "";
    }
    const savedContextKeys = new Set(currentContextChanges.map((change) => `${change.className}\u0000${change.exam}\u0000${change.subject}`));
    [...unsavedMarkChanges.entries()].forEach(([key, change]) => {
      if (savedContextKeys.has(`${change.className}\u0000${change.exam}\u0000${change.subject}`)) {
        unsavedMarkChanges.delete(key);
      }
    });
    showToast("Marks saved successfully.");
  } catch (error) {
    console.error("[Firestore] Save marks failed", error);
    showToast(firestoreSaveErrorMessage("save marks", error));
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
    const allowedViews = ["dashboard", "entry", "attendance", "results", "marksheet", "students", "analysis", "teacherAnalytics", "teacherAssessment", "entryAccess"];
    return {
      ...parsed,
      activeView: allowedViews.includes(routeView) ? routeView : allowedViews.includes(parsed.activeView) ? parsed.activeView : "dashboard"
    };
  } catch {
    return { ...fallback, activeView: routeView || fallback.activeView };
  }
}

function viewFromLocationHash() {
  const hash = window.location.hash.replace(/^#/, "");
  const routeView = new URLSearchParams(hash).get("view") || hash.replace(/^view=/, "");
  const allowedViews = ["dashboard", "entry", "attendance", "results", "marksheet", "students", "analysis", "teacherAnalytics", "teacherAssessment", "entryAccess"];
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
    analysisThreshold: els.analysisSupportThreshold?.value || "50",
    teacherAnalyticsSession: els.teacherAnalyticsSessionSelect?.value || state.academicSession,
    teacherAnalyticsExam: els.teacherAnalyticsExamSelect?.value || analysisExamAll,
    teacherAnalyticsTeacher: els.teacherAnalyticsTeacherSelect?.value || "All Teachers",
    teacherAnalyticsClass: els.teacherAnalyticsClassSelect?.value || "All Classes",
    teacherAnalyticsSubject: els.teacherAnalyticsSubjectSelect?.value || "All Subjects",
    analysisSession: els.analysisSessionSelect?.value || state.academicSession,
    analysisSection: els.analysisSectionSelect?.value || "All Classes",
    analysisClass: els.analysisClassSelect?.value || "All Classes",
    analysisExam: els.analysisExamSelect?.value || "First Term",
    analysisSubject: els.analysisSubjectSelect?.value || "All Subjects",
    analysisStatus: els.analysisStatusSelect?.value || "all",
    analysisThreshold: els.analysisSupportThreshold?.value || "50",
    analysisProgressClass: els.analysisProgressClassSelect?.value || "All Classes",
    analysisProgressFromExam: els.analysisProgressFromExamSelect?.value || "",
    analysisProgressToExam: els.analysisProgressToExamSelect?.value || "",
    performanceChangeSession: els.performanceChangeSessionSelect?.value || state.academicSession,
    performanceChangeClass: els.performanceChangeClassSelect?.value || "All Classes",
    performanceChangeFromExam: els.performanceChangeFromExamSelect?.value || "",
    performanceChangeToExam: els.performanceChangeToExamSelect?.value || "",
    performanceChangeSubject: els.performanceChangeSubjectSelect?.value || "All Subjects",
    performanceChangeStudent: els.performanceChangeStudentSelect?.value || "All Students",
    performanceChangeSort: els.performanceChangeSortSelect?.value || "improvement",
    teacherAnalyticsSession: els.teacherAnalyticsSessionSelect?.value || state.academicSession,
    teacherAnalyticsExam: els.teacherAnalyticsExamSelect?.value || analysisExamAll,
    teacherAnalyticsTeacher: els.teacherAnalyticsTeacherSelect?.value || "All Teachers",
    teacherAnalyticsClass: els.teacherAnalyticsClassSelect?.value || "All Classes",
    teacherAnalyticsSubject: els.teacherAnalyticsSubjectSelect?.value || "All Subjects"
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
  if (typeof firebaseSplitSessionUnsubscribe === "function") firebaseSplitSessionUnsubscribe();
  firebaseStateUnsubscribe = null;
  firebaseSplitSessionUnsubscribe = null;
  firebaseSplitSessionKey = "";
  firebaseStateSyncStarted = false;
}

function ensureSplitSessionListener(session = state.academicSession) {
  const sessionKey = currentSessionKey(session);
  if (!window.MarkHubFirebase?.listenSplitSession || firebaseSplitSessionKey === sessionKey) return;
  if (typeof firebaseSplitSessionUnsubscribe === "function") firebaseSplitSessionUnsubscribe();
  firebaseSplitSessionKey = sessionKey;
  firebaseSplitSessionUnsubscribe = window.MarkHubFirebase.listenSplitSession(
    sessionKey,
    applySplitSessionPatch,
    (error) => {
      console.error("[Firestore] Split session listener failed", error);
      showToast("Split session live updates are not available.");
    }
  );
}

function seedSplitClassLists(session = state.academicSession) {
  const sessionKey = currentSessionKey(session);
  if (splitClassListSeededSessions.has(sessionKey) || !window.MarkHubFirebase?.saveSplitClasses) return;
  const sessionData = normalizeSessionData(state.sessions?.[sessionKey] || getActiveSessionData());
  const classEntries = classNames
    .map((className) => [className, sessionData.classes?.[className] || []])
    .filter(([, students]) => students.length > 0);
  if (!classEntries.length) return;
  splitClassListSeededSessions.add(sessionKey);
  classEntries.forEach(([className, students]) => {
    window.MarkHubFirebase.saveSplitClasses({
      session: sessionKey,
      className,
      students,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.name || currentUser?.username || "Unknown"
    }).catch((error) => {
      console.warn(`[Firestore] Could not seed split student list for ${className}`, error);
    });
  });
}

function mergeClassesPatch(existingClasses = {}, patchClasses = {}) {
  const mergedClasses = normalizeClasses(existingClasses);
  Object.entries(patchClasses || {})
    .filter(([className]) => classNames.includes(className))
    .forEach(([className, students]) => {
      if (Array.isArray(students) && students.length > 0) {
        mergedClasses[className] = students.map(normalizeStudent);
      }
    });
  return mergedClasses;
}

function mergeSplitPatchIntoSession(existingSession, patch = {}) {
  return normalizeSessionData({
    ...existingSession,
    classes: patch.classes ? mergeClassesPatch(existingSession.classes, patch.classes) : existingSession.classes,
    workingDays: patch.workingDays ? { ...existingSession.workingDays, ...patch.workingDays } : existingSession.workingDays,
    attendance: patch.attendance ? { ...existingSession.attendance, ...patch.attendance } : existingSession.attendance,
    measurements: patch.measurements ? { ...existingSession.measurements, ...patch.measurements } : existingSession.measurements,
    marks: patch.marks ? { ...existingSession.marks, ...patch.marks } : existingSession.marks,
    published: patch.published ? { ...existingSession.published, ...patch.published } : existingSession.published,
    publishedMarksheets: patch.publishedMarksheets ? { ...existingSession.publishedMarksheets, ...patch.publishedMarksheets } : existingSession.publishedMarksheets,
    dataEntryUpdates: patch.dataEntryUpdates ? { ...existingSession.dataEntryUpdates, ...patch.dataEntryUpdates } : existingSession.dataEntryUpdates
  });
}

function cacheSplitSessionPatch(sessionKey, patch = {}) {
  const previous = firebaseSplitSessionPatchCache.get(sessionKey) || { session: sessionKey };
  const cached = {
    session: sessionKey,
    classes: patch.classes ? mergeClassesPatch(previous.classes, patch.classes) : previous.classes,
    workingDays: patch.workingDays ? { ...(previous.workingDays || {}), ...patch.workingDays } : previous.workingDays,
    attendance: patch.attendance ? { ...(previous.attendance || {}), ...patch.attendance } : previous.attendance,
    measurements: patch.measurements ? { ...(previous.measurements || {}), ...patch.measurements } : previous.measurements,
    marks: patch.marks ? { ...(previous.marks || {}), ...patch.marks } : previous.marks,
    published: patch.published ? { ...(previous.published || {}), ...patch.published } : previous.published,
    publishedMarksheets: patch.publishedMarksheets ? { ...(previous.publishedMarksheets || {}), ...patch.publishedMarksheets } : previous.publishedMarksheets,
    dataEntryUpdates: patch.dataEntryUpdates ? { ...(previous.dataEntryUpdates || {}), ...patch.dataEntryUpdates } : previous.dataEntryUpdates
  };
  firebaseSplitSessionPatchCache.set(sessionKey, cached);
  return cached;
}

function applyCachedSplitSessionPatch(sessionKey) {
  const cachedPatch = firebaseSplitSessionPatchCache.get(sessionKey);
  if (!cachedPatch) return false;
  state.sessions = state.sessions || {};
  const existingSession = normalizeSessionData(state.sessions[sessionKey] || createEmptySessionData());
  const mergedSession = mergeSplitPatchIntoSession(existingSession, cachedPatch);
  state.sessions[sessionKey] = mergedSession;
  if (currentSessionKey(state.academicSession) === sessionKey) {
    setActiveSessionData(state, mergedSession);
  }
  return true;
}

function applySplitSessionPatch(patch = {}) {
  const sessionKey = currentSessionKey(patch.session || state.academicSession);
  if (!sessionKey) return;
  cacheSplitSessionPatch(sessionKey, patch);
  if (hasUnsavedLocalChanges()) {
    console.log("[Firestore] Split session update held because the page has unsaved local changes.");
    return;
  }
  applyCachedSplitSessionPatch(sessionKey);
  const stateJson = JSON.stringify(state);
  localStorage.setItem(storageKey, stateJson);
  if (!applyingRemoteState) renderActiveViewOnly();
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
  ensureSplitSessionListener(state.academicSession);
  seedSplitClassLists(state.academicSession);
  firebaseStateUnsubscribe = window.MarkHubFirebase.listenAppState((remoteState) => {
    console.log("[Firestore] MarkHub UI received appState update.");
    if (publicationSaveInProgress) {
      console.log("[Firestore] App state update held while result publication is saving.");
      return;
    }
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
    state = preserveLocalClassesIfRemoteMissing(remoteState, state);
    ensureSplitSessionListener(state.academicSession);
    applyCachedSplitSessionPatch(currentSessionKey(state.academicSession));
    seedSplitClassLists(state.academicSession);
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
  initializeAnalysisFilters(uiState);
  initializeTeacherAnalyticsFilters(uiState);

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
  if (activeView === "dashboard") {
    renderDashboard();
  } else if (activeView === "entry") {
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
  } else if (activeView === "teacherAnalytics") {
    renderTeacherAnalytics();
  } else if (activeView === "teacherAssessment") {
    renderTeacherAssessment();
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

function isPrincipalUser() {
  return currentUser?.username === "principal";
}

function canPreviewUnpublished() {
  return isAdmin() || isPrincipalUser();
}

function getDashboardUserProfile() {
  const baseName = String(currentUser?.name || currentUser?.username || "").trim();
  const profile = (state.teacherAssessment?.profiles || []).find((item) => {
    const teacherId = String(item.teacherId || "").trim();
    const name = String(item.name || "").trim();
    return (teacherId && teacherId === currentUser?.username)
      || (name && baseName && name.toLowerCase() === baseName.toLowerCase())
      || (name && currentUser?.username && slugifyTeacherName(name) === currentUser.username);
  });
  return {
    name: String(profile?.name || currentUser?.name || currentUser?.username || "").trim(),
    role: isAdmin()
      ? "Administrator"
      : isPrincipalUser()
        ? "Principal"
      : String(profile?.designation || (currentUser?.role === "user" ? "Teacher" : currentUser?.role) || "Teacher").trim(),
    photoUrl: String(
      currentUser?.photoUrl
      || currentUser?.photoURL
      || currentUser?.profilePhoto
      || currentUser?.avatarUrl
      || profile?.photoUrl
      || ""
    ).trim()
  };
}

function userInitials(name) {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] || ""}${words.at(-1)?.[0] || ""}`.toUpperCase();
}

function renderDashboardAvatar(profile) {
  if (!els.dashboardAvatar) return;
  els.dashboardAvatar.classList.remove("has-photo", "has-icon");
  els.dashboardAvatar.innerHTML = "";

  if (profile.photoUrl) {
    els.dashboardAvatar.classList.add("has-photo");
    els.dashboardAvatar.innerHTML = `<img src="${escapeAttr(profile.photoUrl)}" alt="">`;
    return;
  }

  const initials = userInitials(profile.name);
  if (initials) {
    els.dashboardAvatar.textContent = initials;
    return;
  }

  els.dashboardAvatar.classList.add("has-icon");
  els.dashboardAvatar.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 12.2c2.2 0 4-1.8 4-4.1S14.2 4 12 4 8 5.8 8 8.1s1.8 4.1 4 4.1Zm0 2.1c-3.4 0-6.5 1.7-7.9 4.4-.3.6.1 1.3.8 1.3h14.2c.7 0 1.1-.7.8-1.3-1.4-2.7-4.5-4.4-7.9-4.4Z"/>
    </svg>
  `;
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

  const roleLabel = currentUser.role === "admin" ? "Admin" : isPrincipalUser() ? "Principal" : "Teacher";
  els.userBadge.textContent = roleLabel;
  els.userBadge.dataset.shortLabel = roleLabel;
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

  activeView = "dashboard";
  saveUiState();
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
  unsavedAttendanceSections.clear();
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

function dataEntryUpdateKey(type, className, exam, subject = "") {
  return [type, className, exam, subject].map((value) => String(value || "")).join("::");
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

function normalizeDashboardSearch(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function dashboardQueryHasAlias(query, alias) {
  const normalizedAlias = normalizeDashboardSearch(alias);
  if (!query || !normalizedAlias) return false;
  return query === normalizedAlias || ` ${query} `.includes(` ${normalizedAlias} `);
}

function removeDashboardAlias(query, alias) {
  const normalizedAlias = normalizeDashboardSearch(alias);
  if (!query || !normalizedAlias) return query;
  return ` ${query} `
    .replace(new RegExp(` ${escapeRegExp(normalizedAlias)} `, "g"), " ")
    .trim();
}

function classSearchAliases(className) {
  const romanAliases = {
    "Class I": ["class 1", "one"],
    "Class II": ["class 2", "two"],
    "Class III": ["class 3", "three"],
    "Class IV": ["class 4", "four"],
    "Class V": ["class 5", "five"],
    "Class VI": ["class 6", "six"],
    "Class VII": ["class 7", "seven"],
    "Class VIII": ["class 8", "eight"],
    "Class IX": ["class 9", "nine"],
    "Class X": ["class 10", "ten"]
  };
  return [className, ...(romanAliases[className] || [])].map(normalizeDashboardSearch);
}

function examSearchAliases(exam) {
  const aliases = {
    "FT Unit Test 1": ["ft ut 1", "ftut1", "unit test 1"],
    "FT Unit Test 2": ["ft ut 2", "ftut2", "unit test 2"],
    "ST Unit Test 1": ["st ut 1", "stut1", "second term unit test 1"],
    "ST Unit Test 2": ["st ut 2", "stut2", "second term unit test 2"],
    "First Term": ["1st term", "first"],
    "Second Term": ["2nd term", "second"],
    "Third Term": ["3rd term", "third"],
    CT1: ["ct 1", "class test 1"],
    CT2: ["ct 2", "class test 2"],
    CT3: ["ct 3", "class test 3"],
    CT4: ["ct 4", "class test 4"]
  };
  return [exam, ...(aliases[exam] || [])].map(normalizeDashboardSearch);
}

function findDashboardClassSearch(query) {
  return [...classNames].sort((a, b) => {
    const aLength = Math.max(...classSearchAliases(a).map((alias) => alias.length));
    const bLength = Math.max(...classSearchAliases(b).map((alias) => alias.length));
    return bLength - aLength;
  }).find((className) =>
    classSearchAliases(className).some((alias) => dashboardQueryHasAlias(query, alias))
  ) || "";
}

function findDashboardExamSearch(query, className = "") {
  const availableExams = className ? currentExams(className) : examNames;
  return availableExams.find((exam) =>
    examSearchAliases(exam).some((alias) => dashboardQueryHasAlias(query, alias))
  ) || "";
}

function dashboardSearchClassForExam(exam) {
  return classNames.find((className) => currentExams(className).includes(exam)) || "";
}

function cleanDashboardStudentQuery(query, className = "", exam = "") {
  let cleaned = query;
  ["student", "students", "roll", "roll no", "roll number"].forEach((term) => {
    cleaned = removeDashboardAlias(cleaned, term);
  });
  if (className) {
    classSearchAliases(className)
      .sort((a, b) => b.length - a.length)
      .forEach((alias) => {
        cleaned = removeDashboardAlias(cleaned, alias);
      });
  }
  if (exam) {
    examSearchAliases(exam)
      .sort((a, b) => b.length - a.length)
      .forEach((alias) => {
        cleaned = removeDashboardAlias(cleaned, alias);
      });
  }
  return cleaned.trim();
}

function findDashboardStudentSearch(query, options = {}) {
  const allowRollMatch = options.allowRollMatch !== false;
  const searchQuery = options.searchQuery || query;
  const queryNumber = searchQuery.match(/\b\d+\b/)?.[0] || "";
  const classHint = findDashboardClassSearch(query);
  const classes = classHint ? [classHint] : classNames;
  for (const className of classes) {
    const student = (state.classes[className] || []).find((item) => {
      const name = normalizeDashboardSearch(item.name);
      const roll = normalizeDashboardSearch(item.roll);
      const idNo = normalizeDashboardSearch(item.idNo);
      return (searchQuery && name.includes(searchQuery))
        || (allowRollMatch && queryNumber && roll === queryNumber)
        || (idNo && searchQuery.includes(idNo));
    });
    if (student) return { className, student };
  }
  return null;
}

function setDashboardSearchClass(className) {
  if (!className || !state.classes[className]) return;
  els.classSelect.value = className;
  if (els.studentsClassSelect) els.studentsClassSelect.value = className;
  if (els.attendanceClassSelect) els.attendanceClassSelect.value = className;
  updateExamSelect();
  updateSubjectSelect();
}

function handleDashboardSearch(event) {
  if (event?.type === "keydown" && event.key !== "Enter") return;
  event?.preventDefault();
  const rawQuery = els.dashboardSearchInput?.value || "";
  const query = normalizeDashboardSearch(rawQuery);
  if (!query) return;

  const viewMatches = [
    { view: "entry", terms: ["marks", "mark entry", "entry"] },
    { view: "attendance", terms: ["attendance", "physical", "height", "weight"] },
    { view: "results", terms: ["result", "results", "publish"] },
    { view: "marksheet", terms: ["marksheet", "marksheets", "print marksheet"] },
    { view: "students", terms: ["student", "students", "roll"] },
    { view: "analysis", terms: ["analysis", "academic analysis", "trend"] },
    { view: "teacherAnalytics", terms: ["teacher performance", "teacher analytics"] },
    { view: "teacherAssessment", terms: ["teacher assessment"] },
    { view: "entryAccess", terms: ["entry access", "settings", "access control"] }
  ];
  const matchedView = viewMatches.find((item) => item.terms.some((term) => dashboardQueryHasAlias(query, term)));
  let matchedClass = findDashboardClassSearch(query);
  const matchedExam = findDashboardExamSearch(query, matchedClass || selectedClass()) || findDashboardExamSearch(query);
  if (matchedExam && !matchedClass && !currentExams(selectedClass()).includes(matchedExam)) {
    matchedClass = dashboardSearchClassForExam(matchedExam);
  }
  const studentQuery = cleanDashboardStudentQuery(query, matchedClass, matchedExam);
  const matchedStudent = findDashboardStudentSearch(query, {
    searchQuery: studentQuery,
    allowRollMatch: !matchedExam || dashboardQueryHasAlias(query, "roll") || dashboardQueryHasAlias(query, "student")
  });

  if (matchedStudent) {
    dashboardStudentHighlight = String(matchedStudent.student.roll);
    setDashboardSearchClass(matchedStudent.className);
    switchView("students");
    showToast(`Showing ${matchedStudent.student.name} in ${matchedStudent.className}.`);
    return;
  }

  if (matchedClass) {
    dashboardStudentHighlight = null;
    setDashboardSearchClass(matchedClass);
  }
  if (matchedExam) setSelectValueIfAvailable(els.examSelect, matchedExam);

  if (matchedView) {
    switchView(matchedView.view);
    return;
  }
  if (matchedExam) {
    switchView("results");
    return;
  }
  if (matchedClass) {
    switchView("students");
    showToast(`Showing ${matchedClass}.`);
    return;
  }

  showToast(`No dashboard match found for "${rawQuery.trim()}".`);
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
    value: project === "" || isEntryStatusValue(project) ? project : Number(project) + attendanceMarks
  };
}

function isActivitiesSubject(subject = selectedSubject(), className = selectedClass(), exam = selectedExam()) {
  return isStructuredTermResult(className, exam) && subject.endsWith(" (Activities)");
}

function getActivityProjectMark(mark, attendanceMarks) {
  if (mark.project !== undefined && mark.project !== null && mark.project !== "") return mark.project;
  if (mark.value === "" || mark.value === undefined || mark.value === null) return "";
  if (isEntryStatusValue(mark.value)) return mark.value;
  const storedValue = Number(mark.value);
  const attendanceValue = Number(attendanceMarks);
  if (!Number.isFinite(storedValue)) return "";
  return clamp(storedValue - (Number.isFinite(attendanceValue) ? attendanceValue : 0), 0, 15);
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
    trackUnsavedMarkChange(className, exam, subject, roll, options.fieldKey || "value");
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
  const statusValue = isNotEnrolledEntry(partA) && isNotEnrolledEntry(partB)
    ? -2
    : isAbsentEntry(partA) || isAbsentEntry(partB)
      ? -1
      : null;
  return {
    ...mark,
    partA,
    partB,
    value: statusValue ?? roundMarkTotal(numericMark(partA) + numericMark(partB))
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
    trackUnsavedAttendanceChange("attendance");
    return;
  }
  saveState();
}

function getAttendanceMarks(attendance, workingDays, className) {
  if (!workingDays || attendance === "" || isEntryStatusValue(attendance)) return 0;
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
    if (Object.prototype.hasOwnProperty.call(patch, "height")) {
      trackUnsavedAttendanceChange("height");
    }
    if (Object.prototype.hasOwnProperty.call(patch, "weight")) {
      trackUnsavedAttendanceChange("weight");
    }
    return;
  }
  saveState();
}

function isPublished() {
  return Boolean(state.published[examKey()]);
}

function canViewResult() {
  return isPublished() || canPreviewUnpublished();
}

function isMarksheetPublished() {
  return Boolean(state.publishedMarksheets?.[examKey()]);
}

function canViewMarksheet() {
  return isMarksheetPublished() || canPreviewUnpublished();
}

function populateSelect(select, options) {
  select.innerHTML = options
    .map((option) => `<option value="${escapeAttr(option)}">${escapeHtml(option)}</option>`)
    .join("");
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
  if (els.teacherAssignmentClassSelect) {
    populateSelect(els.teacherAssignmentClassSelect, classNames);
    updateTeacherAssignmentSubjectOptions();
    updateTeacherAssignmentPartOptions();
  }
  initializeTeacherAnalyticsFilters(savedUiState);

  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });
  setupMobileNavigation();
  els.dashboardExamSelect?.addEventListener("change", () => renderDashboard());
  els.dashboardMonthSelect?.addEventListener("change", () => renderDashboard());
  els.dashboardNotificationBtn?.addEventListener("click", focusDashboardActivities);
  els.dashboardFullReportBtn?.addEventListener("click", () => switchView("results"));
  els.dashboardAttendanceBtn?.addEventListener("click", () => switchView("attendance"));
  document.querySelectorAll("[data-dashboard-view]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.dashboardView));
  });
  els.dashboardSearchInput?.addEventListener("keydown", handleDashboardSearch);
  els.dashboardSearchInput?.addEventListener("search", handleDashboardSearch);
  setupDashboardResultTooltip();

  els.classSelect.addEventListener("change", () => {
    syncStudentsClassSelect();
    cancelStudentEdit();
    clearMarksheetSearch();
    updateExamSelect();
    updateSubjectSelect();
    saveUiState();
    render();
  });

  els.studentsClassSelect.addEventListener("change", () => {
    els.classSelect.value = els.studentsClassSelect.value;
    cancelStudentEdit();
    clearMarksheetSearch();
    updateExamSelect();
    updateSubjectSelect();
    saveUiState();
    render();
  });

  els.examSelect.addEventListener("change", () => {
    clearMarksheetSearch();
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
    trackUnsavedAttendanceChange("attendance");
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
  els.marksheetPublishBtn?.addEventListener("click", toggleMarksheetPublication);
  document.querySelector("#exportBtn").addEventListener("click", exportCsv);
  els.exportExcelBtn?.addEventListener("click", exportExcelFromFirestore);
  document.querySelector("#resetBtn").addEventListener("click", resetDemo);
  document.querySelector("#mobileResetBtn")?.addEventListener("click", () => {
    closeMobileMenu();
    resetDemo();
  });
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
      if (control === els.analysisSectionSelect || control === els.analysisClassSelect) {
        updateAnalysisProgressClassOptions();
        updateAnalysisProgressExamOptions();
      }
      saveUiState();
      renderAcademicAnalysis();
    });
  });
  els.downloadAnalysisPdfBtn?.addEventListener("click", downloadAnalysisPDF);
  els.exportAnalysisExcelBtn?.addEventListener("click", exportAnalysisExcel);
  els.printAnalysisBtn?.addEventListener("click", printAcademicAnalysis);
  els.teacherAssignmentForm?.addEventListener("submit", saveTeacherAssignment);
  els.teacherAssignmentClassSelect?.addEventListener("change", () => {
    updateTeacherAssignmentSubjectOptions();
    updateTeacherAssignmentPartOptions();
  });
  els.teacherAssignmentSubjectSelect?.addEventListener("change", () => updateTeacherAssignmentPartOptions());
  els.cancelTeacherAssignmentEditBtn?.addEventListener("click", resetTeacherAssignmentForm);
  els.toggleTeacherAssignmentTableBtn?.addEventListener("click", () => {
    const tableWrap = els.teacherAssignmentTableWrap;
    const button = els.toggleTeacherAssignmentTableBtn;
    if (!tableWrap || !button) return;
    const willShow = tableWrap.classList.contains("hidden");
    tableWrap.classList.toggle("hidden", !willShow);
    button.textContent = willShow ? "Hide Table" : "Show Table";
    button.setAttribute("aria-expanded", String(willShow));
  });
  els.teacherAssignmentBody?.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-teacher-assignment]");
    const removeButton = event.target.closest("[data-remove-teacher-assignment]");
    if (editButton) editTeacherAssignment(editButton.dataset.editTeacherAssignment);
    if (removeButton) removeTeacherAssignment(removeButton.dataset.removeTeacherAssignment);
  });
  [
    els.teacherAnalyticsSessionSelect,
    els.teacherAnalyticsExamSelect,
    els.teacherAnalyticsTeacherSelect,
    els.teacherAnalyticsClassSelect,
    els.teacherAnalyticsSubjectSelect
  ].filter(Boolean).forEach((control) => {
    control.addEventListener("change", () => {
      initializeTeacherAnalyticsFilters();
      saveUiState();
      renderTeacherAnalytics();
    });
  });
  els.downloadTeacherAnalysisPdfBtn?.addEventListener("click", downloadTeacherAnalysisPDF);
  els.exportTeacherAnalysisExcelBtn?.addEventListener("click", exportTeacherAnalysisExcel);
  els.printTeacherAnalysisBtn?.addEventListener("click", printTeacherAnalysis);
  els.analysisProgressClassSelect?.addEventListener("change", () => {
    updateAnalysisProgressExamOptions();
    saveUiState();
    renderAcademicAnalysis();
  });
  els.analysisProgressFromExamSelect?.addEventListener("change", () => {
    updateAnalysisProgressExamOptions();
    saveUiState();
    renderAcademicAnalysis();
  });
  els.analysisProgressToExamSelect?.addEventListener("change", () => {
    saveUiState();
    renderAcademicAnalysis();
  });
  [
    els.performanceChangeSessionSelect,
    els.performanceChangeClassSelect,
    els.performanceChangeFromExamSelect,
    els.performanceChangeToExamSelect,
    els.performanceChangeSubjectSelect,
    els.performanceChangeStudentSelect,
    els.performanceChangeSortSelect
  ].filter(Boolean).forEach((control) => {
    control.addEventListener("change", () => {
      updatePerformanceChangeFilters();
      saveUiState();
      renderAcademicAnalysis();
    });
  });
  els.performanceChangeBody?.addEventListener("click", (event) => {
    const row = event.target.closest("[data-performance-student]");
    if (!row || !analysisCurrentData?.performanceChange) return;
    const studentKey = decodeURIComponent(row.dataset.performanceStudent || "");
    const record = analysisCurrentData.performanceChange.records
      .find((item) => item.key === studentKey);
    renderPerformanceChangeStudentDetail(
      record,
      analysisCurrentData.performanceFromExam,
      analysisCurrentData.performanceToExam
    );
  });
  els.performanceChangeBody?.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    event.target.closest("[data-performance-student]")?.click();
  });
  els.performanceChangeStudentDetail?.addEventListener("click", (event) => {
    if (!event.target.closest("[data-close-performance-detail]")) return;
    els.performanceChangeStudentDetail.classList.add("hidden");
    els.performanceChangeStudentDetail.innerHTML = "";
  });
  els.toggleAnalysisGrowthListBtn?.addEventListener("click", () =>
    toggleAnalysisStudentList(els.toggleAnalysisGrowthListBtn, els.analysisGrowthTableWrap));
  els.toggleAnalysisRiskListBtn?.addEventListener("click", () =>
    toggleAnalysisStudentList(els.toggleAnalysisRiskListBtn, els.analysisRiskTableWrap));
  els.toggleAnalysisSupportListBtn?.addEventListener("click", () =>
    toggleAnalysisStudentList(els.toggleAnalysisSupportListBtn, els.analysisSupportTableWrap));
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
  initializeMarksheetZoomDefault();
  updateMarksheetZoom();
  renderAuth();

  render();
}

function initializeMarksheetZoomDefault() {
  if (!els.marksheetZoomInput || !els.marksheetZoomValue) return;
  if (isMobileView() && Number(els.marksheetZoomInput.value) === 100) {
    els.marksheetZoomInput.value = 50;
    els.marksheetZoomValue.value = "50%";
  }
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
  if (isEntryMarkInput(target) || isAttendanceEntryInput(target)) {
    target.dispatchEvent(new Event("input", { bubbles: true }));
    target.dispatchEvent(new Event("change", { bubbles: true }));
    if (nextField instanceof HTMLInputElement) {
      focusInputKeepingKeyboard(nextField);
    }
    return;
  }

  const restoreSelector = getInputRestoreSelector(nextField);
  target.dispatchEvent(new Event("change", { bubbles: true }));
  setTimeout(() => {
    const field = restoreSelector ? document.querySelector(restoreSelector) : nextField;
    if (field instanceof HTMLInputElement) {
      focusInputKeepingKeyboard(field);
    }
  }, 0);
}

function focusInputKeepingKeyboard(input) {
  if (!(input instanceof HTMLInputElement)) return;
  input.focus({ preventScroll: true });
  if (isMobileView()) return;
  input.select?.();
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
    view = "dashboard";
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

function renderDashboard() {
  if (!els.dashboardTotalStudents) return;
  const session = currentSessionKey(state.academicSession);
  const classes = classNames.filter((className) => state.classes?.[className]);
  const examOptions = [...new Set(classes.flatMap((className) => currentExams(className)))];
  const currentDashboardExam = els.dashboardExamSelect?.value || selectedExam() || "First Term";
  if (els.dashboardExamSelect) {
    populateSelect(els.dashboardExamSelect, examOptions.length ? examOptions : examNames);
    setSelectValueIfAvailable(els.dashboardExamSelect, currentDashboardExam);
  }
  const exam = els.dashboardExamSelect?.value || currentDashboardExam;
  const students = classes.flatMap((className) => state.classes[className] || []);
  const records = buildAcademicAnalysisSelectionRecords(session, classes, exam);
  const overview = analysisOverviewMetrics(records);
  const teacherNames = new Set([
    ...normalizeTeacherAssignments(state.teacherAssignments).map((assignment) => assignment.teacherName),
    ...(state.teacherAssessment?.profiles || []).map((profile) => profile.name)
  ].filter(Boolean));

  const dashboardUser = getDashboardUserProfile();
  els.dashboardGreeting.textContent = `Welcome back, ${dashboardUser.name || "Teacher"}`;
  els.dashboardSession.textContent = `Academic Session ${session}`;
  els.dashboardUserName.textContent = dashboardUser.name || "Teacher";
  els.dashboardUserRole.textContent = dashboardUser.role || (isAdmin() ? "Administrator" : "Teacher");
  renderDashboardAvatar(dashboardUser);
  els.dashboardTotalStudents.textContent = String(students.length);
  els.dashboardTotalTeachers.textContent = String(teacherNames.size || normalizeTeacherAssignments(state.teacherAssignments).length);
  els.dashboardTotalClasses.textContent = String(classes.length);
  els.dashboardOverallPass.textContent = `${overview.passPercentage.toFixed(2)}%`;
  const dashboardActivities = dashboardActivityItems();
  updateDashboardNotificationBadge(dashboardActivities);

  renderDashboardResultOverview(exam, overview, records);
  renderDashboardClassPerformance(records);
  renderDashboardAttendance();
  renderDashboardActivities(dashboardActivities);
}

function renderDashboardResultOverview(exam, overview, records) {
  const summary = dashboardResultClassificationSummary(records);
  const classLabel = "All Classes";
  els.dashboardResultMeta.textContent = `${classLabel} | ${exam} | ${currentSessionKey(state.academicSession)} | ${overview.present} appeared of ${overview.total} students`;
  els.dashboardResultDonut.innerHTML = dashboardResultRadialSvg(summary);
  els.dashboardResultLegend.innerHTML = dashboardResultSummaryHtml(summary);
}

function dashboardResultClassificationSummary(records) {
  const categories = [
    { key: "distinction", label: "Dist.", fullLabel: "Distinction", count: 0, color: "#716A7D" },
    { key: "firstDivision", label: "I", fullLabel: "First Division", count: 0, color: "#C77F8F" },
    { key: "secondDivision", label: "II", fullLabel: "Second Division", count: 0, color: "#FA858C" },
    { key: "thirdDivision", label: "III", fullLabel: "Third Division", count: 0, color: "#FDA58E" },
    { key: "simplePass", label: "S.P.", fullLabel: "Simple Pass", count: 0, color: "#E9B862" },
    { key: "fail", label: "Fail", fullLabel: "Fail", count: 0, color: "#DC6268" },
    { key: "absent", label: "Absent", fullLabel: "Absent", count: 0, color: "#AEB5BA" }
  ];
  const byKey = Object.fromEntries(categories.map((category) => [category.key, category]));

  records.forEach((record) => {
    if (!record.appeared) {
      byKey.absent.count += 1;
    } else if (record.result === "Simple Pass") {
      byKey.simplePass.count += 1;
    } else if (record.result === "Fail") {
      byKey.fail.count += 1;
    } else if (record.division === "Dist.") {
      byKey.distinction.count += 1;
    } else if (record.division === "I") {
      byKey.firstDivision.count += 1;
    } else if (record.division === "II") {
      byKey.secondDivision.count += 1;
    } else if (record.division === "III") {
      byKey.thirdDivision.count += 1;
    }
  });

  const total = records.length;
  const maxCount = Math.max(0, ...categories.map((category) => category.count));
  return {
    total,
    maxCount,
    categories: categories.map((category) => ({
      ...category,
      percentage: total ? (category.count / total) * 100 : 0
    }))
  };
}

function radialArcPath(cx, baseline, radius, progress = 1) {
  const clamped = clamp(progress, 0, 1);
  const startX = cx - radius;
  if (clamped <= 0) return "";
  const angle = Math.PI - (Math.PI * clamped);
  const endX = cx + (Math.cos(angle) * radius);
  const endY = baseline - (Math.sin(angle) * radius);
  const largeArc = clamped > 0.5 ? 1 : 0;
  return `M ${startX.toFixed(2)} ${baseline} A ${radius} ${radius} 0 ${largeArc} 1 ${endX.toFixed(2)} ${endY.toFixed(2)}`;
}

function formatCategoryPercent(value) {
  const rounded = Math.round((Number(value) || 0) * 100) / 100;
  return `${rounded.toFixed(rounded % 1 === 0 ? 0 : 2)}%`;
}

function dashboardResultRadialSvg(summary) {
  const cx = 430;
  const baseline = 372;
  const radii = [310, 270, 230, 190, 150, 110, 70];
  const strokeWidth = 28;
  const connectorXs = [120, 230, 340, 450, 560, 670, 780];
  const safeMax = summary.maxCount || 1;
  const arcs = summary.categories.map((category, index) => {
    const progress = category.count / safeMax;
    const percent = formatCategoryPercent(category.percentage);
    const tooltip = `${category.fullLabel}\n${category.count} student${category.count === 1 ? "" : "s"}\n${percent} of total`;
    const path = radialArcPath(cx, baseline, radii[index], 1);
    return `
      <path class="result-radial-bg" d="${path}" pathLength="1"></path>
      ${category.count ? `<g class="result-radial-segment" tabindex="0" role="img" data-result-tooltip="${escapeAttr(tooltip)}" aria-label="${escapeAttr(`${category.fullLabel}: ${category.count} students, ${percent} of total`)}">
        <title>${escapeHtml(tooltip)}</title>
        <path class="result-radial-shadow" d="${path}" stroke="${category.color}" pathLength="1"></path>
        <path class="result-radial-progress" d="${path}" stroke="${category.color}" pathLength="1" style="--arc-progress:${progress.toFixed(4)}"></path>
        <path class="result-radial-highlight" d="${path}" pathLength="1" style="--arc-progress:${progress.toFixed(4)}"></path>
      </g>` : ""}
      <line class="result-radial-connector" x1="${connectorXs[index]}" y1="${baseline + 8}" x2="${connectorXs[index]}" y2="${baseline + 54}"></line>
      <circle class="result-radial-dot" cx="${connectorXs[index]}" cy="${baseline + 64}" r="8" fill="${category.color}">
        <title>${escapeHtml(tooltip)}</title>
      </circle>
    `;
  }).join("");
  return `
    <svg class="result-radial-chart" viewBox="0 0 860 470" role="img" aria-label="Result classification chart showing Distinction, First Division, Second Division, Third Division, Simple Pass, Fail, and Absent counts.">
      <defs>
        <linearGradient id="resultRadialGloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.62"></stop>
          <stop offset="46%" stop-color="#ffffff" stop-opacity="0.18"></stop>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"></stop>
        </linearGradient>
      </defs>
      <line class="result-radial-baseline" x1="90" y1="${baseline}" x2="790" y2="${baseline}"></line>
      ${arcs}
      ${summary.total ? "" : '<text class="result-radial-empty" x="430" y="205" text-anchor="middle">No result data available for the selected filters.</text>'}
    </svg>
  `;
}

function dashboardResultSummaryHtml(summary) {
  return `
    <div class="result-radial-summary" aria-label="Result classification summary">
      ${summary.categories.map((category) => {
        const percent = formatCategoryPercent(category.percentage);
        const tooltip = `${category.fullLabel}: ${category.count} student${category.count === 1 ? "" : "s"}, ${percent} of total`;
        return `
          <article class="result-radial-summary-item" title="${escapeAttr(tooltip)}" data-result-tooltip="${escapeAttr(tooltip)}" tabindex="0">
            <i style="background:${category.color}" aria-hidden="true"></i>
            <span>${escapeHtml(category.label)}</span>
            <strong>${category.count}<em> Students</em></strong>
            <small>${percent}</small>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function setupDashboardResultTooltip() {
  let tooltip = null;
  let activeTarget = null;
  const ensureTooltip = () => {
    if (tooltip) return tooltip;
    tooltip = document.createElement("div");
    tooltip.className = "result-radial-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.hidden = true;
    document.body.appendChild(tooltip);
    return tooltip;
  };
  const positionTooltip = (x, y) => {
    if (!tooltip || tooltip.hidden) return;
    const margin = 12;
    const rect = tooltip.getBoundingClientRect();
    const left = clamp(x + 14, margin, window.innerWidth - rect.width - margin);
    const top = clamp(y + 14, margin, window.innerHeight - rect.height - margin);
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };
  const showTooltip = (target, x, y) => {
    const message = target?.dataset?.resultTooltip;
    if (!message) return;
    activeTarget = target;
    const node = ensureTooltip();
    node.innerHTML = message.split("\n").map((line) => `<span>${escapeHtml(line)}</span>`).join("");
    node.hidden = false;
    positionTooltip(x, y);
  };
  const hideTooltip = (target = activeTarget) => {
    if (target && activeTarget && target !== activeTarget && !activeTarget.contains(target)) return;
    activeTarget = null;
    if (tooltip) tooltip.hidden = true;
  };

  document.addEventListener("pointerover", (event) => {
    const target = event.target.closest?.("[data-result-tooltip]");
    if (target) showTooltip(target, event.clientX, event.clientY);
  });
  document.addEventListener("pointermove", (event) => {
    if (activeTarget) positionTooltip(event.clientX, event.clientY);
  });
  document.addEventListener("pointerout", (event) => {
    const target = event.target.closest?.("[data-result-tooltip]");
    if (target && !target.contains(event.relatedTarget)) hideTooltip(target);
  });
  document.addEventListener("focusin", (event) => {
    const target = event.target.closest?.("[data-result-tooltip]");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    showTooltip(target, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
  document.addEventListener("focusout", (event) => {
    const target = event.target.closest?.("[data-result-tooltip]");
    if (target) hideTooltip(target);
  });
  document.addEventListener("click", (event) => {
    const target = event.target.closest?.("[data-result-tooltip]");
    if (!target) {
      hideTooltip();
      return;
    }
    showTooltip(target, event.clientX, event.clientY);
  });
}

function dashboardClassBadgeLabel(className) {
  const labels = {
    LKG: "LKG",
    UKG: "UKG",
    "Class I": "I",
    "Class II": "II",
    "Class III": "III",
    "Class IV": "IV",
    "Class V": "V",
    "Class VI": "VI",
    "Class VII": "VII",
    "Class VIII": "VIII",
    "Class IX": "IX",
    "Class X": "X"
  };
  return labels[className] || className;
}

function dashboardFormatPercent(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0%";
  const rounded = Math.round(parsed * 100) / 100;
  return `${rounded.toFixed(rounded % 1 === 0 ? 0 : 2)}%`;
}

function dashboardPerformanceBar(className, metricLabel, value, type) {
  const percentage = clamp(Number(value) || 0, 0, 100);
  const label = dashboardFormatPercent(percentage);
  return `
    <div class="performance-metric-row">
      <span class="metric-label">${escapeHtml(metricLabel)}</span>
      <div class="performance-track" role="img" aria-label="${escapeAttr(`${className} ${metricLabel} ${label}`)}" title="${escapeAttr(`${className}\n${metricLabel}: ${label}`)}">
        <i class="performance-bar-fill ${type === "pass" ? "pass-bar-fill" : "average-bar-fill"}" style="width:${percentage}%"></i>
      </div>
      <b class="performance-bar-value">${label}</b>
    </div>
  `;
}

function renderDashboardClassPerformance(records) {
  const metrics = analysisClassMetrics(records);
  const metricsByClass = new Map(metrics.map((metric) => [metric.className, metric]));
  const rows = classNames.map((className) => {
    const metric = metricsByClass.get(className) || {
      className,
      passPercentage: 0,
      average: 0
    };
    return `
      <article class="dashboard-class-row" tabindex="0" title="${escapeAttr(`${className}\nPass Percentage: ${dashboardFormatPercent(metric.passPercentage)}\nAverage Percentage: ${dashboardFormatPercent(metric.average)}`)}">
        <div class="class-badge" aria-label="${escapeAttr(className)}">${escapeHtml(dashboardClassBadgeLabel(className))}</div>
        <div class="class-performance-metrics">
          ${dashboardPerformanceBar(className, "Pass %", metric.passPercentage, "pass")}
          ${dashboardPerformanceBar(className, "Average %", metric.average, "average")}
        </div>
      </article>
    `;
  });
  els.dashboardClassPerformance.innerHTML = rows.length ? `
    <div class="class-performance-legend" aria-label="Class performance legend">
      <span><i class="legend-swatch pass"></i>Pass Percentage</span>
      <span><i class="legend-swatch average"></i>Average Percentage Scored</span>
    </div>
    ${rows.join("")}
  ` : '<p class="dashboard-muted">No class performance data is available for the selected filters.</p>';
}

function renderDashboardAttendance() {
  const term = els.dashboardMonthSelect?.value || "First Term";
  const termWorkingDays = Number(state.workingDays?.[term]) || 0;
  let possibleDays = 0;
  let attendedDays = 0;
  let enrolledStudents = 0;
  let notEnrolled = 0;
  const classRows = [];
  const riskStudents = [];

  classNames.forEach((className) => {
    const students = state.classes?.[className] || [];
    const workingDays = termWorkingDays;
    let classPossibleDays = 0;
    let classAttendedDays = 0;
    let classEnrolledStudents = 0;

    students.forEach((student) => {
      const value = getStudentAttendance(student, className, term);
      if (isNotEnrolledEntry(value)) {
        notEnrolled += 1;
        return;
      }
      classEnrolledStudents += 1;
      enrolledStudents += 1;
      if (workingDays > 0) {
        possibleDays += workingDays;
        classPossibleDays += workingDays;
      }
      if (isScoredEntry(value)) {
        const studentDays = Math.max(0, Number(value) || 0);
        attendedDays += studentDays;
        classAttendedDays += studentDays;
        const studentPercent = workingDays ? (studentDays / workingDays) * 100 : 0;
        if (workingDays > 0 && studentPercent < 75) {
          riskStudents.push({
            className,
            roll: student.roll,
            name: student.name,
            percent: studentPercent,
            label: `${studentDays}/${workingDays}`
          });
        }
      } else if (isAbsentEntry(value) && workingDays > 0) {
        riskStudents.push({
          className,
          roll: student.roll,
          name: student.name,
          percent: 0,
          label: "AB"
        });
      }
    });

    if (classEnrolledStudents > 0) {
      const percent = classPossibleDays ? (classAttendedDays / classPossibleDays) * 100 : 0;
      classRows.push({
        className,
        enrolled: classEnrolledStudents,
        attendedDays: classAttendedDays,
        possibleDays: classPossibleDays,
        percent
      });
    }
  });

  const percent = possibleDays ? Math.round((attendedDays / possibleDays) * 10000) / 100 : 0;
  if (els.dashboardAttendanceStudents) els.dashboardAttendanceStudents.textContent = String(enrolledStudents);
  if (els.dashboardAttendanceAverage) els.dashboardAttendanceAverage.textContent = `${percent.toFixed(2)}%`;
  if (els.dashboardAttendancePresent) els.dashboardAttendancePresent.textContent = `${percent.toFixed(2)}%`;
  if (els.dashboardAttendanceWorkingDays) els.dashboardAttendanceWorkingDays.textContent = termWorkingDays ? String(termWorkingDays) : "0";
  if (els.dashboardAttendancePercent) els.dashboardAttendancePercent.textContent = `${percent.toFixed(2)}%`;
  if (els.dashboardAttendanceCircle) {
    els.dashboardAttendanceCircle.style.background = dashboardConicGradient([
      { label: "Present", value: attendedDays, color: "#22c55e" },
      { label: "Absent", value: Math.max(0, possibleDays - attendedDays), color: "#ef4444" }
    ]);
  }
  if (els.dashboardAttendanceAbsent) els.dashboardAttendanceAbsent.textContent = String(Math.max(0, possibleDays - attendedDays).toFixed(0));
  if (els.dashboardAttendanceLeave) els.dashboardAttendanceLeave.textContent = String(notEnrolled);
  if (els.dashboardAttendanceLowCount) els.dashboardAttendanceLowCount.textContent = String(riskStudents.length);
  if (els.dashboardAttendanceClassChart) {
    els.dashboardAttendanceClassChart.innerHTML = classRows.length ? classRows.map((row) => `
      <article class="dashboard-attendance-class-row">
        <div>
          <strong>${escapeHtml(row.className)}</strong>
          <span>${row.enrolled} student${row.enrolled === 1 ? "" : "s"}</span>
        </div>
        <div class="dashboard-attendance-bar" aria-label="${escapeAttr(`${row.className} attendance ${row.percent.toFixed(2)} percent`)}">
          <i style="width:${Math.max(2, Math.min(100, row.percent))}%"></i>
        </div>
        <b>${row.percent.toFixed(2)}%</b>
      </article>
    `).join("") : '<p class="dashboard-muted">No class attendance data available yet.</p>';
  }
  if (els.dashboardAttendanceRiskList) {
    const sortedRiskStudents = riskStudents
      .sort((a, b) => a.percent - b.percent || classNames.indexOf(a.className) - classNames.indexOf(b.className) || Number(a.roll) - Number(b.roll))
      .slice(0, 8);
    els.dashboardAttendanceRiskList.innerHTML = sortedRiskStudents.length ? sortedRiskStudents.map((student) => `
      <article>
        <div>
          <strong>${escapeHtml(student.name)}</strong>
          <span>${escapeHtml(student.className)} | Roll ${escapeHtml(String(student.roll))}</span>
        </div>
        <b>${student.label === "AB" ? "AB" : `${student.percent.toFixed(2)}%`}</b>
      </article>
    `).join("") : '<p class="dashboard-muted">No students below 75% for this term.</p>';
  }
  els.dashboardAttendanceMeta.textContent = possibleDays
    ? `Average attendance is ${percent.toFixed(2)}% for ${term}. ${notEnrolled ? `${notEnrolled} not enrolled excluded.` : ""}`.trim()
    : `Enter working days and attendance for ${term} to show attendance percentage.`;
}

function renderDashboardActivities(items = dashboardActivityItems()) {
  els.dashboardRecentActivities.innerHTML = items.length ? items.slice(0, 20).map((item) => `
    <article>
      <span class="${item.typeClass}" aria-hidden="true">${item.icon}</span>
      <div class="dashboard-activity-copy">
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.meta)}</small>
      </div>
      <time>${escapeHtml(item.time)}</time>
    </article>
  `).join("") : '<p class="dashboard-muted">No saved marks or attendance activities yet.</p>';
}

function focusDashboardActivities() {
  const activityCard = els.dashboardRecentActivities?.closest(".dashboard-activity-card");
  if (!activityCard) return;
  markDashboardNotificationsSeen();
  activityCard.setAttribute("tabindex", "-1");
  activityCard.scrollIntoView({ behavior: "smooth", block: "center" });
  activityCard.focus({ preventScroll: true });
  activityCard.classList.remove("dashboard-card-pulse");
  void activityCard.offsetWidth;
  activityCard.classList.add("dashboard-card-pulse");
  window.setTimeout(() => activityCard.classList.remove("dashboard-card-pulse"), 1600);
}

function dashboardActivityLatestTime(items = dashboardActivityItems()) {
  return items.reduce((latest, item) => Math.max(latest, Number(item.sortTime) || 0), 0);
}

function getDashboardNotificationsSeenTime() {
  try {
    const value = localStorage.getItem(dashboardNotificationSeenKey);
    return value === null ? null : Number(value) || 0;
  } catch (error) {
    return null;
  }
}

function setDashboardNotificationsSeenTime(timestamp) {
  try {
    localStorage.setItem(dashboardNotificationSeenKey, String(timestamp));
  } catch (error) {
    // Ignore storage errors; the current screen still updates for this session.
  }
}

function updateDashboardNotificationBadge(items = dashboardActivityItems()) {
  if (!els.dashboardNotificationBadge) return;
  const seenTime = getDashboardNotificationsSeenTime();
  const count = seenTime === null
    ? items.length
    : items.filter((item) => (Number(item.sortTime) || 0) > seenTime).length;
  els.dashboardNotificationBadge.textContent = String(count);
  els.dashboardNotificationBadge.hidden = count === 0;
  els.dashboardNotificationBtn?.classList.toggle("is-checked", count === 0);
  els.dashboardNotificationBtn?.setAttribute(
    "aria-label",
    count ? `Show recent activities, ${count} unchecked notification${count === 1 ? "" : "s"}` : "Show recent activities, no unchecked notifications"
  );
}

function markDashboardNotificationsSeen() {
  const items = dashboardActivityItems();
  setDashboardNotificationsSeenTime(dashboardActivityLatestTime(items) || Date.now());
  updateDashboardNotificationBadge(items);
}

function dashboardActivityItems() {
  const updates = Object.entries(state.dataEntryUpdates || {}).map(([key, value]) => {
    const [type, className, exam, subject] = key.split("::");
    const updatedAt = value?.updatedAt ? new Date(value.updatedAt) : null;
    const label = type === "marks" ? "Marks saved" : type === "attendance" ? "Attendance saved" : "Measurement saved";
    return {
      title: `${label}${className ? ` for ${className}` : ""}`,
      meta: [exam, subject, value?.updatedBy ? `by ${value.updatedBy}` : ""].filter(Boolean).join(" | "),
      time: updatedAt && !Number.isNaN(updatedAt.getTime()) ? updatedAt.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }) : "Saved",
      sortTime: updatedAt?.getTime() || 0,
      icon: type === "marks" ? "M" : type === "attendance" ? "A" : "P",
      typeClass: type === "marks" ? "activity-marks" : type === "attendance" ? "activity-attendance" : "activity-measurement"
    };
  }).sort((a, b) => b.sortTime - a.sortTime);
  if (updates.length) return updates;
  const studentTotal = classNames.reduce((sum, className) => sum + (state.classes?.[className]?.length || 0), 0);
  return studentTotal ? [{
    title: "Student records ready",
    meta: `${studentTotal} students across ${classNames.length} classes`,
    time: "Current",
    sortTime: 0,
    icon: "S",
    typeClass: "activity-students"
  }] : [];
}

function dashboardConicGradient(items) {
  const total = items.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  if (!total) return "conic-gradient(#d9e5f6 0deg 360deg)";
  let cursor = 0;
  const stops = items.map((item) => {
    const start = (cursor / total) * 360;
    cursor += Number(item.value) || 0;
    const end = (cursor / total) * 360;
    return `${item.color} ${start}deg ${end}deg`;
  });
  return `conic-gradient(${stops.join(",")})`;
}

function renderActiveViewChrome() {
  document.body.classList.toggle("dashboard-active", activeView === "dashboard");
  document.body.classList.toggle("entry-active", activeView === "entry");
  document.body.classList.toggle("attendance-active", activeView === "attendance");
  document.body.classList.toggle("results-active", activeView === "results");
  document.body.classList.toggle("students-active", activeView === "students");
  document.body.classList.toggle("marksheet-active", activeView === "marksheet");
  document.body.classList.toggle("analysis-active", activeView === "analysis");
  document.body.classList.toggle("teacher-analytics-active", activeView === "teacherAnalytics");
  document.body.classList.toggle("teacher-assessment-active", activeView === "teacherAssessment");
  document.body.classList.toggle("entry-access-active", activeView === "entryAccess");
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === activeView));
  document.querySelectorAll(".view").forEach((panel) => panel.classList.toggle("active", panel.id === `${activeView}View`));
  updateMobileNavActiveState();
  const titles = {
    dashboard: "Dashboard",
    entry: "Marks Entry",
    attendance: "Attendance and Physical Measurement",
    results: "Results",
    marksheet: "Marksheets",
    students: "Students",
    analysis: "Academic Analysis",
    teacherAnalytics: "Teacher Performance Analytics",
    teacherAssessment: "Teacher Assessment",
    entryAccess: "Entry Access Control"
  };
  els.viewTitle.textContent = titles[activeView] || "Dashboard";
}

function render() {
  renderViewFilters();
  renderPublishStatus();
  renderMarksheetPublishStatus();
  renderDashboard();
  renderEntry();
  renderAttendance();
  renderResults();
  renderMarksheets();
  renderStudents();
  renderAcademicAnalysis();
  renderTeacherAnalytics();
  renderTeacherAssessment();
  renderEntryAccessControl();
}

function renderViewFilters() {
  renderActiveViewChrome();
  syncStudentsClassSelect();
  const showMainFilters = !["dashboard", "attendance", "students", "analysis", "teacherAnalytics", "teacherAssessment", "entryAccess"].includes(activeView);
  els.mainFilters.classList.toggle("hidden", !showMainFilters);
  els.classField.classList.toggle("hidden", !showMainFilters);
  els.examField.classList.toggle("hidden", activeView === "students" || !showMainFilters);
  els.subjectField.classList.toggle("hidden", activeView !== "entry");
}

function renderPublishStatus() {
  const status = isPublished();
  const previewLabel = isAdmin() ? "Admin preview" : isPrincipalUser() ? "Principal preview" : "Not published";
  els.publishStatus.textContent = status ? "Published" : previewLabel;
  els.publishMeta.textContent = canPreviewUnpublished()
    ? status
      ? `${selectedClass()} - ${selectedExam()}`
      : `${selectedClass()} - ${selectedExam()} | Preview only until published`
    : `${selectedClass()} - ${selectedExam()} | Admin only`;
  els.publishBtn.classList.toggle("hidden", !isAdmin());
  els.unpublishBtn.classList.toggle("hidden", !isAdmin());
  els.publishBtn.disabled = publicationSaveInProgress || status;
  els.publishBtn.textContent = publicationSaveInProgress ? "Saving..." : status ? "Published" : "Publish Result";
  els.unpublishBtn.disabled = publicationSaveInProgress;
  els.unpublishBtn.textContent = publicationSaveInProgress ? "Saving..." : status ? "Unpublish" : "Publish";
  els.unpublishBtn.classList.toggle("primary-button", !status);
  els.unpublishBtn.classList.toggle("ghost-button", status);
  els.unpublishBtn.classList.toggle("danger", status);
  els.unpublishBtn.setAttribute(
    "aria-label",
    status ? "Unpublish selected class result" : "Publish selected class result"
  );
}

function renderMarksheetPublishStatus() {
  if (!els.marksheetPublishBtn) return;
  const status = isMarksheetPublished();
  els.marksheetPublishBtn.classList.toggle("hidden", !isAdmin());
  els.marksheetPublishBtn.disabled = publicationSaveInProgress;
  els.marksheetPublishBtn.textContent = publicationSaveInProgress ? "Saving..." : status ? "Unpublish" : "Publish";
  els.marksheetPublishBtn.classList.toggle("primary-button", !status);
  els.marksheetPublishBtn.classList.toggle("ghost-button", status);
  els.marksheetPublishBtn.classList.toggle("danger", status);
  els.marksheetPublishBtn.setAttribute(
    "aria-label",
    status ? "Unpublish selected class marksheets" : "Publish selected class marksheets"
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
  let scored = 0;
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
    const hasNumber = !gradeSubject && isScoredEntry(value) && !Number.isNaN(numericValue);
    const status = getEntryStatus(value, passMarks, { gradeSubject, noPassMark });

    if (hasNumber) {
      entered += 1;
      scored += 1;
      total += numericValue;
      highest = Math.max(highest, numericValue);
      lowest = Math.min(lowest, numericValue);
    } else if (value !== "") {
      entered += 1;
    }

    return `
      <tr>
        <td>${student.roll}</td>
        <td>${escapeHtml(student.name)}</td>
        ${activitiesSubject
          ? `<td><input class="mark-input activity-project-input" type="number" inputmode="decimal" enterkeyhint="next" min="-2" max="15" step="0.01" tabindex="${index + 1}"
                value="${escapeAttr(mark.project ?? "")}" data-project-roll="${student.roll}"
                aria-label="Project, assignment, and book maintenance marks for ${escapeAttr(student.name)}"></td>
            <td><strong>${mark.attendanceMarks}</strong></td>
            <td><output class="calculated-mark">${value === "" ? "-" : escapeHtml(value)}</output></td>`
          : splitPartSubject
            ? `<td><input class="mark-input split-part-input" type="number" inputmode="decimal" enterkeyhint="next" min="-2" max="${maxMarks}" step="0.01" tabindex="${index + 1}"
                value="${escapeAttr(mark.partA ?? "")}" data-part-roll="${student.roll}" data-part-key="partA"
                aria-label="Part A marks for ${escapeAttr(student.name)}"></td>
            <td><input class="mark-input split-part-input" type="number" inputmode="decimal" enterkeyhint="next" min="-2" max="${maxMarks}" step="0.01" tabindex="${students.length + index + 1}"
                value="${escapeAttr(mark.partB ?? "")}" data-part-roll="${student.roll}" data-part-key="partB"
                aria-label="Part B marks for ${escapeAttr(student.name)}"></td>
            <td><output class="calculated-mark">${value === "" ? "-" : escapeHtml(value)}</output></td>`
          : `<td>
          ${gradeSubject
            ? `<input class="mark-input grade-input" type="text" inputmode="text" enterkeyhint="next" maxlength="2" placeholder="A-E, -1, -2" tabindex="${index + 1}" value="${escapeAttr(value)}" data-grade-roll="${student.roll}" aria-label="Grade for ${escapeAttr(student.name)}. Enter -1 for Absent or -2 for Not yet enrolled.">`
            : `<input class="mark-input" type="number" inputmode="decimal" enterkeyhint="next" min="-2" max="${maxMarks}" step="0.01" tabindex="${index + 1}"
                value="${value}" data-roll="${student.roll}" aria-label="Marks for ${escapeAttr(student.name)}">`}
        </td>`}
        <td><span class="status-pill ${locked ? "locked" : status.className}">${locked ? "Locked" : status.label}</span></td>
      </tr>
    `;
  }).join("");

  els.studentCount.textContent = students.length;
  els.enteredCount.textContent = entered;
  els.averageMarks.textContent = gradeSubject ? "Grade" : scored ? `${Math.round((total / (scored * maxMarks)) * 100)}%` : "0%";
  els.highestMarks.textContent = gradeSubject ? "-" : scored ? `${highest}/${maxMarks}` : "0";
  els.lowestMarks.textContent = gradeSubject ? "-" : scored ? `${lowest}/${maxMarks}` : "0";
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

function isAttendanceEntryInput(input) {
  return input instanceof HTMLInputElement
    && Boolean(input.closest("#attendanceView.active"))
    && (input.dataset.attendanceRoll !== undefined
      || input.dataset.heightRoll !== undefined
      || input.dataset.weightRoll !== undefined);
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
  if (numericValue === -1 || numericValue === -2) {
    delete input.dataset.warnedLimit;
    clearContextMessage(input);
    input.value = String(numericValue);
    return numericValue;
  }
  if (numericValue < 0) {
    if (showWarning) showContextMessage(input, "Use -1 for Absent or -2 for Not yet enrolled.", { type: "error" });
    input.value = "";
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
      value: project === "" || isEntryStatusValue(project) ? project : Number(project) + attendanceMarks
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
    const value = input.value.trim().toUpperCase().slice(0, 2);
    if (value === "-" && !showWarning) {
      input.value = value;
      return;
    }
    if (value && !["A", "B", "C", "D", "E", "-1", "-2"].includes(value)) {
      if (showWarning) showContextMessage(input, "Enter grade A-E, -1 for Absent, or -2 for Not yet enrolled.", { type: "error" });
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

  if (currentNumber < 0 && currentNumber !== -1 && currentNumber !== -2) {
    input.value = "";
    if (partKey === "partA") partA = "";
    if (partKey === "partB") partB = "";
    if (showWarning) showContextMessage(input, "Use -1 for Absent or -2 for Not yet enrolled.", { type: "error" });
    return;
  }

  if (currentValue !== "" && !isEntryStatusValue(currentValue) && !isEntryStatusValue(otherValue)
    && currentNumber + otherNumber > limit) {
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
  const combinedValue = isNotEnrolledEntry(partA) && isNotEnrolledEntry(partB)
    ? -2
    : isAbsentEntry(partA) || isAbsentEntry(partB)
      ? -1
      : hasPartMarks ? roundMarkTotal(numericMark(partA) + numericMark(partB)) : "";
  setStudentMark(input.dataset.partRoll, {
    partA,
    partB,
    value: combinedValue
  }, { save: false, fieldKey: partKey });
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
  const status = getEntryStatus(value, passMarks, { gradeSubject, noPassMark });
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
    if (!gradeSubject && isScoredEntry(value) && !Number.isNaN(numericValue)) {
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
        <td><input class="mark-input" type="number" inputmode="numeric" enterkeyhint="next" min="-2" max="${workingDays}" step="1" tabindex="${index + 1}" ${locked ? "disabled" : ""}
          value="${attendance}" data-attendance-roll="${student.roll}" aria-label="Attendance for ${escapeAttr(student.name)}"></td>
        <td><strong class="attendance-mark-output">${attendanceMarks}</strong></td>
        <td><input class="mark-input" type="number" inputmode="decimal" enterkeyhint="next" min="-2" step="0.1" tabindex="${students.length + index + 1}" ${locked ? "disabled" : ""}
          value="${measurement.height}" data-height-roll="${student.roll}" aria-label="Height for ${escapeAttr(student.name)}"></td>
        <td><input class="mark-input" type="number" inputmode="decimal" enterkeyhint="next" min="-2" step="0.1" tabindex="${(students.length * 2) + index + 1}" ${locked ? "disabled" : ""}
          value="${measurement.weight}" data-weight-roll="${student.roll}" aria-label="Weight for ${escapeAttr(student.name)}"></td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll("[data-attendance-roll]").forEach((input) => {
    input.addEventListener("input", () => saveAttendanceInputInPlace(input, { className, term }));
    input.addEventListener("change", () => saveAttendanceInputInPlace(input, { className, term, showWarning: true }));
  });

  document.querySelectorAll("[data-height-roll]").forEach((input) => {
    input.addEventListener("input", () => saveMeasurementInputInPlace(input, { className, term, section: "height" }));
    input.addEventListener("change", () => saveMeasurementInputInPlace(input, { className, term, section: "height", showWarning: true }));
  });

  document.querySelectorAll("[data-weight-roll]").forEach((input) => {
    input.addEventListener("input", () => saveMeasurementInputInPlace(input, { className, term, section: "weight" }));
    input.addEventListener("change", () => saveMeasurementInputInPlace(input, { className, term, section: "weight", showWarning: true }));
  });

  refreshAttendanceSaveControls();
  applyAttendanceEntryAccessState();
}

function saveAttendanceInputInPlace(input, options = {}) {
  const { className = selectedAttendanceClass(), term = selectedAttendanceTerm(), showWarning = false } = options;
  const rawValue = input.value.trim();
  const number = Number(rawValue);
  let value = rawValue;

  if (rawValue === "") {
    clearContextMessage(input);
    value = "";
  } else if (!Number.isFinite(number)) {
    if (showWarning) showContextMessage(input, "Enter a valid attendance value.", { type: "error", duration: 4500 });
    return;
  } else if (number === -1 || number === -2) {
    clearContextMessage(input);
    value = number;
  } else if (number < 0) {
    if (showWarning) showContextMessage(input, "Use -1 for Absent or -2 for Not yet enrolled.", { type: "error", duration: 4500 });
    input.value = "";
    value = "";
  } else {
    clearContextMessage(input);
    value = clamp(number, 0, getWorkingDays(term));
    if (showWarning) input.value = value;
  }

  setStudentAttendance(input.dataset.attendanceRoll, value, className, term, { save: false });
  const row = input.closest("tr");
  const attendanceMarkOutput = row?.querySelector(".attendance-mark-output");
  if (attendanceMarkOutput) {
    attendanceMarkOutput.textContent = getAttendanceMarks(value, getWorkingDays(term), className);
  }
}

function saveMeasurementInputInPlace(input, options = {}) {
  const {
    className = selectedAttendanceClass(),
    term = selectedAttendanceTerm(),
    section = input.dataset.heightRoll !== undefined ? "height" : "weight",
    showWarning = false
  } = options;
  const roll = section === "height" ? input.dataset.heightRoll : input.dataset.weightRoll;
  const rawValue = input.value.trim();
  const number = Number(rawValue);

  if (rawValue !== "" && !Number.isFinite(number)) {
    if (showWarning) showContextMessage(input, `Enter a valid ${section} value.`, { type: "error", duration: 4500 });
    return;
  }
  if (rawValue !== "" && number < 0 && number !== -1 && number !== -2) {
    if (showWarning) showContextMessage(input, "Use -1 for Absent or -2 for Not yet enrolled.", { type: "error", duration: 4500 });
    input.value = "";
    setStudentMeasurement(roll, { [section]: "" }, className, term, { save: false });
    return;
  }
  if (section === "height" && showWarning) {
    const previousTerm = getPreviousTerm(term);
    const previousHeight = previousTerm
      ? getStudentMeasurement({ roll }, className, previousTerm).height
      : "";
    if (isScoredEntry(rawValue) && isScoredEntry(previousHeight) && number < Number(previousHeight)) {
      showContextMessage(input, `Height cannot be less than the ${previousTerm} height (${previousHeight} cm).`, {
        type: "error",
        duration: 4500
      });
      input.value = getStudentMeasurement({ roll }, className, term).height;
      return;
    }
  }

  clearContextMessage(input);
  setStudentMeasurement(roll, { [section]: rawValue }, className, term, { save: false });
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
  ["attendance", "height", "weight"].forEach(trackUnsavedAttendanceChange);
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
  els.resultsTable.classList.toggle("class-one-two-term-results", isClassOneTwoTermResult());
  els.resultsTable.classList.toggle("early-years-results", ["LKG", "UKG"].includes(selectedClass()));
  els.resultsTable.style.width = "";
  els.resultsTable.style.removeProperty("--student-name-width");
  els.resultsTable.style.setProperty("--student-name-width", `${getStudentNameColumnWidth(students)}px`);
  els.resultsTable.style.setProperty("--mobile-student-name-width", `${getMobileStudentNameColumnWidth(students)}px`);
  els.printResultsTitle.textContent = `${selectedClass()} ${selectedExam()} Result : ${formatAcademicSession(state.academicSession)}`;

  els.resultNotice.textContent = published
    ? `${selectedClass()} ${selectedExam()} is published.`
    : isAdmin()
      ? `${selectedClass()} ${selectedExam()} is in admin preview. Publish when ready for other users.`
      : isPrincipalUser()
        ? `${selectedClass()} ${selectedExam()} is in principal preview. It is not published for teachers yet.`
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
    const numbers = markValues.filter(isScoredEntry).map(Number).filter((value) => !Number.isNaN(value));
    const total = Math.round(numbers.reduce((sum, value) => sum + value, 0));
    const maximumTotal = marksMaximum(subjectsForMarks);
    const percent = roundUpPercentage(total, maximumTotal);
    const notEnrolled = subjectValues.length > 0 && subjectValues.every(isNotEnrolledEntry);
    const appeared = !notEnrolled && subjectValues.some(isScoredEntry);
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
      appeared,
      notEnrolled
    };
  });

  els.resultsBody.innerHTML = records.filter((record) => !record.notEnrolled).map((record) => {
    return `
      <tr data-not-enrolled="${record.notEnrolled ? "true" : "false"}">
        <td>${record.student.roll}</td>
        <td>${escapeHtml(record.student.name)}</td>
        ${record.subjectValues.map((value, index) => formatResultMark(subjects[index], value, passMarks)).join("")}
        ${term
          ? `<td class="result-attendance-value">${formatResultAuxiliaryEntry(
            record.attendance,
            isScoredEntry(record.attendance) ? `${record.attendance}/${workingDays}` : "-"
          )}</td>`
          : ""}
        ${showMeasurements
          ? `<td class="result-height-value">${formatResultAuxiliaryEntry(record.measurement.height)}</td>
            <td class="result-weight-value">${formatResultAuxiliaryEntry(record.measurement.weight)}</td>`
          : ""}
        <td class="result-total-value">${record.notEnrolled ? "NE" : `${record.total}/${record.maximumTotal}`}</td>
        <td class="result-percentage-value">${record.notEnrolled ? "-" : `${record.percent}%`}</td>
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

function isClassOneTwoTermResult(className = selectedClass(), exam = selectedExam()) {
  return ["Class I", "Class II"].includes(className) && termExams.includes(exam);
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
    const enrollmentValues = subjects.map((subject) => getStudentMark(student, subject).value);
    const notEnrolled = enrollmentValues.length > 0 && enrollmentValues.every(isNotEnrolledEntry);
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
    const appeared = !notEnrolled && enrollmentValues.some(isScoredEntry);
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
      notEnrolled,
      attendance: getStudentAttendance(student)
    };
  });

  els.resultsBody.innerHTML = records.filter((record) => !record.notEnrolled).map((record) => `
    <tr data-not-enrolled="${record.notEnrolled ? "true" : "false"}">
      <td>${record.student.roll}</td>
      <td>${escapeHtml(record.student.name)}</td>
      ${record.subjectResults.map((subjectResult) => {
        return `<td class="subject-start">${formatComponentMark(subjectResult.activities, highThirdTermSheet ? 7 : null)}</td>
          ${highThirdTermSheet ? "" : `<td>${formatComponentMark(subjectResult.unitTest)}</td>`}
          <td>${formatComponentMark(subjectResult.exam, highThirdTermSheet ? 26 : null)}</td>
          ${formatStructuredTotal(subjectResult.total, highThirdTermSheet ? 33 : 50)}`;
      }).join("")}
      ${record.standaloneResults.map((subjectResult) => formatStructuredStandalone(subjectResult)).join("")}
      <td>${formatResultAuxiliaryEntry(
        record.attendance,
        isScoredEntry(record.attendance) ? `${record.attendance}/${workingDays}` : "-"
      )}</td>
      <td><strong>${record.notEnrolled ? "NE" : `${record.total}/${record.maximumTotal}`}</strong></td>
      <td>${record.notEnrolled ? "-" : `${record.percentage}%`}</td>
      <td>${formatDivisionLabel(record.outcome.division)}</td>
      <td>${formatResultStatus(record.outcome.result)}</td>
    </tr>
  `).join("");

  renderResultSummary(records, students.length);
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
  const notEnrolledCount = records.filter((record) => record.notEnrolled).length;
  const eligibleRecords = records.filter((record) => !record.notEnrolled);
  const appearedRecords = eligibleRecords.filter((record) => record.appeared);
  const present = appearedRecords.length;
  const passCount = appearedRecords.filter((record) => record.outcome.result !== "Fail").length;
  const passSummary = calculateClassPassSummary(
    Math.max(0, Number(studentCount) - notEnrolledCount),
    present,
    passCount
  );
  const divisionCount = (division) => appearedRecords.filter((record) => record.outcome.division === division).length;

  els.resultSummary.innerHTML = `
    ${summaryItem("Total Students", passSummary.total)}
    ${notEnrolledCount ? summaryItem("Not Yet Enrolled", notEnrolledCount) : ""}
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
    const values = [firstTerm, secondTerm, exam];
    const hasMark = values.some((value) => value !== "");
    return {
      activities: firstTerm,
      unitTest: secondTerm,
      exam,
      hasMark,
      total: hasMark ? (isEntryStatusValue(sumEnteredMarks(values))
        ? sumEnteredMarks(values)
        : Math.round(sumEnteredMarks(values))) : ""
    };
  }

  const activities = getStudentMark(student, group.activities).value;
  const exam = getStudentMark(student, group.exam).value;
  const unitTest = getStructuredUnitTestMark(student, group.name);
  const hasMark = activities !== "" || unitTest !== "" || exam !== "";
  const totalValue = sumEnteredMarks([activities, unitTest, exam]);
  return {
    activities,
    unitTest,
    exam,
    hasMark,
    total: hasMark ? (isEntryStatusValue(totalValue) ? totalValue : Math.round(totalValue)) : ""
  };
}

function getStructuredUnitTestMark(student, subject) {
  const exams = selectedExam() === "First Term"
    ? ["FT Unit Test 1", "FT Unit Test 2"]
    : ["ST Unit Test 1", "ST Unit Test 2"];
  const values = exams.map((exam) => getStoredStudentMark(student, selectedClass(), exam, subject).value);
  return sumEnteredComponentMarks(values);
}

function getStoredStructuredTermTotal(student, subject, term) {
  const activities = getStoredStudentMark(student, selectedClass(), term, `${subject} (Activities)`).value;
  const exam = getStoredStudentMark(student, selectedClass(), term, `${subject} (Exam)`).value;
  const unitTests = term === "First Term"
    ? ["FT Unit Test 1", "FT Unit Test 2"]
    : ["ST Unit Test 1", "ST Unit Test 2"];
  const unitTestValues = unitTests.map((unitTest) => getStoredStudentMark(student, selectedClass(), unitTest, subject).value);
  const values = [activities, exam, ...unitTestValues];
  return sumEnteredMarks(values);
}

function weightedTermMark(value) {
  return weightedMark(value, 30);
}

function weightedMark(value, percentage) {
  if (isEntryStatusValue(value) || value === "") return value;
  return (Math.ceil(numericMark(value) * percentage) / 100).toFixed(2);
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
    if (entry && typeof entry === "object") {
      if (entry.notEnrolled || isNotEnrolledEntry(entry.value)) return false;
      return entry.failed;
    }
    return !isNotEnrolledEntry(entry) && (entry === "" || isAbsentEntry(entry) || numericMark(entry) < passMark);
  }).length;
  const gradeFailCount = gradeValues.filter((value) =>
    !isNotEnrolledEntry(value) && getGradeStatus(value).className !== "pass").length;
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
  const displayValue = escapeHtml(entryDisplayValue(value, "AB"));
  const failed = !isNotEnrolledEntry(value)
    && (value === "" || isAbsentEntry(value) || (passMark !== null && numericMark(value) < passMark));
  return failed ? `<span class="failed-mark">${displayValue}</span>` : displayValue;
}

function formatStructuredTotal(value, passMark = 50) {
  const displayValue = entryDisplayValue(value, "AB");
  const failed = !isNotEnrolledEntry(value) && (value === "" || isAbsentEntry(value) || numericMark(value) < passMark);
  return `<td class="subject-total subject-end">${failed
    ? `<span class="failed-mark">${escapeHtml(displayValue)}</span>`
    : escapeHtml(displayValue)}</td>`;
}

function formatStructuredStandalone(subjectResult) {
  const displayValue = entryDisplayValue(subjectResult.value, "AB");
  const failed = !isNotEnrolledEntry(subjectResult.value) && (subjectResult.value === ""
    || isAbsentEntry(subjectResult.value)
    || (subjectResult.countsForResult && numericMark(subjectResult.value) < 50));
  const isFailed = Boolean(failed);
  return `<td class="standalone-value">${isFailed
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
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function isAbsentEntry(value) {
  return String(value).trim() === "-1";
}

function isNotEnrolledEntry(value) {
  return String(value).trim() === "-2";
}

function isEntryStatusValue(value) {
  return isAbsentEntry(value) || isNotEnrolledEntry(value);
}

function isScoredEntry(value) {
  return value !== "" && value !== undefined && value !== null && !isEntryStatusValue(value);
}

function entryDisplayValue(value, blankValue = "-") {
  if (isAbsentEntry(value)) return "AB";
  if (isNotEnrolledEntry(value)) return "NE";
  return value === "" || value === undefined || value === null ? blankValue : value;
}

function getEntryStatus(value, passMarks, { gradeSubject = false, noPassMark = false } = {}) {
  if (gradeSubject) return getGradeStatus(value);
  if (!noPassMark) return getStatus(value, passMarks);
  if (isNotEnrolledEntry(value)) return { label: "Not yet enrolled", className: "not-enrolled" };
  if (isAbsentEntry(value)) return { label: "Absent", className: "absent" };
  return { label: value === "" ? "Pending" : "Entered", className: value === "" ? "" : "pass" };
}

function sumEntryValues(values) {
  if (!values.length || values.every((value) => value === "" || value === undefined || value === null)) return "";
  if (values.every(isNotEnrolledEntry)) return -2;
  if (values.some((value) => value === "" || value === undefined || value === null || isAbsentEntry(value))) return -1;
  const scoredValues = values.filter(isScoredEntry).map(Number).filter(Number.isFinite);
  return scoredValues.length ? scoredValues.reduce((sum, value) => sum + value, 0) : "";
}

function sumEnteredMarks(values) {
  if (!values.length) return "";
  const hasValue = values.some((value) => value !== "" && value !== undefined && value !== null);
  if (!hasValue) return "";
  if (values.every(isNotEnrolledEntry)) return -2;
  const scoredValues = values.filter(isScoredEntry).map(Number).filter(Number.isFinite);
  return scoredValues.length ? scoredValues.reduce((sum, value) => sum + value, 0) : 0;
}

function sumEnteredComponentMarks(values) {
  if (!values.length || values.every((value) => value === "" || value === undefined || value === null)) return "";
  if (values.every(isNotEnrolledEntry)) return -2;
  const scoredValues = values.filter(isScoredEntry).map(Number).filter(Number.isFinite);
  if (scoredValues.length) return scoredValues.reduce((sum, value) => sum + value, 0);
  return values.some(isAbsentEntry) ? -1 : "";
}

function studentExamEntryValues(student, className = selectedClass(), exam = selectedExam()) {
  return currentSubjects(className, exam).map((subject) =>
    getStoredStudentMark(student, className, exam, subject).value);
}

function isStudentNotEnrolledForExam(student, className = selectedClass(), exam = selectedExam()) {
  const values = studentExamEntryValues(student, className, exam);
  return values.length > 0 && values.every(isNotEnrolledEntry);
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

function clearMarksheetSearch() {
  if (!els.marksheetNameSearchInput?.value) return;
  els.marksheetNameSearchInput.value = "";
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

  if (!canViewMarksheet()) {
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
    const query = (els.marksheetNameSearchInput?.value || "").trim();
    const message = allStudents.length && query
      ? `No marksheets match "${escapeHtml(query)}" in ${escapeHtml(selectedClass())}. Clear the search to show all students.`
      : `No students loaded for ${escapeHtml(selectedClass())}. Please check the Students page and refresh after sync.`;
    els.marksheetBody.innerHTML = `
      <div class="table-wrap">
        <table>
          <tbody><tr><td>${message}</td></tr></tbody>
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
    const numbers = markValues.filter(isScoredEntry).map(Number).filter(Number.isFinite);
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
          <img class="marksheet-header-logo" src="./marksheet-header-logo.png" alt="Pinehill Adventist Academy logo">
          <h3>PINEHILL ADVENTIST ACADEMY</h3>
          <p class="marksheet-location">CHAMPHAI : MIZORAM</p>
          <p class="marksheet-session">${escapeHtml(selectedClass())} ${escapeHtml(selectedExam())} Marksheet : ${escapeHtml(state.academicSession)}</p>
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
          <span>Result: ${formatMarksheetResultText(outcome.result)}</span>
        </div>
        ${highThirdTermMarksheet ? renderMarksheetGradedSubjects(highThirdTermGrades) : ""}
        ${highClassGrades.length ? renderMarksheetGradedSubjects(highClassGrades) : ""}
        ${termSkillDevelopment.length ? renderMarksheetGradedSubjects(termSkillDevelopment, "term-skill-development") : ""}
        ${term
          ? `<div class="marksheet-measurements">
              ${studentDetail("Class Strength", allStudents.length)}
              ${studentDetail("Attendance", isScoredEntry(attendance) ? `${attendance}/${workingDays}` : entryDisplayValue(attendance, ""))}
              ${studentDetail("Height (in cm)", entryDisplayValue(measurement.height, ""))}
              ${studentDetail("Weight (in kg)", entryDisplayValue(measurement.weight, ""))}
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

function formatMarksheetResultText(result) {
  const text = String(result || "-");
  return text === "Fail"
    ? `<span class="marksheet-fail-text">${escapeHtml(text)}</span>`
    : escapeHtml(text);
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
  if (isNotEnrolledEntry(value)) return "";
  return escapeHtml(entryDisplayValue(value, "AB"));
}

function marksheetComponentValue(value) {
  if (isNotEnrolledEntry(value)) return "";
  return value === "" || isAbsentEntry(value) ? '<span class="failed-mark">AB</span>' : escapeHtml(value);
}

function marksheetTotalValue(value) {
  const displayValue = marksheetDisplayValue(value);
  return !isNotEnrolledEntry(value) && (value === "" || isAbsentEntry(value) || numericMark(value) < 50)
    ? `<span class="failed-mark">${displayValue}</span>` : displayValue;
}

function marksheetStandaloneValue(result) {
  const displayValue = marksheetDisplayValue(result.value);
  const failed = !isNotEnrolledEntry(result.value)
    && (result.value === "" || isAbsentEntry(result.value)
      || (result.countsForResult && numericMark(result.value) < 50));
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
  if (outcome.division === "Dist.") return "An outstanding academic performance.";
  if (outcome.division === "I") return "An excellent academic performance.";
  if (outcome.division === "II") return "A commendable academic performance.";
  if (outcome.division === "III") return "A satisfactory academic performance.";
  return "-";
}

function formatResultMark(subject, value, passMarks) {
  const displayValue = entryDisplayValue(value, "AB");
  const subjectPassMarks = getSubjectPassMarks(selectedClass(), selectedExam(), subject);
  const failed = !isNotEnrolledEntry(value) && (isGradeSubject(subject)
    ? getGradeStatus(value).className !== "pass"
    : !isNoPassMarkSubject(selectedClass(), selectedExam(), subject)
      && getStatus(value, subjectPassMarks).className !== "pass");
  return `<td class="result-subject-mark">${failed
    ? `<span class="failed-mark">${escapeHtml(displayValue)}</span>`
    : escapeHtml(displayValue)}</td>`;
}

function formatResultAuxiliaryEntry(value, displayValue = entryDisplayValue(value)) {
  if (isNotEnrolledEntry(value)) return "-";
  if (isAbsentEntry(value)) return '<span class="failed-mark">AB</span>';
  return escapeHtml(displayValue);
}

function initializeAnalysisFilters(savedFilters = null) {
  if (!els.analysisSessionSelect) return;
  syncActiveSessionData();
  const previousSession = savedFilters?.analysisSession || els.analysisSessionSelect.value || state.academicSession;
  const sessions = [...new Set([state.academicSession, ...Object.keys(state.sessions || {})])].sort();
  populateSelect(els.analysisSessionSelect, sessions);
  setSelectValueIfAvailable(els.analysisSessionSelect, previousSession);

  const savedSectionAliases = {
    Elementary: "Elementary Stage",
    "High School": "Secondary Stage"
  };
  const savedSection = savedFilters?.analysisSection || els.analysisSectionSelect.value || "All Classes";
  const previousSection = savedSectionAliases[savedSection] || savedSection;
  populateSelect(els.analysisSectionSelect, Object.keys(analysisSectionClasses));
  setSelectValueIfAvailable(els.analysisSectionSelect, previousSection);

  const previousClass = savedFilters?.analysisClass || els.analysisClassSelect.value || "All Classes";
  updateAnalysisClassOptions(previousClass);
  updateAnalysisExamOptions();
  setSelectValueIfAvailable(els.analysisExamSelect, savedFilters?.analysisExam);
  updateAnalysisSubjectOptions();
  setSelectValueIfAvailable(els.analysisSubjectSelect, savedFilters?.analysisSubject);
  if (savedFilters) {
    els.analysisProgressClassSelect.dataset.preferredValue = savedFilters.analysisProgressClass || "All Classes";
    els.analysisProgressFromExamSelect.dataset.preferredValue = savedFilters.analysisProgressFromExam || "";
    els.analysisProgressToExamSelect.dataset.preferredValue = savedFilters.analysisProgressToExam || "";
  }
  updateAnalysisProgressClassOptions();
  updateAnalysisProgressExamOptions();
  updatePerformanceChangeFilters(savedFilters);
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

function updateAnalysisProgressClassOptions() {
  if (!els.analysisProgressClassSelect) return;
  const classes = selectedAnalysisClasses();
  const preferred = els.analysisProgressClassSelect.value
    || els.analysisProgressClassSelect.dataset.preferredValue
    || "All Classes";
  populateSelect(els.analysisProgressClassSelect, ["All Classes", ...classes]);
  setSelectValueIfAvailable(els.analysisProgressClassSelect, preferred);
  delete els.analysisProgressClassSelect.dataset.preferredValue;
}

function selectedAnalysisProgressClasses() {
  const className = els.analysisProgressClassSelect?.value || "All Classes";
  return className === "All Classes" ? selectedAnalysisClasses() : [className];
}

function updateAnalysisProgressExamOptions() {
  if (!els.analysisProgressFromExamSelect || !els.analysisProgressToExamSelect) return;
  const availableExams = new Set(selectedAnalysisProgressClasses().flatMap((className) => currentExams(className)));
  const exams = examNames.filter((exam) => availableExams.has(exam));
  const preferredFrom = els.analysisProgressFromExamSelect.value
    || els.analysisProgressFromExamSelect.dataset.preferredValue
    || exams[0]
    || "";
  populateSelect(els.analysisProgressFromExamSelect, exams);
  setSelectValueIfAvailable(els.analysisProgressFromExamSelect, preferredFrom);

  const fromExam = els.analysisProgressFromExamSelect.value;
  const comparableExams = exams.filter((exam) =>
    exam !== fromExam && analysisComparableExamGroup(exam) === analysisComparableExamGroup(fromExam));
  const preferredTo = els.analysisProgressToExamSelect.value
    || els.analysisProgressToExamSelect.dataset.preferredValue
    || comparableExams[0]
    || "";
  populateSelect(els.analysisProgressToExamSelect, comparableExams);
  setSelectValueIfAvailable(els.analysisProgressToExamSelect, preferredTo);
  delete els.analysisProgressFromExamSelect.dataset.preferredValue;
  delete els.analysisProgressToExamSelect.dataset.preferredValue;
}

function analysisComparableExamGroup(exam) {
  if (["FT Unit Test 1", "FT Unit Test 2"].includes(exam)) return "ft-unit-test";
  if (["ST Unit Test 1", "ST Unit Test 2"].includes(exam)) return "st-unit-test";
  if (["First Term", "Second Term", "Third Term"].includes(exam)) return "term";
  if (["CT1", "CT2", "CT3", "CT4"].includes(exam)) return "ct";
  return exam;
}

function updatePerformanceChangeFilters(savedFilters = null) {
  if (!els.performanceChangeSessionSelect) return;
  syncActiveSessionData();
  const sessions = [...new Set([state.academicSession, ...Object.keys(state.sessions || {})])].sort();
  const session = savedFilters?.performanceChangeSession
    || els.performanceChangeSessionSelect.value
    || els.analysisSessionSelect?.value
    || state.academicSession;
  populateSelect(els.performanceChangeSessionSelect, sessions);
  setSelectValueIfAvailable(els.performanceChangeSessionSelect, session);

  const availableClasses = selectedAnalysisClasses();
  const className = savedFilters?.performanceChangeClass
    || els.performanceChangeClassSelect.value
    || els.analysisProgressClassSelect?.value
    || "All Classes";
  populateSelect(els.performanceChangeClassSelect, ["All Classes", ...availableClasses]);
  setSelectValueIfAvailable(els.performanceChangeClassSelect, className);

  const classes = els.performanceChangeClassSelect.value === "All Classes"
    ? availableClasses
    : [els.performanceChangeClassSelect.value];
  const exams = examNames.filter((exam) => classes.some((name) => currentExams(name).includes(exam)));
  const fromExam = savedFilters?.performanceChangeFromExam
    || els.performanceChangeFromExamSelect.value
    || els.analysisProgressFromExamSelect?.value
    || exams[0]
    || "";
  const toExam = savedFilters?.performanceChangeToExam
    || els.performanceChangeToExamSelect.value
    || els.analysisProgressToExamSelect?.value
    || exams[1]
    || exams[0]
    || "";
  populateSelect(els.performanceChangeFromExamSelect, exams);
  populateSelect(els.performanceChangeToExamSelect, exams);
  setSelectValueIfAvailable(els.performanceChangeFromExamSelect, fromExam);
  setSelectValueIfAvailable(els.performanceChangeToExamSelect, toExam);
  if (exams.length > 1 && els.performanceChangeFromExamSelect.value === els.performanceChangeToExamSelect.value) {
    els.performanceChangeToExamSelect.value = exams.find((exam) =>
      exam !== els.performanceChangeFromExamSelect.value) || exams[1];
  }

  const firstExam = els.performanceChangeFromExamSelect.value;
  const comparisonExam = els.performanceChangeToExamSelect.value;
  const subjects = [...new Set(classes.flatMap((name) => {
    const firstSubjects = new Set(analysisSubjectNames(name, firstExam));
    return analysisSubjectNames(name, comparisonExam).filter((subject) => firstSubjects.has(subject));
  }))].sort((a, b) => a.localeCompare(b));
  const subject = savedFilters?.performanceChangeSubject
    || els.performanceChangeSubjectSelect.value
    || "All Subjects";
  populateSelect(els.performanceChangeSubjectSelect, ["All Subjects", ...subjects]);
  setSelectValueIfAvailable(els.performanceChangeSubjectSelect, subject);

  const students = runWithAnalysisSession(els.performanceChangeSessionSelect.value, () =>
    classes.flatMap((name) => (state.classes[name] || []).map((student) => ({
      value: encodeURIComponent(`${name}\u0000${student.roll}`),
      label: `${student.name} (${name})`
    }))).sort((a, b) => a.label.localeCompare(b.label)));
  const student = savedFilters?.performanceChangeStudent
    || els.performanceChangeStudentSelect.value
    || "All Students";
  els.performanceChangeStudentSelect.innerHTML = [
    '<option value="All Students">All Students</option>',
    ...students.map((item) => `<option value="${escapeAttr(item.value)}">${escapeHtml(item.label)}</option>`)
  ].join("");
  setSelectValueIfAvailable(els.performanceChangeStudentSelect, student);
  setSelectValueIfAvailable(
    els.performanceChangeSortSelect,
    savedFilters?.performanceChangeSort || els.performanceChangeSortSelect.value || "improvement"
  );
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

function teacherAssessmentSubjectNames(className) {
  if (!classNames.includes(className)) return [];
  return [...new Set(currentExams(className).flatMap((exam) =>
    currentSubjects(className, exam).map((subject) =>
      String(subject).replace(/\s+\((Activities|Exam|Assignment)\)$/, ""))))];
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
      const splitMark = isHighThirdTermResult() && highSplitPartSubjects.includes(group.name)
        ? getStoredStudentMark(student, selectedClass(), selectedExam(), `${group.name} (Exam)`)
        : null;
      return {
        name: group.name,
        value: result.hasMark ? numericMark(result.total) : "",
        maximum: 100,
        passMark,
        present: result.hasMark,
        passed: result.hasMark && numericMark(result.total) >= passMark,
        enrolled: !isNotEnrolledEntry(result.total),
        partA: splitMark?.partA ?? "",
        partB: splitMark?.partB ?? "",
        partMaximum: splitMark ? 40 : 0,
        partPassMark: splitMark ? 13 : 0
      };
    });
    const standalone = resultRecord.standaloneResults
      .filter((result) => !result.graded)
      .map((result) => ({
        name: result.subject,
        value: result.value,
        maximum: result.maxMarks,
        passMark: result.countsForResult ? 50 : 0,
        present: isScoredEntry(result.value),
        passed: isScoredEntry(result.value) && (!result.countsForResult || numericMark(result.value) >= 50),
        enrolled: !isNotEnrolledEntry(result.value)
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
        present: isScoredEntry(mark.value),
        passed: isScoredEntry(mark.value) && (noPassMark || numericMark(mark.value) >= passMark),
        enrolled: !isNotEnrolledEntry(mark.value),
        partA: mark.partA ?? "",
        partB: mark.partB ?? "",
        partMaximum: isSplitPartSubject(subject, selectedClass()) ? maximum / 2 : 0,
        partPassMark: isSplitPartSubject(subject, selectedClass()) ? passMark / 2 : 0
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
          if (resultRecord.notEnrolled) return;
          const percentage = resultRecord.appeared ? Number(resultRecord.percentage) || 0 : 0;
          const attendance = getStudentAttendance(student, className, exam);
          const subjects = analysisSubjectEntries(student, resultRecord);
          records.push({
            roll: student.roll,
            name: student.name,
            className,
            exam,
            appeared: resultRecord.appeared,
            total: resultRecord.total,
            maximumTotal: resultRecord.maximumTotal,
            percentage,
            result: resultRecord.outcome.result,
            division: resultRecord.outcome.division,
            attendance,
            workingDays,
            examAppearances: resultRecord.appeared ? 1 : 0,
            examOpportunities: 1,
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
      examAppearances: studentRecords.reduce((sum, record) => sum + (Number(record.examAppearances) || 0), 0),
      examOpportunities: studentRecords.reduce((sum, record) => sum + (Number(record.examOpportunities) || 0), 0),
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
  if (!subject || subject.enrolled === false) {
    return { ...record, excluded: true, appeared: false, percentage: 0, result: "-", division: "-", failedSubjects: [] };
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
      if (subject.enrolled === false) return;
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

function analysisPieChart(items, ariaLabel) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let cursor = 0;
  const segments = items.map((item) => {
    const start = total ? (cursor / total) * 360 : 0;
    cursor += item.value;
    const end = total ? (cursor / total) * 360 : 0;
    return `${item.color} ${start}deg ${end}deg`;
  });
  return `<div class="analysis-pie-layout">
    <div class="analysis-pie" role="img" aria-label="${escapeHtml(ariaLabel)}" style="background:conic-gradient(${segments.join(",") || "#d9e1e8 0deg 360deg"})"></div>
    <div class="analysis-legend">${items.map((item) => `<span><i style="background:${item.color}"></i>${escapeHtml(item.label)} <strong>${item.value}</strong></span>`).join("")}</div>
  </div>`;
}

function analysisLineChart(items) {
  if (!items.length) return '<p class="analysis-empty">No trend data available.</p>';
  const width = Math.max(420, ((items.length - 1) * 92) + 130);
  const height = 250;
  const padLeft = 48;
  const padRight = 28;
  const padTop = 30;
  const padBottom = 42;
  const plotBottom = height - padBottom;
  const plotHeight = plotBottom - padTop;
  const step = items.length > 1 ? (width - padLeft - padRight) / (items.length - 1) : 0;
  const yPosition = (value) => plotBottom - ((Math.max(0, Math.min(100, value)) / 100) * plotHeight);
  const points = items.map((item, index) => {
    const x = items.length > 1 ? padLeft + (index * step) : width / 2;
    const y = yPosition(item.average);
    return { ...item, x, y };
  });
  const guideValues = [0, 25, 50, 75, 100];
  const areaPoints = points.length
    ? `${points[0].x},${plotBottom} ${points.map((point) => `${point.x},${point.y}`).join(" ")} ${points[points.length - 1].x},${plotBottom}`
    : "";
  const areaGradientId = `analysisTrendArea${Math.random().toString(36).slice(2, 8)}`;
  const trendSegmentClass = (start, end) => {
    const change = end.average - start.average;
    if (Math.abs(change) < 0.005) return "is-flat";
    return change > 0 ? "is-progress" : "is-decline";
  };
  const trendSegments = points.slice(1).map((point, index) => {
    const previous = points[index];
    const change = point.average - previous.average;
    const changeText = `${change >= 0 ? "+" : ""}${change.toFixed(2)} percentage points`;
    return { previous, point, className: trendSegmentClass(previous, point), changeText };
  });
  return `<div class="analysis-line-chart"><svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Average percentage result trend">
    <defs>
      <linearGradient id="${areaGradientId}" x1="0" y1="${padTop}" x2="0" y2="${plotBottom}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#6f8cff" stop-opacity="0.30"/>
        <stop offset="100%" stop-color="#23d3d0" stop-opacity="0.04"/>
      </linearGradient>
    </defs>
    <g class="chart-grid">${guideValues.map((value) => {
      const y = yPosition(value);
      return `<line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" class="chart-grid-line"/>
        <text x="${padLeft - 9}" y="${y + 3}" class="chart-y-label">${value}%</text>`;
    }).join("")}</g>
    <line x1="${padLeft}" y1="${plotBottom}" x2="${width - padRight}" y2="${plotBottom}" class="chart-axis"/>
    <polygon points="${areaPoints}" class="chart-area" style="fill:url(#${areaGradientId})"/>
    ${trendSegments.map((segment) => `<g class="chart-trend-segment ${segment.className}">
      <title>${escapeHtml(segment.previous.label)} to ${escapeHtml(segment.point.label)}: ${segment.changeText}</title>
      <line x1="${segment.previous.x}" y1="${segment.previous.y}" x2="${segment.point.x}" y2="${segment.point.y}" class="chart-line chart-line-glow"/>
      <line x1="${segment.previous.x}" y1="${segment.previous.y}" x2="${segment.point.x}" y2="${segment.point.y}" class="chart-line"/>
    </g>`).join("")}
    ${points.map((point) => `<g class="chart-data-point">
      <title>${escapeHtml(point.label)}: ${point.average.toFixed(2)}%</title>
      <circle cx="${point.x}" cy="${point.y}" r="5" class="chart-point"/>
      <rect x="${point.x - 24}" y="${point.y - 27}" width="48" height="17" rx="4" class="chart-value-bg"/>
      <text x="${point.x}" y="${point.y - 15}" class="chart-value">${point.average.toFixed(1)}%</text>
      <line x1="${point.x}" y1="${plotBottom}" x2="${point.x}" y2="${plotBottom + 5}" class="chart-tick"/>
      <text x="${point.x}" y="${height - 12}" class="chart-label">${escapeHtml(point.label)}</text>
    </g>`).join("")}
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
      .filter((record) => !record.excluded)
      .filter((record) => status === "all"
        || (status === "present" && record.appeared)
        || (status === "absent" && !record.appeared))
      .filter((record) => record.appeared);
    return { label: exam.replace(" Unit Test ", " UT "), average: average(records.map((record) => record.percentage)) };
  }).filter((item) => item.average > 0);
}

function buildAnalysisStudentProgress(session, classes, subjectFilter, status, threshold, fromExam, toExam) {
  if (!fromExam || !toExam || fromExam === toExam) return [];
  const eligibleClasses = classes.filter((className) =>
    currentExams(className).includes(fromExam) && currentExams(className).includes(toExam));
  if (!eligibleClasses.length) return [];

  const grouped = new Map();
  const comparisonData = [fromExam, toExam].map((exam) => ({
    exam,
    records: buildAcademicAnalysisRecords(session, eligibleClasses, exam)
      .filter((record) => subjectFilter === "All Subjects"
        || record.subjects.some((subject) => subject.name === subjectFilter))
      .map((record) => filteredAnalysisRecord(record, subjectFilter))
      .filter((record) => !record.excluded)
  }));
  if (comparisonData.some((item) => !item.records.some((record) => record.appeared))) return [];

  comparisonData.forEach(({ records }) => {
    records.forEach((record) => {
      const key = `${record.className}\u0000${record.roll}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(record);
    });
  });

  return [...grouped.values()].map((attempts) => {
    const firstRecord = attempts[0];
    const appeared = attempts.filter((record) => record.appeared);
    const first = appeared[0] || null;
    const latest = appeared[appeared.length - 1] || null;
    const delta = first && latest && appeared.length > 1 ? latest.percentage - first.percentage : 0;
    const markDelta = first && latest && appeared.length > 1
      ? (delta / 100) * (Number(latest.maximumTotal) || 0)
      : 0;
    const subjectChanges = first && latest && appeared.length > 1
      ? analysisSubjectMarkChanges(first, latest)
      : [];
    const missedExams = attempts.length - appeared.length;
    const failedExams = appeared.filter((record) => record.result === "Fail").length;
    const weakSubjects = [...new Set(attempts.flatMap((record) => record.failedSubjects || []))];
    const trend = appeared.length < 2 ? "Insufficient Data" : delta >= 5 ? "Improving" : delta <= -5 ? "Declining" : "Stable";
    const riskReasons = [];
    let riskScore = 0;

    if (!appeared.length) {
      riskScore += 4;
      riskReasons.push("No examination result");
    }
    if (failedExams >= 2) {
      riskScore += 2;
      riskReasons.push("Repeated exam failure");
    } else if (failedExams === 1) {
      riskScore += 1;
      riskReasons.push("Failed one examination");
    }
    if (delta <= -10 && appeared.length > 1) {
      riskScore += 2;
      riskReasons.push("Sharp performance decline");
    } else if (delta <= -5 && appeared.length > 1) {
      riskScore += 1;
      riskReasons.push("Declining performance");
    }
    if (missedExams >= 1) {
      riskScore += 1;
      riskReasons.push(missedExams === 1 ? "Missed one examination" : "Missed both examinations");
    }
    if (weakSubjects.length >= 2) {
      riskScore += 1;
      riskReasons.push("Multiple weak subjects");
    }
    if (latest && latest.percentage < threshold) {
      riskScore += 1;
      riskReasons.push(`Below ${threshold}%`);
    }

    const riskLevel = riskScore >= 3 ? "High" : riskScore === 2 ? "Medium" : riskScore === 1 ? "Watch" : "Low";
    return {
      roll: firstRecord.roll,
      name: firstRecord.name,
      className: firstRecord.className,
      attempts,
      appearedCount: appeared.length,
      first,
      latest,
      delta,
      markDelta,
      subjectChanges,
      trend,
      missedExams,
      failedExams,
      weakSubjects,
      riskScore,
      riskLevel,
      riskReasons
    };
  }).filter((record) => status === "all"
    || (status === "present" && record.appearedCount > 0)
    || (status === "absent" && record.appearedCount === 0));
}

function analysisSubjectMarkChanges(firstRecord, latestRecord) {
  const firstSubjects = new Map((firstRecord.subjects || []).map((subject) => [subject.name, subject]));
  return (latestRecord.subjects || []).flatMap((latestSubject) => {
    const firstSubject = firstSubjects.get(latestSubject.name);
    if (!firstSubject?.present || !latestSubject.present || !firstSubject.maximum || !latestSubject.maximum) return [];
    const normalizedFirstMark = (numericMark(firstSubject.value) / firstSubject.maximum) * latestSubject.maximum;
    const change = numericMark(latestSubject.value) - normalizedFirstMark;
    if (Math.abs(change) <= 0.004) return [];
    return [{
      subject: latestSubject.name,
      abbreviation: analysisSubjectReasonAbbreviations[latestSubject.name]
        || analysisGrowthSubjectAbbreviation(latestSubject.name),
      change
    }];
  }).sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
}

function analysisGrowthSubjectAbbreviation(subject) {
  const abbreviations = {
    Alphabets: "A",
    Numbers: "N",
    Conversation: "C",
    Rhymes: "R",
    "A.E.": "AE",
    "Skill Development": "SD"
  };
  return abbreviations[subject]
    || String(subject).split(/\s+/).map((word) => word[0] || "").join("").toUpperCase();
}

function formatAnalysisMarkChange(value) {
  const rounded = Math.round((Number(value) || 0) * 100) / 100;
  const formatted = Number.isInteger(rounded) ? String(Math.abs(rounded)) : Math.abs(rounded).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  return `${rounded > 0 ? "+" : rounded < 0 ? "-" : ""}${formatted}`;
}

function roundedAnalysisMarkChange(value) {
  const numericValue = Number(value) || 0;
  return Math.sign(numericValue) * Math.round(Math.abs(numericValue));
}

function formatRoundedAnalysisMarkChange(value) {
  const rounded = roundedAnalysisMarkChange(value);
  return `${rounded > 0 ? "+" : ""}${rounded}`;
}

function formatAnalysisSubjectChanges(changes) {
  return changes.length
    ? changes.map((item) => `${item.abbreviation}${formatAnalysisMarkChange(item.change)}`).join(", ")
    : "-";
}

function formatAnalysisSubjectChangesHtml(changes) {
  if (!changes.length) return "-";
  return changes.map((item) => {
    const className = item.change > 0 ? "analysis-positive-value" : "analysis-negative-value";
    return `<span class="${className}">${escapeHtml(item.abbreviation)}${formatAnalysisMarkChange(item.change)}</span>`;
  }).join('<span class="analysis-subject-change-separator">, </span>');
}

function analysisTrendClass(trend) {
  if (trend === "Improving") return "is-improving";
  if (trend === "Declining") return "is-declining";
  if (trend === "Stable") return "is-stable";
  return "is-insufficient";
}

function analysisRiskClass(level) {
  if (level === "High") return "is-high";
  if (level === "Medium") return "is-medium";
  if (level === "Watch") return "is-watch";
  return "is-low";
}

function toggleAnalysisStudentList(button, list) {
  if (!button || !list) return;
  const willShow = list.classList.contains("hidden");
  list.classList.toggle("hidden", !willShow);
  button.textContent = willShow ? "Hide List" : "Show List";
  button.setAttribute("aria-expanded", String(willShow));
}

function performanceChangeDirection(value, threshold = performanceChangeTolerance) {
  if (value > threshold) return "Improved";
  if (value < -threshold) return "Declined";
  return "Stable";
}

function performanceChangeClassification(percentageChange, relativeChange) {
  if (!Number.isFinite(Number(percentageChange)) || !Number.isFinite(Number(relativeChange))) {
    return "Additional Support Recommended";
  }
  const percentageDirection = performanceChangeDirection(percentageChange);
  const relativeDirection = performanceChangeDirection(relativeChange);
  if (percentageDirection === "Improved" && relativeDirection !== "Declined") return "Progressing Well";
  if (percentageDirection === "Declined" && relativeDirection === "Declined") return "Additional Support Recommended";
  if (percentageDirection === "Declined" || relativeDirection === "Declined") return "Monitor Progress";
  return "Stable Performance";
}

function performanceSubjectComparisons(firstRecord, comparisonRecord) {
  const firstSubjects = new Map((firstRecord.subjects || []).map((subject) => [subject.name, subject]));
  return (comparisonRecord.subjects || []).flatMap((comparisonSubject) => {
    const firstSubject = firstSubjects.get(comparisonSubject.name);
    if (!firstSubject?.present || !comparisonSubject.present
      || !firstSubject.maximum || !comparisonSubject.maximum) return [];
    const firstPercentage = (numericMark(firstSubject.value) / firstSubject.maximum) * 100;
    const comparisonPercentage = (numericMark(comparisonSubject.value) / comparisonSubject.maximum) * 100;
    return [{
      subject: comparisonSubject.name,
      firstPercentage,
      comparisonPercentage,
      change: comparisonPercentage - firstPercentage,
      firstPassed: firstSubject.passed,
      comparisonPassed: comparisonSubject.passed,
      status: performanceSubjectChangeStatus(comparisonPercentage - firstPercentage, firstSubject.passed, comparisonSubject.passed)
    }];
  });
}

function performanceSubjectChangeStatus(change, firstPassed, comparisonPassed) {
  if (!firstPassed || !comparisonPassed) return "Additional Support Recommended";
  const direction = performanceChangeDirection(change);
  if (direction === "Improved") return "Progressing Well";
  if (direction === "Declined") return "Monitor Progress";
  return "Stable Performance";
}

function performanceChangeSubjectMetrics(records) {
  const grouped = new Map();
  records.forEach((record) => {
    record.subjectChanges.forEach((subject) => {
      if (!grouped.has(subject.subject)) grouped.set(subject.subject, []);
      grouped.get(subject.subject).push(subject);
    });
  });
  return [...grouped.entries()].map(([subject, entries]) => {
    const firstPassed = entries.filter((entry) => entry.firstPassed).length;
    const comparisonPassed = entries.filter((entry) => entry.comparisonPassed).length;
    const firstAverage = average(entries.map((entry) => entry.firstPercentage));
    const comparisonAverage = average(entries.map((entry) => entry.comparisonPercentage));
    const statusCount = (status) => entries.filter((entry) => entry.status === status).length;
    const highestImprovement = [...entries].sort((a, b) => b.change - a.change)[0];
    return {
      subject,
      firstAverage,
      comparisonAverage,
      averageChange: comparisonAverage - firstAverage,
      firstPassPercentage: entries.length ? (firstPassed / entries.length) * 100 : 0,
      comparisonPassPercentage: entries.length ? (comparisonPassed / entries.length) * 100 : 0,
      passPercentageChange: entries.length
        ? ((comparisonPassed - firstPassed) / entries.length) * 100
        : 0,
      progressing: statusCount("Progressing Well"),
      stable: statusCount("Stable Performance"),
      monitor: statusCount("Monitor Progress"),
      support: statusCount("Additional Support Recommended"),
      highestImprovement: highestImprovement ? highestImprovement.change : 0,
      attention: statusCount("Monitor Progress") + statusCount("Additional Support Recommended")
    };
  }).sort((a, b) => b.averageChange - a.averageChange);
}

function performanceChangeClassMetrics(records) {
  return [...new Set(records.map((record) => record.className))].map((className) => {
    const classRecords = records.filter((record) => record.className === className);
    const firstAverage = average(classRecords.map((record) => record.first.percentage));
    const comparisonAverage = average(classRecords.map((record) => record.comparison.percentage));
    const firstPassed = classRecords.filter((record) => record.first.result !== "Fail").length;
    const comparisonPassed = classRecords.filter((record) => record.comparison.result !== "Fail").length;
    const countStatus = (status) => classRecords.filter((record) => record.classification === status).length;
    return {
      className,
      students: classRecords.length,
      firstAverage,
      comparisonAverage,
      averageChange: comparisonAverage - firstAverage,
      firstPassPercentage: classRecords.length ? (firstPassed / classRecords.length) * 100 : 0,
      comparisonPassPercentage: classRecords.length ? (comparisonPassed / classRecords.length) * 100 : 0,
      passPercentageChange: classRecords.length
        ? ((comparisonPassed - firstPassed) / classRecords.length) * 100
        : 0,
      progressing: countStatus("Progressing Well"),
      stable: countStatus("Stable Performance"),
      monitor: countStatus("Monitor Progress"),
      support: countStatus("Additional Support Recommended")
    };
  });
}

function buildPerformanceChangeData(session, classes, fromExam, toExam, subjectFilter, studentFilter) {
  if (!fromExam || !toExam || fromExam === toExam) {
    return { records: [], subjectMetrics: [], classMetrics: [], missingWarnings: [] };
  }
  const eligibleClasses = classes.filter((className) =>
    currentExams(className).includes(fromExam) && currentExams(className).includes(toExam));
  if (!eligibleClasses.length) {
    return { records: [], subjectMetrics: [], classMetrics: [], missingWarnings: [] };
  }

  const prepare = (exam) => buildAcademicAnalysisRecords(session, eligibleClasses, exam)
    .map((record) => filteredAnalysisRecord(record, subjectFilter))
    .filter((record) => !record.excluded);
  const firstRecords = prepare(fromExam);
  const comparisonRecords = prepare(toExam);
  const firstMap = new Map(firstRecords.map((record) => [`${record.className}\u0000${record.roll}`, record]));
  const comparisonMap = new Map(comparisonRecords.map((record) => [`${record.className}\u0000${record.roll}`, record]));
  const keys = new Set([...firstMap.keys(), ...comparisonMap.keys()]);
  const classValues = new Map();

  eligibleClasses.forEach((className) => {
    classValues.set(`${className}\u0000first`, firstRecords
      .filter((record) => record.className === className && record.appeared)
      .map((record) => record.percentage));
    classValues.set(`${className}\u0000comparison`, comparisonRecords
      .filter((record) => record.className === className && record.appeared)
      .map((record) => record.percentage));
  });

  const missingWarnings = [];
  let records = [...keys].flatMap((key) => {
    const first = firstMap.get(key);
    const comparison = comparisonMap.get(key);
    const source = first || comparison;
    if (!first?.appeared || !comparison?.appeared) {
      if (source) {
        const missedExams = [];
        if (!first?.appeared) missedExams.push(fromExam);
        if (!comparison?.appeared) missedExams.push(toExam);
        missingWarnings.push({
          roll: source.roll,
          name: source.name,
          className: source.className,
          latest: comparison || first,
          delta: 0,
          appearedCount: Number(Boolean(first?.appeared)) + Number(Boolean(comparison?.appeared)),
          missedExams: missedExams.length,
          failedExams: 0,
          weakSubjects: comparison?.failedSubjects || first?.failedSubjects || [],
          riskScore: 2,
          riskLevel: "Medium",
          riskReasons: missedExams.map((exam) => `Absent from ${exam}`)
        });
      }
      return [];
    }
    const firstValues = classValues.get(`${first.className}\u0000first`) || [];
    const comparisonValues = classValues.get(`${first.className}\u0000comparison`) || [];
    const firstClassAverage = average(firstValues);
    const comparisonClassAverage = average(comparisonValues);
    const firstRelative = first.percentage - firstClassAverage;
    const comparisonRelative = comparison.percentage - comparisonClassAverage;
    const percentageChange = comparison.percentage - first.percentage;
    const relativeChange = comparisonRelative - firstRelative;
    const subjectChanges = performanceSubjectComparisons(first, comparison);
    const strongest = [...subjectChanges].sort((a, b) => b.change - a.change)[0] || null;
    const largestDecline = [...subjectChanges].sort((a, b) => a.change - b.change)[0] || null;
    const failedOrAbsent = first.result === "Fail" || comparison.result === "Fail"
      || !first.appeared || !comparison.appeared;
    const classification = failedOrAbsent
      ? "Additional Support Recommended"
      : performanceChangeClassification(percentageChange, relativeChange);
    return [{
      key,
      roll: first.roll,
      name: first.name,
      className: first.className,
      first,
      comparison,
      firstClassAverage,
      comparisonClassAverage,
      firstRelative,
      comparisonRelative,
      percentageChange,
      relativeChange,
      classification,
      subjectChanges,
      strongest,
      largestDecline
    }];
  });

  if (studentFilter && studentFilter !== "All Students") {
    records = records.filter((record) => encodeURIComponent(record.key) === studentFilter);
  }
  return {
    records,
    subjectMetrics: performanceChangeSubjectMetrics(records),
    classMetrics: performanceChangeClassMetrics(records),
    missingWarnings
  };
}

function buildRepeatedPerformanceDeclineWarnings(session, classes, subjectFilter) {
  const grouped = new Map();
  classes.forEach((className) => {
    examNames.filter((exam) => currentExams(className).includes(exam)).forEach((exam) => {
      buildAcademicAnalysisRecords(session, [className], exam)
        .map((record) => filteredAnalysisRecord(record, subjectFilter))
        .filter((record) => !record.excluded)
        .forEach((record) => {
          const key = `${record.className}\u0000${record.roll}`;
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key).push(record);
        });
    });
  });

  return [...grouped.values()].flatMap((records) => {
    let consecutiveDeclines = 0;
    let longestDecline = 0;
    const appeared = records.filter((record) => record.appeared);
    for (let index = 1; index < appeared.length; index += 1) {
      const change = appeared[index].percentage - appeared[index - 1].percentage;
      consecutiveDeclines = change < -performanceChangeTolerance ? consecutiveDeclines + 1 : 0;
      longestDecline = Math.max(longestDecline, consecutiveDeclines);
    }
    if (longestDecline < 2) return [];
    const first = records[0];
    const latest = appeared.at(-1) || records.at(-1);
    return [{
      roll: first.roll,
      name: first.name,
      className: first.className,
      latest,
      delta: appeared.length > 1 ? latest.percentage - appeared[0].percentage : 0,
      appearedCount: appeared.length,
      missedExams: records.length - appeared.length,
      failedExams: appeared.filter((record) => record.result === "Fail").length,
      weakSubjects: latest.failedSubjects || [],
      riskScore: 3,
      riskLevel: "High",
      riskReasons: [`Repeated decline across ${longestDecline + 1} consecutive examinations`]
    }];
  });
}

function performanceChangeClassName(classification) {
  if (classification === "Progressing Well") return "is-improving";
  if (classification === "Stable Performance") return "is-stable";
  if (classification === "Monitor Progress") return "is-medium";
  return "is-declining";
}

function signedAnalysisValue(value, suffix = " pp") {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return "-";
  const number = Number(value);
  return `${number > 0 ? "+" : ""}${number.toFixed(2)}${suffix}`;
}

function performanceGroupedBarChart(items, labelKey, firstKey, comparisonKey, firstLabel, comparisonLabel) {
  if (!items.length) return '<p class="analysis-empty">No comparison data.</p>';
  return `<div class="performance-grouped-chart">
    <div class="performance-chart-legend"><span><i class="is-first"></i>${escapeHtml(firstLabel)}</span><span><i class="is-comparison"></i>${escapeHtml(comparisonLabel)}</span></div>
    ${items.map((item) => `<div class="performance-grouped-row">
      <span>${escapeHtml(item[labelKey])}</span>
      <div><i class="is-first" style="width:${Math.max(0, Math.min(100, item[firstKey]))}%"></i><b>${Number(item[firstKey]).toFixed(1)}%</b></div>
      <div><i class="is-comparison" style="width:${Math.max(0, Math.min(100, item[comparisonKey]))}%"></i><b>${Number(item[comparisonKey]).toFixed(1)}%</b></div>
    </div>`).join("")}
  </div>`;
}

function performanceChangeHistogram(records) {
  const bands = [
    { label: "< -15", min: -Infinity, max: -15.001 },
    { label: "-15 to -6", min: -15, max: -5.001 },
    { label: "-5 to +5", min: -5, max: 5 },
    { label: "+6 to +15", min: 5.001, max: 15 },
    { label: "> +15", min: 15.001, max: Infinity }
  ];
  return analysisHistogram(bands.map((band) => ({
    label: band.label,
    value: records.filter((record) =>
      record.percentageChange >= band.min && record.percentageChange <= band.max).length
  })));
}

function performanceCountBarChart(items) {
  if (!items.length) return '<p class="analysis-empty">No comparison data.</p>';
  const max = Math.max(1, ...items.map((item) => item.value));
  return `<div class="analysis-bar-chart">${items.map((item) => `<div class="analysis-bar-row">
    <span>${escapeHtml(item.label)}</span>
    <div class="analysis-bar-track"><i style="width:${(item.value / max) * 100}%"></i></div>
    <strong>${item.value}</strong>
  </div>`).join("")}</div>`;
}

function performanceChangeInterpretation(record) {
  if (!record) return "";
  const first = record.first.percentage.toFixed(2);
  const comparison = record.comparison.percentage.toFixed(2);
  const firstAverage = record.firstClassAverage.toFixed(2);
  const comparisonAverage = record.comparisonClassAverage.toFixed(2);
  const firstRelative = signedAnalysisValue(record.firstRelative);
  const comparisonRelative = signedAnalysisValue(record.comparisonRelative);
  if (record.classification === "Progressing Well") {
    return `The student's percentage increased from ${first}% to ${comparison}%. Compared with the class average, the position changed from ${firstRelative} to ${comparisonRelative}, showing healthy progress.`;
  }
  if (record.classification === "Stable Performance") {
    return `The student's percentage changed from ${first}% to ${comparison}%, while the class average changed from ${firstAverage}% to ${comparisonAverage}%. Performance is broadly stable.`;
  }
  if (record.classification === "Monitor Progress") {
    return `The student's percentage changed from ${first}% to ${comparison}%. The difference from class average changed from ${firstRelative} to ${comparisonRelative}, so progress should be monitored.`;
  }
  return `The student's percentage changed from ${first}% to ${comparison}%. The result, absence, or class-average context indicates that additional academic support is recommended.`;
}

function performanceChangeStrengths(record) {
  const strengths = [];
  if (record.percentageChange > performanceChangeTolerance) strengths.push(`Overall percentage improved by ${record.percentageChange.toFixed(2)} percentage points.`);
  if (record.relativeChange > -performanceChangeTolerance) strengths.push("Performance stayed close to, or improved against, the class-average context.");
  if (record.strongest?.change > 0) strengths.push(`${record.strongest.subject} improved by ${record.strongest.change.toFixed(2)} percentage points.`);
  return strengths.length ? strengths : ["No clear strength is identified from this comparison yet."];
}

function performanceChangeSupportAreas(record) {
  const areas = [];
  if (record.percentageChange < -performanceChangeTolerance) areas.push(`Overall percentage declined by ${Math.abs(record.percentageChange).toFixed(2)} percentage points.`);
  if (record.relativeChange < -performanceChangeTolerance) areas.push(`Difference from class average declined by ${Math.abs(record.relativeChange).toFixed(2)} percentage points.`);
  if (record.comparison.result === "Fail") areas.push(`Result is Fail in ${record.comparison.exam}.`);
  if (record.largestDecline?.change < 0) areas.push(`${record.largestDecline.subject} declined by ${Math.abs(record.largestDecline.change).toFixed(2)} percentage points.`);
  return areas.length ? areas : ["No major support area is flagged by this comparison."];
}

function performanceChangeRecommendation(record) {
  if (record.classification === "Progressing Well") return "Continue the present learning support and provide enrichment where the student is improving strongly.";
  if (record.classification === "Stable Performance") return "Maintain regular practice and monitor the next examination for sustained progress.";
  if (record.classification === "Monitor Progress") return "Review the subject changes and give short, focused practice in areas where class-average context declined.";
  return "Provide targeted support, check attendance and subject gaps, and review progress again after the next assessment.";
}

function sortPerformanceChangeRecords(records, sortBy) {
  const sorted = [...records];
  const classificationOrder = [
    "Progressing Well", "Stable Performance", "Monitor Progress", "Additional Support Recommended"
  ];
  if (sortBy === "decline") return sorted.sort((a, b) => a.percentageChange - b.percentageChange);
  if (sortBy === "relative") return sorted.sort((a, b) => b.relativeChange - a.relativeChange);
  if (sortBy === "classification") return sorted.sort((a, b) =>
    classificationOrder.indexOf(a.classification) - classificationOrder.indexOf(b.classification));
  return sorted.sort((a, b) => b.percentageChange - a.percentageChange);
}

function renderPerformanceChangeStudentDetail(record, fromExam, toExam) {
  if (!els.performanceChangeStudentDetail || !record) return;
  els.performanceChangeStudentDetail.classList.remove("hidden");
  els.performanceChangeStudentDetail.innerHTML = `
    <div class="analysis-panel-head"><div><h4>${escapeHtml(record.name)}</h4><span>${escapeHtml(record.className)} | ${escapeHtml(fromExam)} to ${escapeHtml(toExam)}</span></div><button class="analysis-list-toggle" type="button" data-close-performance-detail>Close</button></div>
    <div class="performance-detail-metrics">
      <span>Percentage Change<strong>${signedAnalysisValue(record.percentageChange)}</strong></span>
      <span>Class Average Difference Change<strong>${signedAnalysisValue(record.relativeChange)}</strong></span>
      <span>${escapeHtml(fromExam)} Class Average<strong>${record.firstClassAverage.toFixed(2)}%</strong></span>
      <span>${escapeHtml(toExam)} Class Average<strong>${record.comparisonClassAverage.toFixed(2)}%</strong></span>
      <span>Status<strong>${escapeHtml(record.classification)}</strong></span>
    </div>
    <div class="performance-student-slope" aria-label="Individual student performance trend">
      <div><span>${escapeHtml(fromExam)}</span><i style="height:${Math.max(2, record.first.percentage)}%"></i><strong>${record.first.percentage.toFixed(2)}%</strong></div>
      <b aria-hidden="true">&#8594;</b>
      <div><span>${escapeHtml(toExam)}</span><i style="height:${Math.max(2, record.comparison.percentage)}%"></i><strong>${record.comparison.percentage.toFixed(2)}%</strong></div>
    </div>
    <div class="analysis-table-wrap"><table class="analysis-table"><thead><tr><th>Subject</th><th>${escapeHtml(fromExam)} %</th><th>${escapeHtml(toExam)} %</th><th>Change</th></tr></thead>
      <tbody>${record.subjectChanges.map((item) => `<tr><td>${escapeHtml(item.subject)}</td><td>${item.firstPercentage.toFixed(2)}%</td><td>${item.comparisonPercentage.toFixed(2)}%</td><td class="${item.change > 0 ? "analysis-positive-value" : item.change < 0 ? "analysis-negative-value" : ""}">${signedAnalysisValue(item.change)}</td></tr>`).join("") || '<tr><td colspan="4">No comparable subject data.</td></tr>'}</tbody>
    </table></div>
    <p><strong>Strongest improvement:</strong> ${record.strongest && record.strongest.change > 0 ? `${escapeHtml(record.strongest.subject)} (${signedAnalysisValue(record.strongest.change)})` : "None identified"}</p>
    <p><strong>Largest decline:</strong> ${record.largestDecline && record.largestDecline.change < 0 ? `${escapeHtml(record.largestDecline.subject)} (${signedAnalysisValue(record.largestDecline.change)})` : "None identified"}</p>
    <p><strong>Strengths:</strong> ${performanceChangeStrengths(record).map(escapeHtml).join(" ")}</p>
    <p><strong>Areas for support:</strong> ${performanceChangeSupportAreas(record).map(escapeHtml).join(" ")}</p>
    <p><strong>Recommendation:</strong> ${escapeHtml(performanceChangeRecommendation(record))}</p>
    <p>${escapeHtml(performanceChangeInterpretation(record))}</p>`;
}

function renderPerformanceChangeAnalysis(data, fromExam, toExam, sortBy) {
  const records = sortPerformanceChangeRecords(data.records, sortBy);
  const count = (classification) => records.filter((record) => record.classification === classification).length;
  const classes = data.classMetrics;
  const firstAverage = average(records.map((record) => record.first.percentage));
  const comparisonAverage = average(records.map((record) => record.comparison.percentage));
  const firstPassed = records.filter((record) => record.first.result !== "Fail").length;
  const comparisonPassed = records.filter((record) => record.comparison.result !== "Fail").length;
  const firstPassPercentage = records.length ? (firstPassed / records.length) * 100 : 0;
  const comparisonPassPercentage = records.length ? (comparisonPassed / records.length) * 100 : 0;

  els.performanceChangeMessage.textContent = records.length
    ? ""
    : "No sufficient data is available for this comparison.";
  els.performanceChangeSummary.innerHTML = [
    ["Students Compared", records.length, "is-neutral"],
    ["Progressing Well", count("Progressing Well"), "is-positive"],
    ["Stable Performance", count("Stable Performance"), "is-steady"],
    ["Monitor Progress", count("Monitor Progress"), "is-watch"],
    ["Additional Support", count("Additional Support Recommended"), "is-negative"]
  ].map(([label, value, className]) => `<article class="${className}"><span>${label}</span><strong>${value}</strong></article>`).join("");
  els.performanceChangeClassSummary.textContent = records.length
    ? `${classes.length === 1 ? classes[0].className : "Selected classes"} average performance changed from ${firstAverage.toFixed(2)}% in ${fromExam} to ${comparisonAverage.toFixed(2)}% in ${toExam}, ${signedAnalysisValue(comparisonAverage - firstAverage)}. Of ${records.length} comparable students, ${count("Progressing Well")} are progressing well, ${count("Stable Performance")} are stable, ${count("Monitor Progress")} need monitoring, and ${count("Additional Support Recommended")} need additional support.`
    : "";
  els.performanceChangeClassBody.innerHTML = classes.length
    ? classes.map((item) => `<tr><td>${escapeHtml(item.className)}</td><td>${item.students}</td><td>${item.firstAverage.toFixed(2)}%</td><td>${item.comparisonAverage.toFixed(2)}%</td><td>${signedAnalysisValue(item.averageChange)}</td><td>${item.progressing}</td><td>${item.stable}</td><td>${item.monitor}</td><td>${item.support}</td></tr>`).join("")
    : '<tr><td colspan="9">No comparable class data.</td></tr>';
  els.performanceChangeOverallChart.innerHTML = performanceCountBarChart([
    { label: "Progressing Well", value: count("Progressing Well") },
    { label: "Stable Performance", value: count("Stable Performance") },
    { label: "Monitor Progress", value: count("Monitor Progress") },
    { label: "Additional Support", value: count("Additional Support Recommended") }
  ]);
  els.performanceChangeDistributionChart.innerHTML = performanceChangeHistogram(records);
  els.performanceChangeExamChart.innerHTML = performanceGroupedBarChart([
    { label: "Average", first: firstAverage, comparison: comparisonAverage },
    { label: "Pass Percentage", first: firstPassPercentage, comparison: comparisonPassPercentage }
  ], "label", "first", "comparison", fromExam, toExam);
  els.performanceChangeSubjectChart.innerHTML = performanceGroupedBarChart(
    data.subjectMetrics,
    "subject",
    "firstAverage",
    "comparisonAverage",
    fromExam,
    toExam
  );
  els.performanceChangeSubjectBody.innerHTML = data.subjectMetrics.length
    ? data.subjectMetrics.map((item) => `<tr><td>${escapeHtml(item.subject)}</td><td>${item.firstAverage.toFixed(2)}%</td><td>${item.comparisonAverage.toFixed(2)}%</td><td>${signedAnalysisValue(item.averageChange)}</td><td>${signedAnalysisValue(item.highestImprovement)}</td><td>${item.attention}</td></tr>`).join("")
    : '<tr><td colspan="6">No comparable subject data.</td></tr>';
  els.performanceChangeBody.innerHTML = records.length
    ? records.map((record) => `<tr data-performance-student="${escapeAttr(encodeURIComponent(record.key))}" tabindex="0">
      <td>${escapeHtml(record.name)}</td><td>${record.roll}</td>
      <td>${record.first.percentage.toFixed(2)}%</td><td>${record.comparison.percentage.toFixed(2)}%</td>
      <td class="${record.percentageChange > 0 ? "analysis-positive-value" : record.percentageChange < 0 ? "analysis-negative-value" : ""}">${signedAnalysisValue(record.percentageChange)}</td>
      <td>${record.firstClassAverage.toFixed(2)}%</td><td>${record.comparisonClassAverage.toFixed(2)}%</td>
      <td>${signedAnalysisValue(record.firstRelative)}</td><td>${signedAnalysisValue(record.comparisonRelative)}</td>
      <td>${signedAnalysisValue(record.relativeChange)}</td>
      <td><span class="analysis-status-badge ${performanceChangeClassName(record.classification)}">${escapeHtml(record.classification)}</span></td>
      <td>${escapeHtml(performanceChangeInterpretation(record))}</td>
    </tr>`).join("")
    : '<tr><td colspan="12">No sufficient data is available for this comparison.</td></tr>';
  return { ...data, records, firstAverage, comparisonAverage, firstPassPercentage, comparisonPassPercentage };
}

function listSentence(items = []) {
  const cleanItems = items.filter(Boolean);
  if (cleanItems.length <= 2) return cleanItems.join(cleanItems.length === 2 ? " and " : "");
  return `${cleanItems.slice(0, -1).join(", ")}, and ${cleanItems.at(-1)}`;
}

function tiedAnalysisMetrics(metrics = [], valueKey = "passPercentage", direction = "max") {
  if (!metrics.length) return [];
  const values = metrics
    .map((metric) => Number(metric[valueKey]))
    .filter((value) => Number.isFinite(value));
  if (!values.length) return [];
  const target = direction === "min" ? Math.min(...values) : Math.max(...values);
  return metrics.filter((metric) => Math.abs(Number(metric[valueKey]) - target) < 0.005);
}

function subjectImprovementPassBenchmark(classes = []) {
  const selectedClasses = classes.filter(Boolean);
  const inStage = (stageName) => selectedClasses.some((className) =>
    (analysisSectionClasses[stageName] || []).includes(className));
  if (inStage("Foundational Stage") || inStage("Preparatory Stage")) return 90;
  if (inStage("Elementary Stage")) return 80;
  if (inStage("Secondary Stage")) return 75;
  return 90;
}

function renderAcademicAnalysis() {
  if (!els.analysisReport || activeView !== "analysis") return;
  initializeAnalysisFilters();
  const session = els.analysisSessionSelect.value || state.academicSession;
  const sectionFilter = els.analysisSectionSelect.value || "All Classes";
  const classFilter = els.analysisClassSelect.value || "All Classes";
  const exam = els.analysisExamSelect.value || "First Term";
  const subjectFilter = els.analysisSubjectSelect.value || "All Subjects";
  const isSingleSubjectAnalysis = subjectFilter !== "All Subjects";
  const status = els.analysisStatusSelect.value || "all";
  const threshold = Math.max(0, Math.min(100, Number(els.analysisSupportThreshold.value) || 50));
  const classes = selectedAnalysisClasses();
  const progressClassFilter = els.analysisProgressClassSelect.value || "All Classes";
  const progressClasses = selectedAnalysisProgressClasses();
  const progressFromExam = els.analysisProgressFromExamSelect.value;
  const progressToExam = els.analysisProgressToExamSelect.value;
  const performanceSession = els.performanceChangeSessionSelect.value || session;
  const performanceClassFilter = els.performanceChangeClassSelect.value || "All Classes";
  const performanceClasses = performanceClassFilter === "All Classes"
    ? classes
    : [performanceClassFilter];
  const performanceFromExam = els.performanceChangeFromExamSelect.value;
  const performanceToExam = els.performanceChangeToExamSelect.value;
  const performanceSubject = els.performanceChangeSubjectSelect.value || "All Subjects";
  const performanceStudent = els.performanceChangeStudentSelect.value || "All Students";
  const performanceSort = els.performanceChangeSortSelect.value || "improvement";
  const baseRecords = buildAcademicAnalysisSelectionRecords(session, classes, exam)
    .filter((record) => subjectFilter === "All Subjects"
      || record.subjects.some((subject) => subject.name === subjectFilter));
  const subjectAdjusted = baseRecords
    .map((record) => filteredAnalysisRecord(record, subjectFilter))
    .filter((record) => !record.excluded);
  const records = subjectAdjusted.filter((record) => status === "all"
    || (status === "present" && record.appeared)
    || (status === "absent" && !record.appeared));
  const overview = analysisOverviewMetrics(records);
  const classMetrics = analysisClassMetrics(records);
  const hasClassComparison = classMetrics.length > 1;
  const subjectMetrics = analysisSubjectMetrics(baseRecords.filter((record) => status === "all"
    || (status === "present" && record.appeared)
    || (status === "absent" && !record.appeared)), subjectFilter);
  const topStudents = records.filter((record) => record.appeared).sort((a, b) => b.percentage - a.percentage).slice(0, 10);
  const support = records.filter((record) =>
    (record.appeared ? record.percentage : 0) < threshold);
  const bestClass = [...classMetrics].sort((a, b) =>
    (b.passPercentage - a.passPercentage) || (b.average - a.average))[0];
  const weakClass = [...classMetrics].sort((a, b) =>
    (a.passPercentage - b.passPercentage) || (a.average - b.average))[0];
  const strongSubject = [...subjectMetrics].sort((a, b) => b.passPercentage - a.passPercentage)[0];
  const weakSubject = [...subjectMetrics].sort((a, b) => a.passPercentage - b.passPercentage)[0];
  const examOpportunities = baseRecords.reduce((sum, record) =>
    sum + (Number(record.examOpportunities) || 1), 0);
  const examAppearances = baseRecords.reduce((sum, record) =>
    sum + (Number(record.examAppearances) || 0), 0);
  const examAbsences = Math.max(0, examOpportunities - examAppearances);
  const attendancePercentage = examOpportunities ? (examAppearances / examOpportunities) * 100 : 0;
  const trend = buildAnalysisTrend(session, classes, subjectFilter, status);
  const studentProgress = buildAnalysisStudentProgress(
    session,
    progressClasses,
    subjectFilter,
    status,
    threshold,
    progressFromExam,
    progressToExam
  );
  const growthRecords = studentProgress
    .filter((record) => record.appearedCount >= 2)
    .sort((a, b) => a.delta - b.delta);
  let earlyWarning = studentProgress
    .filter((record) => record.riskScore > 0)
    .sort((a, b) => (b.riskScore - a.riskScore)
      || ((a.latest?.percentage ?? 0) - (b.latest?.percentage ?? 0)));
  const rawPerformanceChange = buildPerformanceChangeData(
    performanceSession,
    performanceClasses,
    performanceFromExam,
    performanceToExam,
    performanceSubject,
    performanceStudent
  );
  const performanceChange = renderPerformanceChangeAnalysis(
    rawPerformanceChange,
    performanceFromExam,
    performanceToExam,
    performanceSort
  );
  const warningPerformanceChange = buildPerformanceChangeData(
    session,
    progressClasses,
    progressFromExam,
    progressToExam,
    subjectFilter,
    "All Students"
  );
  const performanceWarnings = warningPerformanceChange.records
    .filter((record) =>
      ["Additional Support Recommended", "Monitor Progress"].includes(record.classification)
      || record.first.result === "Fail"
      || record.comparison.result === "Fail")
    .map((record) => {
      const reasons = [];
      if (record.percentageChange < -performanceChangeTolerance) {
        reasons.push(`Performance declined by ${Math.abs(record.percentageChange).toFixed(2)} percentage points from ${progressFromExam} to ${progressToExam}`);
      }
      if (record.relativeChange < -performanceChangeTolerance) {
        reasons.push(`Difference from class average declined by ${Math.abs(record.relativeChange).toFixed(2)} percentage points`);
      }
      if (record.classification === "Monitor Progress") reasons.push("Progress should be monitored against class-average context");
      if (record.classification === "Additional Support Recommended") reasons.push("Additional support recommended by performance comparison");
      if (record.first.result === "Fail") reasons.push(`Failed in ${progressFromExam}`);
      if (record.comparison.result === "Fail") reasons.push(`Failed in ${progressToExam}`);
      return {
        roll: record.roll,
        name: record.name,
        className: record.className,
        latest: record.comparison,
        delta: record.percentageChange,
        appearedCount: 2,
        missedExams: 0,
        failedExams: Number(record.first.result === "Fail") + Number(record.comparison.result === "Fail"),
        weakSubjects: record.comparison.failedSubjects || [],
        riskScore: record.classification === "Additional Support Recommended" ? 3 : 2,
        riskLevel: record.classification === "Additional Support Recommended" ? "High" : "Medium",
        riskReasons: reasons
      };
    });
  const repeatedDeclineWarnings = buildRepeatedPerformanceDeclineWarnings(
    session,
    progressClasses,
    subjectFilter
  );
  const warningMap = new Map();
  [
    ...earlyWarning,
    ...warningPerformanceChange.missingWarnings,
    ...performanceWarnings,
    ...repeatedDeclineWarnings
  ].forEach((record) => {
    const key = `${record.className}\u0000${record.roll}`;
    const existing = warningMap.get(key);
    if (!existing) {
      warningMap.set(key, { ...record, riskReasons: [...new Set(record.riskReasons || [])] });
      return;
    }
    existing.riskScore = Math.max(existing.riskScore, record.riskScore);
    existing.riskLevel = existing.riskScore >= 3 ? "High" : existing.riskScore === 2 ? "Medium" : "Watch";
    existing.riskReasons = [...new Set([...(existing.riskReasons || []), ...(record.riskReasons || [])])];
    existing.weakSubjects = [...new Set([...(existing.weakSubjects || []), ...(record.weakSubjects || [])])];
    existing.failedExams = Math.max(existing.failedExams || 0, record.failedExams || 0);
    existing.missedExams = Math.max(existing.missedExams || 0, record.missedExams || 0);
  });
  earlyWarning = [...warningMap.values()].sort((a, b) => b.riskScore - a.riskScore);

  analysisCurrentData = {
    session, sectionFilter, classFilter, exam, subjectFilter, status, threshold, records, baseRecords,
    overview, classMetrics, subjectMetrics, topStudents, support, trend, attendancePercentage,
    examAppearances, examOpportunities, examAbsences, growthRecords, earlyWarning,
    progressClassFilter, progressFromExam, progressToExam, performanceChange,
    performanceSession, performanceClassFilter, performanceFromExam, performanceToExam,
    performanceSubject, performanceStudent, performanceSort
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
    ["Average Score", `${overview.schoolAverage.toFixed(2)}%`],
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
    ? hasClassComparison
      ? `Best: ${bestClass.className} (${bestClass.passPercentage.toFixed(2)}%) | Needs focus: ${weakClass.className} (${weakClass.passPercentage.toFixed(2)}%)`
      : `${bestClass.className}: ${bestClass.passPercentage.toFixed(2)}% pass | ${bestClass.average.toFixed(2)}% average`
    : "No class data";
  els.analysisTrendChart.innerHTML = analysisLineChart(trend);
  els.analysisSubjectChart.innerHTML = `<div class="analysis-subject-column-scroll">${analysisColumnChart(subjectMetrics, "average", "name")}</div>
    <h5 class="analysis-subchart-title">Subject Pass Percentage</h5>
    <div class="analysis-subject-pass-scroll">${analysisBarChart(subjectMetrics, "passPercentage", "name")}</div>`;
  els.analysisSubjectHighlight.textContent = strongSubject
    ? isSingleSubjectAnalysis
      ? `${strongSubject.name}: ${strongSubject.passPercentage.toFixed(2)}% pass | ${strongSubject.average.toFixed(2)}% average`
      : `Strongest: ${strongSubject.name} | Weakest: ${weakSubject.name}`
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
  const attendanceTotalLabel = exam === analysisExamAll ? "Possible Appearances" : "Total Students";
  const attendancePie = analysisPieChart([
    { label: "Appeared", value: examAppearances, color: "#157347" },
    { label: "Absent", value: examAbsences, color: "#b42318" }
  ], `Exam attendance: ${attendancePercentage.toFixed(2)} percent`);
  els.analysisAttendance.innerHTML = `<div class="attendance-analysis-layout">
    ${attendancePie}
    <div class="attendance-analysis-details">
      <div class="attendance-analysis-value"><strong>${attendancePercentage.toFixed(2)}%</strong><span>Exam Attendance</span></div>
      <dl><div><dt>${attendanceTotalLabel}</dt><dd>${examOpportunities}</dd></div><div><dt>Appeared</dt><dd>${examAppearances}</dd></div><div><dt>Absent</dt><dd>${examAbsences}</dd></div></dl>
    </div>
  </div>`;
  els.analysisDistributionChart.innerHTML = analysisHistogram(analysisDistribution(records));
  els.analysisTopStudents.innerHTML = analysisTopStudentsChart(topStudents);
  const growthCounts = {
    improving: growthRecords.filter((record) => record.trend === "Improving").length,
    stable: growthRecords.filter((record) => record.trend === "Stable").length,
    declining: growthRecords.filter((record) => record.trend === "Declining").length
  };
  els.analysisGrowthSummary.innerHTML = [
    ["Compared Students", growthRecords.length, "is-neutral"],
    ["Improving", growthCounts.improving, "is-positive"],
    ["Stable", growthCounts.stable, "is-steady"],
    ["Declining", growthCounts.declining, "is-negative"]
  ].map(([label, value, className]) => `<article class="${className}"><span>${label}</span><strong>${value}</strong></article>`).join("");
  els.analysisGrowthBody.innerHTML = growthRecords.length
    ? growthRecords.map((record) => `<tr>
      <td>${escapeHtml(record.name)}</td>
      <td>${escapeHtml(record.className)}</td>
      <td>${escapeHtml(record.first.exam.replace(" Unit Test ", " UT "))}</td>
      <td>${escapeHtml(record.latest.exam.replace(" Unit Test ", " UT "))}</td>
      <td>${record.first.percentage.toFixed(2)}%</td>
      <td>${record.latest.percentage.toFixed(2)}%</td>
      <td class="${record.delta > 0 ? "analysis-positive-value" : record.delta < 0 ? "analysis-negative-value" : ""}">${record.delta > 0 ? "+" : ""}${record.delta.toFixed(2)}%</td>
      <td class="${record.markDelta > 0 ? "analysis-positive-value" : record.markDelta < 0 ? "analysis-negative-value" : ""}">${formatRoundedAnalysisMarkChange(record.markDelta)}</td>
      <td class="analysis-subject-changes">${formatAnalysisSubjectChangesHtml(record.subjectChanges)}</td>
      <td><span class="analysis-status-badge ${analysisTrendClass(record.trend)}">${record.trend}</span></td>
    </tr>`).join("")
    : `<tr><td colspan="10">Comparable ${escapeHtml(progressFromExam)} and ${escapeHtml(progressToExam)} results are required for growth analysis.</td></tr>`;

  const riskCounts = {
    high: earlyWarning.filter((record) => record.riskLevel === "High").length,
    medium: earlyWarning.filter((record) => record.riskLevel === "Medium").length,
    watch: earlyWarning.filter((record) => record.riskLevel === "Watch").length
  };
  els.analysisEarlyWarningSummary.innerHTML = [
    ["Flagged Students", earlyWarning.length, "is-neutral"],
    ["High Risk", riskCounts.high, "is-negative"],
    ["Medium Risk", riskCounts.medium, "is-warning"],
    ["Watch", riskCounts.watch, "is-watch"]
  ].map(([label, value, className]) => `<article class="${className}"><span>${label}</span><strong>${value}</strong></article>`).join("");
  els.analysisEarlyWarningBody.innerHTML = earlyWarning.length
    ? earlyWarning.map((record) => {
      const weakSubjects = record.weakSubjects
        .map((subject) => analysisSubjectReasonAbbreviations[subject] || subject)
        .join(", ") || "-";
      return `<tr>
        <td>${escapeHtml(record.name)}</td>
        <td>${escapeHtml(record.className)}</td>
        <td>${record.latest ? `${record.latest.percentage.toFixed(2)}%` : "-"}</td>
        <td class="${record.delta > 0 ? "analysis-positive-value" : record.delta < 0 ? "analysis-negative-value" : ""}">${record.appearedCount >= 2 ? `${record.delta > 0 ? "+" : ""}${record.delta.toFixed(2)}%` : "-"}</td>
        <td>${record.missedExams}</td>
        <td>${record.failedExams}</td>
        <td>${escapeHtml(weakSubjects)}</td>
        <td><span class="analysis-status-badge ${analysisRiskClass(record.riskLevel)}">${record.riskLevel}</span></td>
        <td>${escapeHtml(record.riskReasons.join(", "))}</td>
      </tr>`;
    }).join("")
    : `<tr><td colspan="9">${studentProgress.length
      ? "No students currently meet the early-warning criteria."
      : `Comparable ${escapeHtml(progressFromExam)} and ${escapeHtml(progressToExam)} results are required.`}</td></tr>`;

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
  const strongSubjects = tiedAnalysisMetrics(subjectMetrics, "passPercentage", "max");
  const subjectImprovementBenchmark = subjectImprovementPassBenchmark(classes);
  const subjectsBelowBenchmark = strongSubject
    ? subjectMetrics
      .filter((subject) => subject.passPercentage < subjectImprovementBenchmark)
      .sort((a, b) => a.passPercentage - b.passPercentage)
    : [];
  if (strongSubject && !isSingleSubjectAnalysis) {
    const subjectNames = listSentence(strongSubjects.map((subject) => subject.name));
    strengths.push(`${subjectNames} ${strongSubjects.length === 1 ? "has" : "have"} the highest pass percentage (${strongSubject.passPercentage.toFixed(2)}%).`);
  } else if (strongSubject) {
    strengths.push(`${strongSubject.name} pass percentage is ${strongSubject.passPercentage.toFixed(2)}%.`);
  }
  if (bestClass && hasClassComparison) {
    strengths.push(`${bestClass.className} has the highest pass percentage (${bestClass.passPercentage.toFixed(2)}%).`);
  }
  if (overview.distinction) strengths.push(`${overview.distinction} student(s) achieved Distinction.`);
  if (!isSingleSubjectAnalysis && subjectsBelowBenchmark.length) {
    const subjectNames = listSentence(subjectsBelowBenchmark.map((subject) =>
      `${subject.name} (${subject.passPercentage.toFixed(2)}%)`));
    const recommendationSubjects = listSentence(subjectsBelowBenchmark.map((subject) => subject.name));
    weaknesses.push(`${subjectNames} ${subjectsBelowBenchmark.length === 1 ? "is" : "are"} below the stage improvement benchmark (${subjectImprovementBenchmark.toFixed(0)}%).`);
    recommendations.push(`Provide focused practice and remedial support in ${recommendationSubjects}.`);
  } else if (weakSubject?.failed) {
    weaknesses.push(`${weakSubject.failed} student(s) did not pass ${weakSubject.name}.`);
    recommendations.push(`Provide focused support to students who did not pass ${weakSubject.name}.`);
  }
  if (weakClass && hasClassComparison) {
    weaknesses.push(`${weakClass.className} has the lowest pass percentage (${weakClass.passPercentage.toFixed(2)}%).`);
    recommendations.push(`Review learning gaps and intervention plans for ${weakClass.className}.`);
  }
  if (growthCounts.declining) {
    weaknesses.push(`${growthCounts.declining} student(s) show a declining performance trend.`);
    recommendations.push("Review declining students individually and set short-term improvement targets.");
  }
  if (riskCounts.high) {
    recommendations.push(`Prioritize immediate intervention plans for ${riskCounts.high} high-risk student(s).`);
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

function teacherAssignmentSubjects(className) {
  return ["All Subjects", ...analysisSubjectNames(className, analysisExamAll)
    .filter((subject) => subject !== "W.E.")
    .sort((a, b) => a.localeCompare(b))];
}

function updateTeacherAssignmentSubjectOptions(preferredSubject = "") {
  if (!els.teacherAssignmentSubjectSelect || !els.teacherAssignmentClassSelect) return;
  const subjects = teacherAssignmentSubjects(els.teacherAssignmentClassSelect.value || classNames[0]);
  populateSelect(els.teacherAssignmentSubjectSelect, subjects);
  setSelectValueIfAvailable(els.teacherAssignmentSubjectSelect, preferredSubject);
}

function teacherAssignmentSupportsParts(
  className = els.teacherAssignmentClassSelect?.value,
  subject = els.teacherAssignmentSubjectSelect?.value
) {
  return isHighClass(className)
    && subject !== "All Subjects"
    && highSplitPartSubjects.includes(baseSubjectName(subject));
}

function teacherSubjectLabel(subject, part = "Whole Subject") {
  return part && part !== "Whole Subject" ? `${subject} ${part}` : subject;
}

function updateTeacherAssignmentPartOptions(preferredPart = "") {
  if (!els.teacherAssignmentPartSelect) return;
  const options = teacherAssignmentSupportsParts()
    ? ["Whole Subject", "Part A", "Part B"]
    : ["Whole Subject"];
  populateSelect(els.teacherAssignmentPartSelect, options);
  setSelectValueIfAvailable(els.teacherAssignmentPartSelect, preferredPart);
}

function expandTeacherAssignments(assignments, exam = analysisExamAll) {
  return normalizeTeacherAssignments(assignments).flatMap((assignment) => {
    if (assignment.subject !== "All Subjects") return [assignment];
    const subjects = analysisSubjectNames(assignment.className, exam)
      .filter((subject) => subject !== "W.E.");
    return subjects.map((subject) => ({
      ...assignment,
      id: `${assignment.id}::${subject}`,
      sourceAssignmentId: assignment.id,
      subject
    }));
  });
}

function initializeTeacherAnalyticsFilters(savedFilters = null) {
  if (!els.teacherAnalyticsSessionSelect) return;
  const assignments = normalizeTeacherAssignments(state.teacherAssignments);
  const previous = {
    session: savedFilters?.teacherAnalyticsSession || els.teacherAnalyticsSessionSelect.value || state.academicSession,
    exam: savedFilters?.teacherAnalyticsExam || els.teacherAnalyticsExamSelect.value || analysisExamAll,
    teacher: savedFilters?.teacherAnalyticsTeacher || els.teacherAnalyticsTeacherSelect.value || "All Teachers",
    className: savedFilters?.teacherAnalyticsClass || els.teacherAnalyticsClassSelect.value || "All Classes",
    subject: savedFilters?.teacherAnalyticsSubject || els.teacherAnalyticsSubjectSelect.value || "All Subjects"
  };
  const sessions = [...new Set([state.academicSession, ...Object.keys(state.sessions || {})])].sort();
  populateSelect(els.teacherAnalyticsSessionSelect, sessions);
  setSelectValueIfAvailable(els.teacherAnalyticsSessionSelect, previous.session);

  const teachers = [...new Set(assignments.map((assignment) => assignment.teacherName))].sort();
  populateSelect(els.teacherAnalyticsTeacherSelect, ["All Teachers", ...teachers]);
  setSelectValueIfAvailable(els.teacherAnalyticsTeacherSelect, previous.teacher);
  const teacherAssignments = previous.teacher === "All Teachers"
    ? assignments
    : assignments.filter((assignment) => assignment.teacherName === els.teacherAnalyticsTeacherSelect.value);

  const classes = classNames.filter((className) =>
    teacherAssignments.some((assignment) => assignment.className === className));
  populateSelect(els.teacherAnalyticsClassSelect, ["All Classes", ...classes]);
  setSelectValueIfAvailable(els.teacherAnalyticsClassSelect, previous.className);
  const classAssignments = els.teacherAnalyticsClassSelect.value === "All Classes"
    ? teacherAssignments
    : teacherAssignments.filter((assignment) => assignment.className === els.teacherAnalyticsClassSelect.value);

  const examClasses = [...new Set(classAssignments.map((assignment) => assignment.className))];
  const exams = examNames.filter((exam) => examClasses.some((className) => currentExams(className).includes(exam)));
  populateSelect(els.teacherAnalyticsExamSelect, [analysisExamAll, ...exams]);
  setSelectValueIfAvailable(els.teacherAnalyticsExamSelect, previous.exam);

  const expandedAssignments = expandTeacherAssignments(
    classAssignments,
    els.teacherAnalyticsExamSelect.value || analysisExamAll
  );
  const subjects = [...new Set(expandedAssignments.map((assignment) => assignment.subject))].sort();
  populateSelect(els.teacherAnalyticsSubjectSelect, ["All Subjects", ...subjects]);
  setSelectValueIfAvailable(els.teacherAnalyticsSubjectSelect, previous.subject);
}

function filteredTeacherAssignments() {
  const teacher = els.teacherAnalyticsTeacherSelect?.value || "All Teachers";
  const className = els.teacherAnalyticsClassSelect?.value || "All Classes";
  const subject = els.teacherAnalyticsSubjectSelect?.value || "All Subjects";
  const assignments = normalizeTeacherAssignments(state.teacherAssignments).filter((assignment) =>
    (teacher === "All Teachers" || assignment.teacherName === teacher)
    && (className === "All Classes" || assignment.className === className));
  return expandTeacherAssignments(assignments, els.teacherAnalyticsExamSelect?.value || analysisExamAll)
    .filter((assignment) => subject === "All Subjects" || assignment.subject === subject);
}

function teacherAnalyticsExamList(assignments, examFilter) {
  if (examFilter !== analysisExamAll) return [examFilter];
  return examNames.filter((exam) =>
    assignments.some((assignment) => currentExams(assignment.className).includes(exam)));
}

function teacherSubjectObservation(record, assignment) {
  const subject = record.subjects.find((item) => item.name === assignment.subject);
  if (!subject) return null;
  const partKey = assignment.part === "Part A" ? "partA" : assignment.part === "Part B" ? "partB" : "";
  const value = partKey ? subject[partKey] : subject.value;
  if (isNotEnrolledEntry(value)) return null;
  const maximum = partKey ? subject.partMaximum : subject.maximum;
  const passMark = partKey ? subject.partPassMark : subject.passMark;
  const present = value !== "";
  const percentage = present && maximum
    ? (numericMark(value) / maximum) * 100
    : 0;
  return {
    teacherId: assignment.teacherId,
    teacherName: assignment.teacherName,
    className: assignment.className,
    subjectName: assignment.subject,
    partName: assignment.part || "Whole Subject",
    exam: record.exam,
    roll: record.roll,
    name: record.name,
    present,
    passed: present && numericMark(value) >= passMark,
    percentage,
    value,
    maximum
  };
}

function buildTeacherObservations(session, assignments, examFilter) {
  assignments = expandTeacherAssignments(assignments, examFilter);
  const observations = [];
  teacherAnalyticsExamList(assignments, examFilter).forEach((exam) => {
    const recordsByClass = new Map();
    assignments.forEach((assignment) => {
      if (!currentExams(assignment.className).includes(exam)) return;
      if (!analysisSubjectNames(assignment.className, exam).includes(assignment.subject)) return;
      if (!recordsByClass.has(assignment.className)) {
        recordsByClass.set(
          assignment.className,
          buildAcademicAnalysisRecords(session, [assignment.className], exam)
        );
      }
      recordsByClass.get(assignment.className).forEach((record) => {
        const observation = teacherSubjectObservation(record, assignment);
        if (observation) observations.push(observation);
      });
    });
  });
  return observations;
}

function teacherObservationMetrics(observations) {
  const total = observations.length;
  const presentItems = observations.filter((item) => item.present);
  const passed = observations.filter((item) => item.passed).length;
  const percentages = presentItems.map((item) => item.percentage);
  return {
    total,
    present: presentItems.length,
    absent: total - presentItems.length,
    passed,
    failed: total - passed,
    average: average(percentages),
    passPercentage: total ? (passed / total) * 100 : 0,
    failureRate: total ? ((total - passed) / total) * 100 : 0,
    highest: percentages.length ? Math.max(...percentages) : 0,
    lowest: percentages.length ? Math.min(...percentages) : 0,
    distinction: presentItems.filter((item) =>
      item.percentage >= (isHighClass(item.className) ? 75 : 80)).length
  };
}

function teacherClassMetrics(observations) {
  const groups = new Map();
  observations.forEach((item) => {
    const key = `${item.className}\u0000${item.subjectName}\u0000${item.partName}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  return [...groups.entries()].map(([key, items]) => {
    const [className, subjectName, partName] = key.split("\u0000");
    const subjectLabel = partName === "Whole Subject" ? subjectName : `${subjectName} ${partName}`;
    return { className, subjectName, partName, subjectLabel, label: `${className} - ${subjectLabel}`, ...teacherObservationMetrics(items) };
  }).sort((a, b) =>
    classNames.indexOf(a.className) - classNames.indexOf(b.className)
    || a.subjectName.localeCompare(b.subjectName));
}

function teacherPerformanceTrend(session, assignments) {
  return teacherAnalyticsExamList(assignments, analysisExamAll).map((exam) => {
    const metrics = teacherObservationMetrics(buildTeacherObservations(session, assignments, exam));
    return { label: exam.replace("Unit Test", "UT"), average: metrics.average, total: metrics.total };
  }).filter((item) => item.total);
}

function teacherGrowthMetrics(session, assignments, examFilter) {
  const deltas = [];
  assignments.forEach((assignment) => {
    const available = examNames.filter((exam) =>
      currentExams(assignment.className).includes(exam)
      && analysisSubjectNames(assignment.className, exam).includes(assignment.subject));
    const toExam = examFilter === analysisExamAll ? available.at(-1) : examFilter;
    const toIndex = available.indexOf(toExam);
    const fromExam = examFilter === analysisExamAll ? available[0] : available[toIndex - 1];
    if (!fromExam || !toExam || fromExam === toExam) return;
    const from = buildTeacherObservations(session, [assignment], fromExam);
    const to = buildTeacherObservations(session, [assignment], toExam);
    const fromMap = new Map(from.map((item) => [String(item.roll), item]));
    to.forEach((item) => {
      const previous = fromMap.get(String(item.roll));
      if (previous?.present && item.present) {
        deltas.push({
          ...item,
          fromExam,
          toExam,
          previousPercentage: previous.percentage,
          delta: item.percentage - previous.percentage
        });
      }
    });
  });
  return {
    records: deltas,
    averageDelta: average(deltas.map((item) => item.delta)),
    improved: deltas.filter((item) => item.delta >= 5).length,
    stable: deltas.filter((item) => item.delta > -5 && item.delta < 5).length,
    declined: deltas.filter((item) => item.delta <= -5).length
  };
}

function teacherSchoolComparisons(session, classMetrics, examFilter) {
  return classMetrics.map((metric) => {
    const schoolAssignments = classNames
      .filter((className) => teacherAnalyticsExamList([{ className }], examFilter)
        .some((exam) => analysisSubjectNames(className, exam).includes(metric.subjectName)))
      .map((className) => ({
        teacherId: "school",
        teacherName: "School",
        className,
        subject: metric.subjectName,
        part: metric.partName
      }));
    const school = teacherObservationMetrics(buildTeacherObservations(session, schoolAssignments, examFilter));
    return {
      label: `${metric.className} - ${metric.subjectName}`,
      teacherAverage: metric.average,
      schoolAverage: school.average
    };
  });
}

function teacherComparisonChart(items) {
  if (!items.length) return '<p class="analysis-empty">No comparison data available.</p>';
  return `<div class="teacher-comparison-chart">${items.map((item) => `
    <div class="teacher-comparison-row">
      <span>${escapeHtml(item.label)}</span>
      <div><i class="teacher-bar" style="width:${Math.min(100, item.teacherAverage)}%"></i></div>
      <strong>${item.teacherAverage.toFixed(2)}%</strong>
      <div><i class="school-bar" style="width:${Math.min(100, item.schoolAverage)}%"></i></div>
      <strong>${item.schoolAverage.toFixed(2)}%</strong>
    </div>`).join("")}
    <div class="teacher-comparison-legend"><span><i class="teacher-bar"></i>Assigned class</span><span><i class="school-bar"></i>School subject average</span></div>
  </div>`;
}

function teacherSupportBarChart(items) {
  if (!items.length) return '<p class="analysis-empty">No students currently need support.</p>';
  const max = Math.max(...items.map((item) => item.count), 1);
  return `<div class="analysis-bar-chart">${items.map((item) => `
    <div class="analysis-bar-row">
      <span>${escapeHtml(item.className)}</span>
      <div class="analysis-bar-track"><i style="width:${(item.count / max) * 100}%"></i></div>
      <strong>${item.count}</strong>
    </div>`).join("")}</div>`;
}

function teacherDataCompletion(session, assignments, examFilter, observations) {
  const marks = {
    expected: observations.length,
    completed: observations.filter((item) => item.present).length
  };
  const termPairs = new Map();
  teacherAnalyticsExamList(assignments, examFilter).filter((exam) => termExams.includes(exam)).forEach((exam) => {
    assignments.forEach((assignment) => {
      if (currentExams(assignment.className).includes(exam)) {
        termPairs.set(`${assignment.className}\u0000${exam}`, { className: assignment.className, exam });
      }
    });
  });
  const attendance = { expected: 0, completed: 0 };
  const measurement = { expected: 0, completed: 0 };
  runWithAnalysisSession(session, () => {
    termPairs.forEach(({ className, exam }) => {
      (state.classes[className] || []).forEach((student) => {
        const attendanceValue = getStudentAttendance(student, className, exam);
        const measurementValue = getStudentMeasurement(student, className, exam);
        if (isNotEnrolledEntry(attendanceValue)
          && isNotEnrolledEntry(measurementValue.height)
          && isNotEnrolledEntry(measurementValue.weight)) return;
        attendance.expected += 1;
        measurement.expected += 1;
        if (attendanceValue !== "") attendance.completed += 1;
        if (measurementValue.height !== "" && measurementValue.weight !== "") measurement.completed += 1;
      });
    });
  });
  const relevantUpdates = runWithAnalysisSession(session, () => Object.entries(state.dataEntryUpdates || {})
    .filter(([key]) => assignments.some((assignment) => key.includes(`::${assignment.className}::`)))
    .map(([, value]) => value)
    .filter((value) => value?.updatedAt)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))));
  return {
    marks,
    attendance,
    measurement,
    lastUpdated: relevantUpdates[0] || null
  };
}

function completionPercentage(item) {
  return item.expected ? (item.completed / item.expected) * 100 : 0;
}

function teacherPerformanceRating(overview, growth, completion) {
  if (!overview.total) return { rating: 0, score: 0 };
  const improvementScore = growth.records.length
    ? clamp(50 + (growth.averageDelta * 5), 0, 100)
    : 50;
  const score =
    (overview.average * 0.35)
    + (overview.passPercentage * 0.35)
    + (completionPercentage(completion.marks) * 0.20)
    + (improvementScore * 0.10);
  return {
    score,
    rating: Math.round((score / 20) * 10) / 10
  };
}

function renderTeacherAssignmentTable() {
  if (!els.teacherAssignmentBody) return;
  const assignments = normalizeTeacherAssignments(state.teacherAssignments);
  els.teacherAssignmentBody.innerHTML = assignments.length
    ? assignments.map((assignment) => `<tr>
      <td>${escapeHtml(assignment.teacherName)}</td>
      <td>${escapeHtml(assignment.className)}</td>
      <td>${escapeHtml(assignment.subject)}</td>
      <td>${escapeHtml(assignment.part)}</td>
      <td class="teacher-assignment-actions">
        <button class="ghost-button compact-button" type="button" data-edit-teacher-assignment="${escapeAttr(assignment.id)}">Edit</button>
        <button class="ghost-button compact-button danger" type="button" data-remove-teacher-assignment="${escapeAttr(assignment.id)}">Remove</button>
      </td>
    </tr>`).join("")
    : '<tr><td colspan="5">No teacher assignments have been added.</td></tr>';
}

function resetTeacherAssignmentForm() {
  editingTeacherAssignmentId = "";
  els.teacherAssignmentForm?.reset();
  if (els.teacherAssignmentClassSelect?.options.length) els.teacherAssignmentClassSelect.value = classNames[0];
  updateTeacherAssignmentSubjectOptions();
  updateTeacherAssignmentPartOptions();
  if (els.saveTeacherAssignmentBtn) els.saveTeacherAssignmentBtn.textContent = "Add Assignment";
  els.cancelTeacherAssignmentEditBtn?.classList.add("hidden");
}

function saveTeacherAssignment(event) {
  event.preventDefault();
  if (!isAdmin()) {
    showToast("Access denied. Admin privileges required.");
    return;
  }
  const teacherName = els.teacherAssignmentNameInput.value.trim();
  const className = els.teacherAssignmentClassSelect.value;
  const subject = els.teacherAssignmentSubjectSelect.value;
  const part = els.teacherAssignmentPartSelect.value || "Whole Subject";
  if (!teacherName || !className || !subject) {
    showToast("Enter the teacher name, class, and subject.");
    return;
  }
  const assignments = normalizeTeacherAssignments(state.teacherAssignments);
  const duplicate = assignments.some((assignment) =>
    assignment.id !== editingTeacherAssignmentId
    && assignment.teacherName.toLowerCase() === teacherName.toLowerCase()
    && assignment.className === className
    && assignment.subject === subject
    && assignment.part === part);
  if (duplicate) {
    showToast("This teacher assignment already exists.");
    return;
  }
  const next = {
    id: editingTeacherAssignmentId || `teacher-assignment-${Date.now()}`,
    teacherId: slugifyTeacherName(teacherName),
    teacherName,
    className,
    subject,
    part
  };
  const index = assignments.findIndex((assignment) => assignment.id === editingTeacherAssignmentId);
  if (index >= 0) assignments[index] = next;
  else assignments.push(next);
  state.teacherAssignments = assignments;
  saveState();
  resetTeacherAssignmentForm();
  initializeTeacherAnalyticsFilters();
  renderTeacherAnalytics();
  showToast(index >= 0
    ? "Teacher assignment updated."
    : "Teacher assignment added.");
}

function editTeacherAssignment(id) {
  if (!isAdmin()) return;
  const assignment = normalizeTeacherAssignments(state.teacherAssignments)
    .find((item) => item.id === id);
  if (!assignment) return;
  editingTeacherAssignmentId = assignment.id;
  els.teacherAssignmentNameInput.value = assignment.teacherName;
  els.teacherAssignmentClassSelect.value = assignment.className;
  updateTeacherAssignmentSubjectOptions(assignment.subject);
  updateTeacherAssignmentPartOptions(assignment.part);
  els.saveTeacherAssignmentBtn.textContent = "Update Assignment";
  els.cancelTeacherAssignmentEditBtn.classList.remove("hidden");
  els.teacherAssignmentNameInput.focus();
}

function removeTeacherAssignment(id) {
  if (!isAdmin()) return;
  const assignment = normalizeTeacherAssignments(state.teacherAssignments)
    .find((item) => item.id === id);
  if (!assignment || !window.confirm(`Remove ${assignment.teacherName} - ${assignment.className} ${teacherSubjectLabel(assignment.subject, assignment.part)}?`)) return;
  state.teacherAssignments = normalizeTeacherAssignments(state.teacherAssignments)
    .filter((item) => item.id !== id);
  saveState();
  if (editingTeacherAssignmentId === id) resetTeacherAssignmentForm();
  initializeTeacherAnalyticsFilters();
  renderTeacherAnalytics();
  showToast("Teacher assignment removed.");
}

function renderTeacherAnalytics() {
  if (!els.teacherAnalyticsContent || activeView !== "teacherAnalytics") return;
  const allowed = isAdmin();
  els.teacherAnalyticsAccessDenied.classList.toggle("hidden", allowed);
  els.teacherAnalyticsContent.classList.toggle("hidden", !allowed);
  if (!allowed) {
    teacherAnalyticsCurrentData = null;
    return;
  }

  if (!els.teacherAssignmentClassSelect.options.length) {
    populateSelect(els.teacherAssignmentClassSelect, classNames);
    updateTeacherAssignmentSubjectOptions();
    updateTeacherAssignmentPartOptions();
  }
  initializeTeacherAnalyticsFilters();
  renderTeacherAssignmentTable();
  const assignments = filteredTeacherAssignments();
  const session = els.teacherAnalyticsSessionSelect.value || state.academicSession;
  const exam = els.teacherAnalyticsExamSelect.value || analysisExamAll;
  const observations = buildTeacherObservations(session, assignments, exam);
  const overview = teacherObservationMetrics(observations);
  const classMetrics = teacherClassMetrics(observations);
  const growth = teacherGrowthMetrics(session, assignments, exam);
  const trend = teacherPerformanceTrend(session, assignments);
  const comparisons = teacherSchoolComparisons(session, classMetrics, exam);
  const completion = teacherDataCompletion(session, assignments, exam, observations);
  const performanceRating = teacherPerformanceRating(overview, growth, completion);
  const declineMap = new Map(growth.records.filter((item) => item.delta <= -5)
    .map((item) => [`${item.className}\u0000${item.subjectName}\u0000${item.partName}\u0000${item.roll}`, item.delta]));
  const supportMap = new Map();
  observations.filter((item) => !item.present || !item.passed || item.percentage < 40).forEach((item) => {
    const key = `${item.className}\u0000${item.subjectName}\u0000${item.partName}\u0000${item.roll}`;
    const reasons = [];
    if (!item.present) reasons.push("Absent");
    else {
      if (!item.passed) reasons.push("Failed");
      if (item.percentage < 40) reasons.push("Below 40%");
    }
    if (declineMap.has(key)) reasons.push(`Declined ${Math.abs(declineMap.get(key)).toFixed(2)} points`);
    const existing = supportMap.get(key);
    if (!existing || (!item.present && existing.present)) supportMap.set(key, { ...item, reasons });
  });
  growth.records.filter((item) => item.delta <= -5).forEach((item) => {
    const key = `${item.className}\u0000${item.subjectName}\u0000${item.partName}\u0000${item.roll}`;
    if (!supportMap.has(key)) {
      supportMap.set(key, { ...item, reasons: [`Declined ${Math.abs(item.delta).toFixed(2)} points`] });
    }
  });
  const support = [...supportMap.values()].sort((a, b) =>
    a.className.localeCompare(b.className) || a.name.localeCompare(b.name));
  teacherAnalyticsCurrentData = {
    session, exam, assignments, observations, overview, classMetrics, growth, trend,
    comparisons, completion, support, performanceRating
  };

  const teacherLabel = els.teacherAnalyticsTeacherSelect.value;
  const teacherPossessiveLabel = teacherLabel === "All Teachers" ? "The selected teachers'" : `${teacherLabel}'s`;
  els.teacherAnalyticsSubtitle.textContent = `${teacherLabel} | ${exam} | Academic Session ${formatAcademicSession(session)}`;
  els.teacherAnalyticsAssignmentSummary.innerHTML = assignments.length
    ? `<div class="teacher-assignment-chips">${assignments.map((assignment) =>
      `<span><strong>${escapeHtml(assignment.teacherName)}</strong> - ${escapeHtml(assignment.className)} ${escapeHtml(teacherSubjectLabel(assignment.subject, assignment.part))}</span>`).join("")}</div>`
    : '<p class="analysis-empty">No assignments match the selected filters.</p>';
  const overviewCards = [
    ["Overall Average", `${overview.average.toFixed(2)}%`],
    ["Pass Rate", `${overview.passPercentage.toFixed(2)}%`],
    ["Student Improvement", `${growth.averageDelta >= 0 ? "+" : ""}${growth.averageDelta.toFixed(2)} pts`],
    ["Failure Rate", `${overview.failureRate.toFixed(2)}%`],
    ["Data Completion", `${completionPercentage(completion.marks).toFixed(2)}%`],
    ["Students Needing Support", support.length],
    ["Performance Rating", `${performanceRating.rating.toFixed(1)} / 5`],
    ["Total Subject Entries", overview.total],
    ["Passed Subject Entries", overview.passed],
    ["Failed / Absent Entries", overview.failed],
    ["Highest", `${overview.highest.toFixed(2)}%`],
    ["Lowest", `${overview.lowest.toFixed(2)}%`],
    ["Distinction", overview.distinction],
    ["Comparable Growth Records", growth.records.length]
  ];
  const filledStars = Math.round(performanceRating.rating);
  els.teacherAnalyticsOverview.innerHTML = overviewCards
    .map(([label, value]) => `<article${label === "Performance Rating"
      ? ' class="teacher-rating-card" title="35% overall average, 35% pass rate, 20% marks completion, and 10% student improvement"'
      : ""}><span>${label}</span><strong>${value}</strong>${label === "Performance Rating"
      ? `<small class="teacher-stars" aria-label="${performanceRating.rating.toFixed(1)} out of 5 stars">${"★".repeat(filledStars)}${"☆".repeat(5 - filledStars)}</small>`
      : ""}</article>`).join("");
  els.teacherAnalyticsTrendChart.innerHTML = analysisLineChart(trend);
  els.teacherAnalyticsPassChart.innerHTML = analysisDonutChart([
    { label: "Passed entries", value: overview.passed, color: "#157347" },
    { label: "Failed entries", value: Math.max(0, overview.failed - overview.absent), color: "#c2413b" },
    { label: "Absent entries", value: overview.absent, color: "#697586" }
  ], `${overview.passPercentage.toFixed(1)}%`);
  els.teacherAnalyticsClassChart.innerHTML = analysisBarChart(classMetrics, "average", "label");
  els.teacherAnalyticsComparisonChart.innerHTML = teacherComparisonChart(comparisons);
  const sortedClasses = [...classMetrics].sort((a, b) =>
    (b.passPercentage - a.passPercentage) || (b.average - a.average));
  const subjectScope = [...new Set(assignments.map((assignment) =>
    teacherSubjectLabel(assignment.subject, assignment.part)))].join(", ") || "assigned subjects";
  const strongestText = sortedClasses[0]
    ? `${sortedClasses[0].className} ${sortedClasses[0].subjectLabel} showed the strongest selected performance`
    : "No strongest class can be identified until marks are completed";
  const focusText = sortedClasses.length > 1
    ? `${sortedClasses.at(-1).className} ${sortedClasses.at(-1).subjectLabel} needs the most attention`
    : "the selected assignment should be monitored against future examinations";
  els.teacherAnalyticsInsightSummary.textContent =
    `${teacherPossessiveLabel} ${subjectScope} recorded an overall average of ${overview.average.toFixed(2)}% `
    + `with a pass rate of ${overview.passPercentage.toFixed(2)}%. ${strongestText}, while ${focusText}. `
    + (growth.records.length
      ? `Comparable students changed by an average of ${growth.averageDelta >= 0 ? "+" : ""}${growth.averageDelta.toFixed(2)} points.`
      : "More comparable examination data is needed to measure student improvement.");
  els.teacherAnalyticsClassHighlight.textContent = sortedClasses.length > 1
    ? `Strongest: ${sortedClasses[0].className} ${sortedClasses[0].subjectLabel} | Needs attention: ${sortedClasses.at(-1).className} ${sortedClasses.at(-1).subjectLabel}`
    : sortedClasses.length
      ? `${sortedClasses[0].className} ${sortedClasses[0].subjectLabel}: ${sortedClasses[0].average.toFixed(2)}% average`
      : "No completed marks";
  els.teacherAnalyticsClassBody.innerHTML = classMetrics.length
    ? classMetrics.map((metric) => `<tr>
      <td>${escapeHtml(metric.className)}</td><td>${escapeHtml(metric.subjectLabel)}</td>
      <td>${metric.average.toFixed(2)}%</td><td>${metric.passPercentage.toFixed(2)}%</td>
      <td>${metric.highest.toFixed(2)}%</td><td>${metric.lowest.toFixed(2)}%</td><td>${metric.failed}</td>
    </tr>`).join("")
    : '<tr><td colspan="7">Add teacher assignments and completed marks to view performance.</td></tr>';
  const completionItems = [
    ["Marks", completion.marks],
    ["Attendance", completion.attendance],
    ["Physical Measurement", completion.measurement]
  ];
  els.teacherAnalyticsCompletion.innerHTML = completionItems.map(([label, item]) => `
    <article><span>${label}</span><strong>${item.completed} / ${item.expected}</strong>
    <div class="teacher-completion-track"><i style="width:${completionPercentage(item)}%"></i></div>
    <small>${completionPercentage(item).toFixed(2)}% complete | ${Math.max(0, item.expected - item.completed)} missing</small></article>`).join("");
  els.teacherAnalyticsLastUpdated.textContent = completion.lastUpdated
    ? `Last update: ${new Date(completion.lastUpdated.updatedAt).toLocaleString()} by ${completion.lastUpdated.updatedBy || "Unknown"}`
    : "No recorded update timestamp";
  els.teacherAnalyticsSupportBody.innerHTML = support.length
    ? support.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.className)}</td>
      <td>${escapeHtml(teacherSubjectLabel(item.subjectName, item.partName))}</td><td>${item.present ? `${item.percentage.toFixed(2)}%` : "-"}</td>
      <td>${item.present ? (item.passed ? "Pass" : "Fail") : "Absent"}</td><td>${escapeHtml(item.reasons.join(", "))}</td></tr>`).join("")
    : '<tr><td colspan="6">No students currently meet the support criteria.</td></tr>';
  const supportByClass = classNames.map((className) => ({
    className,
    count: support.filter((item) => item.className === className).length
  })).filter((item) => item.count);
  els.teacherAnalyticsSupportChart.innerHTML = teacherSupportBarChart(supportByClass);

  const strengths = [];
  const weaknesses = [];
  const recommendations = [];
  if (overview.passPercentage >= 80) strengths.push(`The selected assignments have a ${overview.passPercentage.toFixed(2)}% pass rate.`);
  if (growth.improved) strengths.push(`${growth.improved} comparable student record(s) improved by at least 5 points.`);
  if (sortedClasses[0]) strengths.push(`${sortedClasses[0].className} ${sortedClasses[0].subjectLabel} is the strongest selected assignment.`);
  if (overview.failureRate > 20) weaknesses.push(`The failure and absence rate is ${overview.failureRate.toFixed(2)}%.`);
  if (growth.declined) weaknesses.push(`${growth.declined} comparable student record(s) declined by at least 5 points.`);
  if (completionPercentage(completion.marks) < 100) weaknesses.push(`${completion.marks.expected - completion.marks.completed} expected mark entries are missing.`);
  if (support.length) recommendations.push(`Prepare focused support plans for the ${support.length} student(s) listed.`);
  if (growth.declined) recommendations.push("Review declining students against attendance, prior attainment, and assessment difficulty.");
  if (completionPercentage(completion.marks) < 100) recommendations.push("Complete missing marks before using this report for planning.");
  if (!strengths.length) strengths.push("More completed and comparable records are needed to identify a clear strength.");
  if (!weaknesses.length) weaknesses.push("No major concern is visible in the selected data.");
  if (!recommendations.length) recommendations.push("Continue regular monitoring and share effective classroom practices.");
  els.teacherAnalyticsStrengths.innerHTML = strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  els.teacherAnalyticsWeaknesses.innerHTML = weaknesses.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  els.teacherAnalyticsRecommendations.innerHTML = recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

async function downloadTeacherAnalysisPDF() {
  if (!isAdmin() || !teacherAnalyticsCurrentData || !window.html2canvas || !window.jspdf?.jsPDF) {
    showToast("Teacher analysis is not ready for PDF download.");
    return;
  }
  const button = els.downloadTeacherAnalysisPdfBtn;
  if (button.disabled) return;
  const previousText = button.textContent;
  let capture = null;
  try {
    button.disabled = true;
    button.textContent = "Generating Teacher Analysis PDF...";
    capture = els.teacherAnalyticsReport.cloneNode(true);
    capture.classList.add("teacher-analysis-pdf-capture");
    document.body.appendChild(capture);
    const canvas = await window.html2canvas(capture, {
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
    const width = pageWidth - margin * 2;
    const height = (canvas.height * width) / canvas.width;
    const printableHeight = pageHeight - margin * 2;
    const image = canvas.toDataURL("image/jpeg", 0.94);
    let offset = 0;
    let page = 0;
    while (offset < height) {
      if (page) pdf.addPage();
      pdf.addImage(image, "JPEG", margin, margin - offset, width, height, undefined, "FAST");
      offset += printableHeight;
      page += 1;
    }
    const data = teacherAnalyticsCurrentData;
    const teacher = els.teacherAnalyticsTeacherSelect.value;
    pdf.save(`Teacher_Analysis_${fileSafeName(teacher)}_${fileSafeName(data.exam)}_${fileSafeName(data.session)}.pdf`);
  } catch (error) {
    console.error("Could not generate teacher analysis PDF", error);
    showToast("Could not generate teacher analysis PDF. Please try again.");
  } finally {
    capture?.remove();
    button.disabled = false;
    button.textContent = previousText;
  }
}

function exportTeacherAnalysisExcel() {
  if (!isAdmin() || !teacherAnalyticsCurrentData || !window.XLSX) {
    showToast("Teacher analysis is not ready for Excel export.");
    return;
  }
  const data = teacherAnalyticsCurrentData;
  const workbook = window.XLSX.utils.book_new();
  const overviewMetricLabels = {
    total: "Total Subject Entries",
    passed: "Passed Subject Entries",
    failed: "Failed or Absent Entries",
    present: "Present Subject Entries",
    absent: "Absent Subject Entries"
  };
  const overviewRows = Object.entries(data.overview).map(([metric, value]) => ({
    Metric: overviewMetricLabels[metric] || formatFirebaseFieldName(metric),
    Value: typeof value === "number" ? Number(value.toFixed(2)) : value
  }));
  overviewRows.push(
    { Metric: "Performance Rating", Value: `${data.performanceRating.rating.toFixed(1)} / 5` },
    { Metric: "Performance Rating Score", Value: Number(data.performanceRating.score.toFixed(2)) }
  );
  const assignmentRows = data.assignments.map((item) => ({
    Teacher: item.teacherName,
    Class: item.className,
    Subject: item.subject,
    Part: item.part
  }));
  const classRows = data.classMetrics.map((item) => ({
    Class: item.className,
    Subject: item.subjectName,
    Part: item.partName,
    Average: Number(item.average.toFixed(2)),
    "Pass Percentage": Number(item.passPercentage.toFixed(2)),
    Highest: Number(item.highest.toFixed(2)),
    Lowest: Number(item.lowest.toFixed(2)),
    Passed: item.passed,
    Failed: item.failed,
    Absent: item.absent
  }));
  const supportRows = data.support.map((item) => ({
    "Student Name": item.name,
    Class: item.className,
    Subject: item.subjectName,
    Part: item.partName,
    Percentage: item.present ? Number(item.percentage.toFixed(2)) : "",
    Status: item.present ? (item.passed ? "Pass" : "Fail") : "Absent",
    Reason: item.reasons.join(", ")
  }));
  const completionRows = ["marks", "attendance", "measurement"].map((key) => ({
    Area: formatFirebaseFieldName(key),
    Completed: data.completion[key].completed,
    Expected: data.completion[key].expected,
    "Completion Percentage": Number(completionPercentage(data.completion[key]).toFixed(2)),
    Missing: Math.max(0, data.completion[key].expected - data.completion[key].completed)
  }));
  [
    ["Overview", overviewRows],
    ["Assignments", assignmentRows],
    ["Class Performance", classRows],
    ["Support Students", supportRows],
    ["Data Completion", completionRows]
  ].forEach(([name, rows]) => {
    window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(rows), name);
  });
  window.XLSX.writeFile(
    workbook,
    `Teacher_Analysis_${fileSafeName(els.teacherAnalyticsTeacherSelect.value)}_${fileSafeName(data.session)}.xlsx`
  );
}

function printTeacherAnalysis() {
  if (!isAdmin() || !teacherAnalyticsCurrentData) {
    showToast("Teacher analysis is not ready to print.");
    return;
  }
  startPrintMode("print-teacher-analysis");
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
    captureSource.querySelectorAll(".analysis-growth-table-wrap, .analysis-risk-table-wrap, #analysisSupportTableWrap")
      .forEach((table) => table.classList.remove("hidden"));
    captureSource.querySelectorAll(".analysis-list-toggle").forEach((toggle) => toggle.remove());
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
  const overviewRows = [
    { Metric: "Growth Focus Class", Value: data.progressClassFilter },
    { Metric: "Growth First Exam", Value: data.progressFromExam },
    { Metric: "Growth Compare With", Value: data.progressToExam },
    { Metric: "Performance Change Session", Value: data.performanceSession },
    { Metric: "Performance Change Class", Value: data.performanceClassFilter },
    { Metric: "Performance Change First Exam", Value: data.performanceFromExam },
    { Metric: "Performance Change Comparison Exam", Value: data.performanceToExam },
    { Metric: "Performance Change Subject", Value: data.performanceSubject },
    ...Object.entries(data.overview).map(([metric, value]) => ({ Metric: formatFirebaseFieldName(metric), Value: value }))
  ];
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
  const growthRows = data.growthRecords.map((record) => ({
    "Roll Number": record.roll,
    Name: record.name,
    Class: record.className,
    "First Exam": record.first.exam,
    "Latest Exam": record.latest.exam,
    "First Percentage": record.first.percentage,
    "Latest Percentage": record.latest.percentage,
    Change: record.delta,
    "Marks Change": roundedAnalysisMarkChange(record.markDelta),
    "Subject Mark Changes": formatAnalysisSubjectChanges(record.subjectChanges),
    Trend: record.trend
  }));
  const warningRows = data.earlyWarning.map((record) => ({
    "Roll Number": record.roll,
    Name: record.name,
    Class: record.className,
    "Latest Percentage": record.latest?.percentage ?? "",
    Change: record.appearedCount >= 2 ? record.delta : "",
    "Missed Exams": record.missedExams,
    "Failed Exams": record.failedExams,
    "Weak Subjects": record.weakSubjects.join(", "),
    Risk: record.riskLevel,
    Reasons: record.riskReasons.join(", ")
  }));
  const performanceRows = data.performanceChange.records.map((record) => ({
    "Student Name": record.name,
    "Roll Number": record.roll,
    Class: record.className,
    "First Exam Percentage": Number(record.first.percentage.toFixed(2)),
    "Comparison Exam Percentage": Number(record.comparison.percentage.toFixed(2)),
    "Percentage Change": Number(record.percentageChange.toFixed(2)),
    "First Exam Class Average": Number(record.firstClassAverage.toFixed(2)),
    "Comparison Exam Class Average": Number(record.comparisonClassAverage.toFixed(2)),
    "First Difference from Class Average": Number(record.firstRelative.toFixed(2)),
    "Comparison Difference from Class Average": Number(record.comparisonRelative.toFixed(2)),
    "Change in Difference from Class Average": Number(record.relativeChange.toFixed(2)),
    Status: record.classification,
    Interpretation: performanceChangeInterpretation(record)
  }));
  const performanceSubjectRows = data.performanceChange.subjectMetrics.map((item) => ({
    Subject: item.subject,
    "First Exam Average Percentage": Number(item.firstAverage.toFixed(2)),
    "Comparison Exam Average Percentage": Number(item.comparisonAverage.toFixed(2)),
    "Average Change": Number(item.averageChange.toFixed(2)),
    "Highest Improvement": Number(item.highestImprovement.toFixed(2)),
    "Students Needing Attention": item.attention
  }));
  const performanceClassRows = data.performanceChange.classMetrics.map((item) => ({
    Class: item.className,
    "Students Compared": item.students,
    "First Exam Average Percentage": Number(item.firstAverage.toFixed(2)),
    "Comparison Exam Average Percentage": Number(item.comparisonAverage.toFixed(2)),
    "Average Change": Number(item.averageChange.toFixed(2)),
    "Progressing Well": item.progressing,
    "Stable Performance": item.stable,
    "Monitor Progress": item.monitor,
    "Additional Support Recommended": item.support
  }));
  const disclaimerRows = [{
    Note: "Performance Change compares standardized percentages and class-average context. Different examinations may vary in syllabus coverage, difficulty, and question pattern. This analysis should be used for support and planning, not for ranking students."
  }];
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(overviewRows), "Overview");
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(classRows), "Class Analysis");
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(subjectRows), "Subject Analysis");
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(growthRows), "Student Growth");
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(warningRows), "Early Warning");
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(performanceRows), "Performance Change");
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(performanceSubjectRows), "Performance Subjects");
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(performanceClassRows), "Performance Classes");
  window.XLSX.utils.book_append_sheet(workbook, window.XLSX.utils.json_to_sheet(disclaimerRows), "Analysis Note");
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
      format: layout.paperSize,
      compress: true,
      precision: 16
    });

    for (const [index, page] of pages.entries()) {
      const canvas = await captureResultPdfPage(page, layout);
      if (index > 0) pdf.addPage(layout.paperSize, layout.orientation);
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
  const classSixTerm = isClassSixTermPdf(className, exam);
  return {
    paperSize: "a3",
    orientation: landscape ? "landscape" : "portrait",
    pageWidth,
    pageHeight,
    margin,
    contentWidth: pageWidth - (margin * 2),
    contentHeight: pageHeight - (margin * 2),
    captureScale: 3,
    classSixTerm
  };
}

function paginateResultRows(rows, host, layout) {
  const pages = [];
  let rowIndex = 0;

  while (rowIndex < rows.length) {
    const page = createResultPdfPage({
      layout,
      includeSummary: pages.length === 0,
      rows
    });
    host.appendChild(page);
    const tableBody = page.querySelector("tbody");
    const removeAttendanceColumn = page.querySelector(".result-pdf-table")?.classList.contains("result-pdf-class-viii-term");

    applyResultPdfTableScale(page, 1);
    while (rowIndex < rows.length) {
      const row = createResultPdfBodyRow(rows[rowIndex], removeAttendanceColumn);
      tableBody.appendChild(row);
      applyResultPdfTableScale(page, 1);

      if (tableBody.rows.length > 1 && !resultPdfPageHeightFits(page)) {
        row.remove();
        break;
      }

      rowIndex += 1;
    }

    pages.push(page);
  }

  fitResultPdfPages(pages);
  return pages;
}

function createResultPdfBodyRow(sourceRow, removeAttendanceColumn) {
  const row = sourceRow.cloneNode(true);
  abbreviateResultPdfRow(row);
  if (removeAttendanceColumn) removeResultPdfRowColumnsByRole(row, ["attendance"]);
  return row;
}

function resultPdfPageHeightFits(page) {
  const body = page.querySelector(".result-pdf-table-body");
  const table = page.querySelector(".result-pdf-table");
  if (!body || !table) return true;
  return table.scrollHeight <= body.clientHeight + 1;
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
  const classSixTerm = table.classList.contains("result-pdf-class-six-term");
  const classOneTwoTerm = table.classList.contains("result-pdf-class-i-term");
  const classOnePdf = table.classList.contains("result-pdf-class-one");
  const classEightTerm = table.classList.contains("result-pdf-class-viii-term");
  const upperMiddleTerm = table.classList.contains("result-pdf-upper-middle-term");
  const compactTermMarks = table.classList.contains("result-pdf-compact-term-marks");
  const earlyYearsPdf = table.classList.contains("result-pdf-early-years");
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
    const referenceFontRoles = ["roll", "name", "subject", "component", "total", "percentage", "division"];
    if (classOneTwoTerm) referenceFontRoles.push("attendance");
    const classEightMarkOrGrade = !isHeader
      && classEightTerm
      && ["subject", "component", "grade"].includes(role);
    const classEightTotalOrPercentage = !isHeader
      && classEightTerm
      && ["total", "percentage"].includes(role);
    const compactTermMarkOrGrade = !isHeader
      && compactTermMarks
      && ["subject", "component", "grade"].includes(role);
    const compactTermTotalOrPercentage = !isHeader
      && compactTermMarks
      && ["total", "percentage"].includes(role);
    const compactTermSmallValue = !isHeader
      && compactTermMarks
      && ["attendance", "division", "result"].includes(role);
    const compactTermCenteredValue = !isHeader
      && compactTermMarks
      && ["subject", "component", "grade", "attendance", "total", "percentage", "division", "result"].includes(role);
    const earlyYearsCompactValue = !isHeader
      && earlyYearsPdf
      && ["subject", "attendance", "measurement"].includes(role);
    const classOneResultValue = !isHeader
      && classOnePdf
      && role === "result";
    const referenceCellTwelvePoint = !isHeader
      && referenceTwelvePoint
      && referenceFontRoles.includes(role);
    const pdfBaseFont = earlyYearsCompactValue
      ? 10
      : classOneResultValue
      ? 12
      : compactTermMarkOrGrade
      ? 9
      : compactTermTotalOrPercentage
      ? 10.5
      : compactTermSmallValue
      ? 9
      : classEightMarkOrGrade
      ? 9
      : classEightTotalOrPercentage
      ? 11
      : referenceCellTwelvePoint || (!isHeader && classSixTerm)
      ? 12
      : (!isHeader && baseFont === 10 ? 12 : baseFont);
    const pdfFont = earlyYearsCompactValue
      ? 10
      : classOneResultValue
      ? 12
      : compactTermMarkOrGrade
      ? 9
      : compactTermTotalOrPercentage
      ? 10.5
      : compactTermSmallValue
      ? 9
      : classEightMarkOrGrade
      ? 9
      : classEightTotalOrPercentage
      ? 11
      : referenceCellTwelvePoint || (!isHeader && classSixTerm)
      ? 12
      : Math.max(7, pdfBaseFont * scale);
    cell.style.setProperty("--result-pdf-cell-font", `${pdfFont}pt`);
    if (compactTermCenteredValue) {
      cell.style.setProperty("text-align", "center", "important");
      cell.style.setProperty("white-space", "nowrap", "important");
    }
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
      <p>${escapeHtml(resultPdfTitleText())}</p>
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
  table.appendChild(els.resultsHead.cloneNode(true));
  table.appendChild(document.createElement("tbody"));
  if (table.classList.contains("result-pdf-class-viii-term")) {
    removeResultPdfColumnsByRole(table, ["attendance"]);
  }
  fitResultPdfNameColumn(table, rows, layout);
  if (table.classList.contains("result-pdf-large-one-line")) {
    table.querySelectorAll("thead th br").forEach((breakElement) => breakElement.replaceWith(" "));
  }
  formatClassVIIIResultPdfHeaders(table);
  rebalanceUpperMiddleResultPdfColumns(table);
  rebalanceClassVIIIResultPdfColumns(table);
  abbreviateHighClassResultPdfHeaders(table, selectedClass(), selectedExam());
  abbreviateUnitTestResultPdfHeaders(table, selectedExam());
  markClassITermPdfHeaders(table);
  markClassSixTermPdfHeaders(table);
  tableBody.appendChild(table);
  page.appendChild(tableBody);

  const pageNumber = document.createElement("div");
  pageNumber.className = "result-pdf-page-number";
  page.appendChild(pageNumber);
  return page;
}

function removeResultPdfColumnsByRole(table, roles) {
  const roleSet = new Set(roles);
  table.querySelectorAll('colgroup[data-result-layout="true"] col').forEach((column) => {
    if (roleSet.has(column.dataset.resultRole || "")) column.remove();
  });
  table.querySelectorAll("thead th").forEach((cell) => {
    if (roleSet.has(cell.dataset.resultRole || "")) cell.remove();
  });
}

function removeResultPdfRowColumnsByRole(row, roles) {
  const roleSet = new Set(roles);
  [...row.cells].forEach((cell) => {
    if (roleSet.has(cell.dataset.resultRole || "")) cell.remove();
  });
}

function resultPdfTitleText() {
  const className = selectedClass();
  const exam = selectedExam();
  if (["Class I", "Class II", "Class III", "Class IV", "Class V", "Class VIII"].includes(className) && termExams.includes(exam)) {
    return `${className} ${exam} Result : ${state.academicSession}`;
  }
  return `${className} ${exam} Result : Academic Session ${formatAcademicSession(state.academicSession)}`;
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
  const compactMarksLayout = table.classList.contains("result-pdf-compact-term-marks");
  const maxNameWidth = compactMarksLayout ? 220 : 280;
  const minNameWidth = compactMarksLayout ? 96 : 108;
  const maxNamePercent = compactMarksLayout ? 18 : 24;
  const desiredNameWidth = Math.min(maxNameWidth, Math.max(minNameWidth, Math.ceil(longestNameWidth + 20)));
  const desiredPercent = Math.min(maxNamePercent, Math.max(8, (desiredNameWidth / tableWidthPx) * 100));
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
  const classOneToFive = ["Class I", "Class II", "Class III", "Class IV", "Class V"].includes(className);
  const classOneStyleTerm = classOneToFive && term;
  const upperMiddleTerm = ["Class VI", "Class VII", "Class VIII"].includes(className) && term;
  const compactTermMarks = upperMiddleTerm || (["Class IV", "Class V"].includes(className) && term);
  const largeOneLine = (
    ["LKG", "UKG"].includes(className)
    || ["Class I", "Class II", "Class III", "Class IV", "Class V", "Class VII", "Class VIII"].includes(className)
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
      "Class V",
      "Class VII",
      "Class VIII",
      "Class IX",
      "Class X"
    ].includes(className)
  );
  table.classList.toggle("result-pdf-lkg-class-viii", lowerClassPdf);
  table.classList.toggle("result-pdf-early-years", ["LKG", "UKG"].includes(className));
  table.classList.toggle("result-pdf-class-one", ["Class I", "Class II", "Class III", "Class IV", "Class V"].includes(className));
  table.classList.toggle("result-pdf-large-one-line", largeOneLine);
  table.classList.toggle("result-pdf-subject-head-one-line", subjectHeadOneLine);
  table.classList.toggle("result-pdf-high-abbreviated", highClassAbbreviated);
  table.classList.toggle("result-pdf-class-i-term", classOneStyleTerm || (className === "Class VIII" && term));
  table.classList.toggle("result-pdf-class-viii-term", className === "Class VIII" && term);
  table.classList.toggle("result-pdf-class-six-term", isClassSixTermPdf(className, exam));
  table.classList.toggle("result-pdf-upper-middle-term", upperMiddleTerm);
  table.classList.toggle("result-pdf-compact-term-marks", compactTermMarks);
}

function isClassSixTermPdf(className, exam) {
  return className === "Class VI" && termExams.includes(exam);
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
  if (!primaryUnitTests.includes(exam) && !table.classList.contains("result-pdf-class-six-term")) return;
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

function formatClassVIIIResultPdfHeaders(table) {
  if (!table.classList.contains("result-pdf-class-viii-term")) return;
  const replacements = {
    "SKILL DEVELOPMENT": "S. Development",
    "GRAND TOTAL": "G. TOTAL",
    GRANDTOTAL: "G. TOTAL"
  };
  table.querySelectorAll("thead th").forEach((cell) => {
    const label = cell.querySelector("span") || cell;
    const key = String(label.textContent || "").replace(/\s+/g, " ").trim().toUpperCase();
    const replacement = replacements[key];
    if (replacement) label.textContent = replacement;
    if (replacement === "S. Development") {
      cell.classList.add("result-pdf-skill-development-header");
    }
  });
}

function rebalanceUpperMiddleResultPdfColumns(table) {
  if (!table.classList.contains("result-pdf-compact-term-marks")) return;
  const columns = [...table.querySelectorAll('colgroup[data-result-layout="true"] col')];
  if (!columns.length) return;

  const columnLabels = Array.from({ length: columns.length }, () => []);
  getResultHeaderGrid(table, columns.length).forEach(({ cell, start, span }) => {
    const text = resultCellText(cell).toUpperCase();
    for (let index = start; index < Math.min(columns.length, start + span); index += 1) {
      if (text) columnLabels[index].push(text);
    }
  });

  const widths = columns.map((column) => Number.parseFloat(column.style.width) || 0);
  const targetByIndex = new Map();
  columnLabels.forEach((labels, index) => {
    const label = labels.join(" ");
    const role = columns[index].dataset.resultRole || "";
    if (label.includes("W.E.")) targetByIndex.set(index, Math.min(widths[index], 2.25));
    if (label.includes("S. DEVELOPMENT") || label.includes("SKILL DEVELOPMENT")) {
      targetByIndex.set(index, Math.max(widths[index], 3.4));
    }
    if (role === "attendance") targetByIndex.set(index, Math.min(widths[index], 2.5));
    if (role === "total") targetByIndex.set(index, Math.max(widths[index], 5.6));
    if (role === "percentage") targetByIndex.set(index, Math.max(widths[index], 4.8));
    if (role === "division") targetByIndex.set(index, Math.max(widths[index], 2.7));
    if (role === "result") targetByIndex.set(index, Math.max(widths[index], 3.7));
  });

  let delta = 0;
  targetByIndex.forEach((target, index) => {
    delta += target - widths[index];
    widths[index] = target;
  });

  if (delta > 0.01) {
    const shrinkable = columns
      .map((column, index) => ({ column, index }))
      .filter(({ column, index }) =>
        (column.dataset.resultRole || "") === "component"
        && widths[index] > 1.15
        && !targetByIndex.has(index));
    const capacity = shrinkable.reduce((sum, item) => sum + Math.max(0, widths[item.index] - 1.15), 0);
    shrinkable.forEach((item) => {
      if (!capacity) return;
      const reduction = Math.min(widths[item.index] - 1.15, delta * ((widths[item.index] - 1.15) / capacity));
      widths[item.index] -= reduction;
    });
  } else if (delta < -0.01) {
    const expandable = columns
      .map((column, index) => ({ column, index }))
      .filter(({ column }) => (column.dataset.resultRole || "") === "component");
    const addition = Math.abs(delta) / Math.max(1, expandable.length);
    expandable.forEach(({ index }) => {
      widths[index] += addition;
    });
  }

  const widthSum = widths.reduce((sum, width) => sum + width, 0) || 100;
  columns.forEach((column, index) => {
    column.style.width = `${(widths[index] / widthSum) * 100}%`;
  });
}

function rebalanceClassVIIIResultPdfColumns(table) {
  if (!table.classList.contains("result-pdf-class-viii-term")) return;
  const columns = [...table.querySelectorAll('colgroup[data-result-layout="true"] col')];
  if (!columns.length) return;

  const columnLabels = Array.from({ length: columns.length }, () => []);
  getResultHeaderGrid(table, columns.length).forEach(({ cell, start, span }) => {
    const text = resultCellText(cell).toUpperCase();
    for (let index = start; index < Math.min(columns.length, start + span); index += 1) {
      if (text) columnLabels[index].push(text);
    }
  });

  const widths = columns.map((column) => Number.parseFloat(column.style.width) || 0);
  const targetByIndex = new Map();
  columnLabels.forEach((labels, index) => {
    const label = labels.join(" ");
    const role = columns[index].dataset.resultRole || "";
    if (label.includes("W.E.")) targetByIndex.set(index, Math.min(widths[index], 2.45));
    if (label.includes("S. DEVELOPMENT")) targetByIndex.set(index, Math.max(widths[index], 3.65));
    if (role === "total") targetByIndex.set(index, Math.max(widths[index], 5.15));
    if (role === "percentage") targetByIndex.set(index, Math.max(widths[index], 4.15));
  });

  let delta = 0;
  targetByIndex.forEach((target, index) => {
    delta += target - widths[index];
    widths[index] = target;
  });

  if (delta > 0.01) {
    const shrinkable = columns
      .map((column, index) => ({ column, index }))
      .filter(({ column, index }) =>
        (column.dataset.resultRole || "") === "component"
        && widths[index] > 1.25
        && !targetByIndex.has(index));
    const capacity = shrinkable.reduce((sum, item) => sum + Math.max(0, widths[item.index] - 1.25), 0);
    shrinkable.forEach((item) => {
      if (!capacity) return;
      const reduction = Math.min(widths[item.index] - 1.25, delta * ((widths[item.index] - 1.25) / capacity));
      widths[item.index] -= reduction;
    });
  } else if (delta < -0.01) {
    const expandable = columns
      .map((column, index) => ({ column, index }))
      .filter(({ column }) => (column.dataset.resultRole || "") === "component");
    const addition = Math.abs(delta) / Math.max(1, expandable.length);
    expandable.forEach(({ index }) => {
      widths[index] += addition;
    });
  }

  const widthSum = widths.reduce((sum, width) => sum + width, 0) || 100;
  columns.forEach((column, index) => {
    column.style.width = `${(widths[index] / widthSum) * 100}%`;
  });
}

function abbreviateResultPdfRow(row) {
  row.querySelectorAll(".status-pill").forEach((status) => {
    if (String(status.textContent || "").trim().toLowerCase() === "simple pass") {
      status.textContent = "S.P.";
    }
  });
  row.querySelectorAll(".failed-mark").forEach((mark) => {
    if (String(mark.textContent || "").trim().toUpperCase() === "AB") {
      mark.classList.add("absent-mark");
    }
  });
}

function markClassITermPdfHeaders(table) {
  if (!table.classList.contains("result-pdf-class-i-term")) return;
  const verticalLabels = new Set(["ACTIVITIES", "UNIT TEST", "EXAM", "TOTAL", "W.E.", "G. TOTAL", "ATTND.", "DIV.", "RESULT"]);
  const svgNamespace = "http://www.w3.org/2000/svg";
  table.querySelectorAll("thead th").forEach((cell) => {
    const label = cell.querySelector("span") || cell;
    const text = String(label.textContent || "").replace(/\s+/g, " ").trim().toUpperCase();
    if (!verticalLabels.has(text)) return;
    cell.classList.add("vertical-header", "result-pdf-svg-header");
    cell.dataset.pdfHeaderLabel = text;
    cell.textContent = "";
    const svgHeight = cell.classList.contains("third-term-component-header") ? 184 : 128;
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.classList.add("result-pdf-vertical-svg");
    svg.setAttribute("viewBox", `0 0 18 ${svgHeight}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("aria-hidden", "true");
    const textNode = document.createElementNS(svgNamespace, "text");
    textNode.setAttribute("x", "9");
    textNode.setAttribute("y", String(svgHeight - 12));
    textNode.setAttribute("text-anchor", "start");
    textNode.setAttribute("dominant-baseline", "middle");
    textNode.setAttribute("transform", `rotate(-90 9 ${svgHeight - 12})`);
    textNode.textContent = text;
    svg.appendChild(textNode);
    cell.appendChild(svg);
  });
}

function markClassSixTermPdfHeaders(table) {
  if (!table.classList.contains("result-pdf-class-six-term")) return;
  table.querySelectorAll("thead th").forEach((cell) => {
    const label = cell.querySelector("span") || cell;
    const text = String(label.textContent || "").replace(/\s+/g, " ").trim().toUpperCase();
    if (["ATTND.", "G. TOTAL", "DIV."].includes(text)) {
      cell.classList.add("result-pdf-small-header");
      label.classList.add("result-pdf-small-header-label");
    }
  });
}

function createResultPdfSummary(rows) {
  const summary = document.createElement("div");
  summary.className = "result-summary result-pdf-summary";
  const records = rows.map((row) => {
    const cells = row.querySelectorAll("td");
    return {
      notEnrolled: row.dataset.notEnrolled === "true",
      result: String(cells[cells.length - 1]?.textContent || "").trim(),
      division: String(cells[cells.length - 2]?.textContent || "").trim()
    };
  }).filter((record) => !record.notEnrolled);
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

async function captureResultPdfPage(page, layout = {}) {
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  return window.html2canvas(page, {
    backgroundColor: "#ffffff",
    scale: layout.captureScale || 3,
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
  if (!canViewMarksheet()) {
    showToast("Publish the marksheets before printing.");
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
  if (!canViewMarksheet()) {
    showToast("Publish the marksheets before printing.");
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
  if (!canViewMarksheet()) {
    showToast("Publish the marksheets before saving PDF.");
    return;
  }
  showToast('Choose "Save as PDF" in the print dialog.');
  printView("marksheets");
}

async function downloadMarksheetPDF() {
  if (!canViewMarksheet()) {
    showToast("Publish the marksheets before downloading.");
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
  document.body.classList.remove("print-results", "print-marksheets", "print-current-marksheet", "print-analysis", "print-teacher-analysis", "print-teacher-assessment");
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
  document.body.classList.remove("print-results", "print-marksheets", "print-current-marksheet", "print-analysis", "print-teacher-analysis", "print-teacher-assessment");
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
    <tr class="${dashboardStudentHighlight === String(student.roll) ? "student-search-highlight" : ""}" data-student-roll="${escapeAttr(student.roll)}">
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
  if (dashboardStudentHighlight) {
    document.querySelector(`[data-student-roll="${CSS.escape(dashboardStudentHighlight)}"]`)
      ?.scrollIntoView({ block: "center", inline: "nearest" });
  }
}

function sortedStudents() {
  return [...(state.classes[selectedClass()] || [])].sort((a, b) => a.roll - b.roll);
}

function getStatus(value, passMarks) {
  if (isNotEnrolledEntry(value)) return { label: "Not yet enrolled", className: "not-enrolled" };
  if (isAbsentEntry(value) || value === "" || value === undefined || value === null) return { label: "Absent", className: "absent" };
  const number = Number(value);
  if (Number.isNaN(number)) return { label: "Absent", className: "absent" };
  return number >= passMarks
    ? { label: "Pass", className: "pass" }
    : { label: "Fail", className: "fail" };
}

function getGradeStatus(value) {
  if (isNotEnrolledEntry(value)) return { label: "Not yet enrolled", className: "not-enrolled" };
  if (isAbsentEntry(value) || value === "" || value === undefined || value === null) return { label: "Absent", className: "absent" };
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
    return !isNotEnrolledEntry(value) && getStatus(value, requiredPassMarks).className !== "pass";
  }).length;
  const gradeFailCount = gradeValues.filter((value) =>
    !isNotEnrolledEntry(value) && getGradeStatus(value).className !== "pass").length;
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

async function persistResultPublication(shouldPublish) {
  if (publicationSaveInProgress) return;
  if (!isAdmin()) {
    showToast(`Only admin can ${shouldPublish ? "publish" : "unpublish"} results.`);
    return;
  }
  const className = selectedClass();
  const exam = selectedExam();
  const key = examKey(className, exam);
  if (hasUnsavedResultChanges(className, exam)) {
    showToast(`Save ${className} ${exam} changes before ${shouldPublish ? "publishing" : "unpublishing"}.`);
    return;
  }

  const previousValue = state.published?.[key];
  const publicationValue = shouldPublish ? { publishedAt: new Date().toISOString() } : null;
  publicationSaveInProgress = true;
  state.published = state.published || {};
  if (shouldPublish) state.published[key] = publicationValue;
  else delete state.published[key];
  syncActiveSessionData();
  localStorage.setItem(storageKey, JSON.stringify(state));
  render();

  try {
    const session = currentSessionKey(state.academicSession);
    if (window.MarkHubFirebase?.saveSplitPublication) {
      await window.MarkHubFirebase.saveSplitPublication({
        session,
        type: "result",
        className,
        exam,
        key,
        value: shouldPublish ? publicationValue : null,
        updatedAt: publicationValue?.publishedAt || new Date().toISOString(),
        updatedBy: currentUser?.name || currentUser?.username || "Unknown"
      });
      lastSyncedFirebaseStateJson = JSON.stringify(state);
      if (pendingFirebaseStateJson === lastSyncedFirebaseStateJson) pendingFirebaseStateJson = "";
    } else if (window.MarkHubFirebase?.saveAppState) {
      await window.MarkHubFirebase.saveAppState(structuredClone(state));
      lastSyncedFirebaseStateJson = JSON.stringify(state);
    } else {
      throw new Error("Firebase is not ready.");
    }
    showToast(`${className} ${exam} ${shouldPublish ? "published" : "unpublished"}.`);
  } catch (error) {
    console.error(`[Firestore] Could not ${shouldPublish ? "publish" : "unpublish"} result`, error);
    if (previousValue) state.published[key] = previousValue;
    else delete state.published[key];
    syncActiveSessionData();
    localStorage.setItem(storageKey, JSON.stringify(state));
    showToast(firestoreSaveErrorMessage(`${shouldPublish ? "publish" : "unpublish"} the result`, error));
  } finally {
    publicationSaveInProgress = false;
    render();
  }
}

function publishCurrentResult() {
  return persistResultPublication(true);
}

function toggleResultPublication() {
  if (isPublished()) {
    unpublishCurrentResult();
  } else {
    publishCurrentResult();
  }
}

function unpublishCurrentResult() {
  return persistResultPublication(false);
}

async function persistMarksheetPublication(shouldPublish) {
  if (publicationSaveInProgress) return;
  if (!isAdmin()) {
    showToast(`Only admin can ${shouldPublish ? "publish" : "unpublish"} marksheets.`);
    return;
  }
  const className = selectedClass();
  const exam = selectedExam();
  const key = examKey(className, exam);
  if (hasUnsavedResultChanges(className, exam)) {
    showToast(`Save ${className} ${exam} changes before ${shouldPublish ? "publishing" : "unpublishing"} marksheets.`);
    return;
  }

  const previousValue = state.publishedMarksheets?.[key];
  const publicationValue = shouldPublish ? { publishedAt: new Date().toISOString() } : null;
  publicationSaveInProgress = true;
  state.publishedMarksheets = state.publishedMarksheets || {};
  if (shouldPublish) state.publishedMarksheets[key] = publicationValue;
  else delete state.publishedMarksheets[key];
  syncActiveSessionData();
  localStorage.setItem(storageKey, JSON.stringify(state));
  render();

  try {
    const session = currentSessionKey(state.academicSession);
    if (window.MarkHubFirebase?.saveSplitPublication) {
      await window.MarkHubFirebase.saveSplitPublication({
        session,
        type: "marksheet",
        className,
        exam,
        key,
        value: shouldPublish ? publicationValue : null,
        updatedAt: publicationValue?.publishedAt || new Date().toISOString(),
        updatedBy: currentUser?.name || currentUser?.username || "Unknown"
      });
      lastSyncedFirebaseStateJson = JSON.stringify(state);
      if (pendingFirebaseStateJson === lastSyncedFirebaseStateJson) pendingFirebaseStateJson = "";
    } else if (window.MarkHubFirebase?.saveAppState) {
      await window.MarkHubFirebase.saveAppState(structuredClone(state));
      lastSyncedFirebaseStateJson = JSON.stringify(state);
    } else {
      throw new Error("Firebase is not ready.");
    }
    showToast(`${className} ${exam} marksheets ${shouldPublish ? "published" : "unpublished"}.`);
  } catch (error) {
    console.error(`[Firestore] Could not ${shouldPublish ? "publish" : "unpublish"} marksheets`, error);
    if (previousValue) state.publishedMarksheets[key] = previousValue;
    else delete state.publishedMarksheets[key];
    syncActiveSessionData();
    localStorage.setItem(storageKey, JSON.stringify(state));
    showToast(firestoreSaveErrorMessage(`${shouldPublish ? "publish" : "unpublish"} the marksheets`, error));
  } finally {
    publicationSaveInProgress = false;
    render();
  }
}

function toggleMarksheetPublication() {
  return persistMarksheetPublication(!isMarksheetPublished());
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
    if (values.length && values.every(isNotEnrolledEntry)) return;
    const markValues = subjectsForMarks.map((subject) => getStudentMark(student, subject).value);
    const resultMarkValues = outcomeMarkValues(student, subjectsForMarks);
    const gradeValues = subjects.filter((subject) => isGradeSubject(subject)).map((subject) => getStudentMark(student, subject).value);
    const numbers = markValues.filter(isScoredEntry).map(Number).filter(Number.isFinite);
    const total = Math.round(numbers.reduce((sum, value) => sum + value, 0));
    const percent = roundUpPercentage(total, marksMaximum(subjectsForMarks));
    const appeared = values.some(isScoredEntry);
    const calculatedOutcome = calculateOutcome(resultMarkValues, passMarks, Number(percent), selectedClass(), selectedExam(), gradeValues);
    const outcome = appeared ? calculatedOutcome : emptyResultOutcome();
    const attendance = getStudentAttendance(student);
    const measurement = getStudentMeasurement(student);
    rows.push([
      student.roll,
      student.name,
      ...values.map((value) => entryDisplayValue(value, "AB")),
      ...(term ? [isScoredEntry(attendance) ? `${attendance}/${workingDays}` : entryDisplayValue(attendance, "")] : []),
      ...(showMeasurements ? [entryDisplayValue(measurement.height, ""), entryDisplayValue(measurement.weight, "")] : []),
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
  const numbers = markValues.filter(isScoredEntry).map(Number).filter((value) => !Number.isNaN(value));
  const total = Math.round(numbers.reduce((sum, value) => sum + value, 0));
  const maximumTotal = marksMaximum(subjectsForMarks);
  const percentage = roundUpPercentage(total, maximumTotal);
  const notEnrolled = values.length > 0 && values.every(isNotEnrolledEntry);
  const appeared = !notEnrolled && values.some(isScoredEntry);
  const calculatedOutcome = calculateOutcome(resultMarkValues, getPassMarks(), Number(percentage), selectedClass(), selectedExam(), gradeValues);

  return {
    total,
    maximumTotal,
    percentage,
    outcome: appeared ? calculatedOutcome : emptyResultOutcome(),
    appeared,
    notEnrolled,
    structured: false
  };
}

function calculateStructuredExcelRecord(student) {
  const subjects = currentSubjects();
  const enrollmentValues = subjects.map((subject) => getStudentMark(student, subject).value);
  const notEnrolled = enrollmentValues.length > 0 && enrollmentValues.every(isNotEnrolledEntry);
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
  const appeared = !notEnrolled && enrollmentValues.some(isScoredEntry);

  return {
    total,
    maximumTotal,
    percentage,
    outcome: appeared ? calculateStructuredTermOutcome(resultSubjects, Number(percentage), gradeValues) : emptyResultOutcome(),
    appeared,
    notEnrolled,
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
      if (!["A", "B", "C", "D", "E", "-1", "-2"].includes(grade)) {
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
    const className = selectedClass();
    const rows = parseCsv(await file.text());
    const result = mergeStudentsFromCsv(rows);
    await saveClassStudents(className);
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
  unsavedAttendanceSections.clear();
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

async function addStudent(event) {
  event.preventDefault();
  const className = selectedClass();
  const roll = Number(document.querySelector("#rollInput").value);
  const idNo = document.querySelector("#idNoInput").value.trim();
  const name = document.querySelector("#nameInput").value.trim();
  let dateOfBirth = document.querySelector("#dobInput").value;
  const fatherName = document.querySelector("#fatherNameInput").value.trim();
  const motherName = document.querySelector("#motherNameInput").value.trim();
  const address = document.querySelector("#addressInput").value.trim();
  const pen = document.querySelector("#penInput").value.trim();
  const aadhaarNo = document.querySelector("#aadhaarNoInput").value.trim();
  const students = state.classes[className];

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
  const message = editingStudentRoll !== null ? `${name} updated.` : `${name} added.`;
  try {
    await saveClassStudents(className);
    cancelStudentEdit();
    render();
    showToast(message);
  } catch (error) {
    console.error("[Firestore] Could not save student list", error);
    showToast(firestoreSaveErrorMessage("save student details", error));
  }
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

async function removeStudent(roll) {
  const className = selectedClass();
  const student = (state.classes[className] || []).find((entry) => entry.roll === roll);
  const studentLabel = student ? `${student.name} (Roll No. ${student.roll})` : `Roll No. ${roll}`;
  const confirmed = window.confirm(`Remove ${studentLabel}? This will also delete this student's marks, attendance, and measurements for ${selectedClass()}.`);
  if (!confirmed) return;

  state.classes[className] = state.classes[className].filter((student) => student.roll !== roll);
  Object.keys(state.marks).forEach((key) => {
    if (key.startsWith(`${className}::`)) {
      delete state.marks[key][String(roll)];
    }
  });
  Object.keys(state.attendance).forEach((key) => {
    if (key.startsWith(`${className}::`)) {
      delete state.attendance[key][String(roll)];
    }
  });
  Object.keys(state.measurements).forEach((key) => {
    if (key.startsWith(`${className}::`)) {
      delete state.measurements[key][String(roll)];
    }
  });
  try {
    await saveClassStudents(className);
    render();
    showToast("Student removed.");
  } catch (error) {
    console.error("[Firestore] Could not remove student", error);
    showToast(firestoreSaveErrorMessage("remove student", error));
  }
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

function renderTeacherAssessment() {
  window.TeacherAssessmentModule?.render();
}

window.TeacherAssessmentApp = {
  getState: () => state,
  saveState,
  isAdmin,
  showToast,
  startPrintMode,
  fileSafeName,
  formatAcademicSession,
  currentSessionKey,
  classNames,
  teacherAssessmentSubjectNames,
  getActiveView: () => activeView,
  getCurrentUser: () => currentUser
};

init();
