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

// Read data from database
async function readFromMongodb(targetTimestamp) {
  await mongoDbClient.connect()

  const data = await mongoDbClient
    .db('qrcode-trace-db')
    .collection('data-collection')
    .findOne({ timestampId: Number(targetTimestamp) })

  const readObj = JSON.stringify(data, null, 2) // pretty print
  console.log(readObj)
  return data.targetUrl
}

function generateUrl(req) {
  const targetUrl = url.parse(req.url).query.slice(4)
  const timestampId = Number(new Date().getTime())

  insertInMongodb(targetUrl, timestampId, req)
  // map.set(timestampId, targetUrl) // Use HashMap if not using mongodb

  QRCode.toFile('./dist/qrcode.png', `${host}/trace?url=${timestampId}`)
  const qrcodeTraceUrl = `${host}/trace?url=${timestampId}`
  return qrcodeTraceUrl
}

function traceUrl(targetTimestamp) {
  // readFromMongodb(targetTimestamp).then((data) => (redirectUrl = data))
  readFromMongodb(targetTimestamp)
  let redirectUrl
  console.log(redirectUrl)
  // let redirectUrl = map.get(Number(targetTimestamp))

  if (!redirectUrl) {
    return fs.readFileSync('./src/views/not-found.html', 'utf-8')
  }
  if (!redirectUrl.includes('http')) {
    redirectUrl = 'http://' + redirectUrl
  }

  const tracePage = fs.readFileSync('./src/views/trace.html', 'utf-8')
  const tracePageWithRedirect = tracePage.replace('targetUrl', redirectUrl)
  return tracePageWithRedirect
}

export { generateUrl, traceUrl }
