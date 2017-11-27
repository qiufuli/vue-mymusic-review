<template>
<div class="recommend">
	<!--需要把discList传入 让页面dom渲染成功 撑起div 在去初始化scroll-->
	<scroll ref="scroll" class="recommend-content" :data="discList">
		<!-- scroll 是父子集合 只有第一个元素会滚动 
		你要是想让2个一起滚动的话 就需要加上一个包裹层-->
		<div>
			<!--加这个if判断是为了保证dom已经加载完了 否则动态设置轮播元素宽度的时候设置不上 获取不到元素  重要-->
			<!--if成功的时候才会渲染下面的slider组件 这样就确保有元素在 666-->
			<div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
				<slider>
					<div v-for="item in recommends">
						<a :href="item.linkUrl">
							<!-- needsclick 这个class 不是样式 是监听是否需要点击事件 有的话 不会拦截-->
	        				<!--是fastclick（移动端300延迟解决方案） 和 better-scroll 冲突了 needsclick是fastclick里面的-->
							<img  @load="loadImage" class="needsclick" :src="item.picUrl" alt="" />
						</a>
					</div>
				</slider>
			</div>
			<div class="recommend-list">
				<h1 class="list-title">热门歌单推荐</h1>
				<ul>
					<li v-for="item in discList" class="item">
						<div class="icon">
							<img :src="item.imgurl" width="60" height="60" alt="" />
						</div>
						<div class="text">
							<!-- 如果数据中有一些html字符 我们可以用v-hml能够转义-->
							<h2 class="name" v-html="item.creator.name"></h2>
							<p class="desc" v-html="item.dissname"></p>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="loading-container" v-show="!discList.length">
			<loading></loading>
		</div>
	</scroll>
</div>
</template>

<script type="text/ecmascript-6">
	import Slider from '@/base/slider/slider'
	import {getRecommend,getDiscList} from '@/api/recommend'
	import {ERR_OK} from '@/api/config'
	//把better-scroll封装了一下
	import Scroll from '@/base/scroll/scroll'
	import Loading from '@/base/loading/loading'
	export default{
		components:{
			Slider,
			Scroll,
			Loading
		},
		data(){
			return {
				recommends:[],
				//歌单列表数据
				discList:[]
			}
		},
		created(){
			this._getRecommend();
			this._getDiscList();
		},
		methods:{
			_getRecommend(){
				// 重要 重要 重要
				// jsonp先封装好参数形势 然后用recommend把值和地址传过去 在这里实现最后的获取
				//因为是promise过来的 所以用then的话就能获取数据了
				getRecommend().then((res)=>{
					if(res.code === ERR_OK){
						console.log('slider列表',res.data.slider)
						this.recommends = res.data.slider;
					}
				})
			},
			_getDiscList(){
				getDiscList().then((res)=>{
					if(res.code === ERR_OK){
						this.discList = res.data.list;
					}
				})
			},
			loadImage(){
				// 调用一次就好 出来一张图片 就已经把高度撑开了
				if(!this.checkLoaded){
					this.$refs.scroll.refresh();
					this.checkLoaded = true;
				}
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>


