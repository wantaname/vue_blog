<template>
  <div class="container">
        <div class="title">
          <h3>标题</h3>
        </div>
    <el-divider content-position="right">2020-4-2</el-divider>
     <mavon-editor
        :value="blog.value"
        :subfield="blog.subfield"
        :defaultOpen="blog.defaultOpen"
        :toolbarsFlag="blog.toolbarsFlag"
        :editable="blog.editable"
        :scrollStyle="blog.scrollStyle"
        :navigation="blog.navigation"
        ref="md"
        class="content"
      ></mavon-editor>
  </div>
</template>

<script>
import marked from "marked";
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
        navigation: true
      }
    };
  },
  created() {
    console.log(this.$route.params.id)
  },
  methods: {
    getBlog() {
      this.$http
        .get("/blogs/getBlog")
        .then(res => {
          if (res.data.status == 404) {
            this.$message.error("用户未登录");
            this.$router.push("/login");
          } else if (res.data.status == 300) {
            return this.$message.info(res.data.msg);
          } else if (res.data.status == 200) {
            this.blog.value = res.data.value;
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

.content {
  height: 90%;
}
h3 {
  margin: 0;
  text-align: center;
}
.container {
  height: 100%;
}
</style>