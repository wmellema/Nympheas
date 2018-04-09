import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import App from './views/App'
import Hello from './views/Hello'
import Home from './views/Home'
import Monsters from './views/monsters/Monsters'
import LMonster from './views/monsters/Monster-Large'


const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/hello',
            name: 'hello',
            component: Hello,
        },
        {
            path: '/monsters',
            name: 'monsters',
            component: Monsters,
        },
    ],
});

Vue.component('monster-lg',LMonster);
const app = new Vue({
    el: '#app',
    components: { App },
    router,
});
