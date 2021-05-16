const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const issues = require('../data/db.json');

const app = express();
const router = express.Router();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
router.get('/',(req, res)=>{
    res.status(200).send(req.params);
});
router.get('/users',(req, res, next)=>{
    if(req.query.id){
        issues.map(issue =>{
            if(issue.id==req.query.id){
                res.status(200).json({
                    message:issue
                });
            }
        });
    }
    res.status(200).json({
        message:issues
    });
});
router.post('/users',(req, res, next)=>{
    issues.push(req.body);
    fs.writeFile('/data/db.json',JSON.stringify(issues,null,2), 'utf8', err => {
        if (err) {
          throw err;
        }
  
        res.status(201).json({
            message:issues
        });
      });
});
router.get('/users/:id',(req, res, next)=>{
    var id = req.params.id;
    issues.map(issue =>{
        if(issue.id==id){
            res.status(200).json({
                issue:issue
            });
        }
    });
    res.status(404).json({
        message:"Issue is not found"
    });
});
router.delete('/users/:id',(req, res, next)=>{
    var id = req.params.id;
    fs.writeFile('./data/db.json',JSON.stringify(issues.filter(issue=>{ if(issue.id != id) return issue}),null,2), 'utf8', err => {
        if (err) {
          throw err;
        }
  
        res.status(201).json({
            message:issues
        });
      });
});
router.put('/users/:id',(req, res, next)=>{
    
    fs.writeFile('./data/db.json',JSON.stringify(issues.filter(issue => {
        if(issue.id == req.body.id){
            issue.title=req.body.title;
            return issue;
        }else{return issue;}
    }),null,2), 'utf8', err => {
        if (err) {
          throw err;
        }
  
        res.status(201).json({
            message:issues
        });
      });
});
app.use('/.netlify/functions/api',router);
module.exports.handler = serverless(app);