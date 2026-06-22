(function () {
  const storageKey = "results-desk-state-v1";
  const terms = ["First Term", "Second Term", "Third Term"];
  const fallbackSession = "2026 - 2027";
  const tableBody = document.querySelector("#perfectAttendanceBody");
  let unsubscribeAppState = null;

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
    return {
      academicSession: session,
      classes: sessionData?.classes || state.classes || {},
      workingDays: sessionData?.workingDays || state.workingDays || {},
      attendance: sessionData?.attendance || state.attendance || {}
    };
  }

  function attendanceKey(className, term) {
    return `${className}::${term}`;
  }

  function hasFullAttendance(student, className, data) {
    const enteredTerms = terms.filter((term) => Number(data.workingDays?.[term]) > 0);
    if (!enteredTerms.length) return false;

    return enteredTerms.every((term) => {
      const workingDays = Number(data.workingDays[term]);
      const attendance = data.attendance?.[attendanceKey(className, term)]?.[String(student.roll)];
      return attendance !== "" && attendance !== undefined && Number(attendance) === workingDays;
    });
  }

  function getPerfectAttendanceStudents(data) {
    return Object.entries(data.classes)
      .flatMap(([className, students]) => (students || [])
        .filter((student) => student?.name && hasFullAttendance(student, className, data))
        .map((student) => ({
          name: student.name,
          className,
          roll: student.roll,
          academicSession: data.academicSession
        })))
      .sort((a, b) => a.className.localeCompare(b.className) || Number(a.roll) - Number(b.roll));
  }

  function renderEmpty(message) {
    tableBody.innerHTML = `
      <tr>
        <td class="attendance-empty-state" colspan="4">${escapeHtml(message)}</td>
      </tr>
    `;
  }

  function renderStudents(students) {
    if (!students.length) {
      renderEmpty("No students have 100% attendance for the entered terms yet.");
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

  function renderPerfectAttendance() {
    if (!tableBody) return;

    try {
      const state = JSON.parse(localStorage.getItem(storageKey) || "{}");
      const data = getActiveSessionData(state);
      renderStudents(getPerfectAttendanceStudents(data));
    } catch {
      renderEmpty("Could not read attendance data from this browser.");
    }
  }

  function renderPerfectAttendanceFromState(state) {
    if (!tableBody) return;

    try {
      const data = getActiveSessionData(state || {});
      localStorage.setItem(storageKey, JSON.stringify(state || {}));
      renderStudents(getPerfectAttendanceStudents(data));
    } catch {
      renderEmpty("Could not read attendance data from Firestore.");
    }
  }

  function startFirestoreAttendanceListener(attempt = 0) {
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
    unsubscribeAppState = null;
  }

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
})();
