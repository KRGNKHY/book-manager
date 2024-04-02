<div id="top"></div>

## 使用技術一覧

<p style="display: inline">
  <!-- 使用言語・フレームワーク一覧 -->
  <img src="https://img.shields.io/badge/-TypeScript-000000.svg?logo=typescript&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Vue.js-000000.svg?logo=vue.js&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Node.js-000000.svg?logo=node.js&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Firebase-f0f0f0.svg?logo=firebase&style=for-the-badge">
</p>

## 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [機能説明](#機能説明)
3. [システム構成](#システム構成)
4. [開発環境構築](#開発環境構築)
5. [アプリURL](#アプリURL)
6. [サンプルイメージ](#サンプルイメージ)

## プロジェクト名
書籍管理アプリ

## プロジェクトについて
<div id="プロジェクトについて"></div>
読書体験が豊かになるアプリケーションを開発する。このアプリはユーザーが実際に書籍を読んだ感想や要約を記録でき、それをいつでも簡単に見返すことができることで内容を思い出せ、役立つ知識を生活で使えることができるものである。

<p align="right">(<a href="#top">トップへ</a>)</p>

## 機能説明
<div id="機能説明"></div>

- アカウント管理機能(アカウント作成～退会)を備えている。
- ログインしたユーザーはISBNコードを入力して書籍を検索することができ、入力した値と一致する書籍の情報を表示する。書籍情報はGoogle Books APIによってインターネットから自動で取得するよう設計されている。また、検索した書籍を登録して管理することもできる。
- 登録した書籍は読了状態のチェックをしたり、コメントをつけたりすることができる。また、登録を解除することもできる。
- 管理者はユーザー情報(メールアドレス・パスワード)の変更、アカウントの削除をすることができる。

<p align="right">(<a href="#top">トップへ</a>)</p>

## システム構成
<div id="システム構成"></div>
ユーザーはインターネットを通してFirebase Authenticationにアカウントを作成・登録することができる。<br>
また、Google Books APIを通して検索した書籍を、Cloud Firestoreのデータベースに登録することができる。<br>
<img width=50% alt="システム構成図" src="https://github.com/KRGNKHY/book-manager/assets/117788763/64e47d40-a8c6-44cb-9c01-c2110a094af6">

<p align="right">(<a href="#top">トップへ</a>)</p>

## 開発環境構築
【前提条件】
- Node.jsインストール済み
- Firebaseのアカウント作成済みでプロジェクトの権限を有している
- book-managerという名前のディレクトリをルートディレクトリとして、このプロジェクト内のファイルを全てインストールしている

#### ⅰ.パッケージインストール
##### グローバルインストール
Vue CLIとFirebase-Toolsをグローバルインストールする
```
npm install -g @vue/cli
```
```
npm install -g firebase-tools
```

##### ローカルインストール
<strong>※必要なパッケージはプロジェクト内にインストール済みなので基本的にローカルインストールは必要ありません</strong>

プロジェクトに必要なパッケージは以下のコマンドでインストールできます<br>
※プロジェクトのルートディレクトリでコマンドを実行してください<br>

```
npm install パッケージ名
```

<!-- #### ⅱ.Firebaseの初期化
Firebaseにログイン
```
firebase login
```

Firebaseを初期化する
```
firebase init
```
表示される選択肢は以下のように選択
+ ? Are you ready to proceed? 
→Yes

+ ? Which Firebase features do you want to set up for this directory? Press Space to select features, then Enter to confirm your choices. 
→Hosting:Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys

+ ? Please select an option: (Use arrow keys)
→Use an existing project

+ ? Select a default Firebase project for this directory: (Use arrow keys)
→createapp-95361 (CreateApp)

   - (ログイン済みのFirebaseアカウントに紐づいた、Firebaseプロジェクトが表示されるので、使用するプロジェクトを選択する)

+ ? What do you want to use as your public directory?
→dist と入力

+ ? Configure as a single-page app (rewrite all urls to /index.html)?
→Yes

+ ? Set up automatic builds and deploys with GitHub?
→No

+ ? File public/index.html already exists. Overwrite?
→No -->

#### ⅱ.ローカル環境でアプリを実行
```
npm run serve
```
処理が完了したらhttp://localhost:8080/にアクセス

#### ⅲ.ビルドする
以下のコマンドでプロジェクトをBuildできる
ビルドされたデータはdistフォルダに格納される
```
npm run build
```
※ビルド：ソースコードを機械語に翻訳(コンパイル)して、実際に動作するプログラムを作り出すこと

#### ⅳ.ホスティングする
ビルドしたデータは以下のコマンドでホスティングできる
```
firebase --only hosting
```
ホスティングで公開されたデータは[アプリURL](#アプリURL)からアクセス可能

※ホスティング：サーバーにデータを預けること

## アプリURL
<div id="アプリURL"></div>

<strong>【書籍管理アプリ ログインページ】</strong><br>
https://createapp-95361.web.app

#### サンプルアカウント
以下のメールアドレスとパスワードを入力することでログインすることができます。

- Mail:      sample@gmail.com<br>
- Password:  123456

## サンプルイメージ
<div id="サンプルイメージ"></div>

- ログイン画面<br>
<img alt="ログイン画面" src="https://github.com/KRGNKHY/book-manager/assets/117788763/3f820900-17b0-4cf5-8560-23d168072a03" width="50%"/>

- 書籍検索<br>
<img alt="書籍検索画面" src="https://github.com/KRGNKHY/book-manager/assets/117788763/91797ef4-5d77-46fb-96dd-15fd81b9c833" width="50%"/>

- 登録書籍一覧<br>
<img alt="登録書籍一覧画面" src="https://github.com/KRGNKHY/book-manager/assets/117788763/94cb7da2-a611-4dbe-a97b-a130d825b630" width="50%"/>

- 書籍詳細<br>
<img alt="書籍詳細表示" src="https://github.com/KRGNKHY/book-manager/assets/117788763/e92a5894-ad17-4705-92e2-290444d8f438" width="50%"/>

- 書籍へのコメント<br>
<img alt="書籍へのコメント" src="https://github.com/KRGNKHY/book-manager/assets/117788763/15460908-e69a-4470-bacb-d28e9ad0f244" width="50%"/>

<p align="right">(<a href="#top">トップへ</a>)</p>
