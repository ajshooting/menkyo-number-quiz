<template>
    <div class="my-4">
        <label class="block font-semibold mb-1">ヒントを選択:</label>
        <div class="flex gap-2 mb-2">
            <button v-for="hint in hintTypes" :key="hint.key" @click="selectedHint = hint.key" :class="[
                'px-3 py-1 rounded border',
                selectedHint === hint.key ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-50'
            ]">
                {{ hint.label }}
            </button>
        </div>
        <div v-if="selectedHint">
            <div class="p-3 bg-gray-50 border rounded">
                <span v-if="selectedHint === 'sigfig'">有効数字: {{ significantFigures }}</span>
                <span v-else-if="selectedHint === 'factors'">素因数の数: {{ numPrimeFactors }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{ answer: number }>();

const hintTypes = [
    { key: 'sigfig', label: '有効数字' },
    { key: 'factors', label: '素因数の数' },
];

const selectedHint = ref<string | null>(null);

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
</script>
