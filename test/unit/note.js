/* jshint expr:true */

'use strict';

var expect     = require('chai').expect,
    cp         = require('child_process'),
    h          = require('../helpers/helpers'),
    Note       = require('../../server/models/note'),
    Lab        = require('lab'),
    lab        = exports.lab = Lab.script(),
    describe   = lab.describe,
    it         = lab.it,
    beforeEach = lab.beforeEach,
    db         = h.getdb(),
    fs         = require('fs');

describe('Note', function(){
  var noteId;
  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      Note.create({id:1}, {title:'a', body:'b', tags:'c,d,e'}, function(err, results){
        noteId = results;
        done();
      });
    });
  });

  describe('constructor', function(){
    it('should create a new Note object', function(done){
      var n = new Note();
      expect(n).to.be.instanceof(Note);
      done();
    });
  })
  describe('.uploadmobile', function(){
    it('should upload mobile photo', function(done){
      Note.uploadmobile({token:'tok'}, 'b64image', noteId, function(err, results){
        expect(err).to.be.null;
        expect(noteId).to.be.ok;
        done();
      });
    });
  });
  describe('.upload', function(){
    it('should upload an image', function(done){
      var file = fs.createReadStream(__dirname + '/../fixtures/flag.png');
      Note.upload({token:'tok'}, file, 'flag.png', noteId, function(err, results){
        expect(err).to.be.null;
        done();
      });
    });
  });
  describe('.create', function(){
    it('should create a new note', function(done){
      Note.create({username:'bob', id:'1'}, {title:'the note', body:'This is the body', tags:'a,b,c,d'}, function(err, noteId){
        expect(err).to.be.null;
        expect(noteId).to.be.ok;
        done();
      });
    });
  });
  describe('.query', function(){
    it('should final all users notes', function(done){
      Note.query({username:'bob', id:'1'}, {}, function(err, notes){
        expect(err).to.be.null;
        expect(notes).to.be.ok;
        done();
      });
    });
  });
  describe('.show', function(){
    it('should show a notes', function(done){
      Note.show({id:'1'}, noteId, function(err, note){
        expect(err).to.be.null;
        expect(note.title).to.equal('a');
        done();
      });
    });
  });
  describe('.nuke', function(){
    it('should delete a notes', function(done){
      Note.nuke({username:'bob', id:'1'}, noteId, function(err, results){
        expect(err).to.be.null;
        expect(results).to.equal(noteId);
        done();
      });
    });
  });
  describe('.count', function(){
    it('should count all notes for a user', function(done){
      Note.count({username:'bob', id:'1'}, function(err, count){
        expect(err).to.be.null;
        expect(count).to.equal('1');
        done();
      });
    });
  });
});
