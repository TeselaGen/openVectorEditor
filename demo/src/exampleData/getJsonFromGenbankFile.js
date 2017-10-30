const bioParsers = require('bio-parsers')
const fs = require('fs')

const string = fs.readFileSync('./exampleData/JBx_078420.gb',"utf8")
console.log('string:',string)
bioParsers.genbankToJson(string, (res) => {
  console.log('res[0].parsedSequence:',JSON.stringify(res[0].parsedSequence,null,4))
})