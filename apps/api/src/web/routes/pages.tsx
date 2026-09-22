import { Hono } from 'hono';
import { Layout } from '../components/layout';

export const pages = new Hono().get('/', (c) =>
  c.html(
    <Layout title="Todos">
      <h1>Todos</h1>
    </Layout>,
  ),
)
