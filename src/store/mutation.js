// 定义修改的操作
//这是一种 关系形势的引用 直接用
import * as types from './mutation-types'

const matutaions = {
  //这是固定写法  [types.SET_SINGER] == SET_SINGER（state,参数）{}
  // 第二个参数是我们提交给mutations传的参数
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  //播放器参数操作
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  }
}
export default matutaions