import express from 'express';

const app = express();
const port = 4000;

app.listen(port, () => {
  console.log(`Application started and is running on port ${port}.`);
});