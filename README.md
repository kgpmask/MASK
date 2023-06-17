# MASK
The website for the Manga & Anime Society Kharagpur

## Tech Stack

- VPS provider: OVH
- Backend reverse proxy for port-forwarding: NGINX
<!-- - Containerized deployments: Docker (we aren't using dockerized containers right now) -->
- Application language: Node.js
- App routing: Express.js
- Page templates: Nunjucks
- Page styling: SASS
- Database: MongoDB
- Database ORM: mongoose
- Linting: ESLint
- Testing suite: Mocha

---

## Running the Server

This server requires Node.js v16.0+ to run, and all tests are performed on v16. Please upgrade to Node v16 or higher if you haven't already done so.

There are multiple ways to run the server. The vast majority of the time, you will be running it in dev mode - the command for this is `npm run dev`. If you wish to run in regular mode, the command is `npm start`. Note that the server run in both cases will be identical - the only difference is that dev mode will automatically refresh changes made to the server code and/or pages, while regular mode will not. In addition, you can add flags to customize the operation of the server. These are:

- `dev` (d): An internal flag that does the same as `npm run dev`, except you lose access to nodemon. Just use `npm run dev` instead.
- <strike>`jsonuser` (t): Runs the server with the user details being defined in `/src/user.json`.</strike> **This is in progress.**
- `local` (l): Uses a local database (mongodb://127.0.0.1/mask) instead of the designated test database. Overwrites all other DB flags.
- `mongoless` (m): Runs the server without a database connection. All database-based pages cannot be loaded. This is a superset of the `userless` flag (ie; a `mongoless` server will also always be `userless`).
- `prod` (p): Connects directly to the production database. Do NOT use this flag lightly; it can break many, many things if you mess up and the testing database should serve your purposes. Cannot be used in conjuction with dev mode, for security reasons.
- `quiz` (q): Allows for infinite quiz attempts. Should be used with `dev`.
- `test` (t): Used to isolate the testing port and prevent interference with the running server.
- `userless` (u): Runs the server without a user connection/query. All user-based pages cannot be loaded. A planned feature is to have a dummy user with a modifiable JSON file, but as of now no user exists.

In order to start the server, you will require an `src/credentials.json` file - contact your WebDev Team Head for this file, and do NOT share it. The only exception to this is the mongoless flag - it is recommended to use `npm run dev mongoless` (or `npm run dm`) for any page that does not involve database-related stuff.

You may also override the database connection string for testing purposes, like so:

```bash
MONGO_TEST_URL="mongodb://4.20.69.420/mask" npm dev
```

Furthermore, for those with access to multiple sets of credentials (the three existing types are `admin`, `member`, and `github`), you can switch between sets of credentials by doing the following:

- Save each file in the `src` folder as `admin-credentials.json`, `member-credentials.json`, and/or `github-credentials.json` (whichever of these you have).
- These files will not be committed to the repository and are .gitignored, so you don't need to worry about accidentally uploading them.
- When booting up the server normally, it will attempt to refer to the default `credentials.json` file (should one exist), so copy whichever credentials file you use most often (usually admin).
- When you wish to test the server with a different set of credentials, use an environment variable titled `CREDS` and set it to the prefix of the credentials file you wish to access (eg; set it to `github` to use the `src/github-credentials.json` file).
- If you have terminal access (standard Linux terminal, VS Code terminal, Windows PowerShell), you can set environment variables by:
  - Linux/VS Code: `CREDS=github npm run dev`
  - Windows PowerShell: `$env:CREDS="github"; npm run dev`

Note (edited): You can now connect to the database even while on WiFi/LAN without a VPN. The domain name has been whitelisted. The IP address has NOT been whitelisted for direct http/https connections.

---

## Templates

Pages are located as .njk files in /templates. The following variables may be set:

- `pagetitle`: Title of the page (default MASK)
- `pagedesc`: Description of the page (default 'MASK website')
- `thispage`: URL of intended position of current page, used to select active page in NAVBAR (default none)
- `scripts`: Array of script links to be loaded (default none)

Additionally, the following blocks may be set:

- `pagecontent`: HTML contents of the page (default 'This is an empty page')
- `customcss`: Custom CSS (remember to enclose in \<style>) (default none)
- `customjs`: Custom JS (remember to enclose in \<script>) (default none)
- `navbar`: Sets the navbar (default NAVBAR)

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

---

## Routers
<!-- Note. This will be subject to change once the fs readdir router system is implemented. -->

The Express app's router is set up by `/src/route.js`. The file route.js imports routers from the `/routes` directory. Each router file has the following format:

```js
const express = require('express');
const router = express.Router();
// This router is used to configure the app for a specific route

// GET requests
app.get('/path', (req, res, next) => { 
	// some code
	return res.renderFile(template, ctx);
});

// POST requests
app.post('/path', (req, res, next) => { 
	// some code
	return res.status(statusCode).send;
});

/* 
Notes:
	The next argument is optional in most cases. 
	The functions in the requests can be asynchronous too.
	You can use other routers as well if needed.
*/

module.exports = router;
```

---

## Contributing

The owner of this repository is @PartMan7, who also runs the server. He's also running the server cost (at the time of writing he's in his final year, but it'll carry on even after graduation).

All non-trivial changes are done through PULL REQUESTS ONLY. The WebDev Team Head (currently @Goose-Of-War) is responsible for testing and merging all PRs. Feel free to pester them to look at the changes you've prepared.

To create a pull request, navigate to the `dev` branch (clicking on the GitHub client, or `git checkout dev` on the CLI) and create a new branch based on it (`New Branch` button (based on the `dev` branch, again!) on the GitHub client's branches page, or `git checkout -b [branch-name]` on the CLI). Pull requests will _never_ be merged directly to `main`; they will be first merged to `dev` and batches of changes and/or patches will be merged from `dev` to `main` alongside version increments.

To work on templates which require access to credentials using `dev userless` (`du`) mode, check out [this page](/TESTING.md) for some info.

Changes to the `dev` server are automatically deployed to [https://test.kgpmask.club]. This does not extend to environment configuration changes (eg: docker changes).

Ensure that pull requests pass tests (`npm test` for both lint and mocha tests).


## Guidelines

Tabs for indentation, basic JS style guidelines (check `./eslintrc.json` for the full list). If you have any questions, post 'em in the WebDev channel. If you aren't a member of the society but have queries/reports/suggestions, feel free to use the Issues / Discussions pages on the repository.


## Credits:

- <a href="https://github.com/PartMan7" target="_blank">Parth Mane</a> (Lead)<br />
- <a href="https://github.com/Goose-Of-War" target="_blank">Vidunram A R </a> (Contributor)<br />
- <a href="https://github.com/nishkalprakash" target="_blank">Nishkal Prakash</a> (Contributor) <br />
- <a href="https://github.com/MokshithPV" target="_blank">Venkatsai Mokshith</a> (Contributor)<br />
- <a href="https://github.com/SachdevJai" target="_blank">Jai Sachdev</a> (Contributor)<br />
- <a href="https://github.com/ItsAnkan" target="_blank">Ankan Saha</a> (Contributor)<br />
- <a href="https://github.com/Symbiot01" target="_blank">Sahil Patel</a> (Contributor)<br />
- <a href="https://github.com/KarmaAkaB" target="_blank">Soumil Maiti</a> (Contributor)<br />
- <a href="https://github.com/anjaniit23" target="_blank">Anjani Kumar</a> (Contributor)<br />
- <a href="https://github.com/lurkingryuu" target="_blank">Karthikeya Y M</a> (Contributor)<br />
- <a href="https://github.com/Yureien" target="_blank">Soham Sen</a> (Contributor)<br />
- <a href="https://github.com/ayush4ise" target="_blank">Ayush Parmar</a> (Contributor)<br />
- <a href="https://github.com/Pagol1" target="_blank">Saumyadip Nandy</a> (Contributor)<br />
- <a href="https://github.com/shiroyasha263" target="_blank">Vishesh Gupta</a> (Contributor)<br />
