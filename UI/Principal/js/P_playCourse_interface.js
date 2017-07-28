var P_PlayCourse_Page = new function() {
	var userInfo = UserInfo.getUserInfo();
	var userCode = userInfo.userCode;
	var user = $.parseJSON(userInfo.user);
	var schoolId = user.schoolId;
	var sTime = $("#s-Time").val();
	var eTime = $("#e-Time").val();
	
	function addClassSelInfo(classData){
		$.each(classData,function(index,item){
            $('#P_gradeSel').append("<option value='" + item.gradeId + "'>" + item.gradeName + "</option>");
        });
		$('#P_gradeSel').change(function(){
			$("#P_classSel").empty();
			$("#P_classSel").append("<option value=''>全部班级</option>");
			$.each(classData,function(index,item){
				if($('#P_gradeSel option:selected').val() == item.gradeId) {
					var classInfo = item.classInfo;
					$.each(classInfo,function(i,it){
						$('#P_classSel').append('<option value="'+it.classId+'">'+it.className+'</option>');
					});
				}
	        });
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
		        			$("#subjectSel").append("<option value='" + item.subjectId + "'>" + item.subjectName + "</option>");
		        			$("#subjectSel2").append("<option value='" + item.subjectId + "'>" + item.subjectName + "</option>");
		        		});
		        		$("#subjectSel option:first").prop("selected", 'selected');
		        		$("#subjectSel2 option:first").prop("selected", 'selected');
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
		        		$.each(classData, function(index, item){
		        			$("#gradeSelByClass").append("<option value='" + item.gradeId + "'>" + item.gradeName + "</option>");
		        			$("#gradeSelBySubject").append("<option value='" + item.gradeId + "'>" + item.gradeName + "</option>");
		        			
		        		});
		        		//设置下部分饼图的下拉框
		        		addClassSelInfo(classData);
		        	}
		        }
			});
		},
		
		//备课中心使用率对比
		getYjUseInfo : function() {
			
			var subjectId = $("#subjectSel").val();
			var statisticsType = $(".P_btn.on").attr("data-id");
			
			var data = {
					'appKey' : 'FHCC_WEB',      //系统编码
					'statisticsType' : statisticsType,  // 1：按年级 查询
					'userCode' : userCode,     //用户账号(不为空)
					'schoolId' : schoolId,      //学校编码(不为空)
					'gradeId' : null,       //年级编码(为空)
					'classId' : null,       //班级编码(为空)
					'subjectId' : null,     //科目编码(不为空)
					'startTime' : sTime,     //查询开始时间
					'endTime' : eTime,      //查询结束时间
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")　//调用时间
			};
			
			if(statisticsType == '1'){
				//年级查询
				data.subjectId = subjectId;
			}else if(statisticsType == '2'){
				//班级查询
				data.gradeId = $("#gradeSelByClass").val();
				data.subjectId = subjectId;
			}else{
				//科目查询
				data.gradeId = $("#gradeSelBySubject").val();
			}
			
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getYjUseInfo.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					if(statisticsType == "1"){
						$("#gradeLoading").css('display', 'block');
						$("#gradeNull").css('display', 'none');
						$("#one").css('opacity','0');
					}else if(statisticsType == "2"){
						$("#classLoading").css('display', 'block');
						$("#classNull").css('display', 'none');
						$("#two").css('opacity','0');
					}else{
						$("#subjectLoading").css('display', 'block');
						$("#subjectNull").css('display', 'none');
						$("#three").css('opacity','0');
					}
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					if(success == "S"){
						var statistics = json_data.statistics;
						if(statistics.length == 0){
							if(statisticsType == "1"){
								$("#gradeLoading").css('display', 'none');
								$("#gradeNull").css('display', 'block');
								$("#one").css('opacity','0');
							}else if(statisticsType == "2"){
								$("#classLoading").css('display', 'none');
								$("#classNull").css('display', 'block');
								$("#two").css('opacity','0');
							}else{
								$("#subjectLoading").css('display', 'none');
								$("#subjectNull").css('display', 'block');
								$("#three").css('opacity','0');
							}
							return;
						}
						if(statisticsType == "1"){
							$("#gradeLoading").css('display', 'none');
							$("#gradeNull").css('display', 'none');
							$("#one").css('opacity','1');
							//设置按年级查询的图表
							var gradeName = [];
							var values = [];
							var shadow = [];
							$.each(statistics,function(index,item){
								gradeName.push(item.gradeName);
								values.push(item.useNum);
								shadow.push('100');
							});
							var firstOption = {
									/*tooltip : {
										trigger : 'axis',
										formatter : function(params, ticket, callback) {
											var index = params[0].dataIndex;
											var res = data[index].paperName;
											res += '<br/>我的分数:'+ data[index].myScore +'分<br/>班级平均分:' + data[index].classAvgScore + '分<br/>班级最高分:' + data[index].classMaxScore + '分<br/>班级中位数:'
												+ data[index].classMedianScore + '分<br/>班级最低分:' + data[index].classMinScore + '分';
											return res;
										}
									},*/
									xAxis: {
						                data: gradeName
						            },
						            series: [{
						                // 根据名字对应到相应的系列
						                name: 'shadowBar',
						                data: shadow
						            },
						            {
						                // 根据名字对应到相应的系列
						                name: 'valueBar',
						                data: values
						            }]
							};
							firstChart.setOption(firstOption);
						}else if(statisticsType == "2"){
							$("#classLoading").css('display', 'none');
							$("#classNull").css('display', 'none');
							$("#two").css('opacity','1');
							//设置按班级查询的图表
							var className = [];
							var values = [];
							var shadow = [];
							$.each(statistics,function(index,item){
								className.push(item.className);
								values.push(item.useNum);
								shadow.push('100');
							});
							var secondOption = {
								/*tooltip : {
									trigger : 'axis',
									formatter : function(params, ticket, callback) {
										var index = params[0].dataIndex;
										var res = data[index].paperName;
										res += '<br/>我的分数:'+ data[index].myScore +'分<br/>班级平均分:' + data[index].classAvgScore + '分<br/>班级最高分:' + data[index].classMaxScore + '分<br/>班级中位数:'
											+ data[index].classMedianScore + '分<br/>班级最低分:' + data[index].classMinScore + '分';
										return res;
									}
								},*/
								xAxis: {
					                data: className
					            },
					            series: [{
					                // 根据名字对应到相应的系列
					                name: 'shadowBar',
					                data: shadow
					            },
					            {
					                // 根据名字对应到相应的系列
					                name: 'valueBar',
					                data: values
					            }]
							};
							secondChart.setOption(secondOption);
						}else{
							$("#subjectLoading").css('display', 'none');
							$("#subjectNull").css('display', 'none');
							$("#three").css('opacity','1');
							//设置按科目查询的图表
							var subjectName = [];
							var values = [];
							var shadow = [];
							$.each(statistics,function(index,item){
								subjectName.push(item.subjectName);
								values.push(item.useNum);
								shadow.push('100');
							});
							var thirdOption = {
								/*tooltip : {
									trigger : 'axis',
									formatter : function(params, ticket, callback) {
										var index = params[0].dataIndex;
										var res = data[index].paperName;
										res += '<br/>我的分数:'+ data[index].myScore +'分<br/>班级平均分:' + data[index].classAvgScore + '分<br/>班级最高分:' + data[index].classMaxScore + '分<br/>班级中位数:'
											+ data[index].classMedianScore + '分<br/>班级最低分:' + data[index].classMinScore + '分';
										return res;
									}
								},*/
								xAxis: {
					                data: subjectName
					            },
					            series: [{
					                // 根据名字对应到相应的系列
					                name: 'shadowBar',
					                data: shadow
					            },
					            {
					                // 根据名字对应到相应的系列
					                name: 'valueBar',
					                data: values
					            }]	
							};
							thirdChart.setOption(thirdOption);
						}
					}else{
						if(statisticsType == "1"){
							$("#gradeLoading").css('display', 'none');
							$("#gradeNull").css('display', 'block');
							$("#one").css('opacity','0');
						}else if(statisticsType == "2"){
							$("#classLoading").css('display', 'none');
							$("#classNull").css('display', 'block');
							$("#two").css('opacity','0');
						}else{
							$("#subjectLoading").css('display', 'none');
							$("#subjectNull").css('display', 'block');
							$("#three").css('opacity','0');
						}
					}
				},
				error : function(result) {
					console.log(result);
					if(statisticsType == "1"){
						$("#gradeLoading").css('display', 'none');
						$("#gradeNull").css('display', 'block');
						$("#one").css('opacity','0');
					}else if(statisticsType == "2"){
						$("#classLoading").css('display', 'none');
						$("#classNull").css('display', 'block');
						$("#two").css('opacity','0');
					}else{
						$("#subjectLoading").css('display', 'none');
						$("#subjectNull").css('display', 'block');
						$("#three").css('opacity','0');
					}
				}
			});
		},
		
		
		//教师使用资源分布
		getYjResouceUseInfo : function(){
			var data = {
					'appKey' : 'FHCC_STUDENT',
					'userCode' : userCode,
					'schoolId' : schoolId, //此处不为空
					'gradeId' : $("#P_gradeSel").val(), //年级编码(可为空，为空时查询该学校全部年级)
					'classId' : $("#P_classSel").val(), //班级编码(可为空，为空时查询该年级全部班级)
					'subjectId' : $("#subjectSel2").val(), //学科编码(可为空，为空时查询全部科目)
					'timeType'	: '1', //时间段
					'startTime' : sTime,     //查询开始时间
					'endTime' : eTime,      //查询结束时间
					'time' : new Date().format("yyyy-MM-dd")//调用时间 
			};
			
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getYjResouceUseInfo.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#pieLoading").css('display', 'block');
					$("#pieNull").css('display', 'none');
					$("#pieChart").css('opacity','0');
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					console.log(json_data);
					if(success == "S"){
						var statistics = json_data.statistics;
						if(statistics.length == 0){
							$("#pieLoading").css('display', 'none');
							$("#pieNull").css('display', 'block');
							$("#pieChart").css('opacity','0');
							return;
						}
						$("#pieLoading").css('display', 'none');
						$("#pieNull").css('display', 'none');
						$("#pieChart").css('opacity','1');
						//设置饼图
						var legend_data = [];
						var series_data = [];
						$.each(statistics,function(index,item){
							var ld = {name : item.resourceType,
									icon : 'circle',
									textStyle : {
										fontSize : 12
									}};
							var sd = {
									value : item.resourcePercent,
									name : item.resourceType
								};
							legend_data.push(ld);
							series_data.push(sd);
						});
						var pirOption = {
							legend : {
								data : legend_data
							},
							series : {
								name : '教师使用资源分布',
								data : series_data
							}
						};
						pirChart.setOption(pirOption);
					}else{
						$("#pieLoading").css('display', 'none');
						$("#pieNull").css('display', 'block');
						$("#pieChart").css('opacity','0');
					}
				},
				error : function(result) {
					console.log(result);
					$("#pieLoading").css('display', 'none');
					$("#pieNull").css('display', 'block');
					$("#pieChart").css('opacity','0');
				}
			});
		}
	}
}();

$(function() {
	//获取所有学科
	P_PlayCourse_Page.getSubjects();
	
	
	
	//获取学校下的年级和班级
	
	P_PlayCourse_Page.getClassInfoBySchoolId();
	
	
	P_PlayCourse_Page.getYjUseInfo();
	
	P_PlayCourse_Page.getYjResouceUseInfo();
})