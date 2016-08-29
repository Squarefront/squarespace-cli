/**
 *
 * @public
 * @namespace account
 * @description Houses account utilities.
 *
 */
const Nightmare = require( "nightmare" );
const fetch = require( "node-fetch" );

require( "nightmare-iframe-manager" )(Nightmare);



/**
 * @method createSite
 * @memberof util.account
 * @description Creates a new Squarespace account.
 * @param {string} email The Squarespace email.
 * @param {string} password The Squarespace password.
 */
const createSite = function ( email, password ) {
  // Will eventually make this adjustable.
  const url = "https://base-template.squarespace.com";
  // const url = "https://oauth.squarespace.com/config/iframeSignup?xdm_e=https%3A%2F%2Fbase-template.squarespace.com&xdm_c=default1778&xdm_p=1";

  const nightmare = new Nightmare({
    // switch to true for debugging electron window
    show: false
  });

  let cookie = null;

  nightmare
    .goto( url )
    .wait( ".sqs-signup-pill-content" )
    .click( ".sqs-signup-pill-content" )

    // Squarespace loads an iframe oauth window
    // wait for iframe to load before attempting iframe entrance
    .wait( 3000 )
    .enterIFrame( ".signup-iframe iframe" )

    // the idea here was to enter the iframe, extract a window cookie
    // and return that back to the node context
    .evaluate( () => {
      const getCookie = function ( name ) {
        const value = `; ${document.cookie}`;
        const parts = value.split( `; ${name}=`);

        if (parts.length === 2) {
          return parts.pop().split(";").shift();
        }
      };

      cookie = getCookie( "crumb" );
      return getCookie( "crumb" );
    })
    .exitIFrame()
    .evaluate( ( templateUrl, crumb ) => {
      const signupWithEndpoint = function ( ) {
        const endpointUrl = `${templateUrl}/api/auth/SignupValidate?crumb=${crumb}`;
        const opts = {
          method: "POST",
        };
        const data = {
          email,
          password
        };

        const urlParameters = Object.keys(data)
            .map( (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[ key ])}`)
            .join("&")
            .replace(/%20/g, "+");

        return fetch( `${endpointUrl}?${urlParameters}`, opts ).then( ( res ) => {
          return res.json();
        }).then( ( res ) => {
          console.log( res );
          return res;
        });
      };

      signupWithEndpoint( cookie );
    }, url, cookie)

    .then( ( cookie ) => {
      console.log( cookie );
    })
    .catch( (error) => {
      console.error( "Search failed:", error);
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