import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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

window.MarkHubFirebase = {
  app,
  db,
  async getResultByRoll(rollNumber) {
    const roll = String(rollNumber || "").trim();
    if (!roll) return null;

    const snapshot = await getDoc(doc(db, "results", roll));

    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  }
};

export { app, db };
