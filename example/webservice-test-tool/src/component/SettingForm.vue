<template>
  <ume-form label-width="100px">
    <ume-form-item label="服务认证方式">
      <ume-radio-group v-model="formInfo.serviceAuthType">
        <ume-radio :label="1">Cookie</ume-radio>
        <ume-radio :label="2">Token</ume-radio>
        <ume-radio :label="0">无</ume-radio>
      </ume-radio-group>
    </ume-form-item>
    <ume-form-item label="Token Id" v-if="formInfo.serviceAuthType === 2">
      <ume-input v-model="formInfo.tokenId" placeholder="请输入Header中Token所对应的ID"></ume-input>
    </ume-form-item>
  </ume-form>
</template>
<script>
  export default {
    props: {
      value: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        formInfo: {}
      }
    },
    created () {
      this.formInfo = this.value
    },
    watch: {
      formInfo: {
        handler (val) {
          this.$emit('input', val)
        },
        deep: true
      }
    }
  }
</script>
