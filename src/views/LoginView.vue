<template>

  <body>
    <HeaderComponent></HeaderComponent>
    <header>
      <h1>ログイン画面</h1>
    </header>
    <main>
      <div class="container">
        <p>ID(メールアドレス)</p>
        <input type="email" v-model="inputValueId">
        <!-- ↓のpタグはテキストボックスを中央に配置するための疑似要素 -->
        <p></p>
      </div>
      <div class="container">
        <p>パスワード</p>
        <input type="password" v-model="inputValuePassword">
        <!-- ↓のpタグはテキストボックスを中央に配置するための疑似要素 -->
        <p></p>
      </div>
      <div class="message">
        <p class="red">{{ errorMessage }}</p>
      </div>

      <div><button class="btn_standard" type="submit" v-on:click="logIn">ログイン</button></div>
      <div>
        <button class="create" v-on:click="goToCreate">アカウント作成</button>
      </div>

      <!-- デバッグ用 -->
      <!-- <div>
        <button v-on:click="getUserInfo()">ユーザー情報を取得</button>
      </div> -->

      <!-- ローディングアニメーション -->
      <div class="loading_animation_container">
        <div class="loading_animation" v-if="isLoading">
          <LoadingAnimationComponent></LoadingAnimationComponent>
        </div>
      </div>
    </main>
    <FooterComponent></FooterComponent>
  </body>
</template>

<script lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import LoadingAnimationComponent from '@/components/LoadingAnimationComponent.vue';
import { defineComponent } from 'vue';

// Firebase関連のインポート
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from 'firebase/firestore';
const auth = getAuth();
const db = getFirestore();

export default defineComponent({
  components: {
    HeaderComponent,
    FooterComponent,
    LoadingAnimationComponent
  },

  data() {
    return {
      // 入力されたIDとパスワード
      inputValueId: '',
      inputValuePassword: '',

      // エラーメッセージ
      errorMessage: '',

      // ローディングアニメーション
      isLoading: false
    }
  },

  methods: {
    // Home画面へ移行
    goToHome() {
      this.$router.push('/')
    },

    // ログイン
    logIn() {
      if (this.inputValueId === undefined
        || this.inputValueId === ""
        || this.inputValuePassword === undefined
        || this.inputValuePassword === "") {
        return this.errorMessage = 'IDまたはパスワードが未入力です'
      }
      // エラーメッセージの消去
      this.errorMessage = ""

      // ローディングアニメーション
      this.isLoading = true

      // ID,パスワードを取得
      const mId = this.inputValueId
      const mPass = this.inputValuePassword

      // 連続クリックを防ぐためにパスワード欄を空欄に
      this.inputValuePassword = ""

      // サインインメソッド 
      signInWithEmailAndPassword(auth, mId, mPass)
        .then(async (userCredential) => {

          // サインイン成功時
          const user = userCredential.user;
          console.log("ログイン成功 " + user.email)

          // ログインしたアカウントのユーザー情報をデータベースに登録
          await setDoc(doc(db, "user", user.uid), {
            UserID: user.uid,
            Email: mId,
            Password: mPass,
          });
          this.goToHome()
        })

        // サインイン失敗時
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('ログインエラー：errorCode ->' + errorCode + ', errorMessage -> ' + errorMessage)
          this.JudgeErrorCode(errorCode)

          // ローディングアニメーション
          this.isLoading = false
        });
    },

    goToCreate() {
      this.$router.push('/create')
    },

    // FirebaseAuthから受け取ったエラーコードを反転し、エラーメッセージを表示する
    JudgeErrorCode(mError: unknown) {
      const errorCode = String(mError)
      if (errorCode === 'auth/wrong-password'
        || errorCode === 'auth/invail-email'
        || errorCode === 'auth/user-not-found'
        || errorCode === 'auth/invalid-credential') {
        this.errorMessage = "ログインに失敗しました。IDまたはパスワードが間違っています。"
      } else {
        this.errorMessage = "ログインが失敗しました。予期せぬエラーが発生しました。"
      }
    },

    // ユーザー情報を取得する(デバッグ用)
    // getUserInfo() {
    //   onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //       console.log('UID: ' + user.uid + ', Email: ' + user.email)
    //       // ...
    //     } else {
    //       console.log('ログインしていません')
    //     }
    //   });
    // },
  }
});
</script>

<style scoped>
main {
  padding: 30px auto;
}

.container {
  display: flex;
  justify-content: center;
  margin: 30px 0 0;
}

.container input {
  width: 400px;
}

.container p {
  width: 200px;
  text-align: left;
  margin-top: 8px;
}

.message {
  margin: 10px;
}

.loading_animation_container {
  height: 15px;
  margin-top: 10px;
}

.create {
  margin-top: 30px;
}

@media screen and (max-width:480px) {
  .container {
    display: flex;
    flex-direction: column;
    margin: 30px 0 0;
  }
}
</style>