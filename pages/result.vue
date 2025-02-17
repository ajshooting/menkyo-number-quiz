<template>
  <div>
    <h1>クイズ結果</h1>
    <p>正解数: {{ score }} / {{ totalQuestions }}</p>
    <p>正答率: {{ Math.round(score / totalQuestions * 100) }}%</p>

    <h2>解答一覧</h2>
    <ul>
      <li v-for="(q, index) in questions" :key="index">
        <p>問題{{ index + 1 }}: {{ q.questionText }}</p>
        <p>あなたの回答: {{ q.userAnswer !== null ? q.userAnswer : '未回答' }}</p>
        <p>正解: {{ q.correctAnswer }}</p>
        <p>結果: {{ q.isCorrect ? '正解' : '不正解' }}</p>
      </li>
    </ul>
    <button @click="navigateTo('/')">トップへ戻る</button>
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
