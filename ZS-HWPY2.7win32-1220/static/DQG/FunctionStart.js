'use strict';

var distanceF = 0.0;

// camera.setView({destination:Cesium.Cartesian3.fromDegrees(116.3411, 39.9963, 600.0), //20000000.0
//     orientation:{
//         heading: Cesium.Math.toRadians(0.0),
//         pitch: Cesium.Math.toRadians(-90.0),
//         roll: Cesium.Math.toRadians(0.0)
//     }});  // 学校视角值116.3411, 39.9963, 600.0 116.3411, 39.9963, 280 // 全球视角109.0, 35.0, 18000000.0

var oneLayer;
var layer=new Cesium.MapboxImageryProvider({
    mapId: 'mapbox.dark',  //mapbox dark底图  更改mapbox底图类型，只需更改mapId
    accessToken: 'pk.eyJ1IjoibXhpYW9sb25nIiwiYSI6ImNqdGxnbTI2MzBhYWw0YXBsNWVob3liYW4ifQ.gC54w-HjddhZbwtcdpvmSg'
});
oneLayer = viewer.scene.imageryLayers.addImageryProvider(layer);
viewer.scene.imageryLayers.raiseToTop(oneLayer);

//显示经纬度和视角高
var longitude_show=document.getElementById('longitude_show');
var latitude_show=document.getElementById('latitude_show');
var altitude_show=document.getElementById('altitude_show');

var LonLatShowHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
LonLatShowHandler.setInputAction(function(movement){
    //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
    var cartesian=viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
    if(cartesian){
        //将笛卡尔三维坐标转为地图坐标（弧度）
        var cartographic=viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        //将地图坐标（弧度）转为十进制的度数
        var lat_String=Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
        var log_String=Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
        var alt_String=(viewer.camera.positionCartographic.height / 1000).toFixed(2);
        longitude_show.innerHTML=log_String;
        latitude_show.innerHTML=lat_String;
        altitude_show.innerHTML=alt_String;
    }
},Cesium.ScreenSpaceEventType.MOUSE_MOVE);

// 绘制格网
function drawDQG() {
    var cameraPositionF = camera.position;

    var R = computeRadius(camera);
    camera.cameraDistance = Cesium.Cartesian3.magnitude(cameraPositionF);
    camera.cosfovy = Math.cos(camera.frustum._fovy / 2);
    camera.sinfovy = Math.sin(camera.frustum._fovy / 2);
    camera.fovyRadians = PI / 2 - camera.frustum._fovy / 2;
    camera.dCosfovy = camera.cameraDistance * camera.cosfovy;
    camera.sqrtValue = R * R - camera.cameraDistance * camera.cameraDistance + camera.dCosfovy * camera.dCosfovy;
    camera.cosB = (camera.cameraDistance * (1 - camera.cosfovy * camera.cosfovy) + camera.cosfovy * Math.sqrt(camera.sqrtValue)) / R;
    camera.angle = Math.acos(camera.cosB);
    camera.radiusDistance = R / camera.sinfovy;

    camera.cullingVolume = camera.frustum.computeCullingVolume(camera.positionWC, camera.directionWC, camera.upWC);
    camera.occluder = new Cesium.EllipsoidalOccluder(ellipsoid, camera.positionWC);
    distanceF = camera.cameraDistance;
    camera.altitudeDistance = (distanceF - R) / 1000;
    scene.imageryLayers.lower(oneLayer);
    // drawMultiScaleTiles();      绘制多尺度格网
    drawSingleScaleTiles()      // 绘制单尺度格网
}
viewer.clock.onTick.addEventListener(drawDQG);
