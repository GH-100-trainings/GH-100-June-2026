'use strict';

const request = require('supertest');
const app = require('../server');

describe('World Clock server', () => {
  test('serves index.html at the root path', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    expect(res.text).toContain('<title>World Clock</title>');
    expect(res.text).toContain('id="clockGrid"');
  });

  test('serves the client-side script', async () => {
    const res = await request(app).get('/app.js');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/javascript/);
    expect(res.text).toContain('Australia/Sydney');
  });

  test('serves the stylesheet', async () => {
    const res = await request(app).get('/styles.css');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/css/);
  });

  test('returns 404 for unknown paths', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.statusCode).toBe(404);
  });
});
