const express = require('express');
const app = express();
const port = process.env.PORT || 3001
const db = require('./model/db')
const routes = require('./api/router')

app.use(express.urlencoded())
app.use(express.json())
app.use(routes);

app.listen(port, () => console.log(`Server is listening on Port ${port}`));