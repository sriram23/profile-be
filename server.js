const express = require('express');
const bodyParser = require('body-parser');

const axios = require('axios');

let Parser = require('rss-parser');
const parser = new Parser();

const nodemailer = require('nodemailer');

const { application } = require('express');

const cors = require('cors')
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const _ = require("lodash")


app.use(cors({
  origin: ['https://sriram-23.web.app', 'https://sriram-23.vercel.app', 'http://localhost:3000']
}))
require('dotenv').config()

app.get('/', (req, res) => {
  res.send('The Backend is running');
});

app.get('/blogs', async(req, res) => {
  try {
  let blogs;
  const hashnode = await parser.parseURL(process.env.HASHNODE_FEEDS)
  hashnode.items.map(item => {
    item.medium = "hashnode"
  })
  const medium = await parser.parseURL(process.env.MEDIUM_FEEDS)
  medium.items.map(item => {
    item.medium = "medium"
  })
  blogs = [...medium.items, ...hashnode.items]
  blogs = _.orderBy(blogs, ['isoDate'], ['desc'])
  res.status(200).send(blogs)
} catch(err) {
  res.send(err)
}
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

app.get('/twitter-user', (req, res) => {
  axios.get(`https://api.twitter.com/2/users/by/username/${req.query.username}`,
  {
    headers: {
      "Authorization": `Bearer ${process.env.TWITTER_BEARER}`
    }
  }).then((user) => {
    res.status(200).send(user.data)
  }).catch(err => {
    console.error("Something went wrong: ", err)
    res.send(err);
})
})

app.get('/github', (req, res) => {
  let url = ""
  if(req.query.q === "profile"){
    url = `https://api.github.com/users/sriram23`
  } else if(req.query.q === "repos") {
    url = `https://api.github.com/users/sriram23/repos`
  } else {
    res.send("<h1>Error: Query is missing or invalid query!</h1>")
    return
  }
  axios.get(url).then(data => {
    res.status(200).send(data.data)
  }).catch(err => {
    console.error("Something went wrong: ", err)
    res.send(err)
  })
})

app.post('/email', (req,res)=>{
  const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
  });
  
  const mailDetails = {
    from: process.env.EMAIL,
    to: process.env.TO_EMAIL,
    subject: `Message from ${req.body.sender}`,
    text: `${req.body.message}
    

    Sender email: ${req.body.email}`
  };
  mailTransporter.sendMail(mailDetails, (err, data) => {
    if(err) {
        res.send(err)
    } else {
        res.send(`Hey ${req.body.sender}, Your message is sent to Sriram!`)
    }
});
})

app.get('/fetch-blogs', async(req, res) => {
//   try {
//   // let blogs;
//   const posts = await parser.parseURL(process.env.HASHNODE_FEEDS)
//   // hashnode.items.map(item => {
//   //   item.medium = "hashnode"
//   // })
//   // const medium = await parser.parseURL(process.env.MEDIUM_FEEDS)
//   // medium.items.map(item => {
//   //   item.medium = "medium"
//   // })
//   // blogs = [...medium.items, ...hashnode.items]
//   // blogs = _.orderBy(blogs, ['isoDate'], ['desc'])
//   res.status(200).send(posts)
// } catch(err) {
//   res.send(err)
// }
  parser.parseURL(process.env.HASHNODE_FEEDS).then(resp => {
    res.status(200).send(resp)
  }).catch(err => res.send(err))
})

app.listen(process.env.PORT || 4000, () => console.log('Backend is running on localhost:4000'));