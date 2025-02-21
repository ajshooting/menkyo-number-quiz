<template>
  <p>有効数字 : {{ significantFigures }}</p>
</template>


<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  num?: number;
}>();

const significantFigures = computed<number | string>(() => {
  if (props.num === undefined) {
    return "N/A";
  }

  let numStr = props.num.toString();

  if (numStr.includes('.')) {
    numStr = numStr.replace(/^0+|\./g, '');
  } else {
    numStr = numStr.replace(/^0+|0+$/g, '');
  }

  if (numStr === '') {
    return 0;
  }

  return numStr.length;
});
</script>
