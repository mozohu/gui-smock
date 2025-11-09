// 將Ebus事件，轉換成Vue.js事件
<template>
  <!-- 不佔畫面 -->
</template>

<script>
import ebusService from '../services/ebusService.js';

export default {
  name: 'EbusListener',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    ebusUrl: {
      type: String,
      required: false
    }
  },
  mounted() {
    // 解析 URL ?ebus=xxx
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get("ebus");

    // 優先順序：URL > prop > null
    const finalUrl = urlParam || this.ebusUrl || null;

    console.log("[EbusListener] 使用的 ebus URL =", finalUrl);
    ebusService.connect(finalUrl);

    // 監聽連線狀態
    ebusService.onStatus((isConnected) => {
      this.$emit('update:modelValue', isConnected)
    })

    // 監聽ebusService的event，並用$emit往外發
    ebusService.onEvent((ev) => {
      this.$emit('ebus-event', ev);
      if (ev.e) {
        const en = ev.e.replace(/[\/_]/g, '-');
        this.$emit(`ebus-event-${en}`, ev);
      }
    });
  }
};
</script>
  <span style="display:none"></span>
