const express = require('express')
const bodyParser = require('body-parser')
const splitRouter = require('./routes/split');
const cors = require('cors');

const app = express();
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.use(splitRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
