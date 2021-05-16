const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const tasks = require('../data/task.json');

const app = express();
const router = express.Router();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

router.get('/tasks',(req, res)=>{
    res.status(200).json({
        tasks:tasks
    });
});
router.post('/tasks',(req, res)=>{
    tasks.push(req.body);
    fs.writeFile('../data/task.json',JSON.stringify(tasks,null,2), 'utf8', err => {
        if (err) {
          throw err;
        }
  
        res.status(201).json({
            tasks:tasks
        });
      });
});

app.use('/.netlify/functions/todo',router);
module.exports.handler = serverless(app);