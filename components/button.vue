<template>
  <button :style="{ backgroundColor: color }" @click="$router.push({ path: '/quiz', query: { level } })"
    class="block mx-auto my-4 py-2 px-4 rounded-lg text-white">
    {{ text }}
    <br>
    <small>{{ description }}</small>
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
