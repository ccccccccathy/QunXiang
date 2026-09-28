const { Client } = require('./node_modules/.pnpm/pg@8.22.0/node_modules/pg');
const c = new Client({ host: '127.0.0.1', port: 5432, user: 'qunxiang', password: 'change_me_in_production', database: 'qunxiang' });
c.connect().then(async () => {
  const books = await c.query('SELECT id, title, "fileSize" FROM "Book" ORDER BY "createdAt"');
  for (const b of books.rows) {
    const ch = await c.query('SELECT COUNT(*) FROM "Character" WHERE "bookId"=$1', [b.id]);
    const loc = await c.query('SELECT COUNT(*) FROM "Location" WHERE "bookId"=$1', [b.id]);
    const it = await c.query('SELECT COUNT(*) FROM "Item" WHERE "bookId"=$1', [b.id]);
    const wv = await c.query('SELECT COUNT(*) FROM "WorldviewSetting" WHERE "bookId"=$1', [b.id]);
    const wan = Math.round(b.fileSize / 2 / 10000) / 10; // GBK 中文约2字节/字
    console.log('== ' + b.title + '（约 ' + wan + ' 万字，' + Math.round(b.fileSize / 1024) + ' KB）');
    console.log('   角色 ' + ch.rows[0].count + ' | 地点 ' + loc.rows[0].count + ' | 道具 ' + it.rows[0].count + ' | 世界观 ' + wv.rows[0].count);
    const sess = await c.query('SELECT status, "createdAt", "startedAt", "completedAt" FROM "ExtractionSession" WHERE "bookId"=$1 ORDER BY "createdAt" DESC', [b.id]);
    for (const s of sess.rows) {
      const dur = s.startedAt && s.completedAt ? ((s.completedAt - s.startedAt) / 60000).toFixed(1) : null;
      const f = d => d ? d.toISOString().replace('T', ' ').slice(5, 16) : '-';
      console.log('   会话 ' + s.status + ' | 开始 ' + f(s.startedAt) + ' | 完成 ' + f(s.completedAt) + (dur ? ' | 纯运行 ' + dur + ' 分钟' : ''));
    }
  }
  await c.end();
}).catch(e => { console.error(e.message); process.exit(1); });
