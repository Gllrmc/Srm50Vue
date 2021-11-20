import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
// import Skill from '../components/Skill.vue'
// import Rol from '../components/Rol.vue'
// import Usuario from '../components/Usuario.vue'
// import Artist from '../components/Artist.vue'
// import Checkinset from '../components/Checkinset.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      administrador: true,
      owner: true,
      collaborator:true, 
      reader: true,
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta:{
      libre: true
    }
  },
  {
    path: '/artists',
    name: 'artists',
    component: () => import(/* webpackChunkName: "artists" */ '../components/Artist.vue'),
    meta: {
      administrador: true,
      owner: true,
      collaborator:true, 
      reader: true,
    }
  },
  {
    path: '/preselects',
    name: 'preselects',
    component: () => import(/* webpackChunkName: "preview" */ '../components/Preselect.vue'),
    meta: {
      administrador: true,
      owner: true,
      collaborator:true, 
      reader: true,
    }
  },
  {
    path: '/skills',
    name: 'skills',
    component: () => import(/* webpackChunkName: "preview" */ '../components/Skill.vue'),
    meta: {
      administrador: true,
      owner: true,
      collaborator:false, 
      reader: false,
    }
  },
  {
    path: '/roles',
    name: 'roles',
    component: () => import(/* webpackChunkName: "admin" */ '../components/Rol.vue'),
    meta: {
      administrador: true,
      owner: true,
      collaborator:false, 
      reader: false,
    }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: () => import(/* webpackChunkName: "admin" */ '../components/Usuario.vue'),
    meta: {
      administrador: true,
      owner: true,
      collaborator:false, 
      reader: false,
    }
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)) {
      next();
  } else if (store.state.usuario && store.state.usuario.rol == 'Administrador') {
      if (to.matched.some(record => record.meta.administrador)) {
          next();
      }
  } else if (store.state.usuario && store.state.usuario.rol == 'Owner') {
      if (to.matched.some(record => record.meta.owner)) {
          next();
      }
  } else if (store.state.usuario && store.state.usuario.rol == 'Collaborator') {
      if (to.matched.some(record => record.meta.collaborator)) {
          next();
      }
  } else if (store.state.usuario && store.state.usuario.rol == 'Reader') {
      if (to.matched.some(record => record.meta.reader)) {
          next();
      }
  } else {
      next({
        name: 'login'
    });
  }
});

export default router
