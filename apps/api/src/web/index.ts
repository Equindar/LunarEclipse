import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
import { secureHeaders } from 'hono/secure-headers'
import { pages } from './routes/pages'
import { todos } from './routes/todos'
import { languageMiddleware } from './middleware/language.middleware';

export const web = new Hono()
  // --- Registering Middlewares
  .use(secureHeaders())
  .use(csrf())
  .use(languageMiddleware)
  // hier z.B. Session-Middleware (Cookies)

  // --- Registering Routes
  .route('/', pages)         // GET /  → komplette HTML-Seite
  .route('/ds/todos', todos) // Datastar-Endpoints → SSE


  .notFound((c) => c.html('<h1>404</h1>', 404))
