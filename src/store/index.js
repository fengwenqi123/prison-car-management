import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import user from './modules/user'
import getters from './getters'
import tagsView from './modules/tagsView'
import gis from './modules/gis'
import carData from './modules/carData'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    tagsView,
    permission,
    user,
    gis,
    carData
  },
  getters
})

export default store
