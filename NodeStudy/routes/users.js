var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('../models/user');
const UserSchema = require("mongoose");
var DB_URL = require("../constants/constants");
const bcrypt = require('bcrypt');
const saltRounds = 10;

//get list of users from db
router.get('/users', (req, res, next) => {


    mongoose.connect(DB_URL, {useNewUrlParser: true}, (err) => {

        if (err) throw err;

        console.log('DB is connected Successfully');


        User.find({}).then((user) => {
            res.send(user);
        }).catch(() => {
            res.send('error')
        });

    });


    // res.send({type: 'GET'})
});


//add new user in db
router.post('/signUp', (req, res, next) => {

    let userData = req.body;

    mongoose.connect(DB_URL, {useNewUrlParser: true}, (err) => {

        if (err) throw err;

        console.log('DB is connected Successfully');

        // console.log(req.body);
        //its an old way
        // var ninja = new Ninja(req.body);
        // ninja.save();


        bcrypt.hash(userData.password, saltRounds, function (err, hash) {

            //professional level, at same time Ninja will be created and saved in db
            // .creat is mongoose method and Ninja is our model, mongoose will creat Ninja and saved in db
            User.create({
                name: userData.name,
                fname: userData.fname,
                email: userData.email,
                password: hash
            }).then((user) => {

                //success callback
                res.send(user);
            }).catch(next);

            //just for practise that, DB is receiving data
            // res.send({
            //     type: 'POST',
            //     name: req.body.name,
            //     rank: req.body.rank
            // });

        });
    });
});


//find user from db with out password encryption
// router.post('/signIn', (req, res, next) => {
//
//     let userData = req.body;
//
//     mongoose.connect(DB_URL, {useNewUrlParser: true}, (err) => {
//
//         if (err) throw err;
//
//         console.log('DB is connected Successfully');
//
//             User.find({email: userData.email, password: userData.password}).then((user) => {
//
//                 // console.log(user);
//                 if (user.length > 0) {
//                     res.status(200).json({status: 200, data: user[0]});
//                     // res.status(200).send(user)
//                 } else {
//                     // res.status(404).send("Invalid email or password")
//
//                     res.status(404).json({status: 404, data: 'User not found'});
//                 }
//             }).catch((err) => {
//                 res.status(404).json({status: 404, data: 'DB Catch'});
//             });
//
//
//     });
//
// });


// find user from db with password Encryption
router.post('/signIn', (req, res) => {

    const incomingEmail = req.body.email;
    const incomingPassword = req.body.password;

    mongoose.connect(DB_URL, {useNewUrlParser: true}, (err) => {

        if (err) throw err;

        console.log('DB is connected Successfully');

        User.findOne({email: incomingEmail}).then((user) => {

            bcrypt.compare(incomingPassword, user.password, function (err, usr) {
                if (usr) {
                    // Passwords match
                    // res.send(user)
                    res.status(200).json({status: 200, data: user});
                } else {
                    // Passwords don't match
                    // res.send('Incorrect password')
                    res.status(404).json({status: 404, data: 'Incorrect password'});
                }
            });
        }).catch(() => {
            res.status(404).json({status: 404, data: 'Email not matched'});
        });
    });

});


//update Password
router.put('/update', (req, res, next) => {
    const id = req.body.id;
    const incomingPassword = req.body.password;
    const newPassword = req.body.newPassword;

    mongoose.connect(DB_URL, {useNewUrlParser: true}, (err) => {

        if (err) throw err;

        console.log('DB is connected Successfully');

        User.findOne({_id: id}, (err, user) => {
            if (err) {
                res.status(500).send('Internal error')
            } else {
                if (!user) {
                    res.status(404).send('User not found')
                } else {

                    bcrypt.compare(incomingPassword, user.password, function (err, data) {
                        if (data) {

                            bcrypt.hash(newPassword, saltRounds, function (err, hash) {

                                user.password = hash;

                                user.save((err, updatedUser) => {
                                    if (err) {
                                        res.send('500 error')
                                    } else {
                                        res.send(updatedUser)
                                    }
                                });
                            });

                        } else {
                            res.status(404).json({status: 404, data: 'Incorrect password'});
                        }
                    });
                }
            }
        })

    });
});


//update a User in db
router.put('/users/:id', (req, res, next) => {

    User.findOneAndUpdate({_id: req.params.id}, req.body).then(() => {

        User.findOne({_id: req.params.id}).then((user) => {
            res.send(user);
        })
    });
    //res.send({type: 'PUT'})
});


//delete a ninja from db
router.delete('/users/:id', (req, res, next) => {
    //console.log(req.params.id);
    //findOneAndDelete is mongoose function which will take an id from req and search it in Ninja, when it will find required id and
    //once deleted then success callback will be run, otherwise catch will run

    User.findOneAndDelete({_id: req.params.id}).then((user) => {
        res.send(user);
    }).catch(next);
    //res.send({type: 'DELETE'})
});


// router.get('/test', function(req, res, next) {
//   // connect with the data base and fetch a user
//
//   mongoose.connect(DB_URL, { useNewUrlParser: true },  (err) => {
//
//     if (err) throw res.status(404).json({'err':'connection ok nei:'});
//
//     res.status(200).json({'res':'connected:'});
//
//   });
//
//
// });

module.exports = router;
