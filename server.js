const express = require('express');
const axios = require('axios');
let Parser = require('rss-parser');
const parser = new Parser();
const { application } = require('express');
const app = express();

require('dotenv').config()

app.get('/', (req, res) => {
  res.send('The Backend is running');
});

app.get('/medium', (req, res) => {
  parser.parseURL(process.env.MEDIUM_FEEDS).then((resp) => {
    res.header('Content-Type', 'application/json');
    res.status(200).send(resp);
  }).catch(err => {
    console.error("Something went wrong: ", err)
    res.send(err)
  })
})

app.get('/hashnode', (req, res) => {
    parser.parseURL(process.env.HASHNODE_FEEDS).then((resp) => {
      res.header('Content-Type', 'application/json');
      res.status(200).send(resp);
    }).catch(err => {
      console.error("Something went wrong: ", err)
      res.send(err)
    })
  })

app.get('/tweets', (req, res) => {
    axios.get(`https://api.twitter.com/2/users/${process.env.TWITTER_ID}/tweets`,
    {
        headers: {
            "Authorization": `Bearer ${process.env.TWITTER_BEARER}`
        }
    }).then((tweets) => {
        res.status(200).send(tweets.data)
    }).catch(err => {
        console.error("Something went wrong: ", err)
        res.send(err);
    })
})

app.listen(4000, () => console.log('Backend is running on localhost:4000'));