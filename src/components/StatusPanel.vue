<template>
  <div class="status-panel">
    <h3>狀態機</h3>
    <div>sys: {{ statusData.sys }}</div>
    <div>sess: {{ statusData.sess }}</div>
    <div>dispense: {{ statusData.dispense }}</div>
    <div>vmc: {{ vmcState.status }}</div>
    <div>溫度: {{ temp }}</div>
  </div>
</template>

<script>
export default {
  props: ['statusData', 'vmcState', 'temp']
}
</script>

