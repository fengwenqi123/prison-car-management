import store from '@/store'
import {wgs84ToWebMct} from './HTool'
import {Feature} from 'ol'
import {Point} from 'ol/geom'
import {Style, Icon} from 'ol/style'
import {setTextStyle} from './HTool'

const ship = require('@/assets/gis/img/car.png')

/***********************************************************两点轨迹测试************************************************/


/**
 * 只传入两点轨迹测试
 * @param {Obj} points [{'start':[lon,lat],'end':[lon,lat,angle]},{'start':[lon,lat],'end':[lon,lat,angle]},{'start':[lon,lat],'end':[lon,lat,angle]}...]
 */
export function singleTrackMoveTest(points) {
  store.getters.app.movingLayer.clear()
  for (var i = 0; i < points.length; i++) {
    var startPoint = points[i].start
    var endPoint = points[i].end
    var angle = points[i].end[2]
    //转换坐标
    var sp = wgs84ToWebMct(startPoint[0], startPoint[1]);
    var ep = wgs84ToWebMct(endPoint[0], endPoint[1])
    //绘制移动点
    var moveFeature = new Feature({
      geometry: new Point(sp)
    });
    var size = '18'
    var label = setTextStyle(points[i].carInfo.license, size, points[i].carInfo.alert === 0 ? '#000' : 'red', -20, -20, 1)
    moveFeature.setStyle(
      new Style({
        text: label,
        image: new Icon({
          src: ship,
          rotateWithView: false,
          rotation: angle,
          scale: 0.8
        })
      })
    );
    moveFeature.setProperties(points[i].carInfo, false);
    // console.log( store.getters.app.movingLayer.addPolygonSymbol([moveFeature]))
    store.getters.app.movingLayer.addPolygonSymbol([moveFeature]);
    singleFeatureMoving(sp, ep, moveFeature);
  }
}

/**
 * 移动开始 一次传入起始两个点
 * @param {Array} startPoint
 * @param {Array} endPoint
 */
function singleFeatureMoving(startPoint, endPoint, feature) {
  //移动要素
  var x1 = startPoint[0];
  var y1 = startPoint[1];
  var x2 = endPoint[0];
  var y2 = endPoint[1];
  //var movingFeature = app.movingLayer.getSource().getFeatures()[0];
  var startPosition = 1;//起始点位置
  var count = 100;//点数量
  var moving = setInterval(function () {
    var midxPostion = (x2 - x1) * Math.abs(startPosition / count) + x1;
    var midyPostion = (y2 - y1) * Math.abs(startPosition / count) + y1;
    var nextGeometry = new Point([midxPostion, midyPostion]);
    feature.setGeometry(nextGeometry);
    startPosition++;
    if (startPosition > count) {
      clearInterval(moving)
    }
  }, 50)
}
