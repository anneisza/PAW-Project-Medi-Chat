const express = require('express');
const { requireAdminAuth } = require('../middlewares/auth');

function makeRouter(c) {
  const router = express.Router();

  // Publik
  router.get('/', c.getAll);
  router.get('/:id', c.getById);

  // Wajib login admin
  router.post('/', requireAdminAuth, c.create);
  router.put('/:id', requireAdminAuth, c.update);
  router.delete('/:id', requireAdminAuth, c.remove);

  return router;
}

module.exports = makeRouter;