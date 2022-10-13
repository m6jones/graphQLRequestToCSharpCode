const copyPaste = require("copy-paste")
const endOfLine = '\\n';
const endOfRealLine = `\n`;
const makeALine = (line, numberOfTabs = 0) => { 
    let tabs = '';
    for (let i = 0; i < numberOfTabs; i++) {
        tabs += '\\t';
    }
    return `"${tabs}${line}${endOfLine}" + ${endOfRealLine}`;
}

const request = copyPaste.paste();
const requestJson = JSON.parse(request);


const convertResponse = (requestJson, prefix, numberOfTabs = 1) => {
    let csharpString = makeALine(`${prefix}`);
    Object.keys(requestJson).forEach((key) => {
        csharpString += '\t';
        if (key === 'query') {
            csharpString += makeALine(`\\"${key}\\": " + graphQLQuery + " `, numberOfTabs);
        } else if (typeof requestJson[key] === 'string') {
            csharpString += makeALine(`\\"${key}\\": \\"${requestJson[key]}\\"`, numberOfTabs);
        } else if (typeof requestJson[key] === 'number') {
            csharpString += makeALine(`\\"${key}\\": ${requestJson[key]}`, numberOfTabs);
        } else {
            csharpString += convertResponse(requestJson[key], `\\"${key}\\": {`, numberOfTabs+1);
        }
    });
    return `${csharpString}\t${makeALine('}')}`;
};

const parseGraphQLQuery = requestJson.query.split('\n').map((value) => makeALine(`${value}\\`)).join('\t').slice(0,-4);

const graphQLQuery = `string graphQLQuery = ${parseGraphQLQuery};`;

const requestBody = `string requestBody = ${convertResponse(requestJson, '{')}`.slice(0,-4);

const parsedRequest = `${graphQLQuery}${endOfRealLine}${endOfRealLine}${requestBody};`;
copyPaste.copy(parsedRequest);
console.log(parsedRequest);