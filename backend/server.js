
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const todos = [];
let id = 1;

app.use(cors());
app.use(bodyParser.json());

const SECRET = 'secret123';
const USER = { email: 'test@test.com', password: '123456' };

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === USER.email && password === USER.password) {
    const token = jwt.sign({ email }, SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(403);
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
};

app.get('/items', auth, (req, res) => {
  res.json(todos);
});

app.post('/items', auth, (req, res) => {
  const item = { id: id++, title: req.body.title };
  todos.push(item);
  res.json(item);
});

app.put('/items/:id', auth, (req, res) => {
  const item = todos.find(i => i.id == req.params.id);
  if (item) {
    item.title = req.body.title;
    res.json(item);
  } else {
    res.sendStatus(404);
  }
});

app.delete('/items/:id', auth, (req, res) => {
  const index = todos.findIndex(i => i.id == req.params.id);
  if (index >= 0) {
    todos.splice(index, 1);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(4000, () => console.log('API running on http://localhost:4000'));
module.exports = app;
