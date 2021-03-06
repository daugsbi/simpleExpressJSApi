const router = require('express').Router();
const logger = require('winston');
const Contract = require('../model/Contract');

/**
 * List all corresponding insurance contracts from logged in user
 */
router.get('/', (req, res) => {
  const user = req.user;
  Contract.find({user: user._id}, function(err, users){
    if (err) return res.send(err);
    if (!users) return res.json([]);
    res.json(users);
  })
});

/**
 * Create an insurance contract
 */
router.post('/', (req, res) => {
  const data = req.body;
  let contract = new Contract(data);
  contract.user = req.user.id;

  contract.save((err, contract) => {
      if(err){
        logger.log("Error in post contract route. Error is %s", err.message);
        // Proper error handling in later version
        return res.status(400).send("Could not save contract, error message is "+err.message);
      }
      res.status(201).send(contract);
  });
});

/**
 * Update an insurance contract
 */
router.put('/:id', (req, res) => {
  const {title, company, price} = req.body;
  const id = req.params.id;
  Contract.findById(id, function(err, contract) {

    if(err || !contract) return res.status(404).send("Contract not found");

    // only update owned contracts
    if( contract.user !== req.user.id) return res.status(401).send("Unauthorized");

    logger.info("Contract to update is " + JSON.stringify(contract));

    if(title) contract.title = title;
    if(company) contract.company = company;
    if(price) contract.price = price;

    contract.save((err, contract) => {
      if(err) return res.send(err);
      res.status(200).send(contract);
    });
  });

});

/**
 * Delete an insurance contract
 */
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Contract.findById(id, (err, contract) => {
    if(err) return res.status(400).send(err);
    if(!contract) return res.status(404).send();

    // Check if the logged in user has created the contract
    if(contract.user !== req.user.id) return res.status(401).send();

    contract.remove( (err) => {
      if(err) return res.status(400).send(err);
      res.status(200).send({});
    })

  });

});

module.exports = router;