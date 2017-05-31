const router = require('express').Router();
const Contract = require('../model/Contract');

/**
 * List all corresponding insurance contracts from logged in user
 */
router.get('/', (req, res) => {
  res.send();
});

/**
 * Create an insurance contract
 */
router.post('/', (req, res) => {
  const data = req.body;
  let contract = new Contract(data);

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
  res.send();
});

/**
 * Delete an insurance contract
 */
router.delete('/:id', (req, res) => {
  res.send();
});

module.exports = router;