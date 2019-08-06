import {View, Map} from 'ol'
import {defaults} from 'ol/control/util.js'
import mapconfig from '@/utils/mapconfig.js'
import {ScaleLine, MousePosition} from 'ol/control'
import {createStringXY} from 'ol/coordinate'
import {defaults as Idefaults} from 'ol/interaction'
import store from '@/store'
import {getMapLevel, clickevent} from './HTool'

export function init(mapcontainer) {
  const map = new Map({
    target: mapcontainer,
    layers: mapconfig.streetmap(),
    view: new View({
      center: [mapconfig.x, mapconfig.y], // 深圳
      zoom: mapconfig.zoom,
      minZoom: mapconfig.minZoom,
      maxZoom: mapconfig.maxZoom,
      projection: mapconfig.projection,
      extent: mapconfig.extent
    }),
    controls: defaults().extend([
      new ScaleLine({}), //显示比例尺
      new MousePosition({
        coordinateFormat: createStringXY(6),
        projection: 'EPSG:4326',
        target: document.getElementById('coor')
      })
    ]),
    //取消双击地图放大事件
    interactions: Idefaults({
      doubleClickZoom: false
    }),
    logo: false
  })
  // store.commit('addMovingLayer', mapconfig.streetmap()[1])
  store.commit('addMap', map)
  initMapEvent(map)
}

/**
 * 地图事件
 * @param {ol.Map} map
 */
function initMapEvent(map) {
  //地图移动事件(含地图加载完毕后触发事件,不含图层)
  map.on('moveend', function (e) {
    //显示当前地图层级
    var currentLevel = getMapLevel()
    document.getElementById('maplevel').innerHTML = currentLevel
  })

  //鼠标移动事件
  map.on('pointermove', function (e) {
    //判定为要素时鼠标指针变为手形
    var pixel = map.getEventPixel(e.originalEvent)
    var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
      return feature
    })
    if (feature) {
      var featureType = feature.getProperties()['type']
      if (feature || featureType == undefined) {
        map.getTargetElement().style.cursor = 'pointer'
      }
    } else {
      map.getTargetElement().style.cursor = 'auto'
    }
  })
  clickevent(map)
}
