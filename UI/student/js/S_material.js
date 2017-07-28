//去除a标签点击后的虚线框
 $('a').bind("focus", function(){$(this).blur();});
// 内容部分导航栏的切换
$('.G-HeadUl>li').click(function(){
	$('.G-HeadUl>li').removeClass("choose");
    $('.G-HeadUl>li').css({borderBottom:'#ffffff 0px solid',color:'#999999'});
    $(this).css({borderBottom:'#4aaaf4 2px solid',color:'#4aaaf4'});
    $(this).addClass("choose");
    var myId=$(this).attr('data-id');
    $(".G-body>div").css({display:'none'});
    $("#" + myId).css({display:'block'});
    var userCode = UserInfo.getUserInfo().userCode;
    var data = {
    		'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
//			'userCode' : 'stu11',
			'uploadWay' : "0",
			'pageindex' : "1",
			'pageSize' : "12",
//			'startTime' : "2017-01-07 12:00:00",
//			'endTime' : new Date().format("yyyy-MM-dd hh:mm:ss"),
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
    };
    /*if(myId == "gradeTab") {
    	data.subjectId = $("#grade_subject").val();
    	data.resType = '1';
    	var sTime = $("#sTime_grade").val();
    	var eTime = $("#eTime_grade").val();
    	data.startTime = sTime;
    	data.endTime = eTime;
    	//获取成绩单列表  1
    	S_Material_Page.getResourceUpload(data,1);
    }*/
	if(myId == "applyTab") {
		//获取奖章列表  2
		S_Material_Page.getStudentScore(0, true);
	}
	if(myId == "otherTab") {
		
		S_Material_Page.getResourceUpload(0, true);
	}
});

//初始化日期选择器
$('.form_date').datetimepicker({
    language: 'zh-CN',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
});

//设置日期输入框的默认值为当天
$("#sTime_grade").attr("value", new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"));
$("#eTime_grade").attr("value", new Date().format("yyyy-MM-dd"));

$("#sTime_medal").attr("value", new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"));
$("#eTime_medal").attr("value", new Date().format("yyyy-MM-dd"));

$("#sTime_other").attr("value", new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"));
$("#eTime_other").attr("value", new Date().format("yyyy-MM-dd"));

//查询成绩单
function queryGradeFun(){
	
	//获取成绩单列表
	S_Material_Page.getResourceUpload(0, true);
}

//成绩单学科变化事件
$("#grade_subject").change(function(){
	queryGradeFun();
});

//成绩单查询按钮事件
$("#grade_query").click(function(){
	queryGradeFun();
});

//查询奖章
function queryMedalFun(){
	/*var subjectId = $("#medal_subject").val();
	var data = {
    		'appKey' : 'FHCC_WEB',
			'userCode' : UserInfo.getUserInfo().userCode,
			'pageindex' : "1",
			'pageSize' : "12",
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
    };
	data.subjectId = subjectId;
	var sTime = $("#sTime_medal").val();
	var eTime = $("#eTime_medal").val();
	data.startTime = sTime;
	data.endTime = eTime;*/
	//获取成绩单列表
	S_Material_Page.getStudentScore(0, true);
}

//奖章学科变化事件
$("#medal_subject").change(function(){
	queryMedalFun();
});

//奖章查询按钮事件
$("#medal_query").click(function(){
	queryMedalFun();
});

//查询其他
function queryOtherFun(){
	
	//获取成绩单列表
	S_Material_Page.getResourceUpload(0, true);
}

//其他学科变化事件
$("#other_subject").change(function(){
	queryOtherFun();
});

//其他查询按钮事件
$("#other_query").click(function(){
	queryOtherFun();
});

