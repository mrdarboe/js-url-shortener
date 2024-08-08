require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

//connect db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// schema for url
const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: { 
    type: Number,
    required: true,
    unique: true,
    index: true
  }
});

// create model
const urlEntry = mongoose.model('urlEntry', urlSchema);


/**
 * * POST submitted URL
 *  if url exists in db:
 *    res corresponding shorturl
 *  else:
 *    verify url dns.lookup
 *      if pass
 *        generate shorturl (logic?)
 *          add entry to database
 *            res.json({original_url: , short_url: )
 */
app.post('/api/shorturl', function(req, res) {
  const original_url = req.body.url;

  const last_url = urlEntry.findOne().sort({short_url: -1})
  const short_url = last_url ? last_url.short_url + 1 : 1;

  const new_url = new urlEntry({original_url, short_url});
  new_url.save();

  res.json({original_url, last_url});
})

/**
 * * GET api/shorturl/:url
 *  find url in database
 *    if found:
 *      const urlToVisit = found.original_url
 *        redirect to urlToVisit
 *    else:
 *      Not Found
 */
app.get('/api/shorturl/:url', function(req, res) {
  res.json({ greeting: 'hello' });
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
