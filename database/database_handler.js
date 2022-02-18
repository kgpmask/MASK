/*
Update User Quiz Data:
    name: userQuizUpdate()
    inputs: UserQuizData
    outputs: void
    handler:
        inputs: time, score, user_id
        output: redirect to quiz page

View previous scores:
    - List events :
        input: user_id, auth_token
        output: [event_id, name]
        hyperlink: %%/event/%%?eventId=X
    - List attempted quizzes :
        input: user_id, auth_token, event_id
        output: [quizName, user_id->UserQuizData->quizId => score, time]
        hyperlink: leaderboard

Leaderboard:
- static - create after quiz ends

*/