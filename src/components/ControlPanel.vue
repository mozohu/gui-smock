<template>
  <div class="control-panel">
    <h3>出貨控制</h3>
    <!-- 標題列 -->
    <div class="dispatch-header">
      <div class="col-x">X</div>
      <div class="col-y">Y</div>
      <div class="col-heating">火力(W), 時間(S), ...</div>
      <div class="col-action">操作</div>
    </div>
    <div v-for="i in 3" :key="i" class="dispatch-row">
      <input v-model="rows[i-1].x" placeholder="3" class="col-x"/>
      <input v-model="rows[i-1].y" placeholder="6" class="col-y"/>
      <input v-model="rows[i-1].heating" placeholder="60,120,90,60" class="col-heating"/>
      <button @click="dispatch(rows[i-1])" class="col-action">出貨</button>
    </div>
    <!-- 按鈕列 -->
    <div class="dispatch-footer">
      <button @click="onReloadClick">重啟</button>
      <button @click="onResetClick">Reset (0x12)</button>
      <button @click="onEbusTestClick">Ebus 通訊測試</button>
      <button @click="onQueryTempClick">查詢溫度</button>
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
      // 將 "60,120,90,60" 轉成 [[60,120],[90,60]]
      let heating = []
      if (row.heating) {
        const nums = row.heating
          .split(',')
          .map(v => parseInt(v.trim(), 10))
          .filter(v => !isNaN(v))

        for (let i = 0; i < nums.length; i += 2) {
          if (nums[i + 1] !== undefined) {
            heating.push([nums[i], nums[i + 1]])
          }
        }
      }

      // 組合 channel id
      const chid = '0' + row.x + row.y

      console.log('[ControlPanel] 出貨指令', { chid, heating })

      // 發送 EBUS 指令
      ebusService.send('sess/hint', { cust_dispense: 1 })
      ebusService.send('dispense/goto_none')
      ebusService.send('dispense/start')
      ebusService.send('dispense/ready', { chid, heating })
    },
    onEbusTestClick() {
      const msg = {
        e: 'sys/hint',
        arg: { a: 'b' }
      }
      console.log('[ControlPanel] Ebus測試 publish:', msg)
      ebusService.send(msg.e, msg.arg)
    },
    onResetClick() {
      const msg = {
        e: 'sys/hint',
        arg: { act: 'weche_reset' }
      }
      console.log('[ControlPanel] Reset publish:', msg)
      ebusService.send(msg.e, msg.arg)
    },
    onQueryTempClick() {
      const msg = {
        e: 'sys/hint',
        arg: { act: 'weche_query_temp' }
      }
      console.log('[ControlPanel] QueryTemp publish:', msg)
      ebusService.send(msg.e, msg.arg)
    },
    onReloadClick() {
      console.log('[ControlPanel] 重啟 App')
      window.location.reload()
    },
  }
}
</script>
<style scoped>
.control-panel {
  max-width: 720px;
  margin: 0 auto;
  font-family: sans-serif;
}

/* 統一網格設定 */
.dispatch-header,
.dispatch-row {
  display: grid;
  grid-template-columns: 60px 60px 1fr 100px; /* X, Y, heating, action */
  gap: 8px;
  align-items: center;
  padding: 4px 0;
}

/* 標題列樣式 */
.dispatch-header {
  font-weight: bold;
  border-bottom: 2px solid #999;
  margin-bottom: 6px;
}

/* 按鈕列 (底部控制鍵) */
.dispatch-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

input {
  width: 100%;
  padding: 4px 6px;
  font-size: 14px;
  box-sizing: border-box;
}

button {
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
}

button:hover {
  background-color: #efefef;
}
</style>
