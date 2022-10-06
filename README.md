# MASK
The website for the Manga and Anime Society Kharagpur

## Contributing

The owner of this repository is @PartMan7, who also runs the server. He's also running the server cost (at the time of writing he's in his final year, but it'll carry on even after graduation).

All non-trivial changes are done through PULL REQUESTS ONLY. The WebDev Team Head is responsible for testing and merging all PRs. Feel free to pester them to look at the changes you've prepared.

A webhook-based pull system will be implemented eventually.

Ensure that pull requests pass tests (`npm test` for both lint and mocha tests).


## Running the Server

This server requires Node.js v14.0+ to run, and all tests are performed on v14. Please upgrade to Node v14 or higher if you haven't already done so.

There are multiple ways to run the server. The vast majority of the time, you will be running it in dev mode - the command for this is `npm run dev`. If you wish to run in regular mode, the command is `npm start`. Note that the server run in both cases will be identical - the only difference is that dev mode will automatically refresh changes made to the server code and/or pages, while regular mode will not. In addition, you can add flags to customize the operation of the server. These are: 

* `dev` (d): An internal flag that does the same as `npm run dev`, except you lose access to nodemon. Just use `npm run dev` instead.
* `local` (l): Uses a local database (mongodb://127.0.0.1/mask) instead of the designated test database. Overwrites all other DB flags.
* `prod` (p): Connects directly to the production database. Do NOT use this flag lightly; it can break many, many things if you mess up and the testing database should serve your purposes. Cannot be used in conjuction with dev mode, for security reasons.
* `userless` (u): Runs the server without a database connection. All user-based pages cannot be loaded. A planned feature is to have a dummy user with a modifiable JSON file, but as of now no user exists.


In order to start the server, you will require a credentials.json file - contact your WebDev Team Head for this file, and do NOT share it. The only exception to this is the userless flag - it is recommended to use `npm run dev userless` (or `npm run du`) for any page that does not involve a logged-in user.

Note: Since the college firewall is batshit terrible, you will NOT be able to connect to a remote MongoDB server for user-based testing while on campus. In this case, you will have to leverage either the planned user file, a local MongoDB server, or a VPN that allows you access.


## Guidelines

Tabs for indentation, basic JS style guidelines. If you have any questions, post 'em in the WebDev channel.


## Code

We'll be using nunjucks for rendering pages.
NGINX has been used for server-side traffic direction and pointing.
Serving is done via express.
Mocha is used for testing, and ESLint for linting JS.
SASS is used for CSS, too.


## Templates

Pages are located as .njk files in /templates. The following variables may be set:

* `pagetitle`: Title of the page (default MASK)
* `pagedesc`: Description of the page (default 'MASK website')
* `thispage`: URL of intended position of current page, used to select active page in NAVBAR (default none)
* `scripts`: Array of script links to be loaded (default none)


Additionally, the following blocks may be set:

* `pagecontent`: HTML contents of the page (default 'This is an empty page')
* `customcss`: Custom CSS (remember to enclose in \<style>) (default none)
* `customjs`: Custom JS (remember to enclose in \<script>) (default none)
* `navbar`: Sets the navbar (default NAVBAR)


The default page template is:

```nunjucks
{% extends "_base.njk" %}

{% set thispage = 'navref' %}
{% set pagetitle = 'TITLEHERE' %}

{% block pagecontent %}
	Page content
{% endblock %}

```

The default newsletter template is:

```nunjucks
{% extends "_newsletter.njk" %}

{% set pagetitle = 'Month - Issue num' %}
{% set pagecount = number_of_pages %}

{% block article %}
	Article goes here
{% endblock %}

{% block letterjs %}<script></script>{% endblock %}
{% block lettercss %}<style></style>{% endblock %}

```

Take a look at existing articles for the various classes and where they're used.


Credits:

<a href="https://github.com/PartMan7" target="_blank">Parth Mane</a> (Lead)  <br />
<a href="https://github.com/anjaniit23" target="_blank">Anjani Kumar</a> (Contributor)  <br />
<a href="https://github.com/Goose-Of-War" target="_blank">Vidunram A R </a> (Contributor)  <br />
<a href="https://github.com/mokshith25" target="_blank">Venkatsai Mokshith</a> (Contributor)  <br />
<a href="https://github.com/lurkingryuu" target="_blank">Karthikeya Y M</a> (Contributor)  <br />
<a href="https://github.com/Yureien" target="_blank">Soham Sen</a> (Contributor)  <br />
<a href="https://github.com/Pagol1" target="_blank">Saumyadeep Nandy</a> (Contributor)  <br />
<a href="https://github.com/shiroyasha263" target="_blank">Vishesh Gupta</a> (Contributor)  <br />
