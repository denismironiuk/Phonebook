const express = require('express');

const Post = require('../models/contact');

const {body} =require('express-validator')

const feedController = require('../controllers/contacts');
const isAuth=require ('../middleware/is-auth')

const router = express.Router();

// GET All Contacts
router.get('/contacts',isAuth, feedController.getPosts);

router.get('/contact/:postId',isAuth,feedController.getSinglePost)

// GET SINGLE CONTACT
router.post('/contact',isAuth,[

    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom(async (value)=>{
        const userDoc = await Post.findOne({ email: value });
        if (userDoc) {
            throw new Error('E-Mail address already exists');
        }
    }),
    body('phone')
    .custom(async (value)=>{
        const userDoc = await Post.findOne({ phone: value });
        
        if (userDoc) {
             throw new Error('Phone number alreadyin another person!!!');
        }
    })
], feedController.createPost);



router.put('/contact/:postId',isAuth,[
    
],feedController.updateContact)

//DELETE CONTACT
router.delete('/contact/:postId',isAuth,feedController.deletePost)

module.exports = router;