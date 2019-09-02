<template>
  <div>
    <h3>为了跳转</h3>
    <el-button @click="getData">为了测试接口,使用了代理</el-button>
    <el-button @click="getDataLocal">测试接口，不使用代理</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  created: function(){},

  methods: {
    getData(){
                this.$getData('login',{phonenumber:'18091789058',password:'1234',url: 'http://localhost:8080/dltrade'})
          .then(res => console.log(res.data))
          .catch(err => console.log(err));
    },
    getDataLocal(){
                      this.$getData('loginLocal',{phonenumber:'18091789058',password:'1234',url: 'http://localhost:8080/dltrade'})
          .then(res => console.log(res.data))
          .catch(err => console.log(err));
    }
  }
}

</script>
<style>

</style>