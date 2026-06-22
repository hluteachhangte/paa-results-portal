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
      state,
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
    const updateArgs = [];
    fieldUpdates.forEach(({ path, value }) => {
      if (!Array.isArray(path) || path.length === 0) return;
      updateArgs.push(new FieldPath(...path), value);
    });
    updateArgs.push(new FieldPath("updatedAt"), updatedAt);

    try {
      await updateDoc(appStateRef, ...updateArgs);
      console.log("[Firestore] Batched mark field update success to appState/markhub", {
        fields: fieldUpdates.length,
        updatedAt
      });
    } catch (error) {
      if (fallbackState && error?.code === "not-found") {
        await this.saveAppState(fallbackState);
        return;
      }
      throw error;
    }
  }
};

export { app, db };
