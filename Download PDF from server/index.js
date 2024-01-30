const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/download-file', async (req, res) => {
  res.download("./public/docs/a.pdf");
})

app.get('/', (req, res) => {
  res.render("index");
})


app.listen(3000, () => {
  console.log("Server Start");
})