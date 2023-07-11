# Information Regarding Creating Pages Which Has Forms

We are using many pages with forms, to make them uniform



## How to use `_form.njk`

Forms follow the default page template, with a little modification

```jinja
{% extends '_base.njk' %}
{% import '_form.njk' as forms %}

{% set scripts = ['https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'] %}

{% block pagecontent %}
	{% call forms.form() %}
		<!-- Form Content -->
	{% endcall %}
{% endblock %}

{% block customcss %}
	{{ forms.formCss() }}
	<style>
		<!-- Extra Styles -->
	</style>
{% endblock %}

{% block customjs %}
	{{ forms.formFunction() }}
	<script>
		axios.defaults.withCredentials = true;
		axios.defaults.headers.common['X-CSRF-TOKEN'] = '{{ csrfToken }}';

		window.onload = () => {
			if (!axios.defaults.headers.common['X-CSRF-TOKEN']) axios.defaults.headers.common['X-CSRF-TOKEN'] = document.cookie.split('=')[1];
		}
		<!-- Other Functions  -->
	</script>
{% endblock %}
```

Additionally the following variables may be set:

- `pagetitle`: Title of the page (default MASK)
- `pagedesc`: Description of the page (default 'MASK website')
- `thispage`: URL of intended position of current page, used to select active page in NAVBAR (default none)

## Function/Macro Documentation

The following functions/macros are exported from `_form.njk`

- `form(*formheading)` - The main form body, this needs to be executed in a call block. `formheading` is optional.
- `heading(h, label)` - Used to put a heading/divider between items. The arguments are:
  - `h` - Heading level (eg, h1, h2, h3).
  - `label` - Heading text.
- `field(id, label, *value)` - Text input field. The arguments are:
  - `id` - ID of the input tag.
  - `label` - Text to display above input tag.
  - `value` - Optional, used to give a predefined value to input field.
- `datetime(id, label, value)` - Datetime input field. The arguments are:
  - `id` - ID of the input tag.
  - `label` - Text to display above input tag.
  - `value` - Used to give a predefined value to input field.
- `radio(id, label, options)` or `checkbox(id, label, options)` - Radio/Checkbox buttons. The arguments are:
  - `id` - ID of the option container.
  - `label` - Text to display above the buttons.
  - `options` - Array of options. Its data type is `[ {'id': 'ID of each option', 'label': 'Option text', 'value': 'Option value'}, ... ]`
- `select(id, label, options, *onchange)` - Select tag. The arguments are: 
  - `id` - ID of the select container.
  - `label` - Text to display for the select tag.
  - `options` - Array of options. Its data type is `[ {'label': 'Option text', 'value': 'Option value'}, ... ]`
  - `onchange` - Optional. Function to call when select option is changed. **The select element will be passed to the function, so it must accept it.**
- `singlecheck(id, label, *checked)` - A single check button, may be used for a True/False value. The arguments are:
  - `id` - ID of the check input.
  - `label` - Text for the button.
  - `checked` - Optional. Determines if option should be checked by default.
- `button(id, label, *onclick)` - Includes buttons in the form. The arguments are:
  - `id` - ID of the button.
  - `label` - Text displayed on the button
  - `onclick` - Optional. The function to be called when the button is pressed. **If not defined, then button will submit the form.**
- `formCss()` - Use this to include the default form styling (present in `assets/styles/form.css`).
- `formFunction()` - Use this to include usefull form functions. The included functions are:
  - `getData()` - Extracts data from all the elements made from the above macros, and returns an object with keys as ID's and values as the corresponding values of the ID's.
  - `message(response, *location)` - Displays success/error message, and redirects the page to location. Its arguments are:
    - `response` - Its the response from the axios post request. It must contain a `message` (the message which is displayed in the pop-up) and a `success` (if its an error or success) attributes.
    - `location` - Optional. Location to redirect to. If not defined, then it reloads the page.

## Example Form

Here's an example form with all the elements.

```jinja
{% extends '_base.njk' %}
{% import '_form.njk' as forms %}

{% set scripts = ['https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'] %}

{% set thispage = 'Example Form' %}
{% set pagetitle = 'Example Form' %}

{% block pagecontent %}
	{% call forms.form('Example Form') %}
		{{ forms.field('name', 'Name') }}
		{{ forms.heading('h2', 'Some questions ') }}
		{{ forms.checkbox('team', 'Select Teams', [
			{
				'id':'web',
				'label': 'Web Dev',
				'value': 'web'
			},
			{
				'id':'quiz',
				'label': 'Quiz',
				'value': 'quiz'
			},
			{
				'id':'mn',
				'label': 'Media And Newsletter',
				'value': 'mn'
			}]) }}
		{{ forms.select('favperson', 'Favourite Person in WebDev', [
			{
				'label': 'Goos',
				'value': 'goos'
			},
			{
				'label': 'Nishkal',
				'value': 'np'
			},
			{
				'label': 'Parth',
				'value': 'parth'
			}], 'change') }}
		{{ forms.radio('like', 'DO you like MASK ?', [
			{
				'id':'yes',
				'label': 'YES',
				'value': 'yes'
			},
			{
				'id':'no',
				'label': 'NO',
				'value': 'no'
			}]) }}
		<div style="display: flex; flex-direction: row; justify-content: space-around; flex-wrap: wrap;">
			{{ forms.singlecheck('onichan', 'Onii-Chan', 1) }}
			{{ forms.singlecheck('uwu', 'UWU') }}
			{{ forms.singlecheck('nyaa', 'nyaaa~~~', 1) }}
		</div>
		{{ forms.datetime('date', 'Random Date', '2023-07-11') }}
		{{ forms.button('submit', 'Submit-nyaa~~', 'print') }}
	{% endcall %}
{% endblock %}

{% block customcss %}
	{{ forms.formCss() }}
	<style>
		form {
			width: 80%;
		}
	</style>
{% endblock %}

{% block customjs %}
	{{ forms.formFunction() }}
	<script>
		function change(select) {
			console.log('changed');
		}
		function print() {
			console.log(getData());
			// const response = (await axios.post)
			const response = { message: 'Succesfully Done', success: true }
			message(response);
		}
	</script>
{% endblock %}
```
