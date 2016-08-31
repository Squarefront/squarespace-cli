/**
 *
 * @public
 * @namespace commands.export
 * @description Houses export utilities.
 *
 */
const chalk = require( "chalk" );
const fetch = require( "node-fetch" );
const fs = require( "fs" );
const jsonfile = require( "jsonfile" );
const validUrl = require( "valid-url" );


/**
 * @method exportPage
 * @memberof commands
 * @description Export a Squarespace collection.
 * @param {object} client The CLI client.
 * @returns {Promise} Export response Promise.
 */
const exportPage = function ( client ) {
  console.log(client);

  if ( validUrl.isUri( client.arguments.primaryArg ) ) {

    // const params = null;
    const date = new Date();
    const data = extendObject(
      {
        nocache: true
      }
    );
    const dataFormat = client.cli.format || "json";
    const fileFormat = dataFormat === "json" ? ".json" : ".html";
    const fileName = client.cli.filename || `sqsp_cli_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}${fileFormat}`;
    // const url = `${client.cli.url}`;
    const opts = {
      method: "GET",
      headers: { }
    };

    if ( dataFormat === "json" ) {
      data.format = dataFormat;
    }

    const urlParameters = Object.keys(data)
      .map( (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[ key ])}`)
      .join("&")
      .replace(/%20/g, "+");

    return fetch( `${client.arguments.primaryArg}?${urlParameters}`, opts ).then( ( res ) => {
      return dataFormat === "json" ? res.json() : res.text();
    }).then( ( res ) => {
      const file = fileName;

      if ( dataFormat === "json" ) {
        jsonfile.writeFile(file, res, { spaces: 2 }, ( err ) => {
          console.log( err );
        });
      } else {
        fs.writeFile(file, res, { spaces: 2 }, ( err ) => {
          console.log( err );
        });
      }
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
 * @method extendObject
 * @memberof commands.export
 * @param {object} target The target object/array
 * @param {object} arrow The incoming object/array
 * @description Merge or clone objects and arrays
 * @returns {object}
 *
 */
const extendObject = function (target, arrow) {
  let i = null;
  const ret = target;

  // Merge Arrays
  if (Array.isArray(arrow)) {
    i = arrow.length;

    for (i; i--;) {
      ret[ i ] = arrow[ i ];
    }

  // Merge Objects
  } else {
    for (i in arrow) {
      if (arrow.hasOwnProperty(i)) {
        ret[ i ] = arrow[ i ];
      }
    }
  }

  return ret;
};



/******************************************************************************
 * @Export
*******************************************************************************/
module.exports = {
  exportPage
};