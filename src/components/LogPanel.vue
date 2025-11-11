<template>
  <div class="log-panel">
    <h3>事件日誌</h3>
    <div class="log-table">
      <div class="log-header">
        <div class="col-time">時間</div>
        <div class="col-event">事件名稱</div>
        <div class="col-content">內容</div>
      </div>
      <div class="log-body">
        <div v-for="(log, idx) in logs" :key="idx" class="log-row">
          <div class="col-time">{{ log.time }}</div>
          <div class="col-event">{{ log.name }}</div>
          <div class="col-content">{{ log.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    logs: { type: Array, default: () => [] }
  }
}
</script>

<style scoped>
.log-panel {
  max-width: 720px;
  margin: 10px auto 20px auto;
  font-family: sans-serif;
}

.log-panel h3 {
  margin-bottom: 8px;
}

/* 表格區塊 */
.log-table {
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  font-size: 13px;
}

/* 標題列 */
.log-header, .log-row {
  display: grid;
  grid-template-columns: 120px 160px 1fr;
  align-items: center;
}

.log-header {
  background-color: #f5f5f5;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

/* 內容區 */
.log-body {
  max-height: 300px;
  overflow-y: auto;
  overflow-x: auto;
}

.log-row {
  border-bottom: 1px solid #eee;
}

.log-row:last-child {
  border-bottom: none;
}

.log-row div {
  padding: 4px 6px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
