<template>
  <div class="page">
    <div class="title">{{ informationTitle }}</div>
    <!-- <div class="icon">
      <img :src="currentImage" alt="">
    </div> -->
    <div class="video-box">
      <div class="border-layer"></div>

      <video id="video" ref="video" :width="width" :height="width" preload autoplay loop muted playsinline
        :webkit-playsinline="true"></video>
      <canvas ref="canvas" :width="width" :height="width"></canvas>
      <canvas width="250" height="250" ref="photo"></canvas>
      <img src="../assets/canvas.png" alt="" class="imgs">

      <canvas :width="width" :height="width" ref="photo2" :class="isDynamic == true ? 'canst' : ''"></canvas>
      <div class="img" v-if="isDynamic == true"><img src="../assets/icon/complete.png" alt="" srcset=""></div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import api from '@/api/api.js';
// import $bus from '../bus';
import { useRouter } from "vue-router";
import getAssetsFile from '@/utils/pub_use.js'

var informationTitle = ref('请将头像位于取景框中');
const width = ref(300);
let video = ref();
let canvas = ref();
const photo = ref();

const photo2 = ref();
let isDynamic = ref(false) //结束图
const pic = ref('');//存

const randoms = ref([
  { action: 2, information: "请向左摇头", image: 're_left.gif' },
  { action: 3, information: "请向右摇头", image: 're_right.gif' },
  { action: 4, information: "请张嘴", image: 're_gape.gif' },
  { action: 5, information: "请眨眼", image: 're_does.gif' },
  // {action:6,information:"请点头",},
  // {action:7,information:"正在炫瞳，勿动",},
])
const getTime = ref(60)
const currentImage = ref(getAssetsFile('re.png'))

const sessionID = ref('');
const action = ref(1);
const images = ref('');
const frame = ref(0)
const setcation = ref(1)

const router = useRouter();

// 访问用户媒体设备
const getUserMedia = (constrains) => {
  if (navigator.mediaDevices.getUserMedia) {
    //最新标准API
    navigator.mediaDevices.getUserMedia(constrains).then((res) => {
      handleSuccess(res)
    }).catch((err) => {
      handleError(err)
    })
  } else if (navigator.webkitGetUserMedia) {
    //webkit内核浏览器
    navigator.webkitGetUserMedia(constrains).then((res) => {
      handleSuccess(res)
    }).catch((err) => {
      handleError(err)
    })
  } else if (navigator.mozGetUserMedia) {
    //Firefox浏览器
    navagator.mozGetUserMedia(constrains).then((res) => {
      handleSuccess(res)
    }).catch((err) => {
      handleError(err)
    })
  } else if (navigator.getUserMedia) {
    //旧版API
    navigator.getUserMedia(constrains).then((res) => {
      handleSuccess(res)
    }).catch((err) => {
      handleError(err)
    })
  } else {
    ElMessage.error("你的浏览器不支持访问用户媒体设备")
  }
}

onMounted(() => {
  // 获取实例
  let context = canvas.value.getContext('2d', { willReadFrequently: true });

  let tracker = new tracking.ObjectTracker('face');
  tracker.setInitialScale(4);
  tracker.setStepSize(2);
  tracker.setEdgesDensity(0.1);

  context.clearRect(0, 0, canvas.value.width, canvas.value.height);//.
  tracking.track('#video', tracker);
  // 判断浏览器是否支持媒体设备
  getUserMedia({ video: { facingMode: "user" } })

  window.addEventListener('resize', updateContainerSize());
  updateContainerSize();
  InitSessions();
})

const updateContainerSize = () => {
  const videoBox = document.querySelector('.video-box');
  if (videoBox) {
    width.value = videoBox.clientWidth;
  }
}

// 失败回调
const handleError = (err) => {
  informationTitle.value = "访问用户媒体失败"
}
// 成功回调
const handleSuccess = (stream) => {
  // webkit内核浏览器
  URL = window.URL || window.webkitURL
  if ("srcObject" in video.value) {
    video.value.srcObject = stream
  } else {
    video.value.src = URL.createObjectURL(stream)
  }
  // 苹果手机的系统弹框会阻止js的线程的继续执行 手动0.1秒之后自动执行代码
  setTimeout(() => {
    video.value.play();
  }, 100)
}

const captureAndPushImage = () => {
  let ctx = photo.value.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(video.value, 0, 0, 250, 250);
  var img = new Image();
  img.src = photo.value.toDataURL("image/webp", 0.5);   //转换为图片形式  打印出二进制数据
  let urlData = img.src
  // 从数据URL中提取base64编码的字符串
  images.value = urlData.split(',')[1];

  let aa = photo2.value.getContext('2d', { willReadFrequently: true })
  aa.drawImage(video.value, 0, 0, width.value, width.value);
  var imgs = new Image();
  imgs.src = photo2.value.toDataURL("image/jpeg", 0.8);
  let urlDatas = imgs.src
  pic.value = urlDatas.split(',')[1];

  frame.value++
  sendImagesToServer();
}

let show = false
const InitSessions = () => {
  api.InitSession().then((res) => {
    if (res.data.sessionID) {
      sessionID.value = res.data.sessionID
      // 开启定时器
      let intervalId = setInterval(() => {
        if (!show) {
          captureAndPushImage()
        } else {
          clearInterval(intervalId)
        }
      }, 200)
    }
  })
}

const EndSessions = () => {
  api.EndSession({ sessionID: sessionID.value }).then((res) => {
    if (res.data.code) {
      console.log('删除会话资源成功', res.data.code)
    }
  })
}

let showTime = false;
let timer = setInterval(() => {
  if (!showTime) return
  getTime.value -= 1;
  if (getTime.value <= 0) {
    clearInterval(timer);
    ElMessage.error('检测未通过，请重新尝试~');
    setTimeout(() => {
      router.push('/')
    }, 1000);
    EndSessions()
  }
}, 1000)

const sendImagesToServer = async () => {
  ElMessage.closeAll();
  // 验证成功传给ocr
  if (action.value == 1) {
    let userImg = { imageData: pic.value }
    localStorage.setItem('ocr', JSON.stringify(userImg))
  }
  if (frame.value == 0) {
    frame.value = 1
  }
  showTime = true;
  await api.DoSession({
    sessionID: sessionID.value,
    action: action.value,
    frameNo: frame.value,
    imageData: images.value
  }).then((res) => {
    if (res.data.code === 0 && res.data.data.pass === true) {
      setcation.value = res.data.data.action
      if (setcation.value == action.value) {
        if (randoms.value.length === 0) {
          currentImage.value = getAssetsFile('re.png')
          clearInterval(timer);
          informationTitle.value = '已完成';
          ElMessage.success('已完成');
          isDynamic.value = true;
          show = true
          setTimeout(() => {
            router.push('/authentication')
          }, 1000);
          EndSessions()
        } else {
          // 下一步动作
          const index = Math.floor(Math.random() * randoms.value.length);
          const item = randoms.value.splice(index, 1)[0];
          informationTitle.value = item.information;
          action.value = item.action
          currentImage.value = getAssetsFile(item.image)
          frame.value = 0;
          getTime.value = 60
        }
      }
    }
  })
  images.value = ''
}
</script>

<style scoped lang="scss">
html,
body,
#app,
.page {
  width: 100%;
  height: 100vh;
  padding: 2rem;
  box-sizing: border-box;

  .title {
    top: 1.5rem;
    width: 100%;
    text-align: center;
    font-size: 22px;
    font-weight: 600;
  }

  .icon {
    height: 90px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 6rem;
  }

  .video-box {
    top: 22%;
    left: 50%;
    transform: translate(-50%, -22%);
    max-width: 366px;
    max-height: 366px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    overflow: hidden;
    width: 0;
    height: 0;
    padding: 50%;

    .border-layer {
      // background-image:
      //   conic-gradient(from 45deg,
      //     #5DADE2 0deg 90deg,
      //     #5DADE2 90deg 180deg,
      //     #5dade2b8 180deg 270deg,
      //     #fff 270deg 360deg);
      background: linear-gradient(#0980d9, #fff);
      position: absolute;
      left: 50%;
      top: 50%;
      width: 370px;
      height: 370px;
      margin-left: -185px;
      margin-top: -185px;
      animation: 3s infinite linear rotate;
    }

    video {
      display: block;
      position: absolute;
      top: 2%;
      left: 2%;
      width: 96%;
      height: 96%;
      border-radius: 50%;
      background-color: white;
    }

    .canst {
      position: absolute;
      filter: blur(5px);
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }

    .imgs {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 75%;
      transform: translate(-50%, -50%);
      height: 80%;
    }

    .img {
      position: absolute;
      width: 60%;
      aspect-ratio: 1/1;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 100%;
      }
    }
  }
}

video {
  position: absolute;
  transform: scaleX(-1);
  object-fit: cover;
}

canvas {
  transform: scaleX(-1);
  object-fit: cover;
}

/* 旋转动画 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>