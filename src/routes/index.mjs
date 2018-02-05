import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.statusCode = 204;
  res.send();
});

export default router;
