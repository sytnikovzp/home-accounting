const { Router } = require('express');
// =====================================

const authRouter = require('./authRouter');
const categoryRouter = require('./categoryRouter');
const currencyRouter = require('./currencyRouter');
const measureRouter = require('./measureRouter');
const productRouter = require('./productRouter');

const router = new Router();

router.use('/auth', authRouter);
router.use('/categories', categoryRouter);
router.use('/currencies', currencyRouter);
router.use('/measures', measureRouter);
router.use('/products', productRouter);

module.exports = router;
