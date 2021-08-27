# MASK
The website for the Manga and Anime Society Kharagpur

## Contributing
Anyone can make a pull request. PRs will not be merged if they fail the workflows.

At the moment, @PartMan7 is the sole maintainer of this repo (and thus the only person who can merge pull requests), since the code is hosted live on his server. From next year this'll change.
^ This was intended but he screwed up, but still please make pull requests for non-trivial changes!


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