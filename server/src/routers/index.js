const { Router } = require('express');
// ==============================================================
const authRouter = require('./authRouter');
const categoryRouter = require('./categoryRouter');
const currencyRouter = require('./currencyRouter');
const measureRouter = require('./measureRouter');
const productRouter = require('./productRouter');
const shopRouter = require('./shopRouter');
const purchaseRouter = require('./purchaseRouter');
const statisticRouter = require('./statisticRouter');
const userRouter = require('./userRouter');
const roleRouter = require('./roleRouter');

const router = new Router();

router.use('/auth', authRouter);
router.use('/categories', categoryRouter);
router.use('/currencies', currencyRouter);
router.use('/measures', measureRouter);
router.use('/products', productRouter);
router.use('/shops', shopRouter);
router.use('/purchases', purchaseRouter);
router.use('/statistics', statisticRouter);
router.use('/users', userRouter);
router.use('/roles', roleRouter);

module.exports = router;
