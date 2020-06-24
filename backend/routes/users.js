const router = require('express').Router();
let Users = require('../models/users.model');

router.route('/add').post((req, res) => {

  const username = req.body.username
  const password = req.body.password
  const NewUser = new Users({
    username,
    password,
  })
  Users.countDocuments({ username: NewUser.username }, function (error, result) {
    if (result === 1) {
      console.log(result)
      res.json(result);
    }
    else {
      NewUser.save()
        .then(() => {
          console.log(result)
          res.json(NewUser)
        })
        .catch(error => res.status(400).json('Error: ' + error));
    }
  });
})

router.route('/login').post((req, res) => {
  // return function (req, res) {
    console.log(req)
    Users.countDocuments({ username: req.body.username, password: req.body.password }, function (error, result) {
      if (result === 1) {
        console.log(result)
        res.json(result);
      }
      else res.status(400).send('User not found')
    });
})
module.exports = router;