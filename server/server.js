const express = require('express');

const app = express();

const chat = require('./routes/chat')

// 中间件
app.use(express.json());

app.use('/api/chat', chat)

app.get('/', (req, res) => {
    res.send('连接成功')
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
