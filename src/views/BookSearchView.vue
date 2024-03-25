<template>

  <head>

  </head>

  <body>
    <HeaderComponent></HeaderComponent>
    <header>
      <h1 class="title">書籍検索</h1>
    </header>
    <main>
      <div class="container">
        <div class="search_option">
          <input type="text" placeholder="ISBNコードを入力" v-model="inputIsbn">
          <button class="btn_standard" v-on:click="bookSearch()">検索</button>

        </div>
        <div class="message" v-if="errorMessage || announce">
          <p class="red">{{ errorMessage }}</p>
          <p class="blue">{{ announce }}</p>
        </div>
        <div class="loading_animation" v-if="isLoading">
          <LoadingAnimationComponent></LoadingAnimationComponent>
        </div>
        <div id="book_info" v-if="showTable">
          <table>
            <tr>
              <td rowspan="4" class="calligraphy">
                <img v-if="calligraphy" :src="calligraphy" alt="書影">
                <img v-else src="../assets/NoIMAGE.png">
              </td>
              <td class="td_title">
                <span class="contents_title">書名</span>
              </td>
              <td>{{ title }}</td>
            </tr>
            <tr>
              <td>
                <span class="contents_title">著者名</span>
              </td>
              <td>
                <span class="authors" v-for="author in authors" :key="author">
                  {{ author }}&nbsp;&nbsp;
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="contents_title">出版社</span>
              </td>
              <td>{{ publisher }}</td>
            </tr>
            <tr>
              <td>
                <span class="contents_title">出版年月</span>
              </td>
              <td>{{ publishedDate }}</td>
            </tr>
          </table>
          <button v-on:click="bookRegistration">本棚に登録</button>
        </div>

      </div>

    </main>
    <FooterComponent></FooterComponent>
  </body>
</template>

<script lang="ts">
import FooterComponent from '@/components/FooterComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import LoadingAnimationComponent from '@/components/LoadingAnimationComponent.vue'
import { defineComponent, ref } from 'vue'

// Firebase関連インポート
import { getAuth } from 'firebase/auth'
const auth = getAuth();

import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
const db = getFirestore();

export default defineComponent({
  components: {
    HeaderComponent,
    FooterComponent,
    LoadingAnimationComponent,
  },
  data() {
    const inputIsbn = ref();
    const calligraphy = ref();
    return {
      // 入力されたISBNコード
      inputIsbn,

      // エラーメッセージ
      errorMessage: '',

      // アナウンスメッセージ
      announce: '',

      // 読み込みアニメーション
      isLoading: false,

      // 書籍タイトル
      title: '',

      // 著者
      authors: [],

      // 書影URL
      calligraphy,

      // 出版社
      publisher: '',

      // 出版年月日
      publishedDate: '',

      // 書影の表示
      showTable: false,

      // APIから受け取ったデータに書影がなかった場合に代わりに表示する画像
      noImage: '../assets/NoIMAGE.png',
    }
  },

  methods: {

    // 書籍検索
    bookSearch() {
      // 入力欄が空であるかを確認
      if (this.inputIsbn === undefined || this.inputIsbn === '') {
        return this.errorMessage = "ISBNコードを入力してください。"
      }

      // 読み込みアニメーション開始
      this.isLoading = true

      // すでに表示されているエラーメッセージやアナウンスを消す
      this.errorMessage = ""
      this.announce = ""

      // fetch()メソッド：「非同期通信でリクエストを発行、そのレスポンスを取得」することができる
      // GoogleBooksAPIにリクエストを送る
      const json = fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:' + this.inputIsbn);
      Promise.resolve(json).then(result => {
        return result.json()
      }).then(response => {

        const riv = response.items[0].volumeInfo

        // 上から順に、書籍のタイトル、著者、書影URL、出版社、出版年月日
        this.title = riv.title
        this.authors = riv.authors
        this.calligraphy = this.image(riv)
        this.publisher = riv.publisher
        this.publishedDate = riv.publishedDate

        // 書籍データを取得できた場合、書籍情報のテーブルを表示
        this.showTable = true

        // 読み込みアニメーションの終了
        this.isLoading = false
      }).catch((error) => {

        this.errorMessage = "書籍がみつかりません。ISBNコードが正しいか確認してください。"
        console.log("error -> " + error)

        // 書籍情報の非表示
        this.showTable = false

        // 読み込みアニメーション終了
        this.isLoading = false
      });
    },

    // 画像情報を取得する
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image(riv: any) { return riv.imageLinks ? riv.imageLinks.thumbnail : '' },

    // 書籍登録
    async bookRegistration() {
      // ユーザーIDを取得する
      const user = auth.currentUser;
      if (user) {
        const uId = user.uid

        // ドキュメントのパス(bookshelf/uId/book/book/ISBN)
        const docPath = doc(db, "bookshelf", uId, "book", this.inputIsbn)

        // 登録する前にすでに同じデータが登録されていないか確認する
        // getDocでドキュメントの情報を取得
        const docSnap = await getDoc(docPath);

        // getDocで取得したドキュメントが既に登録されている場合はその旨を表示
        // されていない場合は検索した書籍情報を登録
        if (docSnap.exists()) {
          this.announce = "すでに登録されている本です"
        } else {
          await setDoc(docPath, {
            Title: this.title,
            Authors: this.authors,
            Calligraphy: this.calligraphy,
            Publisher: this.publisher,
            PublishedDate: this.publishedDate,
            ISBN: this.inputIsbn,

            // 読了状態を初期化
            Reading: false,

            // コメント(感想要約)を初期化
            Comment: '',
          })
          this.announce = "本棚に登録しました"
        }
      }
    }
  }
})
</script>

<style scoped>
header h1 {
  width: 100%;
}

main {
  padding: 30px auto;
}

.container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.search_option {
  display: flex;
  justify-content: center;
  margin: 30px 0 0;
}

.container input {
  width: 300px;
}

.message {
  background-color: rgba(255, 255, 255, .8);
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
}

button {
  margin-left: 5px;
}

.loading_animation {
  height: 15px;
  margin-top: 10px;
}

#book_info {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 15px;
  margin-top: 30px;
  flex-direction: column;
}

table {
  max-width: 700px;
  table-layout: fixed;
  margin-bottom: 30px;
  border: inset 10px rgb(214, 214, 230);
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.7);
}

td {
  text-align: start;
  padding: 5px 0 5px 0;
}

.td_title {
  width: 110px;
  padding: auto;
}

.contents_title {
  display: flex;
  justify-content: center;
  background-color: rgb(8, 8, 108);
  color: white;
  padding: 7px;
  margin-right: 7px;
  border-radius: 7px;
}

img {
  width: auto;
  padding: 0 20px 0 0;
  margin: 0;
}

.authors {
  font-size: 100%;
}

@media screen and (max-width:480px) {
  .container {
    flex-direction: column;
    margin: 30px 0 0;
    align-items: center;
  }

  .search_option {
    flex-direction: column;
    align-items: center;
  }

  button {
    margin-top: 20px;
  }

  td {
    font-size: 15px;
  }

  .contents_title {
    font-size: 15px;
  }

}
</style>