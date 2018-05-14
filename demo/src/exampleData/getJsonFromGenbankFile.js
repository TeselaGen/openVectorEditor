const bioParsers = require('bio-parsers')
const fs = require('fs')

const string = fs.readFileSync('./exampleData/JBx_078420.gb',"utf8")
console.info('string:',string)
bioParsers.genbankToJson(string, (res) => {
  console.info('res[0].parsedSequence:',JSON.stringify(res[0].parsedSequence,null,4))
})