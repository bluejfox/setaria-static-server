<template>
  <div id="app">
    <div class="header-wrapper">
      <header class="header">
        <div class="container">
          <h2>{{ appTitle }}</h2>
          <div style="float: right;">
            <ume-button @click="showSettingForm" type="primary" icon="setting">
              设置
            </ume-button>
          </div>
        </div>
      </header>
    </div>
    <div class="main-container">
      <div class="page-container page-component">
        <tool-main></tool-main>
      </div>
    </div>
    <footer class="footer">
      <div class="container">
        <div class="footer-main">
          <p class="footer-main-title">UME Team</p>
        </div>
      </div>
    </footer>
    <ume-dialog title="设置" :visible.sync="isShowSettingForm">
      <setting-form v-model="settingInfo"></setting-form>
      <span slot="footer">
        <ume-button @click="hideSettingForm">关闭</ume-button>
      </span>
    </ume-dialog>
  </div>
</template>

<script>
import SettingForm from './component/SettingForm'
import Storage, { STORAGE_TYPE } from './model/Storage'
import Util from './model/Util'
import ToolMain from './component/ToolMain'

const STORAGE_KEY = '__service_setting'

export default {
  name: 'app',
  data () {
    return {
      isShowSettingForm: false,
      settingInfo: null
    }
  },
  computed: {
    appTitle () {
      return Util.getConfigValue('APP_TITLE')
    }
  },
  created () {
    let setting = Storage.getItem(STORAGE_TYPE.LOCAL, STORAGE_KEY)
    if (Util.isEmpty(setting)) {
      setting = {
        serviceAuthType: 2,
        tokenId: 'token'
      }
    }
    this.settingInfo = setting
  },
  watch: {
    settingInfo: {
      deep: true,
      handler (val) {
        Storage.setItem(STORAGE_TYPE.LOCAL, STORAGE_KEY, val)
      }
    }
  },
  methods: {
    showSettingForm () {
      this.toggleSettingForm(true)
    },
    hideSettingForm () {
      this.toggleSettingForm(false)
    },
    toggleSettingForm (val) {
      this.isShowSettingForm = val
    }
  },
  components: {
    ToolMain,
    SettingForm
  }
}
</script>

<style>
  body, html {
    margin: 0;
    padding: 0;
  }
  body {
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    overflow: auto;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
  }
  #app, body, html {
    height: 100%;
  }
  .header-wrapper {
    height: 60px;
  }
  .header {
    height: 60px;
    background-color: #20a0ff;
    color: #fff;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 60px;
    z-index: 100;
    position: relative;
  }
  .header .container {
    height: 100%;
    box-sizing: border-box;
  }
  .header h2 {
    margin: 0;
    float: left;
    font-size: 24px;
    font-weight: 400;
  }
  .container, .page-container {
    width: 1240px;
    /*padding: 0 30px;*/
    margin: 0 auto;
  }
  .main-container {
    margin-top: -60px;
    padding: 60px 0 80px;
    box-sizing: border-box;
    min-height: 100%;
  }
  .page-component {
    padding-bottom: 95px;
    box-sizing: border-box;
  }
  .page-container {
    padding-top: 25px;
  }
  .footer {
    height: 80px;
    background-color: #324057;
    color: #a4aebd;
    width: 100%;
    z-index: 1000;
    margin-top: -80px;
  }
  .footer .footer-main {
    font-size: 0;
    padding-top: 30px;
    display: inline-block;
  }
  .footer * {
    word-spacing: 0;
  }
  .footer .footer-main .footer-main-title {
    line-height: 1;
    font-size: 22px;
    margin: 0;
  }
</style>
