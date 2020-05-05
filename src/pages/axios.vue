<template>
  <div>
    <input v-model="text" />
    <button @click="send">发送</button>
    <div v-for="item of msgArr" :key="item.id">
      <span>{{item.role}}</span>
      <span>{{item.text}}</span>
      <span>{{item.time}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      msgArr: [
        {
          text:'',
          time:'',
          role:''
        }
      ],
      ws:null
    };
  },

  created: function(){
  
//     axios.defaults.crossDomain = true;
// axios.defaults.withCredentials = true;
//     axios.get('http://localhost:3000/hello',{
//       headers: {
//         'token':'bytes=0-9',
//       },
     
//     }
//     ).then(res=>{
//       console.log(res,document.cookie);
      
//     })
  },
  mounted(){
    this.openWebsocket()
  },
 
  methods: {
    send(){
      this.ws.send(this.text);
    },
    openWebsocket(){
      let ws = new WebSocket('ws://localhost:3003');
      ws.onopen=function () {
        console.log('成功建立连接');
        
      }
      this.ws=ws;
      ws.onerror=function (err) {
        console.log('连接失败',err);
        
      }
      ws.onclose = function(evt) {
  console.log("Connection closed.");
};    
let self=this;
      ws.onmessage=function (evt) {
        self.msgArr.push({
          role:'接收方',
          text:evt.data,
          time:evt.timeStamp
        })
        console.log(evt);
        
      }
    }
  }
}

</script>
<style>

</style>