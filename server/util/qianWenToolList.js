const getCurrentWeather = require('./getCurrentWeather')
const getTranslateData = require('./getTranslateData')

// 定义工具列表  
const tools = [
    {
        type: "function",
        function: {
            name: "get_current_weather",
            description: "当你想查询指定城市未来 7 天内某一天的天气时使用。",
            parameters: {
                type: "object",
                properties: {
                    location: {
                        type: "string",
                        description: "城市、区县或具体地区名称，比如北京市、杭州市、余杭区、山东省济南市等。"
                    },
                    date: {
                        type: "number",
                        description: `
表示要查询的天气日期偏移（从今天开始计算）。

规则：
- 0 表示今天
- 1 表示明天
- 2 表示后天
- 依次类推，最大为 6（表示 6 天后）

要求：
- 只能返回整数 0~6
- 不要返回负数、小数、字符串或其他格式
- 如果用户没有明确说明日期，默认返回 0
`
                    }
                },
                required: ["location", "date"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_translate_data",
            description: "当你需要把用户输入的文本翻译成指定语言时使用。适用于中英文互译或其他语言翻译。",
            parameters: {
                type: "object",
                properties: {
                    q: {
                        type: "string",
                        description: "需要翻译的原文内容。必须是用户提供的原始文本，不能为空。"
                    },
                    from: {
                        type: "string",
                        description: `
翻译源语言。

常见值：
- auto：自动检测源语言
- zh：中文
- en：英语
- jp：日语
- kor：韩语
- fra：法语
- spa：西班牙语
- th：泰语
- ara：阿拉伯语
- ru：俄语
- pt：葡萄牙语
- de：德语
- it：意大利语
- el：希腊语
- nl：荷兰语
- pl：波兰语
- bul：保加利亚语
- est：爱沙尼亚语
- dan：丹麦语
- fin：芬兰语
- cs：捷克语
- rom：罗马尼亚语
- slo：斯洛文尼亚语
- swe：瑞典语
- hu：匈牙利语
- cht：繁体中文
- vie：越南语

如果用户没有明确说明源语言，优先返回 auto。
`
                    },
                    to: {
                        type: "string",
                        description: `
翻译目标语言，不能为空，不能为 auto。

常见值：
- zh：中文
- en：英语
- jp：日语
- kor：韩语
- fra：法语
- spa：西班牙语
- th：泰语
- ara：阿拉伯语
- ru：俄语
- pt：葡萄牙语
- de：德语
- it：意大利语
- el：希腊语
- nl：荷兰语
- pl：波兰语
- bul：保加利亚语
- est：爱沙尼亚语
- dan：丹麦语
- fin：芬兰语
- cs：捷克语
- rom：罗马尼亚语
- slo：斯洛文尼亚语
- swe：瑞典语
- hu：匈牙利语
- cht：繁体中文
- vie：越南语

如果用户只说“帮我翻译一下”但没指定目标语言，可以根据上下文合理判断；常见默认可设为 en。
`
                    }
                },
                required: ["q", "from", "to"]
            }
        }
    }
]

const toolMap = {
    get_current_weather: getCurrentWeather,
    get_translate_data: getTranslateData
}

module.exports = {
    tools,
    toolMap
}