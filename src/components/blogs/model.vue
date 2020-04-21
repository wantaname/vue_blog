<template>
  <vue-live2d :modelPath="modelPath"></vue-live2d>
</template>
<script>
 
export default {
  name: "model",
  data() {
    return {
      modelPath: [
        {
          order: 1,
          path:'/z16/z16.model.json'
        }
      ]
    };
  }
};
</script>


<style lang='less' scoped>
</style>