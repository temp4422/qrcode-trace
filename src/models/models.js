import fs from 'node:fs'
import url from 'node:url'
import QRCode from 'qrcode'
import { mongoDbClient } from '../server.js'

// const host = 'https://qrcode-trace.duckdns.org'
const host = 'http://localhost:3000'

// Use HashMap if not using mongodb
const map = new Map()

// Insert data into database
async function insertInMongodb(targetUrl, timestampId, req) {
  const data = {
    createdOn: new Date(),
    timestampId: timestampId,
    targetUrl: targetUrl,
    userData: { requestIP: req.socket.remoteAddress, requestHeaders: req.headers },
  }

  await mongoDbClient.connect()

  const insertedObj = await mongoDbClient
    .db('qrcode-trace-db')
    .collection('data-collection')
    .insertOne(data)

  console.log(insertedObj)
}

function generateUrl(req) {
  const targetUrl = url.parse(req.url).query.slice(4)
  const timestampId = Number(new Date().getTime())

  // insertInMongodb(targetUrl, timestampId, req)
  map.set(timestampId, targetUrl) // Use HashMap if not using mongodb

  QRCode.toFile('./dist/qrcode.png', `${host}/trace?url=${timestampId}`)
  const qrcodeTraceUrl = `${host}/trace?url=${timestampId}`
  return qrcodeTraceUrl
}

function traceUrl(targetTimestamp) {
  let redirectUrl = map.get(Number(targetTimestamp))
  if (!redirectUrl.includes('http')) redirectUrl = 'http://' + redirectUrl
  const tracePage = fs.readFileSync('./src/trace.html', 'utf-8')
  const tracePageWithRedirect = tracePage.replace('targetUrl', redirectUrl)
  return tracePageWithRedirect
}

export { generateUrl, traceUrl }
