import express from 'express';
var router = express.Router();

const swaggerDefinition = {

};

/* Health check route */
router.get('/', function(req, res) {
  res.statusCode = 204;
  res.send();
});

router.get('/swagger', function(req, res) {
    res.json(swaggerDefinition);
});



export default router;
