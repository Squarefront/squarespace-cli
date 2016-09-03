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
# export a page in JSON
sqs export https://blog.squarespace.com

# export a page in HTML
sqs export https://blog.squarespace.com -f html

# export a page in JSON with filename foo.json
sqs export https://blog.squarespace.com --filename foo.json
```

#### Export Sitemap
Export your sitemap in various formats..


```shell
# export full sitemap in xml
sqs export-sitemap https://blog.squarespace.com

# export ful sitemap in json
sqs export-sitemap https://blog.squarespace.com -f json

# export sitemap urls in plain text
sqs export-sitemap https://blog.squarespace.com -f text
```

#### Create a Squarespace Website
Create a new [Base Template](https://base-template.squarespace.com) website.

This is a work in progress. I'm having issues with the cookie crumb authentication.

```shell
# create a new base template website
sqs create-site
```

### Authentication and Credential Storage
The CLI will prompt for your Squarespace credentials depending on your command. The CLI stores your credentials in your operating system's local keychain via [node-keytar](https://github.com/atom/node-keytar) and uses them to perform authenticated requests to Squarespace's API endpoints.

#### Save Credentials During an Authenticated Request
Using flag `--save` during a command that requires authentication will trigger credential storage.

#### Delete Stored Credentials
To remove stored credentials, simply run the following command.

```shell
# delete stored credentials
delete-credentials
```


## Roadmap
* Bulk export.
* Parse sitemap. Chain to export.
* Get site info.
* Improved logging.
* Lots of other cool stuff :)

### Support
I'm largely using ES6/ES7, so this project may not work on older versions of Node.js. 6.0+ ftw :-D.