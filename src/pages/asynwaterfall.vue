<template>
  <div>
    <div class="content">
      <div class="box" v-for="(item,index) of loadedList" :key="item.id" :id="`box${index+1}`">
        <img :style="`width:${imgWidth}px`" :src="item" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgWidth: 160,
      screenWidth: document.body.clientWidth,
      //cols: 0,
      arr: [],
      srcList: [],
      loadedList: [],
      query: {
        currentPage: 1
      }
    };
  },

  created: function () {
    this.arr = new Array(this.cols).fill(0);
    setInterval(() => {
      this.getImgList();
    }, 2000)
    //this.getImgList();
    //console.log(this.cols,this.screenWidth);

  },
  watch: {
    loadedList (v) {
      this.$nextTick(() => {
        this.waterfall(v.length);
      })

    }
  },
  computed: {
    cols: function () {
      console.log(parseInt(this.screenWidth / this.imgWidth));

      return parseInt(this.screenWidth / this.imgWidth);
    }
  },
  methods: {
    loadImgByOrder (index, coverPicture) {
      if(index==5) return;
      this.loadImgAsyn(coverPicture).then(url => {
        this.loadedList.push('http://img.hepper.cn/dlimages/' + url);
        this.loadImgByOrder(index+1,this.srcList[index+1].coverPicture)
      })
    },
    getImgList () {
      this.$getData('getImgList', { currentPage: this.query.currentPage }).then(res => {
        this.srcList = res.data.getPictureList;
        this.query.currentPage++;
        this.srcList.forEach(v => {
          this.loadImgAsyn(v.coverPicture).then(url => {
            this.loadedList.push('http://img.hepper.cn/dlimages/' + url);
          })
        })
        //this.loadImgByOrder(0,this.srcList[0].coverPicture);
        console.log(this.srcList);
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
      //console.log(this.arr,min,minIndex);

    }
  }
}

</script>
<style lang='less'>
.box {
  position: absolute;
  padding: 5px;
}
</style>