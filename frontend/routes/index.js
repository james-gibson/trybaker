const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var express = require('express');
var rp = require('request-promise');
var router = express.Router();

const sendCode = (phone) => {
    "use strict";
    return rp(`http://loyalty-api:3000/api/verify/phone/${phone}?code=new`)
        .then(result => {
            console.log(result)
            return true;
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


const validationIndex = (req) => {
    "use strict";

};


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Welcome!' });
});

router.get('/challenge', function(req, res) {
    const {phone, fName,lName,email}  = req.query;

    res.render('challenge', {
        title: 'Whoops, we need to verify this',
        phone,
        fName,
        lName,
        email,
    });
});

router.get('/dashboard', function(req, res) {
    // using a timeout to defeat a small race condition on the api
    setTimeout(() => {
        const {code, phone, f,l,e}  = req.query;

        getData(code,phone,f,l,e)
            .then(results => {
                res.render('dashboard', { title: 'Dashboard', phone:phone, data:results, total:results.data.total, entries:results.data.entries});
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
        if(result)
            res.redirect(`/challenge?phone=${req.body.phone}`);
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
