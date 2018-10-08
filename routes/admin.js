var express = require('express');
var router = express.Router();
var path = require('path')
var moment = require('moment')
var contact = require('../db/controller/contact.controller')
var activity = require('../db/controller/activity.controller')
var Activity = require('../db/models/Activity')
var Course = require('../db/models/Course')
var multer = require('multer')
var crypto = require('crypto')
var News = require('../db/models/News')
var Parenting = require('../db/models/Parenting')
var Child = require('../db/models/Child')
var Boss = require('../db/models/Boss')
var Group = require('../db/models/Group')
var Teachers = require('../db/models/Teachers')
var PicBooks = require('../db/models/PicBooks')
var SpecialFocus = require('../db/models/SpecialFocus')
var CookBook = require('../db/models/CookBook')
var Homenews = require('../db/models/Homenews')
var Video = require('../db/models/Video')
const fs = require('fs')

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//    cb(null, '/uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })
// var upload = multer({ storage: storage })

var storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

var upload = multer({
  storage: storage
})


router.post('/upload', upload.single('file'), function (req, res, next) {
  console.log('User upload image...')
  console.log('新图片地址：' + req.file.path.slice(6).replace(/\\/g, "/"))
  // console.log(req.file.currentImage)

  // Skip pubic dir & replace '\' to '/'
  res.send(req.file.path.slice(6).replace(/\\/g, "/"))

})

router.post('/del-pic', function (req, res, next) {
  console.log('delete the file' + req.body.location)
  if (req.body.location == 'undefined') {
    // fs.unlink(path.resolve('./public' + req.body.location), function(err){
    //   if(err){
    //     console.log(err)
    //   }
    //   console.log('已删除图片： ' + req.body.location)

    // })
    res.send('nothing')
  }

  // console.log('status: ' + status)

})

router.get('/group-list/', function (req, res, next) {

  Group.find().sort({ _id: -1 }).then(data => {
    for (i in data) {
      if (data[i].area === 'areaW') {
        data[i].area = '西区园'
      }
      if (data[i].area === 'areaS') {
        data[i].area = '南区园'
      }
      if (data[i].area === 'areaE') {
        data[i].area = '东区园'
      }
      if (data[i].area === 'all') {
        data[i].area = '总园'
      }
    }

    res.render(path.resolve('./views/admin/group-list'), {
      layout: false,
      item: data
    })
  })
})





router.get('/child-list', function (req, res, next) {

  Child.find().sort({ _id: -1 }).then(data => {
    for (let p in data) {
      data[p].time = moment(data[p].date).format('YYYY-MM-DD')
    }

    res.render(path.resolve('./views/admin/child-list'), {
      layout: false,
      item: data
    })
  }).catch(err => {
    console.log(err)
  })
})

router.get('/parenting-list', function (req, res, next) {
  Parenting.find().sort({ _id: -1 }).then(data => {
    for (let p in data) {
      data[p].time = moment(data[p].date).format('YYYY-MM-DD')
    }
    res.render(path.resolve('./views/admin/parenting-list'), {
      layout: false,
      item: data
    })
  }).catch(err => {
    console.log(err)
  })
  // News.find({type: "home"}).sort({"date": -1}).then(data => {
  //   for (let p in data) {
  //       data[p].time = moment(data[p].date).format('YYYY-MM-DD')
  //       data[p].type = "家园"
  //     }
  //     res.render(path.resolve('./views/admin/parenting-list'), {
  //       layout: false,
  //       item: data
  //     })
  //   }).catch(err => {
  //     console.log(err)
  //   })
})

router.get('/news-list', function (req, res, next) {
  var pageIndex=1
   var typeList={'school':'校园','home':'家园','smallvideo':'视频小新闻','exchange':'对外交流'}
  News.find().sort({ 'date':-1}).limit(10).skip(10*(pageIndex-1)).then(data => {
     //school 校园 home 家园 smallvideo 视频小新闻 exchange 对外交流
    for (let p in data) {
      data[p].time = moment(data[p].date).format('YYYY-MM-DD')
      data[p].typename=typeList[data[p].type];
    }
    // res.render(path.resolve('./views/admin/news-list'), {
    //   layout: false,
    //   item: data,
    // })
    //cur_page为当前页，total_page为总页数。
    function get_hs_page(cur_page, total_page) {
      var result = {};
          result.Previous=cur_page==1 ? '' : cur_page-1;  //上一页
          result.list=[];
          result.next=cur_page==total_page ? '' : cur_page+1; //下一页
      for(var i = 1; i <= total_page; i++) {
          if((i>cur_page && i<cur_page+5) || (i<cur_page && i>cur_page-5) || i==cur_page){
            result.list.push(i);
          }
      }
      return result;
    }

      News.find().count().then(count=>{        
        res.render(path.resolve('./views/admin/news-list'), {
          layout: false,
          item: data,
          count:count,
          pagingJSON:JSON.stringify(get_hs_page(pageIndex,count/10)),
          paging:get_hs_page(pageIndex,count/10),
        })
      }).catch(err=>{
        console.log(err)
      })

  }).catch(err => {
    console.log(err)
  })
})

router.get('/news-list/:pageindex', function (req, res, next) {
  var pageIndex=req.params.pageindex
   var typeList={'school':'校园','home':'家园','smallvideo':'视频小新闻','exchange':'对外交流'}
  News.find({}).sort({'date':-1}).limit(10).skip(10*(pageIndex-1)).then(data => {
     //school 校园 home 家园 smallvideo 视频小新闻 exchange 对外交流
    for (let p in data) {
      data[p].time = moment(data[p].date).format('YYYY-MM-DD')
      data[p].typename=typeList[data[p].type];
    }
    // res.render(path.resolve('./views/admin/news-list'), {
    //   layout: false,
    //   item: data,
    // })
    //cur_page为当前页，total_page为总页数。
    function get_hs_page(cur_page, total_page) {
      var cur_page=parseInt(cur_page);
      var result = {};
          result.Previous=cur_page==1 ? '' : cur_page-1;  //上一页
          result.list=[];
          result.next=cur_page>=total_page ? '' : parseInt(cur_page)+1; //下一页
      for(var i = 0; i <= total_page; i++) {
          if((i>cur_page && i<cur_page+5) || (i<cur_page && i>cur_page-5) || i==cur_page){
            result.list.push(i+1);
          }
      }
      return result;
    }

      News.find().count().then(count=>{        
        res.render(path.resolve('./views/admin/news-list'), {
          layout: false,
          item: data,
          count:count,
          pagingJSON:JSON.stringify(get_hs_page(pageIndex,count/10)),
          paging:get_hs_page(pageIndex,count/10),
        })
      }).catch(err=>{
        console.log(err)
      })

  }).catch(err => {
    console.log(err)
  })
})


router.get('/teacher-boss-list', function (req, res, next) {
  Boss.count({ type: 1 }).then(count => {
    if (count === 0) {
      let boss1 = new Boss({
        // title :req.body.title,
        // tag : req.body.area,
        // cover : req.body.cover,
        // breif : req.body.breif
        title: '园长1',
        tag: 'all',
        type: 1
      })
      boss1.save().then(data => {
        let boss2 = new Boss({
          title: '园长2',
          tag: 'areaS',
          type: 1,
        })
        boss2.save().then(data => {
          let boss3 = new Boss({
            title: '园长3',
            tag: 'areaE',
            type: 1
          })
          boss3.save().then(data => {
            let boss4 = new Boss({
              title: '园长4',
              tag: 'areaW',
              type: 1
            })
            boss4.save().then(data => {
              console.log('园长信息初始化成功')
              res.redirect('teacher-boss-list')
            })
          })
        })
      })
    } else {
      Boss.find({ type: 1 }).then(data => {
        for (i in data) {
          if (data[i].tag === 'areaW') {
            data[i].tag = '西区园'
          }
          if (data[i].tag === 'areaS') {
            data[i].tag = '南区园'
          }
          if (data[i].tag === 'areaE') {
            data[i].tag = '东区园'
          }
          if (data[i].tag === 'all') {
            data[i].tag = '总园'
          }
        }
        res.render(path.resolve('./views/admin/teacher-boss-list'), {
          layout: false,
          item: data
        })
      })
    }
  })
})

router.get('/course-list', function (req, res, next) {
  Course.find().sort({ _id: -1 }).then(data => {
    for (let p in data) {
      data[p].time = moment(data[p].date).format('YYYY-MM-DD')
    }
    res.render(path.resolve('./views/admin/course-list'), {
      layout: false,
      item: data
    })
  }).catch(err => {
    console.log(err)
  })
})

router.get('/video-list', function (req, res, next) {
  Video.find().sort({ _id: -1 }).then(data => {
    for (let p in data) {
      data[p].time = moment(data[p].date).format('YYYY-MM-DD')
    }
    res.render(path.resolve('./views/admin/video-list'), {
      layout: false,
      item: data
    })
  }).catch(err => {
    console.log(err)
  })
})


router.get('/activity-list', function (req, res, next) {
  Activity.find().sort({ _id: -1 }).then(data => {
    for (let p in data) {
      data[p].time = moment(data[p].date).format('YYYY-MM-DD')
    }
    res.render(path.resolve('./views/admin/activity-list'), {
      layout: false,
      item: data
    })
  }).catch(err => {
    console.log(err)
  })
  // News.find({type: "school"}).sort({"date": -1}).then(data => {
  //   for (let p in data) {
  //     data[p].time = moment(data[p].date).format('YYYY-MM-DD')
  //   }
  //   res.render(path.resolve('./views/admin/activity-list'), {
  //     layout: false,
  //     item: data
  //   })
  // }).catch(err => {
  //   console.log(err)
  // })
})

router.get('/logout', function (req, res, next) {
  console.log('用户退出')
  req.session.username = null;
  res.render(path.resolve('./views/admin/login'), {
    layout: false
  })
})

router.get('/', function (req, res, next) {
  res.render(path.resolve('./views/admin/login'), {
    layout: false
  })
  // res.render('admin')
})

router.get('/teacher-list/add', function (req, res, next) {
  res.render(path.resolve('./views/admin/teacher-star'), {
    layout: false,
    action: '添加',
    route: 'create'
  })
})

router.get('/course/add', function (req, res, next) {
  res.render(path.resolve('./views/admin/course-edit'), {
    layout: false,
    action: '发布',
    route: 'create'
  })
})

router.get('/group/add', function (req, res, next) {
  res.render(path.resolve('./views/admin/group-edit'), {
    layout: false,
    action: '添加',
    route: 'create'
  })
})


router.get('/child/add', function (req, res, next) {
  res.render(path.resolve('./views/admin/child-edit'), {
    layout: false,
    action: '发布',
    route: 'create'
  })
})

router.get('/news/add', function (req, res, next) {
  res.render(path.resolve('./views/admin/news-edit'), {
    layout: false,
    action: '发布',
    route: 'create'
  })
})

router.get('/parenting/add', function (req, res, next) {
  res.render(path.resolve('./views/admin/parenting-edit'), {
    layout: false,
    action: '发布',
    route: 'create'
  })
})

router.get('/activity/add', function (req, res, next) {
  res.render(path.resolve('./views/admin/activity-edit'), {
    layout: false,
    action: '发布',
    route: 'create'
  })
})

router.get('/video/add', function (req, res, next) {
  res.render(path.resolve('./views/admin/video-edit'), {
    layout: false,
    action: '发布',
    route: 'create'
  })
})




router.get('/news/edit/:id', function (req, res, next) {
  News.findById(req.params.id).then(data => {
    // console.log(JSON.stringify(data))
    data.time = moment(data.date).format('YYYY-MM-DD')

    res.render(path.resolve('./views/admin/news-edit'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })

  }).catch(err => {
    console.log(err)
  })
})


router.get('/teacher-star/edit/:id', function (req, res, next) {
  Boss.findById(req.params.id).then(data => {

    res.render(path.resolve('./views/admin/teacher-star'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })

  }).catch(err => {
    console.log(err)
  })
})


router.get('/group/edit/:id', function (req, res, next) {
  Group.findById(req.params.id).then(data => {
    console.log(data)
    res.render(path.resolve('./views/admin/group-edit'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })

  }).catch(err => {
    console.log(err)
  })
})



router.get('/teacher-boss/edit/:id', function (req, res, next) {
  Boss.findById(req.params.id).then(data => {

    res.render(path.resolve('./views/admin/teacher-boss'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })

  }).catch(err => {
    console.log(err)
  })
})


router.get('/child/edit/:id', function (req, res, next) {
  Child.findById(req.params.id).then(data => {
    // console.log(JSON.stringify(data))
    data.time = moment(data.date).format('YYYY-MM-DD')

    res.render(path.resolve('./views/admin/child-edit'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })

  }).catch(err => {
    console.log(err)
  })
})

router.get('/parenting/edit/:id', function (req, res, next) {
  Parenting.findById(req.params.id).then(data => {
    data.time = moment(data.date).format('YYYY-MM-DD')

    res.render(path.resolve('./views/admin/parenting-edit'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })
  }).catch(err => {
    console.log(err)
  })
  // News.findById(req.params.id).then(data => {
  //   data.time = moment(data.date).format('YYYY-MM-DD')

  //   res.render(path.resolve('./views/admin/parenting-edit'), {
  //     layout: false,
  //     item: data,
  //     action: '修改',
  //     route: 'edit'
  //   })
  // }).catch(err => {
  //   console.log(err)
  // })
})

router.get('/video/edit/:id', function (req, res, next) {
  Video.findById(req.params.id).then(data => {
    data.time = moment(data.data).format("YYYY-MM-DD")
    res.render(path.resolve('./views/admin/video-edit'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })
  })
})
router.get('/video/del/:id', function (req, res, next) {
  Video.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/admin/video-list'), {
    layout: false,
  }
})


router.get('/teacher-list', function (req, res, next) {
  Boss.find({ type: '2' }).then(data => {
    for (i in data) {
      if (data[i].tag === 'areaW') {
        data[i].tag = '西区园'
      }
      if (data[i].tag === 'areaS') {
        data[i].tag = '南区园'
      }
      if (data[i].tag === 'areaE') {
        data[i].tag = '东区园'
      }
      if (data[i].tag === 'all') {
        data[i].tag = '总园'
      }
    }
    res.render(path.resolve('./views/admin/teacher-list'), {
      layout: false,
      item: data
    })
  }).catch(err => {
    console.log(err)
  })
})

//*********************************************************************************************************
router.get('/teacher-good', function (req, res, next) {
  Teachers.find().then(data => {
    for (i in data) {
      if (data[i].tag === 'areaW') {
        data[i].tag = '西区园'
      }
      if (data[i].tag === 'areaS') {
        data[i].tag = '南区园'
      }
      if (data[i].tag === 'areaE') {
        data[i].tag = '东区园'
      }
      if (data[i].tag === 'all') {
        data[i].tag = '总园'
      }
    }
    res.render(path.resolve('./views/admin/teacher-good'), {
      layout: false,
      item: data
    })
  }).catch(err => {
    console.log(err)
  })
})
router.get('/teacher-good/add', function (req, res, next) {
  res.render(path.resolve('./views/admin/teacher-good-edit'), {
    layout: false,
    action: '发布',
    route: 'create'
  })
})
router.get('/teacher-good/edit/:id', function (req, res, next) {
  Teachers.findById(req.params.id).then(data => {
    // console.log(JSON.stringify(data))
    data.time = moment(data.date).format('YYYY-MM-DD')
    res.render(path.resolve('./views/admin/teacher-good-edit'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })
  }).catch(err => {
    console.log(err)
  })
})
router.get('/teacher-good/del/:id', function (req, res, next) {
  Teachers.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/admin/teacher-good'), {
    layout: false,
  }
})
router.post('/teacher-good/create', function (req, res, next) {
  // activity.create(req, res)

  const teachers = new Teachers({
    name: req.body.name,
    title: req.body.title,
    date: req.body.date,
    tag: req.body.area,
    cover: req.body.cover,
    breif: req.body.breif,
    slug: req.body.slug,
    content: req.body.content,
    type: req.body.type
  })

  teachers.save().then(data => {
    console.log('最美华幼人添加成功')
    res.redirect('/admin/teacher-good'), {
      layout: false,
    }
  }).catch(err => {
    console.log(err)
  })
})
router.post('/teacher-good/edit', function (req, res, next) {
  const id = req.body.id;
  Teachers.findById(id).then(data => {
    data.name = req.body.name
    data.title = req.body.title
    data.tag = req.body.area
    data.cover = req.body.cover
    data.breif = req.body.breif
    data.content = req.body.content
    data.type = req.body.type
    data.slug = req.body.slug
    data.date = req.body.date

    data.save().then(data => {
      res.redirect('/admin/teacher-good'), {
        layout: false,
      }
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})

router.get('/picbook-list', function (req, res, next) {
  PicBooks.find().then(data => {
    for (let p in data) {
      data[p].time = moment(data[p].date).format('YYYY-MM-DD')
    }
    res.render(path.resolve('./views/admin/picbook-list'), {
      layout: false,
      item: data
    })
  }).catch(err => {
    console.log(err)
  })
})
router.get('/picbook-list/add', function (req, res, next) {
  res.render(path.resolve('./views/admin/picbook-edit'), {
    layout: false,
    action: '发布',
    route: 'create'
  })
})
router.get('/picbook-list/edit/:id', function (req, res, next) {
  PicBooks.findById(req.params.id).then(data => {
    // console.log(JSON.stringify(data))
    data.time = moment(data.date).format('YYYY-MM-DD')
    res.render(path.resolve('./views/admin/picbook-edit'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })
  }).catch(err => {
    console.log(err)
  })
})
router.get('/picbook-list/del/:id', function (req, res, next) {
  PicBooks.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/admin/picbook-list'), {
    layout: false,
  }
})
router.post('/picbook-list/create', function (req, res, next) {
  // activity.create(req, res)
  const picbook = new PicBooks({
    title: req.body.title,
    date: req.body.date,
    // tag: req.body.area,
    cover: req.body.cover,
    breif: req.body.breif,
    slug: req.body.slug,
    content: req.body.content,
    type: req.body.type
  })

  picbook.save().then(data => {
    console.log('绘本推荐添加成功')
    res.redirect('/admin/picbook-list'), {
      layout: false,
    }
  }).catch(err => {
    console.log(err)
  })
})
router.post('/picbook-list/edit', function (req, res, next) {
  const id = req.body.id;
  PicBooks.findById(id).then(data => {
    data.title = req.body.title
    // data.tag = req.body.area
    data.cover = req.body.cover
    data.breif = req.body.breif
    data.content = req.body.content
    data.type = req.body.type
    data.slug = req.body.slug
    data.date = req.body.date

    data.save().then(data => {
      res.redirect('/admin/picbook-list'), {
        layout: false,
      }
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})

router.get('/specialfocus-list', function (req, res, next) {
  SpecialFocus.find().then(data => {
    for (let p in data) {
      data[p].time = moment(data[p].date).format('YYYY-MM-DD')
    }
    res.render(path.resolve('./views/admin/specialfocus-list'), {
      layout: false,
      item: data
    })
  }).catch(err => {
    console.log(err)
  })
})
router.get('/specialfocus-list/add', function (req, res, next) {
  res.render(path.resolve('./views/admin/specialfocus-edit'), {
    layout: false,
    action: '发布',
    route: 'create'
  })
})
router.get('/specialfocus-list/edit/:id', function (req, res, next) {
  SpecialFocus.findById(req.params.id).then(data => {
    // console.log(JSON.stringify(data))
    data.time = moment(data.date).format('YYYY-MM-DD')
    res.render(path.resolve('./views/admin/specialfocus-edit'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })
  }).catch(err => {
    console.log(err)
  })
})
router.get('/specialfocus-list/del/:id', function (req, res, next) {
  SpecialFocus.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/admin/specialfocus-list'), {
    layout: false,
  }
})
router.post('/specialfocus-list/create', function (req, res, next) {
  // activity.create(req, res)
  const focus = new SpecialFocus({
    title: req.body.title,
    date: req.body.date,
    // tag: req.body.area,
    cover: req.body.cover,
    breif: req.body.breif,
    slug: req.body.slug,
    content: req.body.content,
    type: req.body.type
  })
  focus.save().then(data => {
    console.log('特别关注添加成功')
    res.redirect('/admin/picbook-list'), {
      layout: false,
    }
  }).catch(err => {
    console.log(err)
  })
})
router.post('/specialfocus-list/edit', function (req, res, next) {
  const id = req.body.id;
  SpecialFocus.findById(id).then(data => {
    data.title = req.body.title
    // data.tag = req.body.area
    data.cover = req.body.cover
    data.breif = req.body.breif
    data.content = req.body.content
    data.type = req.body.type
    data.slug = req.body.slug
    data.date = req.body.date
    data.save().then(data => {
      res.redirect('/admin/specialfocus-list'), {
        layout: false,
      }
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})

router.get('/cookbook-list', function (req, res, next) {
  CookBook.find().then(data => {
    for (let p in data) {
      data[p].time = moment(data[p].date).format('YYYY-MM-DD')
    }
    res.render(path.resolve('./views/admin/cookbook-list'), {
      layout: false,
      item: data
    })
  }).catch(err => {
    console.log(err)
  })
})
router.get('/cookbook-list/add', function (req, res, next) {
  res.render(path.resolve('./views/admin/cookbook-edit'), {
    layout: false,
    action: '发布',
    route: 'create'
  })
})
router.get('/cookbook-list/edit/:id', function (req, res, next) {
  CookBook.findById(req.params.id).then(data => {
    // console.log(JSON.stringify(data))
    data.time = moment(data.date).format('YYYY-MM-DD')
    res.render(path.resolve('./views/admin/cookbook-edit'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })
  }).catch(err => {
    console.log(err)
  })
})
router.get('/cookbook-list/del/:id', function (req, res, next) {
  CookBook.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/admin/cookbook-list'), {
    layout: false,
  }
})
router.post('/cookbook-list/create', function (req, res, next) {
  // activity.create(req, res)
  const cookbook = new CookBook({
    title: req.body.title,
    // date: req.body.date,
    coverAll: req.body.coverAll,
    coverW: req.body.coverW,
    coverE: req.body.coverE,
    coverS: req.body.coverS
  })

  cookbook.save().then(data => {
    console.log('幼儿食谱添加成功')
    res.redirect('/admin/cookbook-list'), {
      layout: false,
    }
  }).catch(err => {
    console.log(err)
  })
})
router.post('/cookbook-list/edit', function (req, res, next) {
  const id = req.body.id;
  CookBook.findById(id).then(data => {
    data.title = req.body.title
    data.coverAll = req.body.coverAll
    data.coverW = req.body.coverW
    data.coverE = req.body.coverE
    data.coverS = req.body.coverS

    data.save().then(data => {
      res.redirect('/admin/cookbook-list'), {
        layout: false,
      }
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})
//************************************************************************************************


router.get('/course/edit/:id', function (req, res, next) {
  Course.findById(req.params.id).then(data => {
    // console.log(JSON.stringify(data))
    data.time = moment(data.date).format('YYYY-MM-DD')

    res.render(path.resolve('./views/admin/course-edit'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })

  }).catch(err => {
    console.log(err)
  })
})

router.get('/activity/edit/:id', function (req, res, next) {
  Activity.findById(req.params.id).then(data => {
    data.time = moment(data.date).format('YYYY-MM-DD')
    res.render(path.resolve('./views/admin/activity-edit'), {
      layout: false,
      item: data,
      action: '修改',
      route: 'edit'
    })
  }).catch(err => {
    console.log(err)
  })
  // News.findById(req.params.id).then(data => {
  //   data.time = moment(data.date).format('YYYY-MM-DD')
  //   res.render(path.resolve('./views/admin/activity-edit'), {
  //     layout: false,
  //     item: data,
  //     action: '修改',
  //     route: 'edit'
  //   })
  // }).catch(err => {
  //   console.log(err)
  // })
})


router.post('/group/create', function (req, res, next) {
  // activity.create(req, res)
  const group = new Group({
    title: req.body.title,
    area: req.body.area,
    cover: req.body.cover,
    type: req.body.type
  })
  group.save().then(data => {
    console.log('照片信息保存成功')
    res.redirect('/admin/group-list'), {
      layout: false,
    }
  }).catch(err => {
    console.log(err)
  })
})

router.post('/teacher-star/create', function (req, res, next) {
  // activity.create(req, res)
  const boss = new Boss({
    title: req.body.title,
    tag: req.body.area,
    cover: req.body.cover,
    content: req.body.content,
    type: 2
  })
  boss.save().then(data => {
    console.log('教师信息成功')
    res.redirect('/admin/teacher-list'), {
      layout: false,
    }
  }).catch(err => {
    console.log(err)
  })
})



router.post('/child/create', function (req, res, next) {
  // activity.create(req, res)

  const child = new Child({
    title: req.body.title,
    tag: req.body.area,
    cover: req.body.cover,
    breif: req.body.breif,
    class: req.body.slug,
    award: req.body.award,
    type: req.body.type
  })

  console.log(child)

  child.save().then(data => {
    console.log('宝贝风采保存成功')
    res.redirect('/admin/child-list'), {
      layout: false,
    }
  }).catch(err => {
    console.log(err)
  })
})




router.post('/news/create', function (req, res, next) {
  // activity.create(req, res)

  const news = new News({
    title: req.body.title,
    date: req.body.date,
    tag: req.body.area,
    cover: req.body.cover,
    breif: req.body.breif,
    slug: req.body.slug,
    content: req.body.content,
    type: req.body.type
  })

  news.save().then(data => {
    console.log('新闻保存成功')
    res.redirect('/admin/news-list'), {
      layout: false,
    }
  }).catch(err => {
    console.log(err)
  })
})

router.post('/parenting/create', function (req, res, next) {
  // activity.create(req, res)

  const parenting = new Parenting({
    title: req.body.title,
    date: req.body.date,
    // tag: req.body.area,
    cover: req.body.cover,
    breif: req.body.breif,
    type: req.body.type,
    content: req.body.content
  })

  parenting.save().then(data => {
    console.log('家庭共育保存成功')
    res.redirect('/admin/parenting-list'), {
      layout: false,
    }
  }).catch(err => {
    console.log(err)
  })
})


router.post('/course/create', function (req, res, next) {
  // activity.create(req, res)

  const course = new Course({
    title: req.body.title,
    date: req.body.date,
    tag: req.body.area,
    cover: req.body.cover,
    breif: req.body.breif,
    slug: req.body.slug,
    content: req.body.content
  })

  course.save().then(data => {
    console.log('课程保存成功')
    res.redirect('/admin/course-list'), {
      layout: false,
    }
  }).catch(err => {
    console.log(err)
  })
})
router.post('/activity/create', function (req, res, next) {
   const activity = new Activity({
    title: req.body.title,
    date: req.body.date,
    tag: req.body.area,
    pic: req.body.pic,
    slug: req.body.breif,
    content: req.body.content
  })
  activity.save().then(data => {
    console.log('活动保存成功')
    res.redirect('/admin/activity-list'), {
      layout: false,
    }
  }).catch(err => {
    console.log(err)
  })
  // const news = new News({
  //   title: req.body.title,
  //   date: req.body.date,
  //   tag: req.body.area,
  //   cover: req.body.pic,
  //   breif: req.body.breif,
  //   content: req.body.content,
  //   type: 'school'
  // })
  // news.save().then(data => {
  //   console.log('活动保存成功')
  //   res.redirect('/admin/activity-list'), {
  //     layout: false,
  //   }
  // }).catch(err => {
  //   console.log(err)
  // })

  
})

router.post('/course/edit', function (req, res, next) {
  const id = req.body.id;
  // console.log('sdfsdfs'+id)
  const course = new Course({
    title: req.body.title,
    date: req.body.date,
    tag: req.body.area,
    content: req.body.content,
    breif: req.body.breif,
    cover: req.body.cover,

  })

  Course.findById(id).then(data => {
    data.title = req.body.title,
      data.date = req.body.date,
      data.tag = req.body.area,
      data.content = req.body.content,
      data.cover = req.body.cover,
      data.breif = req.body.breif,

      data.save().then(data => {
        res.redirect('/admin/course-list'), {
          layout: false,
        }
      }).catch(err => {
        console.log(err)
      })
  }).catch(err => {
    console.log(err)
  })
})

router.post('/news/edit', function (req, res, next) {
  const id = req.body.id;
  // console.log('sdfsdfs'+id)
  const news = new News({
    title: req.body.title,
    date: req.body.date,
    tag: req.body.area,
    cover: req.body.cover,
    breif: req.body.breif,
    slug: req.body.slug,
    content: req.body.content,
    type: req.body.type

  })

  News.findById(id).then(data => {
    data.title = req.body.title,
      data.tag = req.body.area,
      data.cover = req.body.cover,
      data.breif = req.body.breif,
      data.content = req.body.content,
      data.type = req.body.type,
      data.slug = req.body.slug
    data.date = req.body.date

    data.save().then(data => {
      res.redirect('/admin/news-list'), {
        layout: false,
      }
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})

router.post('/teacher-star/edit', function (req, res, next) {
  const id = req.body.id;

  Boss.findById(id).then(data => {
    data.title = req.body.title,
      data.tag = req.body.area,
      data.cover = req.body.cover,

      data.save().then(data => {
        res.redirect('/admin/teacher-list'), {
          layout: false,
        }
      }).catch(err => {
        console.log(err)
      })
  }).catch(err => {
    console.log(err)
  })
})

router.post('/teacher/edit', function (req, res, next) {
  const id = req.body.id;
  // console.log('sdfsdfs'+id)

  Boss.findById(id).then(data => {
    data.title = req.body.title,
      data.tag = req.body.area,
      data.cover = req.body.cover,
      data.breif = req.body.breif,
      data.type = 1


    data.save().then(data => {
      res.redirect('/admin/teacher-boss-list'), {
        layout: false,
      }
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})

router.post('/group/edit', function (req, res, next) {
  const id = req.body.id;
  // console.log('sdfsdfs'+id)
  const group = new Group({
    title: req.body.title,
    area: req.body.area,
    type: req.body.type,
    cover: req.body.cover,
  })

  Group.findById(id).then(data => {
    data.title = req.body.title,
      data.area = req.body.area,
      data.cover = req.body.cover,
      data.type = req.body.type,

      data.save().then(data => {
        res.redirect('/admin/group-list'), {
          layout: false,
        }
      }).catch(err => {
        console.log(err)
      })
  }).catch(err => {
    console.log(err)
  })
})


router.post('/child/edit', function (req, res, next) {
  const id = req.body.id;
  // console.log('sdfsdfs'+id)
  const child = new Child({
    title: req.body.title,
    tag: req.body.area,
    breif: req.body.breif,
    cover: req.body.cover,
    type: req.body.type,
    award: req.body.awrad

  })

  Child.findById(id).then(data => {
    data.title = req.body.title,
      data.date = req.body.date,
      data.tag = req.body.area,
      data.award = req.body.award,
      data.cover = req.body.cover,
      data.breif = req.body.breif,
      data.type = req.body.type
    data.save().then(data => {
      res.redirect('/admin/child-list'), {
        layout: false,
      }
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})

router.post('/parenting/edit', function (req, res, next) {
  const id = req.body.id;
  Parenting.findById(id).then(data => {
    data.title = req.body.title,
      data.date = req.body.date,
      // data.tag = req.body.area,
      data.content = req.body.content,
      data.cover = req.body.cover,
      data.breif = req.body.breif,
      data.type = req.body.type
    data.save().then(data => {
      res.redirect('/admin/parenting-list'), {
        layout: false,
      }
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})

router.post('/video/edit', function (req, res, next) {
  const id = req.body.id;
  Video.findById(id).then(data => {
      data.title = req.body.title,
      data.date= req.body.date,
      data.cover= req.body.cover,
      data.breif= req.body.breif,
      data.link= req.body.link
    data.save().then(data => {
      res.redirect('/admin/video-list'), {
        layout: false,
      }
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})
router.post('/video/create', function (req, res, next) {
  const id = req.body.id;
  let video = new Video({
      title: req.body.title,
      date: req.body.date,
      cover: req.body.cover,
      breif: req.body.breif,
      link: req.body.link
  })
  video.save().then(data => {
    res.redirect('/admin/video-list'), {
      layout: false,
    }
  }).catch(err => {
    console.log(err)
  })
})


router.post('/activity/edit', function (req, res, next) {
  const id = req.body.id;
  Activity.findById(id).then(data => {
    data.title = req.body.title;
      data.date = req.body.date;
      data.tag = req.body.area;
      data.content = req.body.content;
      data.slug = req.body.breif;
      data.pic = req.body.pic;
    data.save().then(data => {
      res.redirect('/admin/activity-list'), {
        layout: false,
      }
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
  // News.findById(id).then(data => {
  //   data.title = req.body.title;
  //     data.date = req.body.date;
  //     data.tag = req.body.area;
  //     data.content = req.body.content;
  //     data.breif = req.body.breif;
  //     data.cover = req.body.pic;
  //     data.type = 'school';
  //   data.save().then(data => {
  //     res.redirect('/admin/activity-list'), {
  //       layout: false,
  //     }
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // }).catch(err => {
  //   console.log(err)
  // })


})





router.get('/group/del/:id', function (req, res, next) {
  Group.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/admin/group-list'), {
    layout: false,
  }
})

router.get('/teacher-star/del/:id', function (req, res, next) {
  Boss.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/admin/teacher-list'), {
    layout: false,
  }
})

router.get('/child/del/:id', function (req, res, next) {
  Child.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/admin/child-list'), {
    layout: false,
  }
})

router.get('/news/del/:id', function (req, res, next) {
  News.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/admin/news-list'), {
    layout: false,
  }
})
router.get('/news/home-news/:id', function (req, res, next) {
  News.findById(req.params.id).then(data => {
    const homenews = new Homenews({
      title: data.title,
      date: data.date,
      tag: data.area,
      cover: data.cover,
      breif: data.breif,
      slug: data.slug,
      content: data.content,
      type: data.type,
      sortdate: new Date().getTime()
    })
    homenews.save().then(data => {
      res.redirect('/admin/news-list'), {
        layout: false,
      }
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
})
//------------------------------------------------------------------

router.get('/course/del/:id', function (req, res, next) {
  Course.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/admin/course-list'), {
    layout: false,
  }
})

router.get('/parenting/del/:id', function (req, res, next) {
  Parenting.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/admin/parenting-list'), {
    layout: false,
  }
  // News.remove({
  //   _id: req.params.id
  // }, function (err) {
  //   if (err) {
  //     console.log(err)
  //   }
  // })
  // res.redirect('/admin/parenting-list'), {
  //   layout: false,
  // }
})


router.get('/activity/del/:id', function (req, res, next) {
  Activity.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err)
    }
  })
  res.redirect('/admin/activity-list'), {
    layout: false,
  }
  // News.remove({
  //   _id: req.params.id
  // }, function (err) {
  //   if (err) {
  //     console.log(err)
  //   }
  // })
  // res.redirect('/admin/activity-list'), {
  //   layout: false,
  // }
})


router.post('/contact', function (req, res, next) {

  if (!req.session.username) {
    res.render(path.resolve('./views/admin/login'), {
      layout: false,
    }, )
  }

  contact.update(req, res)

  res.redirect('contact'), {
    layout: false,
  }
})

router.get('/contact', function (req, res, next) {
  contact.checkDefault(req, res)
  contact.find(req, res)
})

router.post("/video-upload", function(req, res) {
  var cacheFolder = './public/videos/';//存放图片的文件名称
  var formidable = require('formidable');
  var userDirPath =cacheFolder 
  if (!fs.existsSync(userDirPath)) {
      fs.mkdirSync(userDirPath);
  }
  var form = new formidable.IncomingForm(); //创建上传表单
  form.encoding = 'utf-8'; //设置编辑
  form.uploadDir = userDirPath; //设置上传目录
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
  form.type = true;
  var displayUrl;
  form.parse(req, function(err, fields, files) {
        res.json({
            code: 0,
            link: "http://115.28.159.141"+files.video.path.slice(6)
        });
  });
})


router.post('/', function (req, res, next) {
  if (req.body.username == 'admin' && req.body.pwd == '123123') {
    console.log('登录成功： 保存session')
    req.session.username = req.body.username;

    res.render(path.resolve('./views/admin/admin'), {
      layout: false
    })
  } else {
    req.flash('accountErr', '账号/密码错误');
    res.render(path.resolve('./views/admin/login'), {
      layout: false,
      message: req.flash('accountErr')
    }, )
  }
})

module.exports = router;
