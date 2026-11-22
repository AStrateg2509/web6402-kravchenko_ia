const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const registrations = [];
const meetings = ['2026-12-04', '2026-12-18'];
const pages = ['index.html', 'games.html', 'schedule.html', 'contacts.html'];
const files = new Set([...pages, 'css/style.css', 'registration.js',
  'images/meeple.svg', 'images/photo_2026-05-12_20-10-39.jpg']);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };

function reply(response, status, message) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify({ message }));
}

async function register(request, response) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 4096) return reply(response, 413, 'Слишком длинная заявка.');
    chunks.push(chunk);
  }
  let data;
  try {
    data = JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    return reply(response, 400, 'Ожидались данные в формате JSON.');
  }
  if (typeof data?.name !== 'string' || !data.name.trim() || data.name.length > 100 ||
      typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+$/.test(data.email) ||
      !meetings.includes(data.meeting) || data.accepted !== true) {
    return reply(response, 400, 'Проверьте имя, почту, встречу и согласие с правилами.');
  }
  registrations.push({ name: data.name.trim(), email: data.email, meeting: data.meeting });
  reply(response, 201, 'Заявка принята. До встречи на игротеке!');
}

http.createServer(async (request, response) => {
  try {
    const route = request.url.split('?')[0];
    if (route === '/api/registrations' && request.method === 'POST') {
      await register(request, response);
      return;
    }
    const file = route === '/' ? 'index.html' : route.slice(1);
    if (request.method !== 'GET' || !files.has(file)) {
      return reply(response, 404, 'Страница не найдена.');
    }
    const content = await fs.readFile(path.join(__dirname, file));
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] });
    response.end(content);
  } catch {
    reply(response, 500, 'Не удалось обработать запрос.');
  }
}).listen(3000, '127.0.0.1', () => console.log('Гильдия: http://127.0.0.1:3000'));
