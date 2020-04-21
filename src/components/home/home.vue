<template>
  <el-container>
    <div id="particles">
      <vue-particles></vue-particles>
    </div>

    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '66px' : '188px'">
      <!-- 可折叠菜单栏 -->
      <el-menu
        :background-color="settingForm.menuBgColor"
        :text-color="settingForm.menuTextColor"
        :active-text-color="settingForm.menuActiveTextColor"
        :unique-opened="true"
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="this.$route.path"
        router
      >
        <!-- logo -->
        <div class="logo">
          <img :src="logoImg" @click="toIndex" />
        </div>

        <el-menu-item index="/write">
          <i class="el-icon-edit"></i>
          <span slot="title">编辑</span>
        </el-menu-item>
        <el-menu-item index="/category">
          <i class="el-icon-s-grid"></i>
          <span slot="title">分类目录</span>
        </el-menu-item>
        <el-menu-item index="/blogs">
          <i class="el-icon-connection"></i>
          <span slot="title">文章列表</span>
        </el-menu-item>
        <el-menu-item index="/read">
          <i class="el-icon-reading"></i>
          <span slot="title">阅读模式</span>
        </el-menu-item>
        <el-menu-item index="/timeline">
          <i class="el-icon-date"></i>
          <span slot="title">时间线</span>
        </el-menu-item>

        <div class="footer">
          <!-- 设置 -->
          <div class="setting">
            <el-button type="info" icon="el-icon-setting" circle size="small" @click="drawer=true"></el-button>
          </div>
          <!-- 折叠 -->
          <div class="toggle-button">
            <el-button
              type="info"
              icon="el-icon-s-fold"
              @click="toggleCollapse"
              size="small"
              circle
            ></el-button>
          </div>
        </div>
      </el-menu>
    </el-aside>

    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" direction="rtl" :with-header="false">
      <el-form ref="settingForm" :model="settingForm" label-width="auto">
        <el-divider content-position="center">菜单栏</el-divider>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="settingForm.menuBgColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="文字颜色">
          <el-color-picker v-model="settingForm.menuTextColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="激活颜色">
          <el-color-picker v-model="settingForm.menuActiveTextColor"></el-color-picker>
        </el-form-item>

        <el-divider content-position="center">内容区</el-divider>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="settingForm.mainBgColor"></el-color-picker>
        </el-form-item>
        
      </el-form>
    </el-drawer>

    <el-main :style="{ backgroundColor: settingForm.mainBgColor}">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" :key="$route.name"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </el-main>

    <live2d :live2dSetting="live2dSetting"></live2d>
  </el-container>
</template>

<script>
import live2d from "./live2d";

export default {
  data() {
    return {
      
      
      // 菜单项
      logoImg: require("./img/logo.png"),

      isCollapse: false,
      // 设置表单
      settingForm: {
        menuBgColor: "#5C5C58",
        menuTextColor: "#0DACF1",
        menuActiveTextColor: "#F74808",
        mainBgColor: "#1C1A1A"
      },

      live2dSetting: {
        model: "shizuku",
        width: 160,
        height: 300,
        direction: "right",
        hOffset: 0,
        vOffset: 0
      },

    
      // 抽屉
      drawer: false
    };
  },
  components: {
    live2d
  },
  watch: {},
  created() {},

  methods: {
    toIndex() {
      this.$router.push("/");
    },
    // 折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang="less" scoped>
#particles {
  width: 100%;
  height: 100%;
  position: fixed;
  // z-index: -1;
  #particles-js {
    width: 100%;
    height: 100%;
  }
}
.el-container {
  height: 100%;

  .el-aside {
    height: 100%;

    .el-menu {
      height: 100%;

      .logo {
        border: 1px solid #eee;
        margin: 20px auto;
        border-radius: 50%;
        padding: 5px;
        width: 40%;
        box-shadow: 0 0 10px #ddd;

        background-color: #fff;
        img {
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 50%;
          background-color: #eee;
        }
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .el-button {
          margin: 0 10px;
        }
      }
    }
  }

  .el-form-item {
    margin-bottom: 10px;
  }
  .el-drawer {
    overflow: scroll;
    position: static !important;
  }
  .el-form {
    margin: 40px;
  }

  .el-main {
    height: 100%;

  }
}
</style>