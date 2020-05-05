<template>
  <div>
    <h1>方法1，float+calc</h1>
    <div class="m1">
    <div class="item1"></div>
    <div class="item2"></div>
    </div>
    <h2>方法2：类似圣杯布局</h2>
    <div class="fa">
      <div class="fa-1"></div>
      <div class="fa-2"></div>
    </div>
    <h2>方法3：flex</h2>
    <div class="flex">
      <div class="flex-item1"></div>
      <div class="flex-item2"></div>
    
    </div>
    <!-- <div class="item1"></div> -->
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
/* .fa {
  padding-left: 200px;
} */
.m1{
  .item1{
  width: 200px;
  height: 300px;
  background-color: aqua;
 float: left;
}
.item2{
  width:calc(100% - 200px);
  height: 300px;
  background-color: black;
  float:left
}
}

.fa{
  padding-left: 200px;
  overflow: hidden;
  .fa-1{
    width: 200px;
    height: 300px;
    background-color: blue;
    margin-left: -200px;
     float: left;
  }
  .fa-2 {
    width: 100%;
    height: 300px;
    background-color: blueviolet;
    float: left;
  }
}

.flex{
  display: flex;
  .flex-item1 {
      width: 200px;
    height: 300px;
    background-color: saddlebrown;
  }
  .flex-item2 {
    height: 300px;
    background-color: salmon;
    flex-grow: 1;
  }
}
</style>