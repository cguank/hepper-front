<template>
  <div>
    浮动元素
    <div class="fa">
      <div class="content">
        <div class="ch">
          宽度固定的水平居中
        </div>
      </div>
    </div>
   
    <div class="fa1">
      <div class="ch1">宽度不固定</div>
    </div>
    <div class="triangle"></div>

    <div class="absolute">垂直居中  </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  created: function(){
    
  },

  
  methods: {}
}

</script>
<style>
.triangle {
  width: 0;
  height: 0;
  border: 100px solid;
  border-color: blue transparent transparent transparent;
}

.fa{
 

  height: 200px;
  width: 600px;
  background-color: burlywood;
}
.ch{
  width: 100px;
  float: left;
  height: 100px;
  background-color: blue;
  /* left: -50%; */
}
.content{
  margin:0 auto;
  width: 100px;

}
.ch1 {
  width: 100px;
  height: 100px;
  position: relative;
transform: translateX(-50%);
left:50%;
  background-color: blue;
  float: left;
}
.fa1 {
  position: relative;
  height: 200px;
  background-color: brown;
  
}

.absolute {
  position: absolute;
  width: 100px;
  height:100px;
  margin:auto;
  left:0;
  top:0;
  bottom: 0;
  right:0;
  background-color: teal;
  }
</style>