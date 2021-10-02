import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Rol from '../components/Rol.vue'
import Skill from '../components/Skill.vue'
import Usuario from '../components/Usuario.vue'
import Artist from '../components/Artist.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
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
    component: Artist,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/skills',
    name: 'skills',
    component: Skill,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/roles',
    name: 'roles',
    component: Rol,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: Usuario,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
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
  } else if (store.state.usuario && store.state.usuario.rol == 'JefeAdministracion') {
      if (to.matched.some(record => record.meta.jefeadministracion)) {
          next();
      }
  } else if (store.state.usuario && store.state.usuario.rol == 'AsistAdministracion') {
      if (to.matched.some(record => record.meta.asistadministracion)) {
          next();
      }
  } else if (store.state.usuario && store.state.usuario.rol == 'LiderProyecto') {
      if (to.matched.some(record => record.meta.liderproyecto)) {
          next();
      }
    } else if (store.state.usuario && store.state.usuario.rol == 'Consultor') {
      if (to.matched.some(record => record.meta.consultor)) {
          next();
      }
  } else if (store.state.usuario && store.state.usuario.rol == 'Dataentry') {
      if (to.matched.some(record => record.meta.dataentry)) {
          next();
      }
  } else {
      next({
        name: 'login'
    });
  }
});

export default router
