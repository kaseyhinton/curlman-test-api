import { serveStatic } from 'hono/bun'
import { Hono } from 'hono'
import countries from './countries';
import { cors } from 'hono/cors';

const app = new Hono()

app.use('/*', cors())
app.use('/static/*', serveStatic({ root: './' }))

app.get('/', (c) => c.text('Hello Bun!'))

app.get("/countries", (c) => {
    const filter = c.req.query('filter');
    if (filter) {
      const filteredCountries =
        countries.filter((country) =>
          country.name.toLowerCase().includes(filter.toLowerCase())
        ) ?? [];
      return c.json(filteredCountries);
    }
    return c.json(countries);
  });

export default { 
    port: 4000, 
    fetch: app.fetch, 
  } 