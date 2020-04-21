<template>
  <div class="container">
    <div class="setting">
      <el-button type="plain" icon="el-icon-help" circle @click="drawer=true" size="small"></el-button>
    </div>

    <div class="title">
      <el-input placeholder="请输入标题" v-model="title">
        <template slot="prepend">文章标题</template>
        <el-select v-model="selectCategory" slot="append" placeholder="选择归档">
          <el-option
            :label="item.category"
            :value="item.category"
            v-for="(item, index) in categorys"
            :key="index"
          ></el-option>
        </el-select>
      </el-input>

      <el-button type="success" @click="clickCommit">提交</el-button>
    </div>

    <mavon-editor
      v-model="value"
      class="editor"
      boxShadow
      :language="settingForm.language"
      :fontSize="settingForm.fontSize+'px'"
      :toolbarsBackground="settingForm.toolbarsBg"
      :previewBackground="settingForm.previewBg"
      :codeStyle="settingForm.codeStyle"
      :toolbarsFlag="settingForm.toolbarsFlag"
      :ishljs="settingForm.ishljs"
      boxShadowStyle="0 2px 12px 0 rgba(0, 0, 0, 0.3)"
      @imgAdd="$imgAdd"
      @imgDel="$imgDel"
      ref="md"
      @change='valueChanged'
      @save='saveBlog'
    />

    <!-- 状态栏 -->
    <div class="status">
      <span v-if='from=="write"'>正在创作：<el-tag type="success">{{title}}</el-tag></span>
      <span v-else>正在编辑：<el-tag type="success">{{title}}</el-tag></span>
     
      <span v-if='updated'>同步状态：<el-tag type="success">已同步</el-tag></span>
      <span v-else>同步状态：<el-tag type="warning"> 未同步</el-tag></span>
      <span v-if='completed'>完成状态：<el-tag type="success">已完成</el-tag></span>
      <span v-else>完成状态：<el-tag type="info">未完成</el-tag></span>
    </div>

    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :with-header="false" direction="rtl">
      <el-form ref="settingForm" :model="settingForm" label-width="auto">
        <el-divider content-position="center">编辑区</el-divider>
        <el-form-item label="语言">
          <el-select v-model="settingForm.language" placeholder="请选择">
            <el-option
              v-for="item in languageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文字大小">
          <el-slider v-model="settingForm.fontSize" :min="5" :max="45"></el-slider>
        </el-form-item>
        <el-form-item label="工具栏背景">
          <el-color-picker v-model="settingForm.toolbarsBg"></el-color-picker>
        </el-form-item>
        <el-form-item label="预览框背景">
          <el-color-picker v-model="settingForm.previewBg"></el-color-picker>
        </el-form-item>
        <el-form-item label="markdown">
          <el-select v-model="settingForm.codeStyle" placeholder="请选择">
            <el-option
              v-for="item in codeStyleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="工具栏显示">
          <el-switch
            v-model="settingForm.toolbarsFlag"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="代码高亮">
          <el-switch
            v-model="settingForm.ishljs"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          ></el-switch>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 博客信息
      title: "",
      updated:true,
      completed:false,
      value: "",
      selectCategory: "其他",

      categorys: [],
      // 编辑来源
      from: "write",
      id: 0,
      // 编辑区样式
      drawer: false,
      settingForm: {
        language: "zh-CN",
        fontSize: 15,
        toolbarsBg: "#ffffff",
        previewBg: "#fbfbfb",
        codeStyle: "github",
        toolbarsFlag: true,
        ishljs: true
      },
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
      ]
    };
  },
  created() {
    this.getCategorys();
  },
  activated() {
    this.initEdit();
  },
  methods: {
    // 编辑区发生改变
    valueChanged(value,render){
      this.updated=false
    },
    // ctrl+s
    saveBlog() {
     
      this.$http
        .post("/write/saveBlog", {
          title: this.title,
          category: this.selectCategory,
          content: this.value,
          id: this.id,
    
        })
        .then(res => {
          if (res.data.status == 404) {
            this.$message.error("用户未登录");
            this.$router.push("/login");
          } else if (res.data.status == 300) {
            console.log(res.data.msg);
            return this.$message.error(res.data.msg);
          } else if (res.data.status == 200) {
            this.$message({message:"同步成功！",type:'success',
            duration:1000});
            this.id=res.data.id
           this.updated=true
          }
        })
        .catch(error => {
          console.log(error);
          return this.$message.error("系统错误！");
        });
    },

    commitBlog() {
     
      this.$http
        .post("/write/commitBlog", {
          title: this.title,
          category: this.selectCategory,
          content: this.value,
          id: this.id,
          from: this.from
        })
        .then(res => {
          if (res.data.status == 404) {
            this.$message.error("用户未登录");
            this.$router.push("/login");
          } else if (res.data.status == 300) {
            // console.log(res.data.msg);
            return this.$message.error(res.data.msg);
          } else if (res.data.status == 200) {
            this.$message.success("发布成功！");
            this.id=0
            this.from='write'
            this.value=''
            this.title=''
            this.updated=true,
            this.jump()
            
           
          }
        })
        .catch(error => {
          console.log(error);
          return this.$message.error("系统错误！");
        });
    },
   
    // 初始化编辑,根据id获取文章信息,
    initEdit() {
      var query = this.$route.query;
      // 表示从文章列表过来的
      if ("id" in query && "from" in query) {
        this.id = query.id;
        this.from = query.from;

        if (this.from !== "blog") return;
        this.$http
          .get("/write/getBlogInfo", {
            params: {
              id: this.id,
        
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
              this.value = res.data.blog.content;
              this.selectCategory = res.data.blog.category;
              this.completed = res.data.blog.completed;
            }
          })
          .catch(error => {
            console.log(error);
            return this.$message.error("系统错误！");
          });
      }
     
    },
    // 获取目录
    getCategorys() {
      this.$http
        .get("/write/getCategorys")
        .then(res => {
          if (res.data.status == 404) {
            this.$message.error("用户未登录");
            this.$router.push("/login");
          } else if (res.data.status == 300) {
            return this.$message.error(res.data.msg);
          } else if (res.data.status == 200) {
            this.categorys = res.data.categorys;
          }
        })
        .catch(error => {
          console.log(error);
          return this.$message.error("系统错误！");
        });
    },

    //提交后根据from跳转
    jump() {
     
        this.$router.push({ name: "blogs" });
     
    },
    clickCommit() {
            if(this.value==='') return this.$message.warning('内容不能为空');
            if(this.title==='') return this.$message.warning('标题不能为空');
            // 提交博客
            this.commitBlog();
       
    },

    
    $imgAdd(pos, $file) {
      var formdata = new FormData();
           formdata.append('image', $file);
      this.$http({
        url: "/write/saveImg",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(res => {
          if (res.data.status == 404) {
            this.$router.push("/login");
            return this.$message.error("用户未登录");
          } else if (res.data.status == 300) {
            return this.$message.error(res.data.msg);
          } else if (res.data.status == 200) {
              
              this.$refs.md.$img2Url(pos, res.data.url);
            
          }
        })
        .catch(error => {
          console.log(error);
          return this.$message.error("系统错误！");
        });
    },
    $imgDel(pos) {
      console.log(pos)
      this.$http.delete("/write/deleteImg",{
        params:{
          imgName:pos[0]
        }
      })
        .then(res => {
          if (res.data.status == 404) {
            this.$router.push("/login");
            return this.$message.error("用户未登录");
          } else if (res.data.status == 300) {
            return this.$message.error(res.data.msg);
          } else if (res.data.status == 200) {
           
              this.$message.success('删除成功')
            
           
          }
        })
        .catch(error => {
          console.log(error);
          return this.$message.error("系统错误！");
        });
    }
  }
};
</script>


<style lang='less' scoped>
.status{
  margin:20px 60px;
  display: flex;
  justify-content: space-between;
}
.el-input {
  margin-right: 30px;
}
.title {
  display: flex;
  justify-content: space-between;
}
.container {
  height: 100%;

  .editor {
    margin-top: 20px;
    height: 80%;
    background-color: #fbfbfb;
  }

  .setting {
    position: absolute;
    bottom: 20px;
    right: 20px;
    .el-button {
      font-size: 20px;
    }
  }

  .el-form {
    margin: 40px;
  }

  .el-button {
    z-index: 2;
  }
}
</style>