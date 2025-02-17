<template>
  <div>
    <h1>クイズ</h1>
    <div v-if="currentQuestion">
      <p>{{ currentQuestion.questionText }}</p>
      <input type="number" v-model.number="userAnswer">
      <div class="tenkey">
        <button v-for="n in numbers" :key="n" @click="inputNumber(n)">{{ n }}</button>
        <button @click="inputNumber(0)">0</button>
        <button @click="clearInput">C</button>
        <button @click="submitAnswer">回答</button>
      </div>
      <p v-if="feedback" :class="{ 'correct': isCorrectFeedback, 'incorrect': !isCorrectFeedback }">{{ feedback }}</p>
    </div>
    <div v-else-if="loading">
      <p>クイズデータを読み込み中...</p>
    </div>
    <div v-else>
      <p>クイズデータの読み込みに失敗しました。</p>
      <button @click="retryLoadQuizData">再読み込み</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { navigateTo } from 'nuxt/app';
import Papa from 'papaparse';

interface Question {
  questionType: string;
  questionText: string;
  correctAnswer: number | null;
  difficulty: string;
  userAnswer: number | null;
  isCorrect: boolean | null;
}
const questions = reactive<Question[]>([]) as Question[];
const currentQuestionIndex = ref(0);
const userAnswer = ref<number | null>(null);
const score = ref(0);
const feedback = ref('');
const loading = ref(false);
const isCorrectFeedback = ref<boolean | null>(null);
const quizDataFile = 'quiz-data-1.csv'; // ファイル名を定数化
const numberOfQuestions = 10;
const numbers = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]);

const currentQuestion = computed(() => questions[currentQuestionIndex.value]);

onMounted(() => {
  loadQuizData();
});

const loadQuizData = async () => {
  loading.value = true;
  feedback.value = '';
  try {
    // const response = await fetch(`${import.meta.env.BASE_URL}${quizDataFile}`);
    const response = await fetch(quizDataFile);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();

    try {
      const parseResult = await new Promise<Papa.ParseResult<string[]>>((resolve, reject) => {
        Papa.parse(csvText, {
          skipEmptyLines: true, // オプション名を camelCase に修正
          complete: (results) => {
            resolve(results as Papa.ParseResult<string[]>);
          },
          error: (error: any) => {
            reject(error);
          },
        });
      });

      if (parseResult.errors.length > 0) {
        console.error('CSV パースエラー:', parseResult.errors);
        feedback.value = 'クイズデータのパースに失敗しました。';
        loading.value = false;
        return;
      }

      const records = parseResult.data;


      loading.value = false;

      let parsedQuestions: Question[] = records
        .filter((row: any) => row[0] !== '#' && row.length > 1)
        .map((row: any) => {
          const questionType = row[0] as string;
          let questionText = row[1] as string;
          const difficulty = row[2] as string;

          const answerMatch = questionText.match(/\[(.*?)\]/);
          const correctAnswer = answerMatch ? parseInt(answerMatch[1]) : null;
          const processedQuestionText = questionText.replace(/\[.*?\]/, '[]');

          return {
            questionType,
            questionText: processedQuestionText,
            correctAnswer,
            difficulty,
            userAnswer: null,
            isCorrect: null,
          };
        });

      for (let i = parsedQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [parsedQuestions[i], parsedQuestions[j]] = [parsedQuestions[j], parsedQuestions[i]];
      }
      questions.push(...parsedQuestions.slice(0, numberOfQuestions));

    } catch (error) {
      loading.value = false;
      console.error('CSV パースエラー:', error);
      feedback.value = 'クイズデータのパースに失敗しました。';
      return;
    }
  } catch (error) {
    loading.value = false;
    console.error('CSV ファイルの読み込みエラー:', error);
    feedback.value = 'クイズデータの読み込みに失敗しました。';
  }
};

const retryLoadQuizData = () => {
  loading.value = false;
  loadQuizData();
};


const inputNumber = (number: number) => {
  userAnswer.value = userAnswer.value === null ? number : parseInt(String(userAnswer.value) + String(number));
};

const clearInput = () => {
  userAnswer.value = null;
};

const submitAnswer = () => {
  if (userAnswer.value === currentQuestion.value.correctAnswer) {
    score.value++;
    feedback.value = '正解！';
    isCorrectFeedback.value = true;
    questions[currentQuestionIndex.value].isCorrect = true;
  } else {
    feedback.value = `不正解... 正解は ${currentQuestion.value.correctAnswer} です。`;
    isCorrectFeedback.value = false;
    questions[currentQuestionIndex.value].isCorrect = false;
  }
  questions[currentQuestionIndex.value].userAnswer = userAnswer.value;

  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++;
    userAnswer.value = null;
    feedback.value = '';
    isCorrectFeedback.value = null;
  } else {
    // クイズ終了
    navigateTo({ path: '/result', query: { score: score.value, questions: JSON.stringify(questions) } });
  }
};
</script>

<style scoped>
.tenkey {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-width: 200px;
  margin-top: 20px;
}

.tenkey button {
  padding: 10px;
  font-size: 1.2em;
}

.correct {
  color: green;
}

.incorrect {
  color: red;
}
</style>
