var search = window.location.pathname;
var hash = window.location.hash.replace("#", "");
var patt1 = new RegExp("/shop/index.php/Home",'g');
search = search.replace(patt1,"");
console.log(search);
var myphone = /^1\d{10}$/; //手机号正则
var myidcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证验证
var myParameter = getUrlParms('cart_add');
var myfun = {
	//index 轮播
	coopro: function() {
		var swiper = new Swiper('.swiper-container', {
			loop: true,
			autoplay: 3000,
			pagination: '.swiper-pagination',
			paginationType: 'bullets',
			autoplayDisableOnInteraction: false,
		});
	},
	//底部切换
	footChange: function() {
		hash == "" ? hash = 0 : "";
		$('.myfoot li').eq(hash).addClass('cur');
	},
	//我的订单切换
	orderChange: function(obj,val) {
		var num = $(obj).index();
		localStorage.hash = val;
		$(obj).addClass("cur").siblings("li").removeClass("cur");
		$(".myorderCon ul").eq(num).addClass("cur").siblings("ul").removeClass("cur");
		myfun.getAjax(vm.myPath+'/Order/showOrder?good_order_status='+val);
	},
	//商品选择切换图片
	car_choose: function() {
		$(".mycar_csLogo>span").on("click", function() {
			var bool = true;
			if($(this).attr("class") == "cur") {
				$(this).removeClass("cur");
				$(".car_choose>span").removeClass('cur');
			} else {
				$(this).addClass("cur");
			}
			
			$(".mycar_csLogo span").each(function(e) {
				if (!$(this).hasClass('cur')) {
					bool = false;
				}
			});
			bool?$('.car_choose>span').addClass("cur"):"";
			myfun.allMoneyCount();
		});
		$(".car_choose>span").on("click", function() {
			if($(this).attr("class") == "cur") {
				$(this).removeClass("cur");
				$(".mycar_csLogo span").each(function(e) {
					$(this).removeClass("cur");
				});
			} else {
				$(this).addClass("cur");
				$(".mycar_csLogo span").each(function(e) {
					$(this).addClass("cur");
				});
			}
			myfun.allMoneyCount();
		});
	},
	//店铺认证切换效果
	/*shopAuthChange: function() {
		$('.shopAuth span').on('click', function() {
			$(this).attr('data-class') == 'writeInfo' ? $('.writeInfoBox').show().siblings('div').hide() : $('.putPhoneBox').show().siblings('div').hide()
			$(this).addClass('active').siblings('span').removeClass('active')
			//			$(this).hasClass('active')?"":$(this).removeClass('active').siblings('span').addClass('active')
		})
	},*/
	//下一步
	shopVerifi: function(obj) {
		if(!vm.phone || !vm.addr || !vm.addrDetail || !vm.linkPeople||!vm.shopName) {
			return mui.alert('信息不能为空');
		}
		if(!myphone.test(vm.phone)) {
			return mui.alert("手机格式不对");
		}
		$(obj).attr('disabled','disabled');
		
		var myAddr  = vm.addr.split(',');
		myAddr.length==3?'':myAddr[2] = '';
		console.log(myAddr)
		
		var postData = {
			store_user:vm.linkPeople,
			store_phone:vm.phone,
			store_name:vm.shopName,
			store_province:myAddr[0],
			store_city:myAddr[1],
			store_area:myAddr[2],
			store_address:vm.addrDetail
		};
		console.log(postData);
		myfun.postAjax(vm.myPath+'/Cert/addCertFirst',postData);
	},
	//异步上传图片
	uploadImg:function(e){
		var objUrl = myfun.getObjectURL(e.files[0]);
        myfun.sendFile(vm.myPath+'/Cert/upCertimg', e.files[0], objUrl,e);
       
	},
	//删除滑动效果
	myCarDetail: function() {
		var expansion = null; //是否存在展开的list
		var container = $('.order_complete li');
		for(var i = 0; i < container.length; i++) {
			var x, y, X, Y, swipeX, swipeY;
			container[i].addEventListener('touchstart', function(event) {
				x = event.changedTouches[0].pageX;
				y = event.changedTouches[0].pageY;
				swipeX = true;
				swipeY = true;
//				if(expansion) { //判断是否展开，如果展开则收起
//					expansion.className = "";
//				}
			});
			container[i].addEventListener('touchmove', function(event) {

				X = event.changedTouches[0].pageX;
				Y = event.changedTouches[0].pageY;
				// 左右滑动
				if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
					// 阻止事件冒泡
					event.stopPropagation();
					if(X - x > 1) { //右滑
						event.preventDefault();
						this.className = ""; //右滑收起
					}
					if(x - X > 1) { //左滑
						event.preventDefault();
						this.className = "swipeleft"; //左滑展开
						expansion = this;
					}
					swipeY = false;
				}
				// 上下滑动
				if(swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
					swipeX = false;
				}
			});
		}
	},
	//单个
	add_sub: function() {
		$('.sub').attr("disabled", 'disabled');
		$('.sub').addClass("enclick");
		$(".csNumbox button").bind("click", function() {
			var $maxAttr = parseInt($(this).parents('.csNumbox').attr('data-max'));//存库
			console.log($maxAttr);
			console.log(search);
			if($(this).attr("data-bool") == "+") {
				vm.csNum++;
				if(vm.csNum >= $maxAttr) {
					$(this).attr("disabled", "disabled");
					$(this).addClass("enclick");
				}
				$(this).siblings('.sub').attr("disabled", false);
				$(this).siblings('.sub').removeClass("enclick");
			} else {
				vm.csNum--;
				if(vm.csNum <= 1) {
					$(this).attr("disabled", "disabled");
					$(this).addClass("enclick");
				}
				$(this).siblings('.add').attr("disabled", false);
				$(this).siblings('.add').removeClass("enclick");
				
			}

		});
		$(".csNum").on("change", function() {
			var $maxAttr = parseInt($(this).parents('.csNumbox').attr('data-max'));//存库
			console.log($maxAttr);
			var re = /^[1-9]+\d*$/;
			if(!re.test(vm.csNum)) {
				vm.csNum = 1;
				$(this).siblings(".sub").attr("disabled", "disabled");
				$(this).siblings(".sub").addClass("enclick");
				$(this).siblings(".add").attr("disabled", false);
				$(this).siblings(".add").removeClass("enclick");
			}
			if(vm.csNum >= $maxAttr) {
				vm.csNum = $maxAttr;
				$(this).siblings(".add").attr("disabled", "disabled");
				$(this).siblings(".add").addClass("enclick");
				$(this).siblings(".sub").attr("disabled", false);
				$(this).siblings(".sub").removeClass("enclick");
			} else {
				$(this).siblings(".add,.sub").attr("disabled", false);
				$(this).siblings(".add,.sub").removeClass("enclick");
				if(vm.csNum == 1) {
					$(this).siblings(".sub").attr("disabled", "disabled");
					$(this).siblings(".sub").addClass("enclick");
				}

			}
		})
	},
	
	//多个
	add_sub_more: function() {
		$(".csNumbox button").bind("click", function() {
			var $maxAttr = parseInt($(this).parents('.csNumbox').attr('data-max'));//存库	
			var myIndex = $(this).parents('.csNumbox').attr('data-index');
			if($(this).attr("data-bool") == "+") {
				vm.child[myIndex].cart_num++;
				if(vm.child[myIndex].cart_num>= $maxAttr) {
					vm.child[myIndex].cart_num = $maxAttr;
					$(this).attr("disabled", "disabled");
					$(this).addClass("enclick");
				}
				$(this).siblings('.sub').attr("disabled", false);
				$(this).siblings('.sub').removeClass("enclick");
			} else {
				vm.child[myIndex].cart_num--;
				if(vm.child[myIndex].cart_num <= 1) {
					vm.child[myIndex].cart_num=1;
					$(this).attr("disabled", "disabled");
					$(this).addClass("enclick");
				}
				$(this).siblings('.add').attr("disabled", false);
				$(this).siblings('.add').removeClass("enclick");
				
			}
			myfun.allMoneyCount();	
		});
		$(".csNum").on("change", function() {
			var $maxAttr = parseInt($(this).parents('.csNumbox').attr('data-max'));//存库
			var myIndex = $(this).parents('.csNumbox').attr('data-index');
			console.log($maxAttr);
			var re = /^[1-9]+\d*$/;
			if(!re.test(vm.child[myIndex].cart_num)) {
				vm.child[myIndex].cart_num = 1;
				$(this).siblings(".sub").attr("disabled", "disabled");
				$(this).siblings(".sub").addClass("enclick");
				$(this).siblings(".add").attr("disabled", false);
				$(this).siblings(".add").removeClass("enclick");
			}
			if(vm.child[myIndex].cart_num >= $maxAttr) {
				vm.child[myIndex].cart_num = $maxAttr;
				$(this).siblings(".add").attr("disabled", "disabled");
				$(this).siblings(".add").addClass("enclick");
				$(this).siblings(".sub").attr("disabled", false);
				$(this).siblings(".sub").removeClass("enclick");
			} else {
				$(this).siblings(".add,.sub").attr("disabled", false);
				$(this).siblings(".add,.sub").removeClass("enclick");
				if(vm.child[myIndex].cart_num == 1) {
					$(this).siblings(".sub").attr("disabled", "disabled");
					$(this).siblings(".sub").addClass("enclick");
				}

			}
			myfun.allMoneyCount();
		})
	},
	//购物车修改数量完成提交AJAX
	car_updateNum:function(obj){
		var myId = $(obj).attr('data-id');
		var num = $(obj).siblings('.num_hide').find('.csNum').val();
		var postData = {
			cart_id:myId,
			cart_num:num
		}
		console.log(postData);
		myfun.postAjax(vm.myPath + '/Good/dueNum',postData,obj);
	},
	//计算总值
	allMoneyCount:function(){
		vm.allMoney = 0;
		$(".mycar_csLogo span").each(function(index,e) {
			if ($(e).hasClass("cur")) {
				vm.allMoney += vm.child[index].cart_par_price * vm.child[index].cart_num;
			}	
		});
		vm.allMoney = (vm.allMoney).toFixed(2);
	},
	//购物车删除
	car_delet:function(obj){
		$(obj).attr('disabled','disabled');
		var data_id = $(obj).attr('data-id');
		var postData  = {
			cart_id:data_id
		};
		this.postAjax(vm.myPath + '/Good/delShop',postData,obj);
	},
	//购物车的修改按钮
	car_update:function(obj){
		$(obj).hide().siblings('.num_show').hide().siblings('.num_hide,.order_update_show').show();
	},
	//显示盒子
	show_numBox: function() {
		$(".numberBox").show();
		$(document.body).css({
			"overflow-y": "hidden"
		});
		$(".numberCon").animate({
			"bottom": '0px'
		}, 150);
	},
	//移除数量盒子
	remove_numBox: function() {
		$(".numberBox").on("click", function(event) {
			if(event.target == this) {
				$(document.body).css({
					"overflow-y": "auto"
				});
				var $attr = $(".csNum").val();
				var $val = $(".styleBox .cur").text();
				$(".chooseNum span.number").text($attr + '件');
				$(".chooseNum span.itStyle").text($val);
				$(".carproD_cs i").text('×' + $attr);
				$(".numberCon").animate({
					"bottom": '-10rem'
				}, 150, function() {
					$(".numberBox").hide();
				});
			}
		});
	},
	changeStyle: function() {
		$(".styleBox li").on("click", function() {
			var data = JSON.parse($(this).attr('data-data'));
			vm.csNum = 1
			$('.csNum').val(vm.csNum);
			vm.parameter = data;
			$('.par_inventory').text('库存：'+data.par_inventory+'件');
			$('.csNumbox').attr('data-max',data.par_inventory);
			$(this).addClass("cur").siblings("li").removeClass("cur");
			$(".add").attr("disabled", false);
			$(".add").removeClass("enclick");
			$(".sub").attr("disabled", false);
			$(".sub").removeClass("enclick");
		})
	},
	//加入购物车
	addCar:function(obj,val){
		console.log(val)
		if (val == 1) {
			var $text = $('.itStyle').text();
			if ($text=="") {
				return	this.show_numBox()
			}
		}
		var postData = {
			good_id:vm.goods.good_id,
			par_id:vm.parameter.par_id,
			par_num:vm.csNum
		}
		console.log(postData);
		this.postAjax(vm.myPath+'/Good/addShop',postData,obj);
	},
	//全部分类切换样式
	allClassChange:function(obj){
			$(obj).addClass('cur').siblings('li').removeClass('cur');
			$('.allClass_right ul').eq($(obj).index()).show().siblings('ul').hide();
	},
	//我的alert框
	alert: function(msg, fn) {
		$("body").append("<div class='myalert'>" +
			"<div class='alertBox'><p class='alertTitle'></p><p class='alertMsg'>" + msg + "</p><span class='alertBtn'>确定</span></div>" +
			"</div>");
		$(document.body).css({
			"overflow-y": "hidden"
		});
		$(".alertBtn").on("click", function() {
			$(".myalert").remove();
			$(document.body).css({
				"overflow-y": "auto"
			});
		});
		if(fn) {
			$(".alertBtn").on("click", function() {
				return fn()
			});
		}
	},
	//我的prompt框
	prompt: function(msg, trueFn, falseFn) {
		$("body").append("<div class='myalert'>" +
			"<div class='alertBox false'><p class='alertTitle'></p><p class='alertMsg'>" + msg + "</p><span class='falseBtn'>取消</span><span class='trueBtn'>确定</span></div>" +
			"</div>");
		$(document.body).css({
			"overflow-y": "hidden"
		});
		$(".trueBtn").on("click", function() {
			$(".myalert").remove();
			$(document.body).css({
				"overflow-y": "auto"
			});
		});
		$(".falseBtn").on("click", function() {
			$(".myalert").remove();
			$(document.body).css({
				"overflow-y": "auto"
			});
		});
		if(trueFn) {
			$(".trueBtn").on("click", function() {
				return trueFn()
			});
		}
		if(falseFn) {
			$(".falseBtn").on("click", function() {
				return falseFn()
			});
		}
	},
	//post提交AJAX
	postAjax:function(path,mydata,obj){
		$('.loadingBox').show();
		console.log(path)
		mui.ajax({
			type:'post',
			url: path,
			data: mydata,
			success:function(data){
				$('.loadingBox').hide();
				 data = JSON.parse(data);
				 console.log(data)
				if (data.status=='111') {
					if (search=='/Cert/showcert' || search=='/Cert/showcert.html') {
						$(obj).attr('disabled',false);
						mui.alert('提交成功！','提示',function(){
							location.href = vm.myPath+'/Personal/myCenter#3';							
						});
//						$('.writeInfoBox').hide().siblings('div').show();
//						$('.putPhone').addClass('active').siblings('span').removeClass('active');
					}else if(search == '/Good/cartList'){
						if (path.indexOf('/delShop')>0){
							var data_index = $(obj).attr('data-index');
							vm.child.splice(data_index,1);
							console.log(vm.child);
							$(obj).attr('disabled',false);
							myfun.allMoneyCount();
							$(obj).parents('li').removeClass('swipeleft');
							return mui.toast('删除成功');
						}else if(path.indexOf('/downorder')>0){
							window.location.href = vm.myPath + '/Good/ordershow?cart_add='+ data.cart_add;
						}else if(path.indexOf('/dueNum')>0){
							$(obj).hide().siblings('.num_hide').hide().siblings('.num_show,.order_update').show();
						}
					}else if(search == '/Address/editAddress' || search == '/Address/editAddress.html'){
						return myfun.alert('提交成功',function(){
							vm.gotoAddr?window.location.href = vm.myPath + '/Address/showlist?cart_add='+vm.gotoAddr:window.location.href = vm.myPath + '/Address/showlist'
						})
					}else if(search == '/Address/showlist' || search == '/Address/showlist.html'){
						if (path.indexOf('/delAddress')>0) {
							var data_index = $(obj).attr('data-index');
							vm.child.splice(data_index,1);
							return mui.toast('删除成功');
						}else if(path.indexOf('/setAddress')>0){
							var data_index = $(obj).attr('data-index');
							for (i in vm.child) {
								vm.child[i].is_use = 0;
							}
							vm.child[data_index].is_use = 1;
						}else if(path.indexOf('/changeAddress')>0){
							window.location.href = vm.myPath + '/Good/ordershow?cart_add=' + data.cart_add;
						}
					}else if(search=='/Good/ordershow'){
						console.log(data)
						callpay(data.jsApiParameters);
					}else if(search=='/Order/myOrder'||search=='/Order/myOrder.html'){
						
						if (path.indexOf('/canelOrder')>0) {
							var data_index = $(obj).attr('data-index');
							vm.getOrder.splice(data_index,1);
							return mui.toast('订单取消成功');
						}else if(path.indexOf('/firmOrder')>0){
							localStorage.hash = 4;
							myfun.alert('确认收货成功',function(){window.location.href = vm.myPath + '/Order/myOrder';})
						}else if(path.indexOf('/gotopayorder')>0){
							
//							console.log(data.jsApiParameters,'data.jsApiParameters')
							callpay(data.jsApiParameters);
						}
					}else if(search=='/Personal/supplierApply' || search=='/Personal/supplierApply.html'){
						return myfun.alert('您的申请已提交，我们会尽快联系您，请您留意您的手机！',function(){
							window.location.href = vm.myPath + '/Personal/myCenter#3';
						});
					}else if(search=='/Personal/suggest' || search=='/Personal/suggest.html'){
						return myfun.alert('感谢您的反馈，我们会做的更好！',function(){
							window.location.href = vm.myPath + '/Personal/myCenter#3';
						});
					}else if(search=='/Order/orderDetail' || search=='/Order/orderDetail.html'){
						if (path.indexOf('/canelOrder')>0) {
							return myfun.alert('订单取消成功！',function(){
								window.location.href = vm.myPath + '/Personal/myCenter#3';
							});
						}else if(path.indexOf('/gotopayorder')>0){
							console.log(data)
							callpay(data.jsApiParameters);
						}else if(path.indexOf('/firmOrder')>0){
							localStorage.hash = 4;
							myfun.alert('确认收货成功',function(){window.location.href = vm.myPath + '/Order/myOrder';})
						}
					}else if(search=='/Good/showGood' || search=='/Good/showGood.html'){
						return myfun.alert('加入购物车成功！',function(){
							$(document.body).css({
								"overflow-y": "auto"
							});
							$(".numberCon").animate({
								"bottom": '-10rem'
							},150, function() {
								$(".numberBox").hide();
							});
						});
					}
					
				}else if(data.status=='100'){
					if(search=='/Good/showGood' || search=='/Good/showGood.html'){
						return myfun.alert('库存不足！',function(){
							$(document.body).css({
								"overflow-y": "auto"
							});
							$(".numberCon").animate({
								"bottom": '-10rem'
							},150, function() {
								$(".numberBox").hide();
							});
						});
					}else if(search=='/Good/cartList' || search=='/Good/cartList.html'){
						return myfun.alert(data.message);
					}
				}
			}
			
		});
	},
	//get提交AJAX
	getAjax:function(path){
		$('.loadingBox').show();
		mui.ajax({
			type:'get',
			url: path,
			success:function(data){
				console.log(path)
				$('.loadingBox').hide();
				console.log(data);
				data = JSON.parse(data);
				console.log(data);
				console.log(search)
				if (data.status=='111') {
					if (search=='/Cert/showcert' || search=='/Cert/showcert.html') {
						if (path.indexOf('/againCert')>0) {
								window.location.href = vm.myPath + '/Cert/showcert';
						}else if(path.indexOf('/changeStatus')>0){
							return myfun.alert('提交成功',function(){
						 		window.location.href = vm.myPath + '/index';
							});
						}
						
					}else if(search=='/Order/myOrder'){
						vm.getOrder = data.goodorder;
					}else if(search=='/Good/showFind'){
						console.log(data)
					}
					
				}else if(data.status=='100'){
					 if(search=='/Order/myOrder'){
						vm.getOrder = [];
					}
				}
				
				
			}
		});
	},
	//图片异步ajax方法提交
    sendFile: function(url, pic, objUrl,obj) {
    	var fd = new FormData();
        fd.append($(obj).attr('name'), pic);
    	$.ajax({
             url: url,
             type: "POST",
             data: fd,
             processData: false,  // 告诉jQuery不要去处理发送的数据
             contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
             success: function(response,status,xhr){
                var result=$.parseJSON(response);
                if (result.status=='111') {
                	 $(obj).parents('span').css("background-image",'url('+objUrl+')');
//      			 $(obj).val(objUrl);
                    return mui.toast('图片上传成功');
				} else {
                    return mui.toast("图片上传失败，请重试");
                }
             }
        });
    	
    	
    	/*var fd = new FormData();
        fd.append($(obj).attr('name'), pic);
        var ajax = new XMLHttpRequest();
        ajax.open('POST', url, true);
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                img_k = ajax.responseText;
               	img_k =	JSON.parse(JSON.parse(img_k));
                if (img_k.status=='111') {
                	 $(obj).parents('span').css("background-image",'url('+objUrl+')');
        			 $(obj).val(objUrl);
                    return mui.toast('图片上传成功');
				} else {
                    return mui.toast("图片上传失败，请重试");
                }
            }
        }
        ajax.send(fd);
        */
    },
    //转化路劲
    getObjectURL: function(file) {
        var url = null;
        console.log(545454)
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    },
    //图片页面提交
    postImgData:function(obj){
    	var ofront = $('.frontBox').find('input').val();
    	var obehindBox = $('.behindBox').find('input').val();
    	var omyshopBox = $('.myshopBox').find('input').val();
    	if (!ofront || !obehindBox || !omyshopBox) {
    		return	myfun.alert('请确定是否三种图片都上传了，在进行提交！');
    	}
    	$(obj).attr('disabled','disabled')
    	myfun.getAjax(vm.myPath + '/Cert/changeStatus');
    },
    //再次认证
    againCert:function(obj){
    	$(obj).attr('disabled','disabled');
    	myfun.getAjax(vm.myPath + '/Cert/againCert');
    },
    //添加收货地址
    addAddress:function(obj){
    	console.log(vm.name,vm.phone,vm.addr,vm.addrDetail)
    	if (!vm.name||!vm.phone||!vm.addr||!vm.addrDetail) {
    		return this.alert('信息不完整！');
    	}
    	if(!myphone.test(vm.phone)) {
			return mui.alert("手机格式不对");
		}
    	var myAddr  = vm.addr.split(',');
		myAddr.length==3?'':myAddr[2] = '';
		vm.addr_id = $(obj).attr('data-id');
		console.log(vm.addr_id)
		var postData = {
			add_phone:vm.phone,
			add_id:vm.addr_id,
			add_province:vm.phone,
			add_user:vm.name,
			add_province:myAddr[0],
			add_city:myAddr[1],
			add_area:myAddr[2],
			add_con:vm.addrDetail
		};
		console.log(postData);
		myfun.postAjax(vm.myPath+'/Address/modifyAddress',postData);
    },
    //编辑地址
    addr_edit:function(obj){
    	var $id = $(obj).attr('data-id');
    	vm.gotoAddr?window.location.href = vm.myPath + '/Address/editAddress?add_id='+$id+'&cart_add='+vm.gotoAddr:window.location.href = vm.myPath + '/Address/editAddress?add_id='+$id;
    },
    //删除地址
    addr_delet:function(obj){
    	var $id = $(obj).attr('data-id');
    	var data = {
    		add_id:$id
    	}
    	console.log(data);
    	this.postAjax(vm.myPath+'/Address/delAddress',data,obj);
    	
    },
    //设为默认
    setAddress:function(obj){
    	var $id = $(obj).attr('data-id');
		var postData = {
			add_id:$id
		}
    	this.postAjax(vm.myPath + '/Address/setAddress',postData,obj);
    },
    //购物车结算
    settlement:function(obj){
		var myJudey = false;
		var postData = {};
		postData.cart_id = [];
		
    	$(".mycar_csLogo span").each(function(index,e) {
    		if ($(this).hasClass('cur')) {
    			myJudey = true;
    			postData.cart_id.push($(this).attr('data-id'))
    		}
    	});
		if (!myJudey) {
			return myfun.alert('请选择一个商品下单');
		}
		console.log(postData);
		myfun.postAjax(vm.myPath + '/Good/downorder',postData);
		
		
    },
    //省变化
    myProvince:function(obj){
    	vm.city = [];
		vm.addr_area = [];
		vm.warehouse_name = [];
		vm.warehouse_ID = "";
		var $province = $(obj).children('option:selected').text();
		for (i in vm.warehouse) {
			if ($province ==vm.warehouse[i].warehouse_province) {
				vm.city.push(vm.warehouse[i])
			}
		}
		console.log(vm.city);
		vm.city = vm.city.city();
		console.log($('.chooseIt_city').text());
		$('.chooseIt_city').attr('selected','selected');
		$('.chooseIt_city').siblings('option').attr('selected',false);
    },
    myCity:function(obj){
    	vm.addr_area = [];
		vm.warehouse_name = [];
		vm.warehouse_ID = "";
		var $city = $(obj).children('option:selected').text();
		for (i in vm.warehouse) {
			if ($city ==vm.warehouse[i].warehouse_city) {
				vm.addr_area.push(vm.warehouse[i])
			}
		}
		
    	vm.addr_area = vm.addr_area.area();
		console.log(vm.addr_area);
    	
    },
    myArea:function(obj){
    	vm.warehouse_name = [];
    	vm.warehouse_ID = "";
		var $area = $(obj).children('option:selected').text();
		for (i in vm.warehouse) {
			if ($area == vm.warehouse[i].warehouse_area) {
				vm.warehouse_name.push(vm.warehouse[i]);
			}
		}
		console.log(vm.warehouse_name);
	},
    myWarehouse:function(obj){
    	var $name = $(obj).children('option:selected').text();
		for (i in vm.warehouse) {
			if ($name == vm.warehouse[i].warehouse_name) {
				vm.warehouse_ID = vm.warehouse[i].warehouse_id;
			}
		}
    },
    //确认订单地址变化
    changeAddr:function(){
    	vm.warehouse = vm.dataJson.warehouse;
		vm.province = vm.warehouse.province();
    	$('.aff_province').on('change',function(){
    		myfun.myProvince(this);
    	});
    	$('.aff_city').on('change',function(){
    		myfun.myCity(this);
    	});
    	$('.aff_area').on('change',function(){
    		myfun.myArea(this);
    	});
    	$('.aff_name').on('change',function(){
    		myfun.myWarehouse(this);
    	});
    	$('.aff_topay').on('click',function(){
    		if (!vm.warehouse_ID) {
    			return myfun.alert('请选择自提仓库地址');
    		}
    		if (!vm.dataJson.address) {
    			return myfun.alert('请先添加收货地址');
    		}
    		console.log(vm.warehouse_ID);
    		var cartId = getUrlParms('cart_add');
    		var postData = {
    			warehouse_id:vm.warehouse_ID,
    			cart_add:cartId,
    			good_order_note:vm.leaveMsg
    		};
    		console.log(postData);
    		myfun.postAjax(vm.myPath+'/Good/gotopay',postData);
    	})
    	
    	
    	
    },
    //确认订单跳回
    changeAddrList:function(obj){
    	var $id = $(obj).attr('data-id');
    	if (vm.gotoAddr) {
    		var postData = {
    			cart_add:vm.gotoAddr,
    			add_id:$id
    		}
    		myfun.postAjax(vm.myPath+'/Address/changeAddress',postData,obj);
    	}
    },
     //返回跳转固定页面
    backLink: function(path) {
	    myfun.pushHistory();
	    window.addEventListener("popstate", function(e) {
	        window.location.href = path;
	    }, false);
	},
    pushHistory: function() {
        var state = {
            title: "title",
            url: "#"
        };
        window.history.pushState(state, "title", "#");
    },
    //取消订单
    cancleOrder:function(obj){
    	
    	myfun.prompt('确定删除订单吗？',function(){
    		var $id = $(obj).attr('data-id');
	    	var postData = {
	    		id:$id
	    	}
	    	myfun.postAjax(vm.myPath+'/Order/canelOrder',postData,obj);
    	});
    },
    //供应商申请
    supplierApply:function(obj){
    	if (!vm.linkPeople ||!vm.phone ||!vm.mainProduct||!vm.describe) {
    	 	return	myfun.alert('信息不能为空')
    	}
    	if(!myphone.test(vm.phone)) {
			return mui.alert("手机格式不对");
		}
    	var postData = {
    		supplier_user:vm.linkPeople,
    		supplier_phone:vm.phone,
    		supplier_good:vm.mainProduct,
    		supplier_intro:vm.describe
    	}
    	myfun.postAjax(vm.myPath + '/Personal/addSupplier',postData);
    },
    //投诉建议提交
    suggestPost:function(){
    	if (!vm.linkPeople ||!vm.suggestCon) {
    	 	return	myfun.alert('必填信息不能为空')
    	}
    	if(vm.phone){
	    	if(!myphone.test(vm.phone)) {
				return mui.alert("手机格式不对");
			}
    	}
    	var postData = {
    		suggest_user:vm.linkPeople,
    		suggest_phone:vm.phone,
    		suggest_intro:vm.suggestCon
    	}
    	console.log(postData);
    	myfun.postAjax(vm.myPath + '/Personal/addSuggest',postData);
     },
     //去支付
    gotoPay:function(obj){
    	var $id = $(obj).attr('data-id');
    	var postData = {id:$id};
    	console.log(postData);
    	myfun.postAjax(vm.myPath +'/Good/gotopayorder',postData);
    },
    //确认收货
    aff_getShop:function(obj){
    	myfun.prompt('是否确认收货!',function(){
    		var $id = $(obj).attr('data-id');
    		var postData = {id:$id};
    		console.log(postData);
    		myfun.postAjax(vm.myPath +'/Order/firmOrder',postData,obj);
    	},function(){
    		myfun.alert('您取消了确认收货');  
    		$('.alertBox').addClass('false');
    	})
    	
    	
    },
    //搜索
    mySearch:function(obj){
    	if (!vm.searchData) {
    		return	myfun.alert('信息不为空！');
    	}
    	window.location.href = vm.myPath+'/Index/showFind?good_name='+ vm.searchData;
    },
    //当页面搜索
    in_Search:function(){
    	if (!vm.searchData) {
    		return	myfun.alert('信息不为空！');
    	}
    	myfun.getAjax(vm.myPath+'/Index/showFind?good_name='+vm.searchData);
    },
    //改变地址本地值hash
    changeHash:function(val){
    	localStorage.hash = val; 
    },
    //点击input消除绝对定位
    removeFiex:function(obj){
    	var windowH = $(window).height();
    	window.onresize = function() {
			if(windowH == $(window).height()) {
				$(obj).css('position', 'fixed');
			} else {
				$(obj).css('position', 'inherit');
			}
		}
    }
}

var vm = new Vue({
	el: "#container",
	data: {
		searchData:"",//搜索数据
		warehouse_ID:'',//仓库ID
		warehouse_name:[],//仓库数
		province:[],//省
		city:[],//市
		addr_area:[],//区
		addr_id:"",//地址ID
		name:"",//收货姓名
		userStatus:"",//用户状态
		myPath:'/shop/index.php/Home',//公共链接
		phone: "", //手机号码
		addr: "", //地址
		shopName:'',//店铺名称
		addrDetail: "", //详细地址
		linkPeople: "", //联系人
		dataJson:{},//页面获取数据
		mainProduct:"",//主要产品
		describe:"",//相关描述
		child:{},//dataJson子数据
		goods:[],//商品详情的商品数据
		parameter:[],//商品详情
		csNum:1,//商品详情数量
		allMoney:0,//总计
		address:[],//确认订单的收货地址信息
		warehouse:[],//上门自提
		gotoAddr:"",//确认订单跳转带参
		leaveMsg:"",//买家留言
		getOrder:[],//订单信息
		suggestCon:""//投诉建议内容
	},
	methods: {
		
	}

})


$(document).ready(function(){
	if (search=='/Order/myOrder' || search=='/Order/myOrder.html') {
		$('.loadingBox').css('background','rgba(255,255,255,.6)');
		return;
	}
	
	$('.loadingBox').css('background','rgba(255,255,255,.6)').hide();
});