clock = new Cesium.Clock();
    clock.shouldAnimate = true;
    vmClock = new Cesium.ClockViewModel(clock);
    // let pickedId=0;
    let startTracking=false;
    let globalMultipher=5;
    viewer.clock.multiplier=globalMultipher;
    viewer.clock.canAnimate=false;
    viewer.clock.shouldAnimate=false;
    ///////////////////////////////////////////////////////////
    // var start = Cesium.JulianDate.fromIso8601('2012-11-08');
    // var end = Cesium.JulianDate.fromIso8601('2012-11-9');
    //
    // viewer.timeline.zoomTo(start, end);
    //
    // var clock = viewer.clock;
    // clock.startTime = start;
    // clock.endTime = end;
    // clock.currentTime = start;
    // clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    // clock.multiplier = 10;
    ////////////////////////////////////////////////////////////
    var canvas=viewer.scene.canvas;
    //具体事件的实现
    var ellipsoid=viewer.scene.globe.ellipsoid;
    var handler = new Cesium.ScreenSpaceEventHandler(canvas);

    //加载格网
    var test1=3;
    let DividLevel=10;
    let trajectoryCollection=[];
    //load trajectory data
    let time0=20121108000000;       let num=0;
    let oldTimeStamp=0;
    let hash=[0];        let hashTemp=0;
    let IDs=[];
    $.get('../static/data/xiangsilinjin/adjacent.txt',function(data) {
        var l = data.split("\r\n");   //按回车键拆分
        //console.log(data);
        var oldId=(l[0].trim().split(/\s+/))[0];
        oldTimeStamp=parseInt((l[0].trim().split(/\s+/))[4]);
        var Temp=[];    var timeplus=0;
        for (var i = 0;i<l.length;i++) {        //对每一行数据进行处理
            var lineArr = l[i].trim().split(/\s+/);//每行是一个数组
            // 0 id        1 capacity        2 L       3 B       4 timestamp
            if(lineArr[0]!=oldId || i == l.length-1){      //create new trajectory with new id,and generate their CZML
                IDs.push(parseInt(oldId));
                //console.log(lineArr[4]);
                var color = new Cesium.Color(255/255, 250/255, 250/255, 0.2);
                var road1 = [{
                    "id": "document",
                    "name": "CZML Path",
                    "version": "1.0",
                    "clock": {
                        "interval": "2019-08-04T16:00:00Z/2019-08-04T16:14:00Z",
                        "currentTime": "2019-08-04T16:00:00Z",
                        "multiplier": globalMultipher
                    }
                },
                    {
                        "id": num.toString(),
                        "name": oldId,
                        "availability": "2019-08-04T16:00:00Z/2019-08-04T16:14:00Z",
                        "model": {
                            "gltf": "../static/data/flightdata/CesiumMilkTruck.glb",
                            "scale": 2,
                            "minimumPixelSize": 20
                        },
                        // 'billboard' :{
                        //             image : '../static/data/images/lightPoint.png',
                        //             width:7,
                        //             height:7,
                        //             color : color
                        //         },
                        "orientation": {
                            "velocityReference": "#position"
                        },
                        "position": {
                            "epoch": "2019-08-04T16:00:00Z",
                            "cartographicDegrees": Temp
                        }
                    }];
                oldId=lineArr[0];

                //trajectoryCollection.push(road1);
                //trajectoryCollection.push(Temp);
                viewer.dataSources.add(Cesium.CzmlDataSource.load(road1)).then(function (ds) {     });
                hashTemp+=Temp.length;
                //hash.push(hashTemp);
                hash[++num]=hashTemp;
                Temp = [];
                timeplus=0; //num++;
                if(i != l.length-1){
                    Temp = Temp.concat(/*parseInt(lineArr[4])-time0+*/timeplus, parseFloat(lineArr[2]), parseFloat(lineArr[3]), 0);
                    trajectoryCollection = trajectoryCollection.concat(/*parseInt(lineArr[4])-time0+*/timeplus, parseFloat(lineArr[2]), parseFloat(lineArr[3]), 0);
                    timeplus += 100;
                    oldTimeStamp=parseInt(lineArr[4]);
                }
            }
            else{         //add data to current trajectory
                // if(parseInt(lineArr[4])-oldTimeStamp>20000){
                //     //Temp=[];
                //     //timeplus=0;
                //     //console.log(oldTimeStamp);
                //     continue;
                // }
                // else {
                    Temp = Temp.concat(/*parseInt(lineArr[4])-time0+*/timeplus, parseFloat(lineArr[2]), parseFloat(lineArr[3]), 0);
                    trajectoryCollection = trajectoryCollection.concat(/*parseInt(lineArr[4])-time0+*/timeplus, parseFloat(lineArr[2]), parseFloat(lineArr[3]), 0);
                    timeplus += 100;
                    oldTimeStamp=parseInt(lineArr[4]);
                // }
            }
        }
    });


    //hash.pop();
    //hash.length=hash.length-1;
    //hash[0]=0;

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(116.3477, 39.9970,620.0), //摄像机的最终位置   -2171295.347076855、4386855.27933965、4076853.172205584
        // destination: Cesium.Cartesian3(normalPosition.x,normalPosition.y,normalPosition.z),
        duration: 5,                           //飞行所用时间
        maximumHeight: 200000,                  //飞行高峰时的最大高度。
        pitchAdjustHeight: 3500,               //如果摄像机的飞行高于此值，请调整俯仰航向以降低俯仰，并将地球保持在视野中
        orientation: {
            heading: Cesium.Math.toRadians(1),
            pitch: Cesium.Math.toRadians(-50),
            roll: 0.0
        }
    });

    //输出插值点坐标，插值时间间隔0.1s
    // function disInternal() {
    //     var LBS=road1[1].position.cartographicDegrees;
    //     for(var i=1;i<LBS.length/4;i++){
    //
    //         var T0=LBS[i*4-4];
    //         var L0=LBS[i*4-3];
    //         var B0=LBS[i*4-2];
    //
    //         var deltaT=(LBS[i*4]-LBS[i*4-4])/100;
    //         var deltaL=(LBS[i*4+1]-L0)/deltaT;
    //         var deltaB=(LBS[i*4+2]-B0)/deltaT;
    //         for(var j=0;j<100;j++){
    //             //console.log(T0+" "+L0+" "+B0);
    //             T0+=deltaT;
    //             L0+=deltaL;
    //             B0+=deltaB;
    //         }
    //     }
    // }
    // disInternal();

    //给定时间点t,获得该时刻点的经纬度坐标。
    // function getLBbyTimePoint(t){
    //     var LBS=road1[1].position.cartographicDegrees;
    //
    //     //计算t位于第几个间隔 N
    //     var TT=t-LBS[0];
    //     var intervalT=LBS[4]-LBS[0];
    //     var N=Math.floor(TT/intervalT);
    //
    //     //由N得到起始点时刻和坐标
    //     var T0=LBS[N*4];
    //     var L0=LBS[N*4+1];
    //     var B0=LBS[N*4+2];
    //
    //     //计算第N段的时间间隔和经纬度间隔
    //     var deltaT=(LBS[N*4+4]-LBS[N*4]);       //100s
    //     var deltaL=(LBS[N*4+5]-L0)/deltaT;
    //     var deltaB=(LBS[N*4+6]-B0)/deltaT;
    //
    //     //计算得到经纬度
    //     L0+=deltaL*(t-T0);
    //     B0+=deltaB*(t-T0);
    //     var re=[L0,B0];
    //     return re;
    //     //console.log(L0+" "+B0);
    // }

    //给定时间点t,获得该时刻点的经纬度坐标。
    function getLBbyTimePoint(t,id){
        var ost=hash[id];
        //console.log("outset: "+ost);

        // N        计算t位于第几个间隔
        var TT=t-trajectoryCollection[ost];
        var intervalT=trajectoryCollection[ost+4]-trajectoryCollection[ost];
        var N=Math.floor(TT/intervalT);

        //console.log("TT: "+TT+"intervalT: "+intervalT+"N: "+N);

        //由N得到起始点时刻和坐标
        var T0=trajectoryCollection[ost+N*4];
        var L0=trajectoryCollection[ost+N*4+1];
        var B0=trajectoryCollection[ost+N*4+2];

        //console.log("T0: "+T0+"L0: "+L0+"B0: "+B0);

        //计算第N段的时间间隔和经纬度间隔
        //var deltaT=(trajectoryCollection[ost+N*4+4]-trajectoryCollection[ost+N*4]);       //100s
        var deltaT=100;
        var deltaL=(trajectoryCollection[ost+N*4+5]-L0)/deltaT;
        var deltaB=(trajectoryCollection[ost+N*4+6]-B0)/deltaT;

        //console.log("dT: "+deltaT+"dL: "+deltaL+"dB: "+deltaB);

        //计算得到经纬度
        L0+=deltaL*(t-T0);
        B0+=deltaB*(t-T0);
        var re=[L0,B0];

        //console.log(id+" "+L0+" "+B0);

        return re;
        //console.log(L0+" "+B0);
    }
    //输出轨迹经过的格网点左上角经纬度
    var LB=0;
    function outputULCorner() {
        for(var i=0;i<IDs.length;i++){
            for(var j=0;j<800;j++){
                LB=getLBbyTimePoint(j,i);
                console.log(IDs[i]+" "+LB[0]+" "+LB[1]);
            }
        }
    }

    //outputULCorner();




    //计算经纬度所在格网单元行列号
    let L1=116.33697509765625;  let B1=40.001220703125;
    let L2=116.34796142578125;    let B2=39.990234375;
    //let deltaL=0.002197265625;
    let deltaL =(L2-L1)/(1<<DividLevel);
    let deltaB =(B1-B2)/(1<<DividLevel);
    //console.log(deltaL+"##################"+deltaB);
    let i_t=0;    let j_t=0;
    let oldCell;
    function calcIJ(L,B,level) {
        //level=8;
        // var deltaL=(L2-L1)/(1<<level);
        // var deltaB=(B1-B2)/(1<<level);
        var j=Math.floor((L-L1)/deltaL);
        var i=Math.floor((B1-B)/deltaB);

        var LL=L1+j*deltaL;
        var BB=B1-i*deltaB;

        if(LL && BB) {
            console.log(LL+" "+BB+" "+i+" "+j+" "+deltaL+" "+deltaB);
            // var xx=viewer.entities.getById(String.valueOf(i*10000+j));
            // console.log(xx);

            //if not found
            //add new entity
            if(i_t == i && j_t==j) return;
            else{
                //create new entiry
                // viewer.entities.removeAll();
                var t = viewer.entities.add({
                    //id: String.valueOf(i*10000+j),
                    //name: 'Cell',
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([
                            LL, BB - deltaB, LL + deltaL, BB - deltaB, LL + deltaL, BB, LL, BB]),
                        material: Cesium.Color.RED.withAlpha(0.8)
                        //outline: true,
                        //outlineColor: Cesium.Color.BLACK
                    }
                });
                if(oldCell) viewer.entities.remove(oldCell);
                oldCell=t;
            }
            i_t=i;  j_t=j;
        }
    }

    var i_tN=-1; var j_tN=-1;
    let oldNeig;
    function dispNearEigth(L,B,level) {
        //level=8;
        // var deltaL=(L2-L1)/(1<<level);
        // var deltaB=(B1-B2)/(1<<level);
        var j=Math.floor((L-L1)/deltaL);
        var i=Math.floor((B1-B)/deltaB);

        var LL=L1+j*deltaL;
        var BB=B1-i*deltaB;


        if(LL && BB) {
            //console.log(LL+" "+BB+" "+i+" "+j+" "+deltaL+" "+deltaB );
            if(i_tN == i && j_tN == j) return;
            else {
                var t = viewer.entities.add({
                    name: 'Red box on surface',
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([
                            LL - deltaL, BB - 2 * deltaB, LL + 2 * deltaL, BB - 2 * deltaB, LL + 2 * deltaL, BB + deltaB, LL - deltaL, BB + deltaB]),
                        material: Cesium.Color.GOLD.withAlpha(0.2)
                        //outline: true,
                        //outlineColor: Cesium.Color.BLACK
                    }
                });
                if(oldNeig) viewer.entities.remove(oldNeig);
                oldNeig=t;
            }
            i_tN = i;    j_tN = j;
        }
    }




    //显示格网单元
    function displayCellandNeighboor(L,B,level) {
        //level=8;
        var deltaL=(L2-L1)/(1<<level);
        var deltaB=(B1-B2)/(1<<level);
        var j=Math.floor((L-L1)/deltaL);
        var i=Math.floor((B1-B)/deltaB);

        var LL=L1+j*deltaL;
        var BB=B1-i*deltaB;

        if(LL && BB) {
            if(i_tN == i && j_tN == j) return;
            else {
                console.log("displayCellandNeighboor: "+LL+" "+BB+" "+i+" "+j+" "+deltaL+" "+deltaB+" level: "+level);

                var cell = viewer.entities.add({
                    //id: String.valueOf(i * 10000 + j),
                    //name: 'Red box on surface',
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([
                            LL, BB - deltaB, LL + deltaL, BB - deltaB, LL + deltaL, BB, LL, BB]),
                        height: 0.01,
                        material: Cesium.Color.RED.withAlpha(0.8)
                        //outline: true,
                        //outlineColor: Cesium.Color.BLACK
                    }
                });

                var neighboor = viewer.entities.add({
                    name: 'Red box on surface',
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([
                            LL - deltaL, BB - 2 * deltaB, LL + 2 * deltaL, BB - 2 * deltaB, LL + 2 * deltaL, BB + deltaB, LL - deltaL, BB + deltaB]),
                        material: Cesium.Color.GOLD.withAlpha(0.2)
                        //outline: true,
                        //outlineColor: Cesium.Color.BLACK
                    }
                });
            }
            i_tN = i;    j_tN = j;
        }
    }


    function clearEntities(){
        viewer.entities.removeAll();
    }

    let t1=0,t2=-11;
    function dispEllipsed(id) {
        //console.log("t1: "+t1+" t2: "+t2);
        if(t1>2900){
            //t1=0;
            t1=viewer.cesiumWidget.clock._currentTime.secondsOfDay-viewer.cesiumWidget.clock.startTime.secondsOfDay;
            //new circle
            if(t1<10) {
                t1=0;       t2=-11;
                clearEntities();
                oldCell=0;
                oldNeig=0;
            }
            return;
        }
        t1=viewer.cesiumWidget.clock._currentTime.secondsOfDay-viewer.cesiumWidget.clock.startTime.secondsOfDay;
        if(t1<10){
            t2=0;
            oldCell=0;
            oldNeig=0;
            clearEntities();
        }
        //console.log(viewer.clock.multiplier);
        if(t1-t2<viewer.clock.multiplier/3) return;
        //console.log(t1+" "+t2);
        if(startTracking) {
            var LB = getLBbyTimePoint(t1, id);
            //displayCell(LB[0],LB[1]);
            // dispNearEigth(LB[0],LB[1],8);
            // calcIJ(LB[0],LB[1],8);

            //displayCellandNeighboor(LB[0], LB[1], DividLevel);
            //calcIJ(LB[0], LB[1], DividLevel);
            //dispNearEigth(LB[0], LB[1], DividLevel);
            //console.log(LB[0]+" "+LB[1]);
            dispBuffer(LB[0], LB[1], DividLevel);

            dispCarInBuffer(LB[0], LB[1], DividLevel,id,t1);
        }
        //console.log("startTracking:"+startTracking);
        t2=t1;
    }
    //dispEllipsed();


    let startTrackingTime=0;
    function trackingAndDisplay(id){
        startTracking=true;
        //var t=viewer.cesiumWidget.clock._currentTime.secondsOfDay-startTrackingTime;
        dispEllipsed(id);
    }

    function tick() {
        if(startTracking) dispEllipsed(pickedId);
        Cesium.requestAnimationFrame(tick);
    }
    Cesium.requestAnimationFrame(tick);

    //QuadTiles[0] = new QuadTile("2100323013100", 13, 116.3232421875, 39.979248046875, 116.334228515625, 39.990234375);
    //QuadTiles[1] = new QuadTile("2100323013101", 13, 116.334228515625, 39.979248046875, 116.34521484375, 39.990234375);
    //QuadTiles[0] = new QuadTile("21003230113320", 12, 116.33697509765625, 39.990234375, 116.34796142578125, 40.001220703125);

    // for (var k = 0; k < QuadTiles.length; k++) {
    //     QuadTiles[k].update(camera, rects);
    // }
    // console.log(rects.length);
    // for (var ii = 0; ii < rects.length; ii++) {
    //     instances.push(
    //         new Cesium.GeometryInstance({
    //             geometry: new Cesium.RectangleOutlineGeometry({
    //                 rectangle: Cesium.Rectangle.fromDegrees(rects[ii].west, rects[ii].south, rects[ii].east, rects[ii].north),
    //                 height:0.1
    //             }),
    //             attributes: {
    //                 color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED.withAlpha(0.2)),
    //
    //             }
    //         })
    //     )
    // }
    // viewer.scene.primitives.add(new Cesium.Primitive({
    //     geometryInstances: instances,
    //     asynchronous : false,
    //     appearance: new Cesium.PerInstanceColorAppearance({
    //         flat: true,
    //         translucent: true,
    //         //color: Cesium.Color.BLUE,
    //         renderState: {
    //             lineWidth: Math.min(4.0, viewer.scene.maximumAliasedLineWidth)
    //         }
    //     })
    // }))


    //let oldCell1,oldCell2,oldCell3,oldCell4,oldCell5;
    let oldCell1=[0,0],oldCell2=[0,0],oldCell3=[0,0],oldCell4=[0,0],oldCell5=[0,0];

    function dispBuffer(L,B,level){
        // var deltaL=(L2-L1)/(1<<level);
        // var deltaB=(B1-B2)/(1<<level);
        var j=Math.floor((L-L1)/deltaL);
        var i=Math.floor((B1-B)/deltaB);

        var LL=L1+j*deltaL;
        var BB=B1-i*deltaB;

        //var lineAlpha=0.4;

        if(LL && BB ) {

            //if not found
            //add new entity
            if(i_t == i && j_t==j) return;
            else{
                //create new entiry
                //console.log(LL+" "+BB);
                //viewer.entities.removeAll();
                var c1 = viewer.entities.add({
                    //id: String.valueOf(i*10000+j),
                    //name: 'Cell',
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([
                            LL, BB - deltaB, LL + deltaL, BB - deltaB, LL + deltaL, BB, LL, BB]),
                        material: Cesium.Color.RED.withAlpha(0.8)
                        //outline: true,
                        //outlineColor: Cesium.Color.BLACK
                    }
                });

                var c2 = viewer.entities.add({
                    name: 'Red box on surface',
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([
                            LL - deltaL, BB - 2 * deltaB, LL + 2 * deltaL, BB - 2 * deltaB, LL + 2 * deltaL, BB + deltaB, LL - deltaL, BB + deltaB]),
                        material: Cesium.Color.GOLD.withAlpha(0.6)
                        //outline: true,
                        //outlineColor: Cesium.Color.BLACK
                    }
                });
                // //////////--------------81 neighboor------------/////////////////////////////////
                var c3= viewer.entities.add({
                    name: 'Red box on surface',
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([
                            LL - 4*deltaL, BB - 5 * deltaB, LL + 5 * deltaL, BB - 5 * deltaB, LL + 5 * deltaL, BB + 4*deltaB, LL - 4*deltaL, BB + 4*deltaB]),
                        material: Cesium.Color.GOLD.withAlpha(0.4)
                        //outline: true,
                        //outlineColor: Cesium.Color.BLACK
                    }
                });
                // //////////--------------243 neighboor------------/////////////////////////////////
                var c4 = viewer.entities.add({
                    name: 'Red box on surface',
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([
                            LL - 13*deltaL, BB - 14 * deltaB, LL + 14 * deltaL, BB - 14 * deltaB, LL + 14 * deltaL, BB + 13*deltaB, LL - 13*deltaL, BB + 13*deltaB]),
                        material: Cesium.Color.GOLD.withAlpha(0.3)
                        //outline: true,
                        //outlineColor: Cesium.Color.BLACK
                    }
                });

                ///////////////////------------------2187 Neighboor---------------///////////////////////

                var c5 = viewer.entities.add({
                    name: 'Red box on surface',
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([
                            LL - 40*deltaL, BB - 41 * deltaB, LL + 41 * deltaL, BB - 41 * deltaB, LL + 41 * deltaL, BB + 40*deltaB, LL - 40*deltaL, BB + 40*deltaB]),
                        material: Cesium.Color.GOLD.withAlpha(0.2)
                        //outline: true,
                        //outlineColor: Cesium.Color.BLACK
                    }
                });
                if(oldCell1){
                    viewer.entities.remove(oldCell1);
                    viewer.entities.remove(oldCell2);
                    viewer.entities.remove(oldCell3);
                    viewer.entities.remove(oldCell4);
                    viewer.entities.remove(oldCell5);
                }

                oldCell1=c1;    oldCell2=c2;    oldCell3=c3;    oldCell4=c4;    oldCell5=c5;
            }

            i_t=i;  j_t=j;
        }
    }

    function taxi_start(){
        viewer.clock.canAnimate=true;
        viewer.clock.shouldAnimate=true;
        handler.setInputAction(function(movement) {
        cartesian =   viewer.camera.pickEllipsoid(movement.position, ellipsoid);//movement.endPosition
        if (cartesian) {
            //将笛卡尔坐标转换为地理坐标
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
            latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
            //获取相机高度
            //
            //mouse_state.innerText = 'LEFT_CLICK：(' + longitudeString + ', ' + latitudeString + "," + height + ')';
        }else {
            //mouse_state.innerText = '';
        }

        var pick=viewer.scene.pick(movement.position);
        if(Cesium.defined(pick)){
            //console.log("ID: "+pick.id.name+"No. "+parseInt(pick.id.id));
            // console.log("picked id:"+parseInt(pick.id.id));
            // console.log("type of id: "+ typeof(parseInt(pick.id.id)));
            var newID=parseInt(pick.id.id)
            if(pickedId!=newID){
                pickedId=newID
                //console.log(pickedId);
                // clearEntities();
                trackingAndDisplay(newID);
            }
        }
        else{
            startTracking=false;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK );
    }

    let oldI=0,oldJ=0;

    var oldCar=[0,0,0,0,0,0,0];
    function dispCar(L,B,level,id) {
        //level=8;
        // var deltaL=(L2-L1)/(1<<level);
        // var deltaB=(B1-B2)/(1<<level);
        var j=Math.floor((L-L1)/deltaL);
        var i=Math.floor((B1-B)/deltaB);

        var LL=L1+j*deltaL;
        var BB=B1-i*deltaB;


        if(LL && BB) {
            //console.log(LL+" "+BB+" "+i+" "+j+" "+deltaL+" "+deltaB );
            if(oldI == i && oldJ == j) return;
            else {
                //viewer.entities.removeAll();
                var t = viewer.entities.add({
                    name: 'Red box on surface',
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([
                            LL - 4*deltaL, BB - 5 * deltaB, LL + 5 * deltaL, BB - 5 * deltaB, LL + 5 * deltaL, BB + 4*deltaB, LL - 4*deltaL, BB + 4*deltaB]),
                        material: Cesium.Color.RED.withAlpha(0.6)
                        //outline: true,
                        //outlineColor: Cesium.Color.BLACK
                    }
                });
                if(oldCar[id]) viewer.entities.remove(oldCar[id]);
                oldCar[id]=t;
            }
            oldI = i;    oldJ = j;
        }
    }
    let oldCarInBuffer=0;
    let CarsInBuffer=0;

    //检测当前进入缓冲区的车辆
    function dispCarInBuffer(L,B,level,x,t) {
        CarsInBuffer=0;
        for(var i=0;i<IDs.length;i++){
            if(i == x) continue;
            var LB=getLBbyTimePoint(t,i);

            if((Math.abs(LB[0]-L)<40*deltaL) && (Math.abs(LB[1]-B)<40*deltaB)){
                //console.log(deltaL+" "+deltaB+" " +Math.abs(LB[0]-L) +" "+ Math.abs(LB[1]-B));
                CarsInBuffer++;
                dispCar(LB[0],LB[1],level,i);
            }
            else{
                //console.log(Math.abs(LB[0]-L) +" "+ Math.abs(LB[1]-B));
            }
        }
        if(CarsInBuffer != oldCarInBuffer){
            viewer.entities.removeAll();
            console.log(CarsInBuffer);
        }
        oldCarInBuffer=CarsInBuffer;
    }
