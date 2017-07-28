var P_Interaction_Page = new function() {
	var userInfo = UserInfo.getUserInfo();
	var userCode = userInfo.userCode;
	var user = $.parseJSON(userInfo.user);
	var schoolId = user.schoolId;
	var sTime = $("#s-Time").val();
	var eTime = $("#e-Time").val();
	
	//年级  班级下拉框设置
	function addClassSelInfo(classData){
		$.each(classData,function(index,item){
            $('#gradeSel_num').append("<option value='" + item.gradeId + "'>" + item.gradeName + "</option>");
        });
		$("#classSel_num").empty();
		$("#classSel_num").append("<option value=''>全部班级</option>");
		$.each(classData,function(index,item){
			if($('#gradeSel_num option:selected').val() == item.gradeId) {
				var classInfo = item.classInfo;
				$.each(classInfo,function(i,it){
					$('#classSel_num').append('<option value="'+it.classId+'">'+it.className+'</option>');
				});
			}
        });
		$('#gradeSel_num').change(function(){
			$("#classSel_num").empty();
			$("#classSel_num").append("<option value=''>全部班级</option>");
			$.each(classData,function(index,item){
				if($('#gradeSel_num option:selected').val() == item.gradeId) {
					var classInfo = item.classInfo;
					$.each(classInfo,function(i,it){
						$('#classSel_num').append('<option value="'+it.classId+'">'+it.className+'</option>');
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
		        			$("#subSel_time").append("<option value='" + item.subjectId + "'>" + item.subjectName + "</option>");
		        		});
		        		$("#subSel_time option:first").prop("selected", 'selected');
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
		        			$("#gradeSel_time").append("<option value='" + item.gradeId + "'>" + item.gradeName + "</option>");
		        		});
		        		addClassSelInfo(classData);
		        	}
		        }
			});
		},
		
		//教师课堂互动课时数对比
		getTeacherLessonNum : function(){
			var data = {
					'appKey' : 'FHCC_WEB',
					'schoolId' : schoolId,
					'gradeId' : $("#gradeSel_time").val(), //年级编码   为空时查询全部年级
					'subjectId' : $("#subSel_time").val(), //科目编码    为空时查询全部班级
					'startTime' : sTime,
					'endTime' : eTime,
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
			};
			
		
			$.ajax({
				type : "post",
				url : "/CloudClassroom/getTeacherLessonNum.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#time_loading").css('display', 'block');
					$("#time_null").css('display', 'none');
					$("#one").css('opacity','0');
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					console.log(json_data);
					if(json_data.status == "S"){
						if(!json_data.statistics || json_data.statistics.length <= 0){
							$("#time_loading").css('display', 'none');
							$("#time_null").css('display', 'block');
							$("#one").css('opacity','0');
							return;
						}
						$("#time_loading").css('display', 'none');
						$("#time_null").css('display', 'none');
						$("#one").css('opacity','1');
						var xName = [];
						var value = [];
						var shadow = [];
						
						$.each(json_data.statistics, function(index, item){
							xName.push(item.teacherName);
							value.push(item.lessonNum);
							shadow.push("100");
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
						firstChart.setOption(firstOption);
					}else{
						$("#time_loading").css('display', 'none');
						$("#time_null").css('display', 'block');
						$("#one").css('opacity','0');
					}
				},
				error : function(result) {
					$("#time_loading").css('display', 'none');
					$("#time_null").css('display', 'block');
					$("#one").css('opacity','0');
				}
			});
		},
		
		//学校教师互动课堂使用次数
		getSchoolLessonNum : function(){
			var data = {
					'appKey' : 'FHCC_WEB',
					'allSchool' :　false,
					'schoolId' : schoolId,
					'gradeId' : $("#gradeSel_num").val(),
					'classId' : $("#classSel_num").val(),
					'startTime' : sTime,
					'endTime' : eTime,
					'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
			};
			
			$.ajax({
				type : "post",
				url : "/CloudClassroom/getSchoolLessonNum.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#num_loading").css('display', 'block');
					$("#num_null").css('display', 'none');
					$("#pieChart").css('opacity','0');
					$(".pitText").css('opacity','0');
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					if(json_data.status == "S"){
						if(!json_data.statistics || json_data.statistics.length <= 0){
							$("#num_loading").css('display', 'none');
							$("#num_null").css('display', 'block');
							$("#pieChart").css('opacity','0');
							$(".pitText").css('opacity','0');
							return;
						}
						$("#num_loading").css('display', 'none');
						$("#num_null").css('display', 'none');
						$("#pieChart").css('opacity','1');
						$(".pitText").css('opacity','1');
						var legend_data = [];
						var series_data = [];
						$.each(json_data.statistics,function(index,item){
							var ld = {
									name : item.subjectName,
									icon : 'circle',
									textStyle : {
										fontSize : 12
									}
							};
							var sd = {
									value : item.useNum,
									name : item.subjectName
							};
							legend_data.push(ld);
							series_data.push(sd);
						});
						pieChart.setOption({
							legend : {
								data : legend_data
							},
							series : {
								name : '教师课堂互动使用次数',
								data : series_data
							}
						});
					}else{
						$("#num_loading").css('display', 'none');
						$("#num_null").css('display', 'block');
						$("#pieChart").css('opacity','0');
						$(".pitText").css('opacity','0');
					}
				},
				error : function(result) {
					$("#num_loading").css('display', 'none');
					$("#num_null").css('display', 'block');
					$("#pieChart").css('opacity','0');
					$(".pitText").css('opacity','0');
				}
			});
		},
		
	}
}();

$(function() {
	//获取所有学科
	P_Interaction_Page.getSubjects();
	
	//获取学校下的年级和班级
	P_Interaction_Page.getClassInfoBySchoolId();
	
	//教师课堂互动课时数对比
	P_Interaction_Page.getTeacherLessonNum();
	
	//学校教师互动课堂使用次数
	P_Interaction_Page.getSchoolLessonNum();
})