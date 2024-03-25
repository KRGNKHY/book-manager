<template>
  <head>
    <link rel="icon" href="./assets/favicon.ico.png">
  </head>
  <router-view />
</template>

<script lang="ts">
// firebase・Authentication・Cloud Firestoreの初期化ファイル読み込み
import Firebase from "./firebase_settings/init";

// エクスポート。これで他のVueファイルではgetAuth()でAuthentication、getFirestore()でFirestoreDBの情報を取得できる
export default Firebase;

</script>

<style>
/* このアプリの指定フォント：Noto Sans JPをGoogleのサイトからインポートする。ここで設定すればPJT全体に適用できる */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700&display=swap');

#app {
  background: #ffffff;
  text-align: center;
}

* {
  font-family: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
  font-size: 20px;
  font-weight: 1000;
  line-height: 1.1;
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 40px;
  padding: 20px 0 10px;
}

header {
  background: rgba(240, 240, 240, .6);
  width: auto;
}

footer {
  background: #efefef;
  width: 100%;
  position: absolute;
  bottom: -40px;
  height: 40px;
}

body {
  min-height: calc(100vh - 40px);
  position: relative;
  box-sizing: border-box;
  background: linear-gradient(rgba(255, 255, 255, 0.8), rgba(0, 0, 0, 0.8)), url("./assets/back_ground.png");
}

/* //////////////////////////////////////////////////////////////////////////////// */
/* button関係 */
/* //////////////////////////////////////////////////////////////////////////////// */
button {
  border-radius: 10px;
  padding: 6px 20px 8px;
  /* margin-bottom: 10px; */
  cursor: pointer;
}

button:hover {
  color: white;
}

button:active {
  transform: translate(0, 2px);
  transition: 0s;
}

/* 通常のボタン */
.btn_standard {
  background: #fff176;
  border: 3px solid #fff176;
}

.btn_standard:hover {
  background: #ffcf00;
  border: 3px solid #ffcf00;
}

/* //////////////////////////////////////////////////////////////////////////////// */
/* input関係 */
/* //////////////////////////////////////////////////////////////////////////////// */
input {
  height: 40px;
  text-indent: 1em;
  border-radius: 10px;
}


/* //////////////////////////////////////////////////////////////////////////////// */
/* その他 */
/* //////////////////////////////////////////////////////////////////////////////// */
/* 赤色の文字(エラーメッセージなど) */
.red {
  color: rgb(255, 0, 0);
}

/* 青色の文字(ログインネームなど) */
.blue {
  color: blue;
}

.blue_menu {
  color: blue;
  text-decoration: underline;
  /* -webkit-text-stroke: .2px black; */
}

.blue_menu:hover {
  color: #2296f3;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  transform: translate(-2px, -2px);
}

@media screen and (max-width:480px) {
  input {
    max-width: 99%;
  }

  header {
    padding-top: 10px;
  }

  h1 {
    font-size: 25px;
  }

}
</style>
