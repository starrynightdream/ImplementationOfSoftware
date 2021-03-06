$(function (){
	
	//var h=window.screen.availHeight;//先获取屏幕分辨率大小
	var h=document.body.clientHeight;
	$(".card").css("min-height",h);  //预设卡片最小高度
	
	$("#navigator").load("/template/navigator.html");
	$("#footer").load("/template/footer.html");

	//主功能
	var nid=getid();
	checkid(nid);
	getnews(nid);  //获取当前新闻		
	getcommment();   //推荐新闻
				
	$("#pre").bind('click',function(){
		prenews(nid);
	});
				
	$("#next").bind('click',function(){
		nextnews(nid);
	});
				
});	
			
			
function getid(){   //获取当前新闻id
	var url=new Array();
	var url=window.location.href.split("/");
	var id=url[url.length-1];
	return id;
}
				
function getnews(id){    //获取当前的新闻
	$.ajax({
		url:"/data/0/"+id,
		dataType : 'json',
		type : 'GET',
		success : function(data) {
			//console.log(data);
			if(data.nid=="-1"){   //当前新闻为空
				window.location.href="/";
			}
			else{  
				var time=new Array();
				time=data[0].publishtime.split("T");
				$("#content").html(data[0].content);
				$("#title").html(data[0].title);
				$("#visit").html(data[0].visit);
				$("#publishtime").html(time[0]);
			}
		}
	});
}
				
function findnews(id){    //获取指定id的新闻  
	var flag=-2;
	$.ajax({
		url:"/data/0/"+id,
		dataType : 'json',
		type : 'GET',
		async:false,
		success : function(data) {
			if(parseInt(data.nid)===-1){
				flag=-1;
			}
			else{
				flag=1;
			}
		}
	});
	return flag;
}
				
function getcommment(){  //推荐新闻

	var num=4;  //先找4条数据
	$.ajax({
		url:"/data/-1/"+num,
		dataType : 'json',
		type : 'GET',
		success : function(data) {
			//console.log(data);
			$("#thenews").html("");  //将ul赋空
			//console.log(data)				
			var dataOptions='<li class="nav-item detail_nav_title"><b>最新消息</b></li>';
			for(var i=0;i<data.length;i++){
				dataOptions+='<li class="nav-item">';
				dataOptions+='<a class="nav-link" href="/new/'+data[i].nid+'">'+data[i].title+"<span class='badge'>新</span></a></li>";			
			}
			//console.log(dataOptions);				
			$("#thenews").html(dataOptions); 
		}
	})
					
}
				
function prenews(id){
					
	var find=-1;  //找到标志 -1没找到
	var minid=getminid();
	for(;find==-1&&id!=minid-1;){
		id--;
		find=findnews(id);
		// alert(id+"  "+find)
	}
	if(id!=minid-1){
		window.location.href="/new/"+id;
	}
	else{
		$("#ll").css("cursor","not-allowed");
		$("#ll").css("color","#777");
	}
	
}
				
function nextnews(id){
					
	var find=-1;    //找到标志 -1没找到
	var maxid=getmaxid();
	for(;find==-1&&id!=maxid+1;){
		id++;
		find=findnews(id);
	}
	if(id!=getmaxid()+1){
		window.location.href="/new/"+id;
	}else{
		//当前时最大的  
		$("#rr").css("cursor","not-allowed");
		$("#rr").css("color","#777");
	}
}
	

				
function checkid(id){
	if(id<=getminid()){
		$("#ll").css("cursor","not-allowed");
		$("#ll").css("color","#777");
		$("#rr").css("cursor","pointer");
	}
	else if(id>=getmaxid()){
		$("#rr").css("cursor","not-allowed");
		$("#rr").css("color","#777");
		$("#ll").css("cursor","pointer");
	}
	else{
		$("#ll").css("cursor","pointer");
		$("#ll").css("color","#000000");
		$("#rr").css("cursor","pointer");
		$("#rr").css("color","#000000");
	}
					
}
				
function getmaxid(){  //获取max id新闻条目
	var maxid=1;
	$.ajax({
		url:"/data/-2/-2",
		dataType : 'json',
		type : 'GET',
		async:false,
		success : function(data) {
			maxid=data.max; 
		}
	})
	return maxid;
	//	return 27;
}
				
function getminid(){  //获取min id新闻条目
	var minid=1;
	$.ajax({
		url:"/data/-2/-2",
		dataType : 'json',
		type : 'GET',
		async:false,
		success : function(data) {
			minid=data.min; 
		}
	})
	return minid;
	//	return 1;
}
				
