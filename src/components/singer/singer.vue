<template>
	<div class="singer">
		<list-view @select='selectSinger' :data="singers"></list-view>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import {getSingerList} from '@/api/singer'
	import {ERR_OK} from '@/api/config'
	// 初始化一个singer对象 
	import Singer from '@/common/js/singer'
	import ListView from '@/base/listview/listview'
	import {mapMutations} from'vuex'

	const HOT_SINGER_LEN = 10	
	const HOT_NAME = '热门'
	
	export default{
		components:{
			ListView
		},
		data(){
			return {
				singers:[]
			}
		},
		created(){
			this._getSingerList()
		},
		methods:{
			// 接收点击传过来的数据
			selectSinger(singer){
				this.$router.push({
					path:`/singer/${singer.id}`
				})
				// 这就实现了一次对mutation的提交 吧singer存到这里了
				this.setSinger(singer)
			},
			_getSingerList(){
				getSingerList().then((res)=>{
					if(res.code === ERR_OK){
						this.singers = this._normalizeSinger(res.data.list);
					}
				})
			},
			//获取到数据形势不对 给他归纳一下 这个很有用 回去整理
			_normalizeSinger(list){
				let map = {
					hot:{
						title:HOT_NAME,
						items:[]
					}
				}
				//foreach 和$.each一样 只不过参数是反的 第一个是值 第二个是索引
				list.forEach((item,index)=>{
					if(index < HOT_SINGER_LEN){
						map.hot.items.push(new Singer({
							id:item.Fsinger_mid,
							name:item.Fsinger_name
						}))
					}
					//根据findex做聚类
					const key = item.Findex;
					if(!map[key]){
						map[key] = {
							//显示在上边的title
							title:key,
							items:[]
						}
					}
					map[key].items.push(new Singer({
						id: item.Fsinger_mid,
						name: item.Fsinger_name
					}))
				})
				console.log(map)
				//为了得到有序列表 需要处理map
				let hot = [];
				let ret = [];
				for(let key in map){
					let val = map[key];
					if(val.title.match(/[a-zA-Z]/)){
						ret.push(val)
					}else if(val.title === HOT_NAME){
						hot.push(val)
					}
				}
				ret.sort((a,b)=>{
					//charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				})
				return hot.concat(ret);
			},
			// 语法糖
			...mapMutations({
				setSinger:'SET_SINGER'
			})
			
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer
	position:fixed
	top:88px
	bottom:0
	width:100%
</style>