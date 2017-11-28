<template>
    <scroll class="listview" ref="listview" :data="data" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
        <ul>
            <li v-for="group in data" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="item in group.items" class="list-group-item">
                        <img class="avatar" v-lazy="item.avatar" alt="">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut"
         @touchstart="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove"
          >
            <ul>
                <!-- 因为index是个变量 写属性时:data-index 需要绑定 只要是变量都需要绑定 -->
                <li v-for="(item,index) in shortcutList" 
                :data-index="index" class="item" :class="{'current':currentIndex === index}">
                    {{item}}
                </li>
            </ul>
        </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
    import Scroll from '@/base/scroll/scroll' 
    import {getData} from '@/common/js/dom'
    
    const TITLE_HEIGHT = 30
	// a-z元素的高度 用来算位移
    const ANCHOR_HEIGHT = 18 
      
    export default {
        components:{
            Scroll
        },
        props:{
            data:{
                type:Array,
                default: []
            }
        },
        data(){
            return {
                scrollY:-1,
                currentIndex:0
            }
        },
        computed:{
            shortcutList(){
                // map方法也是遍历数据 更确切的可以理解为映射 
                // 将原有数组映射为你需要的形势 
                // 下边这个就是把原有数组 返回为 title的集合
                return this.data.map((group)=>{
                    return group.title.substr(0,1)
                })
            }
        },
        created(){
            // 为了方便touch事件中变量的共享 放到一个对象中好获取
            // 为什么没有放到props和data中呢？
            // 因为vue会对这些里面的数据进行监听 但咱这个就是个存放的地方 没那个必要
            //  初始化一个touch对象就行了 有共享的值就放进去
            this.touch = {}
            this.listenScroll = true;
            this.listHeight = [];
            // 不节流
            this.probeType = 3;
        },
        methods:{
            onShortcutTouchStart(e){
                let anchorIndex = getData(e.target,'index');
                let firstTouch = e.touches[0];
                this.touch.y1 = firstTouch.pageY;
                // 然后记录下当前点的索引
                this.touch.anchorIndex = anchorIndex;
                // better-scroll的方法 指定跳转
               this.scrollTo(anchorIndex);
            },
            onShortcutTouchMove(e){
                //  获取move的第一个点 滑动一次获取一次
                let firstTouch = e.touches[0];
                this.touch.y2 = firstTouch.pageY;
                //  | 0 等同于Math.floor 
                // 取个行高 算像素比 看差几个高度 算出索引
                let delta =  (this.touch.y2 -  this.touch.y1) / ANCHOR_HEIGHT | 0;
                // 最终的索引为 起初的索引 加上delta可能为负数
                let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
                this.scrollTo(anchorIndex);
            },
            scroll(pos){
                this.scrollY = pos.y
            },
            scrollTo(index){
                this.scrollY = -this.listHeight[index];
              this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
            },
            _calculateHeight(){
                this.listHeight = [];
                const list = this.$refs.listGroup;
                let height = 0;
                this.listHeight.push(height);
                // 拿到所有列表的高度 不是内容高度 而是相对高度
                for(let i=0;i<list.length;i++){
                    let item  = list[i];
                    height+= item.clientHeight;
                    this.listHeight.push(height)
                    
                }
            }
        },
        watch:{
            data(){
                setTimeout(()=>{
                    this._calculateHeight()
                },20)
            },
            scrollY(newY){
               
                const listHeight = this.listHeight;
                
                // 当滚动到顶部，newY>0 newY是y轴 屏幕一下都是负数
                if(newY > 0){
                    this.currentIndex = 0;
                    return
                }
                // 在中间部分滚动
                for(let i=0;i<listHeight.length-1;i++){
                    let height1 = listHeight[i];
                    let height2 = listHeight[i+1];
                    // newY 向下滚动是正值  向上滚动是负值 -newY 是正值
                    if(-newY>=height1 && -newY<height2){
                        this.currentIndex = i;
                        return 
                    }
                    // 滚动到底部 并且-newY大于最后一个元素的上线
                    this.currentIndex = listHeight.length - 2;
                }
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

