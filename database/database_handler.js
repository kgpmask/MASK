const mongoose = require('mongoose');
const User = require('./schemas/User');
const Quiz = require('./schemas/Quiz');
const { handleError } = require('nunjucks/src/runtime');
const res = require('express/lib/response');
const { query } = require('express');

// Handle newly registered user or normal login
function createNewUser (profile) {
    return new Promise((resolve, reject) => {
        let query = User.User.find().where('subject').equals(profile.id);
        query.exec(function (err, existing_users) {
            if (err) reject(err);
            else if (existing_users.length > 0) {
                // Email is already in use
                console.log("Email already in use");
                resolve(existing_users[0]);
            }
            else {
                let new_user = new User.User({'subject': profile.id, 'name': profile.displayName, 'email': profile.emails[0].value});
                new_user.save(function (err) {
                    if (err) reject(err);
                    else resolve(new_user);
                });
            }
        });
    });
}

// Logout User
function logoutUser (id) {
    return new Promise((resolve, reject) => {
        let query = User.User.findById(id);
        query.exec(function (err, user) {
            if (err) reject(err);
            else resolve(user[0]);
        });
    })
}

// Add new record to databse, uses put
function updateUserQuizRecord (stats) { // {userId, quizId, time, score}
    return new Promise((resolve, reject) => {
        let query = Quiz.UserQuizData.find().where('userId').equals(stats.userId);
        query.exec(function (err, existing_user) {
            if (err) reject(err);
            else if (existing_user.length === 0) {
                record = new Quiz.UserQuizData({'userId': stats.userId})
                let key = stats.quizId, obj = {}, obj_ = { 'score': stats.score, 'time': stats.time };
                obj[key] = obj_; 
                record.quizData = obj;
                record,save(function (err) {
                    if (err) reject(err);
                    else resolve(record)
                });
            }
            else {
                record = existing_user[0];
                let key = stats.quizId; let obj_ = {'score': stats.score, 'time': stats.time};
                record.quizData[key] = obj_;
                record,save(function (err) {
                    if (err) reject(err);
                    else resolve(record)
                });
            }
        });
    });
}

// User statistics
function userStats (userId) {
    return new Promise((resolve, reject) => {
        let query = Quiz.UserQuizDatafind().where('userId').equals(userId);
        query.exec(function (err, existing_user) {
            if (err) reject(err);
            else if (existing_user.length === 0) {
                let obj = {}; let key = false; let obj_ = {};
                obj[key] = obj_;
                resolve(obj);
            }
            else {
                record = existing_user[0].quizData;
                let obj = {}; let key = true;
                obj[key] = record;
                resolve(obj);
            }
        });
    });
}

async function test1 () {
    let t_1 = createNewUser({'email': "2"}, "B");
    t_1.then((userResponse) => {
        console.log(userResponse)
    }).catch((userErr) => {
        console.log(handleError(userErr));
    });
}

module.exports = {
    createNewUser: createNewUser,
    logoutUser: logoutUser
};
// test1();