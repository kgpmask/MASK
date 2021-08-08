# MASK
The website for the Manga and Anime Society Kharagpur

## Contributing
Anyone can make a pull request. PRs will be merged if they pass the workflows.

At the moment, @PartMan7 is the sole maintainer of this repo (and thus the only person who can merge pull requests), since the code is hosted live on his server. From next year this'll change.


## Guidelines

Tabs for indentation, basic JS style guidelines. If you have any questions, post 'em in the WebDev channel.


## Code

We'll be using nunjucks for rendering pages.

NGINX has been used for server-side traffic direction and pointing.

Serving is done via express.


## Templates

Pages are located as .njk files in /templates. The following variables may be set:

* `pagetitle`: Title of the page (default MASK)
* `pagecontent`: HTML contents of the page (default 'This is an empty page')
* `thispage`: URL of intended position of current page, used to select active page in NAVBAR (default none)

* `scripts`: Array of script links to be loaded (default none)
* `customcss`: Custom CSS; style tags are already applied (default none)
* `customjs`: Custom JS; script tags are already applied (default none)
* `navbar`: Sets the navbar (default NAVBAR)