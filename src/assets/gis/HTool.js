import store from '@/store'
import HInfoLayer from "./HInfoLayer";
import {fromLonLat, toLonLat} from 'ol/proj.js'
import {loadInfoLayer} from './loadgisdata'
import {showPopup} from './gis'
import {Fill, Stroke, Text} from "ol/style"
import {Select} from 'ol/interaction'

/**
 * GIS基本操作工具集
 * created by zj on 2018.7.30
 */

/**
 * wgs84坐标转webMercator
 * @param {Number} lon
 * @param {Number} lat
 * @return {Array[Number]}} Lonlat
 */
export function wgs84ToWebMct(lon, lat) {
  var Lonlat = fromLonLat([lon, lat])
  return Lonlat
}

/**
 * WebMercator转WGS84
 * @param {Number} lon
 * @param {Number} lat
 * @return {Array[Number]} Lonlat
 */
export function webMctToWGS84(lon, lat) {
  var Lonlat = toLonLat([lon, lat])
  return Lonlat
}

/**
 * 要素图层显隐
 * @param {String} layertype 要素图层类型
 * @param {Boolean} isVisible
 */
export function showInfoLayer(layertype, isVisible) {
  try {
    if (layertype) {
      var mapLayers = store.getters.app.map.getLayers().getArray()
      for (let i = 0; i < mapLayers.length; i++) {
        var layerType = mapLayers[i].getProperties()['type']
        if (layerType == layertype) {
          var showedLayer = mapLayers[i]
          showedLayer.setVisible(isVisible)
        }
      }
    }
  } catch (e) {
    console.log(e.name + ':' + e.message)
  }

}

/**
 * 获取地图当前层级
 * @return {Number} mapZoom 地图中心层级
 */
export function getMapLevel() {
  var view = store.getters.app.map.getView()
  var mapLevel = Math.round(view.getZoom())
  return mapLevel
}


/**
 * 增加业务图层方法
 * @param {ol.Map} map
 * @description 页面取用图层时需要添加定时器函数
 */
// export function addInfoLayers(app) {
//   app.coverLayer = new HInfoLayer("cover", true, 20, 0);
//   app.map.addLayer(app.coverLayer.layer);
// }


/**
 * 所有地图资源加载完毕后执行的GIS操作
 */
export function startGISWork() {
  setTimeout(function () {
    loadInfoLayer();				//分图层加载要素
    showPopup(store.getters.app);				//显示弹出框
  }, 0);
}

export function pointTo(lon, lat, zoom) {
  try {
    var lonlat = wgs84ToWebMct(lon, lat);
    var mapView = store.getters.app.map.getView(store.getters.app.map.getSize());
    mapView.animate({center: lonlat}, {zoom: zoom});
  } catch (e) {
    console.log(e.name + ":" + e.message);
  }
}

export function addInfoLayers(app) {
  app.movingLayer = new HInfoLayer("movingLayer", true, 20, 0);
  app.map.addLayer(app.movingLayer.layer);
}

export function setTextStyle(name, size, textColor, offsetx, offsety, textscale) {
  var textFont = size + "px Microsoft YaHei";
  var textStyle = new Text({
    text: name,
    font: textFont,
    scale: textscale,
    textAlign: 'left',
    offsetY: offsety ? offsety : -18,
    offsetX: offsetx ? offsetx : 15,
    fill: new Fill({
      color: textColor
    }),
    stroke: new Stroke({
      color: [255, 255, 255],
      width: 1.5
    })
  });
  return textStyle;
}

export function clickevent(map) {
  map.on('click', function (e) {
    var pixel = map.getEventPixel(e.originalEvent)
    map.forEachFeatureAtPixel(pixel, function (feature) {
      store.commit('addCarId', feature.getProperties().id)
    })
  })
}
