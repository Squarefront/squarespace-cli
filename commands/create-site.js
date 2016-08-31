/**
 *
 * @public
 * @namespace commands.create-site
 * @description Houses site creation utilities.
 *
 */
const chalk = require( "chalk" );
const fetch = require( "node-fetch" );
const Nightmare = require( "nightmare" );

require( "nightmare-iframe-manager" )(Nightmare);


const apiEndpoint = "/api/auth/";


/**
 * @method createSite
 * @memberof util.account
 * @description Creates a new Squarespace account.
 * @param {object} client The CLI client object.
 */
const createSite = function ( client ) {
  let userCredentials = null;
  let templateUrlId = null;
  let cookie = null;

  templateUrlId = "base-template";

  const sqsApiEndpointTemplate = `https://${templateUrlId}.squarespace.com/api`;
  // const sqsoAuthurl = "https://oauth.squarespace.com/config/iframeSignup?xdm_e=https%3A%2F%2Fbase-template.squarespace.com&xdm_c=default1778&xdm_p=1";

  client.commands.authentication.getCredentials( client )
  .then( ( credentials ) => {
    userCredentials = credentials;
  }).then( () => {
    const nightmare = new Nightmare({
      // switch to true for debugging electron window
      show: false
    });

    nightmare
      .goto( sqsApiEndpointTemplate )
      .wait( ".sqs-signup-pill-content" )
      .click( ".sqs-signup-pill-content" )

      // Squarespace loads an iframe oauth window
      // wait for iframe to load before attempting iframe entrance
      .wait( 3000 )
      // .enterIFrame( ".signup-iframe iframe" )

      // the idea here was to enter the iframe, extract a window cookie
      // and return that back to the node context
      .evaluate( ( ) => {
        const getCookie = function ( name ) {
          const value = `; ${document.cookie}`;
          const parts = value.split( `; ${name}=`);

          if (parts.length === 2) {
            return parts.pop().split(";").shift();
          }
        };

        cookie = getCookie( "crumb" );

        return getCookie( "crumb" );
      }, sqsApiEndpointTemplate )
      .then( ( returnedCookie ) => {
        cookie = returnedCookie;

        const signupWithEndpoint = function ( ) {
          const endpointKey = `${sqsApiEndpointTemplate}/auth/SignupKey`;
          const endpointValidate = `${sqsApiEndpointTemplate}/auth/SignupValidate`;
          const endpointQueue = `${sqsApiEndpointTemplate}/auth/QueueSignup`;
          const opts = {
            method: "POST",
          };
          const data = {
            crumb: `${returnedCookie}`,
            email: userCredentials.username,
            password: userCredentials.password
          };
          const urlParameters = Object.keys(data)
              .map( (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[ key ])}`)
              .join("&")
              .replace(/%20/g, "+");

          console.log( chalk.bold.yellow( "Status" ), `Attempting to register a new Squarespace ${templateUrlId} website on account ${userCredentials.username}.
          `);
          console.log( `Registration endpoint: ${endpointValidate}` );

          return fetch( `${endpointKey}?crumb=${returnedCookie}`, opts )
          .then( () => {
            return fetch( `${endpointValidate}?${urlParameters}`, opts );
          })
          .then( () => {
            return fetch( `${endpointQueue}?${urlParameters}`, opts );
          })
          .then( ( res ) => {
            return res.json();
          })
          .then( ( res ) => {
            console.log( res );
            return res;
          }).then( () => {
            process.exit();
          });
        };

        signupWithEndpoint();
      })
      .catch( (error) => {
        console.error( error );
      });
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
  createSite
};