import {Vector} from 'ol/layer'
import {Vector as SVector} from 'ol/source'
import store from '@/store'
import {Draw} from 'ol/interaction.js'
import {Style, Fill, Stroke, Circle} from 'ol/style'
import {toLonLat} from 'ol/proj.js'

/**
 * WebMercator转WGS84
 * @param {Number} lon
 * @param {Number} lat
 * @return {Array[Number]} Lonlat
 */
function webMctToWGS84(lon, lat) {
  var Lonlat = toLonLat([lon, lat]);
  return Lonlat;
}

/**
 * 绘制要素
 */
export function drawFeature(drawType) {
  //重新绘制前清除绘制
  clearFeature();
  var drawSource = new SVector({wrapX: false});
  var drawVector = new Vector({
    source: drawSource,
    type: "draw"
  });
  store.getters.app.map.addLayer(drawVector);
  var GIS_DRAW = new Draw({
    source: drawSource,
    type: drawType
  });

  //绘制显示的要素样式
  var featureStyle = new Style({
    fill: new Fill({
      color: [255, 255, 255, 0.8]
    }),
    stroke: new Stroke({
      color: [30, 144, 255],
      width: 2,
      lineDash: [1, 2, 3, 4]
    }),
    image: new Circle({
      radius: 7,
      fill: new Fill({
        color: [127, 255, 0]
      }),
      stroke: new Stroke({
        color: 'black',
        width: 2
      })
    })
  });
  store.getters.app.areaObj = {brushColor: "", fillColor: "", brushThickness: 10}//区域json
  store.getters.app.areaPoints = [];//存放区域轨迹数组
  GIS_DRAW.on('drawend', function (evt) {
    var fea = evt.feature;
    if (featureStyle != null) {// 如果传入不为空，则使用自定义样式
      fea.setStyle([featureStyle]);
    }
    var areaCoor = fea.getGeometry().getCoordinates()[0];//区域坐标
    for (let i = 0; i < areaCoor.length; i++) {
      var lonlat = webMctToWGS84(areaCoor[i][0], areaCoor[i][1]);
      var areaPoint = {};//单个点json
      areaPoint.x = lonlat[0];
      areaPoint.y = lonlat[1];
      store.getters.app.areaPoints.push(areaPoint);
    }
    store.getters.app.areaObj.pointList = store.getters.app.areaPoints;
    store.getters.app.areaObjStr = JSON.stringify(store.getters.app.areaObj);
    store.commit('saveArea', store.getters.app.areaObjStr)
    store.getters.app.map.removeInteraction(GIS_DRAW);
  }, this);
  store.getters.app.map.addInteraction(GIS_DRAW);
}

/**
 * 清除绘制要素
 */
function clearFeature() {
  var coorLayers = store.getters.app.map.getLayers().getArray();
  for (var i = 0; i < coorLayers.length; i++) {
    var layerType = coorLayers[i].getProperties()['type'];
    if (layerType == "draw") {
      store.getters.app.map.removeLayer(coorLayers[i]);
    }
  }
}
