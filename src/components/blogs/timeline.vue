<template>
  <div class="container">
    <el-row :gutter="20">

      <el-col :span="16" :offset="4">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(blog, index) in blogs"
            :key="index"
            size='large'
            :timestamp="blog.date"
            color="#0bbd87"
          ><router-link :to="{ name: 'read',query:{id:blog.id,from:'blog'} }" tag="p">{{blog.title}}</router-link></el-timeline-item>
        </el-timeline>
      </el-col>
    
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reverse:true,
      blogs: [
    
        
      ]
    };
  },
  created() {
    this.getTimeline()
  },
  methods: {
    getTimeline(){
      this.$http
        .get("/timeline/getTimeline")
        .then(res => {
          if (res.data.status == 404) {
            this.$message.error("用户未登录");
            this.$router.push("/login");
          } else if (res.data.status == 300) {
            return this.$message.error(res.data.msg);
          } else if (res.data.status == 200) {
            this.blogs=res.data.blog
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
.el-timeline{
    margin-top: 60px;
}

.container {
  height: 100%;
  background-color: #fff;
}
</style>