var P_EBook_Page = new function() {
	var userInfo = UserInfo.getUserInfo();
	var userCode = userInfo.userCode;
	var user = $.parseJSON(userInfo.user);
	var schoolId = user.schoolId;
	var sTime = $("#s-Time").val();
	var eTime = $("#e-Time").val();
	
	//添加第三个图表的班级下拉框信息
	function appendClassSelInThr(classData){
		$("#classSelInThr").empty();
		$.each(classData,function(index,item){
			if($('#gradeSelInThr option:selected').val() == item.gradeId) {
				var classInfo = item.classInfo;
				$.each(classInfo,function(i,it){
					$('#classSelInThr').append('<option value="'+it.classId+'">'+it.className+'</option>');
				});
			}
        });
	};
	
	//添加第一个图表的班级下拉框信息
	function appendClassSelInOne(classData){
		$("#classSelInOne").empty();
		$("#classSelInOne").append("<option value=''>全部班级</option>");
		$.each(classData,function(index,item){
			if($('#gradeSelInOne option:selected').val() == item.gradeId) {
				var classInfo = item.classInfo;
				$.each(classInfo,function(i,it){
					$('#classSelInOne').append('<option value="'+it.classId+'">'+it.className+'</option>');
				});
			}
        });
	};
	
	//添加班级下拉框信息
	function addClassSelInfo(classData){
		$.each(classData,function(index,item){
            $('#gradeSelInOne').append("<option value='" + item.gradeId + "'>" + item.gradeName + "</option>");
            $('#gradeSelInThr').append("<option value='" + item.gradeId + "'>" + item.gradeName + "</option>");
        });
		$("#gradeSelInOne option:first").prop("selected", 'selected');
		$("#gradeSelInThr option:first").prop("selected", 'selected');
		appendClassSelInOne(classData);
		$('#gradeSelInOne').change(function(){
			appendClassSelInOne(classData);
        });
		appendClassSelInThr(classData);
		$('#gradeSelInThr').change(function(){
			appendClassSelInThr(classData);
        });
	};
	
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
		        			$("#subSel").append("<option value='" + item.subjectId + "'>" + item.subjectName + "</option>");
		        		});
		        		$("#subSel option:first").prop("selected", 'selected');
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
		        async : false,
		        data : {"inparam" : JSON.stringify(data)},
		        dataType : "json",
		        success : function(result) {
		        	var json_data = $.parseJSON(result.result);
		        	if(json_data.status == "S"){
		        		var classData = json_data.classData;
		        		$.each(classData, function(index, item){
		        			$("#gradeSel").append("<option value='" + item.gradeId + "'>" + item.gradeName + "</option>");
		        			
		        		});
		        		//设置下部分饼图的下拉框
		        		addClassSelInfo(classData);
		        	}
		        }
			});
		},
		
		//学生阅读电子书时间分布
		getReadTimeDistribution : function() {
			var data = {
					'appKey' : 'FHCC_WEB',
					"schoolId" : schoolId,
					"gradeId" : $("#gradeSelInOne").val(),
	    			"classId" : $("#classSelInOne").val(),
					"startTime" : sTime,
					"endTime" : eTime,
					"time" : new Date().format("yyyy-MM-dd hh:mm:ss")
	    	};
			
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getReadTimeDistribution.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#read_time_loading").css('display', 'block');
					$("#read_time_null").css('display', 'none');
					$("#eBookChart").css('opacity','0');
	    	    },
				success : function(result) {
					$("#read_time_loading").css('display', 'none');
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					console.log(json_data);
					if(success == "S"){
						var statistics = json_data.statistics;
						if(statistics.length == 0){
							$("#read_time_null").css('display', 'block');
						}else{
							$("#eBookChart").css('opacity','1');
							var times = [];
							var readNums = [];
							$.each(statistics,function(index,item){
								times.push(item.readHour);
								readNums.push(item.studentNum);
							});
							ETimChart.setOption({
								xAxis: {
		                            data: times
		                        },
		                        series: [{
		                            	// 根据名字对应到相应的系列
		                            	name: 'eTimeChart',
		                            	data: readNums
		                        	}]
							});
						}
					}else{
						$("#read_time_null").css('display', 'block');
					}
				},
				error : function(result) {
					console.log(result);
					$("#read_time_loading").css('display', 'none');
					$("#read_time_null").css('display', 'block');
				}
			});
		},
		
		
		//12.3	阅读电子书科目分布
		getReadSubjectDistribution : function() {
			var data = {
					'appKey' : 'FHCC_WEB',
					'userCode' : userCode,
					'gradeId' : $("#gradeSelInThr").val(),
					'classId' : $("#classSelInThr").val(),
					"startTime" : sTime,
					"endTime" : eTime,
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")

			};
			
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getReadSubjectDistribution.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#pie_loading").css('display', 'block');
					$("#pie_null").css('display', 'none');
					$("#pieChart").css('opacity','0');
	    	    },
				success : function(result) {
					$("#pie_loading").css('display', 'none');
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					console.log(json_data);
					if(success == "S"){
						var statistics = json_data.statistics;
						if(statistics.length == 0){
							$("#pie_null").css('display', 'block');
						}else{
							$("#pieChart").css('opacity','1');
							var legend_data = [];
							var series_data = [];
							$.each(statistics,function(index,item){
								var ld = {
										name : item.subjectName,
										icon : 'circle',
										textStyle : {
											fontSize : 12
										}
								};
								var sd = {
										value : item.readNum.split("次")[0],
										name : item.subjectName
								};
								legend_data.push(ld);
								series_data.push(sd);
							});
							eBookCountChart.setOption({
								legend : {
									data : legend_data
								},
								series : {
									name : '电子书阅读学科分布图',
									data : series_data
								}
							});
						}
					}else{
						$("#pie_null").css('display', 'block');
					}
				},
				error : function(result) {
					console.log(result);
					$("#pie_loading").css('display', 'none');
					$("#pie_null").css('display', 'block');
				}
			});
		},
		
		//12.5	电子书使用活跃度
		getEbookDestribution : function(){
			var statisticsType = $(".P_btn.on").attr("data-id");
			var data = {
					'appKey' : 'FHCC_STUDENT',
					'userCode' : userCode ,
					'statisticsType' : statisticsType,
					'subjectId' : $("#subSel").val(),
					'gradeId' : '',
					'startTime' : sTime,
					'endTime' : eTime,
					'time' : new Date().format("yyyy-MM-dd")
			};
			
			if(statisticsType == "1"){
				//按班级统计时gradeId不为空
				data.gradeId = $("#gradeSel").val();
			}
			
			$.ajax({
				type : "post",
				url : "/CloudClassroom/getEbookDestribution.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					if(statisticsType == "0"){
						//按年级统计
						$("#grade_loading").css('display', 'block');
						$("#grade_null").css('display', 'none');
						$("#one").css('opacity','0');
					}else{
						//按班级统计
						$("#class_loading").css('display', 'block');
						$("#class_null").css('display', 'none');
						$("#two").css('opacity','0');
					}
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					if(json_data.status == "S"){
						if(!json_data.statistics || json_data.statistics.length <= 0){
							if(statisticsType == "0"){
								//按年级统计
								$("#grade_loading").css('display', 'none');
								$("#grade_null").css('display', 'block');
								$("#one").css('opacity','0');
							}else{
								//按班级统计
								$("#class_loading").css('display', 'none');
								$("#class_null").css('display', 'block');
								$("#two").css('opacity','0');
							}
							return;
						}
						//有数据
						if(statisticsType == "0"){
							//按年级统计
							$("#grade_loading").css('display', 'none');
							$("#grade_null").css('display', 'none');
							$("#one").css('opacity','1');
							var xName = [];
							var value = [];
							var shadow = [];
							$.each(json_data.statistics,function(index,item){
								xName.push(item.xaxisName);
								value.push(item.readNum);
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
							//按班级统计
							$("#class_loading").css('display', 'none');
							$("#class_null").css('display', 'none');
							$("#two").css('opacity','1');
							var xName = [];
							var value = [];
							var shadow = [];
							$.each(json_data.statistics,function(index,item){
								xName.push(item.xaxisName);
								value.push(item.readNum);
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
						}
					}else{
						//json_data.status == "F"
						if(statisticsType == "0"){
							//按年级统计
							$("#grade_loading").css('display', 'none');
							$("#grade_null").css('display', 'block');
							$("#one").css('opacity','0');
						}else{
							//按班级统计
							$("#class_loading").css('display', 'none');
							$("#class_null").css('display', 'block');
							$("#two").css('opacity','0');
						}
					}
				},
				error : function(result) {
					if(statisticsType == "0"){
						//按年级统计
						$("#grade_loading").css('display', 'none');
						$("#grade_null").css('display', 'block');
						$("#one").css('opacity','0');
					}else{
						//按班级统计
						$("#class_loading").css('display', 'none');
						$("#class_null").css('display', 'block');
						$("#two").css('opacity','0');
					}
				}
			});
		}
	}
}();

$(function() {
	//获取所有学科
	P_EBook_Page.getSubjects();
	
	//获取学校下的年级和班级
	P_EBook_Page.getClassInfoBySchoolId();
	
	
	P_EBook_Page.getReadTimeDistribution();

	P_EBook_Page.getEbookDestribution();
	
	P_EBook_Page.getReadSubjectDistribution();
})