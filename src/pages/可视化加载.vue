<template>
  <div id="list" ref="list">
    <div class="all-height" :style="{height:totalHeight+'px'}"></div>
    <div class="show-content" ref="content">
      <div class="item" v-for="item of showData" :key="item.id">
        <img :src="item.src" :height="item.height" />
      </div>
      <div style="text-align:center;font-size:20px;width:100%">正在加载...</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      totalHeight: 0,
      offset: 0,//已经加载的长度,假设每次加载10长
      minHeight: 100, //最小高度
      loadedData: [],  //已经加载了的数据全在这里面,
      showData: [],  //可视化的区域数据
      visibleCount: 0,
      query: {
        currentPage: 1,

      },
      isDone: 0
    };
  },

  created: function () {
    this.visibleCount = parseInt(document.documentElement.clientHeight / this.minHeight);
    // this.loadMore();
    // this.loadMore();
    this.getImgList();
    //  this.getImgList();
    setTimeout(() => {
      this.showData = this.loadedData.slice(0, 5);
    }, 1000);
  },

  mounted () {
    this.$refs.list.onscroll = this.debounce(this.handleScroll, 100);
  },

  methods: {
    debounce (fun, wait) {
      let timer = null;
      return function () {
        if (timer == null) {
          timer = setTimeout(() => {
            timer = null;
            fun.apply(this, arguments)
          }, wait);
        }

      }
    },
    getImgList () {
      this.$getData('getImgList', { currentPage: this.query.currentPage }).then(res => {
        this.query.currentPage++;
        res.data.getPictureList.forEach((v, i) => {
          this.loadedData.push({ src: '/static/imgs/logo.png', height: 150 });
          let img = new Image();
          img.onload = () => {
            if (img.height < 100) {
              img.height = 150;
            }

            this.isDone++;
          //  let height = img.height / (img.width / 220);
            let height = 150
            this.totalHeight += height + 10;
            for(let item of this.loadedData){
              if (item.src == "/static/imgs/logo.png") {
                item.src = 'http://img.hepper.cn/dlimages/' + v.coverPicture
                item.height = height + 10;
                break;
              }
            }

            // this.loadedData.push({ src: 'http://img.hepper.cn/dlimages/' + v.coverPicture, height: //height + 10 });
            //this.doneNum++;
          }
          img.src = 'http://img.hepper.cn/dlimages/' + v.coverPicture;

        })

      })
    },
    loadMore () {
      for (let i = this.offset; i < this.offset + this.visibleCount; i++) {
        this.loadedData.push({ value: i });
      }
      this.offset += this.visibleCount;

    },
    handleScroll (e) {
      let scrollTop = this.$refs.list.scrollTop
      let scrollTopFixed = scrollTop - scrollTop % 150;
      let start = parseInt(scrollTop / 150);
      console.log(`start:${start},len:${this.loadedData.length}`);
      start = start > this.loadedData.length - 5 ? this.loadedData.length - 5 : start;
      let end = start + 5;

      console.log(`after start:${start},len:${this.loadedData.length}`);
      this.showData = this.loadedData.slice(start, end);
      this.$refs.content.style.transform = `translateY(${scrollTopFixed}px)`
      //this.$refs.content.style.transition = `transform 1s ease-in`
      let allHeight = document.querySelector(".all-height").offsetHeight;
      console.log(this.isDone);

      if (scrollTop + document.documentElement.clientHeight > allHeight - 20 && this.isDone >= 5) {
        //console.log("loaded");
        this.isDone = 0
        this.getImgList();
      }
      console.log(scrollTop);

    }
  }
}

</script>
<style lang='less'>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  img {
    width: 400px;
  }
}
#list {
  height: 100vh;
  overflow: auto;
  position: relative;
}
.show-content {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0;
  width: 100vw;
}
.item {
  box-sizing: border-box;
  // height: 30px;
  padding: 5px;
}
</style>