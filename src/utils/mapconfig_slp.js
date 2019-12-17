import TileLayer from 'ol/layer/Tile'
import ImageLayer from 'ol/layer/Image'
import TileArcGISRest from 'ol/source/TileArcGISRest'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import Static from 'ol/source/ImageStatic'
import TileWMS from 'ol/source/TileWMS'
import TileGrid from 'ol/tilegrid/TileGrid'
import {transform, get} from 'ol/proj'

const img1 = require('@/assets/gis/img/1.png')
const img2 = require('@/assets/gis/img/2.png')
const img3 = require('@/assets/gis/img/3.png')
const img4 = require('@/assets/gis/img/4.png')
const projection = get('EPSG:3857')
const maptype = 0 // 0表示部署的离线瓦片地图，1表示OSM,2表示使用Arcgis在线午夜蓝地图服务
// const url = 'http://192.168.1.121:8080/geowebcache/service/wms'
const url = 'http://172.16.1.72:8090/geowebcache/service/wms'
const Extent = [13278038.61210, 3379075.59597, 13280905.00066, 3382042.30813]
const fullExtent = [-20037508.342787, -20037508.342781033, 20037508.342781033, 20037508.342787]
const resolutions = [156543.033928041, 78271.5169640205, 39135.75848201025, 19567.879241005125, 9783.939620502562, 4891.969810251281, 2445.984905125641, 1222.99245256282, 611.49622628141, 305.748113140705, 152.874056570353, 76.437028285176, 38.218514142588, 19.109257071294, 9.554628535647, 4.777314267824, 2.388657133912, 1.194328566956, 0.597164283478]
const tileGrid = new TileGrid({
  tileSize: 256,
  extent: fullExtent,
  resolutions: resolutions
})
// 图片参数 衢州十里坪
var firstExtent = [13279253.38604, 3380830.49417, 13280053.35932, 3381589.74268]
var secondExtent = [13280001.93815, 3381103.34320, 13280577.17999, 3381652.94702]
var thirdExtent = [13279148.80305, 3379879.25149, 13279754.42523, 3380471.96874]
var fourthExtent = [13278971.01528, 3379349.22391, 13279530.23458, 3379874.48372]

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
            params: {'LAYERS': 'prisonqz', format: 'image/jpeg', SRS: 'EPSG:3857'},
            tileGrid: tileGrid
          }),
          visible: true
        }),
        new ImageLayer({
          type: 'prison',
          source: new Static({
            url: img1,
            projection: projection,
            imageExtent: firstExtent
          })
        }),
        new ImageLayer({
          type: 'prison',
          source: new Static({
            url: img2,
            projection: projection,
            imageExtent: secondExtent
          })
        }),
        new ImageLayer({
          type: 'prison',
          source: new Static({
            url: img3,
            projection: projection,
            imageExtent: thirdExtent
          })
        }),
        new ImageLayer({
          type: 'prison',
          source: new Static({
            url: img4,
            projection: projection,
            imageExtent: fourthExtent
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
