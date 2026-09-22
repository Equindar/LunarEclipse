import { Hono } from 'hono'
import { cors } from 'hono/cors'
// import { todos } from './routes/todos'
import health from './routes/health.route'
import status from './routes/status.route'
import { NotFoundError } from './errors/NotFoundError';

export const data = new Hono()
  // --- Registering Middlewares
  .use(cors())
  // hier z.B. bearerAuth / jwt
  // .route('/todos', todos)

  // --- Registering Routes
  .route('/health', health)
  .route('/status', status)

  .notFound((c) => c.json({ error: 'Not found' }, 404))
  .onError((err, c) => {
    console.error(err);
    throw new NotFoundError('Resource not found');
    return c.json({ error: 'Internal error' }, 500)
  })

// für den typsicheren RPC-Client (hc<DataApp>)
export type DataApp = typeof data
