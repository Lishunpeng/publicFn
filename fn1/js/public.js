import Vue from 'vue'
import axios from 'axios'
import myaddress from './city-picker.data.js'
import { MessageBox, Toast,Indicator } from 'mint-ui';
Vue.prototype.myfun = {
	myfun_ips:'http://www.gdmz.lm.gov.cn',
//	myfun_ips: 'http://192.168.2.22:81',

	$number:/^[0-9]\d*$/,//自然整数
	changeToken: function(data) {
		data.token ? localStorage.token = data.token : "";
	},
	//显示加载中
	showLoad:function(){
		Indicator.open({text: '加载中...',spinnerType: 'snake'});
	},
	//关闭加载中
	closeLoad:function(){
		Indicator.close();
	},
	/*obj=>path(地址) isUnchangeString(不修改字段提交) reWriteFn*/
	postAxios: function(obj, data, callback) {
//		$('.loadingBox').show();
		this.showLoad();
		if(obj.isUnchangeString) {
			var strdata = data;
		} else {
			var strdata = "";
			for(var i in data) {
				strdata += i + '=' + data[i] + '&';
			}
		}
		strdata = strdata.substr(0, strdata.length - 1);
		axios.post(this.myfun_ips + obj.path + '?token=' + localStorage.token, strdata, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(res => {
			this.closeLoad();
			if(res.status == 200) {
				this.changeToken(res.data);
				if(obj.reWriteFn){
					return callback(res);
				}
				if(res.data.state == -1) {
					if(res.data.content != null) {
						if(res.data.content.islogin == -1) {
							return	this.toLogin();
						}
					}
					res.data.msg = res.data.msg ? res.data.msg : '错误';
					Toast(res.data.msg);
				} else if(res.data.state == 0) {
					return callback(res.data);
				}
			}
		}).catch(res => {
			var myErr = res.toString();
			if(myErr.indexOf('Network Error') >= 0) {
				MessageBox('提示', '服务器异常或者检查您的网络是否异常！');
			}
			this.closeLoad();
			console.log(res);
		});
	},
	post_imgAxios: function(obj, data, callback) {
		console.log(data);
		this.showLoad();
		axios.post(this.myfun_ips + obj.path + '?token=' + localStorage.token, data, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).then(res => {
			this.closeLoad();
			if(res.status == 200) {
				this.changeToken(res.data);
				if(res.data.state == -1) {
					if(res.data.content != null) {
						if(res.data.content.islogin == -1) {
							return	this.toLogin();
						}
					}
					Toast(res.data.msg);
				} else if(res.data.state == 0) {
					return callback(res.data);
				}
			}
		}).catch(res => {
			var myErr = res.toString();
			if(myErr.indexOf('Network Error') >= 0) {
				MessageBox('提示', '服务器异常或者检查您的网络是否异常！');
			}
			this.closeLoad();
			console.log(res);
		});
	},
/*obj=>path(地址) getMethod(判断是否头部带?参数拿数据) isVer(重写回调) returnBack(返回上一页) that(当前vue对象this)*/
	getAxios: function(obj, callback) {
		this.showLoad();
		var _tokenStr = obj.getMethod ? '&token=' : '?token=';
		axios.get(this.myfun_ips + obj.path + _tokenStr + localStorage.token).then(res => {
			this.closeLoad();
			//验证码接口特别重写
			if(obj.isVer) {
				return callback(res);
			}
			if(res.status == 200) {
				this.changeToken(res.data);
				if(res.data.state == -1) {
					if(res.data.content != null) {
						if(res.data.content.islogin == -1) {
							return	this.toLogin();
						}
					}
					
					res.data.msg = res.data.msg ? res.data.msg : '错误';
					Toast(res.data.msg);
					if(obj.returnBack){
						return	this._mySelf.$router.back(-1);
					}
					if(res.data.msg.indexOf('请完善个人信息再填写简历'>=0) || res.data.msg.indexOf('请填写网站企业信息再发布招聘'>=0)){
						return obj.that.isCompleteInfo = false;
					}
				} else if(res.data.state == 0) {
					return callback(res.data);
				}
			}
		}).catch(res => {
			var myErr = res.toString();
			if(myErr.indexOf('Network Error') >= 0) {
				MessageBox('提示', '服务器异常或者检查您的网络是否异常！');
			}
			this.closeLoad();
			console.log(res);
		});
	},
	getThis: function(obj) {
		this._mySelf = obj;
	},
	//显示联动样式
	showDIV: function(obj) {
		//		obj.isAreaShow = false;
		console.log('showDIV');
		console.log(obj.isAreaShow);
	},
	//地址三级联动函数封装
	areaFun: function() {
		this._province = this.findProvince();
		var myAddressSlots = [{
				flex: 1,
				defaultIndex: 1,
				values: this._province,
				className: 'slot1',
				textAlign: 'center'
			},
			{
				divider: true,
				content: '-',
				className: 'slot2'
			},
			{
				flex: 1,
				values: [],
				className: 'slot3',
				textAlign: 'center'
			},
			{
				divider: true,
				content: '-',
				className: 'slot4'
			},
			{
				flex: 1,
				values: [],
				className: 'slot5',
				textAlign: 'center'
			}
		];
		return myAddressSlots;
	},
	myChange_mint: function(pic, val) {
		if(val[0]) {
			this._city = this.findCity(val[0]);
			pic.setSlotValues(1, this._city);
			if(!this._city.length) {
				this._area = this.findCity(val[1]);
				pic.setSlotValues(2, this._area);
			}

		}
		if(val[1]) {
			this._area = this.findCity(val[1]);
			pic.setSlotValues(2, this._area);
		}
		// Object.keys()会返回一个数组，当前省的数组
		// 区/县数据就是一个数组
		return this.valToString(val);
	},
	//省中找市区
	findCity: function(obj) {
		var _cityData = [];
		if(obj && obj != undefined) {
			for(var i in myaddress[obj.code]) {
				var _data = {
					address: myaddress[obj.code][i],
					code: i
				};
				_cityData.push(_data);
			}
			//			isArea?'':_cityData.push({address:'不限',code:'00'});
		}
		return _cityData;
	},
	//处理数据找出省份
	findProvince: function() {
		var _provinceData = [];
		for(var x in myaddress) {
			if(x == 1) {
				for(var y in myaddress[x]) {
					for(var z in myaddress[x][y]) {
						_provinceData.push(myaddress[x][y][z]);
					}
				}
			}
		}
		return _provinceData;
	},
	//将val中的省市区转化成需要的字符
	valToString: function(val) {
		var obj = {}
		if(val[2] && val[1]) {
			obj._code = val[1].code.substr(0, 4) + val[2].code.substr(-2);
			obj._address = val[0].address + ',' + val[1].address + ',' + val[2].address;
		} else if(val[1]) {
			/*if (val[1]) {
				obj._code = val[0].code;
				obj._address = val[0].address;
				return obj;
			}*/
			obj._code = val[1].code;
			obj._address = val[0].address + ',' + val[1].address;
		} else if(val[0]) {
			obj._code = val[0].code;
			obj._address = val[0].address;
		}
		return obj;
	},
	//解决冒泡事件
	returnBubble: function(e) {
		var oEvent = window.event || e;
		oEvent.cancelBubble = true;
		return;
	},
	//移除三级联动盒子
	removeArea: function(obj) {
		$(obj).find('.picker-items').animate({
			'bottom': '-6rem',
			'display': 'none'
		}, 200, () => {
			$(obj).hide();
		});
		this.unbindTouchMove();
	},
	//显示地址
	showArea: function(obj) {
		$(obj).siblings('.picker').show().find('.picker-items').css({
			'display': 'flex'
		}).animate({
			'bottom': '0rem'
		}, 200);
		this.bindTouchMove();
	},
	//解除屏幕滚动
	unbindTouchMove:function(){
		if(navigator.userAgent.match(/iphone/i)){
			document.body.ontouchmove = null;
		}else{
			$('html,body').css({'height':'auto','overflow':'auto'});
		}
	},
	//禁止屏幕滚动事件
	bindTouchMove:function(){
		if(navigator.userAgent.match(/iphone/i)){
			document.body.ontouchmove = function(event){
				event.preventDefault();
			}
		}else{
			$('html,body').css({'height':'100%','overflow':'hidden'});
		}
	},
	
	
	getFootData: function(val) {
		var data = [{
				name: '首页',
				myClass: 'index',
				linkTo: '/',
				isClick: false
			},
			{
				name: '在线面试',
				myClass: 'onlineView',
				linkTo: '/online/on_index',
				isClick: false
			},
			{
				name: '就业资讯',
				myClass: 'jobTake',
				linkTo: '/jobConsult/jobConsultCenter',
				isClick: false
			},
			{
				name: '用户中心',
				myClass: 'userCenter',
				linkTo: '/user/userCenter',
				isClick: false
			},
		]
		data[val].isClick = true;
		return data;
	},
	showFooter: function(obj) {
		obj.$nextTick(() => {
			$('footer').addClass('show');
		});
	},
	//转换字符串(,变｜)
	changeString: function(str) {
		str = str.substr(1, str.length - 2);
		str = str.replace(/,/g, '|');
		return str;
	},
	//转换地址(把行政区去掉)
	changeAddr: function(addr) {
		addr = addr.replace(/,行政区划/g, '');
		addr = addr.replace(/,/g, '');
		return addr;
	},
	//数据加载失败
	dataLose: function(obj) {
		obj.$refs.loadmore.onBottomLoaded();
		Toast({
			message: '没有更多数据了！',
			position: 'bottom',
			duration: 1000
		});
	},
	dataSeccess: function(obj) {
		obj.$refs.loadmore.onBottomLoaded();
		Toast({
			message: '数据加载成功！',
			position: 'bottom',
			duration: 1000
		});
	},
	//下拉加载获取数据(当前的this,需要渲染的数据名，接口路径，需要获取的数据名)
	getData: function(obj, objName, myPath, dataName, callback) {
		this.getAxios({path: myPath,that:obj}, res => {
			if(res.content[dataName[0]] == null) {
				console.log(res.content[dataName[0]],'function in the getData and content is none');
				return this.dataLose(obj);
			}
			console.log(res,'function in the getData');
			var mydata = dataName.length==2?res.content[dataName[0]][dataName[1]] : res.content[dataName[0]];
			if(!mydata.length) {
				this.dataLose(obj);
				obj.allLoaded = true;
				return;
			}
			for(let i in mydata) {
				//检测申请人数中是否含有counts
				if(res.content.counts && mydata[i].recruit_id) {
					for(let j in res.content.counts) {
						if(mydata[i].recruit_id == j) {
							mydata[i].recruit_number = res.content.counts[j];
						}
					}
				}
				//检测申请人数中是否含有counts
				if(res.content.state && mydata[i].bid_state) {
					for(let j in res.content.state) {
						if(mydata[i].bid_state == j) {
							mydata[i].bid_title = res.content.state[j];
						}
					}
				}
				//检测是否存在sp_application_bespoke_start_time 并且sp_application_bespoke_end_time
				if(mydata[i].sp_application_bespoke_start_time && mydata[i].sp_application_bespoke_end_time) {
					mydata[i].$status = this.sp_isTimePast(obj.getNowtimestamp,mydata[i].sp_application_bespoke_start_time,mydata[i].sp_application_bespoke_end_time);
					console.log(mydata[i].$status,'mydata[i].$status');
					mydata[i].sp_application_bespoke_start_time = this.getMyDate(mydata[i].sp_application_bespoke_start_time,true);
					mydata[i].sp_application_bespoke_end_time = this.getMyDate(mydata[i].sp_application_bespoke_end_time,true);
				}
				//检测是否存在.company_scope字段
				if(mydata[i].company_scope) {
					mydata[i].company_scope = this.changeString(mydata[i].company_scope);
				}
				//检测是否存在.create_time字段
				if(mydata[i].create_time) {
					let getTime = Date.parse(new Date(mydata[i].create_time.replace(/-/g, '/')));
					mydata[i].create_time = this.timestampToTime(getTime);
				}
				//视频中的创建时间
				if(mydata[i].sp_application_create_time) {
					let getTime = Date.parse(new Date(mydata[i].sp_application_create_time.replace(/-/g, '/')));
					mydata[i].sp_application_create_time = this.timestampToTime(getTime);
				}
				//检测是否存在.online_company_book_time字段
				if(mydata[i].online_company_book_time) {
					let getTime = Date.parse(new Date(mydata[i].online_company_book_time.replace(/-/g, '/')));
					mydata[i].online_company_book_time = this.timestampToTime(getTime);
				}

				//检测是否存在.job_fair_end
				if(mydata[i].job_fair_end || mydata[i].job_fair_start) {
					let getTimeEnd = Date.parse(new Date(mydata[i].job_fair_end.replace(/-/g, '/')));
					let getTimeStart = Date.parse(new Date(mydata[i].job_fair_start.replace(/-/g, '/')));

					if(obj.getNowtimestamp > getTimeStart && obj.getNowtimestamp < getTimeEnd) {
						mydata[i].type = 0;
					} else if(obj.getNowtimestamp < getTimeStart) {
						mydata[i].type = 1;
					} else if(obj.getNowtimestamp > getTimeEnd) {
						mydata[i].type = 2;
					}
//					mydata[i].job_fair_end = this.timestampToTime(getTimeEnd);
//					mydata[i].job_fair_start = this.timestampToTime(getTimeStart);
				}
				//判断sp_sign_up_create_time是否存在
				if(mydata[i].sp_sign_up_create_time){
					console.log(mydata[i].sp_sign_up_create_time,'mydata[i].sp_sign_up_create_time')
					mydata[i].sp_sign_up_create_time = this.getMyDate(mydata[i].sp_sign_up_create_time);
				}
				
				
				//检测是否存在.online_booking_begin_time
				if(mydata[i].online_booking_begin_time || mydata[i].online_booking_end_time) {
					let getTimeBegin = Date.parse(new Date(mydata[i].online_booking_begin_time.replace(/-/g, '/')));
					let getTimeEnd = Date.parse(new Date(mydata[i].online_booking_end_time.replace(/-/g, '/')));

					if(obj.getNowtimestamp > getTimeBegin && obj.getNowtimestamp < getTimeEnd) {
						mydata[i].type = 0;
					} else if(obj.getNowtimestamp < getTimeBegin) {
						mydata[i].type = 1;
					} else if(obj.getNowtimestamp > getTimeEnd) {
						mydata[i].type = 2;
					}

					mydata[i].online_booking_begin_time = this.timestampToTime(getTimeBegin);
					mydata[i].online_booking_end_time = this.timestampToTime(getTimeEnd);
				}

				obj[objName].push(mydata[i]);
			}
			this.dataSeccess(obj);
			if(typeof callback == "function") {
				return callback(res);
			}
		});
	},
	//时间戳转换成年月日
	timestampToTime: function(timestamp) {
		var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		var D = date.getDate() + ' ';
		return Y + M + D;
	},
	//时间转换成时间戳
	timeToTimestamp: function(time) {
		var timestamp = new Date(time.replace(/-/g, '/'));
		timestamp = Date.parse(timestamp);
		return timestamp;
	},
	//返回跳转固定页面
	backLink: function(myPath) {

		this.pushHistory();
		window.addEventListener("popstate", function(e) {
			console.log(this._mySelf);

		}, false);
	},
	pushHistory: function() {
		var state = {
			title: "title",
			url: "#"
		};
		window.history.pushState(state, "title", "#");
	},
	//验证码函数封装
	send_verifi: function(obj, myPath, callback) {
		if(obj.isverClick) {
			return Toast('请勿重复操作！');
		}
		var mytime = 120; //时间都是120S
		var timer = null;
		obj.isverClick = true;
		timer = setInterval(res => {
			$('.btn_click').text(--mytime + 's后');
			if(mytime == 0) {
				$('.btn_click').text('发送');
				obj.isverClick = false;
				clearInterval(timer);
			}
		}, 1000);
		//				var myobj = {path:'/app/getVerificationCode/'+this.login_username,isVer:true};
		this.getAxios(myPath, res => {
			if(res.status == 200) {
				this.changeToken(res.data);
				if(res.data.state == -1) {
					obj.isverClick = false;
					clearInterval(timer);
					Toast(res.data.msg);
				} else if(res.data.state == 0) {
					if(res.data.msg.indexOf('后才能重发') >= 0) {
						obj.isverClick = false;
						clearInterval(timer);
					}
					return Toast(res.data.msg);
				}
			} else {
				obj.isverClick = false;
				clearInterval(timer);
			}
		})
	},
	//获取当前时间
	getMyDate: function(obj,hasTime) {
		var _date = new Date(obj);
		var y = _date.getFullYear();
		var m = _date.getMonth() + 1;
		m < 10 ? m = '0' + m : '';
		var d = _date.getDate();
		d < 10 ? d = '0' + d : '';
		if(hasTime){
			var h =	_date.getHours();
			h < 10 ? h = '0' + h : '';
			var min = _date.getMinutes();
			min < 10 ? min = '0' + min : '';
			var str = y + '-' + m + '-' + d + ' '+h+':'+min;
			return str
		}
		
		var str = y + '-' + m + '-' + d;
		return str;
	},
	getMyTime:function(obj){
		return obj;
	},
	//身份证校验
	checkIdcard: function(value) {
		var idcard = value;
		if(idcard == "") {
			return false;
		}
		console.log(value)
		var regex1 = /^[1-9][0-7]\d{4}((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229))\d{3}(\d|X|x)?$/;
		/*身份号码位数及格式检验*/
		switch(idcard.length) {
			case 15:
				if((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
					var regex2 = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
				} else {
					var regex2 = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
				}
				if(regex2.test(idcard))
					return true;
				else
					return false;
				break;
			case 18:
				// alert(regex1.test(idcard))
				if(regex1.test(idcard)) {
					var S = (parseInt(idcard.charAt(0)) + parseInt(idcard.charAt(10))) * 7 +
						(parseInt(idcard.charAt(1)) + parseInt(idcard.charAt(11))) * 9 +
						(parseInt(idcard.charAt(2)) + parseInt(idcard.charAt(12))) * 10 +
						(parseInt(idcard.charAt(3)) + parseInt(idcard.charAt(13))) * 5 +
						(parseInt(idcard.charAt(4)) + parseInt(idcard.charAt(14))) * 8 +
						(parseInt(idcard.charAt(5)) + parseInt(idcard.charAt(15))) * 4 +
						(parseInt(idcard.charAt(6)) + parseInt(idcard.charAt(16))) * 2 +
						parseInt(idcard.charAt(7)) * 1 +
						parseInt(idcard.charAt(8)) * 6 +
						parseInt(idcard.charAt(9)) * 3;
					var Y = S % 11;
					var M = "F";
					var JYM = "10X98765432";
					M = JYM.substr(Y, 1);
					/*判断校验位*/
					if(M == idcard.charAt(17).toUpperCase()) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
				break;
			default:
				return false;
		}
	},
	//将selet渲染上去。id，获取的相同值
	selectedGetData: function(obj, id, val) {
		obj.$nextTick(function() {
			$(id).each(function() {
				if($(this).val() == val) {
					$(this).attr('selected', 'selected');
				}
			})
		});

	},
	//将selet渲染上去。id，获取的相同值
	selectStrData: function(obj, id, val) {
		obj.$nextTick(function() {
			$(id).each(function() {
				if($(this).text() == val) {
					$(this).attr('selected', 'selected');
				}
			})
		});
	},
	//福利待遇转化
	welfareStr: function(str) {
		str = str.split(',');
		var copyArray = [];
		for(let i in str) {
			if(str[i] != "") {
				copyArray.push(str[i]);
			}
		}
		return copyArray;
	},
	/*//获取时间数据
    getTimeData:function(start){
		var dateData=[{data:[]}];
		 //存在代表时间最迟为当前时间
		if(this._endTimeObj){
			var	end = this._endTimeObj.year;
		}
      	var returnDayLen=function (year,month) {
            if(month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12){
                return 31
            }else if(month==2){
                if(year%4==0 && year%100!=0){
                    return 29;
                }else if(year%400==0){
                    return 29;
                }else {
                    return 28;
                }
            }else {
                return 30;
            }
        };
        for(var x=start;x<=end;x++){
//      	var myMon = (x == start)? timeObj.monD : 0;
			if(this._endTimeObj){
				var endMon = (x == end)? this._endTimeObj.mon : 12;				
			}
            var data={id:x,value:x,childs:[]};
            for(var y = 1;y<=endMon;y++){
                var dayArr=[];
                var len=returnDayLen(x,y);
                //存在代表时间最迟为当前时间
                if(this._endTimeObj){
                	var endDate = (y == endMon && x == end)? this._endTimeObj.date : len;
				}
//              var myDate = (y == myMon && x == start)? timeObj.dateD : 0;
//      		var endDate = (y == endMon && x == end)? timeObj1.dateD : len;
               
                for(var z=1;z<=endDate;z++){
                	var _myDate = z<10?'0'+z:z;
                    dayArr.push({id:_myDate,value:_myDate,childs:''});
                }
                var _myMon = y<10?'0'+y:y;
                
                data.childs.push({id:_myMon,value:_myMon,childs:dayArr});
            }
            dateData[0].data.push(data);
        }
		return dateData;
    },
    
    //时间
    timeFun:function(val1,obj){

    	this._endTimeObj = obj;    		

		console.log(this._endTimeObj);
    	this.mySetTime = this.getTimeData(val1)[0].data;
		var myAddressSlots = [
			{flex: 1,defaultIndex: 1,values:this.mySetTime,className: 'slot1',textAlign: 'center'},
			{divider: true,content: '-',className: 'slot2'},
			{flex: 1,values:[] ,className: 'slot3',textAlign: 'center'},
			{divider: true,content: '-',className: 'slot4'},
			{flex: 1,values:[],className: 'slot5',textAlign: 'center'}
		];
		return myAddressSlots;
    },
    myChange_time:function(pic,val){
		this._mon = this.findTime(val[0]);
		this._date = this.findTime(val[1]);		
		pic.setSlotValues(1,this._mon);
		pic.setSlotValues(2,this._date);
		return val;
	},
	findTime:function(obj){
		console.log(obj)
		var _dateData = [];
		if (obj) {
			for (var i in obj.childs) {
				var _data = {
					id:obj.childs[i].id,
					value:obj.childs[i].value,
					childs:obj.childs[i].childs
				};
				_dateData.push(_data);
			}
		}
		return _dateData;
	},	*/
	//input框输入按下时候去除e
	//建立一個可存取到該file的url
	getObjectURL: function(file) {
		var url = null;
		if(window.createObjectURL != undefined) { // basic
			url = window.createObjectURL(file);
		} else if(window.URL != undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file);
		} else if(window.webkitURL != undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file);
		}
		return url;
	},
	//textarea截取字段，500个字
	substrTextarea: function(obj, child) {
		console.log(obj[child]);
		var num = obj[child].length;
		if(num > 500) {
			num = 500;
			obj[child] = obj[child].substr(0, 500);
		}
		obj.textNum = num + '/500';
	},
	//判断字符串长度方法
	judeyStrLen: function(obj) {
		for(var i in obj) {
			if(obj[i]._key.length > obj[i].minSize) {
				MessageBox('提示', obj[i].msg + '长度不能超过' + obj[i].minSize + '个字');
				return false;
			}
		}
		return true;
	},
	//点击返回键退出
	addBackClick: function() {
		window.onpopstate = function(e){
			$('.blackBox').hide();
		}
	},
	getLocation: function(obj) {
		//如果是苹果手机的环境下
		this.iPhoneGetLocation(obj);
		/*if(navigator.userAgent.match(/iPhone/i)){
			return this.iPhoneGetLocation(obj);
		}
		else if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.getPosition, this.showError);
		} else {
			alert("浏览器不支持地理定位。");
		}*/
	},
	iPhoneGetLocation:function(obj){
//		var str  = "<iframe id='geoPage' width=0 height=0 frameborder=0 style='display:none;' scrolling='no' src='https://apis.map.qq.com/tools/geolocation?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp'></iframe>"
//		$('#app').append(str);
		window.addEventListener('message', function(event) {
			var loc = event.data;
			if(loc!=null && loc.type=='ip'){
				document.cookie = 'myAddr=' + JSON.stringify(loc);
				Toast({
					message: '定位成功！',
					position: 'bottom',
					duration: 2000
				});
				obj.myfun.getPositionAddr(obj);
			}
		}, false);
	},
	showError: function(error) {
		switch(error.code) {
			case error.PERMISSION_DENIED:
				Toast({
					message: '定位失败,用户拒绝请求地理定位！',
					position: 'bottom',
					duration: 2000
				});
				break;
			case error.POSITION_UNAVAILABLE:

				Toast({
					message: '定位失败,位置信息是不可用！',
					position: 'bottom',
					duration: 2000
				});
				break;
			case error.TIMEOUT:

				Toast({
					message: '定位失败,请求获取用户位置超时！',
					position: 'bottom',
					duration: 2000
				});
				break;
			case error.UNKNOWN_ERROR:
				Toast({
					message: '定位失败,定位系统失效！',
					position: 'bottom',
					duration: 2000
				});
				break;
		}
	},
	getPosition: function(position) {
		var latlon = position.coords.latitude + ',' + position.coords.longitude;
		var url = "http://api.map.baidu.com/geocoder/v2/?ak=C93b5178d7a8ebdb830b9b557abce78b&callback=renderReverse&location=" + latlon + "&output=json&pois=0"
		$.ajax({
			type: "GET",
			dataType: "jsonp",
			url: url,
			beforeSend: function() {
				Toast({
					message: '正在定位！',
					position: 'bottom',
					duration: 2000
				});
			},
			success: function(data) {
				if(data.status == 0) {
					document.cookie = 'myAddr=' + JSON.stringify(data.result.addressComponent);
					Toast({
						message: '定位成功！',
						position: 'bottom',
						duration: 2000
					});
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				Toast({
					message: '地址位置获取失败！',
					position: 'bottom',
					duration: 2000
				});
			}
		});
	},
	//set Cookie
	setCookie: function(key, value, iDay) {
		var oDate = new Date();
		oDate.setDate(oDate.getDate() + iDay);
		document.cookie = key + '=' + value + ';expires=' + oDate;
	},
	removeCookie: function(key) {
		setCookie(key, '', -1); //这里只需要把Cookie保质期退回一天便可以删除
	},
	getCookie: function(key) {
		var cookieArr = document.cookie.split('; ');
		for(var i = 0; i < cookieArr.length; i++) {
			var arr = cookieArr[i].split('=');
			if(arr[0] === key) {
				return arr[1];
			}
		}
		return false;
	},
	//通过定位功能初始化数据
	beginAddr: function(obj) {
		//通过定位功能获取的地址
		this.getPositionAddr(obj);
		this.beginAddrPlace(obj, obj.areaCode);
	},
	getPositionAddr: function(obj) {
		var _addrData = this.getCookie('myAddr');
		if(_addrData) {
			_addrData = JSON.parse(_addrData);
			obj.areaString = _addrData.province + ',' + _addrData.city + ','+ _addrData.district;
			obj.areaCode = _addrData.adCode;
		} else {
			obj.areaCode = '441400';
			obj.areaString = '广东省梅州市';
		}
	},
	//初始化地址位置
	beginAddrPlace: function(obj, code, isMoreStr) {
		if(code == null || code == '' || code == undefined) {
			return;
		}
		code = code.toString();
		let proCode = code.substr(0, 2) + '0000';
		let cityCode = code.substr(0, 4) + '00';
		let areaCode = code;
		//获取省份的当前位置.
		var myObj = {}
		for(var x in this._province) {
			if(this._province[x].code == proCode) {
				myObj.province = parseInt(x);
				this._city = this.findCity({
					code: proCode
				});
			}
		}
		if(this._city) {
			for(var y in this._city) {
				if(this._city[y].code == cityCode) {
					myObj.city = parseInt(y);
					this._area = this.findCity({
						code: cityCode
					});
				}
			}
		}
		if(this._area) {
			for(var z in this._area) {

				if(this._area[z].code == areaCode) {
					console.log(z)
					myObj.area = parseInt(z);
				}
			}
		}
		if(isMoreStr) {
			obj[isMoreStr][0].defaultIndex = myObj.province;
			obj[isMoreStr][2].defaultIndex = myObj.city;
			obj[isMoreStr][4].defaultIndex = myObj.area;
		} else {
			obj.myAddress[0].defaultIndex = myObj.province;
			obj.myAddress[2].defaultIndex = myObj.city;
			obj.myAddress[4].defaultIndex = myObj.area;
		}

		//如果是空的情况下
		/*if(code=="" || code==null || code==000000){
			return;
		}
		var _fourCode = code.toString().substr(-4);
		
		//只有省
		if(fourCode=='0000'){
			let myCode = code.toString().substr(0,2)+fourCode;
			
			
			
			
		}
		*/

		//		console.log(twoCode);
		/*for (i in myaddress) {
			
		}*/
		//		console.log(myaddress);
	},
	selectFileImage: function(fileObj, callback) {
		//	var file = fileObj.files['0'];
		var that = this;
		var file = fileObj;
		//图片方向角 added by lzk  
		var Orientation = null;

		if(file) {
			console.log("正在上传,请稍后...");
			var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式  
			if(!rFilter.test(file.type)) {
				//showMyTips("请选择jpeg、png格式的图片", false);  
				return;
			}
			// var URL = URL || webkitURL;  
			//获取照片方向角属性，用户旋转控制  
			EXIF.getData(file, function() {
				// alert(EXIF.pretty(this));  
				EXIF.getAllTags(this);
				//alert(EXIF.getTag(this, 'Orientation'));   
				Orientation = EXIF.getTag(this, 'Orientation');
				//return;  
			});

			var oReader = new FileReader();
			oReader.onload = function(e) {
				//var blob = URL.createObjectURL(file);  
				//_compress(blob, file, basePath);  
				var image = new Image();
				image.src = e.target.result;
				image.onload = function() {
					var expectWidth = this.naturalWidth;
					var expectHeight = this.naturalHeight;

					if(this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
						expectWidth = 800;
						expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
					} else if(this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
						expectHeight = 1200;
						expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
					}
					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");
					canvas.width = expectWidth;
					canvas.height = expectHeight;
					ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
					var base64 = null;
					//修复ios  
					if(navigator.userAgent.match(/iphone/i)) {
						console.log('iphone');
						//alert(expectWidth + ',' + expectHeight);  
						//如果方向角不为1，都需要进行旋转 added by lzk  
						if(Orientation != "" && Orientation != 1) {
//							alert('旋转处理');
							console.log(that);
							switch(Orientation) {
								case 6: //需要顺时针（向左）90度旋转  

									that.rotateImg(this, 'left', canvas);
									break;
								case 8: //需要逆时针（向右）90度旋转  

									that.rotateImg(this, 'right', canvas);
									break;
								case 3: //需要180度旋转  

									that.rotateImg(this, 'right', canvas); //转两次  
									that.rotateImg(this, 'right', canvas);
									break;
							}
						}

						/*var mpImg = new MegaPixImage(image); 
						mpImg.render(canvas, { 
						    maxWidth: 800, 
						    maxHeight: 1200, 
						    quality: 0.8, 
						    orientation: 8 
						});*/
						base64 = canvas.toDataURL("image/jpeg", 0.8);
					} /*else if(navigator.userAgent.match(/Android/i)) { // 修复android  
						var encoder = new JPEGEncoder();
						base64 = encoder.encode(ctx.getImageData(0, 0, expectWidth, expectHeight), 80);
					}*/ else {
						//alert(Orientation);  
						if(Orientation != "" && Orientation != 1) {
							//alert('旋转处理');  
							switch(Orientation) {
								case 6: //需要顺时针（向左）90度旋转  

									that.rotateImg(this, 'left', canvas);
									break;
								case 8: //需要逆时针（向右）90度旋转  

									that.rotateImg(this, 'right', canvas);
									break;
								case 3: //需要180度旋转  

									that.rotateImg(this, 'right', canvas); //转两次  
									that.rotateImg(this, 'right', canvas);
									break;
							}
						}

						base64 = canvas.toDataURL("image/jpeg", 0.8);
					}
					//uploadImage(base64);  
					//					$("#myImage").attr("src", base64);
					//					console.log(base64);
					if(typeof callback == 'function') {
						return callback(base64);
					}
				};
			};
			oReader.readAsDataURL(file);
		}
	},

	//对图片旋转处理 added by lzk  
	rotateImg: function(img, direction, canvas) {
		//alert(img);  
		//最小与最大旋转方向，图片旋转4次后回到原方向    
		var min_step = 0;
		var max_step = 3;
		//var img = document.getElementById(pid);    
		if(img == null) return;
		//img的高度和宽度不能在img元素隐藏后获取，否则会出错    
		var height = img.height;
		var width = img.width;
		//var step = img.getAttribute('step');    
		var step = 2;
		if(step == null) {
			step = min_step;
		}
		if(direction == 'right') {
			step++;
			//旋转到原位置，即超过最大值    
			step > max_step && (step = min_step);
		} else {
			step--;
			step < min_step && (step = max_step);
		}
		//img.setAttribute('step', step);    
		/*var canvas = document.getElementById('pic_' + pid);   
		if (canvas == null) {   
		    img.style.display = 'none';   
		    canvas = document.createElement('canvas');   
		    canvas.setAttribute('id', 'pic_' + pid);   
		    img.parentNode.appendChild(canvas);   
		}  */
		//旋转角度以弧度值为参数    
		var degree = step * 90 * Math.PI / 180;
		var ctx = canvas.getContext('2d');
		switch(step) {
			case 0:
				canvas.width = width;
				canvas.height = height;
				ctx.drawImage(img, 0, 0);
				break;
			case 1:
				canvas.width = height;
				canvas.height = width;
				ctx.rotate(degree);
				ctx.drawImage(img, 0, -height);
				break;
			case 2:
				canvas.width = width;
				canvas.height = height;
				ctx.rotate(degree);
				ctx.drawImage(img, -width, -height);
				break;
			case 3:
				canvas.width = height;
				canvas.height = width;
				ctx.rotate(degree);
				ctx.drawImage(img, -width, 0);
				break;
		}
	},
	Base64ToFlie: function(urlData,type) {
		var arr = urlData.split(',');
		var mime = arr[0].match(/:(.*?);/)[1] || type;
		// 去掉url的头，并转化为byte
		var bytes = window.atob(arr[1]);
		// 处理异常,将ascii码小于0的转换为大于0
		var ab = new ArrayBuffer(bytes.length);
		// 生成视图（直接针对内存）：8位无符号整数，长度1个字节
		var ia = new Uint8Array(ab);
		for(var i = 0; i < bytes.length; i++) {
			ia[i] = bytes.charCodeAt(i);
		}
		return new Blob([ab], {
			type: mime
		});
	},
	autoLogin:function(callback){
		if(localStorage.code_ap){
			var mypostData = JSON.parse(localStorage.code_ap);
			this.postAxios({path:'/app/login'},mypostData,res=>{return});
		}
	},
	inputExpress: function(obj) {
		var that = this;
		obj.$nextTick(()=>{
			$('input[type=number]').keypress(function(e) {
				that.$number.test(String.fromCharCode(e.keyCode))?'':e.preventDefault();
			});
		});
	},
	//判断视频是否过期
	sp_isTimePast:function(nowTimestamp,startTime,endTime){
		let startTimestamp = this.timeToTimestamp(startTime);
		let endTimestamp = this.timeToTimestamp(endTime);
		if(nowTimestamp<startTimestamp){
			var status = 0;//未开始
		}else if(nowTimestamp>endTimestamp){
			var status = 2;//开始
		}else{
			var status = 1;//已结束
		}
		return status;
	},
	//跳去登录页面
	toLogin:function(){
		this._mySelf.$router.push({path: '/login/login'});
		Toast({
			message: '你还未登录,请先登录!',
			position: 'bottom',
			duration: 1000
		});
	},
	msTimeJuedy:function(time){
		let getNowTime = new Date();
		var getNowTime_y = getNowTime.getFullYear();  
      	var getNowTime_m = getNowTime.getMonth()+1;
       	var getNowTime_d = getNowTime.getDate();
       	
       	var time = new Date(time);
       	var time_y = time.getFullYear();  
      	var time_m = time.getMonth()+1;
       	var time_d = time.getDate();
       	
       	console.log(getNowTime_y,'getNowTime_y');
       	console.log(getNowTime_m,'getNowTime_m');
       	console.log(getNowTime_d,'getNowTime_d');
       	
       	console.log(time_y,'time_y');
       	console.log(time_m,'time_m');
       	console.log(time_d,'time_d');
       	
       	if(getNowTime_y==time_y && getNowTime_m == time_m && getNowTime_d == time_d){
       		return 1;
       	}else{
       		return 0;
       	}
       	
       	
	}
}