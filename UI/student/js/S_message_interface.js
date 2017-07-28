var S_Message_Page = new function() {
	var userCode = UserInfo.getUserInfo().userCode,
		classId = $.parseJSON(UserInfo.getUserInfo().user).classId,
		pageSize = 12;
	
	//获取查询参数
	function getQueryParam(pageIndex) {
		var data = null;
		if($("input[name='sel-type']:checked").val() == 'time') {
			var s_time = $("#s-Time").val();
			var e_time = $("#e-Time").val();
			//按照时间查询
			data = {
					'appKey' : 'FHCC_WEB',
					'userCode' : userCode,
					'classId' : classId,
					'title' : null,
					'startTime' : s_time,
					'endTime' : e_time,
					'pageindex' : pageIndex + 1,
					'pageSize' : pageSize,
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
			};
			return data;
		}
		if($("input[name='sel-type']:checked").val() == 'keyWord') {
			var key_word = $("#keyWordQuery").val();
			data = {
					'appKey' : 'FHCC_WEB',
					'userCode' : userCode,
					'classId' : classId,
					'title' : key_word,
					'pageindex' : pageIndex + 1,
					'pageSize' : pageSize,
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
			};
			return data;
		}
	}
	
	return {
		
		getMessageByTeacher : function(data, pageIndex, init) {//教师查看自己发布的消息
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getMessageByTeacher.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#messageNull").css('display', 'none');
	    	        $("#messageLoading").css({display:'block'});
	    	    },
				success : function(result) {
					$("#messageLoading").css({display:'none'});
					var json_data = $.parseJSON(result.result);
//					console.log(json_data);
					var success = json_data.state;
					var totalPage = json_data.totalPage;
					if(success == "S"){
						var messages = json_data.message;
						if(messages == null || messages == undefined || messages == "") {
							$("#m-listBody").css('display', 'none');
						    $("#messageNull").css('display', 'block');
							return;
						}
						$("#m-listBody").children("li").remove();
						//$("#pageTool").empty();
						$("#m-listBody").css('display', 'block');
					    $("#messageNull").css('display', 'none');
						$.each(messages,function(index,item){
							var li = "";
							if(!item.isRead){
								li = "<li class='no-read'>";
							}else{
								li = "<li>";
							}
							li += "<div class='m-listCont' id=msg_"+ item.msgId +">" +
											"<h4 id=msg_h_"+ item.msgId +" >" + item.title + "</h4>" +
											"<p id=msg_p_"+ item.msgId +">" + item.msgContent + "</p>" +
											"<div id=msg_d_"+ item.msgId +">" +
												"发布者：<span>" + item.crStffName + "</span>  发布时间：<span>" + new Date(item.creatTime).format('yyyy年M月d日    hh:mm') + "</span>" +
											"</div>" +
										"</div><i class='point-sign'></i>" +
									"</li>";
							$("#m-listBody").append(li);
						});
						
						if(init == true){
							
							$("#messagePagination").pagination(totalPage*pageSize, {
				                items_per_page      : pageSize,
				                current_page        : pageIndex,
				                num_display_entries : 4, 
				                ellipse_text        : "...",
				                num_edge_entries    : 2,  
				                prev_text           : "上一页",  
				                next_text           : "下一页",
				                load_first_page     : false,
				                callback            : S_Message_Page.queryMessage
				             });
						}
						
						/*if(totalPage <= 1) {
							$(".m-page").css('display', 'none');
							return;
						}
						var page_div = "<li><a>&laquo;</a></li>";
						$("#pageTool").append(page_div);
						for(var i = 1; i <= totalPage; i++){
							page_div = "<li><a>" + i + "</a></li>";
							$("#pageTool").append(page_div);
						}
						page_div = "<li><a>&raquo;</a></li>";
						$("#pageTool").append(page_div);
						$(".m-page").css('display', 'block');*/
					}else{
						$("#m-listBody").css('display', 'none');
					    $("#messageNull").css('display', 'block');
					}
				},
				error : function(result) {
					$("#messageLoading").css({display:'none'});
					$("#m-listBody").css('display', 'none');
				    $("#messageNull").css('display', 'block');
				}
			});
		},
		
		//查询消息
		queryMessage : function(pageIndex, init){
			
			var data = getQueryParam(pageIndex);
			
			S_Message_Page.getMessageByTeacher(data, pageIndex, init);
		},
		
		//学生已读消息
		setMessageRead :　function(msgId){
			var data = {
					'appKey' : 'FHCC_WEB',
					'userCode' : userCode,
					'msgId' : msgId,
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
			};
			$.ajax({
				type : "post",
				async : true,//设置成同步
				url : "/CloudClassroom/setMessageRead.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				success : function(result) {
					var json_data = $.parseJSON(result.result);
				},
				error : function(result) {
					var json_data = $.parseJSON(result.result);
					console.log(json_data.status+":"+json_data.errorMsg);
				}
			});
		}
	}
}();

$(function() {
	var data = {
			'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
			'classId' : classId,
			'title' : "",
			'pageindex' : pageIndex + 1,
			'pageSize' : pageSize,
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	
	//获取消息列表
	S_Message_Page.queryMessage(0, true);
	
	//查询消息
	$("#m-query").click(function(){
		
		S_Message_Page.queryMessage(0, true);
	});
	
})