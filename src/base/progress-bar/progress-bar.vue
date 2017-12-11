<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick" >
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from '@/common/js/dom'
const transform = prefixStyle('transform')
const progressBtnWidth = 16;
export default{
	props:{
		percent:{
			type:Number,
			default:0
		}
	},
	watch:{
		percent(newPercent){
			if(newPercent >= 0 && !this.touch.initiated){
        // 整个的width 减去小球的宽度
				const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth ;
        // 算出了偏移量
        const offsetWidth = newPercent * barWidth;
				this._offset(offsetWidth);
			}
		}
	},
  created(){
    this.touch = {}
  },
  methods:{
    _offset(offsetWidth){
        this.$refs.progress.style.width = `${offsetWidth}px`
				this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    progressTouchStart(e){
      this.touch.initiated = true;
      // 获取触摸的第一个点的X偏移量
      this.touch.startX = e.touches[0].pageX;
      //获取走了多少的进度
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e){
       if(!this.touch.initiated){
         return
       }
       const deltaX = e.touches[0].pageX - this.touch.startX;
      //  最大不能超过barwidth的宽度 最小不能小过0
       const offsetWidth =Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0,this.touch.left+deltaX));
      	this._offset(offsetWidth);
    },
    progressTouchEnd(e){
      this.touch.initiated = false;
      // 告诉外层我拖动了多少
      this._triggerPercent();
    },
    _triggerPercent(){
      	const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth ;
        const percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit('percentChange',percent);
    },
    // 点击改变进度条
    progressClick(e){
      // 这里当我们点击progressBtn的时候 e.offsetX获取不对

				// getBoundingClientRect 这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。
				//分别表示元素各边与页面上边和左边的距离。
				const rect = this.$refs.progressBar.getBoundingClientRect()
				const offsetWidth = e.pageX - rect.left;
				this._offset(offsetWidth);
				this._triggerPercent();
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>