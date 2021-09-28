var express = require("express");
var router = express.Router();
module.exports = router;

router.use(function(request, response, next){
    response.status(404).send("Not Found");
})

router.use(function(error, request, response, next){
    console.error(error.stack);
    response.status(500).send("Something broke!");
})