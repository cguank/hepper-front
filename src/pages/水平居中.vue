<template>
  <div >
    <div class="shuipingjuzhong1">
      固定宽度的水平居中方法1 css2
    </div>
    <div class="fa-shuipingjuzhong2">
      <div class="shuipingjuzhong2">
        内联元素水平居中方法2 css2
      </div>
    </div>
    <div class="clearfix">
      <div class="fa-shuipingjuzhong3 ">
      <div class="shuipingjuzhong3  ">
        浮动元素水平居中方法3 css2
      </div>
    </div>
    </div>
    <!-- <span>sdfsdf</span> -->
  <!-- <div style="clear:both"></div> -->
    <div class="fa-shuipingjuzhong4">
      <div class="shuipingjuzhong4">
        flex水平居中方法4 css3
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  created: function () { },


  methods: {}
}

</script>
<style lang="less">
.shuipingjuzhong1 {//宽度固定的水平居中
  width: 100px;
  height: 100px;
  margin: 0 auto;
  background-color: aqua;
}
.fa-shuipingjuzhong2 {//内联元素水平居中
  text-align:center;
  .shuipingjuzhong2{
    display: inline;
  }
}
.fa-shuipingjuzhong3 {//浮动元素水平居中方法3
  position: relative;
  float: left;
  left: 50%;
  .shuipingjuzhong3{
    position: relative;
    float: left;
    right: 50%;
  }
}
.clearfix::after {
  content:"";
  display: block;
  visibility: hidden;
  clear:both;
  width:100%
}
.fa-shuipingjuzhong4 {//flex水平居中方法4
 display: flex;
 justify-content:center;
}
</style>