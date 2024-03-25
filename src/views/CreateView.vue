<template>

    <body>
        <HeaderComponent></HeaderComponent>
        <header>
            <h1 class="title">アカウント作成</h1>
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

            <div class="create_btn">
                <button class="btn_standard" type="submit" v-on:click="createAccount">アカウント作成</button>
            </div>

            <div>
                <button v-on:click="goToLogin">戻る</button>
            </div>
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
import FooterComponent from '@/components/FooterComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import LoadingAnimationComponent from '@/components/LoadingAnimationComponent.vue';
import { defineComponent } from 'vue';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
const auth = getAuth();
const db = getFirestore();

export default defineComponent({
    components: {
        HeaderComponent,
        FooterComponent,
        LoadingAnimationComponent,
    },
    data() {
        return {
            inputValueId: '',
            inputValuePassword: '',
            errorMessage: '',
            isLoading: false,
        }
    },

    methods: {
        async goToBookSearch() {
            console.log('書籍検索画面へ移動')
            this.$router.push('/')
        },

        goToLogin() {
            this.$router.push('/login')
        },

        // アカウント作成
        async createAccount() {
            if (this.inputValueId === undefined
                || this.inputValueId === ""
                || this.inputValuePassword === undefined
                || this.inputValuePassword === "") {
                return this.errorMessage = 'IDまたはパスワードが未入力です'
            } else if (this.inputValueId.length > 40
                || this.inputValuePassword.length > 20) {
                return this.errorMessage = "IDまたはパスワードの文字数が多すぎます"
            } else if (this.inputValueId.includes(" ")
                || this.inputValueId.includes("　")
                || this.inputValuePassword.includes(" ")
                || this.inputValuePassword.includes("　")) {
                return this.errorMessage = "IDとパスワードにスペースは使用できません"
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

            await createUserWithEmailAndPassword(auth, mId, mPass)
                .then(async (userCredential) => {

                    // Signed in 
                    const user = userCredential.user;
                    console.log("アカウント作成成功" + user.email)

                    // 作成されたアカウントのユーザー情報をデータベースに登録
                    await this.userRegistration(mPass)

                    // 書籍検索画面へ移動
                    await this.goToBookSearch()
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log('アカウント作成エラー：errorCode ->' + errorCode + ', errorMessage -> ' + errorMessage)
                    if (errorCode === "auth/email-already-in-use") {
                        this.errorMessage = "すでに使用されているメールアドレスです"
                    } else if (errorCode === "auth/weak-password") {
                        this.errorMessage = "パスワードは6字以上必要です"
                    } else if (errorCode === "auth/invalid-email") {
                        this.errorMessage = "無効なメールアドレスです"
                    }
                    // 読み込みアニメーション
                    this.isLoading = false
                });
        },

        // 本棚を削除
        async deleteBookshelf(userId: string) {
            console.log('削除開始')
            // サブコレクションbookの情報を取得
            const querySnapshot = await getDocs(collection(db, "bookshelf", userId, "book"));
            // サブコレクション内のドキュメントを削除する処理を、ドキュメントの数分繰り返す
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref)
                console.log('Delete! doc.id -> ' + doc.id + ' , doc.data() -> ' + doc.data())
            });
        },

        // データベースへのユーザー登録
        async userRegistration(mPass: string) {
            const user = auth.currentUser;
            // ログイン中のユーザーの情報を取得する
            if (user) {
                const uId = user.uid
                const uEmail = user.email
                const uPass = mPass
                // データベースにユーザー情報を登録する
                // doc()=>引数1:firebaseプロジェクトのfirestoreデータベース 引数2:コレクションID 引数3:ドキュメントID
                await setDoc(doc(db, "user", uId), {
                    UserID: uId,
                    Email: uEmail,
                    Password: uPass,
                });
                console.log(uEmail + 'をDBに登録')
            }
        },
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

.create_btn {
    margin-bottom: 30px;
}

.message {
    margin: 10px;
}

.loading_animation_container {
    height: 15px;
    margin-top: 10px;
}

@media screen and (max-width:480px) {
    .container {
        flex-direction: column;
    }
}
</style>