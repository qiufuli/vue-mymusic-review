<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
    	<!--slot 一个插槽 当组件被引用的时候-->
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}" >
      </span>
    </div>
  </div>
</template>

<script>
	import {addClass} from 'common/js/dom'
	import BScroll from 'better-scroll'
	export default{
		data(){
			return {
				dots:[],
				currentPageIndex:0
			}
		},
	    props: {
	      loop: {
	        type: Boolean,
	        default: true
	      },
	      autoPlay: {
	        type: Boolean,
	        default: true
	      },
	      interval: {
	        type: Number,
	        default: 4000
	      }
	    },
	    mounted(){
	    	//跟nextTick一样
	    	setTimeout(()=>{
	    		
	    		this._setSlideWidth();
	    		// 因为轮播会给dom多加2个站位 所以_initDots需要在加之前初始化
	    		this._initDots();
	    		this._initSlider();
	    		
	    		if(this.autoPlay){
	    			this._play()
	    		}
	    	},20)
	    	//监听浏览器视口的变化来动态改变slider的宽度
	    	window.addEventListener('resize',()=>{
	    		if(!this.slider){
	    			return
	    		}
	    		//从新计算宽度
	    		this._setSlideWidth(true);
	    		this.slider.refresh();
	    	})
	    },
	    methods:{
	    	//给他个参数 如果没传就是undefined 为false
	    	_setSlideWidth(isResize){
	    		this.children = this.$refs.sliderGroup.children;
	    		let width = 0;
	    		let sliderWidth = this.$refs.slider.clientWidth;
	    		for(let i=0;i<this.children.length;i++){
	    			let child = this.children[i];
	    			//封装class 复用
	    			addClass(child,'slider-item');
	    			child.style.width = sliderWidth+'px';
	    			width += sliderWidth;
	    		}
	    		//无缝轮播的时候需要加2个空白的宽度 监听的时候不能一直加 所以给个标识
	    		if(this.loop && !isResize){
	    			width+= 2*sliderWidth;
	    		}
	    		this.$refs.sliderGroup.style.width = width+'px';
	    	},
	    	_initSlider(){
	        this.slider = new BScroll(this.$refs.slider, {
	          scrollX: true,
	          scrollY: false,
	          momentum: false,
	          snap: true,
	          snapLoop: this.loop,
	          snapThreshold: 0.3,
	          snapSpeed: 400
	        })
	        //这样就可以让dots和滚动同步上了 scrollEnd
	        this.slider.on('scrollEnd',()=>{
	        	// getCurrentPage 是BScroll里面就有的方法 你可以打印下this.slider
	        	let pageIndex = this.slider.getCurrentPage().pageX;
	        	if(this.loop){
	        		//无缝滚动的时候 index是减1的 因为前后多2个
	        		pageIndex = pageIndex - 1;
	        	}
	        	this.currentPageIndex= pageIndex;
	        	if(this.autoPlay){
	        		clearTimeout(this.timer)
	        		this._play()
	        	}
	        })
	    	},
	    	_initDots(){
	    		this.dots = new Array(this.children.length);
	    	},
	    	_play(){
	    		let pageIndex = this.currentPageIndex + 1;
	    		if(this.loop){
	    			pageIndex = pageIndex + 1
	    		}
	    		this.timer = setTimeout(()=>{
	    			this.slider.goToPage(pageIndex, 0, 400)
	    		},this.interval)
	    	}
	    },
	    activated() {
	      if (this.autoPlay) {
	        this._play()
	      }
	    },
	    deactivated() {
	      clearTimeout(this.timer)
	    },
	    beforeDestroy() {
	      clearTimeout(this.timer)
	    },
	    //别忘了清理 切走的时候清除
	    destroyed(){
	    	clearTimeout(this.timer)
	    }
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>