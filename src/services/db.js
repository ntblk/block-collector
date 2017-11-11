// Example - Create service on server with postgres database

const Sequelize = require('sequelize');
const path = require('path');

const feathers = require('feathers');
const service = require('feathers-sequelize');

/*
function services() {
  this.use('/reports', service({ Model: userModel() }));
}
*/

// TODO: Move this db.js back to index.js


function databaseConnect() {
  const sequelize = new Sequelize('postgres://postgres:@localhost:5432/blocks', {
    dialect: 'postgres',
    logging: false
  });
  return sequelize;
  // app isn't defined at that moment
  //app.set('sequelize', sequelize);
}

function userModel() {
  // app isn't defined at that moment
  //const sequelize = app.get('sequelize');
  const sequelize = databaseConnect();

  const tableSchema = sequelize.define('reports', {
      //email: { type: Sequelize.STRING, allowNull: false, unique: true },
      reporterIP: { type: Sequelize.STRING, validate: {isIP: true}, allowNull: true },

      date: { type: Sequelize.DATE, allowNull: false },
      creator: { type: Sequelize.STRING, allowNull: true },
      version: { type: Sequelize.STRING, allowNull: true },
      reporter: { type: Sequelize.STRING, allowNull: true },
      clientIP: { type: Sequelize.STRING, validate: {isIP: true}, allowNull: true },
      url: { type: Sequelize.STRING, validate: {isUrl: true}, allowNull: false },
      status: { type: Sequelize.INTEGER, allowNull: true },
      statusText: { type: Sequelize.STRING, allowNull: true },
      blockedBy: { type: Sequelize.STRING, allowNull: true },
    },
    { freezeTableName: true });

  tableSchema.sync();

  return tableSchema;
}

//databaseConnect();

module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars

  this.use('/report', service({ Model: userModel() }));
};
