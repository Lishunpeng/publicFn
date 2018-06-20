function myFn(){}
myFn.prototype = {
	//IP地址
	myfun_ips:'http://www.gdmz.lm.gov.cn',
//	myfun_ips:'http://192.168.2.22:81',
	comInfo:{},
	personInfo:{},
	count:1,
	//倒计时
	countNumer:function(m,s){
		var timer = setInterval(function(){
			if(s--<=0){
			s = 59;
			if(m--<=0){
				m = 0;
				s = 0;
				clearInterval(timer);	
				alert('时间到1');
				if(isCompany==0 || isCompany =='0'){
					location.href = '../index.html';						
				}
			}
			
		}
		$('.sp_bottom .left').val(m+' : '+s);
		},300);
	},
	//获取数据方法
	getAjax:function(obj,callback){
		console.log(obj.path)
		$.ajax({
			type:"get",
			url:this.myfun_ips+obj.path+'?token='+localStorage.token,
			async:true,
			success:function(data){
				console.log(data);
				if(data.state==0){
					return callback(data);
				}else if(data.state==-1){
					alert('信息有误！');
				}
			},
			error:function(err){
				console.log(err);
			}
		});
	},
	//封装面试的方法
	_startPlay:function(push,play){
//		countNumer(2,0);
      	txLive = api.require('txLive');
        var api_w = document.documentElement.clientWidth || document.body.clientWidth;
	  	var api_h = document.documentElement.clientHeight || document.body.clientHeight;
	    txLive.openPlayer({
	    	x:0,
	    	y:0,
	    	w:api_w,
	    	h:api_h-70,
	      url: play
	    });
		// txLive.openPusher({
		// 	x:api_w*0.6,
		// 	y:api_h*0.1,
		// 	w:api_w*0.3,
		// 	h:api_h*0.3,
		// 	url: push
		// });
		txLive.openPusher({
			x:0,
			y:0,
			w:1,
			h:1,
			url: push
		});
		/*推流按钮隐藏*/
		txLive.setLiveBtnsVisibility({"btnid":"btnPlay","show" : 0});
		txLive.setLiveBtnsVisibility({"btnid":"btnCameraChange","show" : 0});
		txLive.setLiveBtnsVisibility({"btnid":"autofocus","show" : 0});
		txLive.setLiveBtnsVisibility({"btnid":"btnHWEncode","show" : 0});
		txLive.setLiveBtnsVisibility({"btnid":"btnFaceBeauty","show" : 0});
		txLive.setLiveBtnsVisibility({"btnid":"btnLog","show" : 0});
		txLive.setLiveBtnsVisibility({"btnid":"btnResolution","show" : 0});
		txLive.setLiveBtnsVisibility({"btnid":"btnScreenOrientation","show" : 0});
		txLive.setLiveBtnsVisibility({"btnid":"btnMirror","show" : 0});
		txLive.setLiveBtnsVisibility({"btnid":"btnBitrate","show" : 0});

		/*播放按钮隐藏*/
//		txLive.setPlayBtnsVisibility({"btnid":"btnPlay","show" : 1});
		txLive.setPlayBtnsVisibility({"btnid":"playbtnbox","show" : 1});
		txLive.setPlayBtnsVisibility({"btnid":"play_progress","show" : 0});
		txLive.setPlayBtnsVisibility({"btnid":"btnHWDecode","show" : 0});
		txLive.setPlayBtnsVisibility({"btnid":"btnRenderMode","show" : 0});
		txLive.setPlayBtnsVisibility({"btnid":"btnLog","show" : 0});
		txLive.setPlayBtnsVisibility({"btnid":"btnScreenOrientation","show" : 0});
		txLive.setPlayBtnsVisibility({"btnid":"btnCacheStrategy","show" : 0});
		txLive.startPlay();
		txLive.startPush();
	},
	//使用面试方法
	useMsFn:function(push,play){
		console.log(push,play);
		if(this.count++>1){
			return;
		}
    	this._startPlay(push,play);
	},
	//挂掉
	stopAll:function(){
		if(txLive){
			txLive.stopPush();
			txLive.stopPlay();
			txLive.hidePlayer();			
		}
	},
	comNext:function(){
		this.getAjax({path:'/app/interviewNext'},function(res){});
	},
	//查看信息
	alertBox:function(isCom){
		console.log(isCom,'isCom');
		if(isCom==1){
			alert('排序：'+this.comInfo.peopleNum+'\n'+'姓名：'+this.comInfo.peopleName+'\n'+'职位：'+this.comInfo.workName);			
		}else{
			alert('排序：'+this.personInfo.peopleNum+'\n'+'公司名称：'+this.personInfo.companyName+'\n'+'职位：'+this.personInfo.workName);			
		}
	},
	//获取地址栏参数
	getUrlParms:function(name){
	   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	   var r = window.location.search.substr(1).match(reg);
	   if(r!=null)
	   return unescape(r[2]);
	   return null;
	},
	//显示时间
	timeToShow:function(time){
		var myTime = time;
		var myTime_m = Math.floor(myTime/60000);
		var myTime_s = Math.floor((myTime-(myTime_m * 60000))/1000);
		myTime_s = myTime_s<10?'0'+myTime_s:myTime_s;
		myTime_m = myTime_m<10?'0'+myTime_m:myTime_m;
		$('.sp_bottom .left').text(myTime_m+':'+myTime_s);
	}
 
}
