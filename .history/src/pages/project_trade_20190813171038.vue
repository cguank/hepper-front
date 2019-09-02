<template>
    <div>
      <div class="header">
        <el-row style="font-size: 15px;">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-col :span="8">
              <div class="grid-content border">
                <el-menu-item index="1">往来资金</el-menu-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content border">
                <el-menu-item index="2">条件成果</el-menu-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple-light">
                <el-menu-item index="3">相互评价</el-menu-item>
              </div>
            </el-col>
          </el-menu>



        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark"><p style="font-size: large;text-align: center;padding-top: 10px;margin-bottom: 1px;">{{title}}</p></div>
          </el-col>
        </el-row>

      </div>
      <content1 v-if="cash_show" :party="party"></content1>
      <condition_fruit v-if="condition_fruit_show"></condition_fruit>
      <button onclick="localStorage.setItem('test', true);">add localstorage</button>
      <button onclick="localStorage.clear()">clear localstorage</button>
      <router-link to="/another"><el-button>to another</el-button></router-link>
    </div>
</template>

<script>
  import Vue from 'vue'
  import Layout from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  import ElRow from "element-ui/packages/row/src/row";
  import 'bootstrap/dist/css/bootstrap.min.css'
  import ElCol from "element-ui/packages/col/src/col";

  import content1 from '@/components/project_trade_content1'
  import condition_fruit from '@/components/condition_fruit'
  Vue.use(Layout);
    export default {
      components: {
        ElCol,
        ElRow,
        content1,
        condition_fruit
      },
      name: '',
      data: function () {
        return {
          activeIndex: '1',
          activeIndex2: '1',
          title: '编号：项目名称',
          trust_money: 0,
          msg: '',
          cash_show: true,
          condition_fruit_show: false,
          party: 'A'
        }
      },
      methods: {
        handleSelect(key, keyPath) {
          if(key == 1){
            this.cash_show = true;
            this.condition_fruit_show = false;

          }else if(key ==2){
            this.condition_fruit_show = true;
            this.cash_show = false;
          }
        }
      },
      created: function () {
        this.party = 'B'
        console.log('father')
      }
    }
</script>

<style>

  .el-col {
    border-radius: 0px;
  }

  .grid-content {
    border-radius: 0px;
    min-height: 47px;
    background-color: #fafafa;

  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-menu-item {
    font-size: 15px;
    text-align: center;
    color: #888;
  }
  body {
    color: gray;
    background: whitesmoke;
    position: relative;
    z-index: -1;
    font-size: 15px;
  }
  .border {
    border-right: 1px solid #ccc;
  }
  .el-button--text {
    color: #606266;
    font-size: 20px;
  }
</style>
