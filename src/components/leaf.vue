<template>
  <div>
    <ul >
      <li v-for="item of itemList" :key="item.id">
        <span class="control-btn" v-if="item.children && !item.show" @click="$set(item,'show',true)">+</span>
        <span class="control-btn" v-else @click="$set(item,'show',false)">-</span>
        <span>&nbsp; {{item.name}}</span>
        <leaf v-if="item.children && item.show" :itemList="item.children"></leaf>
      </li>
    </ul>
  </div>
</template>

<script>
import bus from '@/assets/images/bus';
export default {
   name: 'leaf',
  props: ['itemList'],
 // components: ()=>import('./leaf'),
  created: function () {
    bus.$on('test', ()=>{
      console.log(arguments);
      
    })
   },

  methods: {}
}

</script>
<style>
.control-btn {
  border: solid 2px deepskyblue;
  border-radius: 100px;
}
ul li {
  list-style-type: none;
}
</style>