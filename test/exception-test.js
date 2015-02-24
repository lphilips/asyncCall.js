var Excpt = require('../lib/exception.js'),
    assert = require("assert"),
    expect = require('chai').expect;

/*
    Tests for lib/exception.js
*/

function CustomError(message) {
    this.name = "CustomError";
    this.message = (message || "");
}

CustomError.prototype = new Error();
CustomError.prototype.constructor = CustomError;

describe('lib/exception.js tests', function() {
    describe('internals', function() {
        it('custom error', function(done) {
            var e = new Error('message');

            expect(Excpt.isException(e)).to.be.true;
            expect(Excpt.isImplicitException(e)).to.be.false;
            expect(Excpt.isOfError(e)).to.be.true;
            done();
        });

        it('sub type of error', function(done) {
            var e = new SyntaxError('message');

            expect(Excpt.isException(e)).to.be.true;
            expect(Excpt.isImplicitException(e)).to.be.true;
            expect(Excpt.isOfError(e)).to.be.false;
            done();
        });

        it('other throwables: number', function(done) {
            var e = 5;

            expect(Excpt.isException(e)).not.to.be.true;
            expect(Excpt.isImplicitException(e)).to.be.false;
            expect(Excpt.isOfError(e)).to.be.false;
            done();
        });

        it('other throwables: string', function(done) {
            var e = 'message';

            expect(Excpt.isException(e)).not.to.be.true;
            expect(Excpt.isImplicitException(e)).to.be.false;
            expect(Excpt.isOfError(e)).to.be.false;
            done();
        });

        it('other throwables: object', function(done) {
            var e = {};

            expect(Excpt.isException(e)).not.to.be.true;
            expect(Excpt.isImplicitException(e)).to.be.false;
            expect(Excpt.isOfError(e)).to.be.false;
            done();
        });

        it('other throwables: CustomError', function(done) {
            var e = new CustomError("my custom error.");

            expect(Excpt.isException(e)).to.be.true;
            expect(Excpt.isImplicitException(e)).to.be.false;
            expect(Excpt.isOfError(e)).to.be.false;
            done();
        });
    });

    describe('serialization tests', function() {
        it('custom error', function(done) {
            var e = new Error('message'),
                s = Excpt.serialize(e);

            expect(s.name).not.to.be.undefined;
            expect(s.message).not.to.be.undefined;
            expect(s.stack).not.to.be.undefined;
            done();
        });

        it('sub type of error', function(done) {
            var e = new SyntaxError('message'),
                s = Excpt.serialize(e);

            expect(s.name).not.to.be.undefined;
            expect(s.message).not.to.be.undefined;
            expect(s.stack).not.to.be.undefined;
            done();
        });

        it('other throwables: number (map to Error)', function(done) {
            var e = 5,
                s = Excpt.serialize(e);

            expect(s.name).to.equal('Error');
            expect(s.message).not.to.be.undefined;
            expect(s.stack).not.to.be.undefined;
            done();
        });

        it('other throwables: string (map to Error)', function(done) {
            var e = 'message',
                s = Excpt.serialize(e);

            expect(s.name).to.equal('Error');
            expect(s.message).not.to.be.undefined;
            expect(s.stack).not.to.be.undefined;
            done();
        });

        it('other throwables: object (map to Error)', function(done) {
            var e = {},
                s = Excpt.serialize(e);

            expect(s.name).to.equal('Error');
            expect(s.message).not.to.be.undefined;
            expect(s.stack).not.to.be.undefined;
            done();
        });

        it('other throwables: CustomError (map to Error)', function(done) {
            var e = new CustomError("my custom error."),
                s = Excpt.serialize(e);

            expect(s.name).to.equal('Error');
            expect(s.message).not.to.be.undefined;
            expect(s.stack).not.to.be.undefined;
            done();
        });
    });

    describe('deserialize tests', function() {
        it('custom error', function(done) {
            var e = new Error('message'),
                s = Excpt.deserialize(Excpt.serialize(e));

            expect(s.name).to.equal('Error');
            expect(s.name).to.equal(e.name);
            expect(s.message).to.equal(e.message);
            expect(s.stack).to.equal(e.stack);
            expect(s).to.be.an.instanceof(Error);
            done();
        });

        it('sub type of error', function(done) {
            var e = new SyntaxError('message'),
                s = Excpt.deserialize(Excpt.serialize(e));

            expect(s.name).to.equal('SyntaxError');
            expect(s.name).to.equal(e.name);
            expect(s.message).to.equal(e.message);
            expect(s.stack).to.equal(e.stack);
            expect(s).to.be.an.instanceof(Error);
            done();
        });

        it('other throwables: number (map to Error)', function(done) {
            var e = 5,
                s = Excpt.deserialize(Excpt.serialize(e));

            expect(s.name).to.equal('Error');
            expect(s.name).not.to.be.undefined;
            expect(s.stack).not.to.be.undefined;
            expect(s).to.be.an.instanceof(Error);
            done();
        });

        it('other throwables: string (map to Error)', function(done) {
            var e = 'message',
                s = Excpt.deserialize(Excpt.serialize(e));

            expect(s.name).to.equal('Error');
            expect(s.name).not.to.be.undefined;
            expect(s.stack).not.to.be.undefined;
            expect(s).to.be.an.instanceof(Error);
            done();
        });

        it('other throwables: object (map to Error)', function(done) {
            var e = {},
                s = Excpt.deserialize(Excpt.serialize(e));

            expect(s.name).to.equal('Error');
            expect(s.message).not.to.be.undefined;
            expect(s.stack).not.to.be.undefined;
            expect(s).to.be.an.instanceof(Error);
            done();
        });

        //subtypes of Error object are mapped to Error object containing the original subtype in the message
        //because it makes no sense to recreate a custom exception on the other side as the required constructor etc.
        //might not be defined.
        
        it('other throwables: CustomError (map to Error)', function(done) {
            var e = new CustomError("my custom error."),
                s = Excpt.deserialize(Excpt.serialize(e));

            expect(s.name).to.equal('Error');
            expect(s.stack).not.to.be.undefined;
            expect(s).to.be.an.instanceof(Error);
            done();
        });
    });

});