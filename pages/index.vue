<template>
  <div>
    <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
      <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
        <li class="mr-2">
          <button
            class="inline-block px-4 py-2 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
            :class="stage === 1 ? 'border-blue-500 text-blue-600 dark:text-blue-500 active' : 'text-gray-500 dark:text-gray-400'"
            id="stage1-tab" type="button" @click="stage = 1">第一段階</button>
        </li>
        <li class="mr-2">
          <button
            class="inline-block px-4 py-2 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
            :class="stage === 2 ? 'border-blue-500 text-blue-600 dark:text-blue-500 active' : 'text-gray-500 dark:text-gray-400'"
            id="stage2-tab" type="button" @click="stage = 2">第二段階</button>
        </li>
        <li class="mr-2">
          <button
            class="inline-block px-4 py-2 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
            :class="stage === 0 ? 'border-blue-500 text-blue-600 dark:text-blue-500 active' : 'text-gray-500 dark:text-gray-400'"
            id="both-tab" type="button" @click="stage = 0">両方</button>
        </li>
      </ul>
    </div>

    <StartButton text="難易度 1" description="基本的な内容です" color="#4A90E2" level="1" :stage="stage" />
    <StartButton text="難易度 2" description="学科試験には多分出ません" color="#357ABD" level="2" :stage="stage" />
    <StartButton text="難易度 3" description="知るわけがないです" color="#2A5D99" level="3" :stage="stage" />
    <StartButton text="難易度 4" description="流石にひどいです" color="#1E3F75" level="4" :stage="stage" />
    <br>
    <StartButton text="全問題" description="" color="#666666" level="0" :stage="stage" />
  </div>
</template>


<script>
export default {
  data() {
    return {
      stage: 0,
    };
  },
};
</script>
