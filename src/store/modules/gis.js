const gisApp = {
  state: {
    app: {},
    area: null,
    coverId: null,
    lonAndLat: null,
    carId: null,
    pointObj: null
  },
  mutations: {
    addMap: (state, views) => {
      state.app.map = views
      console.log(state.app)
    },
    saveArea: (state, views) => {
      state.area = views
      console.log(state.area)
    },
    savePoint: (state, views) => {
      state.pointObj = views
      console.log(state.pointObj)
    },
    setCoverId: (state, views) => {
      state.coverId = views
      console.log(state.coverId)
    },
    setLonAndLat: (state, views) => {
      state.lonAndLat = views
      console.log(state.lonAndLat)
    },
    addMovingLayer: (state, views) => {
      state.app.movingLayer = views
      console.log(state.app.movingLayer)
    },
    addCarId: (state, views) => {
      state.carId = views
      console.log(state.carId)
    }
  }
}

export default gisApp
