var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

// SHOW LIST OF Bts
app.get('/', function (req, res, next) {
    // fetch and sort crud collection by id in descending order
    req.db.collection('crud').find().sort({ "_id": -1 }).toArray(function (err, result) {
        //if (err) return console.log(err)
        if (err) {
            req.flash('error', err)
            res.render('bts/list', {
                title: 'bts List',
                data: ''
            })
        } else {
            // render to views/bts/list.ejs template file
            res.render('bts/list', {
                title: 'bts List',
                data: result
            })
        }
    })
})

// SHOW ADD bts FORM
app.get('/add', function (req, res, next) {
    // render to views/bts/add.ejs
    res.render('bts/add', {
        title: 'Add New bts',
        btsid: '',
        bsc: '',
        name: ''
    })
})

// ADD NEW bts POST ACTION
app.post('/add', function (req, res, next) {
    req.assert('btsid', 'id is required').notEmpty()    //Validate id
    req.assert('bsc', 'bsc is required').notEmpty()      //Validate bsc
    req.assert('name', 'btsid is required').notEmpty()  //Validate name

    var errors = req.validationErrors()

    if (!errors) {   //No errors were found.  Passed Validation!

        var bts = {
            btsid: req.body.btsid.trim(),
            bsc: req.body.bsc.trim(),
            name: req.body.name.trim()
        }

        req.db.collection('crud').insert(bts, function (err, result) {
            if (err) {
                req.flash('error', err)
                // render to views/bts/add.ejs
                res.render('bts/add', {
                    title: 'Add New bts',
                    btsid: bts.btsid,
                    bsc: bts.bsc,
                    name: bts.name
                })
            } else {
                req.flash('success', 'Data added successfully!')

                // redirect to bts list page                
                res.redirect('/crud')
            }
        })
    }
    else {   //Display errors to bts
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('bts/add', {
            title: 'Add New bts',
            btsid: req.body.btsid,
            bsc: req.body.bsc,
            name: req.body.name
        })
    }
})

// SHOW EDIT bts FORM
app.get('/edit/(:id)', function (req, res, next) {
    var o_id = new ObjectId(req.params.id)
    req.db.collection('crud').find({ "_id": o_id }).toArray(function (err, result) {
        if (err) return console.log(err)

        // if bts not found
        if (!result) {
            req.flash('error', 'bts not found with id = ' + req.params.id)
            res.redirect('/crud')
        }
        else { // if bts found
            // render to views/bts/edit.ejs template file
            res.render('bts/edit', {
                title: 'Edit bts',
                //data: rows[0],
                id: result[0]._id,
                btsid: result[0].btsid,
                bsc: result[0].bsc,
                name: result[0].name
            })
        }
    })
})

// EDIT bts POST ACTION
app.put('/edit/(:id)', function (req, res, next) {
    req.assert('btsid', 'btsid is required').notEmpty()           //Validate btsid
    req.assert('bsc', 'bsc is required').notEmpty()             //Validate bsc
    req.assert('name', 'A valid name is required').notEmpty()  //Validate name

    var errors = req.validationErrors()

    if (!errors) {
        var bts = {
            btsid: req.sanitize('btsid').escape().trim(),
            bsc: req.sanitize('bsc').escape().trim(),
            name: req.sanitize('name').escape().trim()
        }

        var o_id = new ObjectId(req.params.id)
        req.db.collection('crud').update({ "_id": o_id }, bts, function (err, result) {
            if (err) {
                req.flash('error', err)

                // render to views/bts/edit.ejs
                res.render('bts/edit', {
                    title: 'Edit bts',
                    id: req.params.id,
                    btsid: req.body.btsid,
                    bsc: req.body.bsc,
                    name: req.body.name
                })
            } else {
                req.flash('success', 'Data updated successfully!')

                res.redirect('/crud')

            }
        })
    }
    else {   //Display errors to bts
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('bts/edit', {
            title: 'Edit bts',
            id: req.params.id,
            btsid: req.body.btsid,
            bsc: req.body.bsc,
            name: req.body.name
        })
    }
})

// DELETE bts
app.delete('/delete/(:id)', function (req, res, next) {
    var o_id = new ObjectId(req.params.id)
    req.db.collection('crud').remove({ "_id": o_id }, function (err, result) {
        if (err) {
            req.flash('error', err)
            // redirect to crud list page
            res.redirect('/crud')
        } else {
            req.flash('success', 'bts deleted successfully! id = ' + req.params.id)
            // redirect to crud list page
            res.redirect('/crud')
        }
    })
})

module.exports = app