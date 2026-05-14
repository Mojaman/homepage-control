import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import {
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  arrayUnion,
  deleteDoc,
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

const params = new URLSearchParams(location.search);
const page = params.get("page");
const auth = getAuth();

//alert(page)
const docRef = doc(db, "articles", page);
let pageData = {};
//小見出しの数
let countSubheading = 0;
//現在表示してる小見出しの番号
let headingNum = 0;

// DOM取得
const editTitle = document.getElementById("edit_title");
const displayTitle = document.getElementById("display_title");
const saveTitle = document.getElementById("save_title");
const editSubheading = document.getElementById("edit_subheading");
const editSentence = document.getElementById("edit_sentence");
const displayArticle = document.getElementById("display_article");
const subheadingNum = document.getElementById("subheading_num");
const sentenceNum = document.getElementById("sentence_num");
const addArticle = document.getElementById("add_article");
const deleteArticle = document.getElementById("delete_article");
const saveArticle = document.getElementById("save_article");
const isPublished = document.getElementById("is_published");
const publish = document.getElementById("publish");
const deletePage = document.getElementById("delete_page");

//更新はここで
onSnapshot(docRef, (snapshot) => {
  pageData = snapshot.data();
  console.log(pageData.title);
  countSubheading = pageData.content.length;

  headingNum = countSubheading - 1;

  reloadIsPublished();
  reloadEditor();
  reloadDisplayArticle();
});

//タイトルの保存
saveTitle.addEventListener("click", async () => {
  const title = editTitle.value;
  await updateDoc(docRef, {
    title: title,
  });
});

//小見出しの追加
addArticle.addEventListener("click", async () => {
  await updateDoc(docRef, {
    // content: {
    //   subheading: arrayUnion("小見出し"),
    //   sentence: arrayUnion("記事"),
    // }
    content: arrayUnion({
      index: countSubheading,
      subheading: "小見出し",
      sentence: "記事",
    }),
  });
});

//保存ボタンの処理
saveArticle.addEventListener("click", async () => {
  const editPoint = pageData.content[headingNum];
  editPoint.subheading = editSubheading.value;
  if (editSentence.value === "") {
    editPoint.sentence = "記事を入力してください";
  } else {
    editPoint.sentence = editSentence.value;
  }

  await setDoc(
    docRef,
    {
      content: pageData.content,
    },
    { merge: true },
  );
});

//削除ボタンの処理
deleteArticle.addEventListener("click", async () => {
  if (countSubheading > 1) {
    const editArray = pageData.content;
    editArray.splice(headingNum, 1);
    await setDoc(
      docRef,
      {
        content: editArray,
      },
      { merge: true },
    );
    await reloadIndex();
  }
});

//公開ボタンの処理
publish.addEventListener("click", async () => {
  if (pageData.published === 0) {
    await setDoc(
      docRef,
      {
        published: 1,
      },
      { merge: true },
    );
  } else if (pageData.published === 1) {
    await setDoc(
      docRef,
      {
        published: 0,
      },
      { merge: true },
    );
  }
});

//記事の削除
deletePage.addEventListener("click", async () => {
  if (window.confirm(`記事「${pageData.title}」を削除しますか？`)) {
    await deleteDoc(docRef);
    alert("記事を削除しました");
    location.href = "index.html";
  }
});

//見出しのindexをリロード
async function reloadIndex() {
  const editArray = pageData.content;
  for (let i = 0; i < countSubheading; i++) {
    editArray[i].index = i;
  }
  console.log(editArray);
  await setDoc(
    docRef,
    {
      content: editArray,
    },
    { merge: true },
  );
}

//エディタをリロード
function reloadEditor(num) {
  if (num !== undefined) {
    headingNum = num;
  }
  editTitle.value = pageData.title;
  displayTitle.textContent = pageData.title;

  editSubheading.value = pageData.content[headingNum].subheading;
  editSentence.value = pageData.content[headingNum].sentence;

  reloadHeadingNum();
}

//記事のプレビュー表示を更新
function reloadDisplayArticle() {
  displayArticle.innerHTML = "";
  for (let i = 0; i < countSubheading; i++) {
    const div = document.createElement("div");
    const h4 = document.createElement("h4");
    const p = document.createElement("p");

    div.classList.add("articlePiece");
    div.dataset.id = i;
    h4.textContent = pageData.content[i].subheading;
    h4.classList.add("subheading");
    p.textContent = pageData.content[i].sentence.replace(/\n/g, "<br>");

    if (i === countSubheading - 1) {
      div.classList.add("selected");
    }

    div.appendChild(h4);
    div.appendChild(p);

    displayArticle.appendChild(div);
  }

  //小見出しが選択された時の処理
  document.querySelectorAll(".articlePiece").forEach((el) => {
    el.addEventListener("click", () => {
      document.querySelectorAll(".articlePiece").forEach((item) => {
        item.classList.remove("selected");
      });
      el.classList.add("selected");
      const display = Number(el.dataset.id);
      reloadEditor(display);
    });
  });
}

//公開されているかをリロード
function reloadIsPublished() {
  if (pageData.published === 1) {
    isPublished.textContent = "公開されています";
    isPublished.classList.add("published");
  } else {
    isPublished.textContent = "非公開です";
    isPublished.classList.remove("published");
  }
}

//何番かの表示を更新
function reloadHeadingNum() {
  subheadingNum.textContent = `小見出し${headingNum + 1}`;
  sentenceNum.textContent = `記事${headingNum + 1}`;
}

// async function test() {
//   await setDoc(docRef, {
//     pageNumber: -2,
//     title: "test",
//     content: [
//       {
//         index: 0,
//         subheading: "subheadingTest",
//         sentence: "sentenceTest"
//       }
//     ],
//   })
// };

// await test();
