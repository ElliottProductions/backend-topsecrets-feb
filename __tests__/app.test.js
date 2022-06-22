const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockDuck = {
  email: 'test@example.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockDuck.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockDuck, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('create new user using mockDuck', async () => {
    const response = await request(app).post('/api/v1/users').send(mockDuck);

    expect(response.body.email).toBe('test@example.com');
  });
  it('LOGIN user mockDuck', async () => {
    await request(app).post('/api/v1/users').send(mockDuck);
    const response = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com',
        password: '12345' });

    expect(response.status).toEqual(200);
  });
  it.only('LOGOUT user mockDuck', async () => {
    await request(app).post('/api/v1/users').send(mockDuck);
    await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com',
        password: '12345' });
    const response = await request(app).delete('/api/v1/users/sessions');

    expect(response.status).toEqual(200);
  });
  afterAll(() => {
    pool.end();
  });
});
