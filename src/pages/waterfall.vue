<template>
  <div>
  
    <div class="content" >
      <div class="box" v-for="(index) of 12" :key="index">
<img :style="`width:${imgWidth}px`" :src="`../../static/imgs/images/${index}.jpg`" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgWidth: 160,
      screenWidth:document.body.clientWidth,
      //cols: 0,
      arr: [],
    };
  },

  created: function(){
   
    console.log(this.cols,this.screenWidth);
    
  },
  mounted(){
    setTimeout(() => {
      this.waterfall();
    }, 500);
  },
  computed: {
    cols: function(){
    console.log(parseInt(this.screenWidth/this.imgWidth));
    
      return parseInt(this.screenWidth/this.imgWidth);
    }
  },
  methods: {
    waterfall(){
      this.arr = new Array(this.cols).fill(0);
      
      let itemList = [...document.getElementsByClassName('box')];
      
      itemList.forEach((v,i)=>{
        //console.log(v.clientHeight);
        
      //计算最小列的索引
        let min = Math.min(...this.arr);
        let minIndex = this.arr.indexOf(min);
        v.style.left= minIndex*v.clientWidth+'px';
        v.style.top= this.arr[minIndex]+'px';
        this.arr[minIndex] += v.clientHeight;
      //  console.log(v.clientHeight);
        
        //
        
      })
      
      
    }
  }
}

</script>
<style lang='less'>

.box {
  position: absolute;
  padding: 5px;
}

</style>