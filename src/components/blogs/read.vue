<template>
  <div class="container">
    <div class="setting">
      <el-button type="plain" icon="el-icon-help" circle @click="drawer=true" size="small"></el-button>
    </div>

    <div class="title">
      <span>{{title}}</span>
    </div>
    <el-divider content-position="right">{{date}}</el-divider>
    <mavon-editor
      :value="blog.value"
      :subfield="blog.subfield"
      :defaultOpen="blog.defaultOpen"
      :toolbarsFlag="blog.toolbarsFlag"
      :editable="blog.editable"
      :scrollStyle="blog.scrollStyle"
      :navigation="blog.navigation"
      :language="blog.language"
      :fontSize="blog.fontSize+'px'"
      :previewBackground="blog.previewBg"
      :codeStyle="blog.codeStyle"
      :ishljs="blog.ishljs"
      boxShadowStyle="0 2px 12px 0 rgba(0, 0, 0, 0.3)"
      ref="md"
      class="content"
    ></mavon-editor>

    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :with-header="false" direction="rtl">
      <el-form ref="settingForm" :model="blog" label-width="auto">
        <el-divider content-position="center">阅读区</el-divider>
        <el-form-item label="语言">
          <el-select v-model="blog.language" placeholder="请选择">
            <el-option
              v-for="item in languageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文字">
          <el-slider v-model="blog.fontSize" :min="5" :max="45"></el-slider>
        </el-form-item>

        <el-form-item label="背景">
          <el-color-picker v-model="blog.previewBg"></el-color-picker>
        </el-form-item>
        <el-form-item label="导航显示">
          <el-switch v-model="blog.navigation" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item label="markdown">
          <el-select v-model="blog.codeStyle" placeholder="请选择">
            <el-option
              v-for="item in codeStyleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代码高亮">
          <el-switch v-model="blog.ishljs" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blog: {
        value: "",
        subfield: false,
        defaultOpen: "preview",
        editable: false,
        toolbarsFlag: false,
        scrolllStyle: true,
        navigation: true,
        language: "zh-CN",
        fontSize: 15,
        previewBg: "#fbfbfb",
        codeStyle: "agate",
        ishljs: true
      },
      drawer: false,
      // 设置候选
      languageOptions: [
        { label: "简体中文", value: "zh-CN" },
        { label: "英文", value: "en" },
        { label: "日语", value: "ja" }
      ],
      codeStyleOptions: [
        { label: "github", value: "github" },
        { label: "玛瑙", value: "agate" },
        { label: "苦行者", value: "ascetic" },
        { label: "牛皮纸", value: "brown-paper" },
        { label: "codepen-embed", value: "codepen-embed" },
        { label: "darkula", value: "darkula" },
        { label: "googlecode", value: "googlecode" },
        { label: "gruvbox-light", value: "gruvbox-light" },
        { label: "ocean", value: "ocean" },
        { label: "rainbow", value: "rainbow" },
        { label: "school-book", value: "school-book" },
        { label: "idea", value: "idea" }
      ],
      // 博客信息
      title: "",
      date: "",

      // 来源,blog或者draft
      from: "",
      id: -1,

      drawer: false
    };
  },
  activated() {
    this.initRead();
  },

  methods: {
    // 初始化编辑,根据id和from获取文章信息
    initRead() {
      var query = this.$route.query;
      // 表示从文章列表过来的
      if ("id"  in query && "from" in query) {
        this.id = query.id;
        this.from = query.from;

        if(this.from!=='blog') return;
        this.$http
        .get("/read/getBlog", {
          params: {
            id: this.id,
            from: 'blog'
          }
        })
        .then(res => {
          if (res.data.status == 404) {
            this.$message.error("用户未登录");
            this.$router.push("/login");
          } else if (res.data.status == 300) {
            return this.$message.error(res.data.msg);
          } else if (res.data.status == 200) {
            
            this.title = res.data.blog.title;
            this.date = res.data.blog.date;
            this.blog.value = res.data.blog.content;
          }
         
        })
        .catch(error => {
          console.log(error);
          return this.$message.error("系统错误！");
        });

        
      }

    }
  }
};
</script>


<style lang='less' scoped>
.container {
  height: 100%;

  .title {
    display: flex;
    justify-content: center;
    font-size: 22px;
    font-weight: bold;
    color: #13AAF5;
  }
  .setting {
    position: fixed;
    right: 5px;
    top: 5px;
  }
  .el-divider {
    margin-top: 10px;
  }

}

.content{
    
    height: 88%;

  }
</style>