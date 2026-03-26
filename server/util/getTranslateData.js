const crypto = require('crypto')
const dotenv = require('dotenv')

dotenv.config()

const BAIDU_SECRET_KEY = process.env.BAIDU_SECRET_KEY
const BAIDU_APPID = process.env.BAIDU_APPID

function makeSign(q, salt) {
    const str = BAIDU_APPID + q + salt + BAIDU_SECRET_KEY
    return crypto
        .createHash('md5')
        .update(str, 'utf8')
        .digest('hex')
}

async function getTranslateData({ from, q, to }) {
    const salt = Date.now().toString()
    const sign = makeSign(q, salt)

    const params = new URLSearchParams({
        q,                 // 这里传原始字符串，URLSearchParams 会帮你编码
        from,
        to,
        appid: BAIDU_APPID,
        salt,
        sign
    })

    const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?${params.toString()}`

    const res = await fetch(url, {
        method: 'GET'
    })

    const data = await res.json()

    const translateResult = data.trans_result[0].dst

    const content = `请基于以下翻译结果继续回答用户的问题：
原文：${q}
翻译结果：${translateResult}
请结合上下文给出自然、完整的回答。`

    return content

}

module.exports = getTranslateData