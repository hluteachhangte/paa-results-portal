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
