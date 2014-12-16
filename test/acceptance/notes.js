/* jshint expr:true */

'use strict';

var expect     = require('chai').expect,
    cp         = require('child_process'),
    h          = require('../helpers/helpers'),
    server     = require('../../server/index'),
    Lab        = require('lab'),
    lab        = exports.lab = Lab.script(),
    describe   = lab.describe,
    it         = lab.it,
    beforeEach = lab.beforeEach,
    db         = h.getdb();

describe('Notes', function(){
  var cookie, noteId;
  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      var options = {
        method: 'post',
        url: '/login',
        payload:{
          username: 'bob',
          password: '123'
        }
      },
      options2 = {
        method: 'post',
        url: '/notes',
        headers:{
          cookie: cookie
        },
        payload:{
          title: 'a',
          body: 'b',
          tags:'c,d,e'
        }
      };

      server.inject(options, function(response1){
        server.inject(options2, function(response2){
          noteId = response2.result.noteId;
          //console.log(response2);
          console.log('NOTEID >>>>> ', noteId);
          cookie = response1.headers['set-cookie'][0].match(/hapi-cookie=[^;]+/)[0];
          done();
        });
      });
    });
  });

  describe('post /notes', function(){
    it('should add a new Note', function(done){
      var options = {
        method: 'post',
        url: '/notes',
        headers:{
          cookie: cookie
        },
        payload:{
          title: 'a',
          body: 'b',
          tags:'c,d,e'
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });
  describe('get /notes', function(){
    it('should get all Notes', function(done){
      var options = {
        method: 'get',
        url: '/notes',
        headers:{
          cookie: cookie
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });
  describe('get /notes/:noteId', function(){
    it('should get info about a note', function(done){
      var options = {
        method: 'get',
        url: '/notes/'+noteId,
        headers:{
          cookie: cookie
        }
      };

      server.inject(options, function(response){
        expect(response.result.title).to.equal('a');
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });
  describe('delete /notes/:noteId', function(){
    it('should delete a note', function(done){
      var options = {
        method: 'delete',
        url: '/notes/'+noteId,
        headers:{
          cookie: cookie
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });
  describe('get /notes/count', function(){
    it('should get all Notes', function(done){
      var options = {
        method: 'get',
        url: '/notes/count',
        headers:{
          cookie: cookie
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        expect(response.result.count).to.equal('1');
        done();
      });
    });
  });

});
