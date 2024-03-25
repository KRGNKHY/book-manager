// 必要なSDKから必要な機能をインポート
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
// TODO: 使用したいFirebase 製品の SDK を追加する
// https://firebase.google.com/docs/web/setup#available-libraries

// ウェブアプリの Firebase 構成
// Firebase JS SDK v7.20.0 以降の場合、measurementId はオプションです
const firebaseConfig = {
  apiKey: "AIzaSyD1HuAcmT6WeJbGt5PdECMpv-csQCw0xew",
  authDomain: "createapp-95361.firebaseapp.com",
  projectId: "createapp-95361",
  storageBucket: "createapp-95361.appspot.com",
  messagingSenderId: "929573659724",
  appId: "1:929573659724:web:ebb4dd5b960e2d8c6380e9",
  measurementId: "G-N9JZDESXZ3"
};

// Firebaseを初期化する
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase Authentication を初期化し、サービスへの参照を取得する
const auth = getAuth(app);

// firestoreへのデータ保存でundefinedな値を自動で取り除く
initializeFirestore(app, { ignoreUndefinedProperties: true });

// Cloud Firestore を初期化し、サービスへの参照を取得する
const db = getFirestore(app);

export default { analytics, db, auth };