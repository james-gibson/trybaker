const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var express = require('express');
var rp = require('request-promise');
var router = express.Router();

const sendCode = (phone) => {
    "use strict";
    return rp(`http://loyalty-api:3000/api/verify/phone/${phone}?code=new`)
        .then(result => {
            return result;
        }).catch(err => {
            console.log(err)
            return false;
        })
};

const completeVerification = (code,phone,fName,lName,email) => {
    "use strict";
    return rp(`http://loyalty-api:3000/api/verify/phone/${phone}?code=${code}&e=${email}&f=${fName}&l=${lName}`)
        .then(results => JSON.parse(results))
        .then(results => {
            if (results.status != 'valid' || !results.userId) {
                throw new Error('invalid session')
            }
            return results;
        })
};

const getData = (code,phone,fName,lName,email) => {
    "use strict";
    return rp(`http://loyalty-api:3000/api/verify/phone/${phone}?code=${code}&e=${email}&f=${fName}&l=${lName}`)
        .then(results => JSON.parse(results))
        .then(results => {
            return results;
        })
};


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Welcome to TryBaker!' });
});

router.get('/challenge', function(req, res) {
    const {phone, f,l,e, userId}  = req.query;

    res.render('challenge', {
        title: userId ? 'Welcome back,' : 'Lets get you verified:',
        phone,
        fName: f,
        lName: l,
        email: e,
        doesUserExist: !userId,
    });
});

router.get('/dashboard', function(req, res) {
    // using a timeout to defeat a small race condition on the api
    setTimeout(() => {
        const {code, phone, f,l,e}  = req.query;

        getData(code,phone,f,l,e)
            .then(results => {
                if(results.status == 'invalid') {
                    let userId;
                    if(results.user) {
                        userId = results.user.id;
                    }
                    return res.redirect(`/challenge?phone=${phone}&userId=${userId}&errors=['Expired Session']&code=${code}&f=${f}&l=${l}&e=${e}`);
                }

                console.log('dashboard hydration? ', {results,code,phone,f,l,e})
                const user = results.user;
                const data = results.data;
                res.render('dashboard', {
                    title: 'TryBaker v0.1',
                    total: data.total,
                    visits: data.entries.length,
                    entries: data.entries,
                    phone: phone,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.emailAddress,
                    userId: user.id,
                });
            })
    }, 1000)


});


// Form submission logic
// #1 Login given a phone number
router.post('/login', function(req,res,next) {
    console.log('login post', req.body);
    if(!req.body.phone) {return res.redirect('/')}

    sendCode(req.body.phone).then(result => {
        "use strict";
        console.log('+++++++++++++++++++++++++++++++')
        console.log('result', result)
        console.log('+++++++++++++++++++++++++++++++')
        if(result){
            let userId = result.userId  || '';
            res.redirect(`/challenge?phone=${req.body.phone}&userId=${userId}`);
        }

        else
            res.redirect('/');
    })
});

// #2  Let's verify that you own that phone number given a phone number and code
router.post('/verification', function(req,res) {
    const {code, phone, fName,lName,email}  = req.body;
    if(!code || !phone)
        res.redirect('/');
    else {
        completeVerification(code,phone,fName,lName,email)
            .then(result => {
                const {code, phone, fName,lName,email}  = req.body;
                const {userId} = result;
                if(userId) {
                    res.redirect(`/checkin?phone=${phone}&code=${code}&f=${fName}&l=${lName}&e=${email}`)
                } else {
                    res.redirect(`/challenge?phone=${phone}&errors=['Invalid code used']&code=${code}&f=${fName}&l=${lName}&e=${email}`);
                }

            }).catch(err => {
                console.log(err)
                res.redirect(`/challenge?phone=${phone}&errors=['Something went wrong']&code=${code}&f=${fName}&l=${lName}&e=${email}`);
        })

    }

});

// #3 Lets get you hydrated, you seem to belong
router.get('/checkin', function(req,res) {
    console.log(req.query)
    const {code, phone, f,l,e}  = req.query;

    console.log('dashboard hydration');

    res.redirect(`/dashboard?phone=${phone}&code=${code}&f=${f}&l=${l}&e=${e}`)
});



module.exports = router;
