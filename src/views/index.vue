<template>
  <div class="box">
    <div class="ps">
      <div class="relatives">
        <div class="top_right">
          <img src="../assets/icon/index_bg.svg" />
        </div>
        <div class="left_release">
          <img src="../assets/icon/index_bg2.svg" alt="">
        </div>
        <div class="button_left">
          <img src="../assets/icon/index_bg.svg" />
        </div>
      </div>
    </div>

    <div class="activle">
      <div class="title"><span>中科超云</span>欢迎您体验实人认证服务</div>
      <div class="btn">
        <div class="btn_item" @click="HandelButton(0)">
          <div class="img">
            <img src="../assets/icon/security.svg" alt="">
          </div>
          <span style="display: block;text-align: center;width: 100%;">身份认证</span>
        </div>
        <div class="btn_item" @click="HandelButton(1)">
          <div class="img">
            <img src="../assets/icon/operator.svg" alt="">
          </div>
          <span style="display: block;text-align: center;width: 100%;">人脸注册</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

/**
 * 1.配置接口还没有做
 * 2.三个按钮的参数还未知
 */

const HandelButton = (index) => {
  router.push("/release")
}
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

html,
body,
#app,
.box {
  width: 100%;
  height: 100vh;
  padding: 2rem;
  background-color: rgb(5, 53, 106);
  position: relative;

  .ps {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;

    .relatives {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .top_right {
        position: absolute;
        top: 23%;
        right: -1px;
      }

      .left_release {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 95%;

        img {
          width: 100%;
        }
      }

      .button_left {
        position: absolute;
        bottom: 22%;
        left: -1px;
      }
    }
  }

  .activle {
    width: 100%;
    height: 100%;

    .title {
      top: 5%;
      color: white;
      font-size: 1.57rem;
      font-family: '思源黑体';

      span {
        display: block;
      }
    }

    .btn {
      position: absolute;
      bottom: 0%;
      display: flex;
      justify-content: space-between;
      color: white;
      width: 100%;

      .btn_item {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        font-family: '思源黑体';
      }

      .img {
        width: 58px;
        height: 58px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>