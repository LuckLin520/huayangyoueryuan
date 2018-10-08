const Contact = require('../models/Contact')
const path = require('path')

exports.checkDefault = (req, res) => {
    Contact.count()
        .then(data => {
            if (data == 0) {
                console.log('联系信息未初始化: ' + data)
                const contact = new Contact({
                    addr: '天府新区华阳街道华阳大道二段189号',
                    postcode: '610213',
                    email: '8888888@qq.com',
                    tel: '028-85625235',
                    title: 'contact'
                })
                contact.save()
                    .then(data => {
                        console.log('联系信息初始化成功')
                    }).catch(err => {
                        res.status(500).send("ERR DB Operation")
                    })
            }
        })
        .catch(err => {
            res.status(500).send("ERR DB Operation")
            // return res.end()
        })
}


exports.find = (req, res) => {
    Contact.findOne().then(data => {
        console.log('======' + data)
        res.render(path.resolve('./views/admin/contact'), {
            layout: false,
            contact: data
        })
    }).catch(err => {
        res.status(500).send("ERR DB Operation")

    })
}

exports.update = (req, res) => {

    Contact.update({title:'contact'},
    {   
        addr: req.body.addr,
        postcode: req.body.postcode,
        email: req.body.email,
        tel: req.body.tel
    }).then(data => {

        console.log('update successful ' + JSON.stringify(data))
      
    }).catch(err => {
        console.log('DB ERR')
        // res.status(500).send("ERR DB Operation")
    })
}