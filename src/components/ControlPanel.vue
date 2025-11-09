<template>
  <div class="control-panel">
    <h3>出貨控制</h3>
    <div v-for="i in 3" :key="i" class="dispatch-row">
      <input v-model="rows[i-1].slot" placeholder="貨道編號"/>
      <input v-model="rows[i-1].heat" placeholder="加熱秒數"/>
      <button @click="dispatch(rows[i-1])">出貨</button>
    </div>
    <div class="dispatch-section">
      <button @click="onTestClick">Test Publish</button>
    </div>
  </div>
</template>

<script>
import ebusService from '../services/ebusService.js'

export default {
  data() {
    return {
      rows: [{}, {}, {}]
    }
  },
  methods: {
    dispatch(row) {
      this.$emit('dispatch', row)
    },
    onTestClick() {
      const msg = {
        e: 'sys/hint',
        arg: { a: 'b' }
      }
      console.log('[ControlPanel] 測試 publish:', msg)
      ebusService.send(msg.e, msg.arg)
    }
  }
}
</script>
