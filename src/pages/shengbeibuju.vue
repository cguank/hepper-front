<template>
  <div>
    <div class="header"></div>
    <div class="container">
      <div class="center columns"></div>
      <div class="left columns"></div>
      <div class="right columns"></div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  created: function(){},

  methods: {}
}

</script>
<style lang="less">
*{
  margin:0;
  padding: 0;
}
.header,.footer {
  background-color: skyblue;
  height: 200px;
  width:100%;
}
.container {
   padding-left: 150px;
    padding-right: 200px;
    overflow: hidden;
  .columns {
    position: relative;
    float: left;
    height: 300px;
  }
  .center {
    width: 100%;
    background-color: slategray;
  //  height: 200px;
  }
  .left {
    width: 150px;
    background-color: slateblue;
    // height: 300px;
    margin-left: -100%;
    right: 150px;
  }
  .right {
    width: 200px;
    // height: 400px;
    margin-right: -200px;
    background-color: blueviolet;
  }
}
</style>