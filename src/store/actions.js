import * as types from './mutation-types'
import {playMode} from '@/common/js/config'
import {shuffle} from '@/common/js/util'

function findIndex(list,song){
	return list.findIndex((item)=>{
		return item.id === song.id
	})
}
// {commit,state}参数解构的形式写的  这个正常是传一个context参数 里面有
// commit 和state这些方法
export const selectPlay = function({commit,state},{list,index}){
	commit(types.SET_SEQUENCE_LIST,list);
	if(state.mode === playMode.random){
		let randomList = shuffle(list);
		commit(types.SET_PLAYLIST,randomList);
		index = findIndex(randomList,list[index]);
	}else{
		commit(types.SET_PLAYLIST,list);
	}

	commit(types.SET_CURRENT_INDEX,index);
	commit(types.SET_FULL_SCREEN,true);
	commit(types.SET_PLAYING_STATE,true);
	
}
export const randomPlay = function({commit},{list}){
	commit(types.SET_PLAY_MODE,playMode.random);
	commit(types.SET_SEQUENCE_LIST,list);
	let randomList = shuffle(list);
	commit(types.SET_PLAYLIST,randomList);
	commit(types.SET_CURRENT_INDEX,0);
	commit(types.SET_FULL_SCREEN,true);
	commit(types.SET_PLAYING_STATE,true);
}
