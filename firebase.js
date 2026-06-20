import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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

    return onSnapshot(
      doc(db, "results", roll),
      (snapshot) => {
        onResult(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      },
      onError
    );
  },
  listenAppState(onState, onError) {
    return onSnapshot(
      appStateRef,
      (snapshot) => {
        onState(snapshot.exists() ? snapshot.data().state : null);
      },
      onError
    );
  },
  saveAppState(state) {
    return setDoc(appStateRef, {
      state,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
};

export { app, db };
