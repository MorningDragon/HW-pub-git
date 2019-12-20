function modelShow() {
    var primitives = new Cesium.PrimitiveCollection();
    var dataset = ['../static/data/cumtbTile/sushe/tileset.json','../static/data/cumtbTile/somebuildings/tileset.json','../static/data/cumtbTile/xueyuanwuguanli/tileset.json','../static/data/cumtbTile/yifu/tileset.json','../static/data/cumtbTile/shoufa_tiyuguan/tileset.json','../static/data/cumtbTile/jklab/tileset.json','../static/data/cumtbTile/jiaoxueloulab/tileset.json','../static/data/cumtbTile/juminzu/tileset.json'];
        for (var j = 0;j < dataset.length; j++) {
            var tileset = new Cesium.Cesium3DTileset({
                url: dataset[j],
                maximumScreenSpaceError:1
            });
            tileset.readyPromise.then(function (tileset) {
                primitives.add(tileset);
                //viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(-1.57,0,2));
                viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
            })
        }

        var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame( Cesium.Cartesian3.fromDegrees(116.33923, 39.99500,0))
        primitives.add(Cesium.Model.fromGltf({
            url: '../static/data/cumtbTile/di/ditu0503.gltf',
            modelMatrix : modelMatrix
        }))
        viewer.scene.primitives.add(primitives);

        function myschool(x, y,id,url) {
            var position = Cesium.Cartesian3.fromDegrees(x, y);
            var entity = viewer.entities.add({
                id:id,
                position: position,
                model: {
                    uri: url
                },
                // description: description
            });
        }
        // myschool(116.33923, 39.99500,'dd','gltf/di/ditu0503.gltf');
        myschool(116.33923,39.99500,'管理学院','../static/data/cumtbTile/guanli/guanli.gltf');
        var dataset1= ['../static/data/cumtbTile/whitebuilding2/tileset.json'];
       dataset1.map((val) => {
            let tileset=viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url:val,
                show:true,
                name:val,
                maximumScreenSpaceError:1   //最大屏幕空间差  值越小 3dtiles显示越全面  越耗内存*************
            }));
        tileset.name=val;
        });
}
function fly2city() {
        var layer=new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.dark',  //mapbox dark底图  更改mapbox底图类型，只需更改mapId
        accessToken: 'pk.eyJ1IjoiZ2lzeXVuIiwiYSI6ImNqbzJsbmhyajBuankzd3FpZWV6aXFqcWUifQ.G6t9_LDvKEklUT4-exEb-g'
    });
        viewer.imageryLayers.addImageryProvider(layer);
        viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.337,39.9920,3000000.0), //摄像机的最终位置
        duration: 3,                           //飞行所用时间
        maximumHeight: 200000,                  //飞行高峰时的最大高度。
        pitchAdjustHeight: 3500,               //如果摄像机的飞行高于此值，请调整俯仰航向以降低俯仰，并将地球保持在视野中
        orientation: {
            heading: Cesium.Math.toRadians(30),
            pitch: Cesium.Math.toRadians(-30),
            roll: 0.0
        }
    });
}

