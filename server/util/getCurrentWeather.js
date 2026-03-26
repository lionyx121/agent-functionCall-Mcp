const dotenv = require('dotenv')
const generateJWT = require('./generateQweatherJWT')

dotenv.config()

const baseURL = process.env.HEFENG_API_HOST || 'mg5khwc2ac.re.qweatherapi.com'

// 获取LocationID
const getLocationId = async (location, token) => {
    const url = 'https://' + baseURL + '/geo/v2/city/lookup?location=' + location

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()
        const { location } = data

        return location[0].id
    } catch (error) {
        console.log('请求失败', error)
    }
}

// 获取天气
const getWeather = async (location_id, token) => {
    const url = 'https://' + baseURL + '/v7/weather/7d?location=' + location_id
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()

        return data.daily
    } catch (error) {
        console.log('请求失败', error)
    }
}

const getCurrentWeather = async ({ date, location }) => {
    const token = await generateJWT()

    const location_id = await getLocationId(location, token)

    const weather = await getWeather(location_id, token)

    date = Math.min(6, date)
    const { textDay, textNight, tempMax, tempMin } = weather[+date]

    const content = `天气查询结果：
    地点：${location}
    白天天气：${textDay}
    夜晚天气：${textNight}
    最高气温：${tempMax}℃
    最低气温：${tempMin}℃
    给用户相应建议 要求必须带上上面的结果信息
    `

    return content
}


module.exports = getCurrentWeather