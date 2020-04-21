<template>
  <div class="container">
    <div class="edit">
      <div class="add">
        <el-input placeholder="请输入分类" v-model="addCategory">
          <template slot="prepend">添加分类</template>
        </el-input>
        <el-button type="primary" @click="clickAdd">添加</el-button>
      </div>
      <el-button type="warning" @click="dialogVisible=true">删除分类</el-button>
    </div>

    <el-divider content-position="center">分类</el-divider>
    <div>
      <el-badge :value="item.number" v-for="(item, index) in categorys" :key="index">
        <el-button>{{item.category}}</el-button>
      </el-badge>
    </div>

    <!-- 对话框 -->
    <el-dialog title="删除分类" :visible.sync="dialogVisible" @closed="closedDialog">
      <div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="item.category" v-for="(item, index) in categorys" :key="index"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickDelete">删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import marked from "marked";
export default {
  data() {
    return {
      categorys: [],
      dialogVisible: false,
      checkList: [],
      addCategory: ""
    };
  },
  created() {
    this.category();
  },
  methods: {
    clickAdd() {
      if (this.addCategory === "") return this.$message.info("请输入分类名");
      this.$http
        .post("/category/addCategory", {
          category: this.addCategory
        })
        .then(res => {
          if (res.data.status == 404) {
            this.$message.error("用户未登录");
            this.$router.push("/login");
          } else if (res.data.status == 300) {
            return this.$message.error(res.data.msg);
          } else if (res.data.status == 200) {
            this.addCategory === "";
            this.category();
            return this.$message.success(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
          return this.$message.error("系统错误！");
        });
    },
    clickDelete() {
      console.log(this.checkList);
      if (this.checkList.length === 0) return this.$message.info("未选中分类");
      this.$http
        .delete("/category/deleteCategory", {
          data: { select: this.checkList }
        })
        .then(res => {
          if (res.data.status == 404) {
            this.$message.error("用户未登录");
            this.$router.push("/login");
          } else if (res.data.status == 300) {
            return this.$message.error(res.data.msg);
          } else if (res.data.status == 200) {
              this.dialogVisible=false
              this.category()
            return this.$message.success(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
          return this.$message.error("系统错误！");
        });
    },
    closedDialog() {
      this.checkList = [];
    },
    category() {
      this.$http
        .get("/category/getCategory")
        .then(res => {
          if (res.data.status == 404) {
            this.$message.error("用户未登录");
            this.$router.push("/login");
          } else if (res.data.status == 300) {
            return this.$message.info(res.data.msg);
          } else if (res.data.status == 200) {
            this.categorys = res.data.categorys;
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
.el-badge{
    margin:30px
}

.edit {
  display: flex;
  justify-content: space-between;
  .add {
    width: 50%;
    display: flex;
    justify-content: space-between;
  }
}
.content {
  height: 90%;
}
h3 {
  margin: 0;
  text-align: center;
}
.el-button{
  z-index: 2;
}
.container {
  height: 100%;
}
</style>