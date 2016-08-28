/**
 *
 * @public
 * @namespace log
 * @description Normalized logger.
 *
 */
const chalk = require( "chalk" );


/**
 * @method log
 * @memberof util.logger
 * @description Logs some stuff.
 */
const log = function ( ) {
  console.log( chalk.red( "Stub" ) );
};



/******************************************************************************
 * @Export
*******************************************************************************/
module.exports = {
  log
};