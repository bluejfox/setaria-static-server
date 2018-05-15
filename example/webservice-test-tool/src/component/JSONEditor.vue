<template>
  <div :class="[classes]">
  </div>
</template>
<script>
import _ from 'lodash'
import JsonEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import 'jsoneditor/dist/img/jsoneditor-icons.svg'

export default {
  props: {
    class: String,
    mode: String,
    modes: String,
    value: Object
  },
  data () {
    return {
      'ins': {}
    }
  },
  computed: {
    options () {
      let mode = this.mode
      let modes = this.modes ? this.modes.split(',') : ['tree', 'text']
      let onChange = this.onEditorChange
      let onError = this.onEditorError
      return {
        mode,
        modes,
        onChange,
        onError
      }
    },
    classes () {
      return this.class
    }
  },
  watch: {
    value: {
      handler (val, oldVal) {
        if (!_.isEqual(val, this.ins.get())) {
          this.ins.set(val)
        }
      },
      deep: true
    }
  },
  methods: {
    createJSONEditor () {
      this.ins = new JsonEditor(this.$el, this.options, this.value)
    },
    onEditorChange () {
      this.$emit('input', this.ins.get())
    },
    onEditorError () {
      // do nothing
    }
  },
  mounted () {
    this.createJSONEditor()
  }
}
</script>
