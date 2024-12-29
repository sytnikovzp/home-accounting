const { Router } = require('express');
// ==============================================================
const authRouter = require('./authRouter');
const categoryRouter = require('./categoryRouter');
const currencyRouter = require('./currencyRouter');
const measureRouter = require('./measureRouter');
const productRouter = require('./productRouter');
const establishmentRouter = require('./establishmentRouter');
const expenseRouter = require('./expenseRouter');
const statisticRouter = require('./statisticRouter');
const userRouter = require('./userRouter');
const roleRouter = require('./roleRouter');
const moderationRouter = require('./moderationRouter');

const router = new Router();

router.use('/auth', authRouter);
router.use('/categories', categoryRouter);
router.use('/currencies', currencyRouter);
router.use('/measures', measureRouter);
router.use('/products', productRouter);
router.use('/establishments', establishmentRouter);
router.use('/expenses', expenseRouter);
router.use('/statistics', statisticRouter);
router.use('/users', userRouter);
router.use('/roles', roleRouter);
router.use('/moderation', moderationRouter);

module.exports = router;
