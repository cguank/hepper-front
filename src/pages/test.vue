<template>
  <div>
    <video id="media" :src="src" controls="controls">
your browser does not support the video tag
</video>
  </div>
</template>

<script>
    setTimeout(() => {

    }, 600);
    

			
		// })
export default {
  data () {
    return {
      src:'',
      imgurl: process.env.BASE_URL
    };
  },

  created: function(){
    setTimeout(() => {
      this.src = 'http://img.hepper.cn/dlimages/Code.mp4';
    }, 500);

  },
mounted(){
      var myVideo=document.getElementById("media");
    console.log(myVideo);
    		 myVideo.addEventListener('pause',function(){
       console.log('pause')
       myVideo.playbackRate=5
       console.log(myVideo.playbackRate);
       })
       
       
},
  methods: {
    getData(){
if (/\d\/\d?/m.test('1/1/0013123')) {
	console.log('true')
} else {
console.log('false')
}

    },

  }
}

</script>
<style>

</style>