const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockDuck = {
  email: 'test@example.com',
  password: '12345',
};

const mockSecret = {
  title: 'wubalubadubdub',
  description: 'im a pickle, morty',
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
  it('returns a list of secrets for logged in user', async() => {
    const [agent] = await registerAndLogin();
  
    const res = await agent 
      .get('/api/v1/secrets');
    expect(res.status).toEqual(200);
  });
  it('create new user using mockDuck', async () => {
    const [agent] = await registerAndLogin();
    const response = await agent.post('/api/v1/secrets').send(mockSecret);

    expect(response.body.title).toBe('wubalubadubdub');
  });
  
  afterAll(() => {
    pool.end();
  });
});
