import {Vector} from 'ol/layer'
import {Vector as SVector} from 'ol/source'
import store from '@/store'
import {wgs84ToWebMct} from './HTool'
import HSymbol from './HSymbol'

export function coorInit() {
  if (store.getters.lonAndLat) {
    let lonAndLat = store.getters.lonAndLat
    //1.先定义一个原要素图层
    var preLayer = new Vector({
      source: new SVector()
    });
    var afterlon = parseFloat(lonAndLat[0]);
    var afterlat = parseFloat(lonAndLat[1]);
    var lonlat = wgs84ToWebMct(afterlon, afterlat);
    //2.获取要素坐标后向preLayer添加要素
    var prePoint = HSymbol.getMarkerSymbol({'type': "point"}, lonlat, [255, 106, 106]);
    preLayer.getSource().addFeatures([prePoint]);

    //3.在map中添加图层
    store.getters.app.map.addLayer(preLayer);

    //4.定位
    var targetFeature = preLayer.getSource().getFeatures()[0];
    if (targetFeature) {
      var mapView = store.getters.app.map.getView();
      mapView.fit(targetFeature.getGeometry(), store.getters.app.map.getSize(), {duration: 0});
    }
  }
}

