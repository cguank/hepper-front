<template>
  <div>
    <h3>为了跳转</h3>
    <el-button @click="getData">为了测试接口,使用了代理123321</el-button>
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