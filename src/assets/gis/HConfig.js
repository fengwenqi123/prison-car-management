/**
 * gis配置常量
 * created by zj on 2019.7.9
 */

//浙江港航底图地址
export var GIS_HOST = "http://10.100.70.227:8080";

//浙江港航船舶图层地址
export var GIS_SHIPWMS = "http://10.100.70.227:8090/geoserver/geobase/wms";
export var GIS_SHIPWFS = "http://10.100.70.227:8090/geoserver/geobase/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geobase:zjghship&maxFeatures=20000&outputFormat=application/json";
//船舶类型
export var GIS_GOODSSHIP = 2;
export var GIS_PASSENGERSHIP = 1;
export var GIS_DANGERSHIP = 3;
export var GIS_HXTSHIP = '浙海巡';
export var GIS_OTHERSHIP = 99;
export var GIS_NONAMESHIP = 0;
