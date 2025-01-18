const { Router } = require('express');

const authRouter = require('./authRouter');
const categoriesRouter = require('./categoriesRouter');
const currenciesRouter = require('./currenciesRouter');
const establishmentsRouter = require('./establishmentsRouter');
const expensesRouter = require('./expensesRouter');
const measuresRouter = require('./measuresRouter');
const moderationsRouter = require('./moderationsRouter');
const permissionsRouter = require('./permissionsRouter');
const productsRouter = require('./productsRouter');
const rolesRouter = require('./rolesRouter');
const statisticsRouter = require('./statisticsRouter');
const usersRouter = require('./usersRouter');

const router = new Router();

router.use('/auth', authRouter);
router.use('/categories', categoriesRouter);
router.use('/currencies', currenciesRouter);
router.use('/establishments', establishmentsRouter);
router.use('/expenses', expensesRouter);
router.use('/measures', measuresRouter);
router.use('/moderation', moderationsRouter);
router.use('/permissions', permissionsRouter);
router.use('/products', productsRouter);
router.use('/roles', rolesRouter);
router.use('/statistics', statisticsRouter);
router.use('/users', usersRouter);

module.exports = router;
