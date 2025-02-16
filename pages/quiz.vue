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

<script>
import quizData from '~/assets/quiz-data-1.csv';

export default {
    data() {
        return {
            questions: [],
            currentQuestionIndex: 0,
            userAnswer: null,
            score: 0,
            feedback: '',
        };
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentQuestionIndex];
        },
    },
    mounted() {
        this.loadQuizData();
    },
    methods: {
        loadQuizData() {
            // csv-loaderがパースしたデータを処理
            let questions = quizData.filter(row => row[0] !== '#' && row.length > 1).map(row => { // コメント行と空行をスキップ
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
            for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }
            this.questions = questions.slice(0, 10);
        },
        inputNumber(number) {
            this.userAnswer = this.userAnswer === null ? number : parseInt(String(this.userAnswer) + String(number));
        },
        clearInput() {
            this.userAnswer = null;
        },
        submitAnswer() {
            if (this.userAnswer === this.currentQuestion.correctAnswer) {
                this.score++;
                this.feedback = '正解！';
                this.questions[this.currentQuestionIndex].isCorrect = true;
            } else {
                this.feedback = '不正解... 正解は ' + this.currentQuestion.correctAnswer + ' です。';
                this.questions[this.currentQuestionIndex].isCorrect = false;
            }
            this.questions[this.currentQuestionIndex].userAnswer = this.userAnswer;

            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.userAnswer = null;
                this.feedback = '';
            } else {
                // クイズ終了
                this.$router.push({ path: '/result', query: { score: this.score, questions: JSON.stringify(this.questions) } });
            }
        },
    },
}
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