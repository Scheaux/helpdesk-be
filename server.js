const http = require('http');
const Koa = require('koa');
const cors = require('koa-cors');
const koaBody = require('koa-body');

const app = new Koa();

const tickets = [
  {
    id: 'abc123',
    name: 'Test ticket 1',
    description: 'Test description',
    status: false,
    created: '07.05.2022'
  },
  {
    id: 'asd321',
    name: 'Test ticket 2',
    description: 'Test description 2',
    status: true,
    created: '01.01.1970'
  }
];

app.use(cors());

app.use(koaBody({
  urlencoded: true
}));

function addTicket(req) {
  const uniq = 'id' + (new Date()).getTime();
  const ticket = {
    id: uniq,
    name: req.name,
    description: req.description,
    status: JSON.parse(req.status),
    created: req.created
  };
  return ticket;
}

app.use(async (ctx) => {
  const { method } = ctx.request.query;

  switch (method) {
    case 'allTickets':
      const clone = JSON.parse(JSON.stringify(tickets));
      clone.map((x) => delete x.description);
      ctx.response.body = clone;
      return;
    case 'ticketById':
      const { id } = ctx.request.query;
      ctx.response.body = tickets.find(e => e.id === id);
    case 'createTicket':
      tickets.push(addTicket(ctx.request.body));
      ctx.response.body = true;
      return;

    default:
      ctx.response.status = 404;
      return;
  }
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
