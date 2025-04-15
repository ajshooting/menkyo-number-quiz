<template>
    <div class="my-2">
        <label class="block font-semibold mb-1 text-sm md:text-base">ヒントを選択:</label>
        <div class="flex flex-wrap gap-1 md:gap-2 mb-2 justify-center md:justify-start">
            <button v-for="hint in hintTypes" :key="hint.key" @click="handleSelect(hint.key)" :disabled="usedHint"
                :class="[
                    'px-2 py-1 md:px-4 md:py-2 rounded border',
                    'text-xs md:text-base',
                    'whitespace-nowrap',
                    selectedHint === hint.key ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-50',
                    usedHint && selectedHint !== hint.key ? 'opacity-50 cursor-not-allowed' : ''
                ]" style="min-width: 4.5em;">
                {{ hint.label }}
            </button>
        </div>
        <div v-if="selectedHint">
            <div class="p-2 md:p-3 bg-gray-50 border rounded text-sm md:text-base">
                <span v-if="selectedHint === 'sigfig'">有効数字: {{ significantFigures }}</span>
                <span v-else-if="selectedHint === 'factors'">素因数の数: {{ numPrimeFactors }}</span>
                <span v-else-if="selectedHint === 'digits'">桁数: {{ numDigits }}</span>
                <span v-else-if="selectedHint === 'divisors'">約数の個数: {{ numDivisors }}</span>
                <span v-else-if="selectedHint === 'sqrt'">平方根の整数部分: {{ sqrtFloor }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
    answer: number,
    usedHint: boolean,
}>();
const emit = defineEmits(['hint-used', 'reset-hint']);

const hintTypes = [
    { key: 'sigfig', label: '有効数字' },
    { key: 'factors', label: '素因数の数' },
    { key: 'digits', label: '桁数' },
    { key: 'divisors', label: '約数の個数' },
    { key: 'sqrt', label: '平方根の整数部分' },
];

const selectedHint = ref<string | null>(null);

function handleSelect(key: string) {
    if (!props.usedHint) {
        selectedHint.value = key;
        emit('hint-used');
    }
}

watch(() => props.usedHint, (val) => {
    if (!val) selectedHint.value = null;
});

const significantFigures = computed(() => {
    if (props.answer === undefined || props.answer === null) return 'N/A';
    let numStr = props.answer.toString();
    if (numStr.includes('.')) {
        numStr = numStr.replace(/^0+|\./g, '');
    } else {
        numStr = numStr.replace(/^0+|0+$/g, '');
    }
    if (numStr === '') return 0;
    return numStr.length;
});

function countPrimeFactors(n: number): number {
    let count = 0;
    let num = Math.abs(Math.floor(n));
    if (num < 2) return 0;
    for (let i = 2; i * i <= num; i++) {
        while (num % i === 0) {
            count++;
            num = num / i;
        }
    }
    if (num > 1) count++;
    return count;
}
const numPrimeFactors = computed(() => countPrimeFactors(props.answer));

const numDigits = computed(() => {
    if (props.answer === undefined || props.answer === null) return 'N/A';
    return Math.abs(props.answer).toString().replace('.', '').length;
});

function countDivisors(n: number): number {
    let num = Math.abs(Math.floor(n));
    if (num === 0) return 0;
    let count = 0;
    for (let i = 1; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            count += (i * i === num) ? 1 : 2;
        }
    }
    return count;
}
const numDivisors = computed(() => countDivisors(props.answer));

const sqrtFloor = computed(() => {
    if (props.answer === undefined || props.answer === null) return 'N/A';
    return Math.floor(Math.sqrt(Math.abs(props.answer)));
});
</script>
