'use strict';

exports.getdb = function(){
  return process.env.DATABASE_URL.match(/\/([\w]+$)/)[1];
};
