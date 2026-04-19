import Vue from 'vue'
import vuex from 'vuex'
import app from './modules/app'
import tab from './modules/tab'
import iframe from './modules/iframe'
import user from './modules/user'
import menu from './modules/menu'

Vue.use(vuex);

const store = new vuex.Store({
    modules: {
        app: app,
        tab: tab,
        iframe: iframe,
        user: user,
        menu: menu
    }
})

export default store
