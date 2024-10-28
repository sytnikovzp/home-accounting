const { Router } = require('express');
// =====================================

const categoryRouter = require('./categoryRouter');

const router = new Router();

router.use('/categories', categoryRouter);

module.exports = router;
