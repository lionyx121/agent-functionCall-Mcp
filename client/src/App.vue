<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface message { role: 'assistant' | 'user' | 'system', content: string }

const messages = ref<message[]>([])

const inputValue = ref('')

messages.value = [
  { role: 'assistant', content: '你好今天有什么我可以帮你的吗?' },
]

const onSend = async () => {
  if (inputValue.value.trim() === '') return
  messages.value.push({ role: 'user', content: inputValue.value })
  inputValue.value = ''
  await getQianQwenData()
}

const getQianQwenData = async () => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: messages.value,
    })
  });

  if (!res.body) {
    throw ('获取消息失败')
  }

  messages.value.push({ role: 'assistant', content: '' })
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    (messages.value[messages.value.length - 1] as message).content += text
  }
}
</script>

<template>
  <div class="layout">

    <div class="layout-top">
      functionCall & Mcp
    </div>

    <div class="layout-main">
      <div class="talking-box" v-for="(messagesItem, index) in messages" :key="index" :class="`${messagesItem.role}`">
        <div class="taking-top">
          {{ messagesItem.role === 'user' ? '👤' : '🤖' }}
        </div>
        <div class="taking-content">
          {{ messagesItem.content }}
        </div>
      </div>
    </div>

    <div class="layout-bottom">
      <div class="input-box">
        <input type="text" placeholder="请输入" v-model="inputValue" @keyup.enter="onSend">
        <button @click="onSend">发送</button>
      </div>
    </div>

  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #3C3C3C;
  color: #fff;

  .layout-top {
    height: 50px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .layout-main {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;

    .talking-box {
      min-width: 50px;
      width: max-content;
      max-width: 600px;
      background-color: skyblue;
      border-radius: 15px;
      padding: 15px;
      margin: 20px;
    }

    .user {
      // transform: translateX(100vw);
      align-self: flex-end;
    }
  }

  .layout-bottom {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;

    .input-box {
      height: 48px;
      width: 746px;
      background-color: #fff;
      border-radius: 48px;
      padding: 0 20px;
      display: flex;
      align-items: center;

      input {
        width: 625px;
        height: 100%;
        border: none;
        outline: none;
        padding: 0 10px;
        font-size: 16px;
      }

      button {
        flex: 1;
        height: 100%;
      }
    }
  }
}
</style>
