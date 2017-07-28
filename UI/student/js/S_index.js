//消息滚动
$(function() {
	//获得当前<ul>
	var $uList = $(".scroll-box ul");
	var timer = null;
	//触摸清空定时器
	$uList.hover(function() {
		clearInterval(timer);
	}, function() {//离开启动定时器
		timer = setInterval(function() {
			scrollList($uList);
		}, 1500);
	}).trigger("mouseleave"); //自动触发触摸事件
	//滚动动画
	function scrollList(obj) {
		//获得当前<li>的高度
		var scrollHeight = $("ul li:first").height();
		//滚动出一个<li>的高度
		$uList.stop().animate({
			marginTop : -scrollHeight
		}, 600, function() {
			//动画结束后，将当前<ul>marginTop置为初始值0状态，再将第一个<li>拼接到末尾。
			$uList.css({
				marginTop : 0
			}).find("li:first").appendTo($uList);
		});
	}
});

//日期格式化
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}


//课程表时间
var timer = document.getElementById("time");

//返回日期显示的字符串
function getNowDate(str) {
	var date = new Date(str);
	var weekArr = [ '星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ];
	var str_date = null;
	var week = null;
	if(date.getDay() == '6') {
		str_date = new Date(str).setDate(new Date(str).getDate() + 2);
		week = weekArr[1];
	}else if(date.getDay() == '0'){
		str_date = new Date(str).setDate(new Date(str).getDate() + 1);
		week = weekArr[1];
	}else{
		str_date = date;
		week = weekArr[date.getDay()];
	}
	var currentdate = " " + week + " " + "(" + new Date(str_date).format("yyyy-MM-dd") + ")" + " ";
	return currentdate;
}
//设置当前时间
timer.innerHTML = getNowDate(new Date().format("yyyy-MM-dd"));


// 成绩曲线
// 基于准备好的dom，初始化echarts图表
var myChart = echarts.init(document.getElementById('workeCont'));
var option = {
	title : {
		show : false
	},
	legend : {
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
			show : false
		},
		axisTick : {
			show : false
		}
	},
	yAxis : {
		name : '分数\t\t\t\t\t\t\t\t\t',
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
			show : false
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

// 为echarts对象加载数据 
myChart.setOption(option);

// 课程参与度
var pieChart = echarts.init(document.getElementById('active'));

var pieOption = {
	title : {
		text : '',
		x : 'center',
		y : '35%',
		textStyle : {
			fontWeight : 'normal',
			fontSize : 20
		}
	},
	tooltip : {
		trigger : 'item',
		formatter : function(params, ticket, callback) {
			var res = params.name;
			res += '<br/>班级参与次数:75次<br/>我的参与次数:'+params.value+'次<br/>我的排名:6';
			return res;
		}
	},
	legend : {
		orient : 'horizontal',
		right : 'center',
		width : '100%',
		bottom : '12%',
		data : [  ],
		itemWidth : 20,
		itemHeight : 10,

	},
	series : [ {
		name : '课程参与度',
		type : 'pie',
		selectedMode : false,
		hoverAnimation : false,
		radius : [ '40%', '53%' ],
		center : [ '50%', '40%' ],
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


// 电子课本统计
var lineChart = echarts.init(document.getElementById('eBookLineCont'));

var lineOption = {
	title : {
		show : false,
		left : '9%',
		text : '电子书阅读统计(近一周)'
	},
	tooltip : {
		trigger : 'axis',
		formatter : '{a0}: {c0}<br />{a1}: {c1}'
	},
	grid : {
		top : '15%',
		left : '0%',
		right : '4%',
		bottom : '7%',
		containLabel : true
	},
	legend : {
		right : '0%',
		top : '3%',
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
		nameGap : 0,
		nameLocation : 'end',
		type : 'category',
		boundaryGap : false,
		data : [  ],
		axisLine : {
			show : false
		},
		axisTick : {
			show : false
		}
	},
	yAxis : {
		name : '次数\t\t\t\t\t\t\t\t',
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
			show : false
		},
		axisTick : {
			show : false
		}
	},
	series : [ {
		name : '个人阅读次数',
		type : 'line',
		symbol : 'circle',
		symbolSize : '7',
		data : [  ],
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

	}, {
		name : '班级平均阅读次数',
		type : 'line',
		symbol : 'circle',
		symbolSize : '7',
		data : [  ],
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
	} ]
};
lineChart.setOption(lineOption);


// 电子科学分布
var eBookCountChart = echarts.init(document.getElementById('eBookCount'));

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
		data : [  ],
		itemWidth : 12,
		itemHeight : 10,

	},
	series : [ {
		name : '电子书阅读学科分布图',
		type : 'pie',
		selectedMode : false,
		hoverAnimation : false,
		radius : [ '%', '50%' ],
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

//图表大小随窗口自适应
window.onresize = function(){
	myChart.resize();
	pieChart.resize();
	lineChart.resize();
	eBookCountChart.resize();
};