const express = require('express');
const serverless = require('serverless-http')
const axios = require('axios');
const request = require('request');
let Parser = require('rss-parser');
const parser = new Parser();
const { application } = require('express');
const app = express();
const router = express.Router()
require('dotenv').config()

router.get("/", (req, res) => {
  res.send('The Backend is running');
});

router.get('/medium', (req, res) => {
  parser.parseURL(process.env.MEDIUM_FEEDS).then((resp) => {
    res.header('Content-Type', 'application/json');
    res.status(200).send(resp);
  }).catch(err => {
    console.error("Something went wrong: ", err)
    res.send(err)
  })
})

router.get('/hashnode', (req, res) => {
    parser.parseURL(process.env.HASHNODE_FEEDS).then((resp) => {
      res.header('Content-Type', 'application/json');
      res.status(200).send(resp);
    }).catch(err => {
      console.error("Something went wrong: ", err)
      res.send(err)
    })
  })

router.get('/tweets', (req, res) => {
  const options = {
    url: `https://api.twitter.com/2/users/${process.env.TWITTER_ID}/tweets`,
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${process.env.TWITTER_BEARER}`
    }
  }
  request(options, (err, resp, body) => {
    if(err)
      res.send(err)
    else {
      res.status(resp.statusCode).json(resp.statusCode === 200 ? JSON.parse(body) : {statusCode: resp.statusCode, body})
    }
  })
  // res.send("Tweets are working!!")
  
    // axios.get(`https://api.twitter.com/2/users/${process.env.TWITTER_ID}/tweets`,
    // {
    //     headers: {
    //         "Authorization": `Bearer ${process.env.TWITTER_BEARER}`
    //     }
    // }).then((tweets) => {
    //     console.log("Tweets: ", tweets)
    //     res.status(200).send(tweets.data)
    // }).catch(err => {
    //     console.error("Something went wrong: ", err)
    //     res.send(err);
    // })
})

app.use('/.netlify/functions/server',router)
module.exports.handler = serverless(app)