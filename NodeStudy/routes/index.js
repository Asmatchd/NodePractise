var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});




module.exports = router;

// router.post('/register', (req, res) => {
//   var username = req.body.username;
//   var password = req.body.password;
//   var firstname = req.body.firstname;
//   var lastname = req.body.lastname;
//
//   var newuser = new User();
//   newuser.username = username;
//   newuser.password = password;
//   newuser.firstname = firstname;
//   newuser.lastname = lastname;
//   newuser.save((err, savedUser) =>{
//     if(err){
//       console.log(err);
//       return res.status(500).send();
//     }
//
//     return res.status(200).send();
//   });
// });