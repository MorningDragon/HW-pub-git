
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
                      // id:id,
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
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (movement) {
            var pick = viewer.scene.pick(movement.position);
            // 获取页面参数，post给后端，后端再将计算结果传回前端
            var clickCode=JSON.stringify(pick.id.id);
            console.log(clickCode);
            $.ajax({
            url:'/trackCodes/',
            type:"POST",
            data:clickCode,
            contentType: 'application/json; charset=UTF-8',
            dataType:"json",
            success:function(codes_jsn){//data_jsn为后端返回的结果
                console.log('后端返回的结果:',codes_jsn);
                drawGridsFromCodes(codes_jsn, Cesium.Color.CYAN, Cesium.Color.RED);
            }
        });
            // console.log(pick.id.id)
//             if (Cesium.defined(pick) && (pick.id.id === 'id')) {
//             console.log(pick.id.id)
//             }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);