import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyD2-qs_MfQk1540EgVtl6F3bH0tEmRIU88",
  authDomain: "homepage-test-cc15b.firebaseapp.com",
  projectId: "homepage-test-cc15b",
  storageBucket: "homepage-test-cc15b.firebasestorage.app",
  messagingSenderId: "306865836134",
  appId: "1:306865836134:web:8e6262f6f9fab6477a9da7",
  measurementId: "G-Z4B1QECB3Y",
};

// 初期化
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const list = document.getElementById("articles_list");
// alert(list)
let articles_data = [];

const auth = getAuth();

// リアルタイムでデータ取得＆表示
onSnapshot(collection(db, "articles"), (snapshot) => {
  list.innerHTML = ""; // 一旦リセット

  snapshot.forEach((doc) => {
    articles_data.push(doc.data());

    const data = doc.data();
    const title = data.title;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `https://mojaman.github.io/homepage-control/article/article.html?page=${doc.id}`;
    a.target = "_blank";
    a.dataset.id = data.pageNumber;
    a.textContent = title;
    li.appendChild(a);
    list.appendChild(li);
  });
});
