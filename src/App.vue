<template>
  <div class="app">
    <EbusListener v-model="ebusConnected" @ebus-event="handleEbusEvent" />
    <div class="header">
      <h2>WeChe 測試介面</h2>
      <span :class="statusClass">Ebus: {{ ebusConnected ? 'connected' : 'disconnected' }}</span>
    </div>
    <StatusPanel :statusData="statusData" :vmcState="vmcState" :temp="temperature"/>
    <ControlPanel @dispatch="onDispatch"/>
    <LogPanel :logs="logs"/>
  </div>
</template>

<script>
import EbusListener from './components/EbusListener.vue'
import ebusService from './services/ebusService.js'
import { fetchStat } from './services/api'
import StatusPanel from './components/StatusPanel.vue'
import ControlPanel from './components/ControlPanel.vue'
import LogPanel from './components/LogPanel.vue'

export default {
  components: { StatusPanel, ControlPanel, LogPanel, EbusListener },
  data() {
    return {
      ebusConnected: false,
      statusData: {},
      vmcState: {},
      temperature: null,
      logs: [],
    }
  },
  methods: {
    async loadStatus() {
      try {
        const res = await fetchStat()
        this.statusData = res.data
        console.log('[App] stat.cgi 狀態：', res.data)
      } catch (err) {
        console.error('[App] 無法取得 stat.cgi', err)
      }
    },
    handleEbusEvent(e) {
      const now = new Date().toLocaleTimeString()
      this.logs.unshift({ time: now, name: e.e, content: JSON.stringify(e.arg) })
      // ---------- 狀態機 enter_ 類事件處理 ----------
      // 例： e.e = "sess/enter_OPERATION"
      const match = e.e.match(/^(\w+)\/enter_([A-Z0-9_]+)$/)
      if (match) {
        const smName = match[1]         // sess / sys / dispense ...
        const stateName = match[2]      // OPERATION / IDLE / WAIT ...
        console.log(`[App] 狀態機 ${smName} 進入 ${stateName}`)
        // 更新 statusData 對應欄位
        this.statusData[smName] = stateName // ✅ Vue 3 用法
      }
      if (e.e === 'sys/after_hint') {
        if (e.arg.vmc) this.vmcState = e.arg.vmc
        if (e.arg.temp) this.temperature = e.arg.temp
      }
    },
    onDispatch(params) {
      // TODO: 出貨指令可透過 REST 或 ebus 發送
      console.log('Dispatch:', params)
    }
  },
  watch: {
    // ✅ 當連線成功時，自動呼叫 stat.cgi
    async ebusConnected(connected) {
      if (connected) {
        console.log('[App] Ebus connected → 載入 stat.cgi 狀態')
        await this.loadStatus()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.ebusConnected && ebusService.connected) {
        this.ebusConnected = true;
      }
    });
    // ✅ 初始化時就呼叫一次
    this.loadStatus();
  }
}
</script>

<style scoped>
.app {
  max-width: 720px;
  margin: 0 auto;
  font-family: sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.connected { color: green; }
.disconnected { color: red; }
</style>
