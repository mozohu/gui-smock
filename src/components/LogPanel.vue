<template>
  <div class="log-panel">
    <h3>事件日誌</h3>
    <table>
      <thead><tr><th>時間</th><th>事件</th><th>內容</th></tr></thead>
      <tbody>
        <tr v-for="(log, idx) in logs" :key="idx">
          <td>{{ log.time }}</td>
          <td>{{ log.name }}</td>
          <td><pre>{{ log.content }}</pre></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default { props: ['logs'] }
</script>

<style scoped>
.log-panel {
  max-height: 300px;
  overflow: auto;
  border: 1px solid #ccc;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 4px;
}
pre {
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}
</style>

