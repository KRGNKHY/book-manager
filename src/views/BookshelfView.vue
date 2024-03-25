<template>

    <body>
        <HeaderComponent></HeaderComponent>
        <header>
            <h1>登録書籍一覧</h1>
        </header>
        <main>
            <div class="container">

                <!-- 検索メニュー -->
                <div class="search_menu_container" v-if="showSearchMenu">
                    <div class="search_menu" v-if="searchOn">
                        <div class="title_serach">
                            <p class="in_search_title">タイトル</p>
                            <div class="search_options">
                                <input class="search_word" type="text" v-model="serachWordTitle">
                            </div>
                        </div>
                        <div class="author_serach">
                            <p class="in_search_title">著者</p>
                            <div class="search_options">
                                <input class="search_word" type="text" v-model="serachWordAuthors">

                            </div>
                        </div>
                        <div class="comment_serach">
                            <p class="in_search_title">感想/要約</p>
                            <div class="search_options">
                                <input class="search_word" type="text" v-model="serachWordComment">
                            </div>
                        </div>
                        <button class="reset_btn btn" v-on:click="resetSearchWord">リセット</button>
                        <div class="reading_search">
                            <div>
                                <p class="in_search_title">読了/未読了</p>
                            </div>
                            <div class="input_radio">
                                <label class="input_radio_child">
                                    <input type="radio" name="reading" id="noSelection"
                                        v-on:change="searchReading = 'noSelection'">
                                    <span class="options_title">指定なし</span>
                                </label>
                                <label class="input_radio_child">
                                    <input type="radio" name="reading" id="True" v-on:change="searchReading = 'True'">
                                    <span class="options_title">読了</span>
                                </label>
                                <label class="input_radio_child">
                                    <input type="radio" name="reading" id="False" v-on:change="searchReading = 'False'">
                                    <span class="options_title">未読了</span>
                                </label>
                            </div>
                        </div>
                        <div class="search_button_div">
                            <button class="search_button btn_standard"
                                v-on:click="searchInBookshelf(serachWordTitle, serachWordAuthors, serachWordComment, searchReading)">検索</button>
                            <p class="close blue_menu" v-on:click="searchOn = false">検索メニューを閉じる</p>
                        </div>
                    </div>
                    <div class="search_view_button" v-else>
                        <p class="open_search blue_menu" v-on:click="searchOn = true">本棚内の書籍を検索する</p>
                    </div>
                </div>
                <div class="loading_animation" v-if="isLoading">
                    <LoadingAnimationComponent></LoadingAnimationComponent>
                </div>

                <!-- 書籍一覧 -->
                <div class="books_container">

                    <!-- 書籍詳細を表示していない状態のタイトル一覧 -->
                    <div class="book_titles" v-if="showBooks">
                        <div class="book_title_container" v-for="(book, index) in books" :key="book.ISBN">
                            <p class="blue_menu book_title" v-on:click="BookInfoOpenClose(index)">{{ book.info.Title }}
                            </p>
                            <div class="book_image_container" v-on:click="BookInfoOpenClose(index)">
                                <img v-if="book.info.Calligraphy" :src="book.info.Calligraphy" alt="書影">
                                <img v-else src="../assets/NoIMAGE.png" alt="書影">
                            </div>

                        </div>
                    </div>

                    <!-- 書籍詳細 -->
                    <div class="books" v-for="(book, index) in books" :key="book.ISBN">
                        <div class="book_info_container" v-if="book.showBookInfo">
                            <div class="top_container">
                                <div class="contents_container">
                                    <div class="content">
                                        <div class="content_child" v-if="book.info.Title">
                                            <p class="content_name">Title</p>
                                            <p class="content_value">{{ book.info.Title }}</p>
                                        </div>
                                    </div>
                                    <div class="content">
                                        <div class="content_child" v-if="book.info.Authors">
                                            <p class="content_name">Authors</p>
                                            <div class="authors">
                                                <div v-for="author in book.info.Authors" :key="author">
                                                    <p class="content_value">
                                                        {{ author }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="content">
                                        <div class="content_child" v-if="book.info.Publisher">
                                            <p class="content_name">Publisher</p>
                                            <p class="content_value">{{ book.info.Publisher }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="content">
                                        <div class="content_child" v-if="book.info.PublishedDate">
                                            <p class="content_name">Published Date</p>
                                            <p class="content_value">{{ book.info.PublishedDate }}</p>
                                        </div>
                                    </div>
                                    <div class="content">
                                        <div class="content_child">
                                            <p class="content_name">ISBN</p>
                                            <p class="content_value" v-if="book.ISBN">{{ book.ISBN }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="middle_container">
                                <div class="image_container">
                                    <img v-if="book.info.Calligraphy" :src="book.info.Calligraphy" alt="書影">
                                    <img v-else src="../assets/NoIMAGE.png" alt="書影">
                                </div>
                                <div class="book_option_container">
                                    <div class="reading_container">
                                        <input class="checkbox" type="checkbox"
                                            v-on:change="passReadingData(getDocPath(book.ISBN), book.info.Reading)"
                                            v-model="book.info.Reading">
                                        <p>読了</p>
                                    </div>
                                    <div class="delete_container">
                                        <p class="delete blue_menu"
                                            v-on:click="deleteBook(getDocPath(book.ISBN), book.info.Title, index)">
                                            削除
                                        </p>
                                    </div>

                                </div>
                            </div>
                            <div class="bottom_container">
                                <div class="comment_header_container">
                                    <p class="comment_head">感想/要約</p>
                                    <button class="in_table_button btn"
                                        v-on:click="closeInput(getDocPath(book.info.ISBN), book.info.Comment, index)"
                                        v-if="book.inputNow">完了</button>
                                    <button class="in_table_button btn" v-on:click="book.inputNow = true"
                                        v-else>入力</button>
                                </div>
                                <div class="comment_text_container">
                                    <div v-if="book.inputNow" class="comment_true">
                                        <textarea class="comment_text" v-model="book.info.Comment"></textarea>
                                    </div>
                                    <div v-else class="comment_else">
                                        <p class="comment" v-if="book.info.Comment === ''">コメントはありません</p>
                                        <p class="comment" v-else>{{ book.info.Comment }} </p>
                                    </div>
                                </div>
                                <div class="comment_error red">
                                    <p>{{ book.commentError }}</p>
                                </div>
                                <div class="close_container">
                                    <p class="blue_menu" v-on:click="BookInfoOpenClose(index)">閉じる</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="error_container">
                        <p class="error">{{ errorMessage }}</p>
                    </div>
                </div>
            </div>
        </main>
        <div class="bookshelf_bottom">
            <p v-on:click="deleteBookshelf(userId)" class="blue_menu">本棚をリセットする</p>
            <p class="blue_menu" v-on:click="goToDelete">退会する</p>
        </div>
        <FooterComponent></FooterComponent>
    </body>
</template>

<script lang="ts">
import FooterComponent from '@/components/FooterComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import LoadingAnimationComponent from '@/components/LoadingAnimationComponent.vue';
import { defineComponent } from 'vue';

import { getAuth } from 'firebase/auth'
const auth = getAuth()


// firebaseデータベース読み込みのためのインポート
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, DocumentReference } from 'firebase/firestore'
const db = getFirestore()

export default defineComponent({
    components: {
        HeaderComponent,
        FooterComponent,
        LoadingAnimationComponent
    },
    data() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const books: any[] = []

        // 本棚の情報のリセットに必要な、登録書籍を二重に保存する配列
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subBooks: any[] = []
        return {
            // ユーザーID
            userId: '',

            // 書籍一覧のデータを格納する配列
            books,
            subBooks,

            // エラーメッセージ
            errorMessage: '',

            // 感想要約のエラーメッセージ
            commentError: '',

            // 読み込みアニメーション
            isLoading: false,

            // 書籍情報
            showBooks: false,

            // 検索メニュー
            showSearchMenu: false,

            // 本棚検索機能を表示
            searchOn: false,

            // 検索欄に入力した本のタイトル
            serachWordTitle: '',

            // 検索欄に入力した本の著者名
            serachWordAuthors: '',

            // 検索欄に入力した本の感想要約
            serachWordComment: '',

            // 検索欄で選択した読了状態
            searchReading: '',

            // ページの読み込み完了の管理
            getId: false,
        }
    },
    methods: {
        // ユーザーIDを取得(mount時に実行)
        async getUserId() {
            const user = auth.currentUser;
            if (user) {
                this.userId = user.uid
                this.getId = true
                console.log("Get UID: " + this.userId)
            } else {
                console.log("ユーザーが見つかりません1")
            }
        },

        // 登録書籍の情報を取得
        async getBookInfo() {

            // 読み込みアニメーション表示
            this.isLoading = true

            // ログインしているアカウントのユーザーIDを取得
            // どう頑張ってもgetUserId()で取得したユーザーIDを使用できなかった(undefinedになる)ので仕方なく再取得
            const user = auth.currentUser;
            if (user) {

                // データベースから、bookshelfコレクションのサブコレクションbookより、ドキュメントの情報(登録書籍の情報)を取得
                const querySnapshot = await getDocs(collection(db, "bookshelf", this.userId, "book"));
                querySnapshot.forEach((doc) => {
                    const book = {
                        ISBN: doc.id,
                        info: doc.data(),
                        showBookInfo: false,
                        inputNow: false,
                        commentError: '',
                    }
                    this.books.push(book)
                    this.subBooks.push(book)

                    // タイトル一覧を表示
                    this.showBooks = true
                    // サーチメニュー表示
                    this.showSearchMenu = true
                });
                console.log('書籍数: ' + this.books.length + '冊')
                if (this.books.length === 0) {
                    // 検索メニューリンク非表示
                    this.showSearchMenu = false
                    this.errorMessage = "登録された本はありません"
                    console.log('登録された本はありません')
                }
                // console.log(doc.id, " => ", doc.data());
            } else {
                console.log("No such document!");
            }
            // 読み込みアニメーションを停止
            this.isLoading = false

            return true
        },

        // 本棚内の書籍を検索
        searchInBookshelf(title: string, author: string, comment: string, reading: string) {

            // リセットして全ての登録書籍を表示
            this.books = this.subBooks

            if (this.books.length === 0) return

            // 書籍タイトルを表示
            this.showBooks = true

            // エラーメッセージをリセット
            this.errorMessage = ""

            // 読み込みアニメーションを表示
            this.isLoading = true

            // 検索結果を格納する配列
            let searchItems = []

            searchItems = this.books

            // 以下から絞り込み。入力していない項目は絞り込まない。

            // タイトルが部分一致する登録書籍のみ取得
            if (title !== '') searchItems = this.searchTitle(title, searchItems)

            // コメントが部分一致する登録書籍のみ取得
            if (comment !== '') searchItems = this.searchComment(comment, searchItems)

            // 著者名が部分一致する登録書籍のみ取得
            if (author !== '') searchItems = this.searchAuthors(author, searchItems)

            // タイトルが部分一致する登録書籍のみ取得
            if (reading === 'True' || reading === 'False') searchItems = this.seachReading(reading, searchItems)

            // 表示する書籍を絞り込んだ内容に変更
            this.narrowingDown(searchItems)

            console.log('検索結果： ' + this.books.length + '件')
        },

        // 部分一致するタイトルを検索
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searchTitle(title: string, books: any[]) {
            const searchItems = []
            for (let i = 0; i < books.length; i++) {
                // string.includes()：部分一致する場合true
                if (books[i].info.Title.includes(title)) {
                    searchItems.push(books[i])
                }
            }
            return books = searchItems
        },

        // 部分一致するコメントを検索
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searchComment(comment: string, books: any[]) {
            const searchItems = []
            for (let i = 0; i < books.length; i++) {
                // string.includes()：部分一致する場合true
                if (books[i].info.Comment.includes(comment)) {
                    searchItems.push(books[i])
                }
            }
            return books = searchItems
        },

        // 部分一致する著者名を検索
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searchAuthors(author: string, books: any[]) {
            const searchItems = []
            for (let i = 0; i < books.length; i++) {
                for (let j = 0; j < books[i].info.Authors.length; j++) {
                    if (books[i].info.Authors[j].includes(author)) {
                        searchItems.push(books[i])
                    }
                }
            }
            return books = searchItems
        },

        // 一致する読了状態を検索
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        seachReading(reading: string, books: any[]) {
            const searchItems = []
            // rBln：Reading Booleanの略
            let rBln = true
            if (reading === 'False') {
                rBln = false
            }
            for (let i = 0; i < books.length; i++) {
                if (books[i].info.Reading === rBln) {
                    searchItems.push(books[i])
                }
            }
            return books = searchItems
        },

        // 検索結果の絞り込み
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        narrowingDown(searchItems: any[]) {
            if (this.books.length !== searchItems.length) {
                // 絞り込んだ結果0になったらその旨を表示する 
                if (searchItems.length === 0) {
                    this.noBooks()
                } else {
                    // 0じゃなければ結果をそのまま表示する
                    this.books = searchItems
                    console.log("書影 -> " + this.books[0].info.Calligraphy)
                }
            }
            this.isLoading = false
        },

        // 書籍がない場合に呼び出す
        noBooks() {
            this.showBooks = false
            this.errorMessage = "書籍は見つかりませんでした"
        },

        // 検索メニューのワードリセット
        resetSearchWord() {
            this.serachWordTitle = ""
            this.serachWordAuthors = ""
            this.serachWordComment = ""
        },

        // FirebaseDBのドキュメントのPathを取得
        getDocPath(isbn: string) {
            const docPath = doc(db, "bookshelf", this.userId, "book", isbn)
            return docPath
        },

        // 書籍詳細情報の表示・非表示
        BookInfoOpenClose(index: number) {
            if (this.books[index].showBookInfo) {
                this.books[index].showBookInfo = false
                this.showBooks = true
                this.showSearchMenu = true
            } else {
                this.books[index].showBookInfo = true
                this.showBooks = false
                this.showSearchMenu = false
            }
            // エラーメッセージの削除
            this.errorMessage = ""
        },

        // 登録書籍を削除
        async deleteBook(docPath: DocumentReference, title: string, index: number) {
            const result = confirm("「" + title + '」を削除しますか？')
            if (!result) return

            // 読み込みアニメーション表示
            this.isLoading = true

            this.showBooks = true

            // データベースから削除
            await deleteDoc(docPath);

            // 画面上から該当書籍を削除
            for (let i = 0; i < this.subBooks.length; i++) {
                if (this.subBooks[i].ISBN === this.books[index].ISBN) {
                    console.log('削除sub -> ' + this.subBooks[i].ISBN)
                    this.subBooks.splice(i, 1)
                }
            }
            console.log('削除 -> ' + this.books[index].ISBN)
            this.books.splice(index, 1)

            // 読み込みアニメーション非表示
            this.isLoading = false

            alert("「" + title + "」を本棚から削除しました。")
            console.log("削除成功 -> " + title)

            // 削除した結果0冊になったらメッセージを表示
            if (this.books.length === 0) {
                this.noBooks()
            }

            this.showSearchMenu = true
        },

        // 読了状態の更新
        async passReadingData(docPath: DocumentReference, reading: boolean) {
            await updateDoc(docPath, {
                Reading: reading
            });
        },

        // コメント入力を終了する
        async closeInput(docPath: DocumentReference, comment: string, index: number) {
            this.books[index].commentError = ""
            if (comment.length > 400) return this.books[index].commentError = "コメントは400文字以内に収めてください"
            // データベースに入力したコメントを反映
            await updateDoc(docPath, {
                Comment: comment
            });

            // コメント入力をやめる
            this.books[index].inputNow = false
        },

        // 本棚を削除
        async deleteBookshelf(userId: string) {
            // 削除の意思の確認
            const result = confirm('本棚内の書籍を全て削除しますがよろしいですか？')
            if (!result) { return }

            // 読み込みアニメーション表示
            this.isLoading = true

            // サブコレクションbookの情報を取得
            const querySnapshot = await getDocs(collection(db, "bookshelf", userId, "book"));
            // サブコレクション内のドキュメントを削除する処理を、ドキュメントの数分繰り返す
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref)
                // 画面から削除
                this.books.splice(0, 1)
                console.log("削除成功 -> " + doc.id)
            });
            alert("本棚から全ての本を削除しました。")

            // 読み込みアニメーション非表示
            this.isLoading = false

            // 検索メニュー非表示
            this.showSearchMenu = false

            // エラーメッセージ
            this.errorMessage = "登録された本はありません"
        },

        // Deleteへ移動
        goToDelete() {
            const nowRoute = this.$route.path
            if (nowRoute != '/delete') {
                this.$router.push('/delete')
            }
        }

    },
    computed: {

    },
    async mounted() {
        await this.getUserId()
        await this.getBookInfo()
    }
});
</script>

<style scoped>
/* body {
    background-color: rgb(198, 216, 220);

} */

main {
    /* border: solid purple 3px; */
    width: 100%;
    padding: 30px auto;
}

.container {
    width: 100%;
    margin: 30px 0 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    /* border: solid 10px black; */
}

.search_menu_container {
    /* border: solid red 1px; */
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(255, 255, 255, .6);
    padding: 30px;
    border-radius: 20px;
}

.search_menu {
    /* border: solid 1px; */
    width: 500px;
    display: flex;
    flex-direction: column;
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

.reading_search {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 5px 0 10px 0;
    /* background-color: green; */
}

.input_radio {
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    /* background-color: yellow; */
}

.input_radio_child {
    display: flex;
    align-items: center;
    margin-right: 10px;
}

.in_search_title {
    text-align: start;
    margin-top: 5px;
    color: rgb(44, 74, 140);
    font-weight: bold;
    /* background-color: blue; */
}

.options_title {
    padding: 0;
    margin: 0;
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

/* .close {
    height: 50px;
} */

/* .search_button {
    width: 30%;
} */

.search_view_button {
    /* border: solid 1px; */
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 50px;
}

.books_container {
    min-width: 50%;
    background-color: rgba(242, 241, 255, 0.6);
    padding: 30px;
    margin: 5% 10%;
    border-radius: 20px;
}

.book_titles {
    display: flex;
    flex-wrap: wrap;
}

.book_title_container {
    /* max-width: 40%; */
    margin: 15px;
    height: 200px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: auto;
    width: 40%;
    /* border: solid black; */
}

.book_title_container p {
    margin-bottom: 7px;
}

.book_image_container {
    height: 70%;
}

.book_image_container:hover {
    cursor: pointer;
}

.book_image_container img {
    height: 100%;
    width: auto;
    max-width: 100%;
}

.book_info_container {
    width: 100%;
    /* border: solid 10px red; */
}

.top_container {
    /* border: solid 10px blueviolet; */
    display: flex;
    justify-content: center;
}

.contents_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.content_child {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 10px;
    /* border: solid yellow; */
}

.content_child p {
    padding: 10px;
    text-align: start;
}

.content_name {
    font-style: italic;
    font-weight: bold;
    text-decoration: underline;
    justify-self: center;
    border-radius: 10px;
    color: rgb(11, 43, 129);
}

.authors {
    display: flex;
    flex-direction: row;
    float: left;
    flex-wrap: wrap;
    /* border: solid purple; */

}

.content_value {
    font-size: 25px;
    background-color: black;
    color: white;
    border-radius: 10px;
    margin: 0 10px 5px 0;
}

.middle_container {
    display: flex;
    flex-direction: column;
}

.image_container {
    /* border: solid skyblue; */
    height: 250px;
    margin: 30px 0;
}

img {
    width: auto;
    height: 100%;
}

.book_option_container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    padding: 15px;
}

.reading_container {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 15px;
    border-radius: 7px;
    background-color: rgb(74, 74, 234);
}

.reading_container input {
    transform: scale(1.5);
    margin-right: 8px;
    accent-color: rgb(20, 227, 20);
}

.reading_container p {
    color: white;
}

.bottom_container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    /* border: solid red; */
}

.comment_header_container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    /* border: solid plum; */
    padding: 8px;
}

.comment_head {
    flex-grow: .8;
}

.comment_text_container {
    display: flex;
    justify-content: center;
    align-content: center;
    border-radius: 15px;
    padding: 10px;
    margin: 0 5%;
    box-shadow: rgba(37, 37, 178, 0.6) 8px 8px, rgb(0, 0, 255, .6) -5px -5px;
    /* border: solid red; */

}

.close_container {
    margin-top: 28px;
    display: flex;
    justify-content: center;
}

.comment_true {
    /* border: solid green; */
    width: 100%;
}

.comment_text {
    min-width: 100%;
    max-width: 100%;
    min-height: 100px;
    max-height: 120px;
    box-sizing: border-box;
    font-size: 20px;
}

.comment_error {
    margin-top: 15px;
    /* border: solid red; */
}

.error_container {
    padding: 15px;
}

.bookshelf_bottom {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    padding: 10px;
    background-color: rgb(255, 255, 255, .6);

}

@media screen and (max-width:700px) {
    * {
        font-size: 15px;
    }

    .content_value {
        font-size: 20px;
    }

    .search_menu_container {
        padding: 10px;
        width: 85%;
    }

    .search_button_div {
        justify-content: space-around;
        margin-top: 0;
    }

    .books_container {
        padding: 10px;
    }

    .book_title_container {
        width: 37%;
        margin: 5px 15px 3px 7px;
    }

    .book_title_container p {
        margin-bottom: 10px;
    }

    .image_container {
        height: 200px;
    }

    img {
        width: auto;
        height: 100%;
    }

    .comment_text {
        min-width: 200px;
        font-size: 12px;
        max-width: 270px;
    }
}

@media screen and (max-width:380px) {
    .book_title_container {
        width: 35%;
        height: 180px;
        margin-bottom: 15px;
    }

    .book_title_container p {
        font-size: 10px;
    }

    .book_title_container img {
        width: 85%;
        height: auto;
    }
}
</style>