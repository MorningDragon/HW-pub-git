function fly() {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(111.796875,30.234375,200000.0), //摄像机的最终位置
        duration: 8,                           //飞行所用时间
        maximumHeight: 200000,                  //飞行高峰时的最大高度。
        pitchAdjustHeight: 3500,               //如果摄像机的飞行高于此值，请调整俯仰航向以降低俯仰，并将地球保持在视野中
        orientation: {
            heading: Cesium.Math.toRadians(30),
            pitch: Cesium.Math.toRadians(-30),
            roll: 0.0
        }
    });

    function route(url) {
        viewer.dataSources.add(Cesium.KmlDataSource.load(url,
            {
                camera: viewer.scene.camera,
                canvas: viewer.scene.canvas
            })
        );
    }
    route('../static/data/flightdata/route01.kmz');
    route('../static/data/flightdata/route02.kmz');

    function CityPoint(url,COLOR) {
        Cesium.GeoJsonDataSource.load(url).then(function (jsonData) {
            var flight = viewer.dataSources.add(jsonData);
            var entities = jsonData.entities.values;
            for (var i=0;i<=entities.length;i++) {
                var ifeature = entities[i];
                ifeature.billboard = undefined;
                ifeature.point = new Cesium.PointGraphics({
                    pixelSize: 7,
                    color: COLOR,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2
                });
                ifeature.label = new Cesium.LabelGraphics(
                    {
                        text: ifeature._name,
                        font: '10pt monospace',
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -9),
                        translucencyByDistance : new Cesium.NearFarScalar(10000000, 1.0, 13000000, 0.0)
                    }
                )
            }

        })
    }
    CityPoint('../static/data/flightdata/ParkingBays.json',Cesium.Color.BLACK);
    CityPoint('../static/data/flightdata/省会P.json',Cesium.Color.GREEN);
    CityPoint('../static/data/flightdata/直辖市P.json',Cesium.Color.GREEN);
    $.get('../static/data/flightdata/flightData.csv',function(data) {
        var flightData = data.split("\r\n");
        var hash = [];
        for (var i = 0; i < flightData.length; i++) {
            var str2obj = flightData[i].split(',')
            if (hash.indexOf(str2obj[0]) == -1) {
                hash.push(str2obj[0])
            }
        }
        var czml0 = {
            "id": "document",
            "version": "1.0",
            "clock": {
                "interval": "2019-08-03T15:59:30Z/2019-08-03T17:50:00Z",
                "currentTime": "2019-08-03T15:59:30Z",
                "multiplier": 10
            }
        };
        var czml = [czml0];
        var list2 = [];
        for (var i = 0; i < hash.length; i++) {
            for (var j = 0; j < flightData.length; j++) {
                var str2obj = flightData[j].split(',')
                if (hash[i] == str2obj[0] && hash[i] != '') {
                    list2.push(parseFloat(str2obj[1]));
                    list2.push(parseFloat(str2obj[2]));
                    list2.push(parseFloat(str2obj[3]));
                    list2.push(parseFloat(str2obj[4]));
                }
            }
            var czml1 = {
                "id": hash[i],  //id信息
                "availability": "2019-08-03T15:59:30Z/2019-08-03T16:70:00Z",
                "position": {"epoch": "2019-08-03T16:00:00+00:00", "cartographicDegrees": list2},
                "model": {"gltf": "../static/data/flightdata/Cesium_Air.glb", "scale": 1000, "minimumPixelSize": 40},
                "orientation": {
                    "velocityReference": "#position"
                },
            };
            //console.log(hash[61],hash[58],hash[59])
            czml.push(czml1);
            list2 = [];
        }
        viewer.dataSources.add(Cesium.CzmlDataSource.load(czml))
    });
    $.get('../static/data/DQG6.txt',function(data) {
        var l = data.split("\r\n");   //按回车键拆分
        for (var i = 0;i<l.length;i++) {
            var lineArr = l[i].trim().split(/\s+/);//每行是一个数组
            // if ((parseFloat(lineArr[1])>tempExtent.xmin&&parseFloat(lineArr[1])<tempExtent.xmax)&&(parseFloat(lineArr[2])>tempExtent.ymin&&parseFloat(lineArr[2])<tempExtent.ymax)){
            data1 = [parseFloat(lineArr[3]), parseFloat(lineArr[4]), parseFloat(lineArr[5]),
                parseFloat(lineArr[6]), parseFloat(lineArr[7]), parseFloat(lineArr[8]),
                parseFloat(lineArr[9]), parseFloat(lineArr[10])];
            var DQG6 = viewer.entities.add({
                id: lineArr[0],
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(data1),
                    height: -8000,
                    extrudedHeight: 50000,
                    //heightReference:100000,
                    //perPositionHeight : true,
                    material: new Cesium.Color.WHITE.withAlpha(0.1),
                    outline: true,
                    outlineWidth: 0.3,
                    //fill : false,
                    outlineColor: Cesium.Color.WHITE,
                    arcType: Cesium.ArcType.RHUMB
                },
            });
            data1 = []
        }
    });

    var fly1 = [{
        "id": "document",
        "version": "1.0",
        "clock": {
            "interval": "2019-08-03T16:00:00Z/2019-08-03T17:50:00Z",
            "currentTime": "2012-08-03T16:00:00Z",
            "multiplier": 10
        }
    }, {
        "id": '编码1210201',  //id信息
        "availability": "2019-08-03T16:00:37Z/2019-08-03T16:08:23Z",
        "polygon":{
            "positions":{
                "cartographicDegrees":[113.906250,37.968750,0,115.312500,37.968750,0,115.312500,39.375000,0,113.906250,39.375000,0]
            },
            "height":-8000,
            "extrudedHeight":50000,
            "material":{
                "solidColor":{
                    "color":{
                        "rgba":[255, 0, 0, 100]
                    }
                }
            }
        },
    }];
    var dataSourcePromise = Cesium.CzmlDataSource.load(fly1);
    viewer.dataSources.add(dataSourcePromise);
    // viewer.zoomTo(dataSourcePromise);
    var fly2 = [{
        "id": "document",
        "version": "1.0",
        "clock": {
            "interval": "2019-08-03T16:00:00Z/2019-08-03T17:50:00Z",
            "currentTime": "2012-08-03T16:00:00Z",
            "multiplier": 10
        }
    }, {
        "id": '编码1210203',  //id信息
        "availability": "2019-08-03T16:08:23Z/2019-08-03T16:19:13Z",
        "polygon":{
            "positions":{
                "cartographicDegrees":[113.906250,36.562500,0,115.312500,36.562500,0,115.312500,37.968750,0,113.906250,37.968750,0]
            },
            "height":-8000,
            "extrudedHeight":50000,
            "material":{
                "solidColor":{
                    "color":{
                        "rgba":[255, 0, 0, 100]
                    }
                }
            }
        },
    }];
    var dataSourcePromise = Cesium.CzmlDataSource.load(fly2);
    viewer.dataSources.add(dataSourcePromise);

    var fly3 = [{
        "id": "document",
        "version": "1.0",
        "clock": {
            "interval": "2019-08-03T16:00:00Z/2019-08-03T17:50:00Z",
            "currentTime": "2012-08-03T16:00:00Z",
            "multiplier": 10
        }
    }, {
        "id": '编码1210221',  //id信息
        "availability": "2019-08-03T16:19:13Z/2019-08-03T16:30:39Z",
        "polygon":{
            "positions":{
                "cartographicDegrees":[113.906250,35.156250,0,115.312500,35.156250,0,115.312500,36.562500,0,113.906250,36.562500,0]
            },
            "height":-8000,
            "extrudedHeight":50000,
            "material":{
                "solidColor":{
                    "color":{
                        "rgba":[255, 0, 0, 100]
                    }
                }
            }
        },
    }];
    var dataSourcePromise = Cesium.CzmlDataSource.load(fly3);
    viewer.dataSources.add(dataSourcePromise);
    var fly4 = [{
        "id": "document",
        "version": "1.0",
        "clock": {
            "interval": "2019-08-03T16:00:00Z/2019-08-03T17:50:00Z",
            "currentTime": "2012-08-03T16:00:00Z",
            "multiplier": 10
        }
    }, {
        "id": '编码1210223',  //id信息
        "availability": "2019-08-03T16:30:39Z/2019-08-03T16:41:39Z",
        "polygon":{
            "positions":{
                "cartographicDegrees":[113.906250,33.750000,0,115.312500,33.750000,0,115.312500,35.156250,0,113.906250,35.156250,0]
            },
            "height":-8000,
            "extrudedHeight":50000,
            "material":{
                "solidColor":{
                    "color":{
                        "rgba":[255, 0, 0, 100]
                    }
                }
            }
        },
    }];
    var dataSourcePromise = Cesium.CzmlDataSource.load(fly4);
    viewer.dataSources.add(dataSourcePromise);
    var fly5 = [{
        "id": "document",
        "version": "1.0",
        "clock": {
            "interval": "2019-08-03T16:00:00Z/2019-08-03T17:50:00Z",
            "currentTime": "2012-08-03T16:00:00Z",
            "multiplier": 10
        }
    }, {
        "id": '编码1212001',  //id信息
        "availability": "2019-08-03T16:41:39Z/2019-08-03T16:52:47Z",
        "polygon":{
            "positions":{
                "cartographicDegrees":[113.906250,32.343750,0,115.312500,32.343750,0,115.312500,33.750000,0,113.906250,33.750000,0]
            },
            "height":-8000,
            "extrudedHeight":50000,
            "material":{
                "solidColor":{
                    "color":{
                        "rgba":[255, 0, 0, 100]
                    }
                }
            }
        },
    }];

    var dataSourcePromise = Cesium.CzmlDataSource.load(fly5);
    viewer.dataSources.add(dataSourcePromise);
    var fly6 = [{
        "id": "document",
        "version": "1.0",
        "clock": {
            "interval": "2019-08-03T16:00:00Z/2019-08-03T17:50:00Z",
            "currentTime": "2012-08-03T16:00:00Z",
            "multiplier": 10
        }
    }, {
        "id": '编码1212003',  //id信息
        "availability": "2019-08-03T16:52:47Z/2019-08-03T17:00:40Z",
        "polygon":{
            "positions":{
                "cartographicDegrees":[113.906250,30.937500,0,115.312500,30.937500,0,115.312500,32.343750,0,113.906250,32.343750,0]
            },
            "height":-8000,
            "extrudedHeight":50000,
            "material":{
                "solidColor":{
                    "color":{
                        "rgba":[255, 0, 0, 100]
                    }
                }
            }
        },
    }];
    var dataSourcePromise = Cesium.CzmlDataSource.load(fly6);
    viewer.dataSources.add(dataSourcePromise);
    $('#removeflyDiv').css({"display":"block"});
};

// 移除
$('#removefly').click(
    function remove_fly(){
    viewer.dataSources.removeAll();
    viewer.entities.removeAll();
    // viewer.entities.removeById('DQG6');
    $('#removeflyDiv').css({"display":"none"})
},
    );
