$(document).ready(function(){
    var height = $("#D-class").innerHeight()
    $(".D-body,#D-work,#D-book").css({"height":height,"overflow":"hidden"});
});
// 内容部分导航栏的切换
$('.G-HeadUl>li').click(function(){
    $('.G-HeadUl>li').css({borderBottom:'#ffffff 0px solid',color:'#999999'})
    $(this).css({borderBottom:'#4aaaf4 2px solid',color:'#4aaaf4'})
    $(".D-body>div").css({"opacity":'0','zIndex':'5'})
    var myId=$(this).attr('data-id') 
    $("#" + myId).css({"opacity":'1','zIndex':'10'})
    $("#D-class,#D-work,#D-book").css({"height":"auto"});
    var height = $("#" + myId).innerHeight()
    $(".D-body").css({"height":height,"overflow":"hidden"});
    $("#D-class,#D-work,#D-book").css({"height":height});
    
    var userCode = UserInfo.getUserInfo().userCode;
	var $user = $.parseJSON(UserInfo.getUserInfo().user);
	var userId = $user.staffId;
	var classId = $user.classId;
    if(myId == "D-work"){
    	//作业统计
    	var data = {
    			"userId" : userId,
//    			"userId" : "1115",
//    			"objectId" : "28",
				"objectId" : $("#score_subSel").val(),
//				"startTime" : "2017-01-15 15:34:25",
				"startTime" : $("#scoreTimeL").val(),
//				"endTime" : "2017-05-24 15:34:25",
				"endTime" : $("#scoreTimeR").val(),
				"time" : new Date().format("yyyy-MM-dd hh:mm:ss")
    	};
    	S_DataCenter_Page.queryStudentScoreDataRank(data);
    	var data2 = {
    			"userId" : userId,
//    			"userId" : "1115",
    			"classId" : classId,
//    			"classId" : '34',
//    			"objectId" : "28",
				"objectId" : $("#costTime_subSel").val(),
//				"startTime" : "2017-01-15 15:34:25",
				"startTime" : $("#CostTimeL").val(),
//				"endTime" : "2017-05-24 15:34:25",
				"endTime" : $("#CostTimeR").val(),
				"time" : new Date().format("yyyy-MM-dd hh:mm:ss")
    	};
    	S_DataCenter_Page.queryStudentFinishTimeRatio(data2);
    	var data3 = {
    			"classId" : classId,
//    			"classId" : "34",
//				"startTime" : "2017-04-15 15:34:25",
				"startTime" : $("#errorRateTimeL").val(),
//				"endTime" : "2017-05-24 15:34:25",
				"endTime" : $("#errorRateTimeR").val(),
    			"userId" : userId,
//    			"userId" : '1115',
    			"objectId" : "28",
//    			"paperId" : "42"
    	};
    	S_DataCenter_Page.queryStudentErrorRate(data3);
    }
    if(myId == "D-book"){
		//电子课本统计
		var data = {
				'appKey' : 'FHCC_WEB',
				'userCode' : userCode,
//				'userCode' : 's7',
				'subjectId' : $("#read_subSel").val(),
//				'subjectId' : '15',
				"startTime" : $("#ENumTimeL").val(),
				"endTime" : $("#ENumTimeR").val(),
				'time' : new Date().format("yyyy-MM-dd hh:mm:ss")

		};
		S_DataCenter_Page.getEbookReadInfo(data);
		var data2 = {
				'appKey' : 'FHCC_WEB',
				'userCode' : userCode,
//				'userCode' : 'monday',
				'gradeId' : null,
				'classId' : classId,
//				'classId' : '138',
//				"startTime" : "2017-01-15 15:34:25",
				"startTime" : $("#E-bookDisTimesL").val(),
				"endTime" : $("#E-bookDisTimeR").val(),
				'time' : new Date().format("yyyy-MM-dd hh:mm:ss")

		};
		S_DataCenter_Page.getReadSubjectDistribution(data2);
	}
});

//初始化日期选择器
$('.form_date').datetimepicker({
    language: 'zh-CN',
    weekStart: 1,
    todayBtn: 1,
    clearBtn: 1,
    autoclose: 1,
    todayHighlight: 0,
    startView: 2,
    minView: 2,
    forceParse: 0
});
//设置日期输入框的默认值为当天
$("#s-Time").attr("value", new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"));
$("#e-Time").attr("value", new Date().format("yyyy-MM-dd"));

$("#L-Time").attr("value", new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"));
$("#R-Time").attr("value", new Date().format("yyyy-MM-dd"));

$("#ENumTimeL").attr("value", new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"));
$("#ENumTimeR").attr("value", new Date().format("yyyy-MM-dd"));

$("#ESubTimeL").attr("value", new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"));
$("#ESubTimeR").attr("value", new Date().format("yyyy-MM-dd"));

$("#scoreTimeL").attr("value", new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"));
$("#scoreTimeR").attr("value", new Date().format("yyyy-MM-dd"));

$("#CostTimeL").attr("value", new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"));
$("#CostTimeR").attr("value", new Date().format("yyyy-MM-dd"));

$("#errorRateTimeL").attr("value", new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"));
$("#errorRateTimeR").attr("value", new Date().format("yyyy-MM-dd"));

// 课堂参与度图表的切换
function showActChart(){
    $('.stat-time').addClass("on");
    $('.stat-sub').removeClass("on");
    $('#interact_subSel').css({'display':'block'})
    $('#participateChart').css({'opacity':'1','z-index':'10'})
    $('#participatePie').css({'opacity':'0','z-index':'5'})
	$('.Null-pateChart').css({'display':'none'})
	$('.Null-patePie').css({'display':'none'})
	$('.pateChartLoading').css({'display':'none'})
	$('.patePieLoading').css({'display':'none'})
	// 圆环中间的文字
	$('.numBox').css({'opacity':'0','z-index':'5'})
}
function showActPie(){
    $('.stat-sub').addClass("on");
    $('.stat-time').removeClass("on");
    $('#participatePie').css({'opacity':'0','z-index':'10'})
	$('.numBox').css({'opacity':'0','z-index':'10'})
	$('.Null-pateChart').css({'display':'none'})
	$('.Null-patePie').css({'display':'none'})
	$('.patePieLoading').css({'display':'block'})
	$('.pateChartLoading').css({'display':'none'})
    $('#participateChart').css({'opacity':'0','z-index':'5'})
    $('#interact_subSel').css({'display':'none'})
    
    var userCode = UserInfo.getUserInfo().userCode;
	var $user = $.parseJSON(UserInfo.getUserInfo().user);
	var userId = $user.staffId;
	var classId = $user.classId;
    var data = {
		'appKey' : 'FHCC_WEB',
		'userCode' : userCode,
		'statisticsType' : '1',  //统计方式  0：按时间统计  1：按学科统计
		'subjectId' : '',     //学科编码(按学科统计时该字段为空)
		'classId' : classId,       //班级编码
		"startTime" : $("#L-Time").val(),
		"endTime" : $("#R-Time").val(),
		'time' : new Date().format("yyyy-MM-dd hh:mm:ss")
    };
    S_DataCenter_Page.getLessonNumOfSubject(data);
}




if($('#Er-moreTime').is(":checked")){
     $('.Er-chooseTime').css({display:'none'})
}else{
     $('.Er-chooseTime').css({display:'block'})
}
$("input[name='errorRate']").click(function() {
    if($(this).val() == 'more') {
        $('.Er-chooseTime').css({display:'none'})
    }
    if($(this).val() == 'single') {
       $('.Er-chooseTime').css({display:'block'})
    }
});

// 切换图表
function toggleChart(){
	var display=  $('.errorRateChartBox').css('display')

 	if(display=='none'){
		$('.errorRateChartBox').css({display:'block'});
		$('.errorRateListBox').css({display:'none'});
	}else{
		$('.errorRateChartBox').css({display:'none'});
		$('.errorRateListBox').css({display:'block'});
	}
    $("#D-class,#D-work,#D-book").css({"height":"auto"});
    $(".D-body").css({"height":"auto","overflow":"hidden"});
}


// 弹出框选中li的背景颜色
$('.ul-selectBook>li>div>input').click(function(){
    console.log(11)
    $('.ul-selectBook>li').css({backgroundColor:'#fff'})
    $(this).parents('li').css({backgroundColor:'#f6f8fc'})
})
// 选择作业弹出框
function chossWork(){
    $('#selectBook').css({display:'block'})
    // 清空选项
    $("#selectBook input[type='radio']").prop("checked",false);
	//滚动条显示 横向滚动条隐藏
	$(".nicescroll-rails").show();
	$("[id$='-hr']").hide();
}

function createSeatTable(){
	var li = $('.ul-selectBook>li');
    var idStr;
    for (var i=0;i<li.length;i++){
       var $li=$('.ul-selectBook>li');
       var $input = $li.eq(i).find("input[type='radio']");
       var id_input = $input.attr("id");
       
       if($input.is(':checked')){
           idStr = id_input;
       }
   }
    var subject = $("#"+idStr).parents("li").find("label").text();
    var time= $("#"+idStr).parents("li").find(".year").text();
    var val = $("#"+idStr).val();
    $('#er-ChossText').css({display:'block'}).text(subject+ " " + time);
    $('#er-ChossText').attr('value',val);
    $('#er-chossHint').css({display:'none'})
    $('#selectBook').css({display:'none'})
}

$('.er-chooseTime').hover(function(){
    console.log($('#er-ChossText').css("display"))
     if($('#er-ChossText').css("display")=='block'){
        var myText = $('#er-ChossText').text();
        $('.er-activechoose').after('<span id="showChossText">' + myText + '</span>');
     }
},function(){
    $('#showChossText').remove();
})

function closeChooseWorke(){
    $('#selectBook').css({display:'none'});
	//滚动条隐藏
	$(".nicescroll-rails").hide();
}


// 图表内容
//学生课堂互动成绩曲线图
var ActChart = echarts.init(document.getElementById('activeChart'));
var ActOption = {
	title : {
		show : false
	},
	grid : {
		top : '17%',
		left : '0%',
		right : '3%',
		bottom : '5%',
		containLabel : true
	},
	legend : {
		top:'3%',
		right : '3%',
		data : [ {
			name : '个人分数',
			icon : 'line'
		}, {
			name : '班级均分',
			icon : 'line'
		} ]
	},
	toolbox : {
		show : false
	},
	xAxis : {
		name : '日期',
		nameLocation : 'end',
		type : 'category',
		boundaryGap : false,
		nameGap : 3,
		data : [  ],
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisTick : {
			show : false
		}
	},
	yAxis : {
		name : '分数\t\t',
		nameLocation : 'end',
		type : 'value',
//		max : '100',
		splitArea : {
			show : false,
			interval : 2
		},
		splitLine: {
            show: true,
            lineStyle: {
                color: '#f6f8fc',
                width: 10
            }
        },
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisTick : {
			show : false
		}
	},
	series : [ {
		name : '个人分数',
		type : 'line',
		lineStyle : {
			normal : {
				color : '#ff8a74'
			}
		},
		itemStyle : {
			normal : {
				color : '#ff8a74'
			}
		},
		symbol : 'circle',
		symbolSize : '7',
		data : [  ]

	}, {
		name : '班级均分',
		type : 'line',
		lineStyle : {
			normal : {
				color : '#5ab2f5'
			}
		},
		itemStyle : {
			normal : {
				color : '#5ab2f5'
			}
		},
		symbol : 'circle',
		symbolSize : '7',
		data : [  ]
	} ]
};
ActChart.setOption(ActOption);
//学生课堂参与度 按时间统计
var partChart = echarts.init(document.getElementById('participateChart'));
var partOption = {
	title : {
		show : false
	},
	grid : {
		top : '15%',
		left : '0%',
		right : '4%',
		bottom : '5%',
		containLabel : true
	},
	tooltip : {
		trigger : 'axis',
		formatter : function(params, ticket, callback) {
			var res ='得分率：' + params[0].value;
			return res;
		}
	},
	toolbox : {
		show : false
	},
	xAxis : {
		name : '日期',
		nameLocation : 'end',
		nameGap : 18,
		type : 'category',
		boundaryGap : false,
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		},
		data : [ ]
	},
	yAxis : {
		name : '次数\t\t\t\t\t\t\t',
		nameLocation : 'end',
		type : 'value',
		max : '100',
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		},
		splitArea : {
			show : false,
			interval : 0
		},
		splitLine : {
			show : true,
			lineStyle : {
				color : '#f6f8fc',
				width : 10
			}
		}
	},
	series : [ {
		name : '课堂参与度曲线',
		type : 'line',
		symbol : 'circle',
		lineStyle : {
			normal : {
				color : '#5ab2f5'
			}
		},
		itemStyle : {
			normal : {
				color : '#5ab2f5'
			}
		},
		areaStyle : {
			normal : {
				color : '#f2f9fe'
			}
		},
		symbolSize : '7',
        
		data : [ ]

	} ]
};
partChart.setOption(partOption);
//学生课堂参与度 学科统计
var pieChart = echarts.init(document.getElementById('participatePie'));
var pieOption = {
	title : {
		text : '',
		x : 'center',
		y : '30%',
		textStyle : {
			fontWeight : 'normal',
			fontSize : 20
		}
	},
	legend : {
		orient : 'horizontal',
		right : 'center',
		width : '100%',
		bottom : '5%',
		data : [  ],
		itemWidth : 20,
		itemHeight : 10,

	},
	series : [ {
		name : '课程参与度',
		type : 'pie',
		selectedMode : false,
		hoverAnimation : false,
		radius : [ '55%', '68%' ],
		center : [ '50%', '50%' ],
		label : {
			normal : {
				show : false,
				position : 'inner',
				textStyle : {
					color : '#fff',
					fontSize : 14
				}
			}
		},
		itemStyle : {
			normal : {
				borderWidth : 4,
				borderColor : '#fff',
			},
		},
		labelLine : {
			normal : {
				show : false
			}
		},
		data : [  ]
	} ],
	color : [ '#8c89c6', '#ff7a62', '#5fd6a8', '#6cd3f1', '#329cf0', '#fedc82' ]
};
pieChart.setOption(pieOption);

//作业成绩曲线
var scorChart = echarts.init(document.getElementById('scoreChart'));
var scorOption = {
	title : {
		show : false
	},
	grid : {
		top : '17%',
		left : '0%',
		right : '3%',
		bottom : '5%',
		containLabel : true
	},
	legend : {
		top:'3%',
		right : '3%',
		data : [ {
			name : '个人分数',
			icon : 'line'
		}, {
			name : '班级均分',
			icon : 'line'
		} ]
	},
	toolbox : {
		show : false
	},
	xAxis : {
		name : '日期',
		nameLocation : 'end',
		type : 'category',
		boundaryGap : false,
		nameGap : 3,
		data : [  ],
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisTick : {
			show : false
		}
	},
	yAxis : {
		name : '分数\t\t\t\t\t\t\t\n',
		nameLocation : 'end',
		type : 'value',
		max : '100',
		splitArea : {
			show : false,
			interval : 2
		},
		splitLine: {
            show: true,
            lineStyle: {
                color: '#f6f8fc',
                width: 10
            }
        },
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisTick : {
			show : false
		}
	},
	series : [ {
		name : '个人分数',
		type : 'line',
		lineStyle : {
			normal : {
				color : '#ff8a74'
			}
		},
		itemStyle : {
			normal : {
				color : '#ff8a74'
			}
		},
		symbol : 'circle',
		symbolSize : '7',
		data : [  ]

	}, {
		name : '班级均分',
		type : 'line',
		lineStyle : {
			normal : {
				color : '#5ab2f5'
			}
		},
		itemStyle : {
			normal : {
				color : '#5ab2f5'
			}
		},
		symbol : 'circle',
		symbolSize : '7',
		data : [  ]
	} ]
};
scorChart.setOption(scorOption);
//作业完成时长曲线
var CosChart = echarts.init(document.getElementById('CostTimeChart'));
var CosOption = {
	title : {
		show : false
	},
	grid : {
		top : '17%',
		left : '0%',
		right : '3%',
		bottom : '5%',
		containLabel : true
	},
	legend : {
		top:'3%',
		right : '3%',
		data : [ {
			name : '个人用时',
			icon : 'line'
		}, {
			name : '班级平均用时',
			icon : 'line'
		} ]
	},
	toolbox : {
		show : false
	},
	xAxis : {
		name : '日期',
		nameLocation : 'end',
		type : 'category',
		boundaryGap : false,
		nameGap : 3,
		data : [  ],
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisTick : {
			show : false
		}
	},
	yAxis : {
		name : '时间(分)\t\t\t',
		nameLocation : 'end',
		type : 'value',
		max : '100',
		splitArea : {
			show : false,
			interval : 2
		},
		splitLine: {
            show: true,
            lineStyle: {
                color: '#f6f8fc',
                width: 10
            }
        },
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisTick : {
			show : false
		}
	},
	series : [ {
		name : '个人用时',
		type : 'line',
		lineStyle : {
			normal : {
				color : '#ff8a74'
			}
		},
		itemStyle : {
			normal : {
				color : '#ff8a74'
			}
		},
		symbol : 'circle',
		symbolSize : '7',
		data : [  ]

	}, {
		name : '班级平均用时',
		type : 'line',
		lineStyle : {
			normal : {
				color : '#5ab2f5'
			}
		},
		itemStyle : {
			normal : {
				color : '#5ab2f5'
			}
		},
		symbol : 'circle',
		symbolSize : '7',
		data : [  ]
	} ]
};
CosChart.setOption(CosOption);
//知识点错误率
var barChart = echarts.init(document.getElementById('errorRateChart'));
var barOption = {
	color : [ '#5fd6a8', '#fbb537' ],
	title : {
		show : false
	},
	tooltip : {
		formatter : function(params, ticket, callback) {
			var res = '语文文言文知识点<br/>';
			res += '错误率:' + params.value + '%<br/>错误次数:' + params.value + '次';
			return res;
		}
	},
	grid : {
		top : '15%',
		left : '1%',
		right : '4%',
		bottom : '5%',
		containLabel : true
	},
	xAxis : [ {
		name : '知识点',
		nameGap : 0,
		type : 'category',
		data : [  ],
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		}
	} ],
	yAxis : [ {
		name : '百分比(%)\t\t',
		type : 'value',
		splitLine : {
			show : false
		},
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		}
	} ],
	animationDurationUpdate : 1200,
	series : [ {
		name : 'shadowBar',
		type : 'bar',
		itemStyle : {
			normal : {
				color : '#f6f8fc'
			}
		},
		silent : true,
		barWidth : 20,
		barGap : '-100%', // Make series be overlap
		data : [  ]
	}, {
		name : 'valueBar',
		type : 'bar',
		barWidth : 20,
		z : 10,
		itemStyle : {
			normal : {
				barBorderRadius : [ 3, 3, 0, 0 ],
				color : function(params) {
					// build a color map as your need.
					var colorList = [ '#5fd6a8', '#fbb537' ];
					return colorList[params.dataIndex % 2]
				}
			}
		},
		data : [  ]
	} ]
};
barChart.setOption(barOption);

//电子书阅读统计时间分布
var EbookChart = echarts.init(document.getElementById('E-bookChart'));
var chaOption = {
	title : {
		show : false
	},
	grid : {
		top : '17%',
		left : '0%',
		right : '3%',
		bottom : '5%',
		containLabel : true
	},
	tooltip : {
		trigger : 'axis',
		formatter : '{a0}: {c0}次<br />{a1}: {c1}次'
	},
	legend : {
		top:'3%',
		right : '3%',
		data : [ {
			name : '个人阅读次数',
			icon : 'line'
		}, {
			name : '班级平均阅读次数',
			icon : 'line'
		} ]
	},
	toolbox : {
		show : false
	},
	xAxis : {
		name : '日期',
		nameLocation : 'end',
		type : 'category',
		boundaryGap : false,
		nameGap : 3,
		data : [  ],
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisTick : {
			show : false
		}
	},
	yAxis : {
		name : '次数\t\t\t\t\t',
		nameLocation : 'end',
		type : 'value',
		max : '100',
		splitArea : {
			show : false,
			interval : 2
		},
		splitLine: {
            show: true,
            lineStyle: {
                color: '#f6f8fc',
                width: 10
            }
        },
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisTick : {
			show : false
		}
	},
	series : [ {
		name : '个人阅读次数',
		type : 'line',
		lineStyle : {
			normal : {
				color : '#ff8a74'
			}
		},
		itemStyle : {
			normal : {
				color : '#ff8a74'
			}
		},
		symbol : 'circle',
		symbolSize : '7',
		data : [  ]

	}, {
		name : '班级平均阅读次数',
		type : 'line',
		lineStyle : {
			normal : {
				color : '#5ab2f5'
			}
		},
		itemStyle : {
			normal : {
				color : '#5ab2f5'
			}
		},
		symbol : 'circle',
		symbolSize : '7',
		data : [  ]
	} ]
};
EbookChart.setOption(chaOption);
//电子科学分布
var eBookCountChart = echarts.init(document.getElementById('E-bookPie'));
var eBookCountOption = {
	title : {
		show : false
	},
	tooltip : {
		show : true,
		trigger : 'item',
		formatter : function(params, ticket, callback) {
			var res = params.name + '<br/>' + params.value + '次  '
					+ params.percent + '%';
			return res;
		}
	},
	legend : {
		orient : 'horizontal',
		right : 'center',
		bottom : '6%',
		width : '100%',
		data : [ ],
		itemWidth : 12,
		itemHeight : 10,

	},
	series : [ {
		name : '电子书阅读学科分布图',
		type : 'pie',
		selectedMode : false,
		hoverAnimation : false,
		radius : [ '%', '75%' ],
		center : [ '50%', '45%' ],
		label : {
			normal : {
				show : false,
				position : 'outside',
				textStyle : {
					color : '#000',
					fontSize : 14
				},
				formatter : function(params, ticket, callback) {
					var res = params.name + '\n' + params.value + '次\n'
							+ params.percent + '%';
					return res;
				}
			}
		},
		itemStyle : {
			normal : {
				borderWidth : 2,
				borderColor : '#fff',
			},
		},
		labelLine : {
			normal : {
				show : false,
				lineStyle : {
					color : '#000'
				}
			}
		},
		markLine : {
			symbol : 'circle',
			normal : {
				show : true
			}
		},
		data : [  ]
	} ],
	color : [ '#8c89c6', '#ff7a62', '#5fd6a8', '#6cd3f1', '#329cf0', '#fedc82' ]
};
eBookCountChart.setOption(eBookCountOption);

//设置图表随窗口大小自适应
window.onresize = function(){
	ActChart.resize();
	partChart.resize();
	pieChart.resize();
	scorChart.resize();
	CosChart.resize();
	barChart.resize();
	EbookChart.resize();
	eBookCountChart.resize();
};