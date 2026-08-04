(function () {
  const storageKey = "results-desk-state-v1";
  const authKey = "markhub-current-user-v1";
  const mobileAuthKey = "markhub-mobile-current-user-v1";
  const terms = ["First Term", "Second Term", "Third Term"];
  const fallbackSession = "2026 - 2027";
  const tableBody = document.querySelector("#perfectAttendanceBody");
  const classFilter = document.querySelector("#attendanceHonorClassFilter");
  const countLabel = document.querySelector("#attendanceHonorCount");
  const totalLabel = document.querySelector("#attendanceHonorTotal");
  const percentLabel = document.querySelector("#attendanceHonorPercent");
  const mobileMenuBtn = document.querySelector("#mobileMenuBtn");
  const mobileMenuCloseBtn = document.querySelector("#mobileMenuCloseBtn");
  const mobileNavDrawer = document.querySelector("#mobileNavDrawer");
  const mobileNavOverlay = document.querySelector("#mobileNavOverlay");
  const classNames = [
    "LKG", "UKG", "Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI",
    "Class VII", "Class VIII", "Class IX", "Class X"
  ];
  let unsubscribeAppState = null;
  let unsubscribeSplitSession = null;
  let splitSessionKey = "";
  let splitAttendanceReady = false;
  let splitRosterReady = false;
  let stablePerfectStudents = [];
  let currentState = {};
  let lastRenderedStateJson = "";
  const useSplitSessionLiveSync = true;
  const useCompactAppStateLiveSync = false;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function currentSessionKey(session) {
    return String(session || fallbackSession).trim() || fallbackSession;
  }

  function getActiveSessionData(state) {
    const session = currentSessionKey(state.academicSession);
    const sessionData = state.sessions?.[session];
    const profileClasses = classesFromStudentProfiles(state, session);
    return {
      academicSession: session,
      classes: mergeClassRosters(
        mergeClassRosters(state.classes || {}, sessionData?.classes || {}),
        profileClasses
      ),
      workingDays: { ...(state.workingDays || {}), ...(sessionData?.workingDays || {}) },
      attendance: { ...(state.attendance || {}), ...(sessionData?.attendance || {}) }
    };
  }

  function mergeClassRosters(baseClasses = {}, profileClasses = {}) {
    const merged = { ...(baseClasses || {}) };
    Object.entries(profileClasses || {}).forEach(([className, students]) => {
      const existing = Array.isArray(merged[className]) ? merged[className] : [];
      const byKey = new Map();
      existing.forEach((student) => {
        if (!student?.name) return;
        byKey.set(studentListKey({ ...student, className }), student);
      });
      students.forEach((student) => {
        if (!student?.name) return;
        byKey.set(studentListKey({ ...student, className }), student);
      });
      merged[className] = Array.from(byKey.values())
        .sort((a, b) => Number(a.roll) - Number(b.roll));
    });
    return merged;
  }

  function mergeStudentEnrolments(baseEnrolments = {}, incomingEnrolments = {}) {
    const merged = { ...(baseEnrolments || {}) };
    Object.entries(incomingEnrolments || {}).forEach(([session, sessionEnrolments]) => {
      const sessionKey = currentSessionKey(session);
      const existingSession = merged[sessionKey] || {};
      const incomingSession = sessionEnrolments || {};
      const hasIncomingStudents = Object.keys(incomingSession).length > 0;
      if (!hasIncomingStudents && Object.keys(existingSession).length > 0) return;
      merged[sessionKey] = { ...existingSession, ...incomingSession };
    });
    return merged;
  }

  function classesFromStudentProfiles(state = {}, session) {
    const classes = {};
    const profiles = state.studentProfiles || {};
    const enrolments = state.studentEnrolments?.[currentSessionKey(session)] || {};
    Object.entries(enrolments).forEach(([studentId, enrolment]) => {
      const profile = profiles[studentId] || {};
      const className = canonicalClassLabel(enrolment.className);
      if (!classNames.includes(className)) return;
      const status = String(enrolment.studentStatus || "Active").trim();
      if (["Transferred", "Withdrawn", "Graduated", "Inactive", "Archived"].includes(status)) return;
      const name = String(profile.studentName || profile.name || enrolment.studentName || "").trim();
      if (!name) return;
      classes[className] = classes[className] || [];
      classes[className].push({
        name,
        roll: String(enrolment.rollNumber ?? enrolment.roll ?? "").trim(),
        idNo: String(profile.schoolIdNo || profile.idNo || "").trim()
      });
    });
    return classes;
  }

  function storeAndRenderState(nextState, renderOptions = {}) {
    currentState = nextState && typeof nextState === "object" ? nextState : {};
    localStorage.setItem(storageKey, JSON.stringify(currentState));
    const data = getActiveSessionData(currentState);
    renderCalculatedStudents(getPerfectAttendanceStudents(data, selectedClassFilter()), {
      preserveExisting: false,
      data,
      ...renderOptions
    });
    startSplitSessionListener(data.academicSession);
  }

  function storeStateOnly(nextState) {
    currentState = nextState && typeof nextState === "object" ? nextState : {};
    localStorage.setItem(storageKey, JSON.stringify(currentState));
  }

  function isRecord(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }

  function mergeAttendanceState(baseState = {}, incomingState = {}) {
    const base = isRecord(baseState) ? baseState : {};
    const incoming = isRecord(incomingState) ? incomingState : {};
    const nextState = {
      ...base,
      ...incoming,
      classes: mergeClassRosters(base.classes || {}, incoming.classes || {}),
      workingDays: { ...(base.workingDays || {}), ...(incoming.workingDays || {}) },
      attendance: { ...(base.attendance || {}), ...(incoming.attendance || {}) },
      studentProfiles: { ...(base.studentProfiles || {}), ...(incoming.studentProfiles || {}) },
      studentEnrolments: mergeStudentEnrolments(base.studentEnrolments || {}, incoming.studentEnrolments || {}),
      sessions: { ...(base.sessions || {}), ...(incoming.sessions || {}) }
    };

    Object.keys(nextState.sessions || {}).forEach((session) => {
      const baseSession = base.sessions?.[session] || {};
      const incomingSession = incoming.sessions?.[session] || {};
      nextState.sessions[session] = {
        ...baseSession,
        ...incomingSession,
        classes: mergeClassRosters(baseSession.classes || {}, incomingSession.classes || {}),
        workingDays: { ...(baseSession.workingDays || {}), ...(incomingSession.workingDays || {}) },
        attendance: { ...(baseSession.attendance || {}), ...(incomingSession.attendance || {}) }
      };
    });

    return nextState;
  }

  function mergeSplitPatchIntoState(baseState, patch = {}) {
    const nextState = baseState && typeof baseState === "object" ? { ...baseState } : {};
    const session = currentSessionKey(patch.session || nextState.academicSession);
    nextState.academicSession = currentSessionKey(nextState.academicSession || session);
    nextState.sessions = { ...(nextState.sessions || {}) };

    const existingSession = nextState.sessions[session] || {};
    const nextStudentEnrolments = patch.studentEnrolments
      ? mergeStudentEnrolments(nextState.studentEnrolments || {}, patch.studentEnrolments)
      : nextState.studentEnrolments;
    const sessionClasses = mergeClassRosters(nextState.classes || {}, existingSession.classes || {});
    const mergedSession = {
      ...existingSession,
      classes: patch.classes
        ? mergeClassRosters(sessionClasses, patch.classes)
        : sessionClasses,
      workingDays: patch.workingDays
        ? { ...(existingSession.workingDays || nextState.workingDays || {}), ...patch.workingDays }
        : (existingSession.workingDays || nextState.workingDays || {}),
      attendance: patch.attendance
        ? { ...(existingSession.attendance || nextState.attendance || {}), ...patch.attendance }
        : (existingSession.attendance || nextState.attendance || {})
    };

    nextState.studentProfiles = patch.studentProfiles
      ? { ...(nextState.studentProfiles || {}), ...patch.studentProfiles }
      : nextState.studentProfiles;
    nextState.studentEnrolments = nextStudentEnrolments;
    nextState.sessions[session] = mergedSession;
    if (currentSessionKey(nextState.academicSession) === session) {
      nextState.classes = mergedSession.classes;
      nextState.workingDays = mergedSession.workingDays;
      nextState.attendance = mergedSession.attendance;
    }
    return nextState;
  }

  function attendanceKey(className, term) {
    return `${className}::${term}`;
  }

  function splitDocLabel(id) {
    const encoded = String(id || "").replace(/_([0-9A-Fa-f]{2})/g, "%$1");
    try {
      return decodeURIComponent(encoded);
    } catch {
      return String(id || "");
    }
  }

  function normalizeLabel(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  }

  function canonicalClassLabel(value) {
    const normalized = normalizeLabel(splitDocLabel(value));
    const aliases = {
      lkg: "LKG",
      lowerkindergarten: "LKG",
      ukg: "UKG",
      upperkindergarten: "UKG",
      classi: "Class I",
      class1: "Class I",
      i: "Class I",
      one: "Class I",
      classii: "Class II",
      class2: "Class II",
      ii: "Class II",
      two: "Class II",
      classiii: "Class III",
      class3: "Class III",
      iii: "Class III",
      three: "Class III",
      classiv: "Class IV",
      class4: "Class IV",
      iv: "Class IV",
      four: "Class IV",
      classv: "Class V",
      class5: "Class V",
      v: "Class V",
      five: "Class V",
      classvi: "Class VI",
      class6: "Class VI",
      vi: "Class VI",
      six: "Class VI",
      classvii: "Class VII",
      class7: "Class VII",
      vii: "Class VII",
      seven: "Class VII",
      classviii: "Class VIII",
      class8: "Class VIII",
      viii: "Class VIII",
      eight: "Class VIII",
      classix: "Class IX",
      class9: "Class IX",
      ix: "Class IX",
      nine: "Class IX",
      classx: "Class X",
      class10: "Class X",
      x: "Class X",
      ten: "Class X"
    };
    return aliases[normalized] || String(value || "");
  }

  function attendanceKeyMatches(key, className, term) {
    const decoded = splitDocLabel(key);
    const parts = decoded.split("::");
    if (parts.length < 2) return false;
    const keyTerm = parts.slice(1).join("::").trim();
    return canonicalClassLabel(parts[0]) === canonicalClassLabel(className)
      && keyTerm === term;
  }

  function getClassAttendanceForTerm(data, className, term) {
    const attendance = data.attendance || {};
    const exactKey = attendanceKey(className, term);
    if (attendanceRecordHasEntries(attendance[exactKey])) return attendance[exactKey];

    const matchedKeys = Object.keys(attendance).filter((key) => attendanceKeyMatches(key, className, term));
    const populatedKey = matchedKeys.find((key) => attendanceRecordHasEntries(attendance[key]));
    if (populatedKey) return attendance[populatedKey] || {};
    if (attendance[exactKey]) return attendance[exactKey];
    return matchedKeys.length ? attendance[matchedKeys[0]] || {} : {};
  }

  function attendanceRecordHasEntries(record) {
    return record && typeof record === "object" && Object.keys(record).length > 0;
  }

  function isEnteredAttendanceValue(value) {
    return value !== "" && value !== undefined && value !== null && Number(value) !== -2;
  }

  function getClassAttendanceValue(classAttendance, roll) {
    const rollKey = String(roll);
    if (Object.prototype.hasOwnProperty.call(classAttendance, rollKey)) return classAttendance[rollKey];
    const numericRoll = Number(roll);
    if (!Number.isFinite(numericRoll)) return undefined;
    const matchedKey = Object.keys(classAttendance).find((key) => Number(key) === numericRoll);
    return matchedKey === undefined ? undefined : classAttendance[matchedKey];
  }

  function hasFullAttendance(student, className, data) {
    const studentAttendanceTerms = terms
      .map((term) => {
        const workingDays = Number(data.workingDays?.[term]);
        const classAttendance = getClassAttendanceForTerm(data, className, term);
        const attendance = getClassAttendanceValue(classAttendance, student.roll);
        return { term, workingDays, attendance };
      })
      .filter(({ workingDays, attendance }) => workingDays > 0 && isEnteredAttendanceValue(attendance));

    if (!studentAttendanceTerms.length) return false;

    return studentAttendanceTerms.every(({ workingDays, attendance }) =>
      Number(attendance) === workingDays);
  }

  function isStudentEnrolledForAttendance(student, className, data) {
    const enteredAttendanceValues = terms
      .map((term) => {
        const workingDays = Number(data.workingDays?.[term]);
        if (workingDays <= 0) return undefined;
        const classAttendance = getClassAttendanceForTerm(data, className, term);
        return getClassAttendanceValue(classAttendance, student.roll);
      })
      .filter((value) => value !== "" && value !== undefined && value !== null);

    return !enteredAttendanceValues.length
      || enteredAttendanceValues.some((value) => Number(value) !== -2);
  }

  function selectedClassFilter() {
    return classFilter?.value || "All Classes";
  }

  function studentListKey(student) {
    return [
      canonicalClassLabel(student?.className),
      String(student?.roll ?? "").trim(),
      normalizeLabel(student?.name)
    ].join("::");
  }

  function mergeStudentLists(previous = [], next = []) {
    const merged = new Map();
    previous.forEach((student) => {
      if (student?.name) merged.set(studentListKey(student), student);
    });
    next.forEach((student) => {
      if (student?.name) merged.set(studentListKey(student), student);
    });
    return Array.from(merged.values()).sort((a, b) => {
      const classOrder = classNames.indexOf(a.className) - classNames.indexOf(b.className);
      return classOrder || Number(a.roll) - Number(b.roll);
    });
  }

  function filterStableStudents(classFilterValue = selectedClassFilter()) {
    return stablePerfectStudents.filter((student) =>
      classFilterValue === "All Classes" || canonicalClassLabel(student.className) === canonicalClassLabel(classFilterValue));
  }

  function classWorkingTerms(data) {
    return terms.filter((term) => Number(data?.workingDays?.[term]) > 0);
  }

  function classHasCompleteAttendanceCoverage(data, className, studentsToCheck = null) {
    const students = Array.isArray(studentsToCheck) && studentsToCheck.length
      ? studentsToCheck
      : data?.classes?.[className] || [];
    const workingTerms = classWorkingTerms(data);
    if (!students.length || !workingTerms.length) return false;
    return workingTerms.some((term) => {
      const classAttendance = getClassAttendanceForTerm(data, className, term);
      if (!attendanceRecordHasEntries(classAttendance)) return false;
      return students
        .filter((student) => student?.name)
        .every((student) => getClassAttendanceValue(classAttendance, student.roll) !== undefined);
    });
  }

  function preserveStudentsFromUnreadyClasses(previousStudents = [], nextStudents = [], data, authoritativeClasses = new Set()) {
    if (!data) return nextStudents;
    const nextClassNames = new Set(nextStudents.map((student) => canonicalClassLabel(student.className)));
    const stillLoadingStudents = previousStudents.filter((student) => {
      const className = canonicalClassLabel(student.className);
      const previousClassStudents = previousStudents.filter((item) =>
        canonicalClassLabel(item.className) === className);
      if (authoritativeClasses.has(className)
        && classHasCompleteAttendanceCoverage(data, className, previousClassStudents)) {
        return false;
      }
      return !nextClassNames.has(className)
        && !classHasCompleteAttendanceCoverage(data, className, previousClassStudents);
    });
    return mergeStudentLists(stillLoadingStudents, nextStudents);
  }

  function renderCalculatedStudents(students, options = {}) {
    const preserveExisting = options.preserveExisting !== false;
    const nextStudents = preserveExisting
      ? students
      : options.forceReplace
        ? students
        : preserveStudentsFromUnreadyClasses(stablePerfectStudents, students, options.data, options.authoritativeClasses || new Set());
    stablePerfectStudents = preserveExisting
      ? mergeStudentLists(stablePerfectStudents, nextStudents)
      : nextStudents;
    renderStudents(filterStableStudents());
  }

  function getPerfectAttendanceStudents(data, classFilterValue = "All Classes") {
    return Object.entries(data.classes)
      .filter(([className]) => classFilterValue === "All Classes"
        || canonicalClassLabel(className) === canonicalClassLabel(classFilterValue))
      .flatMap(([className, students]) => (students || [])
        .filter((student) => student?.name && hasFullAttendance(student, className, data))
        .map((student) => ({
          name: student.name,
          className,
          roll: student.roll,
          academicSession: data.academicSession
        })))
      .sort((a, b) => {
        const classOrder = classNames.indexOf(a.className) - classNames.indexOf(b.className);
        return classOrder || Number(a.roll) - Number(b.roll);
      });
  }

  function hasAnyStudentRoster(data) {
    return Object.values(data?.classes || {}).some((students) =>
      Array.isArray(students) && students.some((student) => student?.name));
  }

  function attendancePatchClassNames(patch = {}) {
    return new Set(Object.keys(patch.attendance || {})
      .map((key) => canonicalClassLabel(splitDocLabel(key).split("::")[0]))
      .filter((className) => classNames.includes(className)));
  }

  function getTotalEnrolment(data, classFilterValue = "All Classes") {
    const enrolledStudents = new Set();
    Object.entries(data.classes || {})
      .filter(([className]) => classFilterValue === "All Classes"
        || canonicalClassLabel(className) === canonicalClassLabel(classFilterValue))
      .forEach(([className, students]) => {
        (students || [])
          .filter((student) => student?.name)
          .forEach((student) => enrolledStudents.add(studentListKey({ ...student, className })));
      });
    return enrolledStudents.size;
  }

  function updateSummary(students) {
    const data = getActiveSessionData(currentState);
    const totalEnrolment = getTotalEnrolment(data, selectedClassFilter());
    const percentage = totalEnrolment ? (students.length / totalEnrolment) * 100 : 0;
    if (countLabel) countLabel.textContent = String(students.length);
    if (totalLabel) totalLabel.textContent = String(totalEnrolment);
    if (percentLabel) percentLabel.textContent = `${percentage.toFixed(2)}%`;
  }

  function renderEmpty(message) {
    updateSummary([]);
    tableBody.innerHTML = `
      <tr>
        <td class="attendance-empty-state" colspan="4">${escapeHtml(message)}</td>
      </tr>
    `;
  }

  function renderStudents(students) {
    updateSummary(students);
    if (!students.length) {
      const className = selectedClassFilter();
      renderEmpty(className === "All Classes"
        ? "No students have 100% attendance for the entered terms yet."
        : `No students have 100% attendance in ${className} for the entered terms yet.`);
      return;
    }

    tableBody.innerHTML = students.map((student) => `
      <tr>
        <td>${escapeHtml(student.name)}</td>
        <td>${escapeHtml(student.className)}</td>
        <td>${escapeHtml(student.roll)}</td>
        <td>${escapeHtml(student.academicSession)}</td>
      </tr>
    `).join("");
  }

  function renderPerfectAttendance(options = {}) {
    if (!tableBody) return;

    try {
      const state = JSON.parse(localStorage.getItem(storageKey) || "{}");
      lastRenderedStateJson = localStorage.getItem(storageKey) || "{}";
      currentState = state && typeof state === "object" ? state : {};
      const data = getActiveSessionData(currentState);
      logAttendanceKeyDiagnostics(data);
      renderCalculatedStudents(getPerfectAttendanceStudents(data, selectedClassFilter()), {
        preserveExisting: false,
        forceReplace: Boolean(options.forceReplace),
        data
      });
      startSplitSessionListener(data.academicSession);
    } catch {
      renderEmpty("Could not read attendance data from this browser.");
    }
  }

  function renderPerfectAttendanceFromState(state) {
    if (!tableBody) return;

    try {
      const nextState = mergeAttendanceState(currentState, state || {});
      storeStateOnly(nextState);
      const data = getActiveSessionData(currentState);
      startSplitSessionListener(data.academicSession);
      if (!splitSessionKey || (splitAttendanceReady && (splitRosterReady || hasAnyStudentRoster(data)))) {
        logAttendanceKeyDiagnostics(data);
        renderCalculatedStudents(getPerfectAttendanceStudents(data, selectedClassFilter()), { preserveExisting: false, data });
      }
    } catch {
      renderEmpty("Could not read attendance data from Firestore.");
    }
  }

  function startSplitSessionListener(session, attempt = 0) {
    if (!useSplitSessionLiveSync) return;
    const sessionKey = currentSessionKey(session);
    if (!sessionKey || splitSessionKey === sessionKey) return;

    if (!window.MarkHubFirebase?.listenSplitSession) {
      if (attempt < 80) {
        setTimeout(() => startSplitSessionListener(sessionKey, attempt + 1), 250);
      }
      return;
    }

    if (typeof unsubscribeSplitSession === "function") unsubscribeSplitSession();
    splitSessionKey = sessionKey;
    splitAttendanceReady = false;
    splitRosterReady = false;
    unsubscribeSplitSession = window.MarkHubFirebase.listenSplitSession(
      sessionKey,
      (patch) => {
        const hasAttendancePatch = Object.prototype.hasOwnProperty.call(patch || {}, "attendance");
        const hasRosterPatch = Object.prototype.hasOwnProperty.call(patch || {}, "classes")
          || Object.prototype.hasOwnProperty.call(patch || {}, "studentProfiles")
          || Object.prototype.hasOwnProperty.call(patch || {}, "studentEnrolments");
        if (hasAttendancePatch) {
          splitAttendanceReady = true;
        }
        if (hasRosterPatch) {
          splitRosterReady = true;
        }
        currentState = mergeSplitPatchIntoState(currentState, patch || {});
        const data = getActiveSessionData(currentState);
        if (splitAttendanceReady && (splitRosterReady || hasAnyStudentRoster(data))) {
          logAttendanceKeyDiagnostics(data);
          storeAndRenderState(currentState, { authoritativeClasses: attendancePatchClassNames(patch || {}) });
        } else {
          storeStateOnly(currentState);
        }
      },
      (error) => {
        console.error("[Firestore] 100% Attendance split listener error", error);
      }
    );
  }

  function startFirestoreAttendanceListener(attempt = 0) {
    if (!useCompactAppStateLiveSync) return;
    if (unsubscribeAppState) return;

    if (!window.MarkHubFirebase?.listenAppState) {
      if (attempt < 80) {
        setTimeout(() => startFirestoreAttendanceListener(attempt + 1), 250);
      } else {
        console.warn("[Firestore] 100% Attendance page could not start live listener; using local data only.");
      }
      return;
    }

    unsubscribeAppState = window.MarkHubFirebase.listenAppState(
      (remoteState) => {
        console.log("[Firestore] 100% Attendance page received live appState update.");
        if (remoteState) {
          renderPerfectAttendanceFromState(remoteState);
        } else {
          renderPerfectAttendance();
        }
      },
      (error) => {
        console.error("[Firestore] 100% Attendance listener error", error);
        renderPerfectAttendance();
      }
    );
  }

  function stopFirestoreAttendanceListener() {
    if (typeof unsubscribeAppState === "function") unsubscribeAppState();
    if (typeof unsubscribeSplitSession === "function") unsubscribeSplitSession();
    unsubscribeAppState = null;
    unsubscribeSplitSession = null;
    splitSessionKey = "";
    splitAttendanceReady = false;
    splitRosterReady = false;
  }

  function openMobileMenu() {
    if (!mobileMenuBtn || !mobileNavDrawer || !mobileNavOverlay) return;
    document.body.classList.add("mobile-nav-open");
    mobileNavOverlay.hidden = false;
    mobileNavDrawer.setAttribute("aria-hidden", "false");
    mobileMenuBtn.setAttribute("aria-expanded", "true");
  }

  function closeMobileMenu() {
    if (!mobileMenuBtn || !mobileNavDrawer || !mobileNavOverlay) return;
    document.body.classList.remove("mobile-nav-open");
    mobileNavDrawer.setAttribute("aria-hidden", "true");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    setTimeout(() => {
      if (!document.body.classList.contains("mobile-nav-open")) {
        mobileNavOverlay.hidden = true;
      }
    }, 220);
  }

  function setupMobileNavigation() {
    if (!mobileMenuBtn || !mobileNavDrawer || !mobileNavOverlay) return;
    mobileMenuBtn.addEventListener("click", openMobileMenu);
    mobileMenuCloseBtn?.addEventListener("click", closeMobileMenu);
    mobileNavOverlay.addEventListener("click", closeMobileMenu);
    mobileNavDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    let touchStartX = null;
    mobileNavDrawer.addEventListener("touchstart", (event) => {
      touchStartX = event.touches?.[0]?.clientX ?? null;
    }, { passive: true });
    mobileNavDrawer.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const touchEndX = event.changedTouches?.[0]?.clientX ?? touchStartX;
      if (touchEndX - touchStartX > 70) closeMobileMenu();
      touchStartX = null;
    }, { passive: true });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileMenu();
    });
  }

  function isAdminSignedIn() {
    const saved = sessionStorage.getItem(mobileAuthKey) || localStorage.getItem(authKey);
    if (!saved) return false;
    try {
      return JSON.parse(saved)?.role === "admin";
    } catch {
      return false;
    }
  }

  function renderAdminOnlyLinks() {
    document.querySelectorAll("[data-admin-only]").forEach((element) => {
      element.classList.toggle("hidden", !isAdminSignedIn());
    });
  }

  function logAttendanceKeyDiagnostics(data) {
    if (!data?.attendance || !window.console) return;
    const keys = Object.keys(data.attendance);
    const focusKeys = keys.filter((key) =>
      ["LKG", "Class I"].some((className) =>
        terms.some((term) => attendanceKeyMatches(key, className, term))));
    console.info("[100% Attendance] LKG/Class I attendance keys detected", focusKeys);
  }

  renderAdminOnlyLinks();
  classFilter?.addEventListener("change", () => renderStudents(filterStableStudents()));
  setupMobileNavigation();
  renderPerfectAttendance();
  startFirestoreAttendanceListener();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      stopFirestoreAttendanceListener();
    } else {
      renderPerfectAttendance();
      startFirestoreAttendanceListener();
    }
  });
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey) renderPerfectAttendance();
  });
  setInterval(() => {
    const savedStateJson = localStorage.getItem(storageKey) || "{}";
    if (savedStateJson !== lastRenderedStateJson) {
      renderPerfectAttendance();
    }
  }, 1000);
})();
