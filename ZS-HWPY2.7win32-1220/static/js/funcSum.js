// 获取页面参数，post给后端，后端再将计算结果传回前端
$('#searchbtn').click(function () {
   var data=JSON.stringify($('#dismeature').serializeArray())
    $.ajax({
        url:'/result/',
        type:"POST",
        data:data,
        dataType:"json",
        success:function(dis_jsn){//data_jsn为后端返回的结果
            $(this).val(""); //清空上次input框里的数据
            $('#disResult').val(dis_jsn['distance']);  //往textarea框里传结果
        }
    });

});
$('#Ang_searchbtn').click(function () {
   var data=JSON.stringify($('#Angmeature').serializeArray())
    $.ajax({
        url:'/ang_result/',
        type:"POST",
        data:data,
        dataType:"json",
        success:function(Ang_jsn){//data_jsn为后端返回的结果
            $(this).val(""); //清空上次input框里的数据
            $('#AngResult').val(Ang_jsn['angle']);  //往textarea框里传结果
        }
    });
});
$('#Code2Mtn_searchbtn').click(function () {
   var data=JSON.stringify($('#Code2Mtn').serializeArray());
    $.ajax({
        url:'/LB2Code_result/',
        type:"POST",
        data:data,
        dataType:"json",
        success:function(code_jsn){//data_jsn为后端返回的结果
            $(this).val(""); //清空上次input框里的数据
            $('#Code2MtnResult').val(code_jsn['code']);  //往textarea框里传结果
        }
    });

});
$('#neaSearch_btn').click(function () {
   var data=JSON.stringify($('#neaSearch').serializeArray());
   console.log(data);
    $.ajax({
        url:'/neaSearch_result/',
        type:"POST",
        data:data,
        dataType:"json",
        success:function(nea_jsn){//data_jsn为后端返回的结果
            $('#neaCode').val("").focus(); //清空上次input框里的数据
            $('#neaSearch_Result').val(nea_jsn['nearSearch']);  //往textarea框里传结果
        }
    });

});