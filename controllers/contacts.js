const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const io = require('../socket');
const User = require('../models/user');
const Post = require('../models/contact');

exports.getPosts = async (req, res, next) => {
  const userId=req.userId
  
  try {
    const posts = await Post.find({creator:userId});

    if (!posts) {
      const error = new Error('Could not find data');
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: 'Fetched data successfully', listContacts: posts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  // .catch((err) => {
  //
  // });
};

exports.getSinglePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      res.status(200).json({
        message: 'Fetched data successfully',
        listContact: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(404).json({ errors: result.array() });
  }
   

  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const imageUrl = req.file? req.file.path.replace('\\', '/'):'';
  const post = new Post({
    name: name,
    email: email,
    phone: phone,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.contacts.push(post);
    await user.save();
    io.getIO().emit('posts', {
      action: 'create',
     
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } }
     
    });
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

  // .catch((err) => {
  //
  // });
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error('Could not find data');
      error.statusCode = 404;
      throw error;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);

    user.contacts.pull(postId);
    await user.save();
    io.getIO().emit('posts', { action: 'delete', post: postId });

    res.status(200).json({ message: 'Contact removed successfully' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateContact = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Update failed');
    error.statusCode = 422;
    throw error;
  }
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error('No file picked');
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = await Post.findById(postId).populate('creator');

    if (!post) {
      const error = new Error('Could not find data');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator._id.toString() != req.userId) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.name = name;
    post.phone = phone;
    post.email = email;
    post.imageUrl = imageUrl;

    const result = await post.save();
    io.getIO().emit('posts', { action: 'update', post: result });
    res
      .status(200)
      .json({ message: 'Updated successfully', updatedContact: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
