Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

var Index_Page = new function() {
	//有数据显示作业得分和排名
	function showRingScore() {
		$("#f-TcontentNull").css('display', 'none');
		$("#f-meanValuenull").css('display', 'none');
		$("#f-topScoreValuenull").css('display', 'none');
		$("#f-medianValuenull").css('display', 'none');
		$("#f-lowestValuenull").css('display', 'none');
		
		$("#f-Tcontent").css('display', 'block');
		$("#f-meanValue").css('display', 'block');
		$("#f-topScoreValue").css('display', 'block');
		$("#f-medianValue").css('display', 'block');
		$("#f-lowestValue").css('display', 'block');
	}
	
	//无数据显示空数据
	function hiddenRingScore() {
		$("#f-Tcontent").css('display', 'none');
		$("#f-meanValue").css('display', 'none');
		$("#f-topScoreValue").css('display', 'none');
		$("#f-medianValue").css('display', 'none');
		$("#f-lowestValue").css('display', 'none');
		$("#f-TcontentNull").css('display', 'block');
		$("#f-meanValuenull").css('display', 'block');
		$("#f-topScoreValuenull").css('display', 'block');
		$("#f-medianValuenull").css('display', 'block');
		$("#f-lowestValuenull").css('display', 'block');
	}
	
	//设置学生最近一次的作业得分和排名
	function setRingScore(data) {
		$("#f-ringValue").text(Math.round(data.myScore));
		$("#f-ranking span").text(data.classRank);
		$("#f-meanValue").text(Math.round(data.classAvgScore));
		$("#f-topScoreValue").text(Math.round(data.classMaxScore));
		$("#f-medianValue").text(Math.round(data.classMedianScore));
		$("#f-lowestValue").text(Math.round(data.classMinScore));
	}
	
	//有数据显示成绩折线图
	function showScoreLine() {
		$("#f-workeTwoNull").css('display', 'none');
		$("#workeCont").css('display', 'block');
	}
	
	//无数据显示空数据
	function hiddenScoreLine() {
		$("#workeCont").css('display', 'none');
		$("#f-workeTwoNull").css('display', 'block');
	}
	
	//设置成绩折线图
	function setScoreLine(data) {
		var xTime = [];
		var myScore = [];
		var avgScore = [];
		$.each(data,function(index,item){
			xTime.push(new Date(item.ansStartTime).format("MM/dd"));
			myScore.push(item.myScore);
			avgScore.push(item.classAvgScore);
		});
		myChart.setOption({
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
	//显示课程表
	function showScheduleDiv() {
		$("#scheduleNull").css('display', 'none');
		$("#schedule").css('display', 'table');
	}
	
	//课程表显示无数据
	function hiddenScheduleDiv() {
		$("#schedule").css('display', 'none');
		$("#scheduleNull").css('display', 'table');
	}
	
	//将课程表初始化置空
	function initScheduleDiv(){
		for(var i=1;i<=7;i++){
			$("#l"+i+"_r p").text("");
			$("#l"+i+"_r span").text("");
		}
	}
	
	//设置课程表
	function setScheduleDiv(lessonData) {
		//先获取时间,确定是周几
		var str_date = $("#time")[0].innerHTML.split("(")[1].split(")")[0];
		var date = new Date(str_date);
		var week = date.getDay();//当前是周几
		if(week == "6" || week == "0") {
			week = "1";
		}
//		var week = '1';
		//遍历选出该周的课
		var my_lesson = [];//用于存储该周的课
		var lesson = lessonData.lesson;//课程信息集合
//		var lessonTime = lessonData.lessonTime;//早读午休时间集合
		var order = lessonData.order;//节次时间集合
		//填入节次时间
		$.each(order,function(index,item){
			var orderId = item.orderId;
			var strTime = item.beginTime+"-"+item.endTime;
			$("#l"+orderId+"_l span").text(strTime);
		});
		//筛选课程
		$.each(lesson,function(index,item){
			if(item.week == week) {
				my_lesson.push(item);
			}
		});
		//填入课程表之前先初始化
		initScheduleDiv();
		//遍历筛选出的课程信息,填入课程表
		$.each(my_lesson,function(index,item){
			var orderId = item.lessonOrder;
			$("#l"+orderId+"_r p").text(item.subjectName);
			$("#l"+orderId+"_r span").text(item.teacherName);
		});
	}
	
	//返回日期显示的字符串
	function getNowDate(str) {
		var date = new Date(str);
		var weekArr = [ '星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ];
		var str_date = null;
		var week = null;
		if(date.getDay() == '6') {
			str_date = date.getDate() + 2;
			week = weekArr[1];
		}else if(date.getDay() == '0'){
			str_date = date.getDate() + 1;
			week = weekArr[1];
		}else{
			str_date = date;
			week = weekArr[date.getDay()];
		}
		var currentdate = " " + week + " " + "(" + new Date(str_date).format("yyyy-MM-dd") + ")" + " ";
		return currentdate;
	}
	
	//日期加一天
	function addDay(lessonData) {
		var strDate = $("#time")[0].innerHTML.split("(")[1].split(")")[0];
		var week = new Date(strDate).getDay();
		var date = null;
		if(week == "5") {
			date = new Date(strDate).setDate(new Date(strDate).getDate() + 3);
		}else{
			date = new Date(strDate).setDate(new Date(strDate).getDate() + 1);
		}
		$("#time")[0].innerHTML = getNowDate(new Date(date).format("yyyy-MM-dd"));
		//显示加一天的课表
		setScheduleDiv(lessonData);
	}
	
	//日期减一天
	function minusDay(lessonData) {
		var strDate = $("#time")[0].innerHTML.split("(")[1].split(")")[0];
		var week = new Date(strDate).getDay();
		var date = null;
		if(week == "1") {
			date = new Date(strDate).setDate(new Date(strDate).getDate() - 3);
		}else{
			date = new Date(strDate).setDate(new Date(strDate).getDate() - 1);
		}
		$("#time")[0].innerHTML = getNowDate(new Date(date).format("yyyy-MM-dd"));
		//显示减一天的课表
		setScheduleDiv(lessonData);
	}
	
	//有数据显示电子数阅读学科分布
	function showEBookCount() {
		$("#f-eBookCountNull").css('display', 'none');
		$("#eBookCount").css('display', 'block');
	}
	
	//无数据显示空数据
	function hiddenEBookCount() {
		$("#eBookCount").css('display', 'none');
		$("#f-eBookCountNull").css('display', 'block');
	}
	
	//设置电子数阅读学科分布
	function setEBookCount(data) {
		var legend_data = [];
		var series_data = [];
		$.each(data,function(index,item){
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
	
	//有数据显示学生课堂参与度
	function showStuClassActive() {
		$("#f-activeNull").css('display', 'none');
		$("#active").css('display', 'block');
	}
	
	//无数据显示学生课堂参与度空数据
	function hiddenStuClassActive() {
		$("#active").css('display', 'none');
		$("#f-activeNull").css('display', 'block');
	}
	
	//设置学生课堂参与度
	function setStuClassActive(data) {
		var legend_data = [];
		var series_data = [];
		$.each(data,function(index,item){
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
		});
		pieChart.setOption({
			legend : {
				data : legend_data
			},
			series : {
				name : '课程参与度',
				data : series_data
			}
		});
	}
	
	//有数据显示学生待完成作业
	function showMyHomework() {
		$("#f-STbodyNull").css('display', 'none');
		$("#f-STbody").css('display', 'table-row-group');
	}
	
	//无数据显示学生待完成作业空数据
	function hiddenMyHomework() {
		$("#f-STbody").css('display', 'none');
		$("#f-STbodyNull").css('display', 'block');
	}
	
	//设置学生待完成作业列表
	function setMyHomework(data) {
		$("#f-STbody").empty();
		$.each(data,function(index,item) {
			if(index >= 3) {
				return;
			}
			var tr = "<tr>" +
	                     "<td>"+ item.subjectName +"</td>" +
	                     "<td>"+ item.paperName +"</td>" +
	                     "<td>"+ item.ansStartTime +"</td>" +
	                     "<td>"+ item.ansEndTime +"</td>" +                           
	                     "<td>"+ item.paperCheckKindValue +"</td>" +
                     "</tr>";
			$("#f-STbody").append(tr);
		});
	}
	
	//设置个人和班级阅读直线图
	function setEbookReadLine(data){
		var xTime = [];
		var myScore = [];
		var avgScore = [];
		$.each(data,function(index,item){
			xTime.push(item.readDate);
			myScore.push(item.readNum.split("次")[0]);
			avgScore.push(item.classReadAverage);
		});
		lineChart.setOption({
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
	
	return {
		//学生查询有无未读消息
		getMessageUnreadByStu : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getMessageUnreadByStu.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					console.log(result.result);
					if(json_data.msgUnRead){
						//存在未读消息,则显示小红点
						$(".s-LImg").addClass("on");
					}
					console.log(json_data.msgUnRead)
				},
				error : function(result) {
					console.log(result);
				}
			});
		},
		
		//滚动消息获取
		getMessageByTeacher : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getMessageByTeacher.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
	    	        $("#f-news_loading").css({display:'block'});
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					var success = json_data.state;
					var totalPage = json_data.totalPage;
					if(success == "S"){
						var messages = json_data.message;
						if(messages == null || messages == undefined || messages == "") {
							$(".scroll-box").css('display', 'none');
							$(".scroll-boxNull").css('display', 'block');
							return;
						}
						$(".scroll-box").css('display', 'block');
						$(".scroll-boxNull").css('display', 'none');
						$.each(messages,function(index,item){
							if(index >= 2) {
								return;
							}
							var time = new Date(item.creatTime).format("yyyy-MM-dd hh:mm")
							$("#m"+index+"_t").html(item.title);
							$("#m"+index+"_d").html(item.crStffName + "  " + time);
						});
					}else{
						$(".scroll-box").css('display', 'none');
						$(".scroll-boxNull").css('display', 'block');
					}
				},
				complete: function () {
					$("#f-news_loading").css({display:'none'});
	    	    },
				error : function(result) {
					console.log(result);
					$(".scroll-box").css('display', 'none');
					$(".scroll-boxNull").css('display', 'block');
				}
			});
		},
		
		//获取课程表
		getNewSyllabus : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getNewSyllabus.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
	    	        $("#f-schedule_loading").css({display:'block'});
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					if(success == "S") {
						var lessonData = json_data.lessonData;
						if(lessonData == null || lessonData == undefined || lessonData == "") {
							hiddenScheduleDiv();
							return;
						}
						showScheduleDiv();
						setScheduleDiv(lessonData);
						//给日期加减按钮绑定事件
						$("#timeLeft").on("click",function(){
							minusDay(lessonData);
						});
						$("#timeRight").on("click",function(){
							addDay(lessonData);
						});
					}else{
						hiddenScheduleDiv();
					}
				},
				complete: function () {
					$("#f-schedule_loading").css({display:'none'});
	    	    },
				error : function(result) {
					hiddenScheduleDiv();
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
	    	        $("#f-workeTwo_loading").css({display:'block'});
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					var success = json_data.success;
					if(success) {
						var data = json_data.data;
						if(data == null || data == undefined || data == "") {
							hiddenScoreLine();
							return;
						}
						showScoreLine();
						setScoreLine(data);
					}else{
						hiddenScoreLine();
					}
				},
				complete: function () {
	    	        $("#f-workeTwo_loading").css({display:'none'});
	    	        $("#workeCont").css('opacity', '1');
	    	    },
				error : function(result) {
					hiddenScoreLine();
					console.log(result);
				}
			});
		},
		
		//查询当前用户、当前学科的成绩得分、班级排名、班级最高分、班级最低分、班级平均分、班级成绩中位数。
		queryStudentScoreData : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/queryStudentScoreData.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					$(".f-TworkOne div[class='f-Ttext']").css({display:'none'});
	    	        $("#f-workOne_loading").css({display:'block'});
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					var success = json_data.success;
					if(success) {
						var data = json_data.data;
						if(data == null || data == undefined || data == "") {
							hiddenRingScore();
							return;
						}
						showRingScore();
						$('#indicatorContainer').radialIndicator({
							radius : 60,
							barColor : '#5fd6a8',
							barWidth : 11,
							initValue : Math.round(data.myScore),
							roundCorner : true,
							percentage : true,
							fontSize : 1
						});
						setRingScore(data);
					}else{
						hiddenRingScore();
					}
				},
				complete: function () {
					$(".f-BworkOne div span").css('display', 'block');
					$(".f-TworkOne div[class='f-Ttext']").css({display:'block'});
	    	        $("#f-workOne_loading").css({display:'none'});
	    	    },
				error : function(result) {
					hiddenRingScore();
					console.log(result);
				}
			});
		},
		
		//11.3	学生课堂参与度    学生首页展示学生课堂评测参与学科对比统计图表
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
	    	        $("#f-activeBox_loading").css({display:'block'});
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					if(success == "S") {
						var data = json_data.statistics;
						if(data == null || data == undefined || data == "") {
							pieChart.hideLoading();
							hiddenStuClassActive();
							return;
						}
						pieChart.hideLoading();
						showStuClassActive();
						setStuClassActive(data);
					}else{
						pieChart.hideLoading();
						hiddenStuClassActive();
					}
				},
				complete: function () {
	    	        $("#f-activeBox_loading").css({display:'none'});
	    	        $("#active").css('opacity', '1');
	    	    },
				error : function(result) {
					pieChart.hideLoading();
					hiddenStuClassActive();
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
	    	        $("#eBookLineCont_loading").css({display:'block'});
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					if(success == "S") {
						var data = json_data.statistics;
						if(data == null || data == undefined || data == "") {
							lineChart.hideLoading();
							$("#eBookLineCont").css('display', 'none');
							$(".f-eBookLineContNull").css('display', 'block');
							return;
						}
						lineChart.hideLoading();
						$("#eBookLineCont").css('display', 'block');
						$(".f-eBookLineContNull").css('display', 'none');
						setEbookReadLine(data);
					}else{
						lineChart.hideLoading();
						$("#eBookLineCont").css('display', 'none');
						$(".f-eBookLineContNull").css('display', 'block');
					}
				},
				complete: function () {
	    	        $("#eBookLineCont_loading").css({display:'none'});
	    	        $("#eBookLineCont").css('opacity', '1');
	    	    },
				error : function(result) {
					console.log(result);
					lineChart.hideLoading();
					$("#eBookLineCont").css('display', 'none');
					$(".f-eBookLineContNull").css('display', 'block');
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
	    	        $("#eBookCount_loading").css({display:'block'});
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					if(success == "S") {
						var statistics = json_data.statistics;
						if(statistics == null || statistics == undefined || statistics == "") {
							hiddenEBookCount();
							return;
						}
						showEBookCount();
						setEBookCount(statistics);
					}else{
						hiddenEBookCount();
					}
				},
				complete: function () {
	    	        $("#eBookCount_loading").css({display:'none'});
	    	        $("#eBookCount").css('opacity', '1');
	    	    },
				error : function(result) {
					hiddenEBookCount();
					console.log(result);
				}
			});
		},
		
		//作业本  3.2我的作业列表接口
		queryMyHomework : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/queryMyHomework.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
	    	        $("#f-workNoFinish_loading").css({display:'block'});
	    	    },
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					var success = json_data.success;
					if(success) {
						var data = json_data.data;
						if(data == null || data == undefined || data == "") {
							hiddenMyHomework();
							return;
						}
						showMyHomework();
						setMyHomework(data);
					}else{
						hiddenMyHomework();
					}
				},
				complete: function () {
	    	        $("#f-workNoFinish_loading").css({display:'none'});
	    	    },
				error : function(result) {
					console.log(result);
					hiddenMyHomework();
				}
			});
		},
		
		//获取班级教师信息
		getStaffByClassId : function(data) {
			$.ajax({
				type : "post",
				async : false,//设置成同步
				url : "/CloudClassroom/getStaffByClassId.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				success : function(result) {
					var json_data = $.parseJSON(result.result);
					console.log(json_data);
					var success = json_data.status;
					if(success == "S"){
						var teacher = json_data.teacher;
						if(teacher != null && teacher != undefined && teacher != "") {
							cookie.setCookie("cc_subject",JSON.stringify(teacher));
							$("#f-courseBox").empty();
							$("#f-eBookBox").empty();
							$.each(teacher,function(index,item){
								var option = '<option value="'+ item.subjectId +'">'+ item.subjectName +'</option>';
								$("#f-courseBox").append(option);
								$("#f-eBookBox").append(option);
							});
							$("#f-courseBox option:first").prop("selected", 'selected');
							$("#f-eBookBox option:first").prop("selected", 'selected');
						}
					}
				},
				error : function(result) {
					console.log(result);
				}
			});
		},
		
	}
}();

$(function() {
	var $user = $.parseJSON(UserInfo.getUserInfo().user);
	var userCode = UserInfo.getUserInfo().userCode;
	var userId = $user.staffId;
	var classId = $user.classId;
	
	//获取班级下的教师和科目信息
	var getSubInfoBo = {
		"appKey" : "FHCC_WEB",
		"classId" : classId,
		"time": new Date().format("yyyy-MM-dd hh:mm:ss")
	}
	Index_Page.getStaffByClassId(getSubInfoBo);
	
	var data = {
			'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
//			'userCode' : 's5',
//			'classId' : '145',
			'classId' : classId,
			'title' : null,
			'startTime' : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"),
			'endTime' : new Date().format("yyyy-MM-dd"),
			'pageindex' : '1',
			'pageSize' : '8',
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	var data2 = {
			'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
			'classId' : classId,
//			'classId' : '138',
			'year' : new Date().getFullYear(),
			'termId' : '2',
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	var data3 = {
			"userId" : userId,
//			"userId" : "1115",
			"objectId" : $("#f-courseBox").val(),
//			"objectId" : "28",
			"startTime" : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"),
			"endTime" : new Date().format("yyyy-MM-dd"),
			"time" : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	var data4 = {
			'userId' : userId,
//			'userId' : '1115',
			'objectId' : $("#f-courseBox").val(),
//			'objectId' : '28',
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	var data5 = {
			'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
			'statisticsType' : '1',  //统计方式  0：按时间统计  1：按学科统计
			'subjectId' : null,     //学科编码(按学科统计时该字段为空)
			'classId' : classId,       //班级编码
//			'classId' : '138',       //班级编码
			"startTime" : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"),
			"endTime" : new Date().format("yyyy-MM-dd"),
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")

	};
	var data6 = {
			'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
			'subjectId' : $("#f-eBookBox").val(),
//			'subjectId' : '15',
			"startTime" : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"),
			"endTime" : new Date().format("yyyy-MM-dd"),
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")

	};
	var data7 = {
			'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
			'gradeId' : null,
			'classId' : null,
			"startTime" : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"),
			"endTime" : new Date().format("yyyy-MM-dd"),
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	var data8 = {
			"userId": userId,
//			"userId": "1115",
			"startTime": new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"),
			"endTime": new Date().format("yyyy-MM-dd hh:mm:ss"),
			"number": "3",
			"time":new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	var data9 = {
			'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
//	Index_Page.getMessageUnreadByStu(data9);
	Index_Page.getMessageByTeacher(data);
	Index_Page.getNewSyllabus(data2);
	Index_Page.queryMyHomework(data8);
	Index_Page.queryStudentScoreDataRank(data3);
	Index_Page.queryStudentScoreData(data4);
	Index_Page.getLessonNumOfSubject(data5);
	Index_Page.getEbookReadInfo(data6);
	Index_Page.getReadSubjectDistribution(data7);
})