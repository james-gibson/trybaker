import express from 'express';
import PROVIDERS from "../services/data/providers/providerEnum.mjs";
var router = express.Router();


/* Health check route */
router.get('/', function(req, res) {
  res.statusCode = 204;
  res.send();
});

router.get('/swagger', function(req, res) {
    const dataProvider = req.custom.dataProvider;
    const Swagger = dataProvider.get(PROVIDERS.SWAGGER);

    res.json(Swagger);
});



export default router;
