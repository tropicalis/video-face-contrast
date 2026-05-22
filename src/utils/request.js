/****   request.js   ****/
import axios from 'axios'
import qs from 'qs'
import api from '@/api/api.js'
import {
	ElMessage
} from 'element-plus';
// import CryptoJs from 'crypto-js'

const service = axios.create({
	// baseURL: 'https://beer-popcorn.cloud/',
	// 超时时间 单位是ms，这里设置了3s的超时时间
	timeout: 300 * 1000,
})
// 2.请求拦截器
service.interceptors.request.use(config => {
	if (config.method === 'get') {
		config.paramsSerializer = function(params) {
			return qs.stringify(params, {
				arrayFormat: 'comma'
			})
		}
	}
	return config
}, error => {
	Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((config) => {
	return config
}, (error) => {
	// ElMessage.error('很抱歉，资源未找到')
	console.log(error,"请求拦截器")
	if (error.response) {
		const errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
		switch (error.response.status) {
			case 404:
				ElMessage('很抱歉，资源未找到')
				break
			case 403:
				ElMessage('很抱歉，您暂无该操作权限')
				break
			case 401:
				ElMessage('很抱歉，认证已失效，请重新登录')
				let aid=getQueryVariable('corpId')
				localStorage.removeItem(aid)
				break
			default:
				if (errorMessage === 'refresh token无效') {
					ElMessage('登录已过期，请重新登录')
						let aid=getQueryVariable('corpId')
						localStorage.removeItem(aid)
				} else {
					ElMessage(errorMessage)
				}
				break
		}
	}
	return Promise.reject(error)
})

export default service
