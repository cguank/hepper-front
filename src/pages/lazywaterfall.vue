<template>
  <div>
    <button @click="loadedList.splice(1)" style="z-index:5;position:absolute">click</button>
    <div class="content" v-load-more="loadMore">

      <van-col span="12" v-for="(item,index) of loadedList" :key="item.id">
        <div class="box" :id="`box${index+1}`">
          <img :style="`width:${imgWidth}px`" :src="staticImg" :data-origin="item" />
          <div class="box-content">
            <div class="title">
              <span>商品名称：</span><span>ssss</span>
            </div>
            <div class="desc">
              <span>tag</span>
            </div>
          </div>

        </div>
      </van-col>
      <!-- <van-col span="12" v-if="index%2==1">
          <div class="box" :id="`box${index+1}`" >
            <img :style="`width:${imgWidth}px`" :src="staticImg" :data-origin="item" />
            <div class="box-content">
              <div class="title">
                <span>商品名称：</span><span>ssss</span>
              </div>
              <div class="desc">
                <span>tag</span>
              </div>
            </div>

          </div>
        </van-col> -->

    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Lazyload, Col } from 'vant';

Vue.use(Lazyload).use(Col);

export default {
  data () {
    return {
      imgWidth: 190,
      screenWidth: document.body.clientWidth,
      //cols: 0,
      arr: [],
      srcList: [],
      loadedList: [],
      query: {
        currentPage: 1
      },
      load: null,
      //lazy````````
      staticImg: '../../static/imgs/images/1.jpg',
      doneNum: 0,
    };
  },
  directives: {
    'load-more': {
      bind: (el, binding, vnode) => {
        // console.log(this);

        //console.log(binding.value);
        window.onscroll = binding.value;
        //binding.value();

      }
    }
  },
  created: function () {
    this.arr = new Array(this.cols).fill(0);
    this.load = this.debounce(this.getImgList, 100);
    // setInterval(() => {
    //   this.getImgList();
    // }, 2000)
    //this.getImgList();
    //console.log(this.cols,this.screenWidth);

  },
  watch: {
    doneNum(v){
      if(v%5==0){
        this.waterfallAll();
      }
    },
    loadedList (v) {

      // this.$nextTick(() => {
      //   this.waterfall(v.length);
      //})
      if (v.length == 5 || v.length == 10) {
        this.getImgList();
      }
    }
  },
  mounted () {
    this.getImgList();
    //window.onscroll = this.debounce(this.loadMore,100); ;

    //window.onscroll = this.loadMore;

  },
  computed: {
    cols: function () {
      console.log(parseInt(this.screenWidth / this.imgWidth));

      return parseInt(this.screenWidth / this.imgWidth);
    }
  },
  methods: {
    loadImgByOrder (index, coverPicture) {
      if (index == 5) return;
      this.loadImgAsyn(coverPicture).then(url => {
        this.loadedList.push('http://img.hepper.cn/dlimages/' + url);
        this.loadImgByOrder(index + 1, this.srcList[index + 1].coverPicture)
      })
    },
    debounce (fn, wait) {
      let timer = null;
      //  console.log('outter',timer);

      return () => {
        //     console.log('inner',timer);
        if (timer != null) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          //       console.log('in debounce');

          fn.apply(this, arguments);
        }, wait);

      }
    },
    loadMore () {
      //  console.log('loadmore');

      let scrollTop = Math.ceil(document.documentElement.scrollTop);
      let clientHeight = document.documentElement.clientHeight;
      let height = document.documentElement.scrollHeight;
      //debugger

      //console.log(load);

      if (scrollTop + clientHeight + 0.5 * clientHeight >= height) {
        console.log('true loadmore');
        //this.getImgList();
        this.load();
      }
    },
    getImgList () {
      this.$getData('getImgList', { currentPage: this.query.currentPage }).then(res => {
        this.srcList = res.data.getPictureList;
        this.query.currentPage++;
        let length = this.loadedList.length;
        this.srcList.forEach((v, i) => {
          this.loadedList.push('http://img.hepper.cn/dlimages/' + v.coverPicture);
          let img = new Image();
          img.onload = () => {
            let box = document.getElementById(`box${i + length + 1}`);
            // console.log(box);

            let img_ = box.querySelector('img');
            img_.src = 'http://img.hepper.cn/dlimages/' + v.coverPicture
            this.doneNum++;
            //dom.src = 
          }
          img.src = 'http://img.hepper.cn/dlimages/' + v.coverPicture;
          // this.loadImgAsyn(v.coverPicture).then(url => {
          //   this.loadedList.push('http://img.hepper.cn/dlimages/' + url);
          // })
        })
        //this.loadImgByOrder(0,this.srcList[0].coverPicture);
        console.log(this.srcList);
      })
    },
    waterfallAll () {
      this.arr = new Array(this.cols).fill(0);

      let itemList = [...document.getElementsByClassName('box')];
      itemList = itemList.slice(0,this.doneNum);
      itemList.forEach((v, i) => {
        //console.log(v.clientHeight);

        //计算最小列的索引
        let min = Math.min(...this.arr);
        let minIndex = this.arr.indexOf(min);
        v.style.position = 'absolute';
        v.style.left = minIndex * v.clientWidth + 'px';
        v.style.top = this.arr[minIndex] + 'px';
        this.arr[minIndex] += v.clientHeight;
        //  console.log(v.clientHeight);

        //

      })


    },
    loadImgAsyn (url) {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = () => {
          resolve(url);
        }
        img.onerror = () => {
          reject('img err')
        }
        img.src = 'http://img.hepper.cn/dlimages/' + url;
      })
    },
    waterfall (index) { //每次处理一张图片,这张图片的id为img${index}
      let item = document.getElementById(`box${index}`);

      //计算最小列的索引
      let min = Math.min(...this.arr);
      let minIndex = this.arr.indexOf(min);
      item.style.left = minIndex * item.clientWidth + 'px';
      item.style.top = this.arr[minIndex] + 'px';
      this.arr[minIndex] += item.clientHeight;
    }
  }
}

</script>
<style lang='less'>
.box {
  position: relative;
  padding: 5px;
  border: solid 1px red;

  img {
    // height: 200px;
  }
}
</style>