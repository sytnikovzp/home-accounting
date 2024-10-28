const { Router } = require('express');
// =====================================

const categoryRouter = require('./categoryRouter');
const currencyRouter = require('./currencyRouter');
const measureRouter = require('./measureRouter');
const authRouter = require('./authRouter');

const router = new Router();

router.use('/categories', categoryRouter);
router.use('/currencies', currencyRouter);
router.use('/measures', measureRouter);
router.use('/auth', authRouter);

module.exports = router;
