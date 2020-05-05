<template>
  <div>
    <div class="bg-image">
      <div class="bg item">1</div>
      <div class="bg item">2</div>
      <div class="bg item">3</div>
      <div class="bg item">4</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  created: function(){},

  mounted(){},

  methods: {}
}

</script>
<style lang='less'>
body{
  margin: 0;
  padding: 0;
}
.bg-image{
  width: 100vw;
  height: 77vh;
  .bg {
    background: url('/static/imgs/css.jpg') no-repeat ;
    width: 26vw;
    height: 26vh;
    display:inline-block
  }
  .item:nth-child(2){
    background-position: -33vw 0;
  }
  .item:nth-child(3){
    background-position: -68vw -26vh;
  }
  .item:nth-child(4){
    background-position: -102vw -55vh;
  }
  
}
</style>