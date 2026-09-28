const { Client } = require('./node_modules/.pnpm/pg@8.22.0/node_modules/pg');
const c = new Client({ host: '127.0.0.1', port: 5432, user: 'qunxiang', password: 'change_me_in_production', database: 'qunxiang' });
c.connect().then(async () => {
  const books = await c.query('SELECT id, title FROM "Book" ORDER BY "createdAt" DESC LIMIT 4');
  for (const b of books.rows) {
    console.log('==', b.title, b.id.slice(0, 8));
    const t = await c.query('SELECT status, agent_type, "createdAt", "startedAt", "finishedAt" FROM extraction_task WHERE book_id = $1 ORDER BY "createdAt" DESC LIMIT 6', [b.id]);
    for (const x of t.rows) {
      console.log('  ', x.agent_type, '|', x.status, '| created:', x.createdAt && x.createdAt.toISOString().slice(11, 19), '| started:', x.startedAt && x.startedAt.toISOString().slice(11, 19), '| finished:', x.finishedAt && x.finishedAt.toISOString().slice(11, 19));
    }
  }
  await c.end();
}).catch(e => { console.error(e.message); process.exit(1); });
