// Local development entry point (do not use on Vercel)
const app = require('./app');

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});