
<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="3" :offset="1">
       
          <el-radio-group v-model="selectCategory" fill="#F71C1C" @change="categoryChange">
            <el-radio-button label="全部"></el-radio-button>
            <el-radio-button :label="item.category" v-for="(item, index) in categorys" :key="index"></el-radio-button>
          </el-radio-group>
  
      </el-col>

      <el-col :span="16">
        <!-- 博客卡片 -->
        <el-card shadow="hover" class="blog-card" v-for="item in blogs" :key="item.id">
          <div slot="header" class="clearfix header">
            <i class="el-icon-date"></i>
            <span>{{item.date}}</span>
            <el-tag type="success" v-if='item.completed==1'>已完成</el-tag>
            <el-tag type="warning" v-else>未完成</el-tag>
            <el-button style="float: right; margin:0 10px" size="small" type="primary" @click='edit(item.id)'>编辑</el-button>
            <el-button style="float: right;" size="small" type="danger" @click="clickDeleteBlog(item.id)">删除</el-button>
          </div>
          <div>
            <router-link :to="{ name: 'read',query:{id:item.id,from:'blog'} }" tag="h2">{{item.title}}</router-link>
          </div>
        </el-card>

        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[5,10,15]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      completed:false,
      categorys: [],
      blogs: [],
      selectCategory: "全部",
      // 分页数据
      pagenum: 1,
      pagesize: 5,
      total: 0
    };
  },
  created() {
    this.getCategorys();
    this.getBlogs();
  },
  methods: {
    categoryChange(){
      this.getBlogs()
    },
    clickDeleteBlog(id){
      this.$confirm('此操作将永久删除该博客, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteBlog(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 删除
    deleteBlog(id){
      this.$http
        .delete("/blogs/deleteBlog", {
          data: {id}
        })
        .then(res => {
          if (res.data.status == 404) {
            this.$message.error("用户未登录");
            this.$router.push("/login");
          } else if (res.data.status == 300) {
            return this.$message.error(res.data.msg);
          } else if (res.data.status == 200) {
            this.getBlogs()
            return this.$message.success(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
          return this.$message.error("系统错误！");
        });
    },
    // 获取目录
    getCategorys() {
      this.$http
        .get("/blogs/getCategorys")
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
    // 点击编辑，传递到编辑路由
    edit(id) {
      this.$router.push({ name: "write", query: { id: id, from: "blog" } });
    },
    getBlogs() {
      this.$http
        .get("/blogs/getBlogs", {
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
            category: this.selectCategory
          }
        })
        .then(res => {
          if (res.data.status == 404) {
            this.$message.error("用户未登录");
            this.$router.push("/login");
          } else if (res.data.status == 300) {
            return this.$message.error(res.data.msg);
          } else if (res.data.status == 200) {
            this.blogs = res.data.blogs;
            this.total = res.data.total;
       
          }
        })
        .catch(error => {
          console.log(error);
          return this.$message.error("系统错误！");
        });
    },

    //監聽pagesize改變的事件
    handleSizeChange(newSize) {
      this.pagesize = newSize;
      this.getBlogs();
    },
    // 監聽頁碼值改變的事件
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.getBlogs();
    }
  }
};
</script>


<style lang='less' scoped>
.container {
  height: 100%;
  .el-row{
    height: 100%;
    .el-col{
      height: 100%;
      
    }


  }
  .el-radio-group{
    display: block;
    margin-top:100px;
    .el-radio-button{
    display: block;
    overflow: hidden;
  }
  }
  .el-pagination{
    margin-bottom: 50px;
  }
  
  .blog-card {
    margin: 20px 0;
    background-color: #F3F9FB;
  }

  .el-tag{
    margin-left: 10px;
  }
}
</style>