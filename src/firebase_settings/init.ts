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
  apiKey: "apiKey",
  authDomain: "authDomain",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId",
  measurementId: "measurementId"
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