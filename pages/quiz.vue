<template>
  <div class="container mx-auto p-4">
    <div v-if="currentQuestion">
      <p class="h-[7em]">{{ currentQuestion.questionText }}</p>

      <!-- <p>難易度: {{ currentQuestion.difficulty }}</p> -->
      <HintSelector :answer="currentQuestion.correctAnswer" />

      <input type="text" v-model="userAnswer" class="border border-gray-300 rounded p-2 mb-4 w-full md:w-1/2" readonly>

      <div class="grid grid-cols-3 gap-4 max-w-xs mx-auto">
        <button v-for="n in numbers" :key="n" @click="inputString(String(n))"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {{ n }}
        </button>
        <button @click="inputString('0')"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">0</button>
        <button @click="inputString('.')"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">.</button>
        <button @click="clearInput"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">C</button>
        <button @click="submitAnswer"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded col-span-3">回答</button>
      </div>

      <p v-if="feedback" :class="{ 'text-green-500': isCorrectFeedback, 'text-red-500': !isCorrectFeedback }"
        class="mt-4">{{ feedback }}</p>
    </div>
    <div v-else-if="loading">
      <p class="text-gray-500">クイズデータを読み込み中...</p>
    </div>
    <div v-else>
      <p class="text-red-500">クイズデータの読み込みに失敗しました</p>
      <button @click="retryLoadQuizData"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">再読み込み</button>
    </div>
  </div>
</template>


<script setup lang="ts">
import Papa from 'papaparse';
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HintSelector from '~/components/HintSelector.vue';

interface Question {
  questionType: string;
  questionText: string;
  correctAnswer: number;
  difficulty: string;
  userAnswer: number | null;
  isCorrect: boolean | null;
}

const questions = reactive<Question[]>([]) as Question[];
const currentQuestionIndex = ref(0);
const userAnswer = ref<string | null>(null);
const score = ref(0);
const feedback = ref('');
const loading = ref(false);
const isCorrectFeedback = ref<boolean | null>(null);
const numberOfQuestions = 10;
const numbers = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]);

const currentQuestion = computed(() => questions[currentQuestionIndex.value]);
const route = useRoute();

onMounted(() => {
  loadQuizData();
});

const loadQuizData = async () => {
  loading.value = true;
  feedback.value = '';

  const level = route.query.level as string;
  const stage = parseInt(route.query.stage as string);

  try {
    let csvText = '';

    if (stage === 1) {
      const response = await fetch('quiz-data-1.csv');
      csvText = await response.text();
    } else if (stage === 2) {
      const response = await fetch('quiz-data-2.csv');
      csvText = await response.text();
    } else if (stage === 0) {
      const response1 = await fetch('quiz-data-1.csv');
      const response2 = await fetch('quiz-data-2.csv');
      csvText = await response1.text() + "\n" + await response2.text();
    }

    const parseResult = await new Promise<Papa.ParseResult<string[]>>((resolve, reject) => {
      Papa.parse(csvText, {
        skipEmptyLines: true,
        complete: (results) => resolve(results as Papa.ParseResult<string[]>),
        error: (error: any) => reject(error),
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
      .filter((row: any) => row[0][0] !== '#' && row.length > 1 && (row[2] === level || level === '0'))
      .map((row: any) => {
        const questionType = row[0] as string;
        let questionText = row[1] as string;
        const difficulty = row[2] as string;

        const answerMatch = questionText.match(/\[(.*?)\]/);
        const correctAnswer = answerMatch ? parseFloat(answerMatch[1]) : 0;
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
    console.error('CSV ファイルの読み込みエラー:', error);
    feedback.value = 'クイズデータの読み込みに失敗しました。';
  }
};

const retryLoadQuizData = () => {
  loading.value = false;
  loadQuizData();
};

const inputString = (str: string) => {
  if (userAnswer.value === null) {
    if (str === '.') {
      userAnswer.value = '0.';
    } else {
      userAnswer.value = str;
    }
  } else {
    userAnswer.value += str;
  }
};

const clearInput = () => {
  userAnswer.value = null;
};

const submitAnswer = () => {
  if (userAnswer.value === null) {
    feedback.value = '回答を入力してください。';
    isCorrectFeedback.value = false;
    return;
  }

  const userAnswerNumber = parseFloat(userAnswer.value);

  if (isNaN(userAnswerNumber)) {
    feedback.value = '有効な数値を入力してください。';
    isCorrectFeedback.value = false;
    return;
  }

  if (userAnswerNumber === currentQuestion.value.correctAnswer) {
    score.value++;
    feedback.value = '正解！';
    isCorrectFeedback.value = true;
    questions[currentQuestionIndex.value].isCorrect = true;
  } else {
    feedback.value = `不正解... 正解は ${currentQuestion.value.correctAnswer} です。`;
    isCorrectFeedback.value = false;
    questions[currentQuestionIndex.value].isCorrect = false;
  }
  questions[currentQuestionIndex.value].userAnswer = userAnswerNumber;

  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++;
    userAnswer.value = null;
    feedback.value = '';
    isCorrectFeedback.value = null;
  } else {
    navigateTo({ path: '/result', query: { score: score.value, questions: JSON.stringify(questions) } });
  }
};
</script>
