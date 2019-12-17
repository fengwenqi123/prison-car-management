import TileLayer from 'ol/layer/Tile'
import ImageLayer from 'ol/layer/Image'
import TileArcGISRest from 'ol/source/TileArcGISRest'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import Static from 'ol/source/ImageStatic'
import TileWMS from 'ol/source/TileWMS'
import TileGrid from 'ol/tilegrid/TileGrid'
import {transform, get} from 'ol/proj'

const img = require('@/assets/gis/img/prison_nq.png')
var firstExtent = [13300180.25774, 3382074.98036, 13301175.13676, 3383061.53579]
const projection = get('EPSG:3857')
const maptype = 0 // 0表示部署的离线瓦片地图，1表示OSM,2表示使用Arcgis在线午夜蓝地图服务
// const url = 'http://192.168.1.121:8080/geowebcache/service/wms'
const url = 'http://192.168.253.54:8089/geowebcache/service/wms'
const Extent = [13300014.25774, 3381984.98036, 13301261.13676, 3383131.53579]
const fullExtent = [-20037508.342787, -20037508.342781033, 20037508.342781033, 20037508.342787]
const resolutions = [156543.0339, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317016, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135]
const tileGrid = new TileGrid({
  tileSize: 256,
  extent: fullExtent,
  resolutions: resolutions
})

var streetmap = function() {
  var maplayer = null
  switch (maptype) {
    case 0:
      maplayer = [
        new TileLayer({
          title: '卫星影像图',
          type: 'YXT',
          source: new TileWMS({
            url: url,
            params: {'LAYERS': 'prisonnq', format: 'image/jpeg', SRS: 'EPSG:3857'},
            tileGrid: tileGrid
          }),
          visible: true
        }),
        new ImageLayer({
          type: 'prison',
          source: new Static({
            url: img,
            projection: projection,
            imageExtent: firstExtent
          })
        })
      ]
      break
    case 1:
      maplayer = new TileLayer({
        source: new OSM()
      })
      break
    case 2:
      maplayer = new TileLayer({
        source: new TileArcGISRest({
          url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer'
        })
      })
      break
    case 3:
      maplayer = [
        new TileLayer({
          title: '影像地图',
          type: 'YXT',
          source: new XYZ({
            url: url + 'img_w'
          })
        }),
        new TileLayer({
          title: '二维地图',
          type: 'DZDT',
          source: new XYZ({
            url: url + 'vec_w'
          })
        }),
        new TileLayer({
          title: '影像注记',
          type: 'CIA',
          source: new XYZ({
            url: url + 'cia_w'
          })
        })
      ]
      break
  }
  return maplayer
}

const mapCenterCoor = transform([119.4818, 29.0544], 'EPSG:4326', 'EPSG:3857')
// const mapCenterCoor = transform([30.2267625798, 119.9683681382], 'EPSG:4326', 'EPSG:3857')
var mapconfig = {
  x: mapCenterCoor[0], // 中心点经度和纬度
  y: mapCenterCoor[1],
  zoom: 17, // 地图缩放级别
  streetmap: streetmap,
  projection: projection,
  extent: Extent,
  minZoom: 15,
  maxZoom: 18
}

export default mapconfig
