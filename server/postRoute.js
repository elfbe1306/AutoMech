const express = require('express');
const database = require('./connect.cjs');
const ObjectId = require('mongodb').ObjectId;

let postRoute = express.Router();

// #1 Retrive all
// http://localhost:3000/posts
postRoute.route('/posts').get(async (req, res) => {
  let db_connect = database.getDatabase();
  let data = await db_connect.collection('UserInput').find({}).toArray();
  if(data.length > 0) {
    res.json(data);
  } else {
    throw new Error('No data found');
  }
});

// #2 Retrive one
// http://localhost:3000/posts/1
postRoute.route('/posts/:id').get(async (req, res) => {
  let db_connect = database.getDatabase();
  let data = await db_connect.collection('UserInput').findOne({_id: new ObjectId(req.params.id)});
  if(data) {
    res.json(data);
  } else {
    throw new Error('No data found');
  }
});

// #3 Create one
// http://localhost:3000/posts
postRoute.route('/posts').post(async (req, res) => {
  let db_connect = database.getDatabase();
  let mongoObject = {
    f: req.body.f,
    v: req.body.v,
    D: req.body.D,
    L: req.body.L,
    t1: req.body.t1,
    t2: req.body.t2,
    T1: req.body.T1,
    T2: req.body.T2,
  };
  try {
    let data = await db_connect.collection('UserInput').insertOne(mongoObject);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = postRoute;

// #4 Update one
// http://localhost:3000/posts/1
postRoute.route('/posts/:id').put(async (req, res) => {
  let db_connect = database.getDatabase();
  let mongoObject = {
    $set: {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.body.author,
      dateCreated: req.body.dateCreated,
    }
  }
  let data = await db_connect.collection('UserInput').updateOne({_id: new ObjectId(req.params.id)}, mongoObject);
  req.json(data);
});

// #5 Delete one
// http://localhost:3000/posts/1
postRoute.route('/posts/:id').delete(async (req, res) => {
  let db_connect = database.getDatabase();
  let data = await db_connect.collection('UserInput').deleteOne({_id: new ObjectId(req.params.id)});
  req.json(data);
});

module.exports = postRoute;