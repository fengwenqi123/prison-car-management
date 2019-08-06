import {Vector} from 'ol/layer'
import {Vector as SVector} from 'ol/source'
import {Style, Fill, Stroke, Circle} from 'ol/style'
import {Draw} from 'ol/interaction'
import {webMctToWGS84, wgs84ToWebMct} from './HTool'
import HSymbol from './HSymbol'
import store from '@/store'

/**
 * 绘制图形
 * created by zj on 2019.7.30
 * 依赖 HSymbol.js HTool.js
 */
var HDraw = (function () {
  var hMap            //地图对象
  var dLayer          //绘制图层
  var preLayer = new Vector({// 放修改的要素
    source: new SVector()
  });
  var dsource = new SVector({wrapX: false}) //绘制图层矢量数据源
  var GIS_DRAW         //绘制工具
  /**
   * 根据绘制类型获取不同的绘制后的要素样式
   * @param{String} drawType 点:'Point' 'Polygon'
   * @description 1.样式暂写死，不做参数声明 2.目前项目只有绘制点 多边形，之后拓展需添加矩形 圆 线
   */
  var getFeatureDrawedStyle = function (drawType) {
    var featureStyle
    switch (drawType) {
      case 'Point' :
        featureStyle = new Style({
          fill: new Fill({
            color: [255, 255, 255, 0.8]
          }),
          stroke: new Stroke({
            color: 'black',
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
        })
        break;
      case 'Polygon' :
        featureStyle = new Style({
          fill: new Fill({
            color: [255, 255, 255, 0.5]
          }),
          stroke: new Stroke({
            color: [30, 144, 255],
            width: 2,
            lineDash: [1, 2, 3, 4]
          })
        })
        break;
      default:
        break
    }
    return featureStyle
  }
  return {
    /**
     * 初始化绘制图层
     * @param {ol.Map} map  app.map
     */
    init: function (map) {
      hMap = map
      //绘制图层统一给定图层type为'draw'
      dLayer = new Vector({
        source: dsource,
        type: 'draw'
      })
      hMap.addLayer(preLayer)
      hMap.addLayer(dLayer)
    },
    /**
     * 设置绘制工具
     * @param{String} drawType 点:'Point' 'Polygon'
     */
    setDrawTool: function (drawType) {
      GIS_DRAW = new Draw({
        source: dsource,
        type: drawType
      })
      var featureStyle = getFeatureDrawedStyle(drawType)
      GIS_DRAW.on('drawend', function (evt) {
        var fea = evt.feature
        if (drawType == 'Point') {
          fea.setStyle(featureStyle)
          var coor = fea.getGeometry().getCoordinates()
          var newPointcoor = webMctToWGS84(coor[0], coor[1])
          var coordinate = [parseFloat(newPointcoor[0].toFixed(4)), parseFloat(newPointcoor[1].toFixed(4))]
          console.log(coordinate)
          store.commit('savePoint',coordinate)
        } else if (drawType == 'Polygon') {
          var areaObj = {brushColor: '', fillColor: '', brushThickness: 10}//区域json
          var areaPoints = []//存放区域轨迹数组
          if (featureStyle != null) {// 如果传入不为空，则使用自定义样式
            fea.setStyle(featureStyle)
          }
          var areaCoor = fea.getGeometry().getCoordinates()[0]//区域坐标
          for (let i = 0; i < areaCoor.length; i++) {
            var lonlat = webMctToWGS84(areaCoor[i][0], areaCoor[i][1])
            var areaPoint = {}//单个点json
            areaPoint.x = lonlat[0]
            areaPoint.y = lonlat[1]
            areaPoints.push(areaPoint)
          }
          areaObj.pointList = areaPoints
          var areaObjStr = JSON.stringify(areaObj)
          store.commit('saveArea',areaObjStr)
        }
        hMap.removeInteraction(GIS_DRAW)
      }, this)
      hMap.addInteraction(GIS_DRAW)
    },
    /**
     * 清除绘制要素
     */
    clear: function () {
      dsource.clear()
    },
    /**
     * 添加原要素
     * @param drawType 点:'Point' 'Polygon'
     * @param aftercoor  修改要素的坐标（固定格式）
     */
    addPreFeature: function (drawType, aftercoor) {
      //添加前清空要素
      preLayer.getSource().clear()
      //分类型添加
      if (drawType == 'Point') {
        // aftercoor = '119.49494910589597,29.086299604151975'
        var afterlon = parseFloat(aftercoor.split(',')[0]);
        var afterlat = parseFloat(aftercoor.split(',')[1]);
        var lonlat = wgs84ToWebMct(afterlon, afterlat);
        var prePoint = HSymbol.getMarkerSymbol({'type': "point"}, lonlat, [255, 106, 106]);
        preLayer.getSource().addFeature(prePoint);
      } else if (drawType == 'Polygon') {
        //aftercoor = '{"brushColor":"","fillColor":"","brushThickness":10,"pointList":[{"x":119.49494910589597,"y":29.086299604151975},{"x":119.49227118998712,"y":29.08164909808569},{"x":119.49762702442418,"y":29.079608811115193},{"x":119.50442481337994,"y":29.08260922089943},{"x":119.49494910589597,"y":29.086299604151975}]}'
        var areaObj = JSON.parse(decodeURI(aftercoor));
        var areaPoints = areaObj.pointList;
        var points = [];
        for (let i = 0; i < areaPoints.length; i++) {
          var lonlat = wgs84ToWebMct(areaPoints[i].x, areaPoints[i].y);
          points.push(lonlat);
        }
        var mareaSymbol = HSymbol.getPolygonSymbol({'type': 'prearea'}, [points], [240, 248, 255, 0.8], [112, 128, 144], 2, false, '原区域', 16);
        preLayer.getSource().addFeature(mareaSymbol);
      }
      //定位
      var targetFeature = preLayer.getSource().getFeatures()[0];
      if (targetFeature) {
        var mapView = hMap.getView();
        mapView.fit(targetFeature.getGeometry(), hMap.getSize(), {duration: 2000});
      }
    },
    /**
     * 清空修改时添加的原有要素
     */
    clearPreFeature: function(){
      preLayer.getSource().clear()
    }
  }
})()
export default HDraw

