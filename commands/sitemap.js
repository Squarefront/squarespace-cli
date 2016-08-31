/**
 *
 * @public
 * @namespace commands.sitemap
 * @description Houses sitemap utilities.
 *
 */
const chalk = require( "chalk" );
const fs = require( "fs" );
const fetch = require( "node-fetch" );
const validUrl = require( "valid-url" );


/**
 * @public
 * @method exportPage
 * @memberof commands
 * @description Export a Squarespace collection.
 * @param {object} client The CLI client.
 * @returns {Promise} Account list promise.
 */
const exportSitemap = function ( client ) {

  if ( validUrl.isUri( client.arguments.primaryArg ) ) {

    const date = new Date();
    const sitemapPath = "sitemap.xml";
    const fileName = client.cli.filename || `sqsp_cli_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}${sitemapPath}`;
    const opts = {
      method: "GET",
      headers: { }
    };

    console.log( `${removeSlashes( client.arguments.primaryArg )}/${sitemapPath}` );

    return fetch( `${removeSlashes( client.arguments.primaryArg )}/${sitemapPath}` ).then( ( res ) => {
      return res.text();
    }).then( ( res ) => {
      const file = fileName;

      fs.writeFile(file, res, { spaces: 2 }, ( err ) => {
        console.log( err );
      });
      console.log( res );
      return res;
    }).catch( ( err ) => {
      console.log( chalk.bold.red( "Error" ), chalk.bold( "export" ), `failed to export, check your url to confirm it looks OK.
      ` );
      console.log( chalk.bold.red( "Response" ), `${err.name} ${err.message}` );
    });

  } else {
    console.log( chalk.bold.red( "Error" ), chalk.bold( "export" ), "requires a valid url to work. Use sqs -h to more info." );
  }

};


/**
 *
 * @private
 * @method removeSlashes
 * @memberof commands.sitemap
 * @param {string} str The URL string.
 * @description Strips off leading/trailing slashes on a URL.
 * @returns {string}
 *
 */
const removeSlashes = function ( str ) {
    return str.replace(/^\/|\/$/g, "");
};



/******************************************************************************
 * @Export
*******************************************************************************/
module.exports = {
  exportSitemap
};