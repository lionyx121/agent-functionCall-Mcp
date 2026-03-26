const express = require('express')
const { useQianWen } = require('../util/useQianWen')

const router = express.Router()

router.post('/', async (req, res) => {
    const { messages } = req.body

    messages.unshift({
        role: 'system',
        content: `当前时间信息如下：
- 时间戳（毫秒）：${Date.now()}
- ISO 时间：${new Date().toISOString()}
- 本地时间：${new Date().toLocaleString()}
- 时区：${Intl.DateTimeFormat().resolvedOptions().timeZone}

请在需要时间推理（如“今天/明天/最近”）时基于以上时间进行判断。`
    })

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    await useQianWen(messages, res)
})

module.exports = router;
