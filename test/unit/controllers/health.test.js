import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonStubPromise from 'sinon-stub-promise';

import { healthController, healthResponses } from '../../../controllers/health';
import db from '../../../models';

// Set up chai.should()
chai.should();

// Set up sinon-chai
chai.use(sinonChai);

// testing of promises easier when stubbing with Sinon
sinonStubPromise(sinon);

// Get expect function
const { expect } = chai;

describe('Health Controller', () => {
  let res = {};
  let sandbox;

  before(() => {
    // Create sinon sandbox
    sandbox = sinon.sandbox.create();
  });

  beforeEach(() => {
    res = {
      status: sandbox.stub().returnsThis(), // NOTE: Makes stubs chain-able
      json: sandbox.stub(),
    };
  });

  afterEach(() => {
    // Restore sinon sandbox
    sandbox.restore();
    res = {};
  });

  describe('health method', () => {
    it('should call `status` with a 200 and `json` with a health response object', () => {
      // Call method
      healthController.health({}, res);

      // Verify stubs were called
      res.status.should.have.been.calledWith(200);
      res.json.should.have.been.calledWith(healthResponses.health());
    });
  });

  describe('ready method', () => {
    beforeEach(() => {
      // Stub method
      sandbox.stub(healthResponses, 'checkPostgres').resolves('ok');
    });

    it('should call `status` with a 200 and `json` with a ready response object', done => {
      // Call method
      healthController.ready({}, res);

      setTimeout(() => {
        // Verify stubs were called
        res.status.should.have.been.calledWith(200);
        res.json.should.have.been.called;

        // Indicate test is done
        done();
      }, 1);
    });
  });

  describe('version method', () => {
    it('should call `status` with a 200 and `json` with a version response object', () => {
      // Call method
      healthController.version({}, res);

      // Verify stubs were called
      res.status.should.have.been.calledWith(200);
      res.json.should.have.been.calledWith(healthResponses.version());
    });
  });

  describe('healthResponses.health method', () => {
    it('should return a health response object', () => {
      // Call method
      res = healthResponses.health();

      // Verify return value
      res.should.have.property('meta');
      res.should.have.property('data');
      res.should.have.nested.property('data.uptime');
    });
  });

  describe('healthResponses.ready method', () => {
    beforeEach(() => {
      // Stub method
      sandbox.stub(healthResponses, 'checkPostgres').resolves('ok');
    });

    it('should return a ready response object', done => {
      // Call method
      healthResponses.ready({}, res);

      setTimeout(() => {
        // Verify stubs were called
        res.status.should.have.been.calledWith(200);

        // Get stub call args
        const args = res.json.firstCall.args[0];

        // Verify response data
        args.should.have.property('meta');
        args.should.have.property('data');
        args.should.have.nested.property('data.uptime');
        args.should.have.nested.property('data.service', 'ok');
        args.should.have.nested.property('data.postgres', 'ok');

        // Indicate test is done
        done();
      }, 1);
    });
  });

  describe('healthResponses.version method', () => {
    it('should return a version response object', () => {
      // Call method
      res = healthResponses.version();

      // Verify return value
      res.should.have.property('meta');
      res.should.have.property('data');
      res.should.have.nested.property('data.uptime');
      res.should.have.nested.property('data.version');
    });
  });

  describe('healthResponses.checkPostgres method', () => {
    beforeEach(() => {
      sandbox.stub(db.sequelize, 'authenticate').returnsPromise();
    });

    it('should call db.sequelize.authenticate in checkPostgres ', () => {
      // Call method
      healthResponses.ready({}, res);

      // Verify that the authenticate is called
      expect(db.sequelize.authenticate).to.have.been.called;
    });
  });
});
