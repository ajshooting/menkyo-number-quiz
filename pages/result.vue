<template>
  <div class="max-w-2xl mx-auto p-4">
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h1 class="text-2xl font-bold mb-2 text-center">クイズ結果</h1>
      <div class="flex flex-col md:flex-row md:justify-between items-center mb-4 gap-2">
        <div class="text-lg font-semibold">正解数: <span class="text-blue-600">{{ score }}</span> / {{ totalQuestions }}
        </div>
        <div class="text-lg font-semibold">正答率: <span class="text-green-600">{{ Math.round(score / totalQuestions * 100)
            }}%</span></div>
      </div>
    </div>

    <h2 class="text-xl font-bold mb-3 mt-6">解答一覧</h2>
    <div class="grid gap-4">
      <div v-for="(q, index) in questions" :key="index" class="rounded-lg shadow p-4 bg-white border-l-8"
        :class="q.isCorrect ? 'border-green-400' : 'border-red-400'">
        <div class="flex justify-between items-center mb-2">
          <div class="font-semibold text-gray-700">問題{{ index + 1 }}</div>
          <span class="px-3 py-1 rounded text-xs font-bold"
            :class="q.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
            {{ q.isCorrect ? '正解' : '不正解' }}
          </span>
        </div>
        <div class="mb-2 text-gray-800">{{ q.questionText }}</div>
        <div class="flex flex-wrap gap-4 text-sm">
          <div>あなたの回答: <span :class="q.isCorrect ? 'text-green-600' : 'text-red-600'">{{ q.userAnswer !== null ?
            q.userAnswer : '未回答' }}</span></div>
          <div>正解: <span class="font-bold">{{ q.correctAnswer }}</span></div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-8">
      <button @click="navigateTo('/')"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded shadow transition">トップへ戻る</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, navigateTo } from 'nuxt/app';

const route = useRoute();

const score = computed(() => parseInt(route.query.score as string));
const questions = computed(() => JSON.parse(route.query.questions as string));
const totalQuestions = computed(() => questions.value.length);
</script>
