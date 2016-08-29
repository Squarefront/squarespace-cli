#!/usr/bin/env node

const co = require( "co" );
const prompt = require( "co-prompt" );
const program = require( "commander" );

const util = require( "./util");

let clientMethod = null;
let domain = null;
let format = null;
let filename = null;


/**
 * @method squarespace
 * @description Executes the Squarespace CLI.
 * @param {string} email The Squarespace email address.
 * @param {string} password The Squarespace password.
 */
const execClient = function ( email, password ) {
  const methodMap = {
    create: util.account.createSite.bind(null, email, password),
    export: util.data.exportPage.bind(null, domain, format, filename)
  };

  methodMap[ clientMethod ]();
};

program
  .arguments( "<method>" )
  .option( "-p, --page <url>", "A domain name url." )
  .option( "-f, --format <format>", "The data format (json or html)." )
  .option( "-fn, --filename <filename>", "The file name." )
  .option( "-e, --email <email>", "Your Squarespace email address." )
  .option( "-p, --password <password>", "Your Squarespace password." )
  .action( ( method ) => {
    clientMethod = method;

    domain = program.page;
    format = program.format;
    filename = program.filename;

    if ( method === "create" ) {
      co( function* () {
        const username = yield prompt( "username: " );
        const password = yield prompt.password( "password: ");

        execClient( username, password );
      });
    } else {
      execClient();
    }
  })
  .parse( process.argv );