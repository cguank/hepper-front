<template>
  <div>
    <div class="fangdou">
      <h3>防抖</h3>
      <button ref="btn">click</button>
    </div>
    <div class="jieliu">
      <h3>节流</h3>
      <input ref="inputjieliu" v-model="val" />
    </div>
  </div>
</template>

<script>
function debounce (fun, wait) {
  let timer = null;

  return function () {
    console.log(this);
    if (timer != null) clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(this);

      fun.apply(this, arguments)
    }, wait);
  }



}
export default {
  data () {
    return {
      a: null,
      val: '',
      jieliuTimer: null
    };
  },

  created: function () {
    this.a = this.fangdou();
  },
  mounted () {
    this.$refs.btn.addEventListener('click', this.debounce3(() => { console.log('dasdasda') }, 1000))
    this.$refs.inputjieliu.addEventListener('input', this.throttle(() => { console.log(this.val) }, 1000))
  },

  methods: {
    debounce1 (fun, wait) {
      let pre = 0;
      console.log(this);

      return () => {
        console.log(this);

        let now = Date.now();
        if (now - pre > wait) {
          fun.apply(this.arguments);

        }
        pre = now;
      }
    },
    throttle (fun, wait) {
      let timer = null;
      return function () {
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            console.log(this);

            fun.apply(this, arguments);
          }, wait);
        }
      }
    },
    jieliu () {
      //console.log(this.val);
      clearTimeout(this.jieliuTimer);
      this.jieliuTimer = setTimeout(() => {
        console.log(this.val);

      }, 1000);

    },
    fangdou () {
      var timer = null;
      console.log('闭包外面');
      return () => {

        if (timer != null) {
          console.log('clean', timer);
          clearTimeout(timer);

        }
        timer = setTimeout(() => {
          console.log('防抖触发了', timer);

        }, 1000);

      }
    },
    debounce (fun, wait) {
      let timer = null;
      return () => {
        if (timer != null) clearTimeout(timer);
        let callNow = !timer;
        timer = setTimeout(() => {
          timer = null;
        }, wait);
        if (callNow) fun.apply(this, arguments);
      }


    },
     debounce3(fn, wait) {
    let timer = null;
    let now = true;
    return function() {
        if (now) {
            fn.apply(this, arguments);
            now = false;
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            now = true;
        }, wait);
        // if (timer) {
        //     clearTimeout(timer);
        // }
        // timer=setTimeout(() => {
        //     fn.apply(this, arguments);
        // }, wait);
    }
}
  }
}

</script>
<style>
</style>