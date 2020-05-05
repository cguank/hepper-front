<template>
  <div>
      <button @click="fn"> click $on</button>
    <leaf :itemList="itemList"></leaf>
  </div>
</template>

<script>
import bus from '@/assets/images/bus';
export default {
 
  data () {
    return {
      itemList:  [{
            name: '1',
            children: [{
                name: '1.1',
                children: [{ name: '1.1.1' }]
            }, ]
        },
        {
            name: '1',
            children: [{
                    name: '1.1',
                    children: [{
                        name: '1.1.1',
                        children: [{ name: '2.2' }]
                    }]
                },
                {
                    name: '1.1',
                    children: [{
                        name: '1.1.1',
                        children: [{ name: '2.2' }]
                    }]
                },
                {
                    name: '1.1',
                    children: [{
                        name: '1.1.1',
                        children: [{ name: '2.2' }]
                    }]
                },
            ]
        },
        {
            name: '1',
            children: [{
                name: '1.1',
                children: [{ name: '1.1.1' }]
            }, ]
        },        {
            name: '6',
            children: [{
                name: '6.1',
                children: [
                    { name: '6.1.1' },
                    { name: '6.1.2' },
                    { name: '6.1.3' },
                ]
            }, ]
        },
    ]
    };
  },
  components: {
    leaf: ()=>import('@/components/leaf')
  },
  created: function(){},

  mounted: {},

  methods: {
      fn(){
          bus.$emit('test');
      }
  }
}

</script>
<style>

</style>