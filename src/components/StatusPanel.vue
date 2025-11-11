<template>
  <div class="status-panel">
    <h3>狀態機</h3>
    <div>sys: {{ statusData.sys }}</div>
    <div>sess: {{ statusData.sess }}</div>
    <div>dispense: {{ statusData.dispense }}</div>
    <div>vmc: {{ vmcState.mode }}{{ vmcState.mode_name ? ` (${vmcState.mode_name})` : '' }}</div>
    <div>微波1剩餘時間: {{ heating.etr1 ?? '-' }}</div>
    <div>微波2剩餘時間: {{ heating.etr2 ?? '-' }}</div>
    <div>溫度: {{ temp }}</div>
  </div>
</template>

<script>
export default {
  props: ['statusData', 'vmcState', 'temp', 'heating']
}
</script>
<style scoped>
.status-panel {
  max-width: 720px;
  margin: 10px auto;
  font-family: sans-serif;
}

.status-panel h3 {
  margin-bottom: 8px;
}

.status-panel table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.status-panel th, .status-panel td {
  padding: 6px 8px;
  border-bottom: 1px solid #ddd;
}

.status-panel th {
  background-color: #f5f5f5;
}
</style>
