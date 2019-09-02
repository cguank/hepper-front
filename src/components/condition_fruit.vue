<template>
    <div>
      <div class="content">
        <test html="<button @click='deleteItem'>clickme</button>"></test>
        <div v-for="item of cardList">
          <el-card class="box-card" :style="item.party=='A'?partyA:partyB">
            <div slot="header" class="clearfix">
              <span v-html="item.fileName"></span>

            </div>
            <div  class="text item ">
              <span>{{item.time}}</span>
              <el-button @click="deleteItem" style="float: right; padding: 0px;" type="text"><img src="../assets/images/x.svg" style="height: 19px;"></el-button>
            </div>
          </el-card>
        </div>
        <div class="line" style="height: 0.5px;    border: 0.5px solid rgb(204, 204, 204); margin-top: 10px;"></div>
        <h5 style="text-align: center">（以下无更多）</h5>
        <div class="line" style="height: 0.5px;    border: 0.5px solid rgb(204, 204, 204); margin-top: 10px;"></div>
      </div>
      <el-row style="margin-top: 10px;">
        <el-col :span="24" style="text-align: center; background-color: #32c5d2;">
          <el-button type="text" @click="centerDialogVisible=true">上传</el-button>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import Vue from 'vue'
  Vue.component('test', {
    props: ['html'],

    render (h) {
      const com = Vue.extend({
        methods: {
          deleteItem(){
            console.log('1231')
          }
        },
        template: `<div>
${this.html}
</div>`
      });
      return h(com,{})
    }
  })
    export default {
        name: '',
      data: function () {
        return {
          partyA: {
            backgroundColor: '#4de9c5'
          },
          partyB: {
            backgroundColor: ' yellow'
          },
          cardList: [
            {
              fileName: '<a href="#/another">12345.pdf</a>',
              time: '2019/7/15 16:28:05',
              party: 'A'
            },
            {
              fileName: '<div @click="deleteItem">适得府君书.pdf </div>',
              time: '2019/7/15 16:28:05',
              party: 'B'
            },
            {
              fileName: '12345.pdf',
              time: '2019/7/15 16:28:05',
              party: 'A'
            },
          ]
        }
      },
      methods: {
          deleteItem(){
            console.log('1111')
          }
      }
    }
</script>

<style>
  .el-card__body{
    padding: 10px 20px;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 6px;
  }
  .el-card__header {
    padding: 18px 20px;
    -webkit-box-sizing: border-box;
    border-bottom: 1px solid #0c97ec;
    box-sizing: border-box;
  }
</style>
