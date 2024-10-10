import fs from 'node:fs'
import QRCode from 'qrcode'
import { Console } from 'console'

// const host = 'https://qrcode-trace.duckdns.org'
const host = 'http://localhost:3000'

// Log to file
const filePath = './logs.txt'
if (!fs.existsSync(filePath)) {
  fs.writeFile(filePath, new Date().toString(), (err) => err)
}
const fconsole = new Console({ stdout: fs.createWriteStream(filePath, { flags: 'a' }) })

const map = new Map()

function generateUrl(targetUrl) {
  const timestampId = Number(new Date().getTime())
  map.set(timestampId, targetUrl.toString())
  const qrcodeTraceUrl = `${host}/trace?url=${timestampId}`

  QRCode.toFile('./dist/qrcode.png', `${host}/trace?=${timestampId}`)
  return qrcodeTraceUrl
}

function traceUrl(targetTimestamp) {
  let redirectUrl = map.get(Number(targetTimestamp))
  if (!redirectUrl.includes('http')) redirectUrl = 'http://' + redirectUrl
  const tracePage = fs.readFileSync('./src/trace.html', 'utf-8')
  const tracePageWithRedirect = tracePage.replace('targetUrl', redirectUrl)
  return tracePageWithRedirect
}

function getQrcode() {}

export { fconsole, generateUrl, traceUrl, getQrcode }
