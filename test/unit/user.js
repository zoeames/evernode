/* jshint expr:true */

'use strict';

var expect     = require('chai').expect,
    cp         = require('child_process'),
    User       = require('../../server/models/user'),
    h          = require('../helpers/helpers.js'),
    Lab        = require('lab'),
    lab        = exports.lab = Lab.script(),
    describe   = lab.describe,
    it         = lab.it,
    //before     = lab.before,
    beforeEach = lab.beforeEach,
    db         = h.getdb();

describe('User', function(){
  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });
  describe('constructor', function(){
    it('should create a user object', function(done){
      var user = new User({username:'bob'});

      expect(user).to.be.instanceof(User);
      expect(user.username).to.equal('bob');
      done();
    });
  });

  describe('.register', function(){
    it('should register a new user', function(done){
      User.register({username:'sam', password:'1234', avatar:'https://www.apple.com/global/elements/flags/16x16/usa_2x.png'}, function(err){
        expect(err).to.be.null;
        done();
      });
    });
    it('should NOT register a new user - DUPLCATE', function(done){
      User.register({username:'BOB', password:'1234', avatar:'https://www.apple.com/global/elements/flags/16x16/usa_2x.png'}, function(err){
        expect(err).to.be.OK;
        done();
      });
    });
  });
  describe('.login', function(){
    it('should login a new user', function(done){
      User.login({username:'bob', password:'1234'}, function(user){
        expect(user).to.be.ok;
        expect(user.username).to.equal('bob');
        done();
      });
    });
    it('should not login user - bad username', function(done){
      User.login({username:'wrong', password:'1234'}, function(user){
        expect(user).to.be.undefined;
        done();
      });
    });
    it('should not login user - bad password', function(done){
      User.login({username:'bob', password:'wrong'}, function(user){
        expect(user).to.be.undefined;
        done();
      });
    });
  });
});
