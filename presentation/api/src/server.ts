import express from 'express';

const app = express();
const port = 3000;

app.get('/', async (_req, res) => {
  res.json({ hello: 'world' });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
