import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
import { secureHeaders } from 'hono/secure-headers'
import { pages } from './routes/hello.route'
import { languageMiddleware } from './middleware/language.middleware';

export const web = new Hono();

// --- Registering Middlewares
web.use(secureHeaders());
web.use(csrf());
web.use(languageMiddleware);
// hier z.B. Session-Middleware (Cookies)

// --- Registering Routes
web.route('/hello', pages);         // GET /  → komplette HTML-Seite
//  .route('/ds/todos', todos); // Datastar-Endpoints → SSE


web.notFound((c) => c.html('<h1>404</h1>', 404));
