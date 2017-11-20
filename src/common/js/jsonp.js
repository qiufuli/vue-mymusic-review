import originJSONP from 'jsonp'


export default function jsonp(url,data,option){
	url+= (url.indexOf('?') < 0 ? '?' :'&') + param(data)
	return  new Promise((resolve,reject)=>{
		originJSONP(url,option,(err,data)=>{
			// 第一个参数 err 是null的时候是成功的
			if(!err){
				resolve(data)
			}else{
				reject(err)
			}
		})
	})
}

function param(data){
	let url = '';
	for(var k in data){
		let value = data[k] !== undefined ? data[k] : ''
		// encodeURIComponent 把字符串转成URI编码
		url+=`&${k}=${encodeURIComponent(value)}`
	}
	return url ? url.substr(1) : ''
}
