/**
 *
 * @public
 * @namespace commands
 * @description Holds utilities.
 *
 */
const exportPage = require( "./export" );
const sitemap = require( "./sitemap" );


module.exports = {
  "export": exportPage.exportPage,
  "export-sitemap": sitemap.exportSitemap
};