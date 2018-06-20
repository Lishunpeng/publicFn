document.write('<script src="/shop/Public/home/js/jquery-2.1.0.js" type="text/javascript" charset="utf-8"></script>');
document.write('<script src="/shop/Public/home/js/fontsize.js" type="text/javascript" charset="utf-8"></script>');
document.write('<script src="/shop/Public/home/js/mui.min.js" type="text/javascript" charset="utf-8"></script>');
document.write('<script src="/shop/Public/home/js/vue.min.js" type="text/javascript" charset="utf-8"></script>');
document.write('<script src="/shop/Public/home/js/common.js" type="text/javascript" charset="utf-8"></script>');

//获取地址栏参数，name:参数名称
 function getUrlParms(name){
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
   var r = window.location.search.substr(1).match(reg);
   if(r!=null)
   return unescape(r[2]);
   return null;
  }
 

//去除省的重复
Array.prototype.province = function(){
  var arr = this,
  	result = [],
    i,j,len = arr.length;
  for(i = 0; i < len; i++){
    for(j = i + 1; j < len; j++){
      if(arr[i].warehouse_province === arr[j].warehouse_province){
        j = ++i;
      }
    }
    result.push(arr[i]);
  }
  return result;
}
//去除市的重复
Array.prototype.city = function(){
  var arr = this,
  	result = [],
    i,j,len = arr.length;
  for(i = 0; i < len; i++){
    for(j = i + 1; j < len; j++){
      if(arr[i].warehouse_city === arr[j].warehouse_city){
        j = ++i;
      }
    }
    result.push(arr[i]);
  }
  return result;
}
//去除区的重复
Array.prototype.area = function(){
  var arr = this,
  	result = [],
    i,j,len = arr.length;
  for(i = 0; i < len; i++){
    for(j = i + 1; j < len; j++){
      if(arr[i].warehouse_area === arr[j].warehouse_area){
        j = ++i;
      }
    }
    result.push(arr[i]);
  }
  return result;
}


//调用微信JS api 支付
function jsApiCall(data) {
	// console.log(111);
	data.jsapi = JSON.parse(data.jsapi);
	console.log(data.jsapi)
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        data.jsapi,
//      <?php echo $jsApiParameters['jsapi']; ?>,
    function(res) {
//  	res = JSON.stringify(res);
        // alert(WeixinJSBridge.log(res.err_msg));
//      alert(res);
        var str = obj2string(res);
        // var ret=obj2string(str);
        if (res.err_msg == "get_brand_wcpay_request:ok") {
        	localStorage.hash = 2;
           window.location.href = vm.myPath + "/Order/myOrder"
        } else {
        	myfun.alert('支付失败',function(){
        		localStorage.hash = 1;
        		window.location.href = vm.myPath + "/Order/myOrder"        		
        	});
        	console.log(1111)
        	$('.alertBox').addClass('false');
            console.log(res.err_code+','+ res.err_desc +','+ res.err_msg);
        }
    }
);
}

function obj2string(o) {
    var r = [];
    if (typeof o == "string") {
        return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    }
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o) {
                r.push(i + ":" + obj2string(o[i]));
            }
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(obj2string(o[i]))
            }
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString();
}

function callpay(data) {
	console.log(data)
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
        }
    } else {
		jsApiCall(data);
    }

}

