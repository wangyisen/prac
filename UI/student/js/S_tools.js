//去除a标签点击后的虚线框
 $('a').bind("focus", function(){$(this).blur();});
// 内容部分导航栏的切换
$('.G-HeadUl>li').click(function(){
    $('.G-HeadUl>li').css({borderBottom:'#ffffff 0px solid',color:'#999999'});
    $(this).css({borderBottom:'#4aaaf4 2px solid',color:'#4aaaf4'});
    var myId=$(this).attr('data-id');
    $(".G-body>div").css({display:'none'});
    $("#" + myId).css({display:'block'});
    
    if(myId == "gradeTab"){
    	//非在线应用导入数据
    	getResourceUploadWithOutLine(0, true);
    }
});

var userCode = UserInfo.getUserInfo().userCode,
	pageSize = 12;

// 在线应用导入数据
function getResourceUploadWithOnLine (pageIndex, init) {
	
	$("#appOnline").html("");
	
	//在线应用导入数据
	var data = {
		'appKey' : 'FHCC_WEB',
		'userCode' : userCode,
//		'userCode' : 'stu11',
		'subjectId' : null,
		'resType' : "4",
		'uploadWay' : "1",
		'pageindex' : pageIndex + 1,
		'pageSize' : pageSize,
		'startTime' : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"),
		'endTime' : new Date().format("yyyy-MM-dd"),
		'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	$.ajax({
		type : "post",
		async : true,
		url : "/CloudClassroom/getResourceUpload.do",
		data : {
			"inparam" : JSON.stringify(data)
		},
		dataType : "json",
		beforeSend: function () {
			$("#applyTab .loadingTips").show();
			$("#applyTab .conBody-box,#applyTab .seatCon-null").hide();
			$("#onLinePagination").hide();
	    },
		success : function(result) {
			var json_data = $.parseJSON(result.result),
				onlineApps = json_data.resource;
			if(json_data.status == "S"){
				if(onlineApps.length > 0){
					$("#onLinePagination").show();
					for(var i=0;i<onlineApps.length;i++){
						var appOnline = '';
						appOnline += '<div class="boxList-commend">';
						appOnline += '	<div class="appImg"><img src=\"'+ onlineApps[i].resImgPath +'\" /></div>';
						appOnline += '	<div class="list-name">'+ onlineApps[i].resName +'</div>';
						appOnline += '	<div class="list-info" title="'+ onlineApps[i].description +'" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;width:345px;">'+ onlineApps[i].description +'</div>';
						appOnline += '	<div class="list-done">';
						appOnline += '		<a href=\"'+ onlineApps[i].resPath +'\" class="doneBtn">打开</a>';
						appOnline += '	</div>';
						appOnline += '</div>';
						$("#appOnline").append(appOnline);
					}
					$("#applyTab .loadingTips").remove();
					$("#applyTab .conBody-box").show();
					$("#applyTab .seatCon-null").hide();
					
					if(init == true){
						
						$("#onLinePagination").pagination((json_data.totalPage)*pageSize, {
			                items_per_page      : pageSize,
			                current_page        : pageIndex,
			                num_display_entries : 4, 
			                ellipse_text        : "...",
			                num_edge_entries    : 2,  
			                prev_text           : "上一页",  
			                next_text           : "下一页",
			                load_first_page     : false,
			                callback            : getResourceUploadWithOnLine
			             });
					}
				}else{
					$("#applyTab .seatCon-null").show();
					$("#applyTab .conBody-box,#applyTab .loadingTips").hide();
				}	
			}else{
				$("#applyTab .seatCon-null").show();
				$("#applyTab .conBody-box,#applyTab .loadingTips").hide();
			}
		},
		error : function(result) {
			$("#applyTab .seatCon-null").show();
			$("#applyTab .conBody-box,#applyTab .loadingTips").hide();
		}
	});
};

//非在线应用导入数据
function getResourceUploadWithOutLine (pageIndex, init) {
	$("#appOutline").html("");
	
	var data = {
			'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
//			'userCode' : 'stu11',
			'subjectId' : null,
			'resType' : "5",
			'uploadWay' : "1",
			'pageindex' : pageIndex + 1,
			'pageSize' : pageSize,
			'startTime' : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"),
			'endTime' : new Date().format("yyyy-MM-dd"),
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	$.ajax({
		type : "post",
		async : true,
		url : "/CloudClassroom/getResourceUpload.do",
		data : {
			"inparam" : JSON.stringify(data)
		},
		dataType : "json",
		beforeSend: function () {
			$("#gradeTab .loadingTips").show();
			$("#gradeTab .conBody-box,#applyTab .seatCon-null").hide();
			$("#outlinePagination").hide();
	    },
		success : function(result) {
			var json_data = $.parseJSON(result.result),
				onlineApps = json_data.resource;
			if(json_data.status == "S"){
				if(onlineApps.length > 0){
					$("#outlinePagination").show();
					for(var i=0;i<onlineApps.length;i++){
						var appOutline = '';
						appOutline += '<div class="boxList-commend">';
						appOutline += '	<div class="appImg"><img src=\"'+ onlineApps[i].resImgPath +'\" /></div>';
						appOutline += '	<div class="list-name">'+ onlineApps[i].resName +'</div>';
						appOutline += '	<div class="list-info" title="'+ onlineApps[i].description +'" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;width:345px;">'+ onlineApps[i].description +'</div>';
						appOutline += '	<div class="list-done">';
						appOutline += '		<a href=\"'+ onlineApps[i].resPath +'\" class="doneBtn">下载</a>';
						appOutline += '	</div>';
						appOutline += '</div>';
						$("#appOutline").append(appOutline);
					}
					$("#gradeTab .loadingTips").remove();
					$("#gradeTab .conBody-box").show();
					$("#gradeTab .seatCon-null").hide();
					
					if(init == true){
						
						$("#outlinePagination").pagination((json_data.totalPage)*pageSize, {
			                items_per_page      : pageSize,
			                current_page        : pageIndex,
			                num_display_entries : 4, 
			                ellipse_text        : "...",
			                num_edge_entries    : 2,  
			                prev_text           : "上一页",  
			                next_text           : "下一页",
			                load_first_page     : false,
			                callback            : getResourceUploadWithOutLine
			             });
					}
				}else{
					$("#gradeTab .seatCon-null").show();
					$("#gradeTab .conBody-box,#gradeTab .loadingTips").hide();
				}	
			}else{
				$("#gradeTab .seatCon-null").show();
				$("#gradeTab .conBody-box,#gradeTab .loadingTips").hide();
			}
			
		},
		error : function(result) {
			$("#gradeTab .seatCon-null").show();
			$("#gradeTab .conBody-box,#applyTab .loadingTips").hide();
		}
	});
};

$(document).ready(function(){
	
	getResourceUploadWithOnLine(0,true);
});
	