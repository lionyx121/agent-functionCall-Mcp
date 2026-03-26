const privateKeyPem = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEINSORZ9YLK1MGHyzE8FqKt8QkPph1AQIeKUe/MzXgB1O
-----END PRIVATE KEY-----
`

// 你的和风天气控制台信息
const KID = 'TJWET9JPWV'      // Header 里的 kid
const PROJECT_ID = '3AKUX5GDPG' // Payload 里的 sub

async function generateJWT() {
    const { importPKCS8, SignJWT } = await import('jose')

    // Ed25519 对应算法标识是 EdDSA
    const privateKey = await importPKCS8(privateKeyPem, 'EdDSA')

    const now = Math.floor(Date.now() / 1000)

    const token = await new SignJWT({})
        .setProtectedHeader({
            alg: 'EdDSA',
            kid: KID,
            typ: 'JWT', // 文档说如果带 typ，必须是 JWT；不想带也可以删掉
        })
        .setSubject(PROJECT_ID) // sub
        .setIssuedAt(now - 30)  // iat，建议提前 30 秒
        .setExpirationTime(now + 60 * 10) // exp，这里示例 10 分钟
        .sign(privateKey)

    return token
}

module.exports = generateJWT
