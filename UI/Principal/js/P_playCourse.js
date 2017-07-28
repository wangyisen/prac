var width =$('.P_cont').width()
$('#one').css({width:width})
$('#two').css({width:width})
$('#three').css({width:width})

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
    	//年级统计
        $('.class').css({display:'none'})
        $('.allClass').css({display:'none'})
        $('.object').css({display:'block'})
    }else if(dom=='myClass'){
    	//班级统计
        $('.class').css({display:'block'})
        $('.allClass').css({display:'none'})
        $('.object').css({display:'block'})
        if(!$('.'+dom).hasClass("f")){
        	P_PlayCourse_Page.getYjUseInfo();
        	$('.'+dom).addClass("f");
        }
    }else if(dom == 'subject'){
    	//科目统计
        $('.class').css({display:'none'})
        $('.allClass').css({display:'block'})
        $('.object').css({display:'none'})
        if(!$('.'+dom).hasClass("f")){
        	P_PlayCourse_Page.getYjUseInfo();
        	$('.'+dom).addClass("f");
        }
    }
}

function queryYjUseInfo(){
	P_PlayCourse_Page.getYjUseInfo();
}

function queryYjResouceUseInfo(){
	P_PlayCourse_Page.getYjResouceUseInfo();
}

function queryTwoChart(){
	P_PlayCourse_Page.getYjUseInfo();
	P_PlayCourse_Page.getYjResouceUseInfo();
}










// 图表

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
				data : [ ]
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
				data : [ ]
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
				data : [  ]
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
				data : [ ]
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
		name : '班级',
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
				data : [  ]
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
				data : [ ]
			} ]
};

thirdChart.setOption(thirdOption);

var pirChart = echarts.init(document.getElementById('pieChart'));

var pirOption = {
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
		name : '教师使用资源分布',
		type : 'pie',
		selectedMode : false,
		hoverAnimation : false,
		radius : [ '%', '70%' ],
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
		data : [ ]
	} ],
	color : [ '#8c89c6', '#ff7a62', '#5fd6a8', '#6cd3f1', '#329cf0', '#fedc82' ]
};

pirChart.setOption(pirOption);


window.onresize = function(){
	firstChart.resize();
	secondChart.resize();
	thirdChart.resize();
	pirChart.resize();
};