const car = {
  state: {
    carArr: null
  },
  mutations: {
    addCarInfo: (state, views) => {
      state.carArr = views
      // console.log(state.carArr)
    }
  }
}

export default car
