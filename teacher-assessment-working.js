(function () {
  "use strict";

  const app = window.TeacherAssessmentApp;
  if (!app) return;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const tabs = [
    "overview", "lessonPlans", "lessonTracking", "syllabus", "activities",
    "attendance", "observations", "remarks", "documents", "history"
  ];
  const schemas = {
    lessonPlans: {
      title: "Lesson Plan",
      fields: [
        ["startDate", "Start Date", "date"], ["endDate", "End Date", "date"],
        ["className", "Class", "class"], ["subject", "Subject", "classSubject"],
        ["plannedTopic", "Chapter / Topic Planned", "textarea"], ["exerciseCount", "No. of exercise(s)", "number"],
        ["expectedDate", "Expected Completion", "date"], ["submissionDate", "Submission Date", "date"],
        ["status", "Approval Status", "select", ["Submitted", "Pending", "Late", "Approved", "Rejected"]]
      ]
    },
    lessonTracking: {
      title: "Lesson Tracking",
      fields: [
        ["startDate", "Start Date", "date"], ["endDate", "End Date", "date"],
        ["className", "Class", "class"], ["subject", "Subject", "teacherClassSubject"],
        ["plannedTopic", "Planned Lesson / Topic", "textarea"],
        ["actualTopic", "Actually Covered", "textarea"], ["dateCovered", "Date Covered", "date"],
        ["remarks", "Remarks", "textarea"], ["evidence", "Evidence / Document Link", "url"],
        ["status", "Progress Status", "select", ["On Track", "Behind Schedule", "Ahead of Schedule", "Not Covered"]]
      ]
    },
    syllabus: {
      title: "Syllabus Progress",
      fields: [
        ["month", "Month", "month"], ["className", "Class", "class"], ["subject", "Subject", "text"],
        ["totalUnits", "Total Syllabus Units", "number"], ["plannedCompleted", "Planned Units Completed", "number"],
        ["actualCompleted", "Actual Units Completed", "number"], ["expectedProgress", "Expected Progress %", "percentage"],
        ["actualProgress", "Actual Progress %", "percentage"], ["remaining", "Remaining Syllabus", "computed"],
        ["status", "Status", "select", ["Ahead of Schedule", "On Track", "Slightly Behind", "Seriously Behind"]]
      ]
    },
    activities: {
      title: "Activity Report",
      fields: [
        ["month", "Month", "month"], ["activityName", "Activity Name", "text"],
        ["date", "Activity Date", "date"], ["classGroup", "Class / Group", "text"],
        ["submittedDate", "Report Submitted Date", "date"],
        ["status", "Approval Status", "select", ["Submitted", "Pending", "Late", "Approved", "Rejected"]],
        ["remarks", "Remarks", "textarea"]
      ]
    },
    attendance: {
      title: "Teacher Attendance",
      fields: [
        ["month", "Month", "month"], ["presentDays", "Present Days", "number"],
        ["absentDays", "Absent Days", "number"], ["leaveDays", "Leave Taken", "number"],
        ["lateArrivals", "Late Arrivals", "number"], ["attendancePercentage", "Attendance Percentage", "computed"]
      ]
    },
    observations: {
      title: "Class Observation",
      fields: [
        ["month", "Month", "month"], ["date", "Observation Date", "date"],
        ["observer", "Observer Name", "text"], ["className", "Class", "class"],
        ["subject", "Subject", "text"], ["topic", "Topic Taught", "text"],
        ["strengths", "Strengths", "textarea"], ["improvements", "Areas for Improvement", "textarea"],
        ["recommendations", "Recommendations", "textarea"], ["followUpDate", "Follow-up Date", "date"],
        ["rating", "Rating (1-5)", "rating"]
      ]
    },
    remarks: {
      title: "Remark and Recommendation",
      fields: [
        ["month", "Month", "month"], ["date", "Date", "date"],
        ["type", "Remark Type", "select", ["Principal's Remark", "Academic Coordinator Remark", "Follow-up Instruction", "Improvement Plan", "Appreciation Note"]],
        ["text", "Remark / Recommendation", "textarea"]
      ]
    },
    documents: {
      title: "Document Record",
      fields: [
        ["month", "Month", "month"], ["date", "Date", "date"],
        ["category", "Category", "select", ["Lesson Plan", "Activity Report", "Teaching Material", "Observation Report", "Training Certificate", "Workshop Participation"]],
        ["name", "Document Name", "text"], ["link", "File Link", "url"]
      ]
    }
  };

  let selectedId = "";
  let activeTab = "overview";
  let editing = null;
  let currentData = null;
  let initialized = false;

  const el = {};
  const q = (selector) => document.querySelector(selector);
  const escapeHtml = (value) => String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  const escapeAttr = escapeHtml;
  const unique = (items) => [...new Set(items.filter(Boolean))];
  const average = (items) => items.length ? items.reduce((sum, value) => sum + Number(value || 0), 0) / items.length : 0;
  const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const selectedSession = () => el.session?.value || app.getState().academicSession;
  const selectedMonth = () => el.month?.value || "All Months";

  function cacheElements() {
    Object.assign(el, {
      denied: q("#teacherAssessmentAccessDenied"), content: q("#teacherAssessmentContent"),
      session: q("#teacherAssessmentSessionSelect"), month: q("#teacherAssessmentMonthSelect"),
      teacher: q("#teacherAssessmentTeacherSelect"), department: q("#teacherAssessmentDepartmentSelect"),
      subject: q("#teacherAssessmentSubjectSelect"), className: q("#teacherAssessmentClassSelect"),
      status: q("#teacherAssessmentStatusSelect"), search: q("#teacherAssessmentSearchInput"),
      addProfile: q("#addTeacherAssessmentProfileBtn"), cards: q("#teacherAssessmentCards"),
      report: q("#teacherAssessmentReport"), subtitle: q("#teacherAssessmentReportSubtitle"),
      hero: q("#teacherAssessmentHero"), tabs: q("#teacherAssessmentTabs"),
      tabContent: q("#teacherAssessmentTabContent"), pdf: q("#downloadTeacherAssessmentPdfBtn"),
      excel: q("#exportTeacherAssessmentExcelBtn"), print: q("#printTeacherAssessmentBtn")
    });
  }

  function data() {
    const state = app.getState();
    state.teacherAssessment = state.teacherAssessment || {};
    ["profiles", ...Object.keys(schemas), "history"].forEach((key) => {
      if (!Array.isArray(state.teacherAssessment[key])) state.teacherAssessment[key] = [];
    });
    return state.teacherAssessment;
  }

  function assignments(teacherId) {
    return (app.getState().teacherAssignments || []).filter((item) => item.teacherId === teacherId);
  }

  function profiles() {
    const map = new Map(data().profiles.map((profile) => [profile.teacherId, profile]));
    (app.getState().teacherAssignments || []).forEach((item) => {
      if (!map.has(item.teacherId)) {
        map.set(item.teacherId, {
          id: `profile-${item.teacherId}`, teacherId: item.teacherId, name: item.teacherName,
          designation: "Teacher", department: item.subject || "General", photoUrl: ""
        });
      }
    });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  function records(type, teacherId, useMonth) {
    return (data()[type] || []).filter((record) =>
      record.teacherId === teacherId
      && record.session === selectedSession()
      && (!useMonth || selectedMonth() === "All Months" || recordMatchesMonth(record, selectedMonth())));
  }

  function recordMatchesMonth(record, month) {
    if (record.month === month) return true;
    if (String(record.period || "").toLowerCase().includes(month.toLowerCase())) return true;
    return [record.startDate, record.endDate, record.date, record.submissionDate, record.expectedDate, record.dateCovered]
      .filter(Boolean)
      .some((dateValue) => monthNameFromDate(dateValue) === month);
  }

  function monthNameFromDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : months[date.getMonth()];
  }

  function attendancePercent(items) {
    const totals = items.reduce((sum, item) => ({
      present: sum.present + Number(item.presentDays || 0),
      absent: sum.absent + Number(item.absentDays || 0),
      leave: sum.leave + Number(item.leaveDays || 0)
    }), { present: 0, absent: 0, leave: 0 });
    const total = totals.present + totals.absent + totals.leave;
    return total ? (totals.present / total) * 100 : 0;
  }

  function score(teacherId) {
    const plan = records("lessonPlans", teacherId, true);
    const track = records("lessonTracking", teacherId, true);
    const activity = records("activities", teacherId, true);
    const attend = records("attendance", teacherId, true);
    const syllabus = records("syllabus", teacherId, true);
    const observation = records("observations", teacherId, true);
    const rate = (items, good) => items.length ? items.filter((item) => good.includes(item.status)).length / items.length * 100 : 0;
    const components = {
      lessonPlans: rate(plan, ["Submitted", "Approved"]),
      lessonTracking: rate(track, ["On Track", "Ahead of Schedule"]),
      activities: rate(activity, ["Submitted", "Approved"]),
      attendance: attendancePercent(attend),
      syllabus: average(syllabus.map((item) => Number(item.actualProgress || 0))),
      observation: observation.length ? average(observation.map((item) => Math.min(5, Number(item.rating || 0)))) * 20 : 0
    };
    const total = components.lessonPlans * 0.25 + components.lessonTracking * 0.25
      + components.activities * 0.15 + components.attendance * 0.15
      + components.syllabus * 0.15 + components.observation * 0.05;
    return { total: Math.round(total * 100) / 100, components };
  }

  function statusFor(value) {
    if (value >= 85) return "Excellent";
    if (value >= 70) return "Good";
    if (value >= 50) return "Needs Attention";
    return "Critical";
  }

  function statusClass(status) {
    return status === "Excellent" ? "is-excellent" : status === "Good" ? "is-good"
      : status === "Needs Attention" ? "is-attention" : "is-critical";
  }

  function initials(name) {
    return String(name || "T").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }

  function photo(profile, className) {
    return profile.photoUrl
      ? `<img class="${className}" src="${escapeAttr(profile.photoUrl)}" alt="${escapeAttr(profile.name)}">`
      : `<span class="${className} teacher-assessment-avatar-fallback">${escapeHtml(initials(profile.name))}</span>`;
  }

  function populate(select, values, selected) {
    select.innerHTML = values.map((value) => {
      const option = typeof value === "string" ? { value, label: value } : value;
      return `<option value="${escapeAttr(option.value)}"${option.value === selected ? " selected" : ""}>${escapeHtml(option.label)}</option>`;
    }).join("");
  }

  function initFilters() {
    const state = app.getState();
    const teacherProfiles = profiles();
    const previous = {
      session: el.session.value || state.academicSession, month: el.month.value || "All Months",
      teacher: el.teacher.value || "All Teachers", department: el.department.value || "All Departments",
      subject: el.subject.value || "All Subjects", className: el.className.value || "All Classes",
      status: el.status.value || "All Statuses"
    };
    populate(el.session, unique([state.academicSession, ...Object.keys(state.sessions || {})]).sort(), previous.session);
    populate(el.month, ["All Months", ...months], previous.month);
    populate(el.teacher, [{ value: "All Teachers", label: "All Teachers" }, ...teacherProfiles.map((item) => ({ value: item.teacherId, label: item.name }))], previous.teacher);
    populate(el.department, ["All Departments", ...unique(teacherProfiles.map((item) => item.department))], previous.department);
    populate(el.subject, ["All Subjects", ...unique((state.teacherAssignments || []).map((item) => item.subject))], previous.subject);
    populate(el.className, ["All Classes", ...app.classNames], previous.className);
    populate(el.status, ["All Statuses", "Excellent", "Good", "Needs Attention", "Critical"], previous.status);
  }

  function filteredProfiles() {
    const search = el.search.value.trim().toLowerCase();
    return profiles().filter((profile) => {
      const teacherAssignments = assignments(profile.teacherId);
      const teacherStatus = statusFor(score(profile.teacherId).total);
      const haystack = [profile.name, profile.department, ...teacherAssignments.flatMap((item) => [item.subject, item.className])].join(" ").toLowerCase();
      return (el.teacher.value === "All Teachers" || el.teacher.value === profile.teacherId)
        && (el.department.value === "All Departments" || el.department.value === profile.department)
        && (el.subject.value === "All Subjects" || teacherAssignments.some((item) => item.subject === el.subject.value))
        && (el.className.value === "All Classes" || teacherAssignments.some((item) => item.className === el.className.value))
        && (el.status.value === "All Statuses" || el.status.value === teacherStatus)
        && (!search || haystack.includes(search));
    });
  }

  function renderCards(items) {
    el.cards.innerHTML = items.length ? items.map((profile) => {
      const teacherAssignments = assignments(profile.teacherId);
      const assessment = score(profile.teacherId);
      const status = statusFor(assessment.total);
      return `<button class="teacher-assessment-card${selectedId === profile.teacherId ? " selected" : ""}" type="button" data-teacher-card="${escapeAttr(profile.teacherId)}">
        ${photo(profile, "teacher-assessment-card-photo")}
        <span class="teacher-assessment-card-main"><strong>${escapeHtml(profile.name)}</strong>
          <small>${escapeHtml(profile.designation || "Teacher")} | ${escapeHtml(profile.department || "General")}</small>
          <em>${escapeHtml(unique(teacherAssignments.map((item) => item.subject)).join(", ") || "No subject assigned")}</em>
          <em>${escapeHtml(unique(teacherAssignments.map((item) => item.className)).join(", ") || "No class assigned")}</em>
        </span>
        <span class="teacher-assessment-card-score"><strong>${assessment.total.toFixed(1)}</strong><small>/100</small><i class="teacher-assessment-status ${statusClass(status)}">${status}</i></span>
      </button>`;
    }).join("") : '<p class="analysis-empty">No teacher profiles match the selected filters.</p>';
  }

  function summary(teacherId) {
    const plans = records("lessonPlans", teacherId, true);
    const activities = records("activities", teacherId, true);
    const tracking = records("lessonTracking", teacherId, true);
    const syllabus = records("syllabus", teacherId, true);
    const attendance = records("attendance", teacherId, true);
    const assessment = score(teacherId);
    return {
      plansSubmitted: plans.filter((item) => ["Submitted", "Approved"].includes(item.status)).length,
      plansPending: plans.filter((item) => ["Pending", "Late", "Rejected"].includes(item.status)).length,
      activitiesSubmitted: activities.filter((item) => ["Submitted", "Approved"].includes(item.status)).length,
      activitiesPending: activities.filter((item) => ["Pending", "Late", "Rejected"].includes(item.status)).length,
      attendance: attendancePercent(attendance), planned: tracking.filter((item) => item.plannedTopic).length,
      covered: tracking.filter((item) => item.actualTopic && item.status !== "Not Covered").length,
      syllabus: average(syllabus.map((item) => Number(item.actualProgress || 0))),
      score: assessment.total, components: assessment.components
    };
  }

  function insight(profile, totals) {
    const strengths = [];
    const concerns = [];
    if (totals.components.lessonPlans >= 80) strengths.push("excellent lesson plan submission");
    if (totals.attendance >= 90) strengths.push("strong attendance");
    if (totals.components.lessonTracking >= 80) strengths.push("consistent lesson tracking");
    const behind = records("syllabus", profile.teacherId, true).find((item) => ["Slightly Behind", "Seriously Behind"].includes(item.status));
    if (behind) concerns.push(`${behind.className} ${behind.subject} is ${behind.status.toLowerCase()}`);
    if (totals.components.activities < 60) concerns.push("activity report submission needs attention");
    const opening = strengths.length
      ? `${profile.name} has maintained ${strengths.join(" and ")}.`
      : `${profile.name}'s current responsibility records require continued monitoring.`;
    return concerns.length
      ? `${opening} ${concerns.join("; ")}. Additional planning and follow-up are recommended.`
      : `${opening} Current records indicate steady administrative compliance and professional responsibility.`;
  }

  function bars(items) {
    return `<div class="teacher-assessment-bar-chart">${items.map((item) => `<div><span>${escapeHtml(item.label)}</span><i><b style="width:${Math.max(0, Math.min(100, item.value))}%"></b></i><strong>${Number(item.value).toFixed(1)}%</strong></div>`).join("") || '<p class="analysis-empty">No chart data available.</p>'}</div>`;
  }

  function lessonPlanMonthlyData(teacherId) {
    const plans = records("lessonPlans", teacherId, false);
    return months.map((month) => {
      const items = plans.filter((item) => recordMatchesMonth(item, month));
      const submitted = items.filter((item) => ["Submitted", "Approved"].includes(item.status)).length;
      return items.length ? { label: month.slice(0, 3), value: submitted / items.length * 100 } : null;
    }).filter(Boolean);
  }

  function attendanceCalendar(profile) {
    const entries = records("attendance", profile.teacherId, false);
    return `<div class="teacher-assessment-attendance-calendar">${months.map((month) => {
      const item = entries.find((entry) => entry.month === month);
      const value = item ? attendancePercent([item]) : null;
      return `<article class="${value == null ? "is-empty" : value >= 90 ? "is-strong" : value >= 75 ? "is-fair" : "is-low"}">
        <span>${month.slice(0, 3)}</span><strong>${value == null ? "-" : `${value.toFixed(1)}%`}</strong>
      </article>`;
    }).join("")}</div>`;
  }

  function overview(profile) {
    const totals = summary(profile.teacherId);
    const syllabus = records("syllabus", profile.teacherId, true);
    const attendance = records("attendance", profile.teacherId, true);
    const metrics = [
      ["Lesson Plans Submitted", totals.plansSubmitted], ["Lesson Plans Pending", totals.plansPending],
      ["Activity Reports Submitted", totals.activitiesSubmitted], ["Activity Reports Pending", totals.activitiesPending],
      ["Attendance Percentage", `${totals.attendance.toFixed(2)}%`], ["Lessons Planned", totals.planned],
      ["Lessons Actually Covered", totals.covered], ["Syllabus Completion", `${totals.syllabus.toFixed(2)}%`],
      ["Overall Assessment Score", `${totals.score.toFixed(2)}/100`]
    ];
    const status = statusFor(totals.score);
    return `<div class="teacher-assessment-overview">
      <div class="teacher-assessment-overview-cards">${metrics.map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("")}</div>
      <p class="teacher-assessment-insight">${escapeHtml(insight(profile, totals))}</p>
      <div class="analysis-grid analysis-grid-two">
        <section class="analysis-panel"><div class="analysis-panel-head"><h4>Assessment Component Breakdown</h4><span>${Math.round(totals.score / 20)}/5 stars | ${status}</span></div>${bars([
          { label: "Lesson Plans", value: totals.components.lessonPlans }, { label: "Lesson Tracking", value: totals.components.lessonTracking },
          { label: "Activity Reports", value: totals.components.activities }, { label: "Attendance", value: totals.components.attendance },
          { label: "Syllabus", value: totals.components.syllabus }, { label: "Observation", value: totals.components.observation }
        ])}</section>
        <section class="analysis-panel"><div class="analysis-panel-head"><h4>Planned vs Actually Covered</h4></div>${bars([
          { label: "Lessons Planned", value: totals.planned ? 100 : 0 },
          { label: "Actually Covered", value: totals.planned ? totals.covered / totals.planned * 100 : 0 }
        ])}</section>
      </div>
      <div class="analysis-grid analysis-grid-two">
        <section class="analysis-panel"><div class="analysis-panel-head"><h4>Lesson Plan Submission by Month</h4></div>${bars(lessonPlanMonthlyData(profile.teacherId))}</section>
        <section class="analysis-panel"><div class="analysis-panel-head"><h4>Syllabus Completion</h4></div>${bars(syllabus.map((item) => ({ label: `${item.className} ${item.subject}`, value: Number(item.actualProgress || 0) })))}</section>
      </div>
      <div class="analysis-grid analysis-grid-two">
        <section class="analysis-panel"><div class="analysis-panel-head"><h4>Attendance Trend</h4></div>${bars(attendance.map((item) => ({ label: item.month, value: attendancePercent([item]) })))}</section>
        <section class="analysis-panel"><div class="analysis-panel-head"><h4>Monthly Attendance Calendar</h4></div>${attendanceCalendar(profile)}</section>
      </div>
      <button class="ghost-button" type="button" data-edit-profile="${escapeAttr(profile.teacherId)}">Edit Teacher Profile</button>
    </div>`;
  }

  function fieldControl(field, record) {
    const [key, label, type, options] = field;
    const value = record[key] == null ? "" : record[key];
    const optional = key === "evidence";
    const fieldClass = type === "textarea" && key === "plannedTopic" ? ' class="lesson-plan-topic-field"' : "";
    if (type === "textarea") return `<label${fieldClass}>${escapeHtml(label)}<textarea name="${key}"${optional ? "" : " required"}>${escapeHtml(value)}</textarea></label>`;
    const className = record.className && app.classNames.includes(record.className) ? record.className : app.classNames[0];
    const choices = type === "classSubject"
      ? classSubjects(className)
      : type === "teacherClassSubject"
        ? teacherClassSubjects(className)
      : type === "class" ? app.classNames : type === "month" ? months : options;
    if (choices) return `<label>${escapeHtml(label)}<select name="${key}" required>${choices.map((option) => `<option value="${escapeAttr(option)}"${String(value) === option ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select></label>`;
    const limits = type === "rating" ? ' min="1" max="5" step="0.1"'
      : type === "percentage" ? ' min="0" max="100" step="0.1"'
        : type === "number" ? ' min="0" step="0.1"' : "";
    const inputType = ["rating", "percentage", "computed"].includes(type) ? "number" : type;
    const required = type === "computed" ? " readonly" : optional ? "" : " required";
    return `<label>${escapeHtml(label)}<input name="${key}" type="${inputType}" value="${escapeAttr(value)}"${limits}${required}></label>`;
  }

  function classSubjects(className) {
    const subjects = typeof app.teacherAssessmentSubjectNames === "function"
      ? app.teacherAssessmentSubjectNames(className)
      : [];
    return subjects.length ? subjects : ["General"];
  }

  function teacherClassSubjects(className) {
    const assigned = assignments(selectedId)
      .filter((item) => item.className === className)
      .flatMap((item) => item.subject === "All Subjects" ? classSubjects(className) : [item.subject]);
    const subjects = unique(assigned);
    return subjects.length ? subjects : classSubjects(className);
  }

  function updateAssessmentSubjectSelect(form) {
    if (!form?.matches?.('[data-record-form="lessonPlans"], [data-record-form="lessonTracking"]')) return;
    const classSelect = form.elements.className;
    const subjectSelect = form.elements.subject;
    if (!classSelect || !subjectSelect) return;
    const previous = subjectSelect.value;
    const subjects = form.matches('[data-record-form="lessonTracking"]')
      ? teacherClassSubjects(classSelect.value)
      : classSubjects(classSelect.value);
    subjectSelect.innerHTML = subjects.map((subject) =>
      `<option value="${escapeAttr(subject)}"${subject === previous ? " selected" : ""}>${escapeHtml(subject)}</option>`).join("");
    if (![...subjectSelect.options].some((option) => option.value === previous)) subjectSelect.value = subjects[0] || "";
    syncLessonTrackingPlannedTopic(form);
  }

  function syncLessonTrackingPlannedTopic(form) {
    if (!form?.matches?.('[data-record-form="lessonTracking"]')) return;
    const plannedTopic = form.elements.plannedTopic;
    const startDate = String(form.elements.startDate?.value || "").trim();
    const endDate = String(form.elements.endDate?.value || "").trim();
    const className = String(form.elements.className?.value || "").trim();
    const subject = String(form.elements.subject?.value || "").trim();
    if (!plannedTopic || !startDate || !endDate || !className || !subject) return;
    const plan = (data().lessonPlans || []).find((record) =>
      record.teacherId === selectedId
      && record.session === selectedSession()
      && record.startDate === startDate
      && record.endDate === endDate
      && record.className === className
      && record.subject === subject);
    plannedTopic.value = plan?.plannedTopic || "";
  }

  function recordTab(type, profile) {
    const schema = schemas[type];
    const editRecord = editing?.type === type ? data()[type].find((item) => item.id === editing.id) || {} : {};
    const items = records(type, profile.teacherId, true);
    return `<section class="teacher-assessment-workspace">
      ${type === "attendance" ? attendanceCalendar(profile) : ""}
      <details class="teacher-assessment-entry-panel" open>
        <summary>${editRecord.id ? "Update" : "Add"} ${schema.title}</summary>
        <form class="teacher-assessment-record-form" data-record-form="${type}">
          <input name="id" type="hidden" value="${escapeAttr(editRecord.id || "")}">
          ${schema.fields.map((field) => fieldControl(field, editRecord)).join("")}
          <div class="teacher-assessment-form-actions"><button class="primary-button" type="submit">${editRecord.id ? "Update" : "Add"} ${schema.title}</button>${editRecord.id ? '<button class="ghost-button" type="button" data-cancel-edit>Cancel</button>' : ""}</div>
        </form>
      </details>
      <div class="analysis-table-wrap teacher-assessment-records-wrap"><table class="analysis-table teacher-assessment-records"><thead><tr>${schema.fields.map((field) => `<th>${escapeHtml(field[1])}</th>`).join("")}<th>Actions</th></tr></thead>
        <tbody>${items.length ? items.map((item) => `<tr>${schema.fields.map(([key]) => `<td>${["link", "evidence"].includes(key) && item[key] ? `<a href="${escapeAttr(item[key])}" target="_blank" rel="noopener">Open</a>` : escapeHtml(item[key] == null || item[key] === "" ? "-" : item[key])}</td>`).join("")}<td><button class="table-action" type="button" data-edit-record="${type}" data-id="${escapeAttr(item.id)}">Edit</button><button class="table-action danger" type="button" data-delete-record="${type}" data-id="${escapeAttr(item.id)}">Remove</button></td></tr>`).join("") : `<tr><td colspan="${schema.fields.length + 1}">No ${schema.title.toLowerCase()} records.</td></tr>`}</tbody>
      </table></div>
    </section>`;
  }

  function profileForm(profile) {
    const item = profile || {};
    return `<form class="teacher-assessment-record-form teacher-profile-form" data-profile-form>
      <input name="teacherId" type="hidden" value="${escapeAttr(item.teacherId || "")}">
      <label>Teacher Name<input name="name" type="text" value="${escapeAttr(item.name || "")}" required></label>
      <label>Designation<input name="designation" type="text" value="${escapeAttr(item.designation || "Teacher")}" required></label>
      <label>Department<input name="department" type="text" value="${escapeAttr(item.department || "General")}" required></label>
      <label>Photo URL<input name="photoUrl" type="url" value="${escapeAttr(item.photoUrl || "")}"></label>
      <div class="teacher-assessment-form-actions"><button class="primary-button" type="submit">Save Profile</button><button class="ghost-button" type="button" data-cancel-edit>Cancel</button></div>
    </form>`;
  }

  function history(profile) {
    const items = records("history", profile.teacherId, false).sort((a, b) => String(b.date || b.createdAt).localeCompare(String(a.date || a.createdAt)));
    return `<div class="teacher-assessment-timeline">${items.length ? items.map((item) => `<article><time>${escapeHtml(item.date || String(item.createdAt).slice(0, 10))}</time><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description || "")}</p></div></article>`).join("") : '<p class="analysis-empty">No history events recorded.</p>'}</div>`;
  }

  function dashboard(profile) {
    const teacherAssignments = assignments(profile.teacherId);
    const totals = summary(profile.teacherId);
    const status = statusFor(totals.score);
    el.report.classList.remove("hidden");
    el.subtitle.textContent = `${profile.name} | Academic Session ${app.formatAcademicSession(selectedSession())}`;
    el.hero.innerHTML = `${photo(profile, "teacher-assessment-hero-photo")}<div><h3>${escapeHtml(profile.name)}</h3><p>${escapeHtml(profile.designation)} | ${escapeHtml(profile.department)}</p><span>${escapeHtml(unique(teacherAssignments.map((item) => item.subject)).join(", ") || "No subjects assigned")}</span><span>${escapeHtml(unique(teacherAssignments.map((item) => item.className)).join(", ") || "No classes assigned")}</span></div>
      <aside><strong>${totals.score.toFixed(1)}</strong><small>Overall Score</small><span>${Math.round(totals.score / 20)}/5 stars</span><i class="teacher-assessment-status ${statusClass(status)}">${status}</i></aside>`;
    el.tabs.querySelectorAll("[data-assessment-tab]").forEach((button) => button.classList.toggle("active", button.dataset.assessmentTab === activeTab));
    el.tabContent.innerHTML = editing?.type === "profile" ? profileForm(profile)
      : activeTab === "overview" ? overview(profile)
        : activeTab === "history" ? history(profile) : recordTab(activeTab, profile);
    currentData = { profile, totals, status };
  }

  function render() {
    cacheElements();
    const allowed = app.isAdmin();
    el.denied.classList.toggle("hidden", allowed);
    el.content.classList.toggle("hidden", !allowed);
    if (!allowed || app.getActiveView() !== "teacherAssessment") return;
    initFilters();
    const items = filteredProfiles();
    if (editing?.type !== "profile" && (!selectedId || !items.some((item) => item.teacherId === selectedId))) {
      selectedId = items[0]?.teacherId || "";
    }
    renderCards(items);
    const profile = profiles().find((item) => item.teacherId === selectedId);
    if (editing?.type === "profile") {
      el.report.classList.remove("hidden");
      el.hero.innerHTML = "";
      el.tabs.classList.add("hidden");
      el.tabContent.innerHTML = profileForm(editing.isNew ? null : profile);
      currentData = null;
    } else if (profile) {
      el.tabs.classList.remove("hidden");
      dashboard(profile);
    } else {
      el.report.classList.add("hidden");
      currentData = null;
    }
  }

  function addHistory(teacherId, title, description, date) {
    data().history.push({
      id: uid("history"), teacherId, session: selectedSession(), createdAt: new Date().toISOString(),
      date: date || new Date().toISOString().slice(0, 10), title, description
    });
  }

  function saveRecord(form) {
    const type = form.dataset.recordForm;
    const schema = schemas[type];
    if (!schema || !selectedId) return;
    const formData = new FormData(form);
    const id = String(formData.get("id") || uid(type));
    const record = { id, teacherId: selectedId, session: selectedSession(), updatedAt: new Date().toISOString() };
    schema.fields.forEach(([key, , fieldType]) => {
      const raw = String(formData.get(key) || "").trim();
      record[key] = ["number", "percentage", "rating"].includes(fieldType) ? Number(raw) || 0 : raw;
    });
    if (type === "lessonPlans" || type === "lessonTracking") {
      record.period = [record.startDate, record.endDate].filter(Boolean).join(" to ");
    }
    if (type === "attendance") record.attendancePercentage = attendancePercent([record]);
    if (type === "syllabus") record.remaining = Math.max(0, Number(record.totalUnits) - Number(record.actualCompleted));
    const index = data()[type].findIndex((item) => item.id === id);
    if (index >= 0) data()[type][index] = record; else data()[type].push(record);
    addHistory(selectedId, `${schema.title} ${index >= 0 ? "updated" : "added"}`, record.status || record.name || record.activityName || record.plannedTopic || "Record saved", record.date || record.submissionDate || record.dateCovered);
    editing = null;
    app.saveState();
    app.showToast(`${schema.title} saved.`);
    render();
  }

  function saveProfile(form) {
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    if (!name) return;
    const existingId = String(formData.get("teacherId") || "");
    const teacherId = existingId || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || uid("teacher");
    const profile = {
      id: `profile-${teacherId}`, teacherId, name,
      designation: String(formData.get("designation") || "Teacher").trim(),
      department: String(formData.get("department") || "General").trim(),
      photoUrl: String(formData.get("photoUrl") || "").trim(),
      session: selectedSession()
    };
    const index = data().profiles.findIndex((item) => item.teacherId === teacherId);
    if (index >= 0) data().profiles[index] = profile; else data().profiles.push(profile);
    selectedId = teacherId;
    editing = null;
    addHistory(teacherId, "Teacher profile updated", `${profile.designation}, ${profile.department}`);
    app.saveState();
    app.showToast("Teacher profile saved.");
    render();
  }

  function deleteRecord(type, id) {
    if (!schemas[type] || !window.confirm(`Remove this ${schemas[type].title.toLowerCase()} record?`)) return;
    const item = data()[type].find((record) => record.id === id);
    data()[type] = data()[type].filter((record) => record.id !== id);
    addHistory(selectedId, `${schemas[type].title} removed`, item?.status || item?.name || "Record removed");
    editing = null;
    app.saveState();
    app.showToast("Assessment record removed.");
    render();
  }

  function fullReport(profile) {
    const teacherAssignments = assignments(profile.teacherId);
    const totals = summary(profile.teacherId);
    return `<div class="teacher-assessment-full-report"><header class="analysis-report-title"><h3>PINEHILL ADVENTIST ACADEMY</h3><p>Teacher Assessment | ${escapeHtml(profile.name)} | ${escapeHtml(selectedSession())}</p></header>
      <h3>${escapeHtml(profile.name)}</h3><p>${escapeHtml(profile.designation)} | ${escapeHtml(profile.department)}</p>
      <p>Subjects: ${escapeHtml(unique(teacherAssignments.map((item) => item.subject)).join(", "))}</p>
      <p>Classes: ${escapeHtml(unique(teacherAssignments.map((item) => item.className)).join(", "))}</p>
      ${overview(profile)}
      ${Object.keys(schemas).map((type) => `<section class="analysis-panel"><div class="analysis-panel-head"><h4>${schemas[type].title}</h4></div>${recordTableOnly(type, profile)}</section>`).join("")}
      <section class="analysis-panel"><div class="analysis-panel-head"><h4>History</h4></div>${history(profile)}</section>
      <p class="teacher-assessment-method-note">Assessment score: Lesson Plan Submission 25%, Lesson Tracking Accuracy 25%, Activity Reports 15%, Attendance 15%, Syllabus Completion 15%, and Class Observation Rating 5%. Overall score: ${totals.score.toFixed(2)}/100.</p></div>`;
  }

  function recordTableOnly(type, profile) {
    const schema = schemas[type];
    const items = records(type, profile.teacherId, false);
    return `<div class="analysis-table-wrap"><table class="analysis-table"><thead><tr>${schema.fields.map((field) => `<th>${escapeHtml(field[1])}</th>`).join("")}</tr></thead><tbody>${items.length ? items.map((item) => `<tr>${schema.fields.map(([key]) => `<td>${escapeHtml(item[key] == null || item[key] === "" ? "-" : item[key])}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${schema.fields.length}">No records.</td></tr>`}</tbody></table></div>`;
  }

  async function downloadPdf() {
    if (!currentData || !window.html2canvas || !window.jspdf?.jsPDF) return app.showToast("Teacher assessment is not ready.");
    const previous = el.pdf.textContent;
    let capture;
    try {
      el.pdf.disabled = true;
      el.pdf.textContent = "Generating Assessment PDF...";
      capture = document.createElement("div");
      capture.className = "teacher-assessment-pdf-capture";
      capture.innerHTML = fullReport(currentData.profile);
      capture.querySelectorAll("button, form").forEach((node) => node.remove());
      document.body.appendChild(capture);
      const canvas = await window.html2canvas(capture, { backgroundColor: "#fff", scale: 2, useCORS: true, logging: false });
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a3", compress: true });
      const margin = 7, width = 283, height = canvas.height * width / canvas.width, pageHeight = 406;
      const image = canvas.toDataURL("image/jpeg", 0.94);
      for (let offset = 0, page = 0; offset < height; offset += pageHeight, page += 1) {
        if (page) pdf.addPage("a3", "portrait");
        pdf.addImage(image, "JPEG", margin, margin - offset, width, height, undefined, "FAST");
      }
      pdf.save(`Teacher_Assessment_${app.fileSafeName(currentData.profile.name)}_${app.fileSafeName(selectedSession())}.pdf`);
    } catch (error) {
      console.error(error);
      app.showToast("Could not generate teacher assessment PDF.");
    } finally {
      capture?.remove();
      el.pdf.disabled = false;
      el.pdf.textContent = previous;
    }
  }

  function exportExcel() {
    if (!currentData || !window.XLSX) return app.showToast("Teacher assessment is not ready.");
    const workbook = XLSX.utils.book_new();
    const profile = currentData.profile;
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([{
      Teacher: profile.name, Designation: profile.designation, Department: profile.department,
      Session: selectedSession(), "Overall Score": currentData.totals.score, Status: currentData.status,
      Insight: insight(profile, currentData.totals)
    }]), "Overview");
    Object.keys(schemas).forEach((type) => XLSX.utils.book_append_sheet(
      workbook, XLSX.utils.json_to_sheet(records(type, profile.teacherId, false)), schemas[type].title.slice(0, 31)
    ));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(records("history", profile.teacherId, false)), "History");
    XLSX.writeFile(workbook, `Teacher_Assessment_${app.fileSafeName(profile.name)}_${app.fileSafeName(selectedSession())}.xlsx`);
  }

  function printReport() {
    if (!currentData) return app.showToast("Teacher assessment is not ready.");
    el.tabContent.innerHTML = fullReport(currentData.profile);
    app.startPrintMode("print-teacher-assessment");
  }

  function bind() {
    if (initialized) return;
    initialized = true;
    [el.session, el.month, el.teacher, el.department, el.subject, el.className, el.status]
      .forEach((control) => control.addEventListener("change", render));
    el.search.addEventListener("input", render);
    el.addProfile.addEventListener("click", () => { editing = { type: "profile", isNew: true }; selectedId = ""; render(); });
    el.cards.addEventListener("click", (event) => {
      const card = event.target.closest("[data-teacher-card]");
      if (!card) return;
      selectedId = card.dataset.teacherCard;
      editing = null;
      activeTab = "overview";
      render();
    });
    el.tabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-assessment-tab]");
      if (!button) return;
      activeTab = button.dataset.assessmentTab;
      editing = null;
      render();
    });
    el.tabContent.addEventListener("submit", (event) => {
      if (event.target.matches("[data-record-form]")) { event.preventDefault(); saveRecord(event.target); }
      if (event.target.matches("[data-profile-form]")) { event.preventDefault(); saveProfile(event.target); }
    });
    el.tabContent.addEventListener("change", (event) => {
      if (event.target.matches('[data-record-form="lessonPlans"] [name="className"], [data-record-form="lessonTracking"] [name="className"]')) {
        updateAssessmentSubjectSelect(event.target.form);
      }
      if (event.target.matches('[data-record-form="lessonTracking"] [name="startDate"], [data-record-form="lessonTracking"] [name="endDate"], [data-record-form="lessonTracking"] [name="subject"]')) {
        syncLessonTrackingPlannedTopic(event.target.form);
      }
    });
    el.tabContent.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-edit-record]");
      const deleteButton = event.target.closest("[data-delete-record]");
      const editProfile = event.target.closest("[data-edit-profile]");
      if (editButton) { editing = { type: editButton.dataset.editRecord, id: editButton.dataset.id }; activeTab = editing.type; render(); }
      if (deleteButton) deleteRecord(deleteButton.dataset.deleteRecord, deleteButton.dataset.id);
      if (editProfile) { editing = { type: "profile", isNew: false }; render(); }
      if (event.target.closest("[data-cancel-edit]")) { editing = null; render(); }
    });
    el.pdf.addEventListener("click", downloadPdf);
    el.excel.addEventListener("click", exportExcel);
    el.print.addEventListener("click", printReport);
    window.addEventListener("afterprint", render);
  }

  function init() {
    cacheElements();
    if (!el.content) return;
    bind();
    render();
  }

  window.TeacherAssessmentModule = { init, render };
  init();
}());
