    $("#neaSearch_show").click(function () {
        $("#neaSearch_div").css({"display":"block"});
    });
    $("#neaSearch_close").click(function () {
        // $('#neaCode').val("").focus(); //清空上次input框里的数据
        $("#neaSearch_div").css({"display":"none"});
    });
    $("#disMea_show").click(function () {
        $("#disMea_div").css({"display":"block"});
    });
    $("#disMea_close").click(function () {
        $("#disMea_div").css({"display":"none"});
    });
    $("#AngMea_show").click(function () {
        $("#AngMea_div").css({"display":"block"});
    });
    $("#AngMea_close").click(function () {
        $("#AngMea_div").css({"display":"none"});
    });
    $("#Code2Mtn_show").click(function () {
        $("#Code2Mtn_div").css({"display":"block"});
    });
    $("#Code2Mtn_close").click(function () {
        $("#Code2Mtn_div").css({"display":"none"});
    });



    $("#xiangsi-close").click(function () {
        $("#xiangsiDiv").css({"display":"none"});
        $("#Target-trajectory").text("");//相似场景中目标轨迹id
        $("#Similar-trajectories1").text("");$("#Track-similarity1").text("");//相似场景中第一条相似轨迹id，相似度
        $("#Similar-trajectories2").text("");$("#Track-similarity2").text("");//相似场景中第二条相似轨迹id，相似度
        $("#Similar-trajectories3").text("");$("#Track-similarity3").text("");//相似场景中第三条相似轨迹id，相似度
        for(var i = 0;i< viewer.dataSources._dataSources.length; i++){
        // 添加线nameID到数组，
            viewer.dataSources.getByName(viewer.dataSources._dataSources[i]._name)[0].show=true
    }
    });