/**
 *
 * @public
 * @namespace data
 * @description Houses data utilities.
 *
 */
const chalk = require( "chalk" );
const fetch = require( "node-fetch" );
const jsonfile = require( "jsonfile" );


/**
 * @method exportPage
 * @memberof util.data
 * @description Get account details of a user.
 * @param {string} domain The API url.
 * @param {string} format The user's access token.
 * @param {string} filename Optional file name.
 * @param {string} params Optional request parameters.
 * @returns {Promise} Account list promise.
 */
const exportPage = function ( domain, format, filename, params ) {
  console.log( chalk.yellow( "Exporting page...") );
  console.log( filename );
  const date = new Date();

  const data = extendObject(
    {
      nocache: true
    },
    params
  );
  const dataFormat = format;
  const fileFormat = dataFormat === "json" ? ".json" : ".html";
  const fileName = filename || `sqsp_cli_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}${fileFormat}`;
  const url = `${domain}`;
  const opts = {
    method: "GET",
    headers: {
    }
  };

  if ( dataFormat === "json" ) {
    data.format = dataFormat;
  }

  const urlParameters = Object.keys(data)
    .map( (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[ key ])}`)
    .join("&")
    .replace(/%20/g, "+");

  return fetch( `${url}?${urlParameters}`, opts ).then( ( res ) => {
    return dataFormat === "json" ? res.json() : res.text();
  }).then( ( res ) => {
    const file = fileName;

    jsonfile.writeFile(file, res, { spaces: 2 }, ( err ) => {
      console.log( err );
    });
    console.log( res );
    return res;
  }).catch( ( err ) => {
    console.log( err );
  });
};


/**
 *
 * @private
 * @method extendObject
 * @memberof util
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
  // This is really just used as a `cloning` mechanism
  if (Array.isArray(arrow)) {
    i = arrow.length;

    for (i; i--;) {
      ret[ i ] = arrow[ i ];
    }

      // Merge Objects
      // This could `clone` as well, but is better for merging 2 objects
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