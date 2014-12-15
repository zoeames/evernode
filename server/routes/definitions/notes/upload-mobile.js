'use strict';

var Joi  = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Upload a Mobile Photo',
  tags:['notes'],
  validate: {
    params: {
      noteId: Joi.number().required()
    }
  },
  payload:{
    maxBytes: 20500500,
    timeout: 60000
  },
  cors:{origin: ['http://localhost:8100'],credentials: true},
  handler: function(request, reply){
    Note.uploadmobile(request.auth.credentials, request.payload.b64, request.params.noteId, function(err){
      reply().code(err ? 400 : 200);
    });
  }
};
