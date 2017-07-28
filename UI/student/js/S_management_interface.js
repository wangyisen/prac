var T_Management_Page = new function() {

	//初始化课程表
	function initScheduleDiv() {
		$("#G-timeMorn").text("早读");
		$("#G-timeAft").text("午休");
		for(var i=1;i<=7;i++) {
			$("#lessonTime_"+i).html("");
		}
		for(var i=1;i<=7;i++) {
			for(var j=1;j<=5;j++) {
				$("#l"+i+"_w"+j+"_s").html("");
				$("#l"+i+"_w"+j+"_n").html("");
			}
		}
	}
	
	//设置课程表
	function setScheduleDiv(data) {
		//设置课程时间
		var lesson = data.lesson;
		var lessonTime = data.lessonTime;
		var order = data.order;
		//填入早读,午休时间
		$.each(lessonTime,function(index,item){
			if(item.type == "1") {
				//早读时间
				$("#G-timeMorn").text("");
				$("#G-timeMorn").text("早读("+item.beginTime.split(":")[0]+":"+item.beginTime.split(":")[1]
									+"-"+item.endTime.split(":")[0]+":"+item.endTime.split(":")[1]+")");
			}
			if(item.type == "2") {
				//早读时间
				$("#G-timeAft").text("");
				$("#G-timeAft").text("午休("+item.beginTime.split(":")[0]+":"+item.beginTime.split(":")[1]
									+"-"+item.endTime.split(":")[0]+":"+item.endTime.split(":")[1]+")");
			}
		});
		//填入节次时间
		$.each(order,function(index,item){
			var orderId = item.orderId;
			var strTime = item.beginTime.split(":")[0]+":"+item.beginTime.split(":")[1]+
							"-"+item.endTime.split(":")[0]+":"+item.endTime.split(":")[1];
			$("#lessonTime_"+orderId).html(strTime);
		});
		//填入详细课程
		$.each(lesson,function(index,item){
			var week = item.week;
			var lessonId = item.lessonOrder;
			$("#l"+lessonId+"_w"+week+"_s").html(item.subjectName).parents("td").removeClass("isNull");
			$("#l"+lessonId+"_w"+week+"_n").html(item.teacherName);
		});
	}
	
	//设置食谱
	function setRecipe(data){
		$.each(data,function(index,item){
			if(item.timePoint == "1"){
				console.log(item);
				var str = $("#r1_w"+item.severalWeek).html();
				var arr = null;
				if(str != ""){
					arr = str.split("，");
				}else{
					arr = [];
				}
				arr.push(item.cookName);
				str = arr.join("，");
				//早餐
				$("#r1_w"+item.severalWeek).html(str);
			}else{
				var str = $("#r"+item.timePoint+"_"+item.cookType+"_w"+item.severalWeek).html();
				var arr = null;
				if(str != ""){
					arr = str.split("，");
				}else{
					arr = [];
				}
				arr.push(item.cookName);
				str = arr.join("，");
				$("#r"+item.timePoint+"_"+item.cookType+"_w"+item.severalWeek).html(str);
			}
		});
	}
	
	return {
		
		//获取课程表
		getNewSyllabus : function(data) {
			initScheduleDiv();
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getNewSyllabus.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					//显示加载图标,隐藏数据模块
    				$("#timeTables .loadingTips").show();
    				$("#timeTables .G-TimeBody").hide();
			    },
				success : function(result) {
					$("#timeTables .loadingTips").hide();
					$("#timeTables .G-TimeBody").show();
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					if(success == "S"){
						var lessonData = json_data.lessonData;
						if(lessonData.lesson == null || lessonData.lesson == undefined || lessonData.lesson == "") {
							return;
						}
						setScheduleDiv(lessonData);
					}
				},
				error : function(result) {
					console.log(result);
				}
			});
		},
		
		//获取一周食谱
		getNewWeekCook : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getNewWeekCook.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					//显示加载图标,隐藏数据模块
    				$("#Recipes .loadingTips").show();
    				$("#Recipes .recipes-table-div").hide();
			    },
				success : function(result) {
					$("#Recipes .loadingTips").hide();
    				$("#Recipes .recipes-table-div").show();
					var json_data = $.parseJSON(result.result);
//					console.log(json_data);
					var success = json_data.status;
					if(success == "S"){
						var cookData = json_data.cookData;
						if(cookData == null || cookData == undefined || cookData == "") {
							
							return;
						}
						setRecipe(cookData);
	    				
					}
				},
				error : function(result) {
					console.log(result);
				}
			});
		},
		
		//获取班级教师信息
		getStaffByClassId : function(data) {
			$.ajax({
				type : "post",
				async : true,
				url : "/CloudClassroom/getStaffByClassId.do",
				data : {
					"inparam" : JSON.stringify(data)
				},
				dataType : "json",
				beforeSend: function () {
					//显示加载图标,隐藏数据模块
    				$("#Teachers .loadingTips").show();
    				$("#Teachers .teachers-table-div").hide();
			    },
				success : function(result) {
					$("#Teachers .loadingTips").hide();
					$("#Teachers .teachers-table-div").show();
					var json_data = $.parseJSON(result.result);
					var success = json_data.status;
					if(success == "S"){
						var teacher = json_data.teacher;
						var student = json_data.student;
						if(teacher != null && teacher != undefined && teacher != "") {
							$(".s-tableBody").empty();
							var num = 1;
							$.each(teacher,function(index,item){
								if(index < 10) {
									num = "0" + num;
								}
								var tr = "<tr class='teachers-table-tr'>" +
								"<td>"+ num +"</td>" +
								"<td>"+ item.subjectName +"</td>" +
								"<td>"+ item.teacherName;
								if(item.isClassTeacher){
									tr += "<br><span style='color: red;'>班主任</span>";
								}
								$(".s-tableBody").append(tr);
								num ++;
							});
		    				$("#Teachers .teachers-table-div").show();
						}
					}
				},
				error : function(result) {
					console.log(result);
				}
			});
		},
		
		//获取座位表信息
		getNewSeatClass : function(data) {
			$.ajax({
	    		type : "post",
	    		async : true,
	    		url : "/CloudClassroom/getNewSeatClass.do",
	    		data : {
	    			"inparam" : JSON.stringify(data)
	    		},
	    		dataType : "json",
	    		beforeSend: function () {
					//显示加载图标,隐藏数据模块
    				$("#seatingChart .loadingTips").show();
    				$("#seatingChart .seatCon-seats,#seatingChart .seatCon-null").hide();
			    },
	    		success : function(result) {
	    			var json_data = $.parseJSON(result.result);
	    			$("#seatingChart .loadingTips,#seatingChart .seatCon-null").hide();
	    			console.log(json_data);
	    			var success = json_data.status;
	    			if(success == "S"){
	    				var seat = json_data.seat;
	    				if(seat != null && seat != undefined && seat != "") {
	    					var line = seat.line;
	    					var row = seat.row;
	    					var corridor = seat.corridor;
	    					var lineData = corridor.lineData;
	    					var rowData = corridor.rowData;
	    					var student = seat.student;
	    					createSeatTable(row,line,rowData,lineData);
	    					$.each(student,function(index,item){
	    						var valuex = item.row;
	    						var valuey = item.line;
	    						var valueName = item.userName;
	    						var userCode = item.userCode;
	    						$("tr[valuex="+ valuex +"] .desk[valuey="+ valuey +"]").attr("value",userCode);
	    						$("tr[valuex="+ valuex +"] .desk[valuey="+ valuey +"]").html(valueName);
	    					});
		    				//显示加载好的数据,隐藏加载图标
		    				$("#seatingChart .loadingTips,#seatingChart .seatCon-null").hide();
		    				$("#seatingChart .seatCon-seats").show();
	    				}
	    				
	    			}
	    		},
	    		error : function(result) {
	    			console.log(result);
    				//显示加载好的数据,隐藏加载图标
    				$("#seatingChart .loadingTips,#seatingChart .seatCon-seats").hide();
    				$("#seatingChart .seatCon-null").show();
	    		}
	    	});
		}
	}
}();

$(function() {
	var userCode = UserInfo.getUserInfo().userCode;
	var $user = $.parseJSON(UserInfo.getUserInfo().user);
	var classId = $user.classId;
	var data = {
			'appKey' : 'FHCC_STUDENT',
			'userCode' : userCode,
//			'userCode' : 'stu15',
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	var data2 = {
			'appKey' : 'FHCC_WEB',
			'classId' : classId,
//			'classId' : '155',
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	var data3 = {
			'appKey' : 'FHCC_WEB',
			'userCode' : userCode,
//			'userCode' : 'monday',
			'classId' : classId,
//			'classId' : '138',
			'year' : new Date().getFullYear(),
			'termId' : '2',
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	var data4 = {
			'appKey' : 'FHCC_WEB',
			'classId' : classId,
//			'classId':'145',
			'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	//获取消息列表
	T_Management_Page.getNewSyllabus(data3);
	T_Management_Page.getNewWeekCook(data);
	T_Management_Page.getStaffByClassId(data2);
})