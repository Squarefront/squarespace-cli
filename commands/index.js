/**
 *
 * @public
 * @namespace commands
 * @description Holds utilities.
 *
 */
const authentication = require( "./authentication" );
const createSite = require( "./create-site" );
const exportPage = require( "./export" );
const sitemap = require( "./sitemap" );


module.exports = {
  authentication,
  "create-site": createSite.createSite,
  "delete-credentials": authentication.deleteStoredAccounts,
  "export": exportPage.exportPage,
  "export-sitemap": sitemap.exportSitemap
};