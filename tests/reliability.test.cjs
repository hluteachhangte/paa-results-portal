const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const path = require('node:path');
const app = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
const firebase = fs.readFileSync(path.join(__dirname, '../firebase.js'), 'utf8');

function appFunction(name) {
  const start = app.indexOf(`function ${name}(`);
  const end = app.indexOf('\n}\n', start);
  return app.slice(start, end + 2);
}

test('unchanged dropdown options preserve selection without rewriting DOM', () => {
  const select = {
    options: [{ value: 'Class IX', textContent: 'Class IX' }], value: 'Class IX',
    set innerHTML(value) { throw new Error('Unexpected options rewrite'); }
  };
  const context = vm.createContext({ prepareNativeDropdown() {} });
  vm.runInContext(appFunction('populateSelect'), context);
  context.populateSelect(select, ['Class IX']);
  assert.equal(select.value, 'Class IX');
});

test('hidden profile controls initialize once when first opened with saved filters', () => {
  const calls = [];
  const saved = { profileClass: 'Class VI' };
  const context = vm.createContext({
    activeView: 'dashboard', initializedViewControls: new Set(), deferredViewUiState: saved,
    initializeStudentProfileControls: filters => calls.push(filters),
    initializeTeacherAnalyticsFilters: () => { throw new Error('Hidden analytics initialized'); }
  });
  vm.runInContext(appFunction('initializeActiveViewControls'), context);
  context.initializeActiveViewControls();
  assert.equal(calls.length, 0);
  context.activeView = 'studentProfiles';
  context.initializeActiveViewControls();
  context.initializeActiveViewControls();
  assert.equal(calls.length, 1);
  assert.equal(calls[0], saved);
});

test('Moral grade boundaries use percentages out of 50', () => {
  const context = vm.createContext({});
  vm.runInContext(appFunction('moralGradeFromPercentage'), context);
  for (const [marks, grade] of [[0, 'E'], [16, 'E'], [16.5, 'D'], [24.5, 'D'], [25, 'C'], [30, 'B'], [37.5, 'A'], [50, 'A']]) {
    assert.equal(context.moralGradeFromPercentage(marks / 50 * 100), grade);
  }
});

test('Results horizontal scrollbar moves the table rather than the page', () => {
  const main = { scrollLeft: 0 };
  const wrapper = { clientWidth: 800, scrollWidth: 1400, scrollLeft: 0,
    closest: () => main, before() {}, addEventListener(name, handler) { this[name] = handler; } };
  const bar = { style: {}, clientWidth: 800, scrollLeft: 0, setAttribute() {},
    appendChild(child) { this.firstElementChild = child; },
    addEventListener(name, handler) { this[name] = handler; } };
  let creations = 0;
  const context = vm.createContext({
    els: { resultsTable: { closest: () => wrapper } }, window: { innerWidth: 1310 },
    document: { querySelector: () => null, createElement: () => creations++ ? { style: {} } : bar }
  });
  vm.runInContext(appFunction('updateResultsHorizontalScroll'), context);
  context.updateResultsHorizontalScroll();
  bar.scrollLeft = 250;
  bar.scroll();
  assert.equal(wrapper.scrollLeft, 250);
  assert.equal(main.scrollLeft, 0);
  wrapper.scrollLeft = 400;
  wrapper.scroll();
  assert.equal(bar.scrollLeft, 400);
  assert.equal(bar.firstElementChild.style.width, '1400px');
});

test('marksheet PDF exports the entire class using plain capture styling', async () => {
  const sheets = Array.from({ length: 5 }, () => ({ classList: { remove() {} } }));
  const captured = [];
  let pages = 1;
  let saved = '';
  const button = { textContent: 'Download PDF', disabled: false };
  const context = vm.createContext({
    canViewMarksheet: () => true,
    els: { downloadMarksheetPdfBtn: button, marksheetNameSearchInput: { value: 'One student' } },
    document: { createElement: () => ({ querySelectorAll: () => sheets, remove() {} }), body: { appendChild() {} } },
    renderMarksheets: options => { assert.equal(options.ignoreSearch, true); assert.ok(options.target); },
    ensurePdfLibraries: async () => true,
    captureMarksheetCanvas: async (sheet, host) => { assert.ok(host.className.includes('plain-marksheet-pdf')); captured.push(sheet); return {}; },
    addMarksheetCanvasToPdf() {}, allMarksheetsPdfFilename: () => 'Class.pdf',
    showToast() {}, console,
    window: { jspdf: { jsPDF: class { addPage() { pages++; } save(name) { saved = name; } } } }
  });
  vm.runInContext(`async ${appFunction('downloadMarksheetPDF')}`, context);
  await context.downloadMarksheetPDF();
  assert.equal(captured.length, 5);
  assert.equal(pages, 5);
  assert.equal(saved, 'Class.pdf');
  assert.equal(button.disabled, false);
});

test('Skill Development dash is restricted to IX and X Second Term', () => {
  const context = vm.createContext({ isHighClass: name => ['Class IX', 'Class X'].includes(name) });
  vm.runInContext(appFunction('allowsSkillDevelopmentDash'), context);
  for (const className of ['Class VIII', 'Class IX', 'Class X']) {
    for (const exam of ['First Term', 'Second Term', 'Third Term']) {
      assert.equal(context.allowsSkillDevelopmentDash(className, exam, 'Skill Development'),
        className !== 'Class VIII' && exam === 'Second Term');
      assert.equal(context.allowsSkillDevelopmentDash(className, exam, 'Moral'), false);
    }
  }
});

test('dash is neutral while A-E grading stays unchanged', () => {
  const context = vm.createContext({ isNotEnrolledEntry: value => String(value) === '-2', isAbsentEntry: value => String(value) === '-1' });
  vm.runInContext(appFunction('getGradeStatus') + '\n' + appFunction('isFailingGrade'), context);
  assert.equal(context.getGradeStatus('-').label, 'Not applicable');
  assert.equal(context.isFailingGrade('-'), false);
  for (const grade of ['A', 'B', 'C', 'D']) assert.equal(context.isFailingGrade(grade), false);
  assert.equal(context.isFailingGrade('E'), true);
  assert.equal(context.isFailingGrade('-1'), true);
});

test('saved Moral grades remain saveable without original numeric marks', () => {
  const grade = { value: 'A', dataset: { gradeRoll: '1' } };
  const marks = { value: '', dataset: { moralRoll: '1' } };
  const context = vm.createContext({
    document: { querySelectorAll: () => [marks, grade] },
    isSplitPartSubject: () => false
  });
  vm.runInContext(appFunction('markInputsRequiredForSave'), context);
  assert.deepEqual(Array.from(context.markInputsRequiredForSave()), [grade]);
});

test('profile names and mismatched users cannot trigger admin email override', () => {
  const context = vm.createContext({
    window: { MarkHubFirebase: { auth: { currentUser: { uid: 'verified', email: 'teacher@example.com' } } } },
    isApprovedAdminIdentifier: value => value === 'admin@example.com'
  });
  vm.runInContext(appFunction('isKnownAdminUser'), context);
  assert.equal(context.isKnownAdminUser({ uid: 'verified', name: 'admin@example.com' }), false);
  context.window.MarkHubFirebase.auth.currentUser.email = 'admin@example.com';
  assert.equal(context.isKnownAdminUser({ uid: 'other' }), false);
  assert.equal(context.isKnownAdminUser({ uid: 'verified' }), true);
});

test('Behaviour fallback keeps readable collections when another is denied', async () => {
  const start = firebase.indexOf('  async getBehaviourRecordsOnce(session) {');
  const end = firebase.indexOf('\n  listenResultByRoll(', start);
  const context = vm.createContext({
    db: {}, console: { warn() {} },
    collection: (_, name) => name,
    where: (...args) => args,
    query: (name, filter) => ({ name, filter }),
    getDocs: async ({ name, filter }) => {
      assert.deepEqual(Array.from(filter), ['academicSessionId', '==', '2026 - 2027']);
      if (name === 'behaviourObservations') throw new Error('permission-denied');
      return { name };
    },
    behaviourSnapshotMap: snapshot => ({ loaded: snapshot.name })
  });
  const api = vm.runInContext(`({${firebase.slice(start, end)}})`, context);
  const patch = await api.getBehaviourRecordsOnce('2026 - 2027');
  assert.equal(patch.assessments.loaded, 'behaviourAssessments');
  assert.equal('observations' in patch, false);
  assert.equal(patch.recognitions.loaded, 'behaviourRecognitions');
});

test('Behaviour patches retain collections not included in an update', () => {
  const context = vm.createContext({
    behaviourData: { assessments: { saved: true }, observations: {} }, activeView: 'entry'
  });
  vm.runInContext(appFunction('applyBehaviourRecordsPatch'), context);
  context.applyBehaviourRecordsPatch({ observations: { new: true } });
  assert.equal(context.behaviourData.assessments.saved, true);
  assert.equal(context.behaviourData.observations.new, true);
});

test('edits made during a slow marks save remain pending', async () => {
  const original = { className: 'Class IX', exam: 'First Term', subject: 'Moral', session: '2026 - 2027', markKey: 'moral', roll: '1' };
  const changes = new Map([['student1', original]]);
  let finishWrite;
  const write = new Promise(resolve => { finishWrite = resolve; });
  const context = vm.createContext({
    marksSaveInProgress: false, unsavedMarkChanges: changes,
    selectedMarksEntryLocked: () => false,
    currentSubjectHasPendingClear: () => false, currentMarkInputsAreAllBlank: () => false,
    markInputsRequiredForSave: () => [{ value: 'A' }], isEntryAccessOpen: () => true,
    hasUnsavedMarkChanges: () => true, selectedClass: () => original.className,
    selectedExam: () => original.exam, selectedSubject: () => original.subject,
    refreshMarksSaveControls() {}, syncActiveSessionData() {}, markDataChanged() {},
    state: { marks: { moral: { 1: { value: 'A' } } } }, currentUser: { name: 'Teacher' },
    dataEntryUpdateKey: () => 'updated', buildUnsavedMarkFieldUpdates: () => [],
    pendingFirebaseStateJson: '', lastSyncedFirebaseStateJson: '', deferredFullStateSaveAfterMarks: false,
    cleanEntryRecordForFirestore: record => record,
    window: { MarkHubFirebase: { saveSplitMarks: () => write } },
    localStorage: { setItem() {} }, storageKey: 'test', els: {}, showToast() {}, console
  });
  vm.runInContext(`async ${appFunction('saveAllMarks')}`, context);
  const saving = context.saveAllMarks();
  const newer = { ...original };
  changes.set('student1', newer);
  finishWrite();
  await saving;
  assert.equal(changes.get('student1'), newer);
  assert.equal(context.marksSaveInProgress, false);
});
