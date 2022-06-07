const express = require('express');
const PORT = 8000;

const app = express();

app.use(express.json());

app.listen(PORT, console.log(`Listening on port ${PORT}`));