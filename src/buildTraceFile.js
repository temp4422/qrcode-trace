import * as fs from 'node:fs'

function buildTraceFile(data) {
  const fileContent = fs.readFileSync('./src/trace.html', 'utf-8')
  const newFileContent = fileContent.replace('targetUrl', `'${data}'`)
  return newFileContent
}

export { buildTraceFile }
