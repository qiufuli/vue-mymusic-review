<template>
  <div id="app">
		<m-header></m-header>
		<tab></tab>
		<!--keep-alive页面缓存-->
		<keep-alive>
				<router-view></router-view>
		</keep-alive>
		<!-- 播放器在很多组件中都能用 不属于任何一个组件 -->
		<player></player>	
  </div>
</template>

<script>
	import MHeader from '@/components/m-header/m-header'
	import Tab from '@/components/tab/tab'
	import Player from '@/components/player/player'
	export default {
  name: 'app',
  components:{
  	MHeader,
		Tab,
		Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
	#app
		color:$color-theme;
		
		
</style>