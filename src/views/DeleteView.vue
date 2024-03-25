<template>

    <body>
        <HeaderComponent></HeaderComponent>
        <header>
            <h1>アカウント削除画面</h1>
        </header>
        <main>
            <div class="main_container">
                <div class="container">
                    <p>ID(メールアドレス)</p>
                    <input type="email" v-model="inputValueId">
                    <!-- ↓のpタグはテキストボックスを中央に配置するための疑似要素 -->
                    <p class="pseudo_element"></p>
                </div>
                <div class="container">
                    <p>パスワード</p>
                    <input type="password" v-model="inputValuePassword">
                    <!-- ↓のpタグはテキストボックスを中央に配置するための疑似要素 -->
                    <p class="pseudo_element"></p>
                </div>
                <div class="message">
                    <p class="red">{{ errorMessage }}&nbsp;</p>
                </div>

                <div>
                    <button class="btn_standard" type="submit" v-on:click="deleteAccount">アカウントを削除する</button>
                </div>

                <!-- ローディングアニメーション -->
                <div class="loading_animation_container">
                    <div class="loading_animation" v-if="isLoading">
                        <LoadingAnimationComponent></LoadingAnimationComponent>
                    </div>
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
import { EmailAuthCredential, EmailAuthProvider, deleteUser, getAuth, reauthenticateWithCredential } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, getFirestore } from 'firebase/firestore';

const auth = getAuth()
const db = getFirestore()

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
            isLoading: false,
        }
    },

    methods: {
        // 退会処理
        async deleteAccount() {
            if (this.inputValueId === undefined
                || this.inputValueId === ""
                || this.inputValuePassword === undefined
                || this.inputValuePassword === "") {
                return this.errorMessage = 'IDまたはパスワードが未入力です';
            }
            // エラーメッセージの消去
            this.errorMessage = "";

            // ローディングアニメーション
            this.isLoading = true;

            // ID,パスワードを取得
            const mId = this.inputValueId;
            const mPass = this.inputValuePassword;

            // 連続クリックを防ぐためにパスワード欄を空欄に
            this.inputValuePassword = "";

            // 認証情報の取得
            const authCredential = EmailAuthProvider.credential(mId, mPass);

            // ユーザーを削除
            await this.deleteUserWithCredential(authCredential);
        },

        // ユーザーを再認証してアカウントを削除
        async deleteUserWithCredential(authCredential: EmailAuthCredential) {
            // ユーザー再認証
            const user = auth.currentUser
            if (user) {
                await reauthenticateWithCredential(user, authCredential).then(async () => {
                    // User re-authenticated.

                    // 退会の意思の確認
                    const result1 = confirm('ユーザー情報を削除して退会しますか？')
                    if (!result1) return this.isLoading = false;
                    const result2 = confirm('退会すると本棚の情報も全て失いますがよろしいですか？')
                    if (!result2) return this.isLoading = false;
                    
                    // ログイン画面に戻る
                    this.$router.push('/login')
                   
                    // 本棚の削除
                    await this.deleteBookshelf(user.uid)

                    // データベース内のユーザー情報を削除
                    await this.deleteUserInDB(user.uid)

                    // Authenticationからユーザーを削除
                    await deleteUser(user).then(() => {
                        // User deleted.
                        alert('退会しました。ご利用ありがとうございました。')
                        console.log("ユーザー：'" + user.email + "'を削除しました")
                        this.isLoading = false;
                    }).catch((error) => {
                        alert('退会処理でエラーが発生しました。')
                        console.log("アカウントの削除に失敗しました。error -> " + error)
                        this.isLoading = false;
                    });
                }).catch((error) => {
                    // An error ocurred
                    this.errorMessage = "パスワードまたはメールアドレスが正しくありません"
                    console.log("認証に失敗しました。error -> " + error)
                    this.isLoading = false;
                });
            } else {
                console.log('ユーザーが見つかりません・・・。')
            }
        },

        // 本棚を削除
        async deleteBookshelf(userId: string) {
            // サブコレクションbookの情報を取得
            const querySnapshot = await getDocs(collection(db, "bookshelf", userId, "book"));
            // サブコレクション内のドキュメントを削除する処理を、ドキュメントの数分繰り返す
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref)
                console.log(doc.id, " => ", doc.data());
            });
        },

        async deleteUserInDB(userId: string) {
            // userコレクション内のドキュメントを削除する
            await deleteDoc(doc(db, "user", userId))
        }
    }
});
</script>

<style scoped>
main {
    padding: 30px auto;
}

.main_container {
    display: flex;
    justify-content: center;
    flex-direction: column;
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

@media screen and (max-width:480px) {
    .container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        margin: 30px 0 0;
    }

    .pseudo_element {
        display: none;
    }

}
</style>