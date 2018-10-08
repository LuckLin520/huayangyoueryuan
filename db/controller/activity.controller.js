const Activity = require('../models/Activity')
const path = require('path')

exports.create = (req, res) => {
    const activity = new Activity({
        title: req.body.title,
        date: req.body.date,
        tag: req.body.area,
        content: req.body.content,
        slug:req.body.breif
    })
   
    activity.save().then(data=>{
        console.log('新闻保存成功')
    }).catch(err => {
        console.log(err)
    })



}