const http = require('http');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const koaStatic = require('koa-static');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const WS = require('ws');

const Chat = require('./Chat');

const server = http.createServer(app.callback()).listen(7050);

// Static file handling
const public = path.join(__dirname, '/public')
app.use(koaStatic(public));

// => CORS
app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
  };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({
      ...headers
    });
    try {
      return await next();
    } catch (e) {
      e.headers = {
        ...e.headers,
        ...headers
      };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

// => Body Parsers
app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const chat = new Chat();

const clients = [];

const wsServer = new WS.Server({
  server
});
wsServer.on('connection', (socket, req) => {
  socket.on('message', msg => {
    const data = JSON.parse(msg);
    if (data.event === 'login') {
      socket.send(JSON.stringify({
        event: 'connect'
      }))
      clients.push(socket);
    }
    if (data.event === 'chat') {
      for (let client of clients) {
        const chatMessage = JSON.stringify({
          event: 'chat',
          message: {
            date: Date.now(),
            text: data.message
          }
        });
        client.send(chatMessage);
      }
    }
    if (data.event === 'command') {
      for (let client of clients) {
        const chatMessage = JSON.stringify({
          event: 'chat',
          message: {
            date: Date.now(),
            text: chat.command(data.message)
          }
        });
        client.send(chatMessage);
      }
    }
  })
});

app.use(async ctx => {
  if (ctx.request.body) {
    let request
    if (typeof ctx.request.body === 'string') {
      request = JSON.parse(ctx.request.body)
    } else {
      request = ctx.request.body
    }

    request.date = Date.now()

    const {
      event
    } = request;
    switch (event) {
      case 'chat':
        ctx.response.body = JSON.stringify(request);
        chat.addChat(request.event, request.message, request.date)
        return;
      case 'file':
        chat.addChat(request.event, request.files, request.date)
        return;
      case 'allChats':
        ctx.response.body = JSON.stringify(chat.allChatList());
        return;
    }
  }

});