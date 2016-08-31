#!/usr/bin/env node


const chalk = require( "chalk" );
const pkg = require( "./package.json" );
const program = require( "commander" );


const sqsApiEndpoint = "https://squarespace.com/api";
const client = {};

client.cli = program;
client.commands = require( "./commands" );
client.apiEndpoints = {};
client.apiEndpoints.squarespace = sqsApiEndpoint;

program.version( `Squarespace CLI ${pkg.version}` );
program.usage( "[options] [command]" );

program.command( "create-site [options]" ).description( "(In dev) Create a new Base Template website.." );
program.command( "export <url> [options]" ).description( "Export a Squarespace collection." );
program.command( "export-sitemap <url> [options]" ).description( "Export your website's sitemap." );

program.option( "-f, --format <format>", "Optional formats to export to." );
program.option( "-fn, --filename <filename>", "Optional filename to save to." );
program.option( "-save, --save", "Save credentials?" );

program.action( ( cmd, primary, secondary ) => {
  client.arguments = {
    primaryArg: primary,
    secondaryArg: secondary
  };

  if ( cmd in client.commands ) {
    client.commands[ cmd ]( client );
  } else {
    console.log( chalk.bold.red( "Error" ), chalk.bold( cmd ), "is not an Squarespace CLI command" );
  }
});

program.parse( process.argv );

module.exports = client;