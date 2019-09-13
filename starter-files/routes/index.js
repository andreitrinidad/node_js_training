const express = require('express');
const router = express.Router();
const {
  homePage,
  addStore,
  createStore,
  getStores,
  editStore,
  updateStore,
  upload,
  resize,
  getStoreBySlug,
  getStoresByTag
} = require('../controllers/storeController');

const {
  loginForm,
  registerForm,
  validateRegister
} = require('../controllers/userController');

const {
  catchErrors
} = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(getStores));
router.get('/stores', catchErrors(getStores));
router.get('/add', addStore);

router.post('/add',
  upload,
  resize,
  catchErrors(createStore)
);

router.post('/add/:id',
  upload,
  resize,
  catchErrors(updateStore)
);

router.get('/stores/:id/edit', catchErrors(editStore));


router.get('/store/:slug', catchErrors(getStoreBySlug));


router.get('/tags', catchErrors(getStoresByTag));
router.get('/tags/:tag', catchErrors(getStoresByTag));

router.get('/login', catchErrors(loginForm));
router.get('/register', registerForm);


router.post('/register', validateRegister);

module.exports = router;