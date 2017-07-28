var userCode = UserInfo.getUserInfo().userCode,
	pageSize = 2;

var S_Material_Page = new function() {
	//显示各个div的暂无数据
	function showNullDiv(index) {
		if(index == 1){
			$("#grade_loading").css('display', 'none');
			$("#grade_box").css('display', 'none');
			$("#grade_null").css('display', 'block');
		}
		if(index == 2){
			$("#medal_loading").css('display', 'none');
			$("#medal_box").css('display', 'none');
			$("#medal_null").css('display', 'block');
		}
		if(index == 3){
			$("#other_loading").css('display', 'none');
			$("#other_box").css('display', 'none');
			$("#other_null").css('display', 'block');
		}
	}
	
	//显示各个div的loading
	function showLoadingDiv(index) {
		if(index == 1){
			$("#grade_box").css('display', 'none');
			$("#grade_null").css('display', 'none');
			$("#grade_loading").css('display', 'block');
		}
		if(index == 2){
			$("#medal_box").css('display', 'none');
			$("#medal_null").css('display', 'none');
			$("#medal_loading").css('display', 'block');
		}
		if(index == 3){
			$("#other_box").css('display', 'none');
			$("#other_null").css('display', 'none');
			$("#other_loading").css('display', 'block');
		}
	}
	
	//显示各个div有值
	function showValueDiv(index) {
		if(index == 1){
			$("#grade_loading").css('display', 'none');
			$("#grade_box").css('display', 'block');
		}
		if(index == 2){
			$("#medal_loading").css('display', 'none');
			$("#medal_box").css('display', 'block');
		}
		if(index == 3){
			$("#other_loading").css('display', 'none');
			$("#other_box").css('display', 'block');
		}
	}
	
	return {
		
		//查询资料/应用接口
		getResourceUpload : function(pageIndex, init) {
			
			var index = $(".G-HeadUl .choose").index() + 1,
				subjectId = "",
				sTime = "",
		    	eTime = "";
			
	    		if(index == 1){
	    			
	    			subjectId = $("#grade_subject").val();
	    			
	    			sTime = $("#sTime_grade").val();
	    			
					eTime = $("#eTime_grade").val();
	    		}else if(index == 3){
	    			
	    			subjectId = $("#other_subject").val();
	    			
	    			sTime = $("#sTime_other").val();
	    			
					eTime = $("#eTime_other").val();
	    		}
	    		
			var data = {
					'appKey' : 'FHCC_WEB',
					'userCode' : userCode,
//					'userCode' : 'stu11',
					'subjectId' : subjectId,
					'resType' : index,
					'uploadWay' : "0",
					'pageindex' : pageIndex + 1,
					'pageSize' : pageSize,
					'startTime' : sTime,
					'endTime' : eTime,
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
					showLoadingDiv(index);
	    	    },
				success : function(result) {
					showValueDiv(index);
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					var totalPage = json_data.totalPage;
					if(success == "S"){
						var resource = json_data.resource;
						console.log(resource);
						if(resource == null || resource == undefined || resource == "") {
							showNullDiv(index);
							return;
						}else{
							if(index == 1){
								$("#grade_box").empty();
								$.each(resource,function(index,item){
									var div = '<div class="boxList">' +
			                    				'<div class="list-name">'+ item.resName +'</div>' +
			                    				'<div class="list-done">' +
			                    					'<a href="'+ item.resPath +'" class="icon-material2 icon-download" download="grade" title="下载"></a>' +
			                    				'</div>' +
			                    				'<div class="list-info"><span class="info-time">发布者：'+ item.userName +'</span><span class="info-size">发布时间：'
			                    				+ new Date(item.uploadTime).format("yyyy年M月d日   hh:mm") +'</span></div>' +
			                    			'</div>';
									$("#grade_box").append(div);
								});
								
								if(init == true){
									
									$("#gradePagination").pagination(totalPage*pageSize, {
						                items_per_page      : pageSize,
						                current_page        : pageIndex,
						                num_display_entries : 4, 
						                ellipse_text        : "...",
						                num_edge_entries    : 2,  
						                prev_text           : "上一页",  
						                next_text           : "下一页",
						                load_first_page     : false,
						                callback            : S_Material_Page.getResourceUpload
						             });
								}
							}
							if(index == 3){
								$("#other_box").empty();
								$.each(resource,function(index,item){
									var div = '<div class="boxList">' +
												  '<div class="list-name">'+ item.resName +'</div>' +
												  '<div class="list-done">' +
													  '<a href="'+ item.resPath +'" class="icon-material2 icon-download" download="grade" title="下载"></a>' +
												  '</div>' +
												  '<div class="list-info"><span class="info-time">发布者：'+ item.userName +'</span><span class="info-size">发布时间：'
				                    			  + new Date(item.uploadTime).format("yyyy年M月d日  hh:mm") +'</span></div>' +
											  '</div>';
									$("#other_box").append(div);
								});
								
								if(init == true){
									
									$("#otherPagination").pagination(totalPage*pageSize, {
						                items_per_page      : pageSize,
						                current_page        : pageIndex,
						                num_display_entries : 4, 
						                ellipse_text        : "...",
						                num_edge_entries    : 2,  
						                prev_text           : "上一页",  
						                next_text           : "下一页",
						                load_first_page     : false,
						                callback            : S_Material_Page.getResourceUpload
						             });
								}
							}
						}
					}else{
						showNullDiv(index);
					}
				},
				error : function(result) {
					console.log(result);
					showNullDiv(index);
				}
			});
		},
		
		//查询奖章
		getStudentScore : function(pageIndex, init) {
			var subjectId = $("#medal_subject").val(),
				sTime = $("#sTime_medal").val(),
	    		eTime = $("#eTime_medal").val(),
	    		index = $(".G-HeadUl .choose").index() + 1;;
			
			var data = {
		    		'appKey' : 'FHCC_WEB',
					'userCode' : userCode,
//					'userCode' : 'stu11',
					'pageindex' : pageIndex + 1,
					'pageSize' : pageSize,
					'startTime' : sTime,
					'endTime' : eTime,
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
		    };
	    	
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getStudentScore.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					showLoadingDiv(index);
	    	    },
				success : function(result) {
					showValueDiv(index);
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					var totalPage = json_data.totalPage;
					if(success == "S"){
						var resource = json_data.statistics;
						console.log(resource);
						if(resource == null || resource == undefined || resource == "") {
							showNullDiv(index);
							return;
						}else{
							if(index == 2){
								resource[0].interactionName = "test";
								resource[0].teacherName = "test";
								resource[0].score = "56";
								resource[0].interactionTime = "2017-06-09 15:30:40";
								$("#medal_box").empty();
								$.each(resource,function(index,item){
									//换算星星,月亮,太阳
									var score = item.score;
									var star = score - ((Math.floor(score/10))*10);
									var moon = (score - ((Math.floor(score/100))*100) - star)/10;
									var sun = (score - ((Math.floor(score/1000))*1000)-(moon*10)-star)/100;
									var div = '<div class="boxList-line">' +
												  '<div class="list-name">'+ item.interactionName +'</div>' +
												  '<div class="list-info"><span class="info-time">发布者：'+ item.teacherName +'</span><span class="info-size">发布时间：'
				                    			  + new Date(item.interactionTime).format("yyyy年M月d日  hh:mm") +'</span></div>' +
												  '<div class="list-done">' +
													  '<div class="doneA">得分：'+ item.score +'</div>' +
													  '<div class="doneB">' +
														  '<i class="icon-material2 icon-sun"></i><i class="icon-material2 icon-chen"></i><span>'+ sun +
														  '</span><i class="icon-material2 icon-moon"></i><i class="icon-material2 icon-chen"></i><span>'+ moon +
														  '</span><i class="icon-material2 icon-star"></i><i class="icon-material2 icon-chen"></i><span>'+ star +'</span>' +
													  '</div>' +
												  '</div>' +
											  '</div>';
									$("#medal_box").append(div);
								});
								
								if(init == true){
									
									$("#applyPagination").pagination(totalPage*pageSize, {
						                items_per_page      : pageSize,
						                current_page        : pageIndex,
						                num_display_entries : 4, 
						                ellipse_text        : "...",
						                num_edge_entries    : 2,  
						                prev_text           : "上一页",  
						                next_text           : "下一页",
						                load_first_page     : false,
						                callback            : S_Material_Page.getStudentScore
						             });
								}
							}
						}
					}else{
						showNullDiv(index);
					}
				},
				error : function(result) {
					console.log(result);
					showNullDiv(index);
				}
			});
		}
	}
}();

$(function() {
	var userCode = UserInfo.getUserInfo().userCode;
	var $user = $.parseJSON(UserInfo.getUserInfo().user);
	var cc_subject = cookie.getCookie("cc_subject");
	var subject = cc_subject ? $.parseJSON(cc_subject) : "";
	
	$("#grade_subject").empty();
	$("#grade_subject").append('<option value="">全部学科</option>');
	$("#medal_subject").empty();
	$("#medal_subject").append('<option value="">全部学科</option>');
	$("#other_subject").empty();
	$("#other_subject").append('<option value="">全部学科</option>');
	$.each(subject,function(index,item){
		var option = '<option value="'+ item.subjectId +'">'+ item.subjectName +'</option>';
		$("#grade_subject").append(option);
		$("#medal_subject").append(option);
		$("#other_subject").append(option);
	});
	/*var data = {
			'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
//			'userCode' : 'stu11',
			'subjectId' : null,
			'resType' : "1",
			'uploadWay' : "0",
			'pageindex' : "1",
			'pageSize' : "12",
//			'startTime' : "2017-01-07 12:00:00",
//			'endTime' : new Date().format("yyyy-MM-dd hh:mm:ss"),
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	var subjectId = $("#grade_subject").val();
	data.subjectId = subjectId;
	var sTime = $("#sTime_grade").val();
	var eTime = $("#eTime_grade").val();
	data.startTime = sTime;
	data.endTime = eTime;*/
	//获取成绩单列表
	S_Material_Page.getResourceUpload(0, true);
})