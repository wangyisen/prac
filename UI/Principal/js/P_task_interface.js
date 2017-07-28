var P_Task_Page = new function() {
	var userInfo = UserInfo.getUserInfo();
	var userCode = userInfo.userCode;
	var user = $.parseJSON(userInfo.user);
	var schoolId = user.schoolId;
	var sTime = $("#s-Time").val();
	var eTime = $("#e-Time").val();
	
	//根据选择设置查询的时间
	function setDataTime(data) {
		var selType = $("input[name=sel-type]:checked").val();
		if(selType == "single"){
			//天
			data.startTime = $("#Time").val();
			data.endTime = $("#Time").val();
		}else{
			//时间段
			data.startTime = sTime;
			data.endTime = eTime;
		}
	}
	
	return {
		// 获取所有学科
		getSubjects : function(){
			var data = {
				'appKey' : 'FHCC_STUDENT'
			};
			$.ajax({
		        type : "post",
		        async : false,
		        url : "/CloudClassroom/getSubject.do",
		        data : {"inparam" : JSON.stringify(data)},
		        dataType : "json",
		        success : function(result) {
		        	var json_data = $.parseJSON(result.result);
		        	if(json_data.status == "S"){
		        		$.each(json_data.subjectData, function(index, item){
		        			$("#subSel_work").append("<option value='" + item.subjectId + "'>" + item.subjectName + "</option>");
		        			$("#subSel_error").append("<option value='" + item.subjectId + "'>" + item.subjectName + "</option>");
		        		});
		        		$("#subSel_work option:first").prop("selected", 'selected');
		        		$("#subSel_error option:first").prop("selected", 'selected');
		        	}
		        }
			});
		},
		
		// 获取学校下的班级和年级
		getClassInfoBySchoolId : function(){
			var data = {
					'appKey' : 'FHCC_WEB',
					'schoolId' : schoolId,
					'time' : new Date().format("yyyy-MM-dd")
			};
			$.ajax({
		        type : "post",
		        url : "/CloudClassroom/getClassInfoBySchoolId.do",
		        data : {"inparam" : JSON.stringify(data)},
		        dataType : "json",
		        success : function(result) {
		        	var json_data = $.parseJSON(result.result);
		        	if(json_data.status == "S"){
		        		var classData = json_data.classData;
		        		$("#gradeSel_teacher").append("<option value=''>全部年级</option>");
	        			$("#gradeSel_error").append("<option value=''>全部年级</option>");
		        		$.each(classData, function(index, item){
		        			$("#gradeSel_class").append("<option value='" + item.gradeId + "'>" + item.gradeName + "</option>");
		        			$("#gradeSel_teacher").append("<option value='" + item.gradeId + "'>" + item.gradeName + "</option>");
		        			$("#gradeSel_error").append("<option value='" + item.gradeId + "'>" + item.gradeName + "</option>");
		        		});
		        	}
		        }
			});
		},
		
		//作业发布量   按年级统计
		quaryGradePublishWorkCount : function(){
			var data = {
					'schoolId' : "" + schoolId,
					'objectId' : $("#subSel_work").val(), //科目Id
					'startTime' : null,
					'endTime' : null,
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
			};
			
			setDataTime(data);
		
			$.ajax({
				type : "post",
				url : "/CloudClassroom/quaryGradePublishWorkCount.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#grade_loading").css('display', 'block');
					$("#grade_null").css('display', 'none');
					$("#one").css('opacity','0');
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					if(json_data.success){
						if(!json_data.data || json_data.data.length <= 0){
							$("#grade_loading").css('display', 'none');
							$("#grade_null").css('display', 'block');
							$("#one").css('opacity','0');
							return;
						}
						var xName = [];
						var value = [];
						var shadow = [];
						$.each(json_data.data, function(index, item){
							xName.push(item.gradeName);
							value.push(item.publishCount);
							shadow.push("100");
						});
						firstChart.setOption({
							xAxis: {
	                            data: xName
	                        },
	                        series: [{
	                            	name: 'shadowBar',
	                            	data: shadow
	                        	},{
	                            	name: 'valueBar',
	                            	data: value
	                        	}]
						});
					}else{
						$("#grade_loading").css('display', 'none');
						$("#grade_null").css('display', 'block');
						$("#one").css('opacity','0');
					}
				},
				error : function(result) {
					$("#grade_loading").css('display', 'none');
					$("#grade_null").css('display', 'block');
					$("#one").css('opacity','0');
				}
			});
		},
		
		//作业发布量   按班级统计
		quaryClassPublishWorkCount : function(){
			var data = {
					'schoolId' : "" +　schoolId,
					'gradeId' : $("#gradeSel_class").val(),
					'objectId' : $("#subSel_work").val(), //科目Id
					'startTime' : null,
					'endTime' : null,
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
			};
			
			setDataTime(data);
			
			$.ajax({
				type : "post",
				url : "/CloudClassroom/quaryClassPublishWorkCount.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#class_loading").css('display', 'block');
					$("#class_null").css('display', 'none');
					$("#two").css('opacity','0');
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					if(json_data.success){
						if(!json_data.data || json_data.data.length <= 0){
							$("#class_loading").css('display', 'none');
							$("#class_null").css('display', 'block');
							$("#two").css('opacity','0');
							return;
						}
						var xName = [];
						var value = [];
						var shadow = [];
						$.each(json_data.data, function(index, item){
							xName.push(item.className);
							value.push(item.publishCount);
							shadow.push("100");
						});
						secondChart.setOption({
							xAxis: {
	                            data: xName
	                        },
	                        series: [{
	                            	name: 'shadowBar',
	                            	data: shadow
	                        	},{
	                            	name: 'valueBar',
	                            	data: value
	                        	}]
						});
					}else{
						$("#class_loading").css('display', 'none');
						$("#class_null").css('display', 'block');
						$("#two").css('opacity','0');
					}
				},
				error : function(result) {
					$("#class_loading").css('display', 'none');
					$("#class_null").css('display', 'block');
					$("#two").css('opacity','0');
				}
			});
		},
		
		//作业发布量   按学科统计
		quarySubjectPublishWorkCount : function(){
			var data = {
					'schoolId' : "" +　schoolId,
					'gradeId' : $("#gradeSel_class").val(),
					'startTime' : null,
					'endTime' : null,
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
			};
			
			setDataTime(data);
			
			$.ajax({
				type : "post",
				url : "/CloudClassroom/quarySubjectPublishWorkCount.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#subject_loading").css('display', 'block');
					$("#subject_null").css('display', 'none');
					$("#three").css('opacity','0');
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					if(json_data.success){
						if(!json_data.data || json_data.data.length <= 0){
							$("#subject_loading").css('display', 'none');
							$("#subject_null").css('display', 'block');
							$("#three").css('opacity','0');
							return;
						}
						var xName = [];
						var value = [];
						var shadow = [];
						$.each(json_data.data, function(index, item){
							xName.push(item.subjectName);
							value.push(item.publishCount);
							shadow.push("100");
						});
						thirdChart.setOption({
							xAxis: {
	                            data: xName
	                        },
	                        series: [{
	                            	name: 'shadowBar',
	                            	data: shadow
	                        	},{
	                            	name: 'valueBar',
	                            	data: value
	                        	}]
						});
					}else{
						$("#subject_loading").css('display', 'none');
						$("#subject_null").css('display', 'block');
						$("#three").css('opacity','0');
					}
				},
				error : function(result) {
					$("#subject_loading").css('display', 'none');
					$("#subject_null").css('display', 'block');
					$("#three").css('opacity','0');
				}
			});
		},
		
		//作业发布量   按教师统计
		queryTeacherPublishWorkCount : function(){
			var data = {
					'schoolId' : "" +　schoolId,
					'gradeId' : $("#gradeSel_teacher").val(),
					'objectId' : $("#subSel_work").val(),
					'startTime' : null,
					'endTime' : null,
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
			};
			
			setDataTime(data);
			
			$.ajax({
				type : "post",
				url : "/CloudClassroom/queryTeacherPublishWorkCount.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#teacher_loading").css('display', 'block');
					$("#teacher_null").css('display', 'none');
					$("#four").css('opacity','0');
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					if(json_data.success){
						if(!json_data.data || json_data.data.length <= 0){
							$("#teacher_loading").css('display', 'none');
							$("#teacher_null").css('display', 'block');
							$("#four").css('opacity','0');
							return;
						}
						var xName = [];
						var value = [];
						var shadow = [];
						$.each(json_data.data, function(index, item){
							xName.push(item.teacherName);
							value.push(item.publishCount);
							shadow.push("100");
						});
						fourChart.setOption({
							xAxis: {
	                            data: xName
	                        },
	                        series: [{
	                            	name: 'shadowBar',
	                            	data: shadow
	                        	},{
	                            	name: 'valueBar',
	                            	data: value
	                        	}]
						});
					}else{
						$("#teacher_loading").css('display', 'none');
						$("#teacher_null").css('display', 'block');
						$("#four").css('opacity','0');
					}
				},
				error : function(result) {
					$("#teacher_loading").css('display', 'none');
					$("#teacher_null").css('display', 'block');
					$("#four").css('opacity','0');
				}
			});
		},
		
		//知识点错误率
		querySchoolErrorKnowledgeRate : function(){
			var data = {
					'schoolId' : "" +　schoolId,
					'gradeId' : $("#gradeSel_error").val(),
					'objectId' : $("#subSel_error").val(),
					'startTime' : null,
					'endTime' : null,
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
			};
			
			setDataTime(data);
			
			/*var data = {
					'schoolId' : '7',
					'gradeId' : '4102',
					'objectId' : '28',
					'startTime' : '2017-01-01',
					'endTime' : '2017-01-25',
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
			};*/
			
			$.ajax({
				type : "post",
				url : "/CloudClassroom/querySchoolErrorKnowledgeRate.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#rateChart_loading").css('display', 'block');
					$("#rateChart_null").css('display', 'none');
					$("#RateChart").css('opacity','0');
					$("#rateList_loading").css('display', 'block');
					$("#rateList_null").css('display', 'none');
					$("#rate_list").css('display', 'none');
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					if(json_data.success){
						if(!json_data.data || json_data.data.length <= 0){
							$("#rateChart_loading").css('display', 'none');
							$("#rateChart_null").css('display', 'block');
							$("#RateChart").css('opacity','0');
							$("#rateList_loading").css('display', 'none');
							$("#rateList_null").css('display', 'block');
							$("#rate_list").css('display', 'none');
							return;
						}
						$("#rateChart_loading").css('display', 'none');
						$("#rateChart_null").css('display', 'none');
						$("#RateChart").css('opacity','1');
						$("#rateList_loading").css('display', 'none');
						$("#rateList_null").css('display', 'none');
						$("#rate_list").css('display', 'block');
						var xName = [];
						var	value = [];
						var	shadow = [];
						console.log(json_data.data);
						$("#rate_list").empty();
						$.each(json_data.data, function(index, item){
							if(index < 10){
								xName.push(index + 1);
								value.push(item.knowledgeErroRate);
								shadow.push("100");
								var li = '<li class="ListLi">' +
		                                    '<div class="col-xs-8 knowLedgeText">'+ item.knowledgeName +'</div>' +
		                                    '<div class="col-xs-2 errorRatesText">'+ item.knowledgeErroRate +'%</div>' +
		                                    '<div class="col-xs-2 wrongTimesText">'+ item.knowledgeErrorRount +'</div>' +
		                                '</li>';
								$("#rate_list").append(li);
							}
						});
						var RateOption = {
							tooltip : {
								trigger : 'axis',
								formatter : function(params, ticket, callback) {
									var index = params[0].dataIndex;
									var res = json_data.data[index].knowledgeName+"<br>错误率:"+json_data.data[index].knowledgeErroRate
												+"%<br>错误次数:"+json_data.data[index].knowledgeErrorRount+"次";
									return res;
								}
							},
							xAxis: {
								data: xName
							},
							series: [{
				                // 根据名字对应到相应的系列
				                name: 'shadowBar',
				                data: shadow
				            },
				            {
				                // 根据名字对应到相应的系列
				                name: 'valueBar',
				                data: value
				            }]
						};
						RateChart.setOption(RateOption);
					}else{
						$("#rateChart_loading").css('display', 'none');
						$("#rateChart_null").css('display', 'block');
						$("#RateChart").css('opacity','0');
						$("#rateList_loading").css('display', 'block');
						$("#rateList_null").css('display', 'block');
						$("#rate_list").css('display', 'none');
					}
				},
				error : function(result) {
					$("#rateChart_loading").css('display', 'none');
					$("#rateChart_null").css('display', 'block');
					$("#RateChart").css('opacity','0');
					$("#rateList_loading").css('display', 'block');
					$("#rateList_null").css('display', 'block');
					$("#rate_list").css('display', 'none');
				}
			});
		},
	}
}();

$(function() {
	//获取所有学科
	P_Task_Page.getSubjects();
	
	//获取学校下的年级和班级
	P_Task_Page.getClassInfoBySchoolId();
	
	//发布作业量  按年级统计
	P_Task_Page.quaryGradePublishWorkCount();
	
	//学校学科知识点错误率
	P_Task_Page.querySchoolErrorKnowledgeRate();
})