import { createApp } from './app.js';
import { httpServer } from './http.js';

const port = Number(process.env.PORT || 3000);
const server = httpServer(createApp());
server.listen(port, '127.0.0.1', () => console.log(`Material Request: http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
