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

// HTML取得
// const list = document.getElementById("list");
// const deleteBtn = document.getElementById("delete");
const editWelcome = document.getElementById("edit_welcome");
const displayWelcome = document.getElementById("display_welcome");
const saveWelcome = document.getElementById("save_welcome");

const editActivity = document.getElementById("edit_activity");
const displayActivity = document.getElementById("display_activity");
const saveActivity = document.getElementById("save_activity");

const editRoom = document.getElementById("edit_room");
const displayRoom = document.getElementById("display_room");
const saveRoom = document.getElementById("save_room");

const auth = getAuth();

// 保存ボタンが押されたらデータ追加
// saveBtn.addEventListener("click", async () => {
//   await addDoc(collection(db, "messages"), {
//     text: editWelcome.value,
//     createdAt: new Date()
//   });
// });

saveWelcome.addEventListener("click", async () => {
  await setDoc(doc(db, "template", "welcome"), {
    text: editWelcome.value,
    createdAt: new Date(),
  });
});

// onAuthStateChanged(auth, () => {

// });

onSnapshot(doc(db, "template", "welcome"), (snapshot) => {
  // alert(auth);
  displayWelcome.innerHTML = "";
  displayWelcome.textContent = snapshot.data().text.replace(/\n/g, "<br>");
  editWelcome.value = snapshot.data().text;
});

////////////////////////////

saveActivity.addEventListener("click", async () => {
  await setDoc(doc(db, "template", "activity"), {
    text: editActivity.value,
    createdAt: new Date(),
  });
});

onSnapshot(doc(db, "template", "activity"), (snapshot) => {
  // alert(snapshot.exists());
  displayActivity.innerHTML = "";
  displayActivity.textContent = snapshot.data().text.replace(/\n/g, "<br>");
  editActivity.value = snapshot.data().text;
});
////////////////////////////

saveRoom.addEventListener("click", async () => {
  await setDoc(doc(db, "template", "room"), {
    text: editRoom.value,
    createdAt: new Date(),
  });
});

onSnapshot(doc(db, "template", "room"), (snapshot) => {
  // alert(snapshot.exists());
  displayRoom.innerHTML = "";
  displayRoom.textContent = snapshot.data().text.replace(/\n/g, "<br>");
  editRoom.value = snapshot.data().text;
});

// 削除ボタンが押されたらデータ削除
// deleteBtn.addEventListener("click", async () => {

// });

// リアルタイムでデータ取得＆表示
// onSnapshot(collection(db, "messages"), (snapshot) => {
//   list.innerHTML = ""; // 一旦リセット

//   snapshot.forEach((doc) => {
//     const li = document.createElement("li");
//     li.textContent = doc.data().text;
//     list.appendChild(li);
//   });
// });
// onAuthStateChanged(auth, (user) => {
//   alert("user:", user);
// });
