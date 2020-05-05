<template>
  <div>
    <input v-model="value" />
    {{value}}
    <div>
      {{inputValue}}
    </div>
  </div>
</template>

<script>
export default {
  props: ['inputValue'],
  data () {
    return {
      value:''
    };
  },

  created: function(){},
  watch:{
    inputValue(v){
      console.log(v);
      this.value = v;
      
    },
    value(v){
      this.$emit('fchange',v);
    }
  },

  methods: {}
}

</script>
<style>

</style>