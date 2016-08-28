#!/usr/bin/env node

const program = require( "commander" );

const util = require( "./util");

let clientMethod = null;
let domain = null;
let format = null;
let filename = null;


/**
 * @method squarespace
 * @description Executes the Squarespace CLI.
 */
const execClient = function ( ) {
  const methodMap = {
    export: util.data.exportPage.bind(null, domain, format, filename)
  };

  methodMap[ clientMethod ]();
};

program
  .arguments( "<method>" )
  .option( "-p, --page <url>", "A domain name url." )
  .option( "-f, --format <format>", "The data format (json or html)." )
  .option( "-fn, --filename <filename>", "The file name." )
  .action( ( method ) => {
    clientMethod = method;

    domain = program.page;
    format = program.format;
    filename = program.filename;

    execClient( );
  })
  .parse( process.argv );