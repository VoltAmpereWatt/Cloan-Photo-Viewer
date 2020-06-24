const router = require('express').Router();
let Users = require('../models/users.model');
let Images = require('../models/images.model');
const AWS = require('aws-sdk');
const express = require('express');
const app = express();
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
// const c
require('dotenv').config();

const ID = process.env.AWSAccessKeyId;
const SECRET = process.env.AWSSecretKey;
const BUCKET_NAME = 'photo-viewer-gallery';

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

// configure AWS to work with promises
const s3 = new AWS.S3();

// multer is a library that is middleware. it takes the data sent by the frontend and parses it.
// it needs to be told where to put the form data.
var uploadFile = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, req.fileKey)
    },
  })
})

// Accept a single file with the name fieldname. The single file will be stored in req.file.
const uploadSingleFile = uploadFile.single('image');

function toS3(request, response) {
  request.fileKey = uuidv4();
  let fileUrl = `https://photo-viewer-gallery.s3.us-east-2.amazonaws.com/${request.fileKey}`;
  return new Promise((uploaded, notUploaded) => {
    return uploadSingleFile(request, response, err => {
      if (err) return notUploaded(err);
      return uploaded(fileUrl)
    })
  })
}

router.route('/fetch/:username').get((req, res) => {
  // console.log('In image fetch')
  Images.find({ uploader: req.params.username })
    .then(result => res.json(result))
    .catch(error => console.log(error))
})

router.route('/upload/:username').post((req, res) => {
  toS3(req, res)
    .then(fileUrl => {
      let newImage = new Images({
        uploader: req.params.username,
        url: fileUrl
      })
      newImage.save()
        .then(result => res.json(result))
      // console.log('Image uploaded')
    })
    .catch(err => console.log(err))
})


module.exports = router;