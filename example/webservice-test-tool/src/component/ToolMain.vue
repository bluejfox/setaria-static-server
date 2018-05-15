<template>
  <ume-row :gutter="10">
    <ume-col :span="5">
      <div class="delete-all-button">
        <ume-button type="primary" @click="deleteAllHistory" style="width: 100%">删除所有</ume-button>
      </div>
      <div style="width: 100%">
        <ume-list class="service-history" border>
          <ume-list-item v-for="s in serviceHistory" @click.native="selectHistoryItem(s)">
            <ume-list-item-meta slot="meta">
              <span slot="avatar">
                <div :class="[`request-type-${s.requestType}`]">{{ requestMethodLabel(s) }}</div>
              </span>
              <span slot="title" class="service-history__title">
                {{ s.servicePath }}
              </span>
            </ume-list-item-meta>
            <div slot="actions">
              <ume-button type="danger" icon="el-icon-delete" size="mini" @click.stop="deleteHistoryItem(s)"></ume-button>
            </div>
          </ume-list-item>
        </ume-list>
      </div>
    </ume-col>
    <ume-col :span="19">
      <ume-row :gutter="10">
        <ume-col :span="12">
          <div class="panel-block">
            <ume-tag type="gray" class="panel-title">输入</ume-tag>
            <ume-form class="input-form" label-position="top"
              :rules="rules" ref="inputForm" :model="inputForm" @submit="callService">
              <ume-form-item label="ServiceId" prop="servicePath">
                <span slot="label">ServiceId</span>
                <ume-input placeholder="请输入ServiceId" v-model="inputForm.servicePath" clearable>
                  <ume-select v-model="inputForm.requestType" slot="prepend" class="request-type">
                    <ume-option v-for="type in requestTypeList" :label="type.label"
                      :value="type.value"></ume-option>
                  </ume-select>
                </ume-input>
              </ume-form-item>
              <ume-form-item label="输入数据" prop="input">
                <json-editor mode="code" v-model="inputForm.input" modes="form,code" class="input-json-editor"></json-editor>
              </ume-form-item>
              <ume-form-item>
                <ume-button type="primary" size="large" native-type="submit">执行</ume-button>
              </ume-form-item>
            </ume-form>
          </div>
        </ume-col>
        <ume-col :span="12">
          <div class="panel-block">
            <ume-tag type="success" class="panel-title">输出</ume-tag>
            <json-editor mode="view" class="output-json-editor" modes="view,code" v-model="output"></json-editor>
          </div>
        </ume-col>
      </ume-row>
    </ume-col>
  </ume-row>
</template>
<style scoped>
.service-history__title {
  word-break: break-all;
}
.input-form {
  margin-top: 12px;
}
.input-form .service-base-path {
  color: rgba(0, 0, 0, 0.38);
  font-size: 12px;
}
.input-form .request-type {
  width: 100px;
}
.request-type-get,
.request-type-post,
.request-type-put,
.request-type-delete {
  font-weight: 800;
  font-size: 12px;
  width: 28px;
}
.request-type-get {
  color: green;
}
.request-type-post {
  color: orange;
}
.request-type-put {
  color: blue;
}
.request-type-delete {
  color: red;
}
</style>
<style>
.service-history .el-list-item {
  cursor: pointer;
  padding-left: 10px !important;
  padding-right: 10px !important;
}
.service-history .el-list-item:hover {
  background-color: #eaf2ff;
}
.service-history .el-list-item .el-list-item-action {
  margin-left: 0 !important;
}
.service-history .el-list-item .el-list-item-meta {
  align-items: center !important;
  -ms-flex-align: center !important;
}
.service-history .el-list-item .el-list-item-meta .el-list-item-meta-avatar,
.service-history .el-list-item .el-list-item-meta .el-list-item-meta-title {
  margin-right: 8px !important;
}
.service-history .el-list-item .el-list-item-action .el-button {
  padding-left: 8px;
  padding-right: 8px;
}
</style>

<script>
import JsonEditor from './JSONEditor'
import Http from '../model/Http'
import Storage, { STORAGE_TYPE } from '../model/Storage'
import Util from '../model/Util'

const HISTORY_KEY = '__service_history_list'
const SETTING_KEY = '__service_setting'

const REQUEST_TYPE = [
  {
    value: 'get',
    label: 'GET'
  },
  {
    value: 'post',
    label: 'POST'
  },
  {
    value: 'put',
    label: 'PUT'
  },
  {
    value: 'delete',
    label: 'DELETE'
  }
]

export default {
  data () {
    return {
      rules: {
        servicePath: [
          {
            required: true,
            message: '请输入ServiceId',
            trigger: 'blur'
          }
        ]
      },
      inputForm: {
        servicePath: '',
        requestType: 'get',
        input: {
        }
      },
      output: {
      },
      token: '',
      serviceSetting: Storage.getItem(STORAGE_TYPE.LOCAL, SETTING_KEY) || {},
      serviceHistory: Storage.getItem(STORAGE_TYPE.LOCAL, HISTORY_KEY) || [],
      requestTypeList: REQUEST_TYPE
    }
  },
  computed: {
  },
  watch: {
    serviceHistory: {
      deep: true,
      handler (val) {
        Storage.setItem(STORAGE_TYPE.LOCAL, HISTORY_KEY, val)
      }
    }
  },
  methods: {
    callService () {
      this.updateHistory(this.inputForm)
      const servicePath = this.inputForm.servicePath
      const url = `${Util.getConfigValue('PROXY_KEY')}/${servicePath}`
      const config = {
      }
      if (this.isTokenAuthType() && !Util.isEmpty(this.token)) {
        if (Util.isEmpty(config.headers)) {
          config.headers = {}
        }
        config.headers[this.serviceSetting.tokenId] = this.token
      }
      Http[this.inputForm.requestType](url, this.inputForm.input, config)
        .then(res => {
          if (this.isTokenAuthType()) {
            const tokenId = this.serviceSetting.tokenId
            if (!Util.isEmpty(tokenId)) {
              this.token = res.headers[tokenId]
              if (Util.isEmpty(this.token) && !Util.isEmpty(res.data[tokenId])) {
                this.token = res.data[tokenId]
              }
            }
          }
          this.output = res.data
        }).catch(res => {
          this.$root.handleError(res)
        })
    },
    isTokenAuthType () {
      return this.serviceSetting.serviceAuthType === 2
    },
    updateHistory (serviceObj) {
      let obj = Util.cloneDeep(serviceObj)
      obj.serviceExecDate = Util.getNow('MM/DD')
      this.serviceHistory.push(obj)
    },
    deleteHistoryItem (item) {
      this.serviceHistory.some((v, i) => {
        if (Util.isEqual(v, item)) {
          this.serviceHistory.splice(i, 1)
          return true
        }
      })
    },
    selectHistoryItem (item) {
      let obj = Util.cloneDeep(item)
      this.inputForm = obj
    },
    deleteAllHistory () {
      this.serviceHistory = []
    },
    requestMethodLabel (serviceParams) {
      if (serviceParams.requestType === 'delete') {
        return 'del'
      }
      return serviceParams.requestType
    }
  },
  components: {
    JsonEditor
  }
}
</script>

<style scoped>
  .service-history {
    font-size: 13px;
    height: 473px;
    overflow-y: auto;
  }
  .delete-all-button {
    width: 100%;
    margin-bottom: 10px;
  }
  .service-history-item {
    cursor: pointer;
    margin: 5px 0;
    word-break: break-all;
  }
  .service-history-item:hover {
    background: #e4e8f1;
  }
  .panel-block {
    height: 510px;
    padding: 5px;
  }
  .panel-title {
    font-size: 18px;
    font-weight: 700;
    width: 100%;
    text-align: center;
  }
  .panel-block {
    border: 1px solid #eaeefb;
    border-radius: 4px;
    transition: .2s;
  }
  .panel-block.hover {
    box-shadow: 0 0 8px 0 rgba(232,237,250,.6),0 2px 4px 0 rgba(232,237,250,.5)
  }
  .h3 {
    font-size: 16px;
  }
  .input-json-editor {
  }
  .output-json-editor {
    margin-top: 10px;
    height: 470px;
  }

</style>
