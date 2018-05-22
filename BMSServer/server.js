// 引入 NodeJs Express框架
const express = require("express");
const server = express();

// express 中间件 cookie 和 session 解析模块
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

// nodeJS 文件路径处理模块
const path = require('path');

// express 中间件 body-parser 用来解析 post 请求
const bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// 引入自己封装的数据库操作语句
const db = require('./libs/db');
const common = require('./libs/common');

// nodeJS 文件系统模块
const fs = require('fs');

// express 中间件 multer, 用于文件上传解析
const multer = require('multer');
server.use(multer({ dest: './static/upload/'}).any());

const ObjectID = require('mongodb').ObjectID;

// 监听3000端口
server.listen(3000, '127.0.0.1');
// 暴露静态资源文件供前端页面访问
server.use('/static', express.static(path.resolve(__dirname, './static')));

// session 模块
server.use(cookieParser());
(function() {
    var keys = [];
    for (var i=0; i<100000; i++) {
        keys.push("sign_" + Math.random());
    }
    server.use(cookieSession({ // 使用session必须有keys，用于加密
        name: "session",
        keys,
        maxAge: 60 * 60 * 1000 // 设置 session 过期时间为1小时
    }));
})()

// 访问根路径后渲染前端页面
server.get('/', function(req, res) {
  const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8');
  console.log("******图书管理系统启动******");
  res.send(html);
})

// 前端验证请求，前端每个页面加载前发送验证请求来获取当前用户信息，根据当前的用户信息中的角色来控制显示
// 如果未登录则前端控制路由跳转到登录界面
server.get("/verify", function(req, res) {
    if (req.session.user) {
        res.send({ "isLogin": true , 'user': req.session.user, "msg": "已登录" });
    } else {
        res.send({ "isLogin": false, "msg": "未登录" });
    }
});

// 注销时通过此请求来清除session，即清除用户信息
server.get("/clearSession", function(req, res) {
    delete req.session.user;
    res.send({ "msg": "session清除成功！！！" });
});

// 注册
server.post("/register", function(req, res) {
  // 通过bodyParser解析从前端传来的注册信息
  const username = req.body.username;
  const password = common.encrypt(req.body.password + common.salt); // 密码进行加密
  const phone = req.body.phone;
  const role = req.body.role;
  // 注册前先检查该用户名是否已经注册
  db.find('users', { "username": username }, function(err, results) {
    if (err) {
        res.send({ "isRegister": false, "msg": "数据库错误！！！" });
    } else {
        if (results.length == 0) { // 数据库中没有此用户名
          // 注册该用户，将此用户插入到数据库中
          db.insertOne('users', 
          { 
            "username": username, "password": password, 
            "phone": phone,
            "role": role
          }, 
          function(err, result) {
            if (err) {
              console.log(err);
              res.send({ "isRegister": false, "msg": "数据库错误！！！"});
            } else {
              res.send({ "isRegister": true, "msg": "恭喜，注册成功！！！即将跳转到登录界面。"});
            }
          });    
        } else { // 数据库已存在此用户名
            res.send( { "isRegister": false, "msg": "用户名已存在！！！" });
        }
    }
  });
  
});

// 登录
server.post("/login", function(req, res) {
    console.log("login: ", req.body.username);
    const username = req.body.username;
    const password = common.encrypt(req.body.password + common.salt);
    const role = req.body.role;
    console.log(password);
    db.find('users', { "username": username }, function(err, results) {
        if (err) {
            res.send({ "isLogin": false, "msg": "数据库错误！！！" });
        } else {
            if (results.length == 0) { // 用户不存在
                res.send({ "isLogin": false, "msg": "没有此用户！！！" });
            } else if (results[0].password != password) { 
                res.send({ "isLogin": false, "msg": "密码错误！！！"});
            } else {
              if (req.session.user) { // 用户名和密码均匹配
                delete req.session.user; // 先清除session中的用户信息
              }
                // setTimeout(() => {
                //   req.session['username'] = results[0].username;
                //   res.send( { "isLogin": true, "msg": "登录成功！！！" });
                // }, 1000);
              // req.session['username'] = results[0].username;
              // req.session['role'] = results[0].role;
              req.session.user = results[0]; // 登录成功将用户信息保存到session中
              // console.log(results[0]);
              // console.log(req.session.role);
              res.send( { "isLogin": true, "msg": "登录成功！！！" });  
            }
        }
    });
});

// 获取角色列表
server.get('/getRoles', function(req, res) {
  db.find('roles', {}, function(err, result) {
    if (err) {
      res.send({ "getRoles": false, "msg": "数据库错误！！！" });
    } else {
      // console.log("getRoles: ", result);
      res.send({ "getRoles": true, "roles": result, "msg": "角色列表获取成功！！" });
    }
  })
});

// 添加角色
server.post('/addRole', function(req, res) {
  db.find('roles', { "roleName": req.body.roleName }, function(err, result) {
    if (err) {
      res.send({ "addRole": false, "msg": "数据库错误！！！" });
    } else if (result.length > 0){
      res.send({ "addRole": false, "msg": "角色已存在！！！" });
    } else {
      db.insertOne('roles', req.body, function(err, result) {
        if (err) {
          res.send({ "addRole": false, "msg": "数据库错误！！！" });
        } else {
          // console.log("addRole: ", result);
          res.send({ "addRole": true, "msg": "角色添加成功！！" });
        }
      });
    }
  })
});

// 删除角色
server.post('/deleteRole', function(req, res) {
  
  db.deleteMany('roles', { "roleName": req.body.roleName }, function(err, result) {
    if (err) {
      res.send({ "deleteRole": false, "msg": "数据库错误！！！" });
    } else {
      // console.log('deleteRole: ', result);
      res.send({ "deleteRole": true, "msg": "角色删除成功！！" });
    }
  });
})

// 修改角色
server.post('/updateRole', function(req, res) {
  db.updateMany('roles', { "roleName": req.body.originalRole.roleName }, 
  { $set: { "roleName": req.body.modifiedRole.roleName, "roleDescribe": req.body.modifiedRole.roleDescribe } }, 
  function(err, result) {
    if (err) {
      console.log(err);
      res.send({ "updateRole": false, "msg": "数据库错误！！！" });
    } else {
      res.send({ "updateRole": true, "msg": "角色修改成功！！"});
    }
  })
});

// 获取用户列表
server.get('/getUsers', function(req, res) {
  db.find('users', {}, function(err, result) {
    if (err) {
      res.send({ "getUsers": false, "msg": "数据库错误！！！" });
    } else {
      // console.log("getRoles: ", result);
      res.send({ "getUsers": true, "users": result, "msg": "用户列表获取成功！！" });
    }
  })
});

// 添加用户
server.post('/addUser', function(req, res) {
  const password = common.encrypt(req.body.password + common.salt);
  db.find('users', { "username": req.body.username }, function(err, result) {
    if (err) {
      res.send({ "addUser": false, "msg": "数据库错误！！！" });
    } else if (result.length > 0){
      res.send({ "addUser": false, "msg": "用户已存在！！！" });
    } else {
      db.insertOne('users', 
        { "username": req.body.username, "password": password , "phone": req.body.phone, "role": req.body.role }, 
        function(err, result) {
          if (err) {
            res.send({ "addUser": false, "msg": "数据库错误！！！" });
          } else {
            // console.log("addRole: ", result);
            res.send({ "addUser": true, "msg": "用户添加成功！！" });
          }
      });
    }
  })
});

// 删除用户
server.post('/deleteUser', function(req, res) {
  
  db.deleteMany('users', { "username": req.body.username }, function(err, result) {
    if (err) {
      res.send({ "deleteUser": false, "msg": "数据库错误！！！" });
    } else {
      res.send({ "deleteUser": true, "msg": "用户删除成功！！" });
    }
  });
})

// 更改用户
server.post('/updateUser', function(req, res) {
  const username = req.body.modifiedUser.username;
  const password = common.encrypt(req.body.modifiedUser.password + common.salt);
  const phone = req.body.modifiedUser.phone;
  const role = req.body.modifiedUser.role;
  db.updateMany('users', { "username": req.body.originalUser.username }, 
  { $set: { "username": username, "password": password, "phone": phone, "role": role } }, 
  function(err, result) {
    if (err) {
      console.log(err);
      res.send({ "updateUser": false, "msg": "数据库错误！！！" });
    } else {
      res.send({ "updateUser": true, "msg": "用户修改成功！！"});
    }
  })
});

// 图书登记页面，图片上传接口
server.post('/upload', function(req, res) {
  // console.log(req.files);
  // req.files 是文件上传后的所有文件信息，由于是多文件上传，所以req.files是个数组，数组的每个对象对应对应上传的每个文件的具体信息
  var images = [];
  for (var i=0; i<req.files.length; i++) {
    // console.log(req.files[0].path);
    // var newFileName = req.files[i].path + path.parse(req.files[i].originalname).ext;
    // 重命名上传后的文件：文件上传后会自动重命名，文件上传后的存放路径（包含文件名） + 文件后缀
    // req.files[i].path 是文件上传后存放的真实路径, 如：aaa.jpg 上传后为：static/upload/0ea0f348c95b0cfad6315c21c8243ac1
    var newFileName = path.normalize(req.files[i].path + path.parse(req.files[i].originalname).ext);
    newFileName = newFileName.replace(/\\/g,"/"); // 解决 windows 系统路径反斜杠的问题
    // fs.rename(req.files[i].path, newFileName, function(err) {
    //   if (err) {
    //     res.send({ "upload": false, "msg": "上传失败！！！" });
    //     return;
    //   } else {
    //     images.push({ "src": newFileName });
    //     // res.send({ "upload": true, "msg": "上传成功！！", "src": newFileName });
    //     console.log('*****', images);
    //   }
    // })
    fs.renameSync(req.files[i].path, newFileName); // 重命名
    // 将所有上传的图片的具体存放路径（相对路径）存到images数组中，返回到前端
    images.push({ "src": newFileName });
  }
  res.send({ "upload": true, "msg": "上传成功！！", "images": images });
});

// 增加图书， 前端发次请求时已将上面获得的images存放到book对象中
server.post('/addBook', function(req, res) {
  // console.log(req.body);
  db.insertOne('books', 
    req.body, 
    function(err, result) {
      if (err) {
        res.send({ "addBook": false, "msg": "数据库错误！！！" });
      } else {
        res.send({ "addBook": true, "msg": "图书添加成功！！" });
      }
  });
});

// 通过_id删除图书  mongodb 在进行插入语句时会自动生成_id(ObjectID类型)，此_id为唯一标识且不可更改
server.post('/deleteBook', function(req, res) {
  
  db.deleteMany('books', { "_id": ObjectID(req.body._id) }, function(err, result) {
    if (err) {
      res.send({ "deleteBook": false, "msg": "数据库错误！！！" });
    } else {
      res.send({ "deleteBook": true, "msg": "图书删除成功！！" });
    }
  });
})

// 通过_id修改图书
server.post('/updateBook', function(req, res) {
  console.log(req.body._id);
  db.updateMany('books', { "_id": ObjectID(req.body._id)}, 
  { $set: {
      "name": req.body.modifiedBook.name,
      "category": req.body.modifiedBook.category,
      "stock": req.body.modifiedBook.stock,
      "left": req.body.modifiedBook.left,
      "publishTime": req.body.modifiedBook.publishTime,
      "price": req.body.modifiedBook.price,
      "content" :req.body.modifiedBook.content,
      "images": req.body.modifiedBook.images,
      "collectors": req.body.modifiedBook.collectors,
      "subscribers": req.body.modifiedBook.subscribers
    }
  }, 
  function(err, result) {
    if (err) {
      console.log(err);
      res.send({ "updateBook": false, "msg": "数据库错误！！！" });
    } else {
      // console.log(result);
      res.send({ "updateBook": true, "msg": "图书修改成功！！"});
    }
  })
});

// 获取图书列表
server.get('/getBooks', function(req, res) {
  db.find('books', {}, function(err, result) {
    if (err) {
      res.send({ "getBooks": false, "msg": "数据库错误！！！" });
    } else {
      res.send({ "getBooks": true, "books": result, "msg": "图书获取成功！！" });
    }
  })
});

// 前端点击收藏会发此请求，将当前用户名插入到books表中_id对应的book的collectors数组中
server.post('/collect', function(req, res) {
  var collectors = req.body.collectors;
  collectors.push({ "username": req.session.user.username });
  db.updateMany('books', { "_id": ObjectID(req.body._id)}, 
  { $set: {
      "collectors": collectors
    }
  }, function(err, result) {
    if (err) {
      res.send({ "collect": false, "msg": "数据库错误！！！" });
    } else {
      res.send({ "collect": true, "msg": "图书收藏成功！！" });
    }
  })
})

// 取消收藏，将当前用户从book.collectors中删除
server.post('/removeCollect', function(req, res) {
  var collectors = req.body.collectors;
  var removeIndex = -1;
  for (var i=0; i<collectors.length; i++) {
    if (collectors[i].username == req.session.user.username) {
      removeIndex = i;
      break;
    }
  }
  collectors.splice(removeIndex, 1);
  db.updateMany('books', { "_id": ObjectID(req.body._id)}, 
  { $set: {
      "collectors": collectors
    }
  }, function(err, result) {
    if (err) {
      res.send({ "removeCollect": false, "msg": "数据库错误！！！" });
    } else {
      res.send({ "removeCollect": true, "msg": "收藏取消成功！！" });
    }
  })
})

// 与收藏类似
server.post('/subscribe', function(req, res) {
  var subscribers = req.body.subscribers;
  subscribers.push({ "username": req.session.user.username });
  db.updateMany('books', { "_id": ObjectID(req.body._id)}, 
  { $set: {
      "subscribers": subscribers
    }
  }, function(err, result) {
    if (err) {
      res.send({ "subscribe": false, "msg": "数据库错误！！！" });
    } else {
      res.send({ "subscribe": true, "msg": "图书订阅成功！！" });
    }
  })
})

server.post('/removeSubscribe', function(req, res) {
  var subscribers = req.body.subscribers;
  var removeIndex = -1;
  for (var i=0; i<subscribers.length; i++) {
    if (subscribers[i].username == req.session.user.username) {
      removeIndex = i;
      break;
    }
  }
  subscribers.splice(removeIndex, 1);
  db.updateMany('books', { "_id": ObjectID(req.body._id)}, 
  { $set: {
      "subscribers": subscribers
    }
  }, function(err, result) {
    if (err) {
      res.send({ "removeSubscribe": false, "msg": "数据库错误！！！" });
    } else {
      res.send({ "removeSubscribe": true, "msg": "订阅取消成功！！" });
    }
  })
})

