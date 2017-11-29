<template>
	<div ref="wrapper">
		<slot></slot>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	
	export default{
		props:{
			probeType:{
				type:Number,
				default:1
			},
			click:{
				type:Boolean,
				default:true
			},
			data:{
				type:Array,
				default:null
			},
			listenScroll:{
				type:Boolean,
				default:false
			}
			
		},
		mounted(){
			//老样子 确保dom渲染了
			setTimeout(()=>{
				this._initScroll()
			},20)
		},
		methods:{
			_initScroll(){
				if(!this.$refs.wrapper){
					return
				}
				this.scroll = new BScroll(this.$refs.wrapper,{
					probeType:this.probeType,
					click:this.click
				})
				// 是否派发滚动事件

				if(this.listenScroll){
					// 直接写this指向的是Better-scroll
					// 我们要保持vue的this 所以用也变量代替
					let me = this;
					this.scroll.on('scroll',(pos)=>{
						me.$emit('scroll',pos);
					})
				}
			},
			enable(){
				this.scroll && this.scroll.enable();
			},
			disable(){
				this.scroll && this.scroll.disable();
			},
			refresh(){
				this.scroll && this.scroll.refresh();
			},
			scrollTo(){
				this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
			},
			scrollToElement(){
				this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
			}
		},
		//一旦数据发生变化 需要刷新
		watch:{
			data(){
				setTimeout(()=>{
					this.refresh()
				},20)
			}
		}
	}
</script>

<style>
</style>