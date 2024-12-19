const router = require('express').Router();

const appController = require('../../controllers/ode/main');

router.get('/problems', appController.getProblemsList);
router.get('/orbit', appController.getOrbit);
router.post('/result', appController.postResult);

module.exports = router;
