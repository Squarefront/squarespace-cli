/**
 *
 * @public
 * @namespace authentication
 * @description Houses account and authentication methods.
 *
 */
const co = require( "co" );
const prompt = require( "co-prompt" );
const keytar = require( "keytar" );
const fetch = require( "node-fetch" );


const storedAccountNamespace = "squarespace-cli-email";
const storedPasswordNamespace = "squarespace-cli-password";


/**
 * @private
 * @method userPrompt
 * @memberof rest.authentication
 * @description Get account details of a user.
 * @param {object} client The commander client object.
 * @returns {Promise} The user prompt promise.
 */
const userPrompt = function ( client ) {
  return new Promise( ( resolve, reject ) => {
    const userCredentials = {};

    if ( keytar.findPassword( storedAccountNamespace ) && keytar.findPassword( storedPasswordNamespace ) ) {
      userCredentials.username = keytar.findPassword( storedAccountNamespace );
      userCredentials.password = keytar.findPassword( storedPasswordNamespace );

      resolve( userCredentials );
    } else {
      co( function* () {
        userCredentials.username = yield prompt( "username: " );
        userCredentials.password = yield prompt.password( "password: ");

        if ( client.cli.save ) {
          keytar.addPassword( storedAccountNamespace, storedAccountNamespace, userCredentials.username );
          keytar.addPassword( storedPasswordNamespace, storedPasswordNamespace, userCredentials.password );
          console.log( "Username and password saved." );
        }

        resolve( userCredentials );
      });
    }
    // Needs user prompt error handling.
  });
};


/**
 * @public
 * @method userPrompt
 * @memberof rest.authentication
 * @description Delete all locally stored account credentials.
 * @param {object} client The commander client object.
 */
const deleteStoredAccounts = function ( ) {
  keytar.deletePassword( storedAccountNamespace, storedAccountNamespace );
  keytar.deletePassword( storedPasswordNamespace, storedPasswordNamespace );

  console.log( "Deleted all stored accounts." );
  process.exit();
};


/**
 * @public
 * @method getNewAuthToken
 * @memberof rest.authentication
 * @description Get new session crumb token from Squarespace.
 * @param {object} client The commander client object.
 * @returns {Promise} Access token promise.
 */
const getNewSessionCrumb = function ( client ) {
  return new Promise( ( resolve, reject ) => {
    let userCredentials = null;

    userPrompt( client )
    .then( ( credentials ) => {
      userCredentials = credentials;

      const url = `https://squarespace/${client.apiUrlRest}/v1/authorization/token?grant_type=password&username=${userCredentials.username}&password=${userCredentials.password}`;
      const opts = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };
      return fetch( url, opts ).then( ( res ) => {
        return res.json();
      }).then( ( res ) => {
        resolve( res.accessToken );
      }).catch( ( err ) => {
        reject( err );
      });
    });
  });
};


/**
 * @public
 * @method getNewAuthToken
 * @memberof rest.authentication
 * @description Get new session crumb token from Squarespace.
 * @param {object} client The CLI client object.
 * @returns {Promise} Access token promise.
 */
const getCredentials = function ( client ) {
  return new Promise( ( resolve, reject ) => {
    let userCredentials = null;

    userPrompt( client )
    .then( ( credentials ) => {
      userCredentials = credentials;
      return userCredentials;
    }).then( ( res ) => {
      resolve( res );
    }).catch( ( err ) => {
      reject( err );
    });

  });
};



/******************************************************************************
 * @Export
*******************************************************************************/
module.exports = {
  deleteStoredAccounts,
  getCredentials,
  getNewSessionCrumb
};