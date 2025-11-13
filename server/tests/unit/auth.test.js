// auth.test.js - Unit tests for auth middleware and token generation
const { generateToken, authMiddleware } = require('../../src/utils/auth');

function mockReq(headers = {}) {
  return { headers };
}
function mockRes() {
  return {
    statusCode: 200,
    _json: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this._json = obj; return this; },
  };
}

function nextFn() { nextFn.called = true; }

describe('auth utils', () => {
  it('generateToken returns a JWT string', () => {
    const token = generateToken({ _id: 'user1' });
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  it('authMiddleware returns 401 when header is missing', () => {
    const req = mockReq();
    const res = mockRes();
    nextFn.called = false;

    authMiddleware(req, res, nextFn);
    expect(res.statusCode).toBe(401);
    expect(res._json).toEqual({ error: 'Unauthorized' });
    expect(nextFn.called).toBeFalsy();
  });

  it('authMiddleware sets req.user and calls next when token is valid', () => {
    const token = generateToken({ _id: 'abc123' });
    const req = mockReq({ authorization: `Bearer ${token}` });
    const res = mockRes();
    nextFn.called = false;

    authMiddleware(req, res, nextFn);
    expect(nextFn.called).toBeTruthy();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('abc123');
  });
});
