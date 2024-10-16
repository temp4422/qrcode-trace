// import { server } from '../server.js'

// server((req, res) => {
//   const reqUrl = url.parse(req.url)
//   let targetUrl
//   if (reqUrl.query) targetUrl = reqUrl.query.slice(4) // remove 'url='

//   switch (reqUrl.pathname) {
//     case '/':
//       res.statusCode = 200
//       res.setHeader('Content-Type', 'text/html')
//       fs.readFile('./src/views/index.html', (err, data) => res.end(data))
//       break
//     case '/generate':
//       res.statusCode = 200
//       // res.end(generateUrl(targetUrl, req.socket.remoteAddress, req.headers))
//       res.end(generateUrl(targetUrl))
//       break
//     case '/trace':
//       res.statusCode = 200
//       res.setHeader('Content-Type', 'text/html')
//       res.end(traceUrl(targetUrl))
//       break
//     case '/get':
//       res.statusCode = 200
//       res.setHeader('Content-Type', 'image/png')
//       fs.readFile('./dist/qrcode.png', (err, data) => res.end(data))
//       break
//     default:
//       res.statusCode = 404
//       res.end('Not found')
//   }
// })
