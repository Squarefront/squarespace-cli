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
const jsonfile = require( "jsonfile" );
const validUrl = require( "valid-url" );
const xml2js = require( "xml2js" );


/**
 * @public
 * @method exportPage
 * @memberof commands
 * @description Export a Squarespace collection.
 * @param {object} client The CLI client.
 */
const exportSitemap = function ( client ) {
  if ( validUrl.isUri( client.arguments.primaryArg ) ) {
    const date = new Date();
    const sitemapPath = "sitemap";
    const sitemapPathFull = "sitemap.xml";
    const fileExtMap = {
      json: ".json",
      text: ".txt",
      xml: ".xml"
    };
    const dataFormat = client.cli.format || "xml";
    const fileFormat = client.cli.format ? fileExtMap[ client.cli.format ] : ".xml";
    const fileName = client.cli.filename || `sqsp_cli_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}_${sitemapPath}${fileFormat}`;
    // const url = `${client.cli.url}`;

    const opts = {
      method: "GET",
      headers: { }
    };

    console.log( chalk.bold.yellow( "\nStatus" ), `Attempting to fetch sitemap for ${client.arguments.primaryArg}.
    `);

    fetch( `${removeSlashes( client.arguments.primaryArg )}/${sitemapPathFull}`, opts ).then( ( res ) => {
      return res.text();
    }).then( ( res ) => {
      const file = fileName;
      const parser = new xml2js.Parser();

      if ( dataFormat === "xml" ) {
        fs.writeFile(file, res, {
          spaces: 2
        }, ( err ) => {
          if ( err ) {
            console.log( err );
          }
        });
      }

      if ( dataFormat === "json" ) {
        parser.parseString( res, (err, result) => {
          const json = JSON.stringify( result, null, "\t" );

          fs.writeFile(file, json, { spaces: 2 }, ( err ) => {
            if ( err ) {
              console.log( err );
            }
          });
        });
      }

      if ( dataFormat === "text" ) {
        parser.parseString( res, (err, result) => {
          result.urlset.url.forEach( ( url ) => {
            const urlWithBreak = `${url.loc}\n`;

            fs.appendFile(file, urlWithBreak, ( err ) => {
              if ( err ) {
                console.log( err );
              }
            });
          });
        });
      }

    }).then( () => {
      console.log( chalk.bold.green( "Success" ), `Successfully exported sitemap for ${client.arguments.primaryArg}.
    `);
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