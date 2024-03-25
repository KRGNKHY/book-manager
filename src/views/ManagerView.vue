<template>

    <body>
        <HeaderComponent></HeaderComponent>
        <header>
            <h1>管理者画面</h1>
        </header>
        <main>
            <div class="container">
                <div class="search_menu_container" v-if="showSearchMenu">
                    <div class="search_menu" v-if="searchOn">
                        <div class="title_serach">
                            <p class="in_search_title">UID</p>
                            <div class="search_options">
                                <input class="search_word" type="text" v-model="serachWordUId">
                            </div>
                        </div>
                        <div class="author_serach">
                            <p class="in_search_title">Email</p>
                            <div class="search_options">
                                <input class="search_word" type="text" v-model="serachWordEmail">

                            </div>
                        </div>
                        <div class="comment_serach">
                            <p class="in_search_title">Password</p>
                            <div class="search_options">
                                <input class="search_word" type="text" v-model="serachWordPassword">
                            </div>
                        </div>
                        <button class="reset_btn btn" v-on:click="resetSearchWord">リセット</button>
                        <div class="search_button_div">
                            <button class="search_button btn_standard"
                                v-on:click="searchInUsers(serachWordUId, serachWordEmail, serachWordPassword)">検索</button>
                            <p class="close blue_menu" v-on:click="searchOn = false">検索メニューを閉じる</p>
                        </div>
                    </div>
                    <div class="search_view_button" v-else>
                        <p class="open_search blue_menu" v-on:click="searchOn = true">ユーザーを検索する</p>
                    </div>
                </div>

                <div class="users" v-if="showUsers">
                    <div class="user_info" v-for="user in users" :key="user.uId">
                        <div class="info_container">
                            <p class="info_title">UID</p>
                            <p class="info_value">&nbsp;{{ user.uId }}</p>
                        </div>
                        <div class="info_container">
                            <p class="info_title">Email</p>
                            <p class="info_value">&nbsp;{{ user.info.Email }}</p>
                        </div>
                        <div class="info_container">
                            <p class="info_title">Password</p>
                            <p class="info_value">&nbsp;{{ user.info.Password }}</p>
                        </div>
                        <div class="edit_menu" v-if="user.editNow">
                            <div class="editing">
                                <p class="new">new Email</p>
                                <input type="text" v-model="user.newEmail">
                            </div>
                            <div class="editing">
                                <p class="new">new Pass</p>
                                <input type="text" v-model="user.newPassword">
                            </div>
                            <button class="update" v-on:click="editUserInfo(user, user.newEmail, user.newPassword)">更新
                            </button>
                            <div class="error red">
                                <p>{{ user.errorMessage }}</p>
                            </div>
                            <div class="user_delete_container">
                                <p class="delete blue_menu"
                                    v-on:click="deleteAccount(user.info.Email, user.info.Password)">
                                    このアカウントを削除する
                                </p>
                                <p class="blue_menu" v-on:click="user.editNow = false">閉じる</p>
                            </div>
                        </div>
                        <div class="edit_container" v-on:click="user.editNow = true" v-else>
                            <p class="blue_menu edit">編集</p>
                        </div>
                    </div>
                </div>
                <div class="no_user" v-else>
                    <p>{{ noUser }}</p>
                </div>
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
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import LoadingAnimationComponent from '@/components/LoadingAnimationComponent.vue';
import { defineComponent } from 'vue';

import { User, deleteUser, getAuth, signInWithEmailAndPassword, updatePassword, verifyBeforeUpdateEmail } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, DocumentData } from 'firebase/firestore';
const auth = getAuth()
const db = getFirestore()

export default defineComponent({
    data() {
        return {
            // ローディングアニメーション
            isLoading: false,

            // ユーザー一覧を表示
            showUsers: false,

            // ユーザーを格納する配列
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            users: [] as any[],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            subUsers: [] as any[],

            // 登録されているユーザーのUID、メールアドレス、パスワード
            uId: '',
            uEmail: '',
            uPass: '',

            // 検索メニュー
            showSearchMenu: false,

            // 本棚検索機能を表示
            searchOn: false,

            // 検索ワード
            serachWordUId: '',
            serachWordEmail: '',
            serachWordPassword: '',

            // 管理人のメールアドレスとパスワード
            managerEmail: "ttsasaki.yc@kaien-t.net",
            managerPass: "111111",

            // ユーザーが存在しない場合のメッセージ
            noUser: '',

        }
    },
    components: {
        HeaderComponent,
        FooterComponent,
        LoadingAnimationComponent,
    },
    methods: {
        // ユーザーを検索
        searchInUsers(uId: string, Email: string, password: string) {

            // リセットして全てのユーザーを表示
            this.users = this.subUsers

            if (this.users.length === 0) return

            // ユーザー一覧を表示
            this.showUsers = true

            // ユーザーが存在しない場合のメッセージをリセット
            this.noUser = ""

            // 読み込みアニメーションを表示
            this.isLoading = true

            // 検索結果を格納する配列
            let searchItems = []

            searchItems = this.users

            // 以下から絞り込み。入力していない項目は絞り込まない。

            // UIDが部分一致するユーザーのみ取得
            if (uId !== '') searchItems = this.searchUId(uId, searchItems)

            // メールアドレスが部分一致するユーザーのみ取得
            if (Email !== '') searchItems = this.searchEmail(Email, searchItems)

            // パスワードが部分一致するユーザーのみ取得
            if (password !== '') searchItems = this.searchPassword(password, searchItems)

            // 表示するユーザー一覧を絞り込んだ内容に変更
            this.narrowingDown(searchItems)

            console.log('検索結果： ' + this.users.length + '件')
        },

        // 部分一致するUIDを検索
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searchUId(userId: string, users: any[]) {
            const searchItems = []
            for (let i = 0; i < users.length; i++) {
                // string.includes()：部分一致する場合true
                if (users[i].uId.includes(userId)) {
                    searchItems.push(users[i])
                }
            }
            return users = searchItems
        },

        // 部分一致するメールアドレスを検索
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searchEmail(email: string, users: any[]) {
            const searchItems = []
            for (let i = 0; i < users.length; i++) {
                // string.includes()：部分一致する場合true
                if (users[i].info.Email.includes(email)) {
                    searchItems.push(users[i])
                }
            }
            return users = searchItems
        },

        // 部分一致するパスワードを検索
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searchPassword(password: string, users: any[]) {
            const searchItems = []
            for (let i = 0; i < users.length; i++) {
                // string.includes()：部分一致する場合true
                if (users[i].info.Password.includes(password)) {
                    searchItems.push(users[i])
                }
            }
            return users = searchItems
        },

        // 検索結果の絞り込み
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        narrowingDown(searchItems: any[]) {
            if (this.users.length !== searchItems.length) {
                // 絞り込んだ結果0になったらその旨を表示する 
                if (searchItems.length === 0) {
                    this.noUsers()
                } else {
                    // 0じゃなければ結果をそのまま表示する
                    this.users = searchItems
                }
            }
            this.isLoading = false
        },

        // ユーザーが見つからなかった時に呼び出す
        noUsers() {
            this.showUsers = false
            this.noUser = "ユーザーは見つかりませんでした"
        },

        // 検索ワードリセット
        resetSearchWord() {
            this.serachWordUId = ""
            this.serachWordEmail = ""
            this.serachWordPassword = ""
        },

        // データベースから登録されているユーザーを取得する
        async getUsersInfo() {

            // 読み込みアニメーション表示
            this.isLoading = true

            // データベースから、usersコレクションのサブコレクションuserより、ドキュメントの情報(登録ユーザーの情報)を取得
            const querySnapshot = await getDocs(collection(db, "user"));
            querySnapshot.forEach((doc) => {
                const user = {
                    // ユーザー情報
                    uId: doc.id,
                    info: doc.data(),

                    // 新しいメールアドレスとパスワード
                    newEmail: '',
                    newPassword: '',

                    // ユーザーを編集中かどうか
                    editNow: false,

                    // ユーザー情報更新時のエラーメッセージ
                    errorMessage: '',
                }
                this.users.push(user)
                this.subUsers.push(user)
            });
            console.log('ユーザー数: ' + this.users.length + '人')
            
            // ユーザーがいないことを表示
            if (this.users.length === 0) {
                this.noUsers()
                console.log('登録されているユーザーはいません')
            } else {
                // 検索メニューを表示
                this.showSearchMenu = true
                // ユーザーデータを一覧で表示
                this.showUsers = true
            }
            // console.log(doc.id, " => ", doc.data());

            // 読み込みアニメーションを停止
            this.isLoading = false

        },

        // 管理者としてログインする(引数は管理者のものを渡す)
        async managerLogIn(email: string, password: string) {

            // ユーザーが存在しない場合のメッセージを削除
            this.noUser = ""

            // ローディングアニメーション
            this.isLoading = true

            // サインインメソッド 
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("管理者としてログイン成功:userID -> " + user.uid, "email -> " + user.email)
                    // 管理者画面に移動
                    if (user) {
                        this.$router.push("/manager")
                    }
                    // ローディングアニメーション
                    this.isLoading = false
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log('管理者ログインエラー：errorCode ->' + errorCode + ', errorMessage -> ' + errorMessage)

                    // ローディングアニメーション
                    this.isLoading = false
                })
        },

        // ユーザー情報編集
        editUserInfo(user: {
            uId: string,
            info: DocumentData,
            errorMessage: string,
        }, newEmail: string, newPassword: string) {

            // エラーメッセージのリセット
            user.errorMessage = ""

            // 入力されたメールアドレスとパスワードが両方とも空であればそもそも実行しない
            if ((newEmail === "" || newEmail === undefined) && (newPassword === "" || newPassword === undefined)) {
                return
                // スペースが含まれる場合
            } else if (newEmail.includes(" ")
                || newEmail.includes("　")
                || newPassword.includes(" ")
                || newPassword.includes("　")) {
                return user.errorMessage = "IDとパスワードにスペースは使用できません"
                // 文字数が多すぎる場合
            } else if (newEmail.length > 40
                || newPassword.length > 20) {
                return user.errorMessage = "IDまたはパスワードの文字数が多すぎます"
                // パスワードの文字数不足
            } else if (newPassword !== "" && newPassword.length < 6) {
                return user.errorMessage = "パスワードは6字以上必要です"
            }

            // 使用済みメールアドレスであるか確認
            for (let i = 0; i < this.subUsers.length; i++) {
                if (this.subUsers[i].info.Email === newEmail) {
                    return user.errorMessage = "すでに使用されているメールアドレスです"
                }
            }

            const result = confirm("入力した内容に更新しますか？")
            if (!result) return

            // ローディングアニメーション
            this.isLoading = true

            const uEmail = user.info.Email
            const uPassword = user.info.Password

            // 該当ユーザーとしてログイン
            signInWithEmailAndPassword(auth, uEmail, uPassword)
                .then(async (userCredential) => {
                    // サインイン成功時
                    const user = userCredential.user;
                    console.log("ログイン成功:userID -> " + user.uid, "email -> " + user.email)

                    // メールアドレスとパスワードの変更
                    if (newEmail !== "") await this.editEmail(user, newEmail)
                    if (newPassword !== "") await this.editPassword(user, uPassword, newPassword)

                    // 読み込みアニメーション非表示
                    this.isLoading = false

                    // 管理者として再度ログイン
                    await this.managerLogIn(this.managerEmail, this.managerPass)
                })
                // サインイン失敗時
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log('ログインエラー：errorCode ->' + errorCode + ', errorMessage -> ' + errorMessage)

                    // ローディングアニメーション
                    this.isLoading = false
                });
        },

        // メールアドレス編集
        async editEmail(user: User, newEmail: string) {
            const oldEmail = user.email

            // 確認メールを送信
            verifyBeforeUpdateEmail(user, newEmail).then(() => {
                console.log(user.uid + "のemail更新メールを送信: " + oldEmail + " -> " + newEmail)
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log("メールアドレス更新失敗：errorCode -> " + errorCode + ', errorMessage -> ' + errorMessage)
                if (errorCode === "auth/invalid-new-email") {
                    // console.log("無効なメールアドレスです")
                    for (let i = 0; i < this.users.length; i++) {
                        if (this.users[i].uId === user.uid) {
                            return this.users[i].errorMessage = "無効なメールアドレスです"
                        }

                    }
                }
            });
        },

        // パスワード編集
        async editPassword(user: User, oldPassword: string, newPassword: string) {
            updatePassword(user, newPassword).then(async () => {

                // データベースの更新
                const washingtonRef = doc(db, "user", user.uid);
                await updateDoc(washingtonRef, {
                    Password: newPassword
                });

                // 画面上のパスワード更新
                for (let i = 0; i < this.users.length; i++) {
                    if (this.users[i].uId === user.uid) {
                        this.users[i].info.Password = newPassword
                        console.log(user.uid + "のpassword更新: " + oldPassword + "-> " + newPassword)
                    }
                }
                for (let i = 0; i < this.subUsers.length; i++) {
                    if (this.subUsers[i].uId === user.uid) {
                        this.subUsers[i].info.Password = newPassword
                        console.log(user.uid + "のpassword更新sub: " + oldPassword + "-> " + newPassword)
                    }
                }

            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("パスワード更新失敗：errorCode -> " + errorCode + ', errorMessage -> ' + errorMessage)
            });
        },

        // ユーザー削除
        deleteAccount(email: string, password: string) {
            const result = confirm(email + "を削除しますか？")
            if (!result) return

            // 該当ユーザーとしてログイン
            signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {

                    // ローディングアニメーション
                    this.isLoading = true

                    // サインイン成功時
                    const user = userCredential.user;
                    console.log("ログイン成功:userID -> " + user.uid, "email -> " + user.email)

                    if (user) {

                        // 本棚の削除
                        await this.deleteBookshelf(user.uid)

                        // Authentication及びDBからユーザーを削除
                        await this.userDelete(user)

                        // 読み込みアニメーション非表示
                        this.isLoading = false

                        // 管理人として再度ログイン
                        await this.managerLogIn(this.managerEmail, this.managerPass)

                        // ユーザーがいないことを表示
                        if (this.users.length === 0) {
                            this.noUsers()
                        }
                    }
                })
                // サインイン失敗時
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log('ログインエラー：errorCode ->' + errorCode + ', errorMessage -> ' + errorMessage)

                    // ローディングアニメーション
                    this.isLoading = false
                });
        },

        // Authentication及びDBからユーザーを削除
        async userDelete(user: User) {
            // データベース内のユーザー情報を削除
            await deleteDoc(doc(db, "user", user.uid));

            // 画面上から該当ユーザーを削除
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].uId === user.uid) {
                    this.users.splice(i, 1)
                    console.log('削除 -> ' + user.uid)
                }
            }
            for (let i = 0; i < this.subUsers.length; i++) {
                if (this.subUsers[i].uId === user.uid) {
                    this.subUsers.splice(i, 1)
                    console.log('削除sub -> ' + user.uid)
                }
            }

            // Authenticationからユーザーを削除
            await deleteUser(user).then(() => {
                alert(user.email + "を削除しました")
                console.log("ユーザー：'" + user.email + "'を削除しました")
            }).catch((error) => {
                alert('削除処理でエラーが発生しました。')
                console.log("アカウントの削除に失敗しました。error -> " + error)
            });
        },

        // 本棚削除
        async deleteBookshelf(userId: string) {

            let alreadyDlt = false
            // 読み込みアニメーション表示
            this.isLoading = true

            // サブコレクションuserの情報を取得
            const querySnapshot = await getDocs(collection(db, "usershelf", userId, "user"));
            // サブコレクション内のドキュメントを削除する処理を、ドキュメントの数分繰り返す
            querySnapshot.forEach(async (doc) => {
                // 配列から削除
                await deleteDoc(doc.ref)
                console.log("書籍削除成功 ->" + doc.ref)
                alreadyDlt = true
            });
            // 読み込みアニメーション非表示
            this.isLoading = false
            return alreadyDlt
        },
    },
    async mounted() {
        await this.getUsersInfo()
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
    flex-direction: column;
    margin: 30px 0 0;
}

.search_menu_container {
    /* border: solid red 1px; */
    /* width: 50%; */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(255, 255, 255, .6);
    padding: 30px;
    margin: 0 25% 0 25%;
    border-radius: 20px;
}

.search_menu {
    /* border: solid 1px; */
    width: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.search_options {
    display: flex;
}

.reset_btn {
    width: 80px;
    padding: 7px;
    margin: 10px 0 5px 3px;
    font-size: 12px;
}

.btn:hover {
    background-color: rgb(174, 171, 171);
}

.search_word {
    width: 100%;
}

.in_search_title {
    text-align: start;
    margin-top: 5px;
    color: rgb(44, 74, 140);
    font-weight: bold;
    /* background-color: blue; */
}

.search_button_div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 90px;
    margin-top: 15px;
    /* border: solid; */
}

/* .search_view_button {
    border: solid 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 50px;
} */

.no_user {
    padding: 10px;
    background-color: rgb(255, 255, 255, 0.6);
    align-self: center;
    margin-top: 10px;
    border-radius: 10px;
}

.users {
    display: flex;
    flex-wrap: wrap;
}

.user_info {
    width: 43%;
    max-width: 50%;
    display: flex;
    flex-direction: column;
    margin: 20px;
    background-color: rgb(214, 243, 255, .6);
    padding: 10px;
    border-radius: 10px;
    flex: auto;
}

.info_container {
    display: flex;
    align-items: center;
    margin: 3px;
}

.info_title {
    background-color: rgb(0, 0, 122);
    color: white;
    border-radius: 7px;
    padding: 5px;
    width: 110px;
    max-width: 90%;
    min-width: 110px;
    text-align: center;
    overflow-wrap: break-word;
}

.info_value {
    word-break: break-all;
    /* border: solid purple; */
}

input {
    border-radius: 7px;
}

.editing {
    display: flex;
    justify-content: left;
    align-items: center;
    margin: 3px;
}



.new {
    background-color: rgb(76, 82, 0);
    color: white;
    border-radius: 7px;
    width: 80px;
    padding: 5px;
    text-align: center;
    margin-right: 5px;
}

.update {
    width: auto;
    padding: 5px 10px;
    border-radius: 7px;
}

.update:hover {
    background: rgb(184, 184, 184);
}

.error {
    margin: 7px 0 5px 0;
}

.user_delete_container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.edit_container {
    display: flex;
    justify-content: center;
}

.delete {
    padding: 7px 0 7px 0;
}

.blue_menu {
    margin: 3px;
}

/* .edit{
    justify-self: center;
} */

.loading_animation_container {
    height: 15px;
    margin-top: 10px;
}

@media screen and (max-width:700px) {

    *:not(h1) {
        font-size: 15px;
    }

    .search_menu_container {
        margin: 0 5% 0 5%;
    }

    .info_container {
        flex-direction: column;
        align-items: start;
        margin: 7px;
    }

    .user_info {
        width: 40%;

    }

    .editing {
        flex-direction: column;
        margin: 7px;
        align-items: start;
    }

    .new {
        width: auto;
        padding: 7px;
        margin-bottom: 5px;
    }

    .editing input {
        max-width: 80%;
        height: 30px;
    }
}

@media screen and (max-width:480px) {
    .user_info {
        width: 40%;
        max-width: 100%;
    }
}
</style>