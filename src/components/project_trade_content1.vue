<template>
    <div>
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="86%"
        top="32vh"
        center>
        <el-row>
          <el-col :span="8">
            <label>请输入支付密码</label>

          </el-col>
          <el-col :span="16">
            <input style="margin-left: 21px;width: 80%"  type="password" v-model="psw">

          </el-col>
        </el-row>
        <div style="margin-top:10px;">
          <a href="">忘记密码？</a>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </span>
      </el-dialog>
      <el-dialog
        title="设置密码"
        :visible.sync="savePWD"
        width="86%"
        top="32vh"
        center>
        <el-row>
          <el-col :span="8">
            <label>输入密码</label>

          </el-col>
          <el-col :span="16">
            <input style="margin-left: 21px;width: 80%"  type="password" v-model="pwd1">

          </el-col>
        </el-row>
        <el-row style="margin-top:10px">
          <el-col :span="8">
            <label>确认密码</label>

          </el-col>
          <el-col :span="16">
            <input style="margin-left: 21px;width: 80%"  type="password" v-model="pwd2">

          </el-col>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-col :span="8">
            <label>验证码</label>

          </el-col>
          <el-col :span="16">
            <input style="margin-left: 21px;width: 80%"  type="password" v-model="code">

          </el-col>
        </el-row>
        <div style="margin-top:10px;margin-right: 19px;" class="pull-right">
          <el-button size="mini">获取手机验证码</el-button>
        </div>
        <div class="clearfix"></div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </span>
      </el-dialog>
      <div  class="content">
        <div v-if="party=='A'">
          <div class="c-top" style="background-color: white">
            <div class="" style="margin-left:55%;margin-top: 10px;padding-top: 10px;">
              可用余额：￥1234567
            </div>

            <el-row>
              <el-col :span="12" style="text-align: center">
                <label style="font-size: large; padding-top: 8px;">托管资金</label>
              </el-col>
              <el-col :span="12">
                <label >￥</label>
                <el-input name="trust_money" v-model="trust_money" placeholder="请输入内容" style="width: 84%"></el-input>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px;">
              <el-col :span="8">
                <h4 style="text-align: center">备注：</h4>
              </el-col>
              <el-col :span="16">
                <el-input style="width: 95%"
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}"
                          placeholder="请输入内容"
                          v-model="msg">
                </el-input>
              </el-col>
            </el-row>
            <el-row style="margin-top: 17px;">
              <div class="pull-right" style="margin-right: 19px;" @click="charge"><a>金额不足？去充值></a></div>
            </el-row>
            <el-row style="margin-top: 10px;">
              <el-col :span="12" style="text-align: center;background-color: #d4eaff" class="border">
                <el-button type="text">取消</el-button>
              </el-col>
              <el-col :span="12" style="text-align: center; background-color: #32c5d2;">
                <el-button type="text" @click="centerDialogVisible=true">确认</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="c-middle">
            <div style="margin: 18px 30px;">
              <h3>温馨提示</h3>
              <h4>1.为降低交易风险，建议项目分阶段履约交易</h4>
              <h4>2.</h4>
              <h4>3.</h4>
              <h4>4.</h4>
            </div>
            <div class="line" style="height: 0.5px;border: 0.5px solid #ccc;"></div>
            <div style="text-align: center">
              <el-button type="text" @click="payMoney">验收通过，前往支付></el-button>
            </div>
            <div class="clearfix"></div>
            <div class="line" style="height: 0.5px;border: 0.5px solid #ccc;"></div>
          </div>
        </div>
        <div v-else>
          <div class="c-top" style="background-color: white">


            <el-row>
              <el-col :span="12" style="text-align: center">
                <label style="font-size: large; padding-top: 8px;">当前托管</label>
              </el-col>
              <el-col :span="12">
                <label style="font-size: large; padding-top: 8px;">￥1234567</label>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px;">
                  <el-table
      :data="msgList"
      style="width: 100%">
      <el-table-column
        prop="createTime"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="money"
        label="托管金额￥"
        width="100">
      </el-table-column>
      <el-table-column
        prop="msg"
        label="备注">
      </el-table-column>
    </el-table>

            </el-row>

          </div>
        </div>
        <div class="c-bottom">
          <div class="col-xs-12"
               style="padding:5px 15px;background: #337ab7;color: white;font-size: 14px;font-weight: bold;"
               align="center">
            交 易 记 录
          </div>
          <div class="col-xs-12"
               style="padding:0; border-bottom: grey 1px solid;background: white;color: black;font-size: 16px;"
               align="center">
            <div class="col-xs-6" style="padding: 2px 5px;border-right: grey 1px solid;font-size: 14px;">
              <span class="fa fa-caret-down pull-left" style="font-size: 18px;"></span><input type="text" id="date" value="全年 全月" style="width: 85%;border: 0;background: white;text-align: center;">

            </div>
            <div class="col-xs-3 one" style="padding: 2px 5px;border-right: grey 1px solid;font-size: 14px;">
              <span class="fa fa-caret-down pull-left" style="font-size: 18px;"></span> <input type="text" id="state" value="全部" style="width: 80%;border: 0;background: white;text-align: center;">
            </div>
            <div class="col-xs-3" style="padding: 2px 5px;font-size: 14px;">
              金额(元)
            </div>
          </div>
          <div class="col-xs-12"
               style="padding:10px 0;font-size: 14px;top:355px;bottom: 0px;overflow-y: auto;background: white;">
            <div id="recording_content" class="col-xs-12" style="padding: 0;">

            </div>

          </div>

        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: '',
      props: ['party'],
      data: function () {
        return {

          activeIndex: '1',
          activeIndex2: '1',
          title: '编号：项目名称',
          trust_money: 0,
          msg: '',
          psw: '',
          centerDialogVisible: false,
          savePWD: false,
          pwd1: '',
          pwd2: '',
          code: '',
          msgList: [
            {msg: 'sdfljsoifjsoif豆腐干豆腐干发了对方进攻i的结构的个ds', createTime: '2019-08-13 11:38:06', money: '11'},
            {msg: 'sdfljsoifjsoifds', createTime: '2019-08-13 11:38:05', money: '11'},
            {msg: 'sdfljsoifjsoifds', createTime: '2019-08-13 11:38:12', money: '11'},
            {msg: 'sdfljsoifjsoifds', createTime: '2019-08-13 11:38:12', money: '11'},
            {msg: 'sdfljsoifjsoifds', createTime: '2019-08-13 11:38:45', money: '11'}
           
          ]
        }
      },
      methods: {
          payMoney(){
            this.$router.push({path:'/ChargeAndPay',query:{flag:'pay'}})
          },
        charge(){
          this.$router.push({path:'/ChargeAndPay',query:{flag:'charge'}})
        }
      },
      created: function () {
        console.log(this.party)
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
