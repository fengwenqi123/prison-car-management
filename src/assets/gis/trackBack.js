import store from '@/store'
import {wgs84ToWebMct} from './HTool'
import {Feature} from 'ol'
import {Point} from 'ol/geom'
import {Style, Icon} from 'ol/style'

/***************************************************单船历史轨迹*******************************************/
var app = store.getters.app
app.speed = 50
const ship = require('@/assets/gis/img/car.png')

/**
 * 单轨迹测试
 * 由两点定义船行方向
 */
export function trackPlayBack(data) {
  app.movePoints = [];//整理后的轨迹点
  var groupAmount = data.length - 1;
  var minTime = strToDateforSecond(data[0].moveTimeString);//开始时间
  app.playbackTime = minTime
  var maxTime = strToDateforSecond(data[groupAmount].moveTimeString);//结束时间
  var timeSpan = maxTime - minTime;//总的时间跨度
  var count = timeSpan / 1000;//总的时间点
  app.timeInterval = timeSpan / count
  for (var i = 0; i < groupAmount; i++) {
    var moveGroup = {}
    var firstCoor = wgs84ToWebMct(data[i].longitude, data[i].latitude);
    var secondCoor = wgs84ToWebMct(data[i + 1].longitude, data[i + 1].latitude);
    var firstTimeStamp = strToDateforSecond(data[i].moveTimeString)
    var secondTimeStamp = strToDateforSecond(data[i + 1].moveTimeString)
    var timeRate = (secondTimeStamp - firstTimeStamp) / timeSpan
    var groupCount = parseInt(count * timeRate)
    //每组的第一个点坐标
    moveGroup.firstCoor = firstCoor;
    //每组的第二个点坐标
    moveGroup.secondCoor = secondCoor;
    //每组的第一个时刻点
    moveGroup.firstTimeStamp = firstTimeStamp
    //每组的第二个时刻点
    moveGroup.secondTimeStamp = secondTimeStamp
    //每组的时刻点
    moveGroup.groupCount = groupCount
    //每组的移动角度
    moveGroup.rotation = calAngle(firstCoor[0], firstCoor[1], secondCoor[0], secondCoor[1])
    app.movePoints.push(moveGroup)
  }
  var moveFeature = new Feature({
    geometry: new Point(app.movePoints[0].firstCoor)
  });
  moveFeature.setStyle(
    new Style({
      image: new Icon({
        src: ship,
        rotateWithView: false,
        rotation: app.movePoints[0].rotation,
        scale: 0.8
      })
    })
  );
  app.movingLayer.addMarkerSymbol([moveFeature]);
  movingStart(0, 1000, 1, app.movePoints);
}

/**
 * 移动开始
 */
function movingStart(start, speed, startPosition, points) {
  app.speed = speed;
  if (points.length == 0) {
    return
  }
  if (start == points.length) {
    return
  }
  //移动要素
  var x1 = points[start].firstCoor[0];
  var y1 = points[start].firstCoor[1];
  var x2 = points[start].secondCoor[0];
  var y2 = points[start].secondCoor[1];
  var count = points[start].groupCount;//点数量
  var nextAngle = points[start].rotation;
  var moveFeature = app.movingLayer.getFeatureArray()[0];
  moveFeature.getStyle().getImage().setRotation(nextAngle);
  app.moving = setInterval(function () {
    app.playbackTime = app.playbackTime + app.timeInterval;
    window.postMessage({
      act: 'areaTrackTiming',
      msg: {
        time: app.playbackTime
      }
    }, '*')
    var midxPostion = (x2 - x1) * Math.abs(startPosition / count) + x1;
    var midyPostion = (y2 - y1) * Math.abs(startPosition / count) + y1;
    var nextGeometry = new Point([midxPostion, midyPostion]);
    moveFeature.setGeometry(nextGeometry);
    startPosition++;
    if (startPosition > count) {
      clearInterval(app.moving)
      start = start + 1;
      movingStart(start, speed, 1, points)
    }
  }, app.speed);
}

//暂停
export function movingPause() {
  clearInterval(app.moving)
}

//停止
export function movingStop() {
  clearInterval(app.moving)
  var moveFeature = app.movingLayer.getFeatureArray()[0];
  var coordinate = app.movePoints[0].firstCoor
  var geometry = new Point(coordinate)
  moveFeature.setGeometry(geometry)
}

//继续
export function movingContinue() {
  // clearInterval(app.moving)
  var start;
  var startPosition;
  for (var i = 0; i < app.movePoints.length; i++) {
    var targetGroup = app.movePoints[i];
    if (app.playbackTime >= targetGroup.firstTimeStamp && app.playbackTime < targetGroup.secondTimeStamp) {
      start = i;
      startPosition = parseInt((app.playbackTime - targetGroup.firstTimeStamp) / (targetGroup.secondTimeStamp - targetGroup.firstTimeStamp) * targetGroup.groupCount);
      break;
    }
  }
  if (start == undefined) {
    return
  }
  movingStart(start, app.speed, startPosition, app.movePoints)
}

//加速
export function movingAccelerate(speed) {
  clearInterval(app.moving)
  var start;
  var startPosition;
  for (var i = 0; i < app.movePoints.length; i++) {
    var targetGroup = app.movePoints[i];
    if (app.playbackTime >= targetGroup.firstTimeStamp && app.playbackTime < targetGroup.secondTimeStamp) {
      start = i;
      startPosition = parseInt((app.playbackTime - targetGroup.firstTimeStamp) / (targetGroup.secondTimeStamp - targetGroup.firstTimeStamp) * targetGroup.groupCount);
      break;
    }
  }
  if (start == undefined) {
    return
  }
  movingStart(start, speed, startPosition, app.movePoints)
}

//减速
function movingDecrease() {
  clearInterval(app.moving)
  var start;
  var startPosition;
  for (var i = 0; i < app.movePoints.length; i++) {
    var targetGroup = app.movePoints[i];
    if (app.playbackTime > targetGroup.firstTimeStamp && app.playbackTime < targetGroup.secondTimeStamp) {
      start = i;
      startPosition = parseInt((app.playbackTime - targetGroup.firstTimeStamp) / (targetGroup.secondTimeStamp - targetGroup.firstTimeStamp) * targetGroup.groupCount);
      break;
    }
  }
  if (start == undefined) {
    return
  }
  movingStart(start, 100, startPosition, app.movePoints)
}

//时间点跳跃
export function movingJump(timeStamp, speed) {
  app.playbackTime = timeStamp
  app.speed = speed
  clearInterval(app.moving)
  var start;
  var startPosition;
  for (var i = 0; i < app.movePoints.length; i++) {
    var targetGroup = app.movePoints[i];
    console.log(targetGroup.firstTimeStamp)
    if (app.playbackTime >= targetGroup.firstTimeStamp && app.playbackTime < targetGroup.secondTimeStamp) {
      start = i;
      startPosition = parseInt((app.playbackTime - targetGroup.firstTimeStamp) / (targetGroup.secondTimeStamp - targetGroup.firstTimeStamp) * targetGroup.groupCount);
      break;
    }
  }
  if (start == undefined) {
    return
  }
  movingStart(start, app.speed, startPosition, app.movePoints)
}

/**
 * 添加轨迹点和轨迹线
 */
// function addTrackPointAndLine() {
//   var routeLayer = new ol.layer.Vector({
//     source: new ol.source.Vector(),
//     style: new ol.style.Style({
//       stroke: new ol.style.Stroke({
//         width: 2,
//         color: '#fdeb87',
//         lineDash: [6, 8]
//       })
//     })
//   });
//   var pointsLayer = new ol.layer.Vector({
//     source: new ol.source.Vector(),
//     style: new ol.style.Style({
//       image: new ol.style.Circle({
//         radius: 5,
//         fill: new ol.style.Fill({
//           color: '#fcfaed'
//         }),
//         stroke: new ol.style.Stroke({
//           color: '#f3b658',
//           width: 2
//         })
//       })
//     })
//   });
//   app.map.addLayer(routeLayer);
//   app.map.addLayer(pointsLayer);
//   //绘制轨迹点
//   var routePoints = [];//webmct地图需要先转化坐标
//   var pointFeatures = [];
//   for (var i = 0; i < singledata.length; i++) {
//     var transPoint = wgs84ToWebMct(singledata[i][0], singledata[i][1]);
//     var markerSymbol = new ol.Feature({
//       geometry: new ol.geom.Point(transPoint)
//     });
//     pointFeatures.push(markerSymbol);
//     routePoints.push(transPoint);
//   }
//   pointsLayer.getSource().addFeatures(pointFeatures);
//   //绘制轨迹线
//   var routeFeature = new ol.Feature({
//     geometry: new ol.geom.LineString(routePoints)
//   });
//   routeLayer.getSource().addFeature(routeFeature);
// }

/**
 * 计算icon偏移角度
 * @param {Number} startX
 * @param {Number} startY
 * @param {Number} endX
 * @param {Number} endY
 */
function calAngle(startX, startY, endX, endY) {
  var angle = -Math.atan2(startY - endY, startX - endX) - 0.5 * Math.PI;
  return angle;
}

function strToDateforSecond(date) {
  date = date.substring(0, 19)
  date = date.replace(/-/g, '/')
  return (new Date(date).getTime())
}

/***************************************************单船历史轨迹*******************************************/
