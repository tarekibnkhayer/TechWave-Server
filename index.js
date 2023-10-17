const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5010;

// middlewares:
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello Bangladesh");
})
app.listen(port, () => {
    console.log(`server is running from port ${port}`);
})
