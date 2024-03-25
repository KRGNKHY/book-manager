<template>
    <div class="header_container">
        <div class="header_logo">
            <div class="img_container">
                <img src="../assets/favicon.ico.png" alt="logo" v-on:click="goToManager(user)">
            </div>
            <p>書籍管理システム</p>
        </div>
        <div class="menu">
            <div class="login_name blue">
                <p class="login_name_text">{{ login_name }}</p>
            </div>
            <div class="header_menu" v-if="user">
                <div class="menu_item" v-on:click="goToBookSearch">書籍検索</div>
                <div class="menu_item" v-on:click="goToBookshelf">本棚</div>
                <div class="menu_item" v-on:click="comfirmLogout">ログアウト</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
// Firebase関連のインポート
import { signOut, onAuthStateChanged, getAuth, User } from "firebase/auth";
// 全てのアカウント情報を取得
const auth = getAuth()

export default defineComponent({
    data() {
        const user = ref()
        return {
            // ログイン中アカウントのE-mailアドレス
            login_name: '',

            // ログイン中かを判断する変数
            user,
        }
    },
    methods: {
        // ログアウト確認ダイアログ
        comfirmLogout() {
            const result = confirm('ログアウトしますか？')
            if (!result) { return }
            this.logOut()
        },

        // ログアウト処理を行うメソッド
        logOut() {
            signOut(auth).then(() => {
                // Sign-out successful.
                this.$router.push('/login')
                console.log("ログアウト成功")
                alert('ログアウトしました')
            }).catch((error) => {
                // An error happened.
                console.log('ログアウトエラー: error ->' + error)
                alert('ログアウト処理でエラーが発生しました')
            })
        },

        // ログインアカウントのID(E-mailアドレス)を表示
        showLoginEmail() {
            onAuthStateChanged(auth, (user) => {
                this.user = user
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/auth.user
                    this.login_name = user.email + ' さん'
                } else {
                    // User is signed out
                    this.login_name = 'ゲストユーザーさん'
                }
            });
        },

        // BookSearch(書籍検索画面)へ移動
        goToBookSearch() {
            const nowRoute = this.$route.path
            if (nowRoute != '/') {
                this.$router.push('/')
            } else {
                window.location.reload()
            }
        },

        // Bookへ移動
        goToBookshelf() {
            const nowRoute = this.$route.path
            if (nowRoute != '/bookshelf') {
                this.$router.push('/bookshelf')
            } else {
                window.location.reload()
            }
        },

        // Managerへ移動
        goToManager(user: User) {
            if (user) {
                if (user.uid === "KzEQdcnHzsWspSLIx1ux9IRTqim2") {
                    const nowRoute = this.$route.path
                    if (nowRoute != '/manager') {
                        this.$router.push('/manager')
                    } else {
                        window.location.reload()
                    }
                }
            }
        }
    },

    mounted() {
        // mounted時(=ページ読み込み時)に以下のメソッドを実行
        this.showLoginEmail()
    },

})
</script>

<style scoped>
/* ///////////////////////////////////////// */
/* ヘッダー関連 */
/* ///////////////////////////////////////// */
.header_container {
    display: flex;
    justify-content: space-between;
    padding: 7px 25px 15px 5px;
    height: 80px;
    width: auto;
    background: rgba(240, 240, 240, .6);
    /* border: solid; */
}

.header_logo {
    display: flex;
    width: fit-content;
    align-items: center;
    /* border: solid blue; */
}

.header_logo p {
    font-size: 35px;
    padding: 0 0 0 10px;
}

.img_container {
    /* border: solid black; */
    height: 100%;
    width: auto;
}

img {
    width: auto;
    height: 100%;
    object-fit: contain;
}

.login_name {
    text-align: right;
}

.header_menu {
    display: flex;
    justify-content: right;
    padding: 2px 0 5px 0;
    margin: 10px 0 0 10px;
}

.menu {
    display: flex;
    flex-direction: column;
}

.menu_item {
    width: max-content;
    margin-left: 30px;
}

.menu_item:hover {
    cursor: pointer;
    color: #2296f3;
    border-bottom: solid 3px #2296f3;
}

@media screen and (max-width:700px) {
    .header_logo{
        align-items: center;
    }
    
    .header_logo p {
        font-size: 27px;
    }
}

@media screen and (max-width:600px) {

    .header_container {
        padding: 0;
        flex-direction: column;
    }

    .header_logo {
        width: 100%;
        justify-content: start;
    }

    .header_logo p {
        font-size: 20px;
    }

    .img_container {
        width: auto;
        height: 100%;
    }

    .login_name_text {
        font-size: 15px;
    }

    .menu_item {
        font-size: 15px;
        margin-left: 10px;
    }

}
</style>