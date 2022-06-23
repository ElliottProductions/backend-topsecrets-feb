const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockDuck = {
  email: 'test@example.com',
  password: '12345',
};



describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('returns a list of secrets for logged in user', async() => {
    const agent = request.agent(app);
    const expected = 'PLEURODELES WALTL';
    await agent
      .post('/api/v1/users')
      .send(mockDuck);
    await agent
      .post('/api/v1/users/sessions')
      .send(mockDuck);
    const res = await agent 
      .get('/api/v1/secrets');
    expect(res.body).toEqual(expected);
  });
  
  afterAll(() => {
    pool.end();
  });
});
