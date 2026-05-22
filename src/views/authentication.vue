<template>
  <div class="page">
    <el-form :model="form" :rules="rules" ref="formTestRef">
      <el-form-item label="人脸拍照">
        <div class="cation">
          <img :src="'data:image/jpeg;base64,' + ocr" alt="Image">
        </div>
      </el-form-item>
      <el-form-item label="姓&emsp;名" prop="name">
        <el-input v-model="form.name" placeholder="填写姓名" />
      </el-form-item>
      <el-form-item label="身份证" prop="ID">
        <el-input v-model="form.ID" placeholder="填写身份证号" />
      </el-form-item>
      <el-form-item v-if="!show">
        <el-button type="primary" @click="onSubmit" class="button">注册</el-button>
      </el-form-item>
      <el-button type="success" @click="V2verification" class="button">识别</el-button>
    </el-form>
  </div>
</template>
   
<script setup>
import { reactive, ref, onMounted } from 'vue';
import api from '@/api/api.js';
// import $bus from '../bus';
import { ElMessage } from 'element-plus';
// import { useRouter } from "vue-router";

// const router = useRouter();

const form = reactive({
  name: '',
  ID: '',
  imageData: ''
})
const ocr = ref('')

onMounted(() => {
  let userImg = localStorage.getItem('ocr')
  if (userImg !== null) {
    userImg = JSON.parse(userImg)
    form.imageData = userImg.imageData
    console.log(userImg, 'img');
    ocr.value = userImg.imageData
  }
})

// 正则验证是否是有效身份证
const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
// const realnameReg = /^[\u4E00-\u9FA5]{2,6}$/
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入身份证号'))
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确身份证号'))
    }
    if (form.ID !== '') {
      if (!formTestRef.value) return
      formTestRef.value.validateField('ID', () => null)
      callback()
    }
  }
}

// 表单验证 validator: validatePass,为自定义验证
const rules = ref({
  ID: [{ required: true, validator: validatePass, trigger: 'blur' }],
  name: [{ required: true, trigger: 'blur' }],
})

const show = ref(false)

// 根据结构中的ref="formTestRef"获取表单
const formTestRef = ref()
// 提交时验证表单
const onSubmit = () => {
  formTestRef.value.validate(valid => {
    if (valid) {
      // 通过验证跳转路由
      api.registerFace(form).then((res) => {
        if (res.data.code === 0 && res.data.data.pass === true) {
          ElMessage.success('认证成功');
          // setTimeout(() => {
          //   router.puth("/")
          // }, 2000);
          show.value = true
        } else {
          ElMessage.error(res.data.message);
        }
      })
    }
  })
}

async function V2verification() {
  await api.v2Verification({
    imageData: ocr.value
  }).then((res) => {
    if (res.data.code === 0 && res.data.data.pass === true) {
      ElMessage.success('识别成功');
      form.ID = res.data.data.ID
      form.name = res.data.data.name
    } else {
      ElMessage.error(res.data.msg);
    }
  })
}
</script>
  
<style scoped lang="scss">
html,
body,
#app,
.page {
  width: 100%;
  height: 100vh;
  padding: 1rem;
  box-sizing: border-box;

  .uploads {
    display: flex;
    justify-content: space-between;
  }

  .cation {
    max-height: 362px;
    border-radius: 4px;

    img {
      max-width: 100%;
    }
  }

  .button {
    width: 100%;
    margin: 0;
    margin-top: 10px;
  }
}
</style>