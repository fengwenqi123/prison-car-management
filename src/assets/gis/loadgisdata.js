const coverImg = require('@/assets/gis/img/cover.png')
const coverImg_error = require('@/assets/gis/img/cover_error.png')
/**
 * GIS要素数据加载js
 * created by zj on 2018.8.30
 */

/*******************************************要素获取及展示方法开始****************************************/
/**
 * 分层加载要素数据
 * @param {String} type 加载业务要素类型
 * @description 除船舶图层外,其他要素初始化时顺次添加一次
 */
import store from '@/store'
import {wgs84ToWebMct} from './HTool'
import HSymbol from './HSymbol'

export function loadInfoLayer(type) {
  if ((type == null || type == "cover") && store.getters.app.coverLayer) loadCover();
}

/**
 * 加载井盖要素
 */
function loadCover() {
  try {
    $.ajax({
      url: 'http://cjb.huihangtech.com/api/cover/cover/list',
      type: "get",
      dateType: "json",
      success: function (d) {
        var areadata = d.data;
        var markerSymbol = [];
        store.getters.app.coverLayer.clear();
        $.each(areadata, function (i, item) {
          var coverAttr = {
            'type': 'cover',
            'id': item.id,
            'name': item.deviceName
          }
          if (item.longitude != null && item.latitude != null) {
            var lonlat = wgs84ToWebMct(item.longitude, item.latitude);
            var img
            if (!item.deviceState || item.deviceState.indexOf('1') !== -1) {
              img = coverImg_error
            } else {
              img = coverImg
            }
            var bridgeSymbol = HSymbol.getPictureMarkerSymbol(coverAttr, lonlat, img, 1, coverAttr['name'], 14, [0, 0, 0], -20, -20);
            markerSymbol.push(bridgeSymbol);
          }
        });
        store.getters.app.coverLayer.addPolygonSymbol(markerSymbol);
      }
    });
  } catch (e) {
    console.log(e.name + ":" + e.message);
  }
}

/*******************************************要素获取及展示方法结束****************************************/
