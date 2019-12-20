    clock = new Cesium.Clock();
    clock.shouldAnimate = true;
    vmClock = new Cesium.ClockViewModel(clock);
    let pickedId=0;
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYWVkMTRlNi02M2I4LTQ1NTEtOTFhZC00NjVlYzlhNDBlMWIiLCJpZCI6NDMwMywic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MDQ1NDkwM30.GMDUMgqvDLbut9PhoLQUsjFZrLZxhCE47ly11GYkNv8';
     var viewer = new Cesium.Viewer('cesiumContainer',{
        animation: true,  //是否显示动画控件(左下方那�?
        fullscreenButton: false, //是否显示全屏按钮
        homeButton: false, //是否显示Home按钮
        geocoder: false, //是否显示地名查找控件
        timeline: true, //是否显示时间线控�?
        sceneModePicker: true, //是否显示投影方式控件
        // scene3DOnly : true,
        sceneMode:Cesium.SceneMode.SCENE2D,
        navigationHelpButton: false, //是否显示帮助信息控件
        infoBox: true,  //是否显示点击要素之后显示的信�?
        selectionIndicator: true,//设置绿色框框不可�?
        baseLayerPicker: true,
        //  imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        //     url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        // }),
    });
     var layer=new Cesium.MapboxImageryProvider({
           mapId: 'mapbox.dark',  //mapbox dark底图  更改mapbox底图类型，只需更改mapId
           accessToken: 'pk.eyJ1IjoiY3VtdGJzd3QiLCJhIjoiY2p0OGU1Z2o0MDc4NTN5bzc1YmZ5aWh0YyJ9._Jx5ArbHSJT4v9mZxsUowA'
       });
       viewer.imageryLayers.addImageryProvider(layer);
    //显示经纬度和视角高
    var longitude_show=document.getElementById('longitude_show');
    var latitude_show=document.getElementById('latitude_show');
    var altitude_show=document.getElementById('altitude_show');
    var canvas=viewer.scene.canvas;
    //具体事件的实现
    var ellipsoid=viewer.scene.globe.ellipsoid;
    var handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction(function(movement){
        //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
        var cartesian=viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
        if(cartesian){
            //将笛卡尔三维坐标转为地图坐标（弧度）
            var cartographic=viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            //将地图坐标（弧度）转为十进制的度数
            var lat_String=Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
            var log_String=Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
            var alti_String=(viewer.camera.positionCartographic.height/1000).toFixed(2);
            longitude_show.innerHTML=log_String;
            latitude_show.innerHTML=lat_String;
            altitude_show.innerHTML=alti_String;
        }
    },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        viewer.camera.setView({
        destination : Cesium.Cartesian3.fromDegrees(116.39958190001144,39.92290499760276, 50000.0)
    });

    // viewer.camera.flyTo({
    //     destination: Cesium.Cartesian3.fromDegrees(111.796875,30.234375,200000.0), //摄像机的最终位置
    //     duration: 3,                           //飞行所用时间
    //     maximumHeight: 200000,                  //飞行高峰时的最大高度。
    //     pitchAdjustHeight: 3500,               //如果摄像机的飞行高于此值，请调整俯仰航向以降低俯仰，并将地球保持在视野中
    //     orientation: {
    //         heading: Cesium.Math.toRadians(30),
    //         pitch: Cesium.Math.toRadians(-30),
    //         roll: 0.0
    //     }
    // });
var camera = viewer.camera;
var scene = viewer.scene;
 //初始视角
