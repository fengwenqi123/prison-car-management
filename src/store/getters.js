const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  upLoadUrl: state => state.app.upLoadUrl,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  app: state => state.gis.app,
  pointObj: state => state.gis.pointObj,
  area: state => state.gis.area,
  coverId: state => state.gis.coverId,
  lonAndLat: state => state.gis.lonAndLat,
  carId: state => state.gis.carId,
  carArr: state => state.carData.carArr
}
export default getters
