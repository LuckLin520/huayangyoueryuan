var express = require('express');
var path = require('path');
var router = express.Router();
var Activity = require('../db/models/Activity')
var moment = require('moment');
var Contact = require('../db/models/Contact')
var Course = require('../db/models/Course')
var Parenting = require('../db/models/Parenting')
var Child = require('../db/models/Child')
var Boss = require('../db/models/Boss')
var News = require('../db/models/News')
var Group = require('../db/models/Group')
var Teachers = require('../db/models/Teachers')
var SpecialFocus = require('../db/models/SpecialFocus')
var PicBooks = require('../db/models/PicBooks')
var CookBook = require('../db/models/CookBook')
var Homenews = require('../db/models/Homenews')
var Video = require('../db/models/Video')





/* GET home page. */
router.get('/', function (req, res, next) {

  Contact.findOne().then(data => {
    let contactInfo = data

    Boss.find({
      type: 2
    }).sort({
      '_id': -1
    }).limit(3).then(teacher => {
      // console.log(teacher)

      for (i in teacher) {
        if (teacher[i].tag === 'areaW') {
          teacher[i].tag = '西区园教师'
        }
        if (teacher[i].tag === 'areaS') {
          teacher[i].tag = '南区园教师'
        }
        if (teacher[i].tag === 'areaE') {
          teacher[i].tag = '东区园教师'
        }
        if (teacher[i].tag === 'all') {
          teacher[i].tag = '总园教师'
        }
      }

      // News.find().sort({
      //   // '_id': -1
      //   'date':-1
      // }).limit(5).then(news => {
      //   // console.log(news)

      //   for (let i in news) {
      //     if (news[i].title.length > 20) {
      //       news[i].title = news[i].title.slice(0, 20) + '...'
      //     }
      //     if (news[i].breif.length > 38)
      //       if(i > 0)
      //       news[i].breif = news[i].breif.slice(0, 38) + '...'
      //   }


      //   res.render('home', {
      //     title: '华阳幼儿园 - 首页',
      //     contact: contactInfo,
      //     teacher: teacher,
      //     news: news
      //   });
      // })
      
      // News.find().sort({
      //   'date':-1
      // }).limit(4).then(news => {
      //   Homenews.find().sort({'date':-1}).then(homenews => {
      //     for (let i in news) {
      //       if (news[i].title.length > 20) {
      //         news[i].title = news[i].title.slice(0, 20) + '...'
      //       }
      //       if (news[i].breif.length > 38)
      //         if(i > 0)
      //         news[i].breif = news[i].breif.slice(0, 38) + '...'
      //     }
      //     res.render('home', {
      //       title: '华阳幼儿园 - 首页',
      //       contact: contactInfo,
      //       teacher: teacher,
      //       news: [homenews[0], ...news]
      //     });
      //   })
      // })
      News.find().sort({
        'date':-1
      }).then(news => {
        Homenews.find().sort({'sortdate':-1}).then(homenews => {
          let re = [], idx = null;
          for (let i in news) {
            if (news[i].title != homenews[0].title) {
              re.push(news[i])
            }else{
              idx = i
            }
          }
          re.unshift(news[idx])
          for (let i in re){
            if(i > 4) break;
            if(i != 0){
              if (re[i].title.length > 60) {
              re[i].title = re[i].title.slice(0, 60) + '...'
            }
            if (re[i].breif.length > 95)
              if(i > 0)
                re[i].breif = re[i].breif.slice(0, 95) + '...'
            }
          }
          res.render('home', {
            title: '华阳幼儿园 - 首页',
            contact: contactInfo,
            teacher: teacher,
            news: [re[0], re[1], re[2], re[3], re[4]]
          });
        })
      })


    })


  }).catch(err => {
    console.log(err)
  })
});



router.get('/children/:tag', function (req, res, next) {
  let tag = req.params.tag

  console.log(tag)

  Child.find({
    tag: tag,
    type: '班级星宝贝'
  }, ).limit(4).sort({
    '_id': -1
  }).then(s => {
    // console.log(JSON.stringify(s))
    for (let i in s) {
      if (s[i].title.length > 6) {
        s[i].title = s[i].title.slice(0, 12) + '...'
      }
      if (s[i].breif.length > 30) {
        s[i].breif = s[i].breif.slice(0, 30) + '...'
      }

    }

    Child.find({
      tag: tag,
      type: '获奖宝贝'
    }, ).limit(6).then(data => {
      console.log(data)
      for (let i in data) {
        if (data[i].title.length > 6) {
          data[i].title = data[i].title.slice(0, 12) + '...'
        }
        if (data[i].award.length > 10) {
          data[i].award = data[i].award.slice(0, 10) + '...'
        }
      }

      Child.find({
        tag: tag,
        type: '宝贝作品'
      }, ).limit(4).sort({
        '_id': -1
      }).then(work => {


        Contact.findOne().then(contact => {
          res.render('children', {
            title: '宝贝风采',
            star: s,
            award: data,
            area: tag,
            work: work,
            contact: contact
          })

        })


      }).catch(err => {
        console.log(err)
      })



    }).catch(err => {
      console.log(err)
    })

  }).catch(err => {
    console.log(err)
  })

})





router.get('/activity/:tag/:page', function (req, res, next) {
  let tag = req.params.tag
  let page = req.params.page
  Activity.find({
    tag: tag
  }).skip((page - 1) * 10).limit(10).sort({
    '_id': -1
  }).then(data => {
    for (let i in data) {
      let temp = moment(data[i].date).format('YYYY-MM-DD')
      data[i].month = temp.slice(0, 7)
      data[i].day = temp.slice(8, 10)
      data[i].slug = data[i].slug.slice(0, 60) + '...';
    }
    Activity.count({
      tag: tag
    }).then(count => {
      count = Math.ceil(count / 10)
      Contact.findOne().then(contact => {
        res.render('activity', {
          title: '特色活动',
          items: data,
          currentPage: page,
          totalPage: count,
          layout: false,
          area: tag,
          contact: contact
        })
      })
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })

  // News.find({
  //   type: 'school'
  // }).skip((page - 1) * 10).limit(10).sort({
  //   'date': -1
  // }).then(data => {
  //   for (let i in data) {
  //     let temp = moment(data[i].date).format('YYYY-MM-DD')
  //     data[i].month = temp.slice(0, 7)
  //     data[i].day = temp.slice(8, 10)
  //     data[i].slug = data[i].breif.slice(0, 60) + '...';
  //   }
  //   News.count({
  //     type: 'school'
  //   }).then(count => {
  //      count = Math.ceil(count / 10)
  //     Contact.findOne().then(contact => {
  //       res.render('activity', {
  //         title: '特色活动',
  //         items: data,
  //         currentPage: page,
  //         totalPage: count,
  //         layout: false,
  //         area: tag,
  //         contact: contact
  //       })
  //     })
  //   })
  // }).catch(err => {
  //   console.log(err)
  // })
 
})

router.get('/parenting/:tag/:page', function (req, res, next) {
  let tag = req.params.tag
  Parenting.find({
    // tag: tag,
  }).limit(3).sort({
    '_id': -1
  }).then(data => {
    for (let i in data) {
      if (data[i].title.length > 60) {
        data[i].title = data[i].title.slice(0, 60) + '...'
      }
      if (data[i].breif.length > 95) {
        data[i].breif = data[i].breif.slice(0, 95) + '...'
      }
    }
    Contact.findOne().then(contact => {
      CookBook.find().limit(1).sort({'_id':-1}).then(cookbook => {
        res.render('parenting', {
          title: '家园共育',
          schooling: data,
          area: tag,
          contact: contact,
          cookbook: cookbook
        })
      })
    })
  }).catch(err => {
    console.log(err)
  })
  // News.find({
  //   type: 'home',
  // }).limit(3).sort({
  //   'date': -1
  // }).then(data => {
  //   for (let i in data) {
  //     if (data[i].title.length > 14) {
  //       data[i].title = data[i].title.slice(0, 14) + '...'
  //     }
  //     if (data[i].breif.length > 18) {
  //       data[i].breif = data[i].breif.slice(0, 18) + '...'
  //     }
  //   }
  //   Contact.findOne().then(contact => {
  //     CookBook.find().limit(1).sort({'_id':-1}).then(cookbook => {
  //       res.render('parenting', {
  //         title: '家园共育',
  //         schooling: data,
  //         area: tag,
  //         contact: contact,
  //         cookbook: cookbook
  //       })
  //     })
  //   })
  // }).catch(err => {
  //   console.log(err)
  // })
})




router.get('/course/:tag/:page', function (req, res, next) {
  let tag = req.params.tag
  let page = req.params.page
  

  Course.find().skip((page - 1) * 3).limit(3).sort({
    '_id': -1
  }).then(data => {
    for (let i in data) {
      if (data[i].title.length > 14) {
        data[i].title = data[i].title.slice(0, 32) + '...'
      }
      if (data[i].breif.length > 60) {
        data[i].breif = data[i].breif.slice(0, 60) + '...'
      }

    }

    Course.count().then(count => {
      count = Math.ceil(count / 6)
      // console.log('number of current page:' + count)    
      Contact.findOne().then(contact => {
        PicBooks.find().then(picbook => {
          for (i in picbook) {
            let temp = moment(picbook[i].date).format('YYYY-MM-DD')
            picbook[i].month = temp.slice(5, 10)
          }
           SpecialFocus.find().then(focus => {
            for (i in focus) {
              let temp = moment(focus[i].date).format('YYYY-MM-DD')
              focus[i].month = temp.slice(5, 10)
              focus[i].idx = Number(i)+1
            }
            res.render('course', {
              title: '向您推荐',
              items: data,
              currentPage: page,
              totalPage: count,
              layout: false,
              area: tag,
              contact: contact,
              pbook: [picbook[0], picbook[1]],
              focus: [focus[0], focus[1]]
            })
           })
        })
      })

    }).catch(err => {
      console.log(err)
    })


  }).catch(err => {
    console.log(err)
  })
})

router.get('/group/:tag', function (req, res, next) {
  let tag = req.params.tag
  Activity.find({
    tag: tag
  }).sort({
    _id: -1
  }).limit(2).then(act => {

    for (let i in act) {
      if (act[i].title.length > 20) {
        act[i].title = act[i].title.slice(0, 20) + '...'
      }
      if (act[i].slug.length > 30) {
        act[i].slug = act[i].slug.slice(0, 40) + '...'
      }
    }

    Group.find({ type: '蘑菇新人' }).sort({ _id: -1 }).limit(3).then(pic1 => {
      Group.find({ type: '蘑菇丽人' }).sort({ _id: -1 }).limit(3).then(pic2 => {
        Group.find({ type: '蘑菇达人' }).sort({ _id: -1 }).limit(3).then(pic3 => {
          Group.find({ type: '蘑菇名人' }).sort({ _id: -1 }).limit(3).then(pic4 => {


            Contact.findOne().then(contact => {

              res.render('group', {
                title: '集团介绍',
                act: act,
                pic1: pic1,
                pic2: pic2,
                pic3: pic3,
                pic4: pic4,
                contact: contact,

              })
            })

          })

        })

      })

    })




  })
})

router.get('/articles', function (req, res, next) {
  Contact.findOne().then(cx => {
    res.render('articles', {
      title: ' 成都市天府新区华阳幼儿园章程',
      contact: cx

    })
  })
})
router.get('/culture', function (req, res, next) {
  Contact.findOne().then(cx => {
    res.render('culture', {
      title: ' 成都市天府新区华阳幼儿园文化',
      contact: cx

    })
  })
})
router.get('/news/:cat/:page', function (req, res, next) {
  let cat = req.params.cat
  let page = req.params.page
  let currentType
  
  //cur_page为当前页，total_page为总页数。
  function get_hs_page(cur_page, total_page) {
    var cur_page=parseInt(cur_page);
    var result = {};
        result.Previous=cur_page==1 ? '' : cur_page-1;  //上一页
        result.list=[];
        result.next=cur_page>=total_page ? '' : parseInt(cur_page)+1; //下一页
        result.last = total_page == cur_page || total_page < 2 ? "" : total_page;
        result.first = cur_page == 1 ? "" : 1;
    for(var i = 0; i < total_page; i++) {
        if((i>cur_page && i<cur_page+5) || (i<cur_page && i>cur_page-5) || i==cur_page){
          var obj={
            'active':i+1==cur_page ? true : '',
            'num':i+1,
            'type':cat
          }
          result.list.push(obj);
        }
    }
    return result;
  }
  if (req.params.cat == 'all') {
    News.find().skip((req.params.page - 1) * 10).limit(10).sort({
      // _id: -1
       'date':-1
    }).then(data => {
      for (i in data) {
        let temp = moment(data[i].date).format('YYYY-MM-DD')
        data[i].month = temp.slice(5, 10)
      }
      News.find().count().then(count => {
          Contact.findOne().then(contact => {
            res.render('news', {
              title: '新闻动态',
              items: data,
              totalPage: count,
              layout: false,
              type: req.params.cat,
              paging:get_hs_page(page,Math.ceil(count/10)),
              pageingjson:JSON.stringify(get_hs_page(page,count/10)),
              contact: contact
            })
          })
      })
    })
  } else if(req.params.cat == 'school'){
    News.find({type: 'school'}).then(scholl => {
      Activity.find().then(ac => {
        ac.forEach(v => {
          v.isActivity = true;
        })
        let data = scholl.concat(ac);
        data.sort((a,b) => {
          // return new Date(b.date).getTime() - new Date(a.date).getTime();
          return b.date - a.date;
        })
        for(i in data) {
          let temp = moment(data[i].date).format('YYYY-MM-DD')
          data[i].month = temp.slice(5, 10)
        }
        let count = Math.ceil(data.length/10);
        re = data.slice((page-1) * 10, page * 10 +10);
        Contact.findOne().then(contact => {
          res.render('news', {
            title: '新闻动态',
            items: re,
            totalPage: count,
            layout: false,
            type: req.params.cat,
            paging:get_hs_page(page,count),
            contact: contact
          })
        })
      })
    })
  } else if(req.params.cat == 'home'){
    News.find({type: 'home'}).then(scholl => {
      Parenting.find().then(ac => {
        ac.forEach(v => {
          v.isParenting = true;
        })
        let data = scholl.concat(ac);
        data.sort((a,b) => {
          // return new Date(b.date).getTime() - new Date(a.date).getTime();
          return b.date - a.date;
        })
        for(i in data) {
          let temp = moment(data[i].date).format('YYYY-MM-DD')
          data[i].month = temp.slice(5, 10)
        }
        let count = Math.ceil(data.length/10);
        re = data.slice((page-1) * 10, page * 10 +10);
        Contact.findOne().then(contact => {
          res.render('news', {
            title: '新闻动态',
            items: re,
            totalPage: count,
            layout: false,
            type: req.params.cat,
            paging:get_hs_page(page,count),
            contact: contact
          })
        })
      })
    })
  } else{
    currentType=req.params.cat;   //根据类型查询
    News.find({
      type: currentType
    }).skip((req.params.page - 1) * 10).limit(10).sort({
      // _id: -1
       'date':-1
    }).then(data => {

      for (i in data) {
        let temp = moment(data[i].date).format('YYYY-MM-DD')
        data[i].month = temp.slice(5, 10)
      }

      News.find({ type: currentType }).count().then(count => {
        Contact.findOne().then(contact => {
          res.render('news', {
            title: '新闻动态',
            items: data,
            totalPage: count,
            layout: false,
            type: req.params.cat,
            paging:get_hs_page(page,Math.ceil(count/10)),
            pageingjson:JSON.stringify(get_hs_page(page,count/10)),
            contact: contact
          })
        })
      })
    })
  }
})
//******************************************************************************
router.get('/teacher-good/all/:page', function (req, res, next) {
  let cat = req.params.cat
  let page = req.params.page

  //cur_page为当前页，total_page为总页数。
  function get_hs_page(cur_page, total_page) {
    var cur_page=parseInt(cur_page);
    var result = {};
        result.Previous=cur_page==1 ? '' : cur_page-1;  //上一页
        result.list=[];
        result.next=cur_page>=total_page ? '' : parseInt(cur_page)+1; //下一页
        result.last = total_page == cur_page || total_page < 2 ? "" : total_page;
        result.first = cur_page == 1 ? "" : 1;
    for(var i = 0; i < total_page; i++) {
        if((i>cur_page && i<cur_page+5) || (i<cur_page && i>cur_page-5) || i==cur_page){
          var obj={
            'active':i+1==cur_page ? true : '',
            'num':i+1,
            'type':cat
          }
          result.list.push(obj);
        }
    }
    return result;
  }

  Teachers.find().skip((req.params.page - 1) * 10).limit(10).sort({
    // _id: -1
      'date':-1
  }).then(data => {
    for (i in data) {
      let temp = moment(data[i].date).format('YYYY-MM-DD')
      data[i].month = temp.slice(5, 10)
    }
    Teachers.find().count().then(count => {
        Contact.findOne().then(contact => {
          res.render('teacher-good', {
            title: '最美华幼人',
            items: data,
            totalPage: count,
            layout: false,
            // type: req.params.cat,
            paging:get_hs_page(page,Math.ceil(count/10)),
            pageingjson:JSON.stringify(get_hs_page(page,count/10)),
            contact: contact
          })
        })
    })
  })
})
router.get('/picbook/all/:page', function (req, res, next) {
  let cat = req.params.cat
  let page = req.params.page

  //cur_page为当前页，total_page为总页数。
  function get_hs_page(cur_page, total_page) {
    var cur_page=parseInt(cur_page);
    var result = {};
        result.Previous=cur_page==1 ? '' : cur_page-1;  //上一页
        result.list=[];
        result.next=cur_page>=total_page ? '' : parseInt(cur_page)+1; //下一页
        result.last = total_page == cur_page || total_page < 2 ? "" : total_page;
        result.first = cur_page == 1 ? "" : 1;
    for(var i = 0; i < total_page; i++) {
        if((i>cur_page && i<cur_page+5) || (i<cur_page && i>cur_page-5) || i==cur_page){
          var obj={
            'active':i+1==cur_page ? true : '',
            'num':i+1,
            'type':cat
          }
          result.list.push(obj);
        }
    }
    return result;
  }

  PicBooks.find().skip((req.params.page - 1) * 10).limit(10).sort({
    // _id: -1
      'date':-1
  }).then(data => {
    for (i in data) {
      let temp = moment(data[i].date).format('YYYY-MM-DD')
      data[i].month = temp.slice(5, 10)
    }
    PicBooks.find().count().then(count => {
        Contact.findOne().then(contact => {
          res.render('picbook', {
            title: '绘本推荐',
            items: data,
            totalPage: count,
            layout: false,
            // type: req.params.cat,
            paging:get_hs_page(page,Math.ceil(count/10)),
            pageingjson:JSON.stringify(get_hs_page(page,count/10)),
            contact: contact
          })
        })
    })
  })
})
router.get('/lecture/all/:page', function (req, res, next) {
  let cat = req.params.cat
  let page = req.params.page

  //cur_page为当前页，total_page为总页数。
  function get_hs_page(cur_page, total_page) {
    var cur_page=parseInt(cur_page);
    var result = {};
        result.Previous=cur_page==1 ? '' : cur_page-1;  //上一页
        result.list=[];
        result.next=cur_page>=total_page ? '' : parseInt(cur_page)+1; //下一页
        result.last = total_page == cur_page || total_page < 2 ? "" : total_page;
        result.first = cur_page == 1 ? "" : 1;
    for(var i = 0; i < total_page; i++) {
        if((i>cur_page && i<cur_page+5) || (i<cur_page && i>cur_page-5) || i==cur_page){
          var obj={
            'active':i+1==cur_page ? true : '',
            'num':i+1,
            'type':cat
          }
          result.list.push(obj);
        }
    }
    return result;
  }

  Course.find().skip((req.params.page - 1) * 10).limit(10).sort({
    // _id: -1
      'date':-1
  }).then(data => {
    for (i in data) {
      let temp = moment(data[i].date).format('YYYY-MM-DD')
      data[i].month = temp.slice(5, 10)
    }
    Course.find().count().then(count => {
        Contact.findOne().then(contact => {
          res.render('lecture', {
            title: '专家说教',
            items: data,
            totalPage: count,
            layout: false,
            // type: req.params.cat,
            paging:get_hs_page(page,Math.ceil(count/10)),
            pageingjson:JSON.stringify(get_hs_page(page,count/10)),
            contact: contact
          })
        })
    })
  })
})
router.get('/specialfocus/all/:page', function (req, res, next) {
  let cat = req.params.cat
  let page = req.params.page

  //cur_page为当前页，total_page为总页数。
  function get_hs_page(cur_page, total_page) {
    var cur_page=parseInt(cur_page);
    var result = {};
        result.Previous=cur_page==1 ? '' : cur_page-1;  //上一页
        result.list=[];
        result.next=cur_page>=total_page ? '' : parseInt(cur_page)+1; //下一页
        result.last = total_page == cur_page || total_page < 2 ? "" : total_page;
        result.first = cur_page == 1 ? "" : 1;
    for(var i = 0; i < total_page; i++) {
        if((i>cur_page && i<cur_page+5) || (i<cur_page && i>cur_page-5) || i==cur_page){
          var obj={
            'active':i+1==cur_page ? true : '',
            'num':i+1,
            'type':cat
          }
          result.list.push(obj);
        }
    }
    return result;
  }

  SpecialFocus.find().skip((req.params.page - 1) * 10).limit(10).sort({
    // _id: -1
      'date':-1
  }).then(data => {
    for (i in data) {
      let temp = moment(data[i].date).format('YYYY-MM-DD')
      data[i].month = temp.slice(5, 10)
    }
    SpecialFocus.find().count().then(count => {
        Contact.findOne().then(contact => {
          res.render('specialfocus', {
            title: '特别关注',
            items: data,
            totalPage: count,
            layout: false,
            // type: req.params.cat,
            paging:get_hs_page(page,Math.ceil(count/10)),
            pageingjson:JSON.stringify(get_hs_page(page,count/10)),
            contact: contact
          })
        })
    })
  })
})
router.get('/impress/all/:page', function (req, res, next) {
  let cat = req.params.cat
  let page = req.params.page

  //cur_page为当前页，total_page为总页数。
  function get_hs_page(cur_page, total_page) {
    var cur_page=parseInt(cur_page);
    var result = {};
        result.Previous=cur_page==1 ? '' : cur_page-1;  //上一页
        result.list=[];
        result.next=cur_page>=total_page ? '' : parseInt(cur_page)+1; //下一页
        result.last = total_page == cur_page || total_page < 2 ? "" : total_page;
        result.first = cur_page == 1 ? "" : 1;
    for(var i = 0; i < total_page; i++) {
        if((i>cur_page && i<cur_page+5) || (i<cur_page && i>cur_page-5) || i==cur_page){
          var obj={
            'active':i+1==cur_page ? true : '',
            'num':i+1,
            'type':cat
          }
          result.list.push(obj);
        }
    }
    return result;
  }

  Parenting.find().skip((req.params.page - 1) * 10).limit(10).sort({
    // _id: -1
      'date':-1
  }).then(data => {
    for (i in data) {
      let temp = moment(data[i].date).format('YYYY-MM-DD')
      data[i].month = temp.slice(5, 10)
    }
    Parenting.find().count().then(count => {
        Contact.findOne().then(contact => {
          res.render('impress', {
            title: '家园印记',
            items: data,
            totalPage: count,
            layout: false,
            // type: req.params.cat,
            paging:get_hs_page(page,Math.ceil(count/10)),
            pageingjson:JSON.stringify(get_hs_page(page,count/10)),
            contact: contact
          })
        })
    })
  })
})
router.get('/cookbook/all/:page', function (req, res, next) {
  let cat = req.params.cat
  let page = req.params.page

  //cur_page为当前页，total_page为总页数。
  function get_hs_page(cur_page, total_page) {
    var cur_page=parseInt(cur_page);
    var result = {};
        result.Previous=cur_page==1 ? '' : cur_page-1;  //上一页
        result.list=[];
        result.next=cur_page>=total_page ? '' : parseInt(cur_page)+1; //下一页
        result.last = total_page == cur_page || total_page < 2 ? "" : total_page;
        result.first = cur_page == 1 ? "" : 1;
    for(var i = 0; i < total_page; i++) {
        if((i>cur_page && i<cur_page+5) || (i<cur_page && i>cur_page-5) || i==cur_page){
          var obj={
            'active':i+1==cur_page ? true : '',
            'num':i+1,
            'type':cat
          }
          result.list.push(obj);
        }
    }
    return result;
  }

  CookBook.find().skip((req.params.page - 1) * 10).limit(10).sort({
    // _id: -1
      'date':-1
  }).then(data => {
    for (i in data) {
      let temp = moment(data[i].date).format('YYYY-MM-DD')
      data[i].month = temp.slice(5, 10)
    }
    CookBook.find().count().then(count => {
        Contact.findOne().then(contact => {
          res.render('cookbook', {
            title: '幼儿食谱',
            items: data,
            totalPage: count,
            layout: false,
            // type: req.params.cat,
            paging:get_hs_page(page,Math.ceil(count/10)),
            pageingjson:JSON.stringify(get_hs_page(page,count/10)),
            contact: contact
          })
        })
    })
  })
})
//**********************************************************************************


router.get('/teacher/:tag', function (req, res, next) {
  let tag = req.params.tag

  Boss.find({
    tag: tag,
    type: 1
  }).then(s => {


    Boss.find({
      type: 2
    }).then(data => {
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
      // console.log(s)
      Course.find().sort({
        _id: -1
      }).limit(3).then(course => {

        for (let i in course) {
          if (course[i].title.length > 12) {
            course[i].title = course[i].title.slice(0, 12) + '...'
          }
          if (course[i].breif.length > 19) {
            course[i].breif = course[i].breif.slice(0, 19) + '...'
          }

        }
        Group.find({ type: '蘑菇新人' }).sort({ _id: -1 }).limit(2).then(pic1 => {
          Group.find({ type: '蘑菇丽人' }).sort({ _id: -1 }).limit(2).then(pic2 => {
            Group.find({ type: '蘑菇达人' }).sort({ _id: -1 }).limit(2).then(pic3 => {
              Group.find({ type: '蘑菇名人' }).sort({ _id: -1 }).limit(2).then(pic4 => {
                Boss.find({ type: 2 }).sort({ _id: -1 }).limit(3).then(te => {
                  for (let i in te) {
                    if (te[i].tag === 'areaW') {
                      te[i].tag = '西区园教师'
                    }
                    if (te[i].tag === 'areaS') {
                      te[i].tag = '南区园教师'
                    }
                    if (te[i].tag === 'areaE') {
                      te[i].tag = '东区园教师'
                    }
                    if (te[i].tag === 'all') {
                      te[i].tag = '总园教师'
                    }
                  }
                  Contact.findOne().then(contact => {
                    Teachers.find().then(tgood => {
                       for (j in tgood) {
                        if (tgood[j].tag === 'areaW') {
                          tgood[j].tag = '西区园教师'
                        }
                        if (tgood[j].tag === 'areaS') {
                          tgood[j].tag = '南区园教师'
                        }
                        if (tgood[j].tag === 'areaE') {
                          tgood[j].tag = '东区园教师'
                        }
                        if (tgood[j].tag === 'all') {
                          tgood[j].tag = '总园教师'
                        }
                      }
                      res.render('teacher', {
                        title: '师生风采',
                        pic1: pic1,
                        pic2: pic2,
                        pic3: pic3,
                        pic4: pic4,
                        single: s,
                        items: data,
                        area: tag,
                        course: course,
                        contact: contact,
                        teacher: te,
                        tgood: [tgood[0], tgood[1], tgood[2]]
                      })
                    })
                    
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})







router.get('/detail/:cat/:id', function (req, res, next) {

  Contact.findOne().then(contact => {





    if (req.params.cat == 'course') {
      Course.findById(req.params.id).then(data => {
        data.time = moment(data.date).format('YYYY-MM-DD')
        res.render('detail', {
          title: data.title,
          data: data,
          cat: req.params.cat,
          contact: contact
        })
      })
    }
    if (req.params.cat == 'activity') {
      Activity.findById(req.params.id).then(data => {
        data.time = moment(data.date).format('YYYY-MM-DD')
        res.render('detail', {
          title: data.title,
          data: data,
          cat: req.params.cat,
          contact: contact
        })
      })
    }
    if (req.params.cat == 'parenting') {
      Parenting.findById(req.params.id).then(data => {
        data.time = moment(data.date).format('YYYY-MM-DD')
        res.render('detail', {
          title: data.title,
          data: data,
          cat: req.params.cat,
          contact: contact
        })
      })
    }

    if (req.params.cat == 'news') {
      News.findById(req.params.id).then(data => {
        data.time = moment(data.date).format('YYYY-MM-DD')
        res.render('detail', {
          title: data.title,
          data: data,
          cat: req.params.cat,
          contact: contact
        })
      }).catch(err=>{
         Homenews.findById(req.params.id).then(data => {
          data.time = moment(data.date).format('YYYY-MM-DD')
          res.render('detail', {
            title: data.title,
            data: data,
            cat: req.params.cat,
            contact: contact
          })
        })
      })
    }

    if (req.params.cat == 'teacher-good') {
      Teachers.findById(req.params.id).then(data => {
        data.time = moment(data.date).format('YYYY-MM-DD')
        res.render('detail', {
          title: data.title,
          data: data,
          cat: req.params.cat,
          contact: contact
        })
      })
    }

    if (req.params.cat == 'picbook') {
      PicBooks.findById(req.params.id).then(data => {
        data.time = moment(data.date).format('YYYY-MM-DD')
        res.render('detail', {
          title: data.title,
          data: data,
          cat: req.params.cat,
          contact: contact
        })
      })
    }

    if (req.params.cat == 'specialfocus') {
      SpecialFocus.findById(req.params.id).then(data => {
        data.time = moment(data.date).format('YYYY-MM-DD')
        res.render('detail', {
          title: data.title,
          data: data,
          cat: req.params.cat,
          contact: contact
        })
      })
    }
    if (req.params.cat == 'cookbook') {
      CookBook.findById(req.params.id).then(data => {
        data.time = moment(data.date).format('YYYY-MM-DD')
        res.render('cookbook-detail', {
          title: data.title,
          data: data,
          cat: req.params.cat,
          contact: contact
        })
      })
    }

    // if (req.params.cat == 'teacher') {
    //   News.findById(req.params.id).then(data => {
    //     data.time = moment(data.date).format('YYYY-MM-DD')
    //     res.render('detail', {
    //       title: data.title,
    //       data: data,
    //       cat: req.params.cat,
    //       contact: contact
    //     })
    //   })
    // }
  })
})
//教师详情页
router.get('/teacherInfo/:id', (req, res, next) => {
  Contact.findOne().then(contact => {
    Boss.findById(req.params.id).then(data => {
      for (let i in data) {
        if (data[i].tag === 'areaW') {
          data[i].tag = '西区园教师'
        }
        if (data[i].tag === 'areaS') {
          data[i].tag = '南区园教师'
        }
        if (data[i].tag === 'areaE') {
          data[i].tag = '东区园教师'
        }
        if (data[i].tag === 'all') {
          data[i].tag = '总园教师'
        }
      }
      res.render('teacherInfo', {
        title: '教师介绍',
        data: data,
        contact: contact
      })
    }).catch(err=>{
      res.render('error',err)
    })

  })

})

router.get('/video/:page', (req, res, next) => {
   let page = req.params.page;
  //cur_page为当前页，total_page为总页数。
  function get_hs_page(cur_page, total_page) {
    var cur_page=parseInt(cur_page);
    var result = {};
        result.Previous=cur_page==1 ? '' : cur_page-1;  //上一页
        result.list=[];
        result.next=cur_page>=total_page ? '' : parseInt(cur_page)+1; //下一页
        result.last = total_page == cur_page || total_page < 2 ? "" : total_page;
        result.first = cur_page == 1 ? "" : 1;
    for(var i = 0; i < total_page; i++) {
        if((i>cur_page && i<cur_page+5) || (i<cur_page && i>cur_page-5) || i==cur_page){
          var obj={
            'active':i+1==cur_page ? true : '',
            'num':i+1,
            // 'type':cat
          }
          result.list.push(obj);
        }
    }
    return result;
  }
   Video.find().skip((req.params.page - 1) * 10).limit(10).sort({
       'date':-1
    }).then(data => {
      for (i in data) {
        let temp = moment(data[i].date).format('YYYY-MM-DD')
        data[i].month = temp.slice(5, 10)
      }
      let count = Math.ceil(data.length / 10);
      Contact.findOne().then(contact => {
        res.render('videos', {
          title: '新闻动态',
          items: data,
          totalPage: count,
          layout: false,
          type: req.params.cat,
          paging:get_hs_page(page, count),
          contact: contact
        })
      })
    })
})

module.exports = router;