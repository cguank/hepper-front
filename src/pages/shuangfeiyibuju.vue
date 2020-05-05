<template>
  <div>
    <div class="header"></div>
    <div class="center columns">
      <div id="inside"></div>
    </div>
    <div id="left" class="columns"></div>
    <div id="right" class="columns "></div>
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
.columns {
  position: relative;
  // overflow: hidden;
  /* float: left; */
 
}
.center {
  float: left;
  width: 100%;
  //  height: 400px;
  background-color: cadetblue;
}
#inside {
    margin-left: 150px;
  margin-right: 200px;
  height: 400px;
}
.header,.footer{
  height: 250px;
  background-color: blueviolet;
  width: 100%;
}
#left {
  float: left;
  width: 150px;
  height: 400px;
  background-color: chartreuse;
  margin-left: -100%;
}
#right {
  float: left;
  width: 200px;
  height: 400px;
  background-color: sandybrown;
   margin-left: -200px;

}
.footer{
  clear: both;
}
</style>