var S_DataCenter_Page = new function() {
	
	return {
		//查看作业信息
		queryPaperList : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/queryPaperList.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$(".ul-selectBook").empty();
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					var success = json_data.success;
					if(success){
						var data = json_data.data;
						if(data.length == 0){
							return;
						}else{
							$.each(data,function(index,item){
								var li = '<li>' +
											'<div class="ch-Checkbox">' +
												'<input type="radio" id="w'+ index +'" name="workename" value="'+ item.paperId +'"/>' +
												'<label for="w'+ index +'"><span></span>'+ item.paperName +'</label>' +
											'</div>' +
											'<div class="ch-time">' +
												'<span class="year">'+ new Date(item.ansStartTime).format("yyyy-MM-dd hh:mm") +'</span>' +
											'</div>' +
										 '</li>';
								$(".ul-selectBook").append(li);
							});
						}
					}else{
						console.log(json_data);
					}
				},
				error : function(result) {
					console.log(result);
					
				}
			});
		},
		
		//课堂互动成绩曲线
		getStuLessonScoreChart : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getStuLessonScoreChart.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#active_loading").css('display', 'block');
					$("#activeChart").css('opacity','0');
					$("#active_null").css('display', 'none');
	    	    },
				success : function(result) {
					$("#active_loading").css('display', 'none');
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					if(success == "S"){
						var statistics = json_data.statistics;
						console.log(statistics);
						if(statistics.length == 0){
							$("#active_null").css('display', 'block');
						}else{
							$("#activeChart").css('opacity','1');
							var time = [];
							var vals = [];
							var avgs = [];
							$.each(statistics,function(index,item){
								time.push(new Date(item.date).format("MM/dd"));
								vals.push(item.myScore);
								avgs.push(item.classAverScore);
							});
							ActChart.setOption({        //加载数据图表
								tooltip : {
									trigger : 'axis',
									formatter : function(params, ticket, callback) {
										var data = statistics;
										var index = params[0].dataIndex;
										var res = '<br/>我的分数:'+ data[index].myScore +'分<br/>班级平均分:' + data[index].classAverScore + '分<br/>班级最高分:' + data[index].maxScore + '分<br/>班级中位数:'
											+ data[index].midScore + '分<br/>班级最低分:' + data[index].lowestScore + '分';
										return res;
									}
								},
								xAxis: {
		                            data: time
		                        },
		                        series: [{
		                            // 根据名字对应到相应的系列
		                            name: '个人分数',
		                            data: vals
		                        },{
		                        	name: '班级均分',
		                            data: avgs
		                        }]
		                    });
						}
					}else{
						$("#active_null").css('display', 'block');
					}
				},
				error : function(result) {
					$("#active_loading").css('display', 'none');
					$("#active_null").css('display', 'block');
					console.log(result);
				}
			});
		},
		
		//11.3	学生课堂参与度    学生首页展示学生课堂评测参与度统计图表
		getLessonNumOfSubject : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getLessonNumOfSubject.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					if(data.statisticsType == "0"){
						//时间查询
						$("#interact_line_loading").css('display', 'block');
						$("#participateChart").css('opacity','0');
						$("#interact_line_null").css('display', 'none');
					}else{
						//学科查询
						$("#interact_pie_loading").css('display', 'block');
						$("#participatePie").css('opacity','0');
						$("#interact_pie_null").css('display', 'none');
						$('.numBox').css('display', 'none');
					}
	    	    },
				success : function(result) {
					$("#interact_pie_loading").css('display', 'none');
					$("#interact_line_loading").css('display', 'none');
					/*if(data.statisticsType == "0"){
						//时间查询
						$("#interact_line_loading").css('display', 'none');
					}else{
						//学科查询
						$("#interact_pie_loading").css('display', 'none');
					}*/
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					if(success == "S"){
						var statistics = json_data.statistics;
						console.log(statistics);
						if(statistics.length == 0){
							if(data.statisticsType == "0"){
								//时间查询
								$("#interact_line_null").css('display', 'block');
							}else{
								//学科查询
								$("#interact_pie_null").css('display', 'block');
							}
						}else{
							if(data.statisticsType == "0"){
								//时间查询
								$("#participateChart").css('opacity','1');
								var time = [];
								var vals = [];
								$.each(statistics,function(index,item){
									time.push(new Date(item.date).format("MM/dd"));
									vals.push(item.myNum);
								});
								partChart.setOption({        //加载数据图表
									tooltip : {
										trigger : 'axis',
										formatter : function(params, ticket, callback) {
											var data = statistics;
											var index = params[0].dataIndex;
											var res = '班级最高次数:' + data[index].maxNum + '次<br/>我的参与次数:' + data[index].myNum + '次<br/>我的排名:'
												+ data[index].result;
											return res;
										}
									},
									xAxis: {
			                            data: time
			                        },
			                        series: [{
			                            // 根据名字对应到相应的系列
			                            name: '课堂参与度曲线',
			                            data: vals
			                        }]
			                    });
							}else{
								//学科查询
								$("#participatePie").css('opacity','1');
								$('.numBox').css({'opacity':'1','z-index':'10'});
								$('.numBox').css('display', 'block');
								var legend_data = [];
								var series_data = [];
								var total = 0;
								$.each(statistics,function(index,item){
									var ld = {
											name : item.subjectName,
											icon : 'circle',
											textStyle : {
												fontSize : 12
											}
									};
									var sd = {
											value : item.interNum,
											name : item.subjectName
									};
									legend_data.push(ld);
									series_data.push(sd);
									total += item.interNum;
								});
								pieChart.setOption({
									tooltip : {
										trigger : 'item',
										formatter : function(params, ticket, callback) {
											var index = params.dataIndex;
											var res = params.name;
											res += '<br/>班级最高次数:'+ statistics[index].maxNum +'次<br/>我的参与次数:'+params.value+'次<br/>我的排名:'
												+ statistics[index].result;
											return res;
										}
									},
									legend : {
										data : legend_data
									},
									series : {
										name : '课程参与度',
										data : series_data
									}
								});
								$(".num").text(total);
							}
						}
					}else{
						if(data.statisticsType == "0"){
							//时间查询
							$("#interact_line_null").css('display', 'block');
						}else{
							//学科查询
							$("#interact_pie_null").css('display', 'block');
						}
					}
				},
				error : function(result) {
					if(data.statisticsType == "0"){
						//时间查询
						$("#interact_line_loading").css('display', 'none');
						$("#interact_line_null").css('display', 'block');
					}else{
						//学科查询
						$("#interact_pie_loading").css('display', 'none');
						$("#interact_pie_null").css('display', 'block');
					}
					console.log(result);
				}
			});
		},
		
		//查询用户某学科最近多少次作业的个人成绩和班级均分。
		queryStudentScoreDataRank : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/queryStudentScoreDataRank.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#score_loading").css('display', 'block');
					$("#scoreChart").css('opacity','0');
					$("#score_null").css('display', 'none');
	    	    },
				success : function(result) {
					$("#score_loading").css('display', 'none');
					var json_data = $.parseJSON(result.result);
					var success = json_data.success;
					console.log(json_data);
					if(success){
						var data = json_data.data;
						if(data.length == 0){
							$("#score_null").css('display', 'block');
						}else{
							$("#scoreChart").css('opacity','1');
							var xTime = [];
							var myScore = [];
							var avgScore = [];
							$.each(data,function(index,item){
								xTime.push(new Date(item.ansStartTime).format("MM/dd"));
								myScore.push(item.myScore);
								avgScore.push(item.classAvgScore);
							});
							scorChart.setOption({
								tooltip : {
									trigger : 'axis',
									formatter : function(params, ticket, callback) {
										var index = params[0].dataIndex;
										var res = data[index].paperName;
										res += '<br/>我的分数:'+ data[index].myScore +'分<br/>班级平均分:' + data[index].classAvgScore + '分<br/>班级最高分:' + data[index].classMaxScore + '分<br/>班级中位数:'
											+ data[index].classMedianScore + '分<br/>班级最低分:' + data[index].classMinScore + '分';
										return res;
									}
								},
								xAxis: {
					                data: xTime
					            },
					            series: [{
					                // 根据名字对应到相应的系列
					                name: '个人分数',
					                data: myScore
					            },
					            {
					                // 根据名字对应到相应的系列
					                name: '班级均分',
					                data: avgScore
					            }]
							});
						}
					}else{
						$("#score_null").css('display', 'block');
					}
				},
				error : function(result) {
					$("#score_loading").css('display', 'none');
					$("#score_null").css('display', 'block');
					console.log(result);
				}
			});
		},
		
		//根据学科、时间段，输出对应的作业所花时长数据。
		queryStudentFinishTimeRatio : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/queryStudentFinishTimeRatio.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#costTime_loading").css('display', 'block');
					$("#CostTimeChart").css('opacity','0');
					$("#costTime_null").css('display', 'none');
	    	    },
				success : function(result) {
					$("#costTime_loading").css('display', 'none');
					var json_data = $.parseJSON(result.result);
					var success = json_data.success;
					console.log(json_data);
					if(success){
						var data = json_data.data;
						if(data.length == 0){
							$("#costTime_null").css('display', 'block');
						}else{
							$("#CostTimeChart").css('opacity','1');
							var xTime = [];
							var myTime = [];
							var avgTime = [];
							$.each(data,function(index,item){
								xTime.push(new Date(item.ansStartTime).format("MM/dd"));
								myTime.push(item.stuFinishTime);
								avgTime.push(item.classFinishTime);
							});
							var userName = $("#costTime_stuSel").find("option:selected").text();
							CosChart.setOption({
								tooltip : {
									trigger : 'axis',
									formatter : function(params, ticket, callback) {
										var index = params[0].dataIndex;
										var res = userName +'用时:'+ data[index].stuFinishTime +'分钟<br/>班级平均用时:' + data[index].classFinishTime 
											+ '分钟<br/>班级最短用时:' + data[index].classMinFinishTime + '分钟';
										return res;
									}
								},
								xAxis: {
					                data: xTime
					            },
					            series: [{
					                // 根据名字对应到相应的系列
					                name: '个人用时',
					                data: myTime
					            },
					            {
					                // 根据名字对应到相应的系列
					                name: '班级平均用时',
					                data: avgTime
					            }]
							});
						}
					}else{
						$("#costTime_null").css('display', 'block');
					}
				},
				error : function(result) {
					$("#costTime_loading").css('display', 'none');
					$("#costTime_null").css('display', 'block');
					console.log(result);
				}
			});
		},
		
		//统计某校某学科年级发布作业量知识点错误率
		queryStudentErrorRate : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/queryStudentErrorRate.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					//表格显示
					$("#rate_list_loading").css('display', 'block');
					$("#rate_list_null").css('display', 'none');
					$("#rate_list").empty();
					//图显示
					$("#rate_loading").css('display', 'block');
					$("#errorRateChart").css('opacity','0');
					$("#rate_null").css('display', 'none');
					//禁用切换图表
					$(".prohibitBtn").css('display', 'block');
					$(".ToggleChartBtn").css('display', 'none');
	    	    },
				success : function(result) {
					$("#rate_loading").css('display', 'none');
					$("#rate_list_loading").css('display', 'none');
					var json_data = $.parseJSON(result.result);
					var success = json_data.success;
					console.log(json_data);
					if(success){
						$("#rate_list").empty();
						$(".prohibitBtn").css('display', 'none');
						$(".ToggleChartBtn").css('display', 'block');
						var data = json_data.data;
						if(data.length == 0){
							$("#rate_null").css('display', 'block');
							$("#rate_list_null").css('display', 'block');
						}else{
							//填入柱状图
							$("#errorRateChart").css('opacity','1');
							var nums = [];
							var arr = [];//条状阴影填充
							var vals = [];
							$.each(data,function(index,item){
								if(index < 10){
									//生成柱状图所需数据
									nums.push(index + 1);
									vals.push(item.knowledgeErrorRate);
									arr.push('100');
									//生成表格数据
									var li = '<li class="ListLi">' +
												 '<div class="col-xs-9 knowLedgeText">'+ item.knowledgeName +'</div>' +
												 '<div class="col-xs-2 errorRatesText">'+ item.knowledgeErrorRate.split(".")[0] +'%</div>' +
												 '<div class="col-xs-1 wrongTimesText">'+ item.knowledgeErrorRount +'</div>' +
											 '</li>';
									$("#rate_list").append(li);
								}
							});
							barChart.setOption({        //加载数据图表
								tooltip : {
									trigger : 'axis',
									formatter : function(params, ticket, callback) {
										var index = params[0].dataIndex;
										var res = data[index].knowledgeName+"<br>错误率:"+data[index].knowledgeErrorRate
													+"%<br>错误次数:"+data[index].knowledgeErrorRount+"次";
										return res;
									}
								},
								xAxis: {
		                            data: nums
		                        },
		                        series: [{
		                            // 根据名字对应到相应的系列
		                            name: 'shadowBar',
		                            data: arr
		                        },{
		                        	name: 'valueBar',
		                            data: vals
		                        }]
		                    });
						}
					}else{
						$("#rate_null").css('display', 'block');
						$("#rate_list_null").css('display', 'block');
					}
				},
				error : function(result) {
					$("#rate_loading").css('display', 'none');
					$("#rate_list_loading").css('display', 'none');
					$("#rate_null").css('display', 'block');
					$("#rate_list_null").css('display', 'block');
					console.log(result);
				}
			});
		},
		
		//12.6	该学生电子书阅读统计
		getEbookReadInfo :function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getEbookReadInfo.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#read_loading").css('display', 'block');
					$("#E-bookChart").css('opacity','0');
					$("#read_null").css('display', 'none');
	    	    },
				success : function(result) {
					$("#read_loading").css('display', 'none');
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					console.log(json_data);
					if(success == "S"){
						var data = json_data.statistics;
						if(data.length == 0){
							$("#read_null").css('display', 'block');
						}else{
							$("#E-bookChart").css('opacity','1');
							var xTime = [];
							var myScore = [];
							var avgScore = [];
							$.each(data,function(index,item){
								xTime.push(new Date(item.readDate).format("MM/dd"));
								myScore.push(item.readNum.split("次")[0]);
								avgScore.push(item.classReadAverage);
							});
							EbookChart.setOption({
								xAxis: {
					                data: xTime
					            },
					            series: [{
					                // 根据名字对应到相应的系列
					                name: '个人阅读次数',
					                data: myScore
					            },
					            {
					                // 根据名字对应到相应的系列
					                name: '班级平均阅读次数',
					                data: avgScore
					            }]
							});
						}
					}else{
						$("#read_null").css('display', 'block');
					}
				},
				error : function(result) {
					$("#read_loading").css('display', 'none');
					$("#read_null").css('display', 'block');
					console.log(result);
				}
			});
		},
		
		//12.3	阅读电子书科目分布
		getReadSubjectDistribution : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getReadSubjectDistribution.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$("#bookDis_loading").css('display', 'block');
					$("#E-bookPie").css('opacity','0');
					$("#bookDis_null").css('display', 'none');
	    	    },
				success : function(result) {
					$("#bookDis_loading").css('display', 'none');
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					console.log(json_data);
					if(success == "S"){
						var statistics = json_data.statistics;
						if(statistics.length == 0){
							$("#bookDis_null").css('display', 'block');
						}else{
							$("#E-bookPie").css('opacity','1');
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
						$("#bookDis_null").css('display', 'block');
					}
				},
				error : function(result) {
					$("#bookDis_loading").css('display', 'none');
					$("#bookDis_null").css('display', 'block');
					console.log(result);
				}
			});
		}
	}
}();

$(function() {
	var userCode = UserInfo.getUserInfo().userCode;
	var $user = $.parseJSON(UserInfo.getUserInfo().user);
	var userId = $user.staffId;
	var classId = $user.classId;
	var subject = $.parseJSON(cookie.getCookie("cc_subject"));
	$(".D-activeSubBox").empty();
	$.each(subject,function(index,item){
		var option = '<option value="'+ item.subjectId +'">'+ item.subjectName +'</option>';
		$(".D-activeSubBox").append(option);
	});
	$(".D-activeSubBox option:first").prop("selected", 'selected');
	var data2 = {
			'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
//			'userCode' : 'stu12',
			'subjectId' : $("#active_subjectSel").val(),
//			'subjectId' : '13',
//			'startTime' : '2017-01-15 15:34:25',
			'startTime' : $("#s-Time").val(),
			'endTime' : $("#e-Time").val(),
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	var data3 = {
//			"startTime" : "2017-01-15 15:34:25",
			"startTime" : $("#errorRateTimeL").val(),
//			"endTime" : "2017-05-24 15:34:25",
			"endTime" : $("#errorRateTimeR").val(),
			"userId" : userId,
//			"userId" : '1115',
			"objectId" : "28"
//			"objectId" : "28"
	};
	var data5 = {
			'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
//			'userCode' : 'stu12',
			'statisticsType' : '0',  //统计方式  0：按时间统计  1：按学科统计
			'subjectId' : $("#interact_subSel").val(),
//			'subjectId' : '13',//学科编码(按学科统计时该字段为空)
			'classId' : classId,       //班级编码
//			'classId' : '138',
			"startTime" : $("#L-Time").val(),
			"endTime" : $("#R-Time").val(),
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")

	};
	S_DataCenter_Page.queryPaperList(data3);
	S_DataCenter_Page.getStuLessonScoreChart(data2);
	S_DataCenter_Page.getLessonNumOfSubject(data5);
	//课堂互动成绩查询按钮
	$("#active_query").click(function(){
		if(new Date($("#s-Time").val()) > new Date($("#e-Time").val())){
			return;
		}
		var data = {
				'appKey' : 'FHCC_WEB',
				'userCode' : userCode,
//				'userCode' : 'stu12',
				'subjectId' : $("#active_subjectSel").val(),
//				'subjectId' : '13',
//				'startTime' : '2017-01-15 15:34:25',
				'startTime' : $("#s-Time").val(),
				'endTime' : $("#e-Time").val(),
				'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
		};
		S_DataCenter_Page.getStuLessonScoreChart(data);
	});
	
	//学生课堂参与度查询按钮
	$("#interact_query").click(function(){
		if(new Date($("#L-Time").val()) > new Date($("#R-Time").val())){
			return;
		}
		var data = {
				'appKey' : 'FHCC_WEB',
				'userCode' : userCode,
//				'userCode' : 'stu12',
//				'statisticsType' : '0',  //统计方式  0：按时间统计  1：按学科统计
//				'subjectId' : '13',     //学科编码(按学科统计时该字段为空)
				'classId' : '138',       //班级编码
				"startTime" : $("#L-Time").val(),
				"endTime" : $("#R-Time").val(),
				'time' : new Date().format("yyyy-MM-dd hh:mm:ss")

		};
		if($('.stat-time').hasClass("on")){
			data.statisticsType = '0';
			var subjectId = $("#interact_subSel").val();
			data.subjectId = subjectId;
		}else{
			data.statisticsType = '1';
		}
		S_DataCenter_Page.getLessonNumOfSubject(data);
	});
	
	//班级成绩查询按钮
	$("#score_query").click(function(){
		if(new Date($("#scoreTimeL").val()) > new Date($("#scoreTimeR").val())){
			return;
		}
		var data = {
//    			"userId" : "1115",
    			"userId" : userId,
//    			"objectId" : "28",
				"objectId" : $("#work_subject").val(),
//				"startTime" : "2017-01-15 15:34:25",
				"startTime" : $("#scoreTimeL").val(),
//				"endTime" : "2017-05-24 15:34:25",
				"endTime" : $("#scoreTimeR").val(),
				"time" : new Date().format("yyyy-MM-dd hh:mm:ss")
    	};
		S_DataCenter_Page.queryStudentScoreDataRank(data);
	});
	
	//作业完成时长查询按钮
	$("#costTime_query").click(function(){
		if(new Date($("#CostTimeL").val()) > new Date($("#CostTimeR").val())){
			return;
		}
		var data = {
    			"userId" : userId,
//    			"userId" : $("#costTime_stuSel").val(),
    			"classId" : classId,
//    			"classId" : '34',
//    			"objectId" : "28",
				"objectId" : $("#costTime_subSel").val(),
//				"startTime" : "2017-01-15 15:34:25",
				"startTime" : $("#CostTimeL").val(),
//				"endTime" : "2017-05-24 15:34:25",
				"endTime" : $("#CostTimeR").val(),
				"time" : new Date().format("yyyy-MM-dd hh:mm:ss")
    	};;
    	S_DataCenter_Page.queryStudentFinishTimeRatio(data);
	});
	
	//知识点错率查询按钮
	$("#rate_query").click(function(){
		var data = {
//    			"classId" : "34",
    			"classId" : classId,
//				"startTime" : "2017-02-15 15:34:25",
				"startTime" : $("#errorRateTimeL").val(),
//				"endTime" : "2017-06-18 15:34:25",
				"endTime" : $("#errorRateTimeR").val(),
    			"userId" : userId,
//    			"userId" : "1115",
//    			"objectId" : "28",//科目信息
    			"objectId" : $("#work_subject").val(),
//    			"paperId" : "42"
    	};
		//判断单次作业还是多次作业
		var type = $("input[name=errorRate]:checked").val();
		if(type == 'more'){
			if(new Date($("#errorRateTimeL").val()) > new Date($("#errorRateTimeR").val())){
				return;
			}
			S_DataCenter_Page.queryStudentErrorRate(data);
		}else{
			if($("#er-ChossText").text() == "" ){
				alert("请先选择作业!");
				return;
			}
			var paperId = $("#er-ChossText").attr("value");
			data.paperId = paperId;
//			data.paperId = '42';
			S_DataCenter_Page.queryStudentErrorRate(data);
		}
	});
	
	//学生电子书阅读统计按钮
	$("#read_query").click(function(){
		if(new Date($("#ENumTimeL").val()) > new Date($("#ENumTimeR").val())){
			return;
		}
		var subjectId = $("#read_subSel").val();
		var data = {
				'appKey' : 'FHCC_WEB',
				'userCode' : userCode,
//				'userCode' : 's7',
				'subjectId' : subjectId,
				"startTime" : $("#ENumTimeL").val(),
				"endTime" : $("#ENumTimeR").val(),
				'time' : new Date().format("yyyy-MM-dd hh:mm:ss")

		};
		S_DataCenter_Page.getEbookReadInfo(data);
	});
	
	//学生阅读电子书学科分布按钮
	$("#bookDis_query").click(function(){
		if(new Date($("#ESubTimeL").val()) > new Date($("#ESubTimeR").val())){
			return;
		}
		var data = {
				'appKey' : 'FHCC_WEB',
				'userCode' : userCode,
//				'userCode' : 'monday',
				'gradeId' : null,
				'classId' : classId,
//				'classId' : '138',
//				"startTime" : "2017-01-15 15:34:25",
				"startTime" : $("#ESubTimeL").val(),
				"endTime" : $("#ESubTimeR").val(),
				'time' : new Date().format("yyyy-MM-dd hh:mm:ss")

		};
		S_DataCenter_Page.getReadSubjectDistribution(data);
	});
})