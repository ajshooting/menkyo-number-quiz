<template>
    <div>
        <h1>クイズ</h1>
        <div v-if="currentQuestion">
            <p>{{ currentQuestion.questionText }}</p>
            <input type="number" v-model.number="userAnswer">
            <div class="tenkey">
                <button v-for="n in 9" :key="n" @click="inputNumber(n)">{{ n }}</button>
                <button @click="inputNumber(0)">0</button>
                <button @click="clearInput">C</button>
                <button @click="submitAnswer">回答</button>
            </div>
            <p v-if="feedback">{{ feedback }}</p>
        </div>
        <p v-else>クイズデータを読み込み中...</p>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { parse } from 'csv-parse';

const questions = reactive<any[]>([]) as any; // 型定義を修正
const currentQuestionIndex = ref(0);
const userAnswer = ref<number | null>(null);
const score = ref(0);
const feedback = ref('');

const currentQuestion = computed(() => questions[currentQuestionIndex.value]);

onMounted(async () => {
    await loadQuizData();
});

const loadQuizData = async () => {
    try {
        const response = await fetch('/menkyo-number-quiz/quiz-data-1.csv'); // `app.baseURL` を考慮したパスに変更
        const csvText = await response.text();

        parse(csvText, {
            skip_empty_lines: true,
            skip_lines_with_empty_values: true,
        }, (err, records) => {
            if (err) {
                console.error('CSV パースエラー:', err);
                return;
            }

            let parsedQuestions = records
                .filter(row => row[0] !== '#' && row.length > 1)
                .map(row => {
                    const questionType = row[0];
                    let questionText = row[1];
                    const difficulty = row[2];

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

            // ランダムに10問選択
            for (let i = parsedQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [parsedQuestions[i], parsedQuestions[j]] = [parsedQuestions[j], parsedQuestions[i]];
            }
            questions.push(...parsedQuestions.slice(0, 10));
        });
    } catch (error) {
        console.error('CSV ファイルの読み込みエラー:', error);
    }
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
        questions[currentQuestionIndex.value].isCorrect = true;
    } else {
        feedback.value = '不正解... 正解は ' + currentQuestion.value.correctAnswer + ' です。';
        questions[currentQuestionIndex.value].isCorrect = false;
    }
    questions[currentQuestionIndex.value].userAnswer = userAnswer.value;

    if (currentQuestionIndex.value < questions.length - 1) {
        currentQuestionIndex.value++;
        userAnswer.value = null;
        feedback.value = '';
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
</style>