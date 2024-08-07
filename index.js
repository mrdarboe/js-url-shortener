require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: String
});

let urlEntry = new mongoose.model('urlEntry', urlSchema)

//Test Entry
// const createAndSaveEntry = (done) => {
//   let newURL = new urlEntry({short_url: "test1"})

//   newURL.save(function(err, data){
//     if (err) return done(err)
//     done(null, data);
//   })
// }


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  res.json({original_url: req.body.url})
})

/**
 * create database
 *  
 * create schema
 * create model for adding
 * 
 * POST submitted URL
 *  if url exists in db:
 *    res corresponding shorturl
 *  else:
 *    verify url dns.lookup
 *      if pass
 *        generate shorturl (logic?)
 *          add entry to database
 *            res.json({original_url: , short_url: )
 * 
 * GET api/shorturl/:url
 *  find url in database
 *    if found:
 *      const urlToVisit = found.original_url
 *        redirect to urlToVisit
 *    else:
 *      Not Found
 */


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
