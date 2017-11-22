//定义组件
var Shop = {
	template:'#tpl_shop',
	data: function() {
		return {
			shop: {}
		}
	},
	// 加载数据
	created: function() {
		this.$http
			.get('data/' + this.$route.params.storeName + '.json')
			.then(function(res) {
				// console.log(res)
				// 数据存储
				this.shop = res.data.data;
			})
	}
}
var Product = {
	template:'#tpl_product',
	data:function(){
		return {
			nav:[]
		}
	},
	created:function(){
		this.$http
		// 从？开始也可以不加，但在实际写项目中一定要加，用来和后台交互区分
		.get('data/menu.json?store=' + this.$route.params.storeName)
		.then(function(res){
			this.nav=res.data.data;
		})
	}
}
var Food = {
	template:'#tpl_food',
	data: function() {
		return {
			lists:[],
			// 存储所有数据
			allsave:{}
		}
	},
	created:function(){
		this.$http
		// 从？开始也可以不加，但在实际写项目中一定要加，用来和后台交互区分
		.get('data/'+this.$route.params.foodId+'.json')
		.then(function(res){
			this.lists=res.data.data;
		})
	},
	// 或多次请求数据，所以$http请求简写成方法，复用
	methods:{
		getData:function(){
			// 为了不让前端多次重复请求数据，所以要进行判断，通过id判断，如果数据有，
			// 代表已经请求过，就直接用已经请求过得数据
			// 称之为性能优化
			var id = this.$route.params.foodId;
			// console.log(id)
			if (this.allsave[id]) {
				// 从缓存中更新
				this.lists = this.allsave[id]
			} else {
				this.$http
					.get('data/' + id + '.json')
					// 请求成功，存储数据
					.then(function(res) {
						// 存储数据
						this.lists = res.data.data;
						// 并缓存
						this.allsave[id] = res.data.data;
					})
			}
		},
		// 点击加号
		add: function(item) {
			// 怎么获取当前产品
			// console.log(item)
			// 更新item
			item.num++
		},
		// 点击减号
		reduce: function(item) {
			item.num--
		}
	},
	created:function(){
		this.getData();
	},
	// watch可以监听组件的某个属性的变化
	watch:{
		$route: function() {
			// 加载数据
			this.getData();
		}
	}
}
// 定义规则
var routes = [
	{
		path:'/shop/:storeName',
		component:Shop,
		// 定义子路由
		children:[
			{
				path:'product',
				component:Product,
				// 再定义子路由
				children:[
					{
						path:'food/:foodId',
						component:Food
					}
				]
			}
		]
	},
	// 默认路由
	{
		path:'*',
		redirect:'/shop/dks/product/food/01'
	}
]
// 实例化路由
var router = new VueRouter({
	routes:routes
})
// 创建store
var store = new Vuex.Store({
	// 定义共享数据
	state: {
		num: 0
	},
	// 注册修改方法
	mutations: {
		add: function(state, num) {
			state.num += +num
		},
		reduce: function(state, num) {
			state.num -= num;
		}
	}
})
// 在实例化中注册路由
var app = new Vue({
	el:'#app',
	data:{},
	router:router,
	// vuex 注册store
	store:store
})