const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const slug = require('slugs');



const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({
        message: 'That filetype is not allowed'
      }, false);
    }
  }
}




exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  // res.send('Ha hakdog');
  res.render('editStore', {
    title: '💩 Add Store'
  });
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  //check if there's no file
  if (!req.file) {
    next(); //skip to the next middleware
    return;
  }
  // console.log(req.file);
  const ext = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${ext}`;

  //resize
  // const raw = await jimp.read(req.file.buffer);
  // await raw.write(`./public/uploads/${req.body.photo}`);

  /* TODOOOOO */
  // Gawing dalawa yung nauupload na file na magkaibang size

  const raw = await jimp.read(req.file.buffer);
  await raw.resize(800, jimp.AUTO);
  await raw.write(`./public/uploads/${req.body.photo}`);

  console.log(raw);

  next();
  // console.log(resized, photo);

}

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body));
  await store.save()
  // console.log('It worked!');
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);

  // const raw = await fetch();
}

exports.getStores = async (req, res) => {

  //Query from the databes
  const stores = await Store.find();
  // console.log(stores);
  res.render('stores', {
    title: 'Stores',
    stores
  });
}

exports.editStore = async (req, res) => {
  //Find the store
  const store = await Store.findOne({
    _id: req.params.id
  });

  //confirm the owner

  //render store

  res.render('editStore', {
    title: `Edit ${store.name}`,
    store
  })
}

exports.updateStore = async (req, res) => {
  //find the store
  req.body.location.type = 'Point';
  const store = await Store.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated ${store.name} <a href="/store/${store.slug}">View Store</a>`);
  res.redirect(`/stores/${store._id}/edit`);
}

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({
    slug: req.params.slug
  });

  if (!store) {
    return next();
  }


  // res.render('') 
  res.render('store', {
    title: store.name,
    store
  });
}

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag
  const tagQuery = tag || {
    $exists: true
  }
  const tagsPromise = Store.getTagsList();
  const storePromise = Store.find({
    tags: tagQuery
  });

  const [tags, stores] = await Promise.all([tagsPromise, storePromise]);

  res.render('tags', {
    tags,
    stores,
    title: 'Tags',
    tag
  });

}