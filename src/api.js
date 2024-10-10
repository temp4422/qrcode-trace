import * as fs from 'node:fs'
import { Console } from 'console'

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
  // const qrcodeTraceUrl = `https://qrcode-trace.duckdns.org/${timestampId}`
  const qrcodeTraceUrl = `http://localhost:3000/trace?url=${timestampId}`
  return qrcodeTraceUrl
}

function traceUrl(targetTimestamp) {
  let redirectUrl = map.get(Number(targetTimestamp))
  if (!redirectUrl.includes('http')) redirectUrl = 'http://' + redirectUrl
  const tracePage = fs.readFileSync('./src/trace.html', 'utf-8')
  const tracePageWithRedirect = tracePage.replace('targetUrl', redirectUrl)
  return { redirectUrl, tracePageWithRedirect }
}

function downloadQrcode(params) {}

export { fconsole, generateUrl, traceUrl }
