import store from '@/store'
import {showInfoLayer} from './HTool'
/**
 * GIS业务js
 * created by zj on 2018.8.30
 */

/*******************************************地图要素展示方法开始****************************************/
/**
 * 在地图页面显示当前指定船舶图层中的船舶要素
 * @param {Array[]} shipFeatures 获取到的船舶要素数组
 */
function showShipNameIntable(shipFeatures) {
  var objList = []
  if (shipFeatures.length != 0) {
    var shipType = shipFeatures[0].getProperties()['type']// 船舶图层类型（定位用）'aisship','gpsship','mixedship'
    for (var i = 0; i < shipFeatures.length; i++) {
      var obj = {}
      obj.shipName = shipFeatures[i].getProperties()['name']// 单个紧急物资要素名称
      obj.shipLon = shipFeatures[i].getProperties()['lon']
      obj.shipLat = shipFeatures[i].getProperties()['lat']
      obj.shipSpeed = shipFeatures[i].getProperties()['speed']
      obj.shipDirection = shipFeatures[i].getProperties()['direction']
      obj.shipheadDirection = shipFeatures[i].getProperties()['headDirection']
      obj.shipMessage = shipFeatures[i].getProperties()['message']
      obj.receiveTime = shipFeatures[i].getProperties()['receiveTime']
      objList.push(obj)
    }
  }
  parent.postMessage({
    act: 'shipNames',
    msg: {
      name: JSON.stringify(objList),
      type: shipType
    }
  }, '*')
}

/**
 *在地图页面显示当前范围内的海事站所
 * @param {Array[]} hszsFeatures
 */
function showHszsNameIntable(hszsFeatures) {
  if (hszsFeatures.length != 0) {
    var hszsType = hszsFeatures[0].getProperties()['type'];// 海事站所图层 'hszs'
    var hszsNames = [];
    for (i = 0; i < hszsFeatures.length; i++) {
      var hszsName = hszsFeatures[i].getProperties()['name'];//单个海市站所要素船名
      hszsNames.push(hszsName)
    }
    parent.postMessage({
      act: 'hszsNames',
      msg: {
        name: JSON.stringify(hszsNames),
        type: hszsType
      }
    }, '*')
  }
}

/**
 *在地图页面显示当前范围内的监控视频
 * @param {Array[]} shipinFeatures
 */
function showShipinNameIntable(shipinFeatures) {
  if (shipinFeatures.length != 0) {
    var shipinType = shipinFeatures[0].getProperties()['type'];// 监控视频图层 'shipin'
    var shipinNames = [];
    for (i = 0; i < shipinFeatures.length; i++) {
      var shipinName = shipinFeatures[i].getProperties()['name'];//单个监控视频要素名称
      shipinNames.push(shipinName)
    }
    parent.postMessage({
      act: 'jksp',
      msg: {
        name: JSON.stringify(shipinNames),
        type: shipinType
      }
    }, '*')
    // console.log(shipinType);
    // console.log(shipinNames);
  }
}

/**
 *在地图页面显示当前范围内的救援物资
 * @param {Array[]} supportFeatures
 */
function showSupportNameIntable(supportFeatures) {
  if (supportFeatures.length != 0) {
    var supportType = supportFeatures[0].getProperties()['type'];// 紧急物资图层 'support'
    var supportNames = [];
    for (i = 0; i < supportFeatures.length; i++) {
      var supportName = supportFeatures[i].getProperties()['name'];//单个紧急物资要素名称
      supportNames.push(supportName)
    }
    parent.postMessage({
      act: 'support',
      msg: {
        name: JSON.stringify(supportNames),
        type: supportType
      }
    }, '*')
    // console.log(supportType);
    // console.log(supportNames);
  }
}

/**
 * 小比例尺层级展示船舶示意点图层
 */
function showShipPointLayer() {
  var mixedPointLayer = createHeatMap('initshipMIXED', GIS_MIXEDHEATGROUP, 1, 4, ['#1ec84e', '#18bf47'], 10, true);
  app.map.addLayer(mixedPointLayer);
  var aisPointLayer = createHeatMap('initshipAIS', GIS_AISHEATGROUP, 1, 4, ['#1ec84e', '#18bf47'], 10, false);
  app.map.addLayer(aisPointLayer);
  var gpsPointLayer = createHeatMap('initshipGPS', GIS_GPSHEATGROUP, 1, 4, ['#1ec84e', '#18bf47'], 10, false);
  app.map.addLayer(gpsPointLayer);
}

/*******************************************地图要素展示方法结束****************************************/

/*******************************************业务公用GIS方法开始****************************************/


/**
 * 公用弹出框显示方法
 * @param {ol.Map} map
 */
export function showPopup(app) {
  var map = app.map
  //try {
  map.on('click', function (e) {
    var pixel = map.getEventPixel(e.originalEvent);
    map.forEachFeatureAtPixel(pixel, function (feature) {
      var property = feature.getProperties();
      var propertyType = property['type'];
      var obj = {};
      obj.id = property['id']
      switch (propertyType) {
        case 'cover':
          store.commit('setCoverId', obj.id)
          break;
      }
    });
  });
}

/*******************************************业务公用GIS方法结束****************************************/

/********************************************页面点击事件开始******************************************/
/**
 * 抵达时间
 * @description 海巡救援
 */
function calArriveTime() {
  var shipSpeed = parseInt($("#hxSpeed").val().split("km/h")[0]);

  var source = new ol.source.Vector();
  var vector = new ol.layer.Vector({
    type: "draw",
    source: source,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [255, 69, 0],
        width: 3
      }),
    })
  });
  app.map.addLayer(vector);
  var dismeasure;
  //开始绘制
  dismeasure = new ol.interaction.Draw({
    source: source,
    type: 'LineString',
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: [255, 255, 255, 0.5]
        }),
        stroke: new ol.style.Stroke({
          color: [255, 69, 0],
          width: 1.5
        })
      }),
      stroke: new ol.style.Stroke({
        color: [255, 69, 0],
        width: 2,
        lineDash: [10, 10]
      })
    })
  });
  dismeasure.on('drawstart',
    function (evt) {
      var fea = evt.feature;               //绘制的要素
      fea.getGeometry().on('change', function (evt) {         //鼠标在移动的时候执行
        var geom = evt.target;
        if (geom instanceof ol.geom.LineString) {
          var distance = formatLength(geom);
          var time = finaltime(distance, shipSpeed);
        }
        $("#arriveTime").attr("value", time);
      });
    }, this);
  dismeasure.on('drawend', function (evt) {
    app.map.removeInteraction(dismeasure);
  }, this);
  app.map.addInteraction(dismeasure);
}

/**
 *显示报警
 * @param {Number} lon
 * @param {Number} lat
 * @param {String} alarmID
 */
function showAlarmPoint(lon, lat, alarmID) {
  $("#css_animation").css("display", "block");
  pointTo(lon, lat, 14);
  var flashFeatures = app.flashLayer.getFeatureArray();
  if (flashFeatures.length != 0) {
    for (i = 0; i < flashFeatures.length; i++) {
      var flashFeatureID = flashFeatures[i].getProperties()['id'];
      if (flashFeatureID == alarmID) {
        app.flashLayer.removeSingleFeature(flashFeatures[i]);
        return;
      }
    }
  }
  addFlashMarker(lon, lat, alarmID);
}

/**
 *解除报警
 * @param {String} alarmID
 */
function removeAlarmPoint(alarmID) {
  $("#css_animation").css("display", "none");
  var flashFeatures = app.flashLayer.getFeatureArray();
  if (flashFeatures.length != 0) {
    for (i = 0; i < flashFeatures.length; i++) {
      var flashFeatureID = flashFeatures[i].getProperties()['id'];
      if (flashFeatureID == alarmID) {
        app.flashLayer.removeSingleFeature(flashFeatures[i]);
        return;
      }
    }
  }
}

/**
 * 定位信号设置
 * objS 获得下拉框元素
 * sign 得到下拉框选中的对象，默认是AIS，即只显示AIS信号船只。
 */
function signChange(sign) {
  //var objS = document.getElementById("sign");
  //var sign = objS.options[objS.selectedIndex].value;
  if (sign == "AIS") {
    showInfoLayer('aisship', true);
    showInfoLayer('gpsship', false);
    showInfoLayer('mixedship', false);
    showInfoLayer('initshipAIS', true);
    showInfoLayer('initshipGPS', false);
    showInfoLayer('initshipMIXED', false);
    getFeatureInExtent(app.currentExtent, app.aisShipLayer.layer, showShipNameIntable);
  } else if (sign == "GPS") {
    showInfoLayer('aisship', false);
    showInfoLayer('gpsship', true);
    showInfoLayer('mixedship', false);
    showInfoLayer('initshipAIS', false);
    showInfoLayer('initshipGPS', true);
    showInfoLayer('initshipMIXED', false);
    getFeatureInExtent(app.currentExtent, app.gpsShipLayer.layer, showShipNameIntable);
  } else {
    showInfoLayer('aisship', false);
    showInfoLayer('gpsship', false);
    showInfoLayer('mixedship', true);
    showInfoLayer('initshipAIS', false);
    showInfoLayer('initshipGPS', false);
    showInfoLayer('initshipMIXED', true);
    getFeatureInExtent(app.currentExtent, app.mixedShipLayer.layer, showShipNameIntable);
  }
}
/**
 * 显示卫星影像图
 */
export function openYXT(flag) {
  showInfoLayer('YXT', flag);
  showInfoLayer('DZDT', !flag);
}

/**
 * 显示和隐藏电子航道图
 */
function switchDZHDT() {
  var switchflag = $("#DZHDT").attr("name");
  if (switchflag == "show") {
    showInfoLayer('DZHDT', false);
    $("#DZHDT").attr("name", "hide");
  } else if (switchflag == "hide") {
    showInfoLayer('DZHDT', true);
    $("#DZHDT").attr("name", "show");
  }
}

/**
 * 显示和隐藏水深点地图
 */
function switchSSDDT() {
  var switchflag = $("#SSDDT").attr("name");
  if (switchflag == "show") {
    showInfoLayer('SSDDT', false);
    $("#SSDDT").attr("name", "hide");
  } else if (switchflag == "hide") {
    showInfoLayer('SSDDT', true);
    $("#SSDDT").attr("name", "show");
  }
}

/**
 * 要素图层控制
 */
//全选 全不选
$("#checkAll").click(
  function () {
    $("[name=checks]").prop("checked", $(this).prop("checked"));
    $("[name=checks]").change();
  }
)

//单个要素显示
$("[name=checks]").change(function () {
  var val = $(this).val();
  var isShow = $(this).prop("checked");
  showInfoLayer(val, isShow);
})

//快速定位
//杭州  pointTo(120.185,30.276)
//湖州  pointTo(120.097,30.870)

/**
 * 新窗口中弹出子页面
 * @param {String} url 链接
 * @param {String} 窗口样式
 */
function openWindow(url, styleParameter) {
  window.open(url, '_blank', styleParameter);
}

/**
 * 点击视频显示附近船舶信息列表  (船名 经纬度)
 * @param {Number} lon 视频经度
 * @param {Number} lat 视频纬度
 */
function clickVideoButtonToShowShipMessage(lon, lat, xhlc) {
  var roundShipList = [];//返回船舶列表数组
  //获取混合船舶图层中的所有船舶
  var mixedShipArray = app.mixedShipLayer.getFeatureArray();
  $.each(mixedShipArray, function (i, item) {
    var shipAttribute = {};
    var feacoor = item.getGeometry().getCoordinates()[0][0];
    var feaWGS84coor = webMctToWGS84(feacoor[0], feacoor[1]);
    var feaLon = parseFloat(feaWGS84coor[0].toFixed(4));
    var feaLat = parseFloat(feaWGS84coor[1].toFixed(4));

    var feaName = item.getProperties()['name'];

    var disBetweenShipAndTheVideo = getDistance(lon, lat, feaLon, feaLat);
    if (disBetweenShipAndTheVideo < xhlc) {
      shipAttribute.name = feaName;
      shipAttribute.lonitude = feaLon;
      shipAttribute.latitude = feaLat;
      shipAttribute.distance = disBetweenShipAndTheVideo;
      roundShipList.push(shipAttribute);
    }
  });

  function sortDidtance(a, b) {
    return a.distance - b.distance;
  }

  roundShipList.sort(sortDidtance);
  // return 	roundShipList;
  console.log(roundShipList)
  parent.postMessage({
    act: 'rtmp1',
    msg: {
      obj: roundShipList
    }
  }, '*')
}

/********************************************页面点击事件结束******************************************/

/**
 * 返回某辖区内总船舶数量和分类船舶数量
 * @param {String} manageName 辖区名称
 * @description 一键巡查用
 */
function quantityOfTheManagearea(manageName) {
  var manageShipInfo = {};
  var allShips = [];//全部船舶
  var goodsShips = [];//货船
  var passengerShips = [];//客船
  var dangerShips = [];//危险品船
  var otherShips = [];//其他船舶
  var manageareaFeaures = app.manageareaLayer.getFeatureArray();
  var theManageAreaFeature;

  for (var i = 0; i < manageareaFeaures.length; i++) {
    var mName = manageareaFeaures[i].getProperties()['name'];
    console.log(mName);
    if (mName == manageName) {
      theManageAreaFeature = manageareaFeaures[i];
      break;
    }
  }
  console.log(theManageAreaFeature)
  var theExtent = theManageAreaFeature.getGeometry().getExtent();
  var themanageGeo = theManageAreaFeature.getGeometry().getCoordinates(true);
  //辖区turf polygon
  var theTurfPolygon = turf.polygon(themanageGeo);
  //获取辖区extent内(矩形)船舶
  var shipData = app.mixedShipLayer.getData();
  //处理extent内船舶
  for (var i = 0; i < shipData.length; i++) {
    var theShip = shipData[i];
    var theShipGeo = wgs84ToWebMct(theShip.longitude, theShip.latitude);
    var theTurfPoint = turf.point(theShipGeo);
    if (turf.booleanPointInPolygon(theTurfPoint, theTurfPolygon)) {//辖区内的船舶
      allShips.push(theShip);
      var type = theShip.shipType;
      if (type == 2) {
        goodsShips.push(theShip);
      } else if (type == 1) {
        passengerShips.push(theShip);
      } else if (type == 3) {
        dangerShips.push(theShip);
      } else {
        otherShips.push(theShip);
      }
    }
  }
  manageShipInfo.allships = allShips.length;
  manageShipInfo.goodships = goodsShips.length;
  manageShipInfo.passengerships = passengerShips.length;
  manageShipInfo.dangerships = dangerShips.length;
  manageShipInfo.otherships = otherShips.length;
  parent.postMessage({
    act: 'manageShipInfo',
    msg: {
      obj: JSON.stringify(manageShipInfo)
    }
  }, '*')
}
