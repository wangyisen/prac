
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
$("#s-Time").attr("value",new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).format("yyyy-MM-dd"));
$("#e-Time").attr("value",new Date().format("yyyy-MM-dd"));

$('.m-delete').bind("click", function() {
	// console.log($(window).height());
	$('.alert').css({ display: 'block' })
});

//日期和关键字按钮选择事件
$("input[name='sel-type']").click(function() {
	if($(this).val() == 'time'){
		//显示时间选择器
		$("#keyWordQuery").val("");
		$("#keyWordQuery").css('display','none');
		$("#timeQuery").css('display','inline-block');
	}
	if($(this).val() == 'keyWord'){
		//显示关键词输入框
		$("#keyWordQuery").val("");
		$("#timeQuery").css('display','none');
		$("#keyWordQuery").css('display','inline-block');
	}
});

// 跳转到详情页
$("#m-listBody").on("click","div[class='m-listCont']",function(){
	var msgId = $(this).attr("id");
	var id = msgId.split("_")[1];
	
	if($(this).parent().hasClass('no-read')){
		//如果是未读消息  设置成已读
		S_Message_Page.setMessageRead(id);
	}
	
	$("#header").text("");
	$("#publish-detail").text("");
	$("#content").text("");
	var msg_head = $("#msg_h_"+id).html();
	var msg_content = $("#msg_p_"+id).html();
	var msg_pub = $("#msg_d_"+id).text();
	$("#header").text(msg_head);
	$("#publish-detail").text(msg_pub);
	$("#content").text(msg_content);
	$("#m-table").css('display', 'none');
	$("#messageDetail").css('display', 'block');
})


