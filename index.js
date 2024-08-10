require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

//connect db
mongoose.connect(process.env.MONGO_URI); 

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
  }
});

// create model
const urlEntry = mongoose.model('urlEntry', urlSchema);


/**
 * * POST submitted URL
 *  if url exists in db:
 *    res corresponding shorturl
 *  else:
 *    verify url dns.lookup**
 *      if pass
 *        generate shorturl (logic?)**
 *          add entry to database
 *            res.json({original_url: , short_url: )
 */
app.post('/api/shorturl', async function(req, res) {
  const original_url = req.body.url;
  const urlRepeat = await urlEntry.findOne({original_url: req.body.url});
  if (urlRepeat){
    res.json({original_url: urlRepeat.original_url, short_url: urlRepeat.short_url});
  } else {
    const last_url = await urlEntry.findOne().sort({short_url: -1});
    const short_url = last_url ? last_url.short_url + 1 : 1;
    
    const new_url = new urlEntry({original_url, short_url});
    new_url.save();
  
    res.json({original_url, short_url});
  }
  
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
app.get('/api/shorturl/:short_url', async function(req, res) {
  const urlFound = await urlEntry.findOne({short_url: req.params.short_url});
  if (urlFound){
    res.redirect(urlFound.original_url);
  }
  res.json({ error: 'No short URL found for the given input' });
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
