const copyPaste = require("copy-paste")
const endOfLine = '\\n';
const endOfRealLine = `\r\n`;
const makeALine = (line, numberOfTabs = 0) => { 
    let tabs = '';
    for (let i = 0; i < numberOfTabs; i++) {
        tabs += '\\t';
    }
    return `${tabs}${line}${endOfLine}`;
}

const request = copyPaste.paste();
const requestJson = JSON.parse(request);


const convertResponse = (requestJson, prefix, numberOfTabs = 1) => {
    let csharpString = makeALine(`${prefix}`);
    Object.keys(requestJson).forEach((key) => {
        //csharpString += '\t';
        if (key === 'query') {
            csharpString += makeALine(`\\"${key}\\": \\"" + graphQLQuery + "\\", `, numberOfTabs);
        } else if (typeof requestJson[key] === 'string') {
            csharpString += makeALine(`\\"${key}\\": \\"${requestJson[key]}\\", `, numberOfTabs);
        } else if (typeof requestJson[key] === 'number') {
            csharpString += makeALine(`\\"${key}\\": ${requestJson[key]}, `, numberOfTabs);
        } else if (typeof requestJson[key] === 'boolean') {
            csharpString += makeALine(`\\"${key}\\": \\"${requestJson[key] ? 'true' : 'false'}\\", `, numberOfTabs);
        } else {
            csharpString += convertResponse(requestJson[key], `\\"${key}\\": {`, numberOfTabs+1);
        }
    });
    return `${csharpString}\t${makeALine('}')}`;
};

const parseGraphQLQuery = requestJson.query.split('\n').map((value) => makeALine(`${value}\\`)).join('');

const graphQLQuery = `string graphQLQuery = "${parseGraphQLQuery}";`;

const requestBody = `string requestBody = "${convertResponse(requestJson, '{')}"`;

const parsedRequest = `${graphQLQuery}${endOfRealLine}${requestBody};`;
copyPaste.copy(parsedRequest);
console.log(parsedRequest);