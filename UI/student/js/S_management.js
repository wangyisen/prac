// 内容部分导航栏的切换
$('.G-HeadUl>li').click(function(){
    $('.G-HeadUl>li').css({borderBottom:'#ffffff 0px solid',color:'#999999'})
    $(this).css({borderBottom:'#4aaaf4 2px solid',color:'#4aaaf4'})
    var myId=$(this).attr('data-id')
    $(".G-body>div").css({display:'none'})
    $("#" + myId).css({display:'block'})
    if(myId == "seatingChart"){
    	var data = {
    			'appKey' : 'FHCC_WEB',
    			'classId' : $.parseJSON(UserInfo.getUserInfo().user).classId,
    			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
    	};
    	$.ajax({
    		type : "post",
    		async : true,
    		url : "/CloudClassroom/getNewSeatClass.do",
    		data : {
    			"inparam" : JSON.stringify(data)
    		},
    		dataType : "json",
    		beforeSend: function () {
				//显示加载图标,隐藏数据模块
				$("#seatingChart .loadingTips").show();
				$("#seatingChart .seatCon-seats,#seatingChart .seatCon-null").hide();
		    },
    		success : function(result) {
    			var json_data = $.parseJSON(result.result);
    			console.log(json_data);
    			var success = json_data.status;
    			if(success == "S"){
    				var seat = json_data.seat;
    				if(seat != null && seat != undefined && seat != "") {
    					var line = seat.line;
    					var row = seat.row;
    					var corridor = seat.corridor;
    					var lineData = corridor.lineData;
    					var rowData = corridor.rowData;
    					var student = seat.student;
    					createSeatTable(row,line,rowData,lineData);
    					$.each(student,function(index,item){
    						var valuex = item.row;
    						var valuey = item.line;
    						var valueName = item.userName;
    						var userCode = item.userCode;
    						$("tr[valuex="+ valuex +"] .desk[valuey="+ valuey +"]").attr("value",userCode);
    						$("tr[valuex="+ valuex +"] .desk[valuey="+ valuey +"]").html(valueName);
    					});
    				}
    				//显示加载好的数据,隐藏加载图标,隐藏无数据情况
    				$("#seatingChart .loadingTips,#seatingChart .seatCon-null").hide();
    			}
    		},
    		error : function(result) {
    			console.log(result);
    			$("#seatingChart .loadingTips,#seatingChart .seatCon-seats").hide();
    			$("#seatingChart .seatCon-null").show();
    		}
    	});
    }
});

/** 动态生成座位表的核心方法 */
function createSeatTable(rows,cols,rowsAisle,colsAisle){
	//改写table之前先清空table 清理掉讲台 清理掉过道
	$("#seatDesks").html("");
	$("#seatDesksBox").siblings(".seatDais").remove();
	$("#seatDesksBox .aisleY,#seatDesksBox .aisleX").remove();
	//隐藏暂无座位表
	$("#seatingChart .seatCon-null").hide();
	//显示座位表
	$("#seatingChart .seatCon-seats").show();
	//隐藏选择学生的弹层
	$("#seatNamedBox").hide();
//	var valueRows = $("#rowsInput").attr("donenumber"),
//		valueCols = $("#colsInput").attr("donenumber");
	var valueRows,valueCols;
	var rowsArray = new Array(),
		colsArray = new Array();
	var $rowsCheck = $("#rowsChoseBox .checkedBox"),
		$colsCheck = $("#colsChoseBox .checkedBox");
	var rowsNum = 0,colsNum = 0;
	
	rows?valueRows = rows:valueRows = $("#rowsInput").attr("donenumber");
	cols?valueCols = cols:valueCols = $("#colsInput").attr("donenumber");
	
	//讲台编绘
	$("#seatDesksBox").before('<div class="seatDais"><img src="../../../imgs/pic-dais.png"></div>');
	//生成过道对应数组
	if(rowsAisle){
		rowsArray = rowsAisle;
	}else{
		$rowsCheck.each(function(a){
			if($(this).hasClass("on")){
				rowsArray[rowsNum] = a+1;
				rowsNum++
			}
		});		//rowsArray 存入选择过道的行序列号
	}
	if(colsAisle){
		colsArray = colsAisle;
	}else{
		$colsCheck.each(function(b){
			if($(this).hasClass("on")){
				colsArray[colsNum] = b+1;
				colsNum++
			}
		});		//rowsArray 存入选择过道的列序列号
	}
	//依据行列数生成表格
	var rowsHtml = '',colsHtml = '';
	for(var i=1;i<=valueCols;i++){
		//根据列值生成td
		colsHtml += '<td><a class="desk" valuey='+ i +'></a></td>';
	}
	for(var j=1;j<=valueRows;j++){
		//根据行值生成tr
		rowsHtml += '<tr valuex='+ j +'>'+ colsHtml +'</tr>';
	}
	$("#seatDesks").append(rowsHtml);
	//依据过道序列号修改表格
	for(var y=0;y<colsArray.length;y++){
		//纵向过道修改  此处优先修改过道，避免增加过道时计算出错
		$('a.desk[valuey='+ colsArray[y] +']').width("83px");
		$('a.desk[valuey='+ colsArray[y] +']').parent().width("93px");
	}
	//依据过道序列号添加过道 修改表格
	for(var x=0;x<rowsArray.length;x++){
		var xTop = $("#seatDesks tr[valuex="+ rowsArray[x] +"]").offset().top,
			boxTop = $("#seatDesksBox").offset().top,
			roadTop = xTop - boxTop +"px",
			roadXLeft = $("#seatDesks").offset().left - $("#seatDesksBox").offset().left + "px",
			tableWid = $("#seatDesks").width() + "px";
		//增加过道行
		$("#seatDesks").after('<div class="aisleX" style="top:'+ roadTop +';width:'+ tableWid +';left:'+ roadXLeft +'"></div>');
	}
	for(var y=0;y<colsArray.length;y++){
		var yLeft = $('a.desk[valuey='+ colsArray[y] +']').parent().offset().left,
			boxLeft = $("#seatDesksBox").offset().left,
			roadLeft = yLeft - boxLeft +"px";
		//增加过道列
		$("#seatDesks").after('<div class="aisleY" style="left:'+ roadLeft +'"></div>');
	}
	//关闭编辑座位的弹层
	$("#editSeatTC").animate({"opacity":"0"},800,function(){
		$("#editSeatTC").hide();
	});
}
/** 关闭弹层 */
function closeTcFun(dom){
	$(dom).parents(".TC-div").animate({"opacity":"0"},800,function(){
		$(dom).parents(".TC-div").hide();
	});
}
// 表头默认样式
var now = new Date();
var nowDayOfWeek = now.getDay()
var Rlin=nowDayOfWeek + 1
$('.G-TimeThead th:eq('+ nowDayOfWeek + ')' ).css({backgroundColor: '#61778d'});
$('.G-TimeThead th:eq('+ nowDayOfWeek + ')' ).find('.GLine').css({display:'none'})
$('.G-TimeThead th:eq('+ Rlin + ')' ).find('.GLine').css({display:'none'})

$('.recipes-table-thead th:eq('+ nowDayOfWeek + ')' ).css({backgroundColor: '#61778d'});
$('.recipes-table-thead th:eq('+ nowDayOfWeek + ')' ).find('.RLine').css({display:'none'})
$('.recipes-table-thead th:eq('+ Rlin + ')' ).find('.RLine').css({display:'none'})




//教师表标题栏的hover事件
$('#th-num').hover(function(){
   $('#th-num').css({backgroundColor: '#61778d'});
   $('#th-num p').css({borderRight: 'none'});
   $('#th-lesson p').css({borderLeft: 'none'});
},function(){
   $('#th-num').css({backgroundColor: '#8a9fb2'});
   $('#th-num p').css({borderRight: '1px solid #e2e9f1'});
   $('#th-lesson p').css({borderLeft: '1px solid #e2e9f1'});
});
$('#th-lesson').hover(function(){
   $('#th-lesson').css({backgroundColor: '#61778d'});
   $('#th-num p').css({borderRight: 'none'});
   $('#th-lesson p').css({borderRight: 'none'});
   $('#th-lesson p').css({borderLeft: 'none'});
   $('#th-teacher p').css({borderLeft: 'none'});
},function(){
   $('#th-lesson').css({backgroundColor: '#8a9fb2'});
   $('#th-num p').css({borderRight: '1px solid #e2e9f1'});
   $('#th-lesson p').css({borderRight: '1px solid #e2e9f1'});
   $('#th-lesson p').css({borderLeft: '1px solid #e2e9f1'});
   $('#th-teacher p').css({borderLeft: '1px solid #e2e9f1'});
});
$('#th-teacher').hover(function(){
   $('#th-teacher').css({backgroundColor: '#61778d'});
   $('#th-lesson p').css({borderRight: 'none'});
   $('#th-teacher p').css({borderRight: 'none'});
   $('#th-teacher p').css({borderLeft: 'none'});
   $('#th-tel p').css({borderLeft: 'none'});
},function(){
   $('#th-teacher').css({backgroundColor: '#8a9fb2'});
   $('#th-lesson p').css({borderRight: '1px solid #e2e9f1'});
   $('#th-teacher p').css({borderRight: '1px solid #e2e9f1'});
   $('#th-teacher p').css({borderLeft: '1px solid #e2e9f1'});
   $('#th-tel p').css({borderLeft: '1px solid #e2e9f1'});
});
$('#th-tel').hover(function(){
   $('#th-tel').css({backgroundColor: '#61778d'});
   $('#th-tel p').css({borderLeft: 'none'});
   $('#th-teacher p').css({borderRight: 'none'});
},function(){
   $('#th-tel').css({backgroundColor: '#8a9fb2'});
   $('#th-tel p').css({borderLeft: '1px solid #e2e9f1'});
   $('#th-teacher p').css({borderRight: '1px solid #e2e9f1'});
});

//格局化日期：yyyy-MM-dd
function formatDate(date) {
	var myyear = date.getFullYear();
	var mymonth = date.getMonth() + 1;
	var myweekday = date.getDate();

	if (mymonth < 10) {
		mymonth = "0" + mymonth;
	}
	if (myweekday < 10) {
		myweekday = "0" + myweekday;
	}
	return (myyear + "." + mymonth + "." + myweekday);
}
var now = new Date(); //当前日期 
var nowDayOfWeek = now.getDay(); //今天本周的第几天 
var nowDay = now.getDate(); //当前日 
var nowMonth = now.getMonth(); //当前月 
var nowYear = now.getYear(); //当前年 
nowYear += (nowYear < 2000) ? 1900 : 0; 
// 获得本周的开端日期
function getWeekStartDate() {
	var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
	return formatDate(weekStartDate);
}

// 获得本周的停止日期
function getWeekEndDate() {
	var weekEndDate = new Date(nowYear, nowMonth, nowDay + (5 - nowDayOfWeek));
	return formatDate(weekEndDate);
}
// 设置食谱上的时间
function setRecipesTime() {
	var weekS = getWeekStartDate();
	var weekE = getWeekEndDate();
	$("#recipes-time").html(weekS+"-"+weekE)
}
setRecipesTime();


