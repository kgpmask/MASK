# Tips for working on templates using credentials in `dev userless and mongoless` mode

As you check `handler.js`, you might come across a few cases which checks for `loggedIn` or `PARAMS`. Generally, the templates which are supposed to be rendered by this cannot be accessed by this in `dev userless` (`du`) mode. Some instances include:
- Quiz templates (quiz list, quiz login, the actual quiz, quiz attempted, etc)
- Live Quiz templates (participant's interface, quiz master's interface, results page)
- User profile page

To contribute to their templates (on a front-end basis) in `du` mode, here is a small workaround which you can use:
- Check the case corresponding to the template to be used in the handler. Note the variables passed in the renderFile function.
- For the variables which require credentials, generally those which are calculated from a DBH (database handler) function, check the schemas and the functions in `handler.js` to get an idea of what output will be returned by it.
- Make a dummy case for the template (say, `quiz-test`) While I do not recommend editing the existing case if you will be working only on the front-end, you are welcome to edit it provided you revert the handler back to how it was except for any necessary additions.
- Store some dummy data with the names of the variables which will be passed to the template in renderFile. You are welcome to edit just the DBH function's returned output, but since you will be working mainly on the front-end, can't we skip to the good part? :)
- ~~Pray to the almighty gods of WebDev that you wouldn't have to tinker with this for 106 more times~~

_Alternatively, for some cases, if you go on a treasure hunt through the commits of the repository, you can find the sample data. But then again, it's all up to you._ ;)

# 
Hope this helps you out in contributing to the interface of the website. If you have any queries, as mentioned in [README](/README.md), feel free to pester the WebDev team.


<!-- TODO: This needs to be updated with information on the mongoless parameter -->
