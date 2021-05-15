const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const issues = require('../data/db.json');

const app = express();
const router = express.Router();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
router.get('/',(req, res)=>{
    res.status(200).send(req.query);
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

app.use('/.netlify/functions/api',router);
module.exports.handler = serverless(app);