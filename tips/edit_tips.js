import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
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

const collectionRef = collection(db, "tips");

// HTML取得
const tipsList = document.getElementById("tips-list");
const displayTip = document.getElementById("display-tip");
const saveTip = document.getElementById("save-tip");
const deleteTip = document.getElementById("delete-tip");
const newTip = document.getElementById("new-tip");
const createTip = document.getElementById("create-tip");
let selectedIndex = 0;
let tips_data = [];

const auth = getAuth();

onSnapshot(collectionRef, (snapshot) => {
  tipsList.innerHTML = ""; // 一旦リセット
  tips_data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log(tips_data);
  selectedIndex = 0;

  let index = 0;
  snapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = data.text;
    li.classList.add("tip-li");
    if (index === 0) {
      li.classList.add("active");
    }
    li.dataset.index = index;
    tipsList.appendChild(li);

    index++;
  });
  reloadDisplay();
});

function reloadDisplay() {
  displayTip.value = tips_data[selectedIndex].text;
}

// 今、snapshotで後から作成したliにアドイベントリスナーをつけてどれがクリックされたたか検知しようとしてるところで苦戦してるうわああああ
// こいつどうにかしろ
// function reloadList() {
//   const tips = document.querySelectorAll(".tip-li");

//   tips.forEach((tip) => {
//     tip.classList.add("debug");
//     // tip.addEventListener("click", () => {
//     //   alert("unko");
//     // });
//   });
// }

tipsList.addEventListener("click", (e) => {
  if (e.target.className === "tip-li") {
    const tips = document.querySelectorAll(".tip-li");
    tips.forEach((el) => {
      el.classList.remove("active");
    });
    selectedIndex = e.target.dataset.index;
    reloadDisplay();
    e.target.classList.add("active");
  }
});

deleteTip.addEventListener("click", async () => {
  const docId = tips_data[selectedIndex].id;
  await deleteDoc(doc(db, "tips", docId));
});

saveTip.addEventListener("click", async () => {
  const docId = tips_data[selectedIndex].id;
  await updateDoc(doc(db, "tips", docId), {
    text: displayTip.value,
  });
});

createTip.addEventListener("click", async () => {
  const newTipContent = newTip.value.trim();
  // alert(newTipContent);
  await addDoc(collectionRef, {
    text: newTipContent,
    createdAt: new Date(),
  });
  newTip.value = "";
});
