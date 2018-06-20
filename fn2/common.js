var myreg = /^1\d{10}$/; //手机号正则
var myemail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/; //邮箱验证
var mybandCard = /^([1-9]{1})(\d{14}|\d{18})$/;
var myemailCode = /^[1-9][0-9]{5}$/; //邮政编码校验
var myphone = /^0[\d]{2,3}-[\d]{7,8}$/; //电话号码的验证
var countdown = 60; //短信发送间隔
var hash = window.location.hash.replace("#", ""); //获取url所带参数
var insuDate = 10; //我的保单定义多久无法退保天数
var html = "";
var addimgCount = 0; //图片添加次数
var isDown = false;
var Flag = {
	name: false
};
var smsString = "",
	wxString = ""; //定义消息通知状态初始化
var smsInt = "",
	wxInt = ""; //定义消息通知状态数值初始化
var page = 1;
var companylist = [];
var clearshow = "";
var qwer = "";
var searchid = window.location.pathname;
var hashinfo = "";
var errState = -1;
var sccState = 0;
var timer = null; //计时器
var myAttr = "";
var pattern = new RegExp("[`~!@$^&*()=|{}':;',\\[\\].<>/?~！%@￥……&*（）|{}【】‘；：”“'。，、？]") //不能输入特殊字符
//Authorization作为ajax请求头的内容
//================================================================================
//实例化公共模块--底部
new Vue({
	el: "#footers",
	data: {
		themes: infos
	}
});
//实例化详情页模块--底部
new Vue({
	el: "#footersapp",
	data: {
		info: [{
				"icon": "fa fa-comments-o",
				"href": "consultBack#" + hash,
				"name": "咨询"
			},
			{
				"icon": "myHeart fa fa-heart-o",
				"href": "javascript:collec();",
				"name": "收藏"
			},
			{
				"bg": "../images/bg3.png",
				"href": "orderDetail#" + hash,
				"name": "立即购买"
			}
		]
	}
});
//实例化公共模块--评价

//实例化是否法定受益人 
/*
var vm = new Vue({
	el: "#check",
	data: {
		checks: false
	},
	methods: {
		che: function(obj) {
			if(obj == 2) {
				vm.checks = true
			} else {
				vm.checks = false;
			}
		}
	}
});*/
//实例化产品说明
/*
var vm = new Vue({
	el: "#explain",
	data: {
		remarkdata: []
	},
	created: function() {
		this.remarkjson();
	},
	methods: {
		remarkjson() {
			mui.ajax("../Public/Home/js/1.json", {
				dataType: "json",
				type: "get",
				timeout: 10000,
				headers: {
					"content-type": "application/json"
				},
				success: function(data) {
					onsuccess(vm.remarkdata, data);
				},
				error: function(data) {
					console.log(data)
				}
			})
		}
	}
});*/
//===============================================================================================
//第一个Vue
//实例化卫宁人认证(register.html)、银行卡添加(add-bankcard.html)、确认付款（pay.html）,账户信息（personal-info.html）,
//实名认证(name.html),意见反馈（suggess.html），关于我们（aboutus.html），利益演示（benefit.html），消息通知（notices.html）
//详情页（details.html）个人中心（#myinfo），投保人（policy.html）
var vm1 = new Vue({
	el: "#registers,#bank,#personal,#identify,#retrunTitle,#policyDetail,#clearTitle,#useCoupon,#consults,#getCoin," +
		"#banklist,#sevicelist,#consultdetail,#suggess,#about,#benefit,#identify,#order,#policyInfo,#bankCard,#perNotices," +
		"#header,#slide,#details,#contentText,#myInfo,#flow,#personals,#myIntegral,#matter,#proDetailbox,#check,#evalateall,#customInfo",
	data: {
		email: "", //邮箱的验证
		mobile: "", //手机的验证
		mobileBank: "", //银行卡预留手机号
		verify: "", //验证码
		bankCard: "", //银行卡号
		time: 60,
		lists: [],
		lists1: [],
		city: "",
		birth: "",
		birthday: "",
		sex: "",
		call: "",
		provice: "",
		phone: "",
		name: "",
		listdetail: [],
		productCompany: [],
		productintroduction: [],
		consultation: [],
		addr: "",
		zip: "",
		relation: "",
		stop: true,
		interval: null,
		timeJudey: 0,
		effectJudey:0,
		money: "",
		isActive: false,
		csaddr: [], //地区选择
		dtaddr: [], //详细地址
		coinNum: '', //提现金额
		hash: '', //地址栏传递值
		recogArray: [], //投保数组
		isCustom: 0,
		cus_hospital: "", //就诊医院
		cus_room: "", //就诊科室
		cus_beginData: "", //手术麻醉时间
		cus_endData: "", //手术结束时间
		cus_beginTime: "", //手术麻醉时间
		cus_endTime: "", //手术结束时间
		cus_phone: "", //电话
		cus_name: "", //手术名称
		cus_csaddr: "", //所在地区
		cus_addrDetail: "", //医院详细地址
		cus_oneName: "", //一级编号
		cus_twoName: "", //2级编号
		cus_treeName: "", //3级编号
		cus_surgeryGrad: "", //手术分级
		cus_surgeryDes: "", //手术说明
		cus_docName: "", //手术主治医生姓名
		serviceData:"",
		downUrl:[],
		custom_endTime:'',
		customEffectTime:''
	},
	created: function() {},
	methods: {

		//验证码倒计时
		getemailverify: function() {
			if(!this.email) {
				return mui.toast("邮箱或者验证码不能为空");
			}
			if(this.email.indexOf('@winning.com.cn') < 0) {
				return mui.toast("邮箱格式错误");
			}
			this.stop = !this.stop;
			this.interval = setInterval(this.update, 1000);
			console.log(this.email)
			this.getajax("/Home/User/wnrAuthentication?email=" + this.email);
		},
		//绑定手机号
		getPhoneverify: function() {
			var email = $(".email").val();
			if(!email) {
				return mui.toast("手机号不能为空");
			}
			if(!myreg.test(email)) {
				return mui.toast("手机输入有误");
			}
			this.stop = !this.stop;
			this.interval = setInterval(this.update, 1000);
			this.getajax("/Home/User/bindMobile?mobile=" + this.mobile);
		},
		//绑定银行卡
		getBankverify: function() {
			var mobileBank = $(".mobileBank").val();
			if(!mobileBank) {
				return mui.toast("手机号不能为空");
			}
			if(!myreg.test(mobileBank)) {
				return mui.toast("手机输入有误");
			}
			this.stop = !this.stop;
			this.interval = setInterval(this.update, 1000);
			this.getajax("/Home/BankCard/captcha?mobile=" + this.mobileBank);
		},
		//支付验证
		getPayverify: function() {
			var phonenum = $(".phonecall").val();
			if(!phonenum) {
				return mui.toast("手机号不能为空");
			}
			if(!myreg.test(phonenum)) {
				return mui.toast("手机输入有误");
			}
			this.stop = !this.stop;
			console.log(phonenum)
			console.log(vm1.lists1.mobile)
			this.interval = setInterval(this.update, 1000);
			this.getajax("/Home/Insurance/sendSMS?phone=" + phonenum + "&orderid=" + hash[1]);
		},
		//产品评价
		submitEva: function(obj) {
			if($(obj).attr("data-bool") == 0) {
				return;
			}
			$(obj).attr("data-bool", 0);
			$(obj).parent(".psave").css("background-color", "#ccc");
			if(!$(".imgnum").val()) {
				var num = 5;
			} else {
				var num = $(".imgnum").val();
			}
			var data = {
				"orderid": hash,
				"start": num,
				"message": $(".textarea").val()
			};
			this.postajax("/Home/User/evaluate", data);
		},
		update: function() {
			if(this.time <= 0) {
				this.stop = !this.stop;
				clearInterval(this.interval);
				this.time = 60;
			} else {
				this.time--;
			}
		},

		//		异步上传图片
		noticeCLick: function(name) {
			if(name == "wx") {
				if(wxString.indexOf("mui-disabled") >= 0) {
					return;
				} else {
					if(wxString != "mui-switch") {
						wxString = "mui-switch";
						wxInt = 0;
					} else {
						wxString = "mui-switch mui-active";
						wxInt = 1;
					}
					wxString += " mui-disabled"
					this.lists.wx = wxString;
				}

			} else {
				if(smsString.indexOf("mui-disabled") >= 0) {
					return;
				} else {
					if(smsString != "mui-switch") {
						smsString = "mui-switch";
						smsInt = 0;
					} else {
						smsString = "mui-switch mui-active";
						smsInt = 1;
					}
					smsString += " mui-disabled"
					this.lists.sms = smsString;
				}

			}
			data = {
				"SMS_status": smsInt,
				"WeChat_status": wxInt
			}
			this.postajax("/Home/User/noticeState", data, searchid);
		},
		noticeBegin: function(data) {
			console.log("data.SMS_status", data.SMS_status);
			console.log("data.WeChat_status", data.WeChat_status);
			data.SMS_status ? smsString = "mui-switch mui-active" : smsString = "mui-switch";
			data.WeChat_status ? wxString = "mui-switch mui-active" : wxString = "mui-switch";
			smsInt = data.SMS_status, wxInt = data.WeChat_status;
			data = {
				wx: wxString,
				sms: smsString
			};
			this.lists = data;
		},
		//点击方法
		binClick: function(id) {

			if(this.consultation[id].isdisplay) {
				this.consultation[id].isdisplay = false;
			} else {
				for(i in this.consultation) {
					this.consultation[i].isdisplay = false;
				}
				this.consultation[id].isdisplay = true;
			}

		},
		/*//社保服务传入数据
		serviceData: function(id) {
			for(i in vm1.lists) {
				if(vm1.lists[i].id == id) {
					vm1.lists = vm1.lists[i];
					console.log(vm1.lists)
					return;
				}
			}
		},*/
		//手机验证
		phoneReset: function() {
			if(!this.mobile || !this.verify) {
				return mui.toast("手机或者验证码不能为空");
			}
			if(!(/^1[34578]\d{9}$/.test(this.mobile))) {
				return mui.toast("手机格式错误");
			}
			$(".myPar").show();
			var url = "/Home/User/bindMobile";
			//			var skip = ".email,.verify";
			var datas = {
				"mobile": this.mobile,
				"verificationCode": this.verify
			};
			this.postajax(url, datas);
		},
		// 根据身份证识别生日，年龄，地区
		checkverify: function(verifyVal) {
			var arr = discriCard(verifyVal);
			vm1.sex = arr['sex'];
			console.log(vm1.sex)
			vm1.birth = arr['birth'];
			vm1.sex == "0" ? $(".sex1").text('男') : $(".sex1").text('女');
			$(".birth").text(vm1.birth);
			// $(".city1 option").text(vm1.city) ;
			// $(".city2 option").text(vm1.provice); 
		},
		//银行绑定
		changebank: function() {
			var type = $(".bank option:selected").attr('data-type');
			console.log(type)
			mui.ajax("/Home/BankCard/paymentCard?bank_code=" + type, {
				dataType: 'json', //服务器返回json格式数据
				type: 'get', //HTTP请求类型               
				success: function(data) {
					var data = data.content;
					console.log(data)
					if(data.bankcard) {
						var phone = data.bankcard.mobile;
						var card = data.bankcard.card;
						vm1.lists1.card = card;
						vm1.lists1.mobile = phone;
					} else {
						//						$(".cards").val("");
						//						$(".phonecall").val("");
						vm1.lists1.card = "";
						vm1.lists1.mobile = "";
					}
				}
			})
		},
		changeval: function() {
			if(!checkIdcard(vm1.verify)) {
				return mui.toast("身份证格式不正确");
			}
			vm1.checkverify(vm1.verify);
			var vercode = (vm1.verify).substr(0, 2);
			var verifycode = (vm1.verify).substr(0, 4);
			mui.ajax('/Home/permanentProvince', {
				dataType: 'json', //服务器返回json格式数据
				type: 'get', //HTTP请求类型               
				success: function(data) {
					console.log(data)
					var data = data.content;
					for(var i = 0; i < data.length; i++) {
						if(data[i].type.substr(0, 2) == vercode) {
							console.log(vercode)
							$(".city1 option").text(data[i].name + "省");
							vm1.provice = data[i].type;
							mui.ajax('/Home/permanentCity?type=' + data[i].type, {
								dataType: 'json', //服务器返回json格式数据
								type: 'get', //HTTP请求类型             
								success: function(res) {
									console.log(res)
									var content = res.content;
									for(var i = 0; i < content.length; i++) {
										vm1.city = content[i].type;
										if(content[i].type.substr(0, 4) == verifycode) {
											$(".city2 option").text(content[i].name);
										}
									}
								}
							})
						}
					}
				}
			})
		},
		//卫宁人认证
		regis: function(obj) {
			console.log(123456);
			if(!this.email || !this.verify) {
				return mui.toast("邮箱或者验证码不能为空");
			}
			if(this.email.indexOf('@winning.com.cn') < 0) {
				return mui.toast("邮箱格式错误");
			}
			if($(obj).attr("data-bool") == 1) {
				return
			}
			$(".psave").css({
				'background': '#ccc'
			});
			$(obj).attr("data-bool", 1);
			$(".myPar").show();
			var url = "/Home/User/wnrAuthentication";
			var skip = ".email,.verify";
			var datas = {
				"email": this.email,
				"randonCode": this.verify
			};
			this.postajax(url, datas, skip);
		},
		//实名认证
		myName: function() {
			if($(".psave span").attr("data-bool") == 0) {
				return
			}
			if(!$(".username").val || !$(".idcardnum").val() || !$(".showimg").eq(0).attr("src") || !$(".showimg").eq(1).attr("src")) {
				mui.toast("信息没有填写完整");
				return
			}
			if(!checkIdcard($(".idcardnum").val())) {
				mui.toast("身份证格式不合法");
				return
			}
			$(".psave span").attr("data-bool", "0");
			$(".psave span").text("正在审核...");
			$(".psave").css("background", "#ccc");
			var url = "/Home/User/realAuthentication";
			console.log($(".upload").eq(0).attr("data-id"))
			console.log($(".upload").eq(1).attr("data-id"))
			var datas = {
				"u.username": $(".username").val(),
				"u.certificates_num": $(".idcardnum").val(),
				"u.certificates_type": $(".cards").attr("data-id"),
				"ra.audit_type": $(".radio:checked").attr("value"),
				"ra.pidfront": $(".upload").eq(0).attr("data-id"),
				"ra.pidbehind": $(".upload").eq(1).attr("data-id")
			}
			console.log(datas)
			this.postajax(url, datas);
		},
		//账户信息
		infosave: function() {
			if(!vm1.lists1.zip_code || !vm1.lists1.email) {
				return mui.toast("信息没有完整");
			}
			if(!myemail.test($('.email').val())) {
				return mui.toast("邮箱格式错误");
			}
			if(!this.csaddr || !this.dtaddr) {
				return mui.toast("地区未选择或者未填写详细地址")
			}
			if(pattern.test(this.dtaddr)) {
				return mui.toast("详细地址不能有特殊字符")
			}
			if(!myemailCode.test($('.zipcode').val())) {
				return mui.toast("邮编格式错误");
			}
			var address = this.csaddr + '&' + this.dtaddr;
			address = address.replace(/,/g, '');
			var url = "/Home/User/userMsg";
			var datas = {
				"addr": address,
				"email": vm1.lists1.email,
				"zip_code": vm1.lists1.zip_code
			};
			this.postajax(url, datas);
		},
		//银行卡添加
		revise: function() {
			var verify = $(".verify").val();
			var bankValue = $(".bankRadio:checked").attr("value");
			var bankCode = $(".cardtype option:selected").attr("data-type");
			console.log(this.mobileBank, "this.mobileBank");
			console.log(verify, "verify");
			console.log(this.bankCard, "this.bankCard");

			if(!this.mobileBank || !verify || !this.bankCard) {
				return mui.toast("手机号、银行卡号、验证码不能为空");
			}
			if(!mybandCard.test(this.bankCard)) {
				return mui.toast("银行卡号不正确");
			}
			if(!myreg.test(this.mobileBank)) {
				return mui.toast("手机号码格式错误");
			}
			var url = "/Home/BankCard/backCard"
			var datas = {
				"mobile": this.mobileBank,
				"verificationCode": verify,
				"bank_code": bankCode,
				"state_i": bankValue,
				"card": this.bankCard
			}
			console.log(datas)
			this.postajax(url, datas);
		},
		//银行卡删除
		deleteBank: function(val) {
			mui.confirm('确定要删除吗', function(e) {
				if(e.index == 1) {
					var url = "/Home/BankCard/backCard/" + val;
					vm1.deleteajax(url);
				} else {
					mysecc("删除失败");
				}
			})
		},
		//银行卡设置为默认
		settingBank: function(obj) {
			var val = $(obj).attr("data-id");
			if($(obj).find("span").attr('class') == 'right') {
				return mui.toast('这张卡已是默认');
			}

			mui.confirm('确定要设置为默认吗', function(e) {
				if(e.index == 1) {
					var data = {
						'id_i': val
					}
					var url = "/Home/BankCard/list";
					vm1.postajax(url, data, obj);
				} else {
					mysecc("取消设置");
				}
			})
		},
		// 退保申请
		requestsub: function() {
			//退保（安信）
			if(searchid == '/Home/backMoney') {
				if(!vm1.bankCard || !vm1.name) {
					mui.toast("信息不能为空");
					return
				}
				if(!mybandCard.test(vm1.bankCard)) {
					mui.toast("银行卡输入不正确");
					return
				}
				var data = {
					"orderid": hash,
					'acctNo': vm1.bankCard,
					'acctName': vm1.name
				};
			} else {
				var data = {
					"orderid": hash
				};
			}
			if($(".saves .psave").attr("data-bool") == 0) {
				return;
			}
			$(".saves .psave").css("background", "#ccc");
			$(".saves .psave").attr("data-bool", 0);
			this.postajax("/Home/Insurance/refund", data)
		},
		// 被保人信息渲染
		recoShow: function() {
			if(localStorage.recognizee) {
				var data = JSON.parse(localStorage.recognizee);
				if(data.InsuredRelation != '00') {
					vm1.name = data.InsuredName;
					vm1.email = data.InsuredEmail;
					vm1.verify = data.InsuredCardNo;
					vm1.phone = data.InsuredMobile;
					vm1.call = data.InsuredPhone;
					vm1.addr = data.HolderAddress;
					vm1.zip = data.InsuredZip;
					vm1.addr = vm1.addr.split("&");
					console.log(vm1.addr)
					vm1.csaddr = vm1.addr[0];
					vm1.dtaddr = vm1.addr[1];
					if(vm1.verify) {
						vm1.changeval();
					}
					console.log("vm1.csaddr", vm1.csaddr)
					console.log("vm1.dtaddr", vm1.dtaddr)
					$(".rerelate option").each(function() {
						if($(this).text() == localStorage.relate) {
							$(this).attr("selected", "selected");
							selectVal();
						}
					})
				}
			}
		},
		//投保人信息
		policy: function() {
			this.zip = $(".zip").val();

			if(!this.csaddr || !this.dtaddr) {
				return mui.toast("地区未选择或者未填写详细地址")
			}
			if(pattern.test(this.dtaddr)) {
				return mui.toast("详细地址不能有特殊字符")
			}
			var address = this.csaddr + '&' + this.dtaddr;
			address = address.replace(/,/g, '');
			console.log(address)
			if(!this.zip) {
				return mui.toast("信息不能为空");
			} else if(!myemailCode.test(this.zip)) {
				return mui.toast("邮编不符合规范");
			} else if(hash == 1) {
				this.email = vm1.lists.email;
				console.log(this.email);
				if(!this.email) {
					return mui.toast("电子邮箱不能为空")
				}
				if(!myemail.test(this.email)) {
					return mui.toast("电子邮箱格式不正确")
				}
			}
			var policyData = {
				"HolderAddress": address,
				"HolderZip": vm1.zip
			};
			hash == 1 ? policyData.HolderEmail = vm1.email : "";
			localStorage.policy = JSON.stringify(policyData);
			console.log(policyData);
			mui.alert("保存成功", function() {
				history.go(-1);
			});
		},
		// 被保人信息
		recognizee: function() {
			if($(".rerelate").val() == "00") {
				var data = JSON.stringify({
					"InsuredRelation": $(".rerelate").val()
				});
			} else {
				if(!vm1.name || !vm1.email || !vm1.verify || !vm1.phone || !vm1.call || !vm1.zip) {
					return mui.toast("信息没有填写完整");
				} else if(!myemail.test(vm1.email)) {
					return mui.toast("邮箱不符合规范");
				} else if(!myreg.test(vm1.phone)) {
					return mui.toast("手机不符合规范");
				} else if(!myemailCode.test(vm1.zip)) {
					return mui.toast("邮编格式不对");
				} else if(!checkIdcard(vm1.verify)) {
					return mui.toast("身份证号不正确");
				} else if(!myphone.test(vm1.call)) {
					return mui.toast("电话号码输入有误");
				}
				if(!this.csaddr || !this.dtaddr) {
					return mui.toast("地区未选择或者未填写详细地址")
				}
				if(pattern.test(this.dtaddr)) {
					return mui.toast("详细地址不能有特殊字符")
				}
				var address = this.csaddr + '&' + this.dtaddr;
				address = address.replace(/,/g, '');
				console.log(address)
				var data = JSON.stringify({
					"InsuredName": vm1.name,
					"InsuredCardType": "0",
					"InsuredEmail": vm1.email,
					"InsuredCardNo": vm1.verify,
					"InsuredMobile": vm1.phone,
					"InsuredPhone": vm1.call,
					"InsuredBirthday": vm1.birth,
					"InsuredSex": vm1.sex,
					"HolderAddress": address,
					"HolderZip": vm1.zip,
					"InsuredResidentProvince": vm1.provice,
					"InsuredAddress": vm1.addr,
					"InsuredZip": vm1.zip,
					"InsuredResidentCity": vm1.city,
					"InsuredRelation": $(".rerelate").val()
				});
			}
			localStorage.recognizee = data;
			localStorage.relate = $(".rerelate option:selected").text();
			mui.alert("保存成功", function() {
				history.go(-1);
			});
		},
		cus_recognizee: function() {
			if(!vm1.cus_hospital || !vm1.cus_room || !vm1.cus_beginData || !vm1.cus_beginTime || !vm1.cus_endData || !vm1.cus_endTime || !vm1.cus_name) {
				return mui.toast("必填信息没有填写完整");
			} else if(vm1.cus_hospital.length > 50 || vm1.cus_room.length > 50 || vm1.cus_phone.length > 50 || vm1.cus_name.length > 50 || vm1.cus_csaddr.length > 50 || vm1.cus_addrDetail.length > 50 || vm1.cus_oneName.length > 50 || vm1.cus_twoName.length > 50 || vm1.cus_treeName.length > 50 || vm1.cus_surgeryGrad.length > 50 || vm1.cus_surgeryDes.length > 50 || vm1.cus_docName.length > 50) {
				return mui.toast("所有字段都不能超过50,请认真填写");
			} else if(vm1.cus_phone) {
				if(!myreg.test(vm1.cus_phone)) {
					return mui.toast("手机不符合规范");
				}
			} else if(this.cus_addrDetail) {
				if(pattern.test(this.cus_addrDetail)) {
					return mui.toast("详细地址不能有特殊字符")
				}
			}
			if(vm1.cus_csaddr != "") {
				vm1.cus_csaddr = vm1.cus_csaddr.split(',');
				!vm1.cus_csaddr[2] ? vm1.cus_csaddr[2] = "" : "";
			} else {
				vm1.cus_csaddr = ["", "", ""];
			}
			var beginTime = vm1.cus_beginData + ' ' + vm1.cus_beginTime;
			var endTime = vm1.cus_endData + ' ' + vm1.cus_endTime;
			
			var my_beginTime = Date.parse(new Date(beginTime.replace(/-/g, '/')));
			var my_endTime = Date.parse(new Date(endTime.replace(/-/g, '/')));
			if(my_beginTime>my_endTime){
				return mui.alert('开始时间不能大于结束时间！');
			}
			var data = JSON.stringify({
				"custom.hosName": vm1.cus_hospital,
				"custom.hosDepartment": vm1.cus_room,
				"custom.operBeginDate": beginTime,
				"custom.operEndDate": endTime,
				"custom.operationName": vm1.cus_name,
				"custom.docMobile": vm1.cus_phone,
				"custom.hosProvince": vm1.cus_csaddr[0],
				"custom.hosCity": vm1.cus_csaddr[1],
				"custom.hosCounty": vm1.cus_csaddr[2],
				"custom.hosAddress": vm1.cus_addrDetail,
				"custom.oneName": vm1.cus_oneName,
				"custom.twoName": vm1.cus_twoName,
				"custom.threeName": vm1.cus_treeName,
				"custom.surgeryGrad": vm1.cus_surgeryGrad,
				"custom.surgeryDes": vm1.cus_surgeryDes,
				"custom.docName": vm1.cus_docName,
			});

			localStorage.customInfo = data;
			mui.alert("保存成功", function() {
				history.go(-1);
			});
		},
		//获取年龄
		getAge: function(obj) {
			obj = obj.split('-');
			obj[1] < 10 ? obj[1] = obj[1][1] : "";
			obj[2] < 10 ? obj[2] = obj[2][1] : "";
			var myTime_now = new Date();
			var myYear = myTime_now.getFullYear();
			var myMon = myTime_now.getMonth() + 1;
			var myDate = myTime_now.getDate();
			var myAge = parseInt(myYear) - parseInt(obj[0]);

			if(parseInt(myMon) > parseInt(obj[1]) || (parseInt(myMon) == parseInt(obj[1]) && parseInt(myDate) >= parseInt(obj[2]))) {
				console.log(1111);
				myAge++;
			}
			return myAge;
		},
		// 提交审核
		submitpay: function(obj) {
			
			if(!vm1.lists.real_authentication) {
				mysecc("您还没有实名认证，请核对完信息后再进行提交订单", "personalReset");
			} else if(!vm1.lists.phone) {
				mysecc("您还没有手机绑定，请核对完信息后再进行提交订单", "personalReset");
			} else if(!vm1.lists.addr) {
				mysecc("您账户信息未完全，请核对完信息后再进行提交订单", "personalReset");
			} else if(!vm1.customEffectTime) {
				mysecc("请选择保险生效时间!");
			}else {
				mui.confirm('请认真核对投保人信息,确认无误后选择确认', function(e) {
					if(e.index == 1) {
						var myBirthday = vm1.lists.birthday;
						var protectBirthday = null;
						var protectData = JSON.parse(localStorage.recognizee);
						var myAge = vm1.getAge(myBirthday);
						if(protectData.InsuredRelation == '00') {
							var proAge = myAge;
						} else {
							protectBirthday = protectData.InsuredBirthday;
							var proAge = vm1.getAge(protectBirthday);
						}
						if(myAge < 18) {
							return mui.alert('投保人必须满18周岁');
						}
						if(proAge > vm2.product.productMaxage || proAge < vm2.product.productMinage) {
							return mui.alert('被保人年龄阶段不符合该保险，请购买其他产品');
						}
						var myinitData = {
							"HolderAddress": vm1.lists.addr,
							"HolderZip": vm1.lists.zip,
						};
						vm1.isCustom == 1 ? myinitData.HolderEmail = vm1.lists.email : "";
						myinitData  = JSON.stringify(myinitData);
						localStorage.policy = localStorage.policy || myinitData;
						if(localStorage.getItem('ids')) {
							var productid = localStorage.getItem('ids');
						} else {
							var productid = hashinfo;
						}
						if($(obj).attr("data-bool") == 0) {
							return;
						}
						var recognizeeinfo = localStorage.getItem('recognizee').replace("{", "").replace("}", "");
						var policyinfo = localStorage.getItem('policy').replace("{", "").replace("}", "");
						if(vm1.isCustom) {
							if(!localStorage.customInfo) {
								return mui.alert('请完善自定义信息');
							}
							var customInfo = localStorage.getItem('customInfo').replace("{", "").replace("}", "");
							var data = '{"productid":"' + productid + '",' + recognizeeinfo + ',' + policyinfo + ',' + customInfo + '}';
						} else {
							var data = '{"productid":"' + productid + '",' + recognizeeinfo + ',' + policyinfo + '}';
						}
						$(obj).css("background", "#ccc");
						$(obj).attr("data-bool", 0);
						var data = JSON.parse(data);
						if(localStorage.enclosure) {
							data.enclosure = enclose.arr;
						}
						console.log(data);
						data.insBeginDate = vm1.customEffectTime;
						vm1.postajax("/Home/Insurance/purchase", data);
					} else {
						return;
					}
				});
			}

		},
		//提交审核
		policyRemind: function() {
			if($(".myClass4>div").hasClass("unremind")) {
				return mysecc("您还没有开启到期提醒，点击确定跳往该页面", "personalNotice#remind");
			}
			$(".myClass4>div").addClass("mui-disabled");
			data = {
				"orderid": hash[2]
			}
			this.postajax("/Home/User/order", data);
		},
		//选择优惠券
		chooseCoupon: function(id, money) {
			console.log(id)
			if(hash[3] == 1) {
				window.location.href = "sureOrder#" + hash[2] + "#" + id + "#" + money;
			} else {
				window.location.href = "pay#" + hash[2] + "#" + id + "#" + money;
			}
		},
		//去支付
		toPay: function(obj) {
			if($(obj).attr('data-bool') == 0) {
				return
			}
			$(obj).attr('data-bool', '0').css('background-color', '#ccc');
			var postData = {
				bgRetUrl: 'http://www.winninggd.com/Home/ANXINInsurance/bgRetUrl',
				isTrueName: "0",
				payCancelURL: 'http://www.winninggd.com/Home/payresult#' + vm1.lists.PayMoney + '#0',
				payErrorURL: 'http://www.winninggd.com/Home/payresult#' + vm1.lists.PayMoney + '#0',
				payFinishURL: 'http://www.winninggd.com/Home/payresult#' + vm1.lists.PayMoney + '#1',
				payName: vm1.lists.productname,
				payType: '1',
				requestCode: 'EC16030003',
				transAmt: '1',
				transNo: hash[1],
			}
			hash[2] ? postData.attach = hash[2] : "";
//			var str = '?bgRetUrl='+postData.bgRetUrl+'&isTrueName=0&payCancelURL='+postData.payCancelURL+'&payErrorURL='+postData.payErrorURL+'&payFinishURL='+postData.payErrorURL
//			alert(JSON.stringify(postData));
			vm1.postajax('/Home/ANXINInsurance/MD5', postData, obj);
		},
		//确认付款
		paysub: function(obj) {

			var verify = this.verify;
			var phone = $(".phonecall").val();
			var card = $(".cards").val();
			var cardtype = $(".payhidden").val();
			var banktype = $(".bank option:selected").attr("data-type");
			var url = "/Home/Insurance/applyPay";
			if(!verify) {
				mui.toast("验证码不能为空");
				return
			}
			if(!phone) {
				mui.toast("手机不能为空");
				return
			}
			if(!card) {
				mui.toast("银行卡不能为空");
				return
			}
			if(!mybandCard.test(card)) {
				mui.toast("银行卡输入不正确");
				return
			}
			if(!myreg.test(phone)) {
				mui.toast("手机不符合格式");
				return
			}
			if($(obj).attr("data-bool") == 0) {
				return;
			}

			$(obj).parent(".pays").css("background", "#ccc");
			$(obj).attr("data-bool", 0);
			var data = {
				"orderid": vm2.data.OrderId,
				"ValidateCode": verify,
				"phone": phone,
				"card": card,
				"type": banktype
			};
			if(hash[2]) {
				data.couponid = hash[2];
			}
			this.postajax(url, data);
		},

		//意见反馈
		postsug: function() {
			var url = "Feedback";
			if(!$('.content').val()) {
				mui.alert('内容不能为空');
				return
			};
			datas = {
				"feedback.content": $('.content').val()
			};
			this.postajax(url, datas);
		},
		//提现
		getCoin: function(obj) {
			if($(obj).attr('data-bool') == 0) {
				return;
			}
			mui.confirm('是否确定提现', function(e) {
				if(e.index == 1) {
					if(vm1.coinNum < 1) {
						return mui.alert('最少取1块钱');
					}
					if(!vm1.coinNum) {
						return mui.alert('信息不能为空');
					}
					var myjudey = /^\d+\.?\d{0,2}$/;
					if(!myjudey.test(vm1.coinNum)) {
						return mui.alert('输入数字只能是数字并且最多保留小数点后两位');
					}
					if(vm1.coinNum > vm1.lists / 100) {
						return mui.alert('请确定您有没有这么多金额提现');
					}
					var data = {
						money: parseInt(vm1.coinNum * 100)
					}
					vm1.postajax('/Home/WeixinTransfers', data, obj);
					$(obj).attr('data-bool', 0).css('background', '#ccc');
				} else {
					mui.alert('提现失败');
				}

			})

		},
		getAll_coin: function() {
			vm1.coinNum = vm1.lists / 100;
		},
		//post异步请求
		postajax: function(url, datas, obj) {
			mui.ajax(url, {
				data: datas,
				dataType: "json",
				type: "post",
				error:function(xhr,type,errorThrown){
					mui.alert('服务器链接失败！');
			   },
				success: function(data) {
					console.log(123123123123)
					console.log(data)
					if(data.state == sccState) {
						if(searchid == "/Home/suggess") {
							mysecc(data.msg, "suggess");
						} else if(searchid == "/Home/bankManage") {
							$('.setting span').removeClass('right')
							$(obj).find('span').addClass('right');
							return mysecc(data.msg);
						} else if(searchid == "/Home/getCoin") {
							$(obj).attr('data-bool', 1).css('background', '#46e2a5');
							return mysecc(data.msg, 'getcoinDetail');
						} else if(searchid == "/Home/addBank") {
							mysecc(data.msg, "bankManage");
						} else if(searchid == "/Home/orderDetail") {
							localStorage.removeItem("enclosure");
							localStorage.removeItem("recognizee");
							localStorage.removeItem("policy");
							localStorage.removeItem("customEffectTime");
							if(vm1.isCustom == 1) {
								localStorage.removeItem("customInfo");
								mysecc(data.msg, "sureOrder#" + data.content);
							} else {
								mysecc(data.msg, "pay#" + data.content);
							}
							return;
						} else if(searchid == "/Home/pay") {
							mysecc(data.msg, "payresult#" + data.content);
							return
						} else if(searchid == "/Home/requset") {
							mysecc(data.msg, "requestDetail#" + hash);
							return
						} else if(searchid == "/Home/policydetails") {
							mui.toast(data.msg);
							$(".myClass4>div").removeClass("mui-disabled");
							return
						} else if((searchid == "/Home/personalInfo") || (searchid == "requestsubgister") || (searchid == "/Home/name") || (searchid == "/Home/phoneReset")) {

							mysecc(data.msg, "personalReset");
							return;
						} else if(searchid == "/Home/request") {
							localStorage.cur = 2;
							mysecc(data.msg, "myPolicy");
						} else if(searchid == "/Home/evalate") {
							localStorage.cur = 2;
							mysecc(data.msg, "myPolicy");
						} else if(searchid == "/Home/personalNotice") {
							wxString = wxString.replace(" mui-disabled", "");
							vm1.lists.wx = wxString;
							smsString = smsString.replace(" mui-disabled", "");
							vm1.lists.sms = smsString;
						} else if(searchid == "/Home/register") {
							mysecc(data.msg, "personalReset");
						} else if(searchid == "/Home/backMoney") {
							localStorage.cur = 2;
							mysecc(data.msg, "myPolicy");
						} else if(searchid == "/Home/sureOrder") {
							console.log(data);
							if(url.indexOf('/product/authorization/') > 0) {
								return;
							}
							var str = '<form action="http://axwxtest.95303.com/axPay/product/authorization/" method="post" style="display:none;"  id="sureOrderFrom">' +
								'<input type="text" name="bgRetUrl" value="http://www.winninggd.com/Home/ANXINInsurance/bgRetUrl" />' +
								'<input type="text" name="isTrueName" value="0" />' +
								'<input type="text" name="payCancelURL" value="http://www.winninggd.com/Home/payresult#' + vm1.lists.PayMoney + '#0" />' +
								'<input type="text" name="payErrorURL" value="http://www.winninggd.com/Home/payresult#' + vm1.lists.PayMoney + '#0" />' +
								'<input type="text" name="payFinishURL" value="http://www.winninggd.com/Home/payresult#' + vm1.lists.PayMoney + '#1" />' +
								'<input type="text" name="payName" value="' + vm1.lists.productname + '" />' +
								'<input type="text" name="payType" value="1" />' +
								'<input type="text" name="requestCode" value="EC16030003" />' +
								'<input type="text" name="transAmt" value="1" />' +
								'<input type="text" name="transNo" value="' + hash[1] + '" />' +
								'<input type="text" name="checkValue" value="' + data.content + '" />' +
								'<input type="submit" value="Submit" /></form>';
							$('#policyDetail').append(str);
							if (hash[2]) {
								var myStr = '<input type="text" name="attach" value="' + hash[2] + '" />';
								$('#sureOrderFrom').prepend(myStr);
							}	
							$('#sureOrderFrom').submit();
						} else {
							mui.toast(data.msg);
						}
					} else {
						if(searchid == "/Home/pay") {
							$(".saves .pays").css("background", "#46e2a5");
							$(".saves span").attr("data-bool", 1);
						} else if(searchid == "/Home/orderDetail") {
							$(".pay span").css("background", "#46e2a5");
							$(".pay span").attr("data-bool", 1);
						} else if(searchid == "/Home/name") {
							$(".psave span").text("重新审核");
							$(".psave span").attr("data-bool", 1);
							$(".psave").css("background", "#46e2a5");
						} else if(searchid == "/Home/request") {
							$(".psave").attr("data-bool", 1);
							$(".psave").css("background", "#46e2a5");
						} else if(searchid == "/Home/evalate") {
							$(".psave span").attr("data-bool", 1);
							$(".psave").css("background", "#46e2a5");
						} else if(searchid == "/Home/register") {
							$(".psave span").attr("data-bool", 0);
							$(".psave").css("background", "#46e2a5");
						} else if(searchid == "/Home/getCoin") {
							$(obj).attr('data-bool', 1).css('background', '#46e2a5');
							return mysecc(data.msg);
						}

						mui.toast(data.msg);
					}
				}
			})
		},
		//get异步请求
		getajax: function(url) {
			mui.ajax(url, {
				dataType: 'json', //服务器返回json格式数据 
				type: 'get', //HTTP请求类型 
				timeout: 10000, //超时时间设置为10秒；
				headers: {
					'Content-Type': 'application/json'
				},
				error:function(xhr,type,errorThrown){
					mui.alert('服务器链接失败！');
			   	},
				success: function(data) {
					console.log(data)
					if(data.state == sccState) {
						var nameDate = data;
						var data = data.content;
						if(searchid == "/Home/phoneReset") {
							if(url.indexOf("/Home/User/bindMobile") >= 0) {
								return mysecc(nameDate.msg);
							}
							console.log(data.data.phone)
							if(data.data.phone) {
								$(".phoneJd").show()
								vm1.lists = data.data;
							}
							return;
						} else if(searchid == "/Home/register") {
							return mysecc(nameDate.msg);
						} else if(searchid == '/Home/recognizee') {
							data.productid == null ? data.productid = "" : "";
							for(i in data.relationships) {
								if(data.productid.indexOf(',' + data.relationships[i].type + ',') > 0) {
									vm1.recogArray.push(data.relationships[i]);
								}

							}
							//							console.log((data/100).toFixed(2))
						} else if(searchid == "/Home/addBank") {

							if(nameDate.msg) {
								return mui.toast(nameDate.msg);
							}

							vm1.lists = data;
						} else if(searchid == "/Home/policydetails" || searchid == "/Home/sureOrder") {
							vm1.lists = data;
							var timestamp = Date.parse(new Date(vm1.lists.InsBeginDate.replace(/-/g, '/')));
							var beginDate = timestamp;
							var date1 = new Date(timestamp);
							vm1.lists.InsBeginDate = date1.getFullYear() + "-" + timeadd(date1.getMonth() + 1) + "-" + timeadd(date1.getDate());
							timestamp = timestamp / 1000 + vm1.lists.insuranceTime;
							var date = new Date(timestamp * 1000);
							vm1.lists.insuranceTime = date.getFullYear() + "-" + timeadd(date.getMonth() + 1) + "-" + timeadd(date.getDate());
							if(searchid == "/Home/policydetails") {
								if(hash[1] == 4) {
									vm1.stop = false;
								} else if(hash[1] == 2) {
									vm1.lists.visit == 1 ? vm1.isActive = false : vm1.isActive = true;
									vm1.lists.companyid == 3 ? vm1.isCustom = 1 : vm1.isCustom = 0;
									if(vm1.lists.downloadURL!='' && vm1.lists.downloadURL!=null){
										vm1.downUrl = JSON.parse(vm1.lists.downloadURL);
									}
									if(!vm1.lists.SMS_status && !vm1.lists.WeChat_status) {
										$(".myClass4>div").addClass("mui-disabled unremind");
										return $(".myClass4>div").removeClass("mui-active");
									}
									vm1.lists.remindState ? $(".myClass4>div").removeClass("") : $(".myClass4>div").removeClass("mui-active");
								}
								myAlertdata.content = vm1.lists.policy_operate;
							}
//							var nowDate = Date.parse(new Date());
							
							return;
						} else if(searchid == "/Home/myreturn") {
							vm1.lists1 = data.num;
							return;
						} else if(searchid == "/Home/name") {
							if(data.real_authentication) {
								mysecc("您已经实名认证过了");
								$(".username").attr("disabled", "disabled");
								$(".username").attr("value", data.username);
								$(".idcardnum").attr({
									'disabled': 'disabled',
									'value': data.certificates_num
								});
								$(".showimg").eq(0).attr("src", '/Download/img?filePath=' + data.pidfront);
								$(".showimg").eq(1).attr("src", '/Download/img?filePath=' + data.pidbehind);
								$(".showimg").show();
								$(".file,.upload,.psave").hide();
								/*$(".file").attr("data-bool", 0);
								$(".upload").css({
									'background': "#ccc"
								});
								$(".psave span").attr("data-bool", 0);
								$(".psave").css({
									'background': "#ccc"
								});*/
								data.audit_status ? $(".radio").eq(1).attr("checked", "checked") : $(".radio").eq(0).attr("checked", "checked")
							}
							return;
						} else if(searchid == "/Home/personalInfo") {
							vm1.lists1 = data.data;
							vm1.lists1.addr = vm1.lists1.addr.split("&");
							vm1.csaddr = vm1.lists1.addr[0];
							vm1.dtaddr = vm1.lists1.addr[1];
							return
						} else if(searchid == "/Home/orderDetail") {
							vm1.lists = data;
							return;
						} else if(searchid == "/Home/requestDetail") {
							console.log(data)
							vm1.lists1 = data;
							return;
						} else if(searchid == "/Home/personalNotice") {
							vm1.noticeBegin(data.data);
							return;
						} else if(searchid == "/Home/pay") {
							if(nameDate.msg) {
								return mui.toast(nameDate.msg)
							}
							if(localStorage.getItem('mybank')) {
								var banks = JSON.parse(localStorage.getItem('mybank'));
								if(banks) {
									data.bankcode.map(function(codes, index) {
										if(banks.bank_code == codes.type) {
											data.bankcode.splice(index, 1);
											data.bankcode.unshift(codes);
											console.log(codes)
										}
									});
									vm1.lists1 = banks;
								}
								localStorage.removeItem("mybank");
								vm1.lists = data.bankcode;
							} else {
								if(data.bankcard) {
									data.bankcode.map(function(codes, index) {
										if(data.bankcard.bank_code == codes.type) {
											data.bankcode.splice(index, 1);
											data.bankcode.unshift(codes);
										}
									});
									vm1.lists1 = data.bankcard;

								}
								vm1.lists = data.bankcode;
							}

							return;
						} else if(searchid == "/Home/buyproductDetail") {
							data.explain = data.explain.replace(/&quot;/g, '"');
							data.explain = JSON.parse(data.explain);
							vm1.lists = data.explain;
							return;
						} else if(searchid == "/Home/consult") {
							console.log(5454)
							vm1.lists = data;
							setTimeout(function() {
								swiperss.sipers();
							}, 0);
							return;
						} else if(searchid == "/Home/bankManage") {
							vm1.lists = data;
							return
						} 
						 else if(searchid =='/Home/serviceDetail') {
							vm1.serviceData = data[hash];
							return
						} 
						else if(searchid == "/Home/policy") {
							vm1.lists = data;
							vm1.lists.addr = vm1.lists.addr.split("&");
							vm1.csaddr = vm1.lists.addr[0];
							vm1.dtaddr = vm1.lists.addr[1];
							return
						}

						if(data) {
							if(data.length) {
								vm1.lists = data;
								/*if(searchid == "/Home/serviceDetail") {
									vm1.serviceData(hash);
								}*/

							} else {

								time(data, 'creation_time');
								time(data.data, 'birthday');
								if(searchid == "/Home/detail" || searchid == "/Home/productDetail") {
									//转话数据
									vm1.productintroduction = data.product.introduction.split("\n");
									// data.product.explain = data.product.explain.replace(/&quot;/g, '"');
									var str = data.product.explain.replace(/(&#)(\d{1,6});/gi, function($0) {
										return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
									});
									// console.log(JSON.parse(str.replace(/&quot;/g, '"')))
									data.product.explain = JSON.parse(str.replace(/&quot;/g, '"'));
									var productId = data.product.companyid;
									data.productCompany.map(function(productname, index) {
										console.log(data.productCompany[index].type)
										if(data.productCompany[index].type == productId) {
											vm1.productCompany = data.productCompany[index].name;
										}
									});
									if(data.isCollection) {
										$(".myHeart").parent().addClass("red");
										$(".myHeart").attr("class", "myHeart fa fa-heart");
										$(".myHeart").siblings("span").text("已收藏");
									} else {
										$(".myHeart").parent().removeClass("red");
										$(".myHeart").siblings("span").text("收藏");
										$(".myHeart").attr("class", "myHeart fa fa-heart-o");
									}
								}
								if(searchid == "/Home/consultBack") {
									var str = data.product.consultation.replace(/(&#)(\d{1,6});/gi, function($0) {
										return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
									});
									// console.log(JSON.parse(str.replace(/&quot;/g, '"')))
									data.product.consultation = JSON.parse(str.replace(/&quot;/g, '"'));
									for(i in data.product.consultation) {
										data.product.consultation[i].isdisplay = false;
										data.product.consultation[i].index = i;
									}
									vm1.consultation = data.product.consultation;
									console.log(vm1.consultation)
									return;
								}
								if(searchid == "/Home/insuranceNeed") {
									vm1.listdetail = data.product.notice.replace(/\n/g, "<br/>");
									console.log(vm1.listdetail);
									return;
								}
								if(searchid == "/Home/insuranceClause") {
									vm1.listdetail = data.product;
									setTimeout(function() {
										$("img").attr("data-preview-src", "");
										mui.previewImage();
									}, 0);
									return;
								}
								vm1.lists = data;
								vm1.lists1 = data.data;
								vm1.listdetail = data.product;
								cardtype(vm1.lists, vm1.lists1)
								// console.log(vm1.lists)
							}
						}
					} else if(data.state == errState) {
						mui.alert(data.msg, function() {
							history.go(-1);
						});
					}

				},
				error: function(xhr, type, errorThrown) {}
			});
		},
		//get无缓存
		getajax_noCache: function(url) {
			mui.ajax(url, {
				dataType: 'json', //服务器返回json格式数据 
				type: 'get', //HTTP请求类型 
				timeout: 10000,
				cache: false, //超时时间设置为10秒；
				headers: {
					'Content-Type': 'application/json'
				},
				success: function(data) {
					var data = data.content;
					console.log(data);
					if(searchid == "/Home/personalReset") {
						console.log(data.real_authentication);
						data.email ? $(".userInfo").text('已完善') : $(".myName").text('未完善');
						data.real_authentication ? $(".myName").text('已认证') : $(".myName").text('未认证');
						data.wn_authentication ? $(".myRegiter").text('已认证') : $(".myRegiter").text('未认证');
						return;
					}
					if(!data.sign_date) {
						$("#mypersonals span").addClass("unexchangecash");
						$("#mypersonals span").text("已签到");
					} else {
						$("#mypersonals span").text("签到送积分");
					}
					vm1.lists = data;
					localStorage.openid = vm1.lists.openid;
					console.log(localStorage.getItem('openid'))
				},
				error: function(xhr, type, errorThrown) {
					window.location.href = "https:open.weixin.qq.com/connect/oauth2/authorize?appid=wxa27d3ff8b0a5715f&redirect_uri=http%3a%2f%2fwww.winninggd.com%2fredirectUri&response_type=code&scope=snsapi_userinfo&state=wx#wechat_redirect";
					/*console.log(xhr.status,"xhr.status");
					console.log(xhr.readyState,"xhr.readyState");
					console.log(type,"type");
					console.log(errorThrown,"errorThrown");*/
				}
			});
		},
		deleteajax: function(url) {
			mui.ajax(url, {
				dataType: 'json', //服务器返回json格式数据 
				type: 'delete', //HTTP请求类型 
				timeout: 10000, //超时时间设置为10秒；
				headers: {
					'Content-Type': 'application/json'
				},
				success: function(data) {
					console.log(data)
					if(data.state == sccState) {
						mysecc(data.msg, "bankManage")
					} else {

					}

				},
				error: function(xhr, type, errorThrown) {}
			});
		}

	}
});

/*
setTimeout(function() {
	settime();
}, 1000);
*/
//================================================================================

//列表页
var queue = {
	pullUp: function(obj, url, type, search) {
		var vm = new Vue({
			el: obj,
			data: {
				companylist: [],
				companylists: [],
				myarray: [],
				page: 1,
				urls: url,
				clearshow: true,
				qwer: 1,
				type: ""
			},
			created: function() {
				var self = this;
				self.type = type;
				mui.init({
					pullRefresh: {
						container: obj, //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
						up: {
							height: 50, //可选.默认50.触发上拉加载拖动距离
							auto: true, //可选,默认false.自动上拉加载一次
							contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
							contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
							callback: pullfreshfunction //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
						}
					}
				});

				function pullfreshfunction() {
					//		 	console.log(self.page)  //值为1
					var size = 2;
					var urlval = self.type ? self.urls + '?type=' + type + '&page=' + self.page : self.urls + '?page=' + self.page;
					if(searchid == "/Home/myreturn") {
						urlval = self.type ? self.urls + '?type=' + type + '&page=' + self.page : self.urls + 'page=' + self.page;
					}
					if(search == 'search') {
						var content = localStorage.searchContent;
						urlval = self.urls + '?name=' + content + '&page=' + self.page;
						//						console.log(urlval)
					}
					mui.ajax(urlval, {
						dataType: 'json', //服务器返回json格式数据 
						type: 'get', //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						cache: false,
						headers: {
							'Content-Type': 'application/json'
						},
						success: function(data) {
							var data = data.content;
							if(data instanceof Array) {
								var datas = data.length;
							} else if(data.products instanceof Array) {
								var datas = data.products.length;
							} else if(data.list instanceof Array) {
								var datas = data.list.length;
							}
							if(obj == "#refreshContainer") {
								//var products=data.products; 
								console.log(data)
								for(var i = 0; i < data.products.length; i++) {
									data.products[i].sales_volume = data.products[i].sales_volume.length > 5 ?
										data.products[i].sales_volume.substr(0, 2) + "万" : data.products[i].sales_volume;
									for(var j = 0; j < data.productCompany.length; j++) {
										if(data.products[i].companyid == data.productCompany[j].type) {
											data.products[i].companyid = data.productCompany[j].name;
										}
									}
								}

							} else if(obj == "#collects") {
								console.log(data)
								if(!data.products.length && self.page == 1) {
									$("#collects").html("<p style='color:#333;text-align: center; font-size: .3rem; margin-top: .5rem;'>赶快去收藏哦~</p>");
									return;
								};
								for(var i = 0; i < data.products.length; i++) {
									data.products[i].sales_volume = data.products[i].sales_volume.length > 5 ?
										data.products[i].sales_volume.substr(0, 2) + "万" : data.products[i].sales_volume;
									for(var j = 0; j < data.productCompanys.length; j++) {
										if(data.products[i].companyid == data.productCompanys[j].type) {
											data.products[i].companyid = data.productCompanys[j].name;
										}
									}
								}
							}
							time(data, 'creation_time'); //判断是否有时间戳
							if(datas) {
								if(obj == "#refreshContainer") {

								}
								onsuccess(vm.companylist, data);
								onsuccess(vm.companylists, data.products);
								self.page++;
								mui(obj).pullRefresh().endPullupToRefresh(false); //Flag为true代表有数据
							} else {
								mui(obj).pullRefresh().endPullupToRefresh(true); //Flag为true代表没有数据
							}

						},
						error: function(xhr, type, errorThrown) {
							console.log(type);
							mui(obj).pullRefresh().endPullupToRefresh(true); //Flag为true代表没有数据
						}
					});
				};
			},
			methods: {

			}
		});
	},
};

//================================================================================
//自动滑块与轮播
var swiperss = {
	sipers: function() {
		var gallery = mui('.mui-sliders');
		gallery.slider({
			interval: 3000 //自动轮播周期，若为0则不自动播放，默认为0；
		});
	},
	coopro: function() {
		var swiper = new Swiper('.swiper-container', {
			slidesPerView: 4,
			paginationClickable: true,
			loop: true,
			autoplay: 1500,
			spaceBetween: 30,
			autoplayDisableOnInteraction: false
		});
	}
};
//支付类
var payPwd = {
	input: function() {
		var $input = $(".fack-box input");
		$("#pwd-input").on("input", function() {
			var value = $(this).val().trim();
			var len = value.length;
			for(var i = 0; i < len; i++) {
				$input.eq(i).val(value[i]);
			}
			$input.each(function() {
				var index = $(this).index();
				if(index >= len) {
					$(this).val("");
				}
			});
			if(len == 6) {
				console.log($("#pwd-input").val());
			};
		})
	}
};
//生成二维码
var qrcode = {
	code: function(url) {
		mui.ajax(url, {
			dataType: 'json', //服务器返回json格式数据
			type: 'get', //HTTP请求类型              
			success: function(data) {
				$(".qrcode").qrcode({
					data
				});
			},
			error: function(xhr, type, errorThrown) {
				console.log(type);
			}
		});

	}
};

// mui让a标签可跳转
mui('body').on('tap', 'a', function() {
	console.log($(this).attr('href'))
	if($(this).attr('href').indexOf("javascript") >= 0) {
		if($(this).attr('href').indexOf('collec') >= 0) {
			return collec();
		} else if($(this).attr('href').indexOf('getCoin') >= 0) {
			return getCoin(this);
		} else if($(this).attr('href').indexOf('myHref') >= 0) {
			return myHref();
		}
		showunique();
	} else if($(this).attr('href').indexOf('http') >= 0) {
		window.top.location.href = $(this).attr('href');
	} else if($(this).attr('href') == "code") {
		window.top.location.href = $(this).attr('href') + "#" + codes;
	} else {
		if(searchid == "/Home/pay") {
			var bankarr = {
				"bank_code": $(".bank option:selected").attr('data-type'),
				"mobile": vm1.lists1.mobile,
				"id": vm1.lists1.id,
				"card": vm1.lists1.card
			}
			localStorage.mybank = JSON.stringify(bankarr);
		}
		else if(searchid == "/Home/policydetails") {
			return window.top.location.href =$(this).attr('href');
		}
		window.top.location.href = '/Home/' + $(this).attr('href');
	}
});

//建立第二个VUE
var vm2 = new Vue({
	el: "#mypersonals,#myPartner,#integral,#needMoney,#sgDetailbox,#getcoinDetail," +
		"#myRetrun,#ordersdetail,#myPolicy,#clearlist,#personalDetail,#gradevaluate",
	data: {
		bool_ju: false,
		data: [],
		dataGet: [],
		dataUse: [],
		returnUnuse: [],
		returnUsed: [],
		returnOver: [],
		mydata: {},
		unPay: [],
		protect: [],
		efficacy: [],
		failure: [],
		clearMoney: [],
		clearUser: [],
		personalData: [],
		CompanyName: "",
		product: []
	},
	methods: {
		getajax: function(url, obj) {
			mui.ajax(url, {
				dataType: "json",
				type: "get",
				timeout: 10000,
				headers: {
					"content-type": "application/json"
				},
				success: function(data) {
					console.log(data);
					if(data.state == sccState) {
						if(searchid == "/Home/personal") {
							vm2.data = data.content;
							$("#mypersonals i").addClass("addNumber");
							$("#mypersonals span").addClass("unexchangecash");
							$("#mypersonals span").text("已签到");
							var num = $(".user-list").text();
							$(".user-list").text(parseInt(num) + parseInt(vm2.data.integral));
							mui.toast(data.msg);
						} else if(searchid == "/Home/integral") {

							if(data.content.length) {
								if(obj == 'get') {
									for(i in data.content) {
										switch(data.content[i].channel) {
											case "分享二维码后别人关注":
												data.content[i].imgPath = "../Public/Home/images/shareIcon.png";
												break;
											case "签到拿积分":
												data.content[i].imgPath = "../Public/Home/images/Sign.png";
												break;
											case "分享拿积分":
												data.content[i].imgPath = "../Public/Home/images/shareIcon.png";
												break;
											case "通过分享关注":
												data.content[i].imgPath = "../Public/Home/images/shareIcon.png";
												break;	
											case "实名认证":
												data.content[i].imgPath = "../Public/Home/images/mynameIcon.png";
												break;
											case "卫宁人认证":
												data.content[i].imgPath = "../Public/Home/images/wnrIcon.png";
												break;
										}
										vm2.dataGet.push(data.content[i]);
									}
								} else {
									onsuccess(vm2.dataUse, data.content);
								}
								obj == 'get' ? $(".tipsGet").text("") : $(".tipsUse").text("");
							} else {
								obj == 'get' ? $(".tipsGet").text("没有更多数据了") : $(".tipsUse").text("没有更多数据了");
							}
						} else if(searchid == "/Home/getcoinDetail") {
							if(data.content.length) {
								data = data.content;
								for(i in data) {
									var mydata = {}
									mydata = data[i];
									if(data[i].state == 0) {
										mydata.className = 'stateIcon handle'
									} else if(data[i].state == 1) {
										mydata.className = 'stateIcon successful'
									} else {
										mydata.className = 'stateIcon fail'
									}
									vm2.data.push(mydata);
								}
								console.log(vm2.data)
								$(".tipsReturn").text("");
							} else {
								$(".tipsReturn").text("没有更多数据了");
							}
						} else if(searchid == "/Home/myreturn") {
							if(data.content.list.length) {
								if(obj == '#unUse') {
									console.log(453456)
									onsuccess(vm2.returnUnuse, data.content.list);
								} else if(obj == '#used') {
									console.log(123)
									onsuccess(vm2.returnUsed, data.content.list);
								} else if(obj == '#overd') {
									console.log(456)
									onsuccess(vm2.returnOver, data.content.list);
								}
							} else {

								$(".tipsReturn").text("没有更多数据了")
							}

						} else if(searchid == "/Home/orderDetail") {

							if(localStorage.getItem('hashinfo')) {
								console.log(data);
								localStorage.ids = data.content.productid;
								vm2.mydata.company = data.content.companyname;
								vm2.mydata.title = data.content.productname;
								vm2.mydata.money = data.content.starting_price;
								vm2.data = vm2.mydata;
							} else {
								console.log(data);
								var data = data.content;
								localStorage.removeItem('ids');
								vm2.product = data.product;
								data.product.explain = data.product.explain.replace(/&quot;/g, '"');
								data.product.explain = JSON.parse(data.product.explain);
								data.product.companyid == 3 ? vm1.isCustom = 1 : vm1.isCustom = 0;
								if(vm1.isCustom){
									vm1.custom_endTime = data.product.insuranceTime;									
								}
								var money = data.product.starting_price / 100;
								vm2.mydata.money = money.toFixed(2);
								data.productCompany.map(function(company, index) {
									if(data.productCompany[index].type == data.product.companyid) {
										vm2.CompanyName = data.productCompany[index].name;
									}
								})
								vm2.mydata.title = data.product.productname
								vm2.mydata.company = data.productCompany[0].name;
								vm2.data = vm2.mydata;
							}

						} else if(searchid == "/Home/myPolicy") {
							if(data.content.length) {
								if(obj == '#unPay') {
									var setTime = 2;//设置两个小时候自动删除
									var delTimestamp = setTime * 3600 * 1000;
									var nowTimestamp = timeTOTimestamp();
									console.log(nowTimestamp);
									for (var i in data.content) {
										data.content[i].order_time = timeTOTimestamp(data.content[i].order_time);
										if((nowTimestamp - data.content[i].order_time)<delTimestamp){
											var needToDelTime =  (delTimestamp - (nowTimestamp - data.content[i].order_time))/1000;//还需多久删除
											console.log(needToDelTime,'needToDelTime');
											var _hour = Math.floor(needToDelTime/3600);
											var _min = Math.floor((needToDelTime - _hour*3600)/60);
											var _second = (needToDelTime - (_hour*3600) - (_min * 60));
											data.content[i].backTime = _hour+':'+_min+':'+_second;
											countNumer(i,_hour,_min,_second);
										}else{
											ajaxGet('home/user/defOrder?orderid='+data.content[i].OrderId,i);
										}
										vm2.unPay.push(data.content[i]);
									}
//									onsuccess(vm2.unPay, data.content);
								} else if(obj == '#protect') {

									var data = data.content;
									console.log(JSON.stringify(data));
									for(i in data) {
										var nowTime = new Date().getTime() / 1000;
										var beginTime = new Date(data[i].InsBeginDate.replace(/-/g, '/'));
										data[i].InsBeginDate = beginTime.getTime() / 1000;
										if(nowTime > data[i].InsBeginDate){
											data[i].isEffect = 1;
//											data[i].productReturnSign = 1;
										}else{
											data[i].isEffect = 0;
//											data[i].productReturnSign = 0;
										}
										data[i].insuranceTime = data[i].InsBeginDate + data[i].insuranceTime;
										console.log(data[i].InsBeginDate);
										console.log(data[i].insuranceTime);
									}
									time(data, 'InsBeginDate');
									changeTime(data, 'insuranceTime');
									onsuccess(vm2.protect, data);
								} else if(obj == '#efficacy') {
									var data = data.content;
									
									for(var i = 0; i < data.length; i++) {
										var mydata = {};
										var myState = data[i].state;
										mydata.OrderId = data[i].OrderId;
										if(myState == '4') {
											mydata.stateNum = 7;
											mydata.state4 = true;
											mydata.state8 = false;
											mydata.state16 = false;
											mydata.state64 = false;
										} else if(myState == '8') {
											mydata.stateNum = 6;
											mydata.state4 = false;
											mydata.state8 = true;
											mydata.state16 = false;
											mydata.state64 = false;
										} else if(myState == '16') {
											mydata.stateNum = 5;
											mydata.state4 = false;
											mydata.state8 = false;
											mydata.state16 = true;
											mydata.state64 = false;
										} else {
											mydata.stateNum = 7;
											mydata.state4 = false;
											mydata.state8 = false;
											mydata.state16 = false;
											mydata.state64 = true;
										}
										var beginTime = new Date(data[i].InsBeginDate.replace(/-/g, '/'));
										data[i].InsBeginDate = beginTime.getTime() / 1000;
//										data[i].InsBeginDate = Date.parse(new Date(data[i].InsBeginDate)) / 1000;
										data[i].insuranceTime = data[i].InsBeginDate + data[i].insuranceTime;
										time(data[i], 'InsBeginDate');
										changeTime(data[i], 'insuranceTime');
										mydata.creation_time = data[i].InsBeginDate;
										mydata.endTime = data[i].insuranceTime;
										mydata.productid = data[i].productid;
										mydata.type = data[i].producttype;
										mydata.productName = data[i].productname;
										vm2.efficacy.push(mydata);
									}
									console.log(vm2.efficacy)
								} else if(obj == '#failure') {
									onsuccess(vm2.failure, data.content);
								}
							} else {
								$(".tipsPolicy").text("没有更多数据了")
							}

						} else if(searchid == "/Home/clearUp") {
							if(data.content.length) {
								if(obj == '#moneyDetail') {
									onsuccess(vm2.clearMoney, data.content);
								} else {
									onsuccess(vm2.clearUser, data.content);
								}
								$(".clearTips").text("")
							} else {
								$(".clearTips").text("没有更多数据了")
							}

							return;
						} else if(searchid == "/Home/personalDetail") {

							if(url.indexOf("/Home/User/remindCustomers") >= 0) {
								return mui.toast(data.msg);
							}

							vm2.mydata = data.content;
							console.log(vm2.mydata);
							if(data.content.list.length) {
								onsuccess(vm2.personalData, data.content.list);
							} else {
								$(".personalTips").text("没有更多数据了")
							}

							return;

						} else if(searchid == "/Home/detail") {
							if(data.content.length) {
								for(i in data.content) {
									data.content[i].message = data.content[i].message.replace(/<.*?>/ig, "");
									data.content[i].message = data.content[i].message.replace(/\n/g, "<br/>");
								}

								onsuccess(vm2.data, data.content);
								$(".tipsDetail").text("数据加载成功")
							} else {
								$(".tipsDetail").text("没有更多数据了")
							}
							return;
						} else if(searchid == "/Home/pay") {
							vm2.data = data.content;
						} else if(searchid == "/Home/register") {
							var data = data.content;
							// console.log(data.wn_authentication);
							if(data.wn_authentication) {
								mysecc("您已认证邮箱");
								//								$(".psave").css({
								//									'background': '#ccc'
								//								});
								//								$(".psave span").attr('data-bool', 1);
								vm1.email = data.email;
								$(".email").attr("disabled", "disabled");
								$(".wnVerify,.psave").hide()
							}
						} else if(searchid == "/Home/policydetails") {
							vm1.isActive = false;
							return mysecc(data.msg);
						} else if(searchid == "/Home/suggestDetail") {
							var data = data.content;
							// console.log(data.Feedback);
							if(data.Feedback.length) {
								for(i in data.Feedback) {
									data.Feedback[i].bool = false;
									data.Feedback[i].head = data.headimgurl;
									// data.Feedback[i].content = unescape(data.Feedback[i].content.replace(/\\u/gi, '%u'));

									var str = data.Feedback[i].content.replace(/(&#)(\d{1,6});/gi, function($0) {
										return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
									});
									data.Feedback[i].content = str;

									if(data.Feedback[i].content.length >= 60) {
										data.Feedback[i].bool = true;
									}
								}
								onsuccess(vm2.data, data.Feedback);

								$(".tipsReturn").text("数据加载成功")
							} else {
								$(".tipsReturn").text("没有更多数据了")
							}
						} else {
							console.log(data)
							vm2.data = data.content;
							setTimeout(function() {
								swiperss.coopro()
							}, 0);

						}
					} else {
						mui.toast(data.msg);
					}

				},
				error: function(data) {
					console.log(data)
				}
			})
		},

		remindFn: function(obj) {

			if($(obj).attr("data-bool") == 0) {
				return;
			}
			$(obj).attr("data-bool", 0);
			$(obj).css("background", "#ccc");
			vm2.getajax("/Home/User/remindCustomers?orderid=" + $(obj).attr("data-id"));
		}

	}
});

//建立一個可存取到該file的url
function getObjectURL(file) {
	var url = null;
	if(window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if(window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if(window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}
//json数据转义
function HTMLDecode(text) {
	var temp = document.createElement("div");
	temp.innerHTML = text;
	var output = temp.innerText || temp.textContent;
	temp = null;
	return output;
}
//name页面显示MUI
function showMui(val) {
	if(val == 'front') {
		$(".maskImgbox img").eq(0).show();
		$(".maskImgbox img").eq(1).hide();
	} else if(val == 'behind') {
		$(".maskImgbox img").eq(1).show();
		$(".maskImgbox img").eq(0).hide();
	} else {
		$(".maskImgbox img").hide();
		$(".maskImgbox").hide();
		return;
	}
	mask.show();
	$(".maskImgbox").show();
}
//policy-detail页面的MUI 显示
function myAlert() {
	mui.alert(myAlertdata.content, myAlertdata.title, "确定", function() {
		vm2.getajax("/Home/Insurance/policyOperate?orderid=" + hash[2]);
	});
}

function changePage(id,val) {
	if(val==1 || val=='1'){
		$(".policyimg img").attr("src", "../Public/Home/images/policydetail0_10.png");
	}else{
		$(".policyimg img").attr("src", "../Public/Home/images/policydetail0" + id + ".png");		
	}
	switch(id) {
		case "1":
			$(".myClass1").show();
			break;
		case "2":
			$(".myClass1,.myClass2,.myClass3,.myClass4,.myClass7").show();
			break;
		case "7":
			$(".myClass7").show();
			break;
		case "4":
			$(".myClass1").show();
			break;
		case "5":
			$(".myClass6,myClass7").show();
			break;
		case "6":
			$(".myClass6,myClass7").show();
			break;
	}
}

// function showToast(val, url) {
// 	mui.alert(val);
// 	setTimeout(function() {
// 		window.location.href = url;
// 	}, 2000);
// }

//身份证类型
function cardtype(arr, obj) {
	if(obj) {
		for(var i = 0; i <= arr['documentType'].length; i++) {
			if(i == obj['certificates_type']) {
				return obj['certificates'] = arr['documentType'][obj['certificates_type']].name;
			}
		}
	}
}


//================================================================================ 
//时间倒计时
function settime() {
	var obj = $(".getverify");
	if(countdown == 0) {
		obj.attr('disabled', false).text('获取验证码');
		countdown = 60;
		return;
	} else {
		obj.attr('disabled', true).text('重新发送(' + countdown + ')');
		countdown--;
	}
}

function onsuccess(arr, obj, suobj) {
	for(i in obj) {
		arr.push(obj[i]);
	}
};
//  时间戳转换为时间格式
function time(data, obj) {
	if(data) {
		if(data.length) {
			for(i in data) {
				var date = new Date(data[i][obj] * 1000);
				data[i].creation_time = date.getFullYear() + "-" + timeadd(date.getMonth() + 1) + "-" + timeadd(date.getDate());
			}
		} else {
			var date = new Date(data[obj] * 1000);
			data[obj] = date.getFullYear() + "-" + timeadd(date.getMonth() + 1) + "-" + timeadd(date.getDate());
		}
	}
};
//  时间戳转换为时间格式
function changeTime(data, obj) {
	if(data) {
		if(data.length) {
			for(i in data) {
				var date = new Date(data[i][obj] * 1000);
				data[i].endTime = date.getFullYear() + "-" + timeadd(date.getMonth() + 1) + "-" + timeadd(date.getDate());
			}
		} else {
			var date = new Date(data[obj] * 1000);
			data[obj] = date.getFullYear() + "-" + timeadd(date.getMonth() + 1) + "-" + timeadd(date.getDate());
		}
	}
};
//时间格式转换为时间戳
function timeTOTimestamp(obj) {
	var timestamps =  obj?Date.parse(new Date(obj.replace(/-/g,'/'))):Date.parse(new Date());
	return timestamps;
}

function timeadd(sub) {
	if(sub < 10) {
		return "0" + sub;
	} else {
		return sub;
	}
}
//异步上传图片
function getimg(e,imgClass,form) {
	if($(e).attr("data-bool") == 0) {
		return;
	}
	var objUrl = getObjectURL(e.files[0]);
//	$(e).removeAttr('name');
	$(form).ajaxSubmit({
		success:function(data) {
			var data = JSON.parse(data);
			console.log(data)
			mui.toast('上传成功');
			$(e).siblings(".upload").attr({
				"data-id": data.filePath,
				"value": '更换图片'
			});
			$(imgClass).attr({
				"src": objUrl,
				"data-preview-src": objUrl
			}).show();
	//		$(e).attr('name', 'veriftail');
		},
		error:function(data){
			if(data.status==413){
				mui.toast('图片太大！请选择小一点的图片')
			}
		}
	});
};

//异步附加信息上传片
function addImg(e) {
	if(addimgCount >= 8) {
		return mui.toast("最多可上传8张图片");
	}
	var objUrl = getObjectURL(e.files[0]);
	$("#addimgBox").ajaxSubmit(function(data) {
		$(".addBox .addimgBox").eq(addimgCount).addClass("myimgbox");
		$(".addBox .addimgBox p").eq(addimgCount).addClass("delete");
		$(".addBox img").eq(addimgCount++).attr({
			src: objUrl,
			class: 'imgshow'
		});
		var mydata = JSON.parse(data)
		enclosureArr.push(mydata.filePath);
		console.log(enclosureArr);
		$(".addBox .upload").val("");
	});
};
/*
function getimg1(e, obj, sub, name) {
	var objUrl = getObjectURL(e.files[0]);
	if($(".files").val() != "") {
		$(".files").removeAttr('name');
	}
	console.log($("input[name='veriftail']").val())
	$("#myForm").ajaxSubmit(function(data) {
		var data = JSON.parse(data);
		$(sub).attr("data-id", objUrl);
		console.log(objUrl)
		$(".showimg1").attr("src", objUrl);
		$(".showimg1").attr("data-preview-src", objUrl);
		$(".showimg1").css("display", "block");
		$(".showimg1").val("更换图片");
		$(".files").attr('name', 'verifright');
	});
};
//显示一保子页面
*/
function showunique() {
	if($(".uniquelist").is(":hidden")) {
		$(".uniquelist").show();
	} else {
		$(".uniquelist").hide();
	}
};

//================================================================================
function nofind() {
	var img = event.srcElement;
	img.src = '../Public/Home/images/insurancemoren.jpg';
	img.onerror = null;
}

function myFn() {}
myFn.prototype = {
	//定义详情页效果
	scorllDom: function(obj, id) {
		$(obj).addClass("cur").siblings("p").removeClass("cur");
		var scorllH = $(id).offset().top;
		$("body,html").animate({
			scrollTop: scorllH + "px",
		}, 300);
	},
}

function collec() {
	$(".myHeart").parent("a").attr("href", "javascript:;");
	data = {
		"productid": hash,
	}
	ajaxPost("/Home/Product/collection", data);
}

function ajaxPost(url, datas) {
	mui.ajax(url, {
		data: data,
		dataType: "json",
		type: "post",
		success: function(data) {
			console.log(data);
			if(data.state == sccState) {
				console.log(searchid)
				if(searchid == "/Home/detail") {
					mysecc(data.msg);
					$(".myHeart").parent("a").attr("href", "javascript:collec();");
					if($(".myHeart").parent().hasClass("red")) {
						$(".myHeart").parent().removeClass("red");
						$(".myHeart").attr("class", "myHeart fa fa-heart-o");
						$(".myHeart").siblings("span").text("收藏");
					} else {
						$(".myHeart").parent().addClass("red");
						$(".myHeart").attr("class", "myHeart fa fa-heart");
						$(".myHeart").siblings("span").text("已收藏");
					}
				} else if(searchid == "/Home/exchangelist") {
					mysecc(data.msg);
				}
			} else {
				mysecc(data.msg);
			}
		}
	})
}
function ajaxGet(url,num){
	mui.ajax(url, {
		dataType: "json",
		type: "get",
		success: function(data) {
			console.log(data);
			vm2.unPay.splice(num,1);
		}
	});
}



//保存，提交，等等成功后弹框函数提示并且确定跳转
function mysecc(val, url) {
	mui.alert(val, function() {
		if(url) {
			window.location.href = url;
		} else {
			return;
		}
	});
}

//屏幕滚动到底部时候触发实际函数
function scrollDown(val) {
	if($(document).scrollTop() >= $(document).height() - $(window).height()) {
		if(isDown){
			return;
		}
		isDown = true;
		timer = setTimeout(function() {
			clearTimeout(timer);
			page++;
			if(searchid == "/Home/integral") {
				integralAjax(val);
			} else if(searchid == "/Home/myreturn") {
				returnAjax(val);
			} else if(searchid == "/Home/clearUp") {
				clearAjax(val);
			} else if(searchid == "/Home/personalDetail") {
				personalDetailAjax(val);
			} else if(searchid == "/Home/detail") {
				detailAjax();
			} else if(searchid == "/Home/suggestDetail") {
				suggestAjax();
			} else if(searchid == "/Home/getcoinDetail") {
				coinlistAjax();
			} else {
				mypolicyAjax(val);
			}
		}, 100);
		setTimeout(function(){
			isDown = false;
		},1000);
	}
}
//意见反馈详情的调用AJAX
function suggestAjax() {
	$(".tipsReturn").text("数据加载中。。。。");
	vm2.getajax("Feedback?" + "page=" + page);
}
//佣金明细的调用AJAX
function coinlistAjax() {
	$(".tipsReturn").text("数据加载中。。。。");
	vm2.getajax("/Home/WeixinTransfers/WithdrawalsDetails?page=" + page);
}
//详情页的调用AJAX
function detailAjax(val) {
	$(".tipsDetail").text("数据加载中。。。。");
	vm2.getajax("/Home/Product/evaluate?productid=" + hash + "&page=" + page);
}
//个人明细的调用AJAX
function personalDetailAjax(val) {
	$(".personalTips").text("数据加载中。。。。");
	vm2.getajax("/Home/User/cashRecord?id=" + hash + "&page=" + page + "");
}

//积分页面的调用AJAX
function integralAjax(val) {
	myAttr == 'get' ? $(".tipsGet").text("数据加载中。。。。") : $(".tipsUse").text("数据加载中。。。。");
	vm2.getajax("/Home/User/integral?state=" + val + "&page=" + page + "", myAttr);
}
//优惠券的调用AJAX
function returnAjax(val) {
	$(".tipsReturn").text("数据加载中。。。。");
	vm2.getajax("/Home/User/userCoupon?state=" + val + "&page=" + page + "", myAttr)
}
//我的保单的调用AJAX
function mypolicyAjax(val) {
	$(".tipsPolicy").text("数据加载中。。。。");
	vm2.getajax("/Home/User/order?page=" + page + "&state=" + val + "", myAttr);
}
//我要分享的调用AJAX
function clearAjax(val) {
	if(val == '#moneyDetail') {
		vm2.getajax("/Home/User/cashRecord?page=" + page + "", val);
	} else {
		vm2.getajax("/Home/User/customer?page=" + page + "", val);
	}
	$(".clearTips").text("数据加载中。。。。");

}

//兑换积分
function getCoin(obj) {
	data = {
		"couponid": $(obj).attr("data-id"),
	}
	console.log(data);
	ajaxPost("/Home/User/coupon", data);
}

//如果没有验证个人的话跳转页面
function myHref() {
	if(!vm1.lists.real_authentication || !vm1.lists.phone) {
		mysecc("您还没有实名认证或手机验证，请认证后再进行提交订单", "personalReset");
	} else if(!vm1.lists.addr) {
		mysecc("您还没有完善个人信息，请完善后再进行提交订单", "personalReset");
	} else {
		window.location.href = "policy#" + vm1.isCustom;
	}
}

//返回顶部函数
function backTop() {
	if($(window).scrollTop() > 10) {
		$(".backTop").addClass("backTopShow");
	} else {
		$(".backTop").removeClass("backTopShow");
	}
}

function countNumer(i,h,m,s){
	var myClass = '.timecount' +  i;
	var timer = setInterval(function(){
		if(s--<=0){
			s = 59;
			if(m--<=0){
				m = 59;
				if(h--<=0){
					h = 0;
					s = 0;
					m = 0;
					ajaxGet('home/user/defOrder?orderid='+vm2.unPay[parseInt(i)].OrderId);
					clearInterval(timer);
				}
			}
			
		}
		$(myClass).val(h+':'+m+':'+s);
	},1000);
}


function backTopClick() {
	$("body,html").animate({
		scrollTop: 0 + "px",
	}, 300);
}

function indexSearch(obj) {
	var searContent = $(obj).siblings(".search").val();
	if(!searContent) {
		return mysecc("内容不能为空");
	}
	//	window.location.href = "list#search#" + searContent;
	localStorage.searchContent = searContent;
	window.location.href = "/Home/list#search";
}

function checkIdcard(value) {
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
}

function backLine(path) {
	pushHistory();
	window.addEventListener("popstate", function(e) {
		window.location.href = path;
	}, false);

	function pushHistory() {
		var state = {
			title: "title",
			url: "#"
		};
		window.history.pushState(state, "title", "#");
	}
};
//创建日期
function createDateData(start,end) {
	var dateData=[{data:[]}];
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
    	var myMon = (x == start)? timeObj.monD : 1;
    	var endMon = (x == end)? timeObj1.monD : 12;
        var data={id:x,value:x,childs:[]};
        for(var y = myMon;y<=endMon;y++){
            var dayArr=[];
            var len=returnDayLen(x,y);
            var myDate = (y == myMon && x == start)? timeObj.dateD : 1;
    		var endDate = (y == endMon && x == end)? timeObj1.dateD : len;
           
            for(var z=myDate;z<=endDate;z++){
            	var _myDate = z<10?'0'+z:z;
                dayArr.push({id:_myDate,value:_myDate});
            }
            var _myMon = y<10?'0'+y:y;
            
            data.childs.push({id:_myMon,value:_myMon,childs:dayArr});
        }
        dateData[0].data.push(data);
    }
	console.log(dateData);
	return dateData;
}
//创建时分秒
function createTime() {
	var dateData = [{
		data: []
	}];
	for(var h = 0; h < 24; h++) {
		var minArr = [];
		for(var m = 0; m < 60; m++) {
			var sArr = [];

			for(var s = 0; s < 60; s++) {
				if(s < 10) {
					var myS = '0' + s;
				} else {
					var myS = s;
				}
				sArr.push({
					id: myS,
					value: myS
				})
			}
			if(m < 10) {
				var myM = '0' + m;
			} else {
				var myM = m;
			}

			minArr.push({
				id: myM,
				value: myM,
				childs: sArr
			});
		}
		if(h < 10) {
			var myH = '0' + h;
		} else {
			var myH = h;
		}

		dateData[0].data.push({
			id: myH,
			value: myH,
			childs: minArr
		})
	}
	return dateData;
}



$(function() {
	$('input[type=text]').on('click', function() {
		var target = $(this).parents('ul');
		setTimeout(function() {
			if(target.scrollIntoView || target.scrollIntoViewIfNeeded){
				target.scrollIntoView(true);
				target.scrollIntoViewIfNeeded();
			}
		}, 200);
	});
})