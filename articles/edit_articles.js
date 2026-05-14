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
  getCountFromServer,
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
const coll = collection(db, "articles");
const auth = getAuth();

const createArticle = document.getElementById("create_article");

createArticle.addEventListener("click", async () => {
  const newTitle = String(document.getElementById("new_title").value);
  if (newTitle === "") {
    alert("タイトルを入力してください");
  } else {
    // const snapShot = await getCountFromServer(coll);
    // const count = snapShot.data().count;
    // alert(count)
    const ref = await addDoc(coll, {
      // pageNumber: count - 2,
      published: 0,
      createdAt: new Date(),
      title: newTitle,
      content: [
        {
          index: 0,
          subheading: "小見出し",
          sentence: "記事",
        },
      ],
    });
    document.getElementById("new_title").value = "";
    // location.href = `article.html?page=${ref.id}`;
    window.open(`article.html?page=${ref.id}`, "_blank");
  }
});
