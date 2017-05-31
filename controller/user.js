/**
 * Created by puravida on 30.05.17.
 */
const router = require('express').Router();
const logger = require('winston');
const User = require('../model/User');


/**
 * Login a user
 */
router.post('/login', (req, res) => {
  const {email, password} = req.body;
  User.findOne({email: email}, (err, user) => {
    if (err) res.send(err);
    if (!user) return res.status(401).send();

    logger.debug("User found, password need to be checked");
    user.checkPassword(password, (err, isMatch) => {
      if(err || !isMatch) return res.status(401).send(err);
      logger.debug("User logged in");
      res.send({token: 'testToken'});
    });
  })
});

/**
 * Registers a user with email and password
 */
router.post('/', (req, res) => {
  const userData = req.body;

  // logger.info("Register with data ", JSON.stringify(userData));

  let user = new User(userData);

  user.save((err, user) => {
    if(err){
      logger.error("Error in post user route. Error is %s", err.message);
      // Proper error handling in later version
      return res.send(err);
    }
    logger.info("User created");
    res.json(user);
  });
});

module.exports = router;