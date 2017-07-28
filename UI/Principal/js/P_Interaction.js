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

function queryTwoCharts() {
	//教师课堂互动课时数对比
	P_Interaction_Page.getTeacherLessonNum();
	
	//学校教师互动课堂使用次数
	P_Interaction_Page.getSchoolLessonNum();
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
		name : '姓名',
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
		name : '课时(节)\t\t\t\t\t',
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
				barWidth :30,
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


var pieChart = echarts.init(document.getElementById('pieChart'));

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
    
	tooltip : {
		trigger : 'item',
		formatter : function(params, ticket, callback) {
			var res = '语文';
			res += '<br/>班级参与次数:75次<br/>我的参与次数:'+params.value+'次<br/>我的排名:6';
			return res;
		}
	},
	legend : {
		orient : 'horizontal',
		right : 'center',
		width : '100%',
		bottom : '7%',
		data : [ {
			name : '语文',
			icon : 'circle',
			textStyle : {
				fontSize : 12
			}
		}, {
			name : '数学',
			icon : 'circle',
			textStyle : {
				fontSize : 12
			}
		}, {
			name : '英语',
			icon : 'circle',
			textStyle : {
				fontSize : 12
			}
		}, {
			name : '物理',
			icon : 'circle',
			textStyle : {
				fontSize : 12
			}
		}, {
			name : '化学',
			icon : 'circle',
			textStyle : {
				fontSize : 12
			}
		}, {
			name : '生物',
			icon : 'circle',
			textStyle : {
				fontSize : 12
			}
		} ],
		itemWidth : 20,
		itemHeight : 10,

	},
	series : [ {
		name : '教师课堂互动使用次数',
		type : 'pie',
		selectedMode : false,
		hoverAnimation : false,
		radius : [ '55%', '68%' ],
		center : [ '50%', '45%' ],
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
				borderWidth :3,
				borderColor : '#fff',
			},
		},
		labelLine : {
			normal : {
				show : false
			}
		},
		data : [ {
			value : 11,
			name : '语文'
		}, {
			value : 22,
			name : '数学'
		}, {
			value : 33,
			name : '英语'
		}, {
			value : 54,
			name : '物理'
		}, {
			value : 25,
			name : '化学'
		}, {
			value : 48,
			name : '生物'
		} ]
	} ],
	color : [ '#8c89c6', '#ff7a62', '#5fd6a8', '#6cd3f1', '#329cf0', '#fedc82' ]
};
pieChart.setOption(pieOption);

window.onresize = function(){
	firstChart.resize();
	pieChart.resize();
};