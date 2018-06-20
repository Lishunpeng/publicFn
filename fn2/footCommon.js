


Vue.component('v-footer', {
	props:{
     html: Array
	},
//	template:"<h1>{{html}}</h1>"
//	template: '<li v-for="data in html"><a :href="data.mylink"></a><span :class="data.myclass"></span><p v-text="data.mytext"></p></li>' 
	template: '<ul class="myfoot"><li v-for="data in html" :class="data.myclass"><a :href="data.mylink"><span></span><p v-text="data.mytext"></p></a></li></ul>'
//	'<div class="blurBox"><div>'
})

// 创建根实例
var footVue = new Vue({
  el: '#foot',
  data:{
  	footData:[
  		{myclass:'footIndex',mylink:"/shop/index.php/Home/Index#0",mytext:"首页"},
  		{myclass:'footClass',mylink:"/shop/index.php/Home/Cat/showList#1",mytext:"全部分类"},
//		{myclass:'phone',mylink:"#2",mytext:"联系客服"},
  		{myclass:'shopCar',mylink:"/shop/index.php/Home/Good/cartList#2",mytext:"购物车"},
  		{myclass:'footPerson',mylink:"/shop/index.php/Home/Personal/myCenter#3",mytext:"个人中心"}
  	]
  }
})
