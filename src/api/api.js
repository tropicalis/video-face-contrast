import http from '@/utils/http.js'

 
export default{
	// 同步识别人脸
	recogniseFace(param){
		return http.upFile('/livingface/detection',param)
	},
	// debug
	log(param){
		return http.upFile('/livingface/log',param)
	},
	// ocr
	Verification(param){
		return http.upFile('/livingface/verification',param)
	},
	// 初始会话标识
	InitSession(){
		return http.upFile('/livingface/detection/init_session')
	},
	// 异步活体检测
	DoSession(param){
		return http.upFile('/livingface/detection/do_session',param)
	},
	// 结束流程
	EndSession(param){
		return http.upFile('/livingface/detection/end_session',param)
	},

	registerFace(param){
		return http.upFile('/livingface/register_face',param)
	},
	v2Verification(param){
		return http.upFile('/livingface/verification',param)
	}
}
