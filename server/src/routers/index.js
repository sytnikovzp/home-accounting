const { Router } = require('express');
// =====================================

const categoryRouter = require('./categoryRouter');
const currencyRouter = require('./currencyRouter');
const authRouter = require('./authRouter');

const router = new Router();

router.use('/categories', categoryRouter);
router.use('/currencies', currencyRouter);
router.use('/auth', authRouter);

module.exports = router;
