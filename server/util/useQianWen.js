const dotenv = require('dotenv')
const OpenAI = require('openai')

const { tools, toolMap } = require('./qianWenToolList')

dotenv.config()

const getResponse = async (client, messages, res) => {
    const response = await client.chat.completions.create({
        model: "qwen-plus",
        messages,
        stream: true,
        tools
    });

    // 流式响应的结果
    const contentParts = [];

    // 维护一个arguments
    const myArguments = {}

    for await (const chunk of response) {

        const assistantOutput = chunk.choices[0]
        const delta = assistantOutput?.delta
        const tool_calls = Array.isArray(delta.tool_calls) ? delta.tool_calls[0] : {}
        // 走functionCall
        if (tool_calls && tool_calls.function) {
            const myFunction = tool_calls.function

            // 拿到函数对应的index
            const index = tool_calls.index ?? myFunction.index
            const name = myFunction.name || ''
            const id = tool_calls.id || ''

            if (index > -1) {
                myArguments[index] = myArguments[index] || {
                    name: '',
                    id: '',
                    argument: ''
                }

                if (name) myArguments[index].name = name
                if (id) myArguments[index].id = id
                if (myFunction.arguments) myArguments[index].argument += myFunction.arguments
            }
        }

        // 走流式响应
        if (chunk.choices && chunk.choices.length > 0) {
            const content = chunk.choices[0]?.delta?.content || "";
            res.write(content);
            contentParts.push(content);
        }
    }

    const fullResponse = contentParts.join("");

    // 返回这次响应的结果
    return {
        fullResponse,
        myArguments
    }
}

async function useQianWen(messages, res) {
    // 1. 准备工作：初始化客户端
    // 建议通过环境变量配置API Key，避免硬编码。
    if (!process.env.DASHSCOPE_API_KEY) {
        throw new Error("请设置环境变量 DASHSCOPE_API_KEY");
    }
    const client = new OpenAI({
        // 若没有配置环境变量，请将下行替换为：apiKey:"sk-xxx",
        // 各地域的API Key不同。获取API Key：https://help.aliyun.com/zh/model-studio/get-api-key
        apiKey: process.env.DASHSCOPE_API_KEY,
        // 以下是北京地域base_url，如果使用新加坡地域的模型，需要将base_url替换为：https://dashscope-intl.aliyuncs.com/compatible-mode/v1
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    });

    if (messages.length === 0) throw ('没有问题传入')

    try {
        let currentMessages = [...messages]

        while (true) {
            const { fullResponse, myArguments } = await getResponse(client, currentMessages, res)

            const toolCalls = Object.values(myArguments || {})

            // ✅ 没有工具调用 → 结束
            if (!toolCalls.length) {
                break
            }

            // ✅ 一次处理这一轮的 tool_calls
            for (const toolCall of toolCalls) {
                const { name, id, argument } = toolCall

                // 1️⃣ assistant message（声明要调用工具）
                currentMessages.push({
                    role: "assistant",
                    content: "",
                    tool_calls: [
                        {
                            id,
                            type: "function",
                            function: {
                                name,
                                arguments: argument
                            }
                        }
                    ]
                })

                const func = toolMap[name]
                const funcArgument = JSON.parse(argument || "{}")

                if (!func) continue

                // 2️⃣ 执行工具
                const result = await func(funcArgument)

                // 3️⃣ tool message（返回工具结果）
                currentMessages.push({
                    role: "tool",
                    tool_call_id: id,
                    content: result
                })
            }

            // 👉 回到 while 让 LLM 决定下一步
        }

        res.end()

    } catch (error) {
        console.error("请求失败:", error)
    }
}

module.exports = {
    useQianWen
}