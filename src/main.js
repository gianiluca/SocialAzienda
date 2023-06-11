import './assets/main.css'

import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { createPinia } from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import { useSessionStore } from './stores/sessionStore'

//import dei dati da App.vue grazie all'export presente nel file
//global import dei components
import App from './App.vue'
import Navbar from './components/minicomponents/Navbar.vue'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import ManageAccount from './components/ManageAccount.vue'
import Home from './components/Home.vue'
import Message from './components/Message.vue'
import Profile from './components/Profile.vue'
import CreatePost from './components/CreatePost.vue'
import Explore from './components/Explore.vue'

import SideBar from './components/minicomponents/SideBar.vue'
import SideRight from './components/minicomponents/SideRight.vue'
import Content from './components/minicomponents/Content.vue'
import ContentMessage from './components/minicomponents/ContentMessage.vue'
import ContentProfile from './components/minicomponents/ContentProfile.vue'
import ContentCreatePost from './components/minicomponents/ContentCreatePost.vue'
import ContentExplore from './components/minicomponents/ContentExplore.vue'
import Popup from './components/minicomponents/Popup.vue'
import Footer from './components/minicomponents/Footer.vue'
import PopupStoria from './components/minicomponents/PopupStoria.vue'
import PopupImg from './components/minicomponents/PopupImage.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/Account/Login', component: Login},
        { path: '/Account/Signup', component: Signup},
        { path: '/Account/Settings', component: ManageAccount},
        { path: '/', component: Home},
        { path: '/Chat', component: Message},
        { path: '/Profile/:username', component: Profile },
        { path: '/CreatePost', component: CreatePost },
        { path: '/Explore', component: Explore }
    ]
});

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia);

router.beforeEach(async (to, from) => {
    const store = useSessionStore()
    if (!store.isAuthenticated && to.path !== '/Account/Login' && to.path !== '/Account/Signup') {       // ❗️ Avoid an infinite redirect with to.path !==
      return { path: '/Account/Login', component: Login}
    }
  })

app.use(router);
app.use(VueSweetalert2);
app.component('NavbarComponent', Navbar)
app.component('SideBarComponent', SideBar)
app.component('SideRightComponent', SideRight)
app.component('ContentComponent', Content)
app.component('FooterComponent', Footer)
app.component('ContentMessageComponent', ContentMessage)
app.component('ContentProfileComponent', ContentProfile)
app.component('ContentCreatePostComponent', ContentCreatePost)
app.component('PopupComponent', Popup)
app.component('ContentExploreComponent', ContentExplore)
app.component('PopupStoriaComponent', PopupStoria)
app.component('PopupImageComponent', PopupImg)
app.mount('#app')