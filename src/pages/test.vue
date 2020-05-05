<template>
  <div>
    <router-link :to="{name:'test1',params:{name:'123'}}">
      sfsdfdsf
    </router-link>
    <div class="one">
      absolute居中布局
    </div>
    <div class="fa">
      固定宽高，居中布局
      <div class="ch">
        
      </div>
    </div>
    <div class="fa1">
      浮动元素，固定宽高布局
      <div class="bfc">
        <div class="ch1"></div>
      </div>
    </div>

    <div class="flex">
      <div class="item1"></div>
      <div class="item2"></div>
    </div>

    <div class="triangle"></div>
    <div class="top-arrow"></div>
     <div class="tixing"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  created: function(){
    //localStorage.setItem("kk","123123");
   // console.log(localStorage.getItem("kk"));
    
  },
  mounted(){
    let app =document.querySelector(".ch1");
    console.log( this.getRt(app));
   
  },

  methods: {
    getRt(root){
      let obj = {top:0,left:0}
      while(root){
        obj.top =obj.top+ root.offsetTop;
        obj.left =obj.left+ root.offsetLeft;
        root=root.offsetParent;
      }
      return obj
    }
  }
}

</script>
<style lang="less">

.one {
  position: absolute;
  /* width: 100px;
  height: 200px; */
  background-color: burlywood;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
}
.fa {
  position: relative;
  width: 100px;
  height: 200px;
  background-color: teal;
  
  .ch {
    background-color: tomato;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 30px;
    height: 30px;
  }
}

.fa1 {
  position: relative;
  width: 100px;
  height: 200px;
  background-color: yellowgreen;
  
  .bfc {
    margin: 0 auto;
    width: 30px;


  }

  .ch1 {
    float: left;
    background-color: tomato;
    width: 30px;
    height: 30px;
  }
}

.flex {
  background-color: turquoise;
  width: 300px;
  height: 300px;
  display: flex;

  flex-direction: column;
  justify-content: center;
  align-items: center;

  .item1 {
      background-color: tan;
  width: 100px;
  height: 100px;
  }
  .item2 {
      background-color: lavenderblush;
  width: 100px;
  height: 100px;
  }
}

.triangle{
  width:0;
  height: 0;
  border:50px solid red;
  border-left:50px solid transparent;
  border-right:50px solid transparent;
  border-bottom: 50px solid transparent;
  border-radius: 50%;
}

.top-arrow{
  position: absolute;
}
.top-arrow::before,.top-arrow::after {
  position: absolute;
  width: 0;
  height: 0;
  content:"";
  border: 50px solid transparent;
  border-bottom-color: tomato;
}
.top-arrow::after {
  border-bottom-color: white;
  z-index: 5;
}
.top-arrow::before{
  z-index: 1;
  top:-5px;
}

.tixing {
height: 100px;
width:100px;
background-color: red;
/* border: 50px solid red; */
position:absolute;
left: 100px;
}
.tixing::after {
  height: 0;
width:0;
border: 50px solid teal;
border-right-color: transparent;
border-bottom-color: transparent;
content:"";
position: absolute;
left: 100px;
}
.tixing::before {
  height: 0;
width:0;
border: 50px solid teal;
border-left-color: transparent;
border-bottom-color: transparent;
content:"";
position: absolute;
right: 100px;
}
</style>