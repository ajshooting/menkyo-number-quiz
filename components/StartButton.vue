<template>
  <button :style="{ backgroundColor: color }" @click="$router.push({ path: '/quiz', query: { level } })"
    class="block min-w-52 mx-auto my-4 py-2 px-4 rounded-lg text-white">
    <div class="font-bold py-1">{{ text }}</div>
    <div v-show="description" class="text-xs my-1">{{ description }}</div>
  </button>
</template>


<script lang="ts">
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    }
  }
}
</script>
