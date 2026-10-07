import { Hono } from 'hono'
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web'

export const todos = new Hono()
  .post('/', async (c) => {
    const { title } = await ServerSentEventGenerator.readSignals(c.req.raw)
      .then((r) => (r.success ? r.signals : { title: '' }))

    if (title) todoService.create(String(title))

    return ServerSentEventGenerator.stream((stream) => {
      stream.patchElements((<TodoList todos={todoService.list()} />).toString())
      stream.patchSignals(JSON.stringify({ title: '' }))
    })
  })
  .post('/:id/toggle', (c) => {
    todoService.toggle(c.req.param('id'))
    return ServerSentEventGenerator.stream((stream) => {
      stream.patchElements((<TodoList todos={todoService.list()} />).toString())
    })
  })
