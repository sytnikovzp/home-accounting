const { Router } = require('express');

const authRouter = require('./authRouter');
const categoryRouter = require('./categoryRouter');
const currencyRouter = require('./currencyRouter');
const establishmentRouter = require('./establishmentRouter');
const expenseRouter = require('./expenseRouter');
const measureRouter = require('./measureRouter');
const moderationRouter = require('./moderationRouter');
const productRouter = require('./productRouter');
const roleRouter = require('./roleRouter');
const statisticRouter = require('./statisticRouter');
const userRouter = require('./userRouter');

const router = new Router();

router.use('/auth', authRouter);
router.use('/categories', categoryRouter);
router.use('/currencies', currencyRouter);
router.use('/establishments', establishmentRouter);
router.use('/expenses', expenseRouter);
router.use('/measures', measureRouter);
router.use('/moderation', moderationRouter);
router.use('/products', productRouter);
router.use('/roles', roleRouter);
router.use('/statistics', statisticRouter);
router.use('/users', userRouter);

module.exports = router;
