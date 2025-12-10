import request from 'supertest';
import { response, type Express } from 'express';
import createApi from '../../src/app';

describe('/api/users', () => {
  let app: Express;
  let name: string = 'test_name';

  beforeAll(() => {
    app = createApi(name);
  });

  it('should return an empty object', async () => {
    const response = await request(app).get('/user');
    expect(response.body).toStrictEqual({
      id: '1',
      name: 'equindar',
    });
  });
});
