const NeDB = require('nedb');
const path = require('path');
const service = require('feathers-nedb');

function userModel() {
  return new NeDB({
    filename: path.join('examples', 'step', 'data', 'users.db'),
    autoload: true
  });
}

module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars

  this.use('/report', service({ Model: userModel() }));
};
