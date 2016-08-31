Squarespace CLI
=======
> **Note: This project is a WIP.**

> A node CLI client for working with Squarespace



## Project Overview
This project aims to provide some awesome Squarespace functionality from the command line.


### Setup
```shell
npm i -g squarespace-cli

sqs -h
```

### Usage

#### Export Content
Export a Squarespace page.

Bulk exporting is on the way.

The CLI will export to your current working path. Run `pwd` in terminal to see your working directory.

```shell
# export a page in HTML
sqs export https://blog.squarespace.com

# export a page in JSON
sqs export https://blog.squarespace.com -f json

# export a page in JSON with filename foo.json
sqs export https://blog.squarespace.com -f json --filename foo.json
```

#### Export Sitemap
Export your sitemap.xml file.

Sitemap parsing is on the way.

```shell
# export sitemap
sqs export-sitemap https://blog.squarespace.com
```

#### Create a Squarespace Website
Create a new [Base Template](https://base-template.squarespace.com) website.

This is a work in progress. I'm having issues with the cookie crumb authentication. The CLI will prompt for credentials. Your credentials are not stored and are used to POST to the Squarespace signup endpoint.

```shell
# create a new base template website
sqs create-site
```


## Roadmap
* Bulk export.
* Parse sitemap. Chain to export.
* Get site info.
* Improved logging.
* Lots of other cool stuff :)

### Support
I'm largely using ES6/ES7, so this project may not work on older versions of Node.js. 6.0+ ftw :-D.