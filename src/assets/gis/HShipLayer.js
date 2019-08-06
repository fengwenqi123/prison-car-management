/**
 * 船舶图层操作工具集
 * created by zj on 2018.9.6
 */
import {GeoJSON} from 'ol/format'
import {Image, Vector} from 'ol/layer'
import {ImageWMS, Vector as SVector} from 'ol/source'
import {Polygon} from 'ol/geom'
import {Style, Fill, Stroke} from 'ol/style'
import {GIS_GOODSSHIP, GIS_PASSENGERSHIP, GIS_DANGERSHIP, GIS_HXTSHIP} from './HConfig'
import HUtil from './HUtil'

var HShipLayer = (function () {
  var hMap            //地图对象
  var mLayer          //WMS图层对象
  var fLayer          //WFS图层对象
  var fUrl            //wfs服务查询用
  var filterParams = { //过滤对象 CQL语句
    'CQL_FILTER': null
  }
  var queryParams = {}//查询对象 包括时间 信号类型 船舶类型
  var queryCql = ''     //常规查询条件语句
  var geoformat = new GeoJSON()

  /**
   * 时间过滤条件
   * @param {Number} offlineTime 离线时间 单位:分钟
   * @description 在当前时间30min前默认在线
   */
  var setTimeFilter = function (offlineTime) {
    var timeStamp = HUtil.getCurrentTimeStamp()//当前时间戳
    var offtimeStamp = timeStamp - offlineTime * 60000
    var now = new Date(offtimeStamp)
    var yy = now.getFullYear()
    var mm = now.getMonth() + 1
    var dd = now.getDate()
    var hh = now.getHours()
    var ii = now.getMinutes()
    var ss = now.getSeconds()
    var offtime = yy + '-'
    if (mm < 10) {
      offtime += '0' + mm + '-'
    } else {
      offtime += mm + '-'
    }

    if (dd < 10) {
      offtime += '0' + dd + 'T'
    } else {
      offtime += dd + 'T'
    }

    if (hh < 10) {
      offtime += '0' + hh + ':'
    } else {
      offtime += hh + ':'
    }

    if (ii < 10) {
      offtime += '0' + ii + ':'
    } else {
      offtime += ii + ':'
    }

    if (ss < 10) {
      offtime += '0' + ss
    } else {
      offtime += ss
    }


    var timeFilter = 'receive_time AFTER ' + offtime
    return timeFilter
  }
  /**
   * 信号类型过滤条件
   * @param {Number} datatype 0:混合 1:GPS 2:AIS
   * @description 0：默认混合
   */
  var setDataTypeFilter = function (datatype) {
    var dataTypeFilter = 'datatype = ' + datatype
    return dataTypeFilter
  }
  /**
   * 船舶种类过滤条件
   * @param {String} shiptype 0:未知 1:客船 2:货船 3:危险品船 99:其他
   */
  var setShipTypeFilter = function (shiptype) {
    var shipTypeFilter
    if (shiptype != '') {
      shipTypeFilter = 'shiptype in (' + shiptype + ')'
    } else {
      shipTypeFilter = 'shiptype in (1,2,3,99)'
    }
    return shipTypeFilter
  }
  return {
    /**
     * 初始化船舶图层
     * @param {ol.Map} map     app.map
     * @param {String} wmsurl  wms地址
     * @param {String} wfsurl  wfs地址
     */
    init: function (map, wmsurl, wfsurl) {
      hMap = map
      //初始化wms船舶
      mLayer = new Image({
        type: 'shippoint',
        source: new ImageWMS({
          url: wmsurl,
          params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.0',
            'STYLES': '',
            'LAYERS': 'geobase:zjghship'
          }
        })
      })

      this.setQueryParams(30, 0, [1, 2, 3, 99])
      //初始化wfs船舶
      //TODO ol.loadingstrategy.bbox 加载策略不适合动态点？  静态服务测试成功 暂保留全部加载
      fUrl = wfsurl
      fLayer = new Vector({
        type: 'shipsymbol',
        source: new SVector({}),
        style: function (feature, resolution) {
          if (resolution < 4) {
            var shipproperties = feature.getProperties()
            var speed = shipproperties.speed * 1.852//1节 = 1海里/时 = 1.852 千米/时
            var direct = shipproperties.direction//方向
            var shiptype = shipproperties.shiptype//船舶种类
            var shiptimestamp = HUtil.UTCToDateforSecond(shipproperties.receive_time)//船舶时间转时间戳
            var onlinetimestamp = HUtil.getCurrentTimeStamp() - 30 * 60 * 1000//规定的在线时间:30min前到此刻
            //上顶点
            var P = feature.getGeometry().getFirstCoordinate(true)
            //生成船舶符号点坐标
            var newdirect = (450 - direct) % 360
            var newspeed = Math.min(12, speed)//航速最高选12km/h
            var delta = 40
            //左下顶点
            var leftdirect = (165 + newdirect) % 360
            var leftx = P[0] + Math.cos(leftdirect * Math.PI / 180) * delta

            var lefty = P[1] + Math.sin(leftdirect * Math.PI / 180) * delta
            var PL = [leftx, lefty]
            //右下顶点
            var rightdirect = (195 + newdirect) % 360
            var rightx = P[0] + Math.cos(rightdirect * Math.PI / 180) * delta
            var righty = P[1] + Math.sin(rightdirect * Math.PI / 180) * delta
            var PR = [rightx, righty]
            //最上方的线顶点
            var topx = P[0] + Math.cos(newdirect * Math.PI / 180) * newspeed * 3
            var topy = P[1] + Math.sin(newdirect * Math.PI / 180) * newspeed * 3
            var PT = [topx, topy]
            var shipcoor = [[P, PL, PR, P, PT]]
            var shipgeometry = new Polygon(shipcoor)
            var style
            if (shipproperties.shipname.substr(0, 3) == GIS_HXTSHIP) {// 海巡艇蓝色黑框
              style = new Style({
                geometry: shipgeometry,
                fill: new Fill({
                  color: [1, 87, 155]
                }),
                stroke: new Stroke({
                  color: [0, 0, 0],
                  width: 1.5
                })
              })
            } else if (shiptimestamp < onlinetimestamp) {// 离线船舶灰色黑框
              style = new Style({
                geometry: shipgeometry,
                fill: new Fill({
                  color: [200, 200, 200, 0.8]
                }),
                stroke: new Stroke({
                  color: [0, 0, 0],
                  width: 1.5
                })
              })
            } else if (shiptype == GIS_PASSENGERSHIP) {// 客船黄色红框
              style = new Style({
                geometry: shipgeometry,
                fill: new Fill({
                  color: [255, 255, 0]
                }),
                stroke: new Stroke({
                  color: [255, 0, 0],
                  width: 1.5
                })
              })
            } else if (shiptype == GIS_GOODSSHIP) {// 货船绿色黑框
              style = new Style({
                geometry: shipgeometry,
                fill: new Fill({
                  color: [0, 200, 0]
                }),
                stroke: new Stroke({
                  color: [0, 0, 0],
                  width: 1.5
                })
              })
            } else if (shiptype == GIS_DANGERSHIP) {// 危险品船红色黄框
              style = new Style({
                geometry: shipgeometry,
                fill: new Fill({
                  color: [255, 0, 0]
                }),
                stroke: new Stroke({
                  color: [255, 255, 0],
                  width: 1.5
                })
              })
            } else {
              style = new Style({
                geometry: shipgeometry,
                fill: new Fill({
                  color: [255, 255, 255]
                }),
                stroke: new Stroke({
                  color: [0, 0, 0],
                  width: 1.5
                })
              })
            }
          }
          return style
        }
      })
      map.addLayer(fLayer)
      map.addLayer(mLayer)
    },

    /**
     * 设置查询对象
     * @param {Number} offlineTime 离线时间
     * @param {Number} datatype    信号类型
     * @param {Array} shiptype    船舶种类
     */
    setQueryParams: function (offlineTime, datatype, shiptype) {
      queryParams.offlineTime = offlineTime
      queryParams.dataType = datatype
      queryParams.shipType = shiptype.join(',')
    },

    /**
     * 查询船舶,控制wms船舶图层显示
     */
    queryWMSShips: function () {
      //设置常规条件
      queryCql = ''
      // if (app.nameorno && app.nameorno != '') {//船名 九位码或设备识别号存在则查询(船名模糊查询 九位码或设备识别号精确查询)
      //   var queryfilter = '(shipname like \'%' + app.nameorno + '%\' or no = \'' + app.nameorno + '\') and datatype = 0'
      //   queryCql = queryCql + queryfilter
      // } else {
      var timeFilter = setTimeFilter(queryParams.offlineTime)
      var dataTypeFilter = setDataTypeFilter(queryParams.dataType)
      var shipTypeFilter = setShipTypeFilter(queryParams.shipType)
      queryCql = queryCql + timeFilter + ' and ' + dataTypeFilter + ' and ' + shipTypeFilter
      // }
      //console.log(queryCql);
      //根据过滤条件控制wms船舶图层显示
      filterParams.CQL_FILTER = queryCql
      mLayer.getSource().updateParams(filterParams)
    },
    /**
     * 查询船舶,控制wfs船舶图层显示
     * @param {Boolean} flag 是否异步
     */
    queryWFSShips: function (flag) {
      var queryurl = fUrl + '&cql_filter=' + encodeURI(queryCql)
      $.ajax({
        url: queryurl,
        type: 'get',
        async: flag,
        success: function (data) {
          // console.log(data)
          var features = geoformat.readFeatures(data)
          fLayer.getSource().clear()
          fLayer.getSource().addFeatures(features)
        }
      })
    },
    /**
     * 控制船舶图层显隐
     * @param {Boolean} isshow
     */
    isShowShipLayer: function (isshow) {
      mLayer.setVisible(isshow)
      fLayer.setVisible(isshow)
    },
    /**
     * 定位船舶
     * @param {String} shipname
     */
    locateToTheShip: function (shipname) {
      var shipFeatures = HShipLayer.queryShipFeatures()
      var targetShip
      for (i = 0; i < shipFeatures.length; i++) {
        var name = shipFeatures[i].getProperties()['shipname']
        if (name == shipname) {
          targetShip = shipFeatures[i]
        }
      }
      if (targetShip) {
        var mapView = hMap.getView()
        mapView.fit(targetShip.getGeometry(), hMap.getSize(), {duration: 2000})
      }
    },
    /**
     * 查询指定extent内的船舶数量;全查
     * @param {ol.extent?} extent
     */
    queryShipAmount: function (extent) {
      var shipAmount
      if (extent) {
        shipAmount = fLayer.getSource().getFeaturesInExtent(extent).length
      } else {
        shipAmount = fLayer.getSource().getFeatures().length
      }
      return shipAmount
    },
    /**
     * 查询指定extent内的船舶要素;全查
     * @param {ol.extent?} extent
     */
    queryShipFeatures: function (extent) {
      var shipFeatures
      if (extent) {
        shipFeatures = fLayer.getSource().getFeaturesInExtent(extent)
      } else {
        shipFeatures = fLayer.getSource().getFeatures()
      }
      return shipFeatures
    },
    /**
     * 根据船舶种类获取船舶坐标数组
     * @param {String} type 'all':全部坐标;'passenger':客船;'goods':货船;'danger':危险品船;
     */
    getShipsCoorForShiptype: function (type) {
      var shipPoints = []
      var shipFeatures = fLayer.getSource().getFeatures()
      if (type == 'all') {
        for (var i = 0; i < shipFeatures.length; i++) {
          shipPoints.push(shipFeatures[i].getGeometry().getCoordinates())
        }
      } else if (type == 'passenger') {
        for (var i = 0; i < shipFeatures.length; i++) {
          if (shipFeatures[i].getProperties()['shiptype'] == 1) {
            shipPoints.push(shipFeatures[i].getGeometry().getCoordinates())
          }
        }
      } else if (type == 'goods') {
        for (var i = 0; i < shipFeatures.length; i++) {
          if (shipFeatures[i].getProperties()['shiptype'] == 2) {
            shipPoints.push(shipFeatures[i].getGeometry().getCoordinates())
          }
        }
      } else if (type == 'danger') {
        for (var i = 0; i < shipFeatures.length; i++) {
          if (shipFeatures[i].getProperties()['shiptype'] == 3) {
            shipPoints.push(shipFeatures[i].getGeometry().getCoordinates())
          }
        }
      }
      return shipPoints
    },
    /**
     * 刷新
     */
    refresh: function () {
      this.queryWMSShips()
      this.queryWFSShips(true)
      setTimeout(() => {
        this.refresh()
      }, 10000)
    }
  }
})()

export default HShipLayer

