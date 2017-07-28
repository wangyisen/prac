var width =$('.P_cont').width()
$('#one').css({width:width})
$('#two').css({width:width})
$('#three').css({width:width})
$('#four').css({width:width})
$('#RateChart').css({width:width})
//日期格式化
Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
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
//初始化日期选择器
$('.form_date').datetimepicker({
    language: 'zh-CN',
    weekStart: 1,
    todayBtn: 1,
    clearBtn: true,
    autoclose: 1,
    todayHighlight: 0,
    startView: 2,
    minView: 2,
    forceParse: 0
});

//设置日期输入框的默认值为当天
$("#Time").attr("value", new Date().format("yyyy-MM-dd"));

$("#s-Time").attr("value", new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"));
$("#e-Time").attr("value", new Date().format("yyyy-MM-dd"));

// 选择单次还是多次
if($('#singleday').is(":checked")){
     $('.lengthTime').css({display:'none'})
     $('.nowTime').css({display:'block'})
}else{
     $('.lengthTime').css({display:'block'})
     $('.nowTime').css({display:'none'})
}
$("input[name='sel-type']").click(function() {
    if($(this).val() == 'single') {
        $('.lengthTime').css({display:'none'})
        $('.nowTime').css({display:'block'})
    }
    if($(this).val() == 'length') {
       $('.lengthTime').css({display:'block'})
       $('.nowTime').css({display:'none'})
    }
});


// 切换按钮
function showChart(dom){
    $('.Content>div').css({opacity:'0',zIndex:'0'})
    $('#'+dom).css({opacity:'1',zIndex:'10'})
    $('.P_btn').removeClass("on");
    $('.'+dom).addClass("on");
    if(dom=='grade'){
        $('.class').css({display:'none'})
        $('.allClass').css({display:'none'})
        $('.object').css({display:'block'})
        
    }else if(dom=='myClass'){
        $('.class').css({display:'block'})
        $('.allClass').css({display:'none'})
        $('.object').css({display:'block'})
        //设置只在第一次点击的时候请求加载,之后直接显示
        if(!$('.'+dom).hasClass("f")){
        	P_Task_Page.quaryClassPublishWorkCount();
        	$('.'+dom).addClass("f");
        }
    }else if(dom == 'subject'){
        $('.class').css({display:'block'})
        $('.allClass').css({display:'none'})
        $('.object').css({display:'none'})
        if(!$('.'+dom).hasClass("f")){
        	P_Task_Page.quarySubjectPublishWorkCount();
        	$('.'+dom).addClass("f");
        }
    }else if(dom == 'teacher'){
        $('.class').css({display:'none'})
        $('.allClass').css({display:'block'})
        $('.object').css({display:'block'})
        if(!$('.'+dom).hasClass("f")){
        	P_Task_Page.queryTeacherPublishWorkCount();
        	$('.'+dom).addClass("f");
        }
    }
}
// 切换图表按钮
function  trigger(){
  var display =  $('.RateListBox').css('display');
  if(display == 'none'){
      $('.RateListBox').css({display:'block'})
      $('#RateChartBox').css({opacity:'0'})
  }else{
      $('.RateListBox').css({display:'none'})
      $('#RateChartBox').css({opacity:'1'})
  }
}

//发布作业量查询按钮
function queryPublishWorkCount(){
	if($(".P_btn.on").hasClass("grade")){
		//按年级查询
		P_Task_Page.quaryGradePublishWorkCount();
	}else if($(".P_btn.on").hasClass("myClass")){
		//按班级查询
		P_Task_Page.quaryClassPublishWorkCount();
	}else if($(".P_btn.on").hasClass("subject")){
		//按学科查询
		P_Task_Page.quarySubjectPublishWorkCount();
	}else{
		//按教师查询
		P_Task_Page.queryTeacherPublishWorkCount();
	}
}

//查询全部图表
function queryAllChart(){
	queryPublishWorkCount();
	
	P_Task_Page.querySchoolErrorKnowledgeRate();
}



var firstChart = echarts.init(document.getElementById('one'));
var firstOption = {
	color : [ '#3398DB' ],
	title : {
		show : false
	},
	grid : {
		top : '12%',
		left : '1.5%',
		right : '4%',
		bottom : '4%',
		containLabel : true
	},
	xAxis : [ {
		name : '年级',
		nameTextStyle : {
			color : '#000'
		},
		nameGap : 10,
		type : 'category',
		data : [ '一年级','二年级','三年级','四年级'],
		boundaryGap : 4,
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisLabel: {
			textStyle : {
				color : '#000'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		}
	} ],
	yAxis : [ {
		name : '次数\t\t\t\t\t',
		nameTextStyle : {
			color : '#000'
		},
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
		axisLabel: {
			textStyle : {
				color : '#000'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		}
	} ],
	animationDurationUpdate : 1200,
	series : [
			{
				name : 'shadowBar',
				type : 'bar',
				itemStyle : {
					normal : {
						color : '#f6f8fc'
					}
				},
				silent : true,
				barWidth : 30,
				barGap : '-100%', // Make series be overlap
				data : ['100','100','100','100'  ]
			},
			{
				name : 'valueBar',
				type : 'bar',
				barWidth : 30,
				z : 10,
				barGap : '-100%',
				itemStyle : {
					normal : {
						barBorderRadius : [ 3, 3, 0, 0 ],
						color : function(params) {
							// build a color map as your need.
							var colorList = [ '#55aded', '#59d7a7' ];
							return colorList[params.dataIndex % 2]
						}
					}
				},
				data : ['12','33','23','87'  ]
			} ]
};

firstChart.setOption(firstOption);

var secondChart = echarts.init(document.getElementById('two'));
var secondOption = {
	color : [ '#3398DB' ],
	title : {
		show : false
	},
	grid : {
		top : '12%',
		left : '1.5%',
		right : '4%',
		bottom : '4%',
		containLabel : true
	},
	xAxis : [ {
		name : '班级',
		nameTextStyle : {
			color : '#000'
		},
		nameGap : 10,
		type : 'category',
		data : [ '一(1)班','一(2)班','一(3)班','一(4)班'],
		boundaryGap : 4,
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisLabel: {
			textStyle : {
				color : '#000'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		}
	} ],
	yAxis : [ {
		name : '次数\t\t\t\t\t',
		nameTextStyle : {
			color : '#000'
		},
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
		axisLabel: {
			textStyle : {
				color : '#000'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		}
	} ],
	animationDurationUpdate : 1200,
	series : [
			{
				name : 'shadowBar',
				type : 'bar',
				itemStyle : {
					normal : {
						color : '#f6f8fc'
					}
				},
				silent : true,
				barWidth : 30,
				barGap : '-100%', // Make series be overlap
				data : ['100','100','100','100'  ]
			},
			{
				name : 'valueBar',
				type : 'bar',
				barWidth : 30,
				z : 10,
				barGap : '-100%',
				itemStyle : {
					normal : {
						barBorderRadius : [ 3, 3, 0, 0 ],
						color : function(params) {
							// build a color map as your need.
							var colorList = [ '#55aded', '#59d7a7' ];
							return colorList[params.dataIndex % 2]
						}
					}
				},
				data : ['12','33','23','87'  ]
			} ]
};

secondChart.setOption(secondOption);



var thirdChart = echarts.init(document.getElementById('three'));
var thirdOption = {
	color : [ '#3398DB' ],
	title : {
		show : false
	},
	grid : {
		top : '12%',
		left : '1.5%',
		right : '4%',
		bottom : '4%',
		containLabel : true
	},
	xAxis : [ {
		name : '学科',
		nameTextStyle : {
			color : '#000'
		},
		nameGap : 10,
		type : 'category',
		data : [ '语文','数学','英语','地理'],
		boundaryGap : 4,
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisLabel: {
			textStyle : {
				color : '#000'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		}
	} ],
	yAxis : [ {
		name : '次数\t\t\t\t\t',
		nameTextStyle : {
			color : '#000'
		},
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
		axisLabel: {
			textStyle : {
				color : '#000'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		}
	} ],
	animationDurationUpdate : 1200,
	series : [
			{
				name : 'shadowBar',
				type : 'bar',
				itemStyle : {
					normal : {
						color : '#f6f8fc'
					}
				},
				silent : true,
				barWidth : 30,
				barGap : '-100%', // Make series be overlap
				data : ['100','100','100','100'  ]
			},
			{
				name : 'valueBar',
				type : 'bar',
				barWidth : 30,
				z : 10,
				barGap : '-100%',
				itemStyle : {
					normal : {
						barBorderRadius : [ 3, 3, 0, 0 ],
						color : function(params) {
							// build a color map as your need.
							var colorList = [ '#55aded', '#59d7a7' ];
							return colorList[params.dataIndex % 2]
						}
					}
				},
				data : ['12','33','23','87'  ]
			} ]
};

thirdChart.setOption(thirdOption);

var fourChart = echarts.init(document.getElementById('four'));
var fourOption = {
	color : [ '#3398DB' ],
	title : {
		show : false
	},
	grid : {
		top : '12%',
		left : '1.5%',
		right : '4%',
		bottom : '4%',
		containLabel : true
	},
	xAxis : [ {
		name : '教师',
		nameTextStyle : {
			color : '#000'
		},
		nameGap : 10,
		type : 'category',
		data : [ '教师一','教师二','教师三','教师四'],
		boundaryGap : 4,
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisLabel: {
			textStyle : {
				color : '#000'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		}
	} ],
	yAxis : [ {
		name : '次数\t\t\t\t\t',
		nameTextStyle : {
			color : '#000'
		},
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
		axisLabel: {
			textStyle : {
				color : '#000'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		}
	} ],
	animationDurationUpdate : 1200,
	series : [
			{
				name : 'shadowBar',
				type : 'bar',
				itemStyle : {
					normal : {
						color : '#f6f8fc'
					}
				},
				silent : true,
				barWidth : 30,
				barGap : '-100%', // Make series be overlap
				data : ['100','100','100','100'  ]
			},
			{
				name : 'valueBar',
				type : 'bar',
				barWidth : 30,
				z : 10,
				barGap : '-100%',
				itemStyle : {
					normal : {
						barBorderRadius : [ 3, 3, 0, 0 ],
						color : function(params) {
							// build a color map as your need.
							var colorList = [ '#55aded', '#59d7a7' ];
							return colorList[params.dataIndex % 2]
						}
					}
				},
				data : ['12','33','23','87'  ]
			} ]
};

fourChart.setOption(fourOption);


var RateChart = echarts.init(document.getElementById('RateChart'));
var RateOption = {
	color : [ '#3398DB' ],
	title : {
		show : false
	},
	grid : {
		top : '12%',
		left : '1.5%',
		right : '4%',
		bottom : '4%',
		containLabel : true
	},
	xAxis : [ {
		name : '知识点',
		nameTextStyle : {
			color : '#000'
		},
		nameGap : 10,
		type : 'category',
		data : [ ],
		boundaryGap : 4,
		axisLine : {
			show : true,
			lineStyle : {
				color : '#999999'
			}
		},
		axisLabel: {
			textStyle : {
				color : '#000'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		}
	} ],
	yAxis : [ {
		name : '百分比(%)',
		nameTextStyle : {
			color : '#000'
		},
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
		axisLabel: {
			textStyle : {
				color : '#000'
			}
		},
		axisTick : {
			show : false,
			alignWithLabel : true
		}
	} ],
	animationDurationUpdate : 1200,
	series : [
			{
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
			},
			{
				name : 'valueBar',
				type : 'bar',
				barWidth : 20,
				z : 10,
				barGap : '-100%',
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

RateChart.setOption(RateOption);

window.onresize = function(){
	firstChart.resize();
	secondChart.resize();
	thirdChart.resize();
	fourChart.resize();
	RateChart.resize();
};