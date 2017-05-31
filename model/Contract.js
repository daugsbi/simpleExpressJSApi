'strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Represents an insurance contract of an user issued by an insurance company
 * @type Schema of Contract
 */
let ContractSchema = new Schema({
  /* title of the insurance contract */
  title: { type: String },
  /* name of the insurance company */
  company: { type: String },
  /* yearly price */
  price: { type: Number },
  user: { type: String, required: true }
});

// Export to use
const Contract = mongoose.model('Contract', ContractSchema);

module.exports = Contract;