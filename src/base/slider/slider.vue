<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
    	<!--slot 一个插槽 当组件被引用的时候-->
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot"></span>
    </div>
  </div>
</template>

<script>
	import BScroll from 'better-scroll'
	export default{
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
	    	setTimeout(()=>{
	    		this._setSlideWidth();
	    		this._initSlider();
	    	},20)
	    },
	    methods:{
	    	_setSlideWidth(){
	    		this.children = this.$refs.sliderGroup.children;
	    		let width = 0;
	    		let sliderWidth = this.$refs.slider.clientWidth;
	    	},
	    	_initSlider(){
	    		
	    	}
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