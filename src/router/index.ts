import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BookSearchView from '@/views/BookSearchView.vue'
import LoginView from '@/views/LoginView.vue'
import BookshelfView from '@/views/BookshelfView.vue'
import CreateView from '@/views/CreateView.vue'
import DeleteView from '@/views/DeleteView.vue'
import ManagerView from '@/views/ManagerView.vue'

// 画面遷移前にログイン済みかを判定するメソッドに必要なFirebaseのメソッド
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth()

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'bookSearch',
    component: BookSearchView,
    meta: { title: '書籍検索', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'ログイン', requiresAuth: false }
  },
  {
    path: '/bookshelf',
    name: 'bookshelf',
    component: BookshelfView,
    meta: { title: '本棚', requiresAuth: true }
  },
  {
    path: '/create',
    name: 'create',
    component: CreateView,
    meta: { title: 'アカウント作成', requiresAuth: false }
  },
  {
    path: '/delete',
    name: 'delete',
    component: DeleteView,
    meta: { title: 'アカウント削除', requiresAuth: true }
  },
  {
    path: '/manager',
    name: 'manager',
    component: ManagerView,
    meta: { title: '管理者画面', requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 画面遷移成功後にページタイトルを設定
router.afterEach((titleString) => {
  document.title = titleString.meta.title + " | 書籍管理システム"
})


// 画面遷移前にログイン済みかをチェックして、未ログイン時はログイン画面に強制遷移させる
router.beforeEach((to, from, next) => {
  if (!to.matched.some(record => record.meta.requiresAuth)) {
    next()
    // console.log('!requiresAuth')
  } else {
    if (auth.currentUser) {
      next()
      // return console.log('認証済み')
    } else {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          if (to.name === 'manager' && user.uid !== 'KzEQdcnHzsWspSLIx1ux9IRTqim2') {
            next({ name: 'bookSearch' })
            // console.log('管理者以外は管理者画面への遷移はできません')
          } else {
            next()
            // console.log('遷移を許可')
          }
        } else {
          unsubscribe();
          next({ name: 'login' })
          // console.log('ログインしていないユーザーは遷移はできません')
        }
      })
    }
  }
})

export default router
