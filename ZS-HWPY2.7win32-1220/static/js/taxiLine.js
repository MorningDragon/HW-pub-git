function showtaxiLine() {

    $('#removelineDiv').css({"display":"block"});
    var line1,line2,line3,line4,line5;

 $.get('../static/data/0919result_similarity_final.txt',function(data) {
     // $.get('../static/data/xiangsilinjin/similarity.txt',function(data) {
     var data1=[],data2=[],data3=[],data4=[],data5=[],d1=0,d2=0,d3=0,d4=0,d5=0;
     var l = data.split("\r\n");   //按回车键拆分
     for (var i = 0; i < l.length; i++) {
         var lineArr = l[i].trim().split(/\s+/);//每行是一个数组
         // if ((parseFloat(lineArr[1])>tempExtent.xmin&&parseFloat(lineArr[1])<tempExtent.xmax)&&(parseFloat(lineArr[2])>tempExtent.ymin&&parseFloat(lineArr[2])<tempExtent.ymax)){
         if (lineArr[0] == 5644573) {
             data1.push(lineArr[3]);data1.push(lineArr[4]);
         }
         else if (lineArr[0] == 5767454) {
             data2.push(lineArr[3]);data2.push(lineArr[4]);
         }
         else if (lineArr[0] == 5664583) {
             data3.push(lineArr[3]);data3.push(lineArr[4]);
         }
         else if (lineArr[0] == 5637415) {
             data4.push(lineArr[3]);data4.push(lineArr[4]);
         }
         else if (lineArr[0] == 5633482) {
             data5.push(lineArr[3]);data5.push(lineArr[4]);
         }
     }


      line1 = viewer.entities.add({
         id : 'line1',
         polyline : {
             positions : Cesium.Cartesian3.fromDegreesArray(data1),
             width :5,
             material : Cesium.Color.BLUE.withAlpha(0.5),
             clampToGround : false,
             show:true
         }
     });

     line2 = viewer.entities.add({
         id : 'line2',
         polyline : {
             positions : Cesium.Cartesian3.fromDegreesArray(data2),
             width :5,
             material : Cesium.Color.BLUE.withAlpha(0.5),
             clampToGround : false,
             show:true
         }
     });

      line3 = viewer.entities.add({
         id : 'line3',
         polyline : {
             positions : Cesium.Cartesian3.fromDegreesArray(data3),
             width :5,
             material : Cesium.Color.BLUE.withAlpha(0.5),
             clampToGround : false,
             show:true
         }
     });

      line4 = viewer.entities.add({
         id : 'line4',
         polyline : {
             positions : Cesium.Cartesian3.fromDegreesArray(data4),
             width :5,
             material : Cesium.Color.BLUE.withAlpha(0.5),
             clampToGround : true,
             show:true
         }
     });

      line5 = viewer.entities.add({
         id : 'line5',
         polyline : {
             positions : Cesium.Cartesian3.fromDegreesArray(data5),
             width :5,
             material : Cesium.Color.BLUE.withAlpha(0.5),
             clampToGround : true,
             show:true
         }
     });

 });

    var animationObj = {
        stepsRange: {
            start: 0,
            end: 100,
        },
        trails: 20,
        duration: 750
    };
    var _range = animationObj.stepsRange.end - animationObj.stepsRange.start;
    var entityArray = [];
    var linecolor = new Cesium.Color(53/255,57/255,255/255,0.5);
    var outline = new Cesium.Color(65/255,105/255,225/255, 0.5);
    var color = new Cesium.Color(255/255, 250/255, 250/255, 0.2);

////json
  $.getJSON('../static/data/11085.json',function(data){
      var hash=[];
      var sumdata=[];
      for (var i = 0; i < data.features.length/10; i++) {
          sumdata.push(data.features[i].properties.Field1);
          if(hash.indexOf(data.features[i].properties.Field1)==-1){
              hash.push(data.features[i].properties.Field1);
          }
      }
      var linePos=[];
      var curLineArray=[];
      for (var i=0;i<hash.length;i++){
          for (var j = 0;j<data.features.length;j++){
              if(data.features[j].properties.Field1==hash[i]){
                  x=data.features[j].geometry.coordinates[0];
                  y=data.features[j].geometry.coordinates[1];
                  h=0;
                  var nameid=j-sumdata.indexOf(hash[i]);
                  var entity = viewer.entities.add({
                      position : Cesium.Cartesian3.fromDegrees(x,y,h),
                      nameID:nameid,
                      // billboard :{
                      //     image : './images/lightPoint.png',
                      //     width:7,
                      //     height:7,
                      //     color : color
                      // }
                  });
                  entity.isAvailable = function(obj){
                      return function(currentTime){
                          if (!Cesium.defined(currentTime)) {
                              throw new Cesium.DeveloperError('time is required.');
                          }
                          var nMS = Cesium.JulianDate.toDate(currentTime).getTime()/animationObj.duration;
                          var time = (nMS%_range + animationObj.stepsRange.start);

                          var trails = trails || 10;
                          if (time && obj.nameID > time - trails && obj.nameID < time) {
                              obj.billboard.color._value.alpha = 0.8*(obj.nameID - time + trails)/trails;
                              return true;
                          } else {
                              return false;
                          }
                      }
                  }(entity);
                  entityArray.push(entity);
                  linePos.push(x);
                  linePos.push(y);
                  linePos.push(h);

              }
          }
          curLineArray[i] = viewer.entities.add({
              polyline : {
                  positions : Cesium.Cartesian3.fromDegreesArrayHeights(linePos),
                  width : 5,
                  material : new Cesium.PolylineOutlineMaterialProperty({
                      color : linecolor,
                      outlineWidth : 0.1,
                      outlineColor : outline
                  })
              }
          });
          linePos=[]
      }
  });




    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(116.4350 ,39.9500,800.0), //摄像机的最终位置
        duration: 5,                           //飞行所用时间
        maximumHeight: 200000,                  //飞行高峰时的最大高度。
        pitchAdjustHeight: 3500,               //如果摄像机的飞行高于此值，请调整俯仰航向以降低俯仰，并将地球保持在视野中
        orientation: {
            heading: Cesium.Math.toRadians(30),
            pitch: Cesium.Math.toRadians(-35),
            roll: 0.0
        }
    });
    ////点击事件
    // function returnBack(){
    //     line5.polyline.width=3;
    //     line5.polyline.material = Cesium.Color.BLUE;
    //     line4.polyline.material = Cesium.Color.BLUE;
    //     line3.polyline.material = Cesium.Color.BLUE;
    //     line2.polyline.material = Cesium.Color.BLUE;
    //     line1.polyline.material = Cesium.Color.BLUE;
    //     displayBtn.style.display = "none";
    // }

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(movement) {
        var pick = viewer.scene.pick(movement.position);
        if(Cesium.defined(pick) && (pick.id.id === 'line5')) {
            line5.polyline.width=5;
            line5.polyline.material=Cesium.Color.RED;
            line4.polyline.material=Cesium.Color.GREEN;
            line3.polyline.material=Cesium.Color.GREEN;
            line2.polyline.material=Cesium.Color.GREEN;
            line1.polyline.material=Cesium.Color.GREEN;
            // displayBtn.style.display = "block";

        }
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
    $('#removeline').click(
    function remove_line(){
    viewer.dataSources.removeAll();
    viewer.entities.removeAll();
    // viewer.entities.removeById('DQG6');
    $('#removelineDiv').css({"display":"none"})
},
    );