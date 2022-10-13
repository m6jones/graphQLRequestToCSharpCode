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

const parseGraphQLQuery = requestJson.query.split('\n').map((value) => makeALine(`${value}\\`)).join('');

const graphQLQuery = `string graphQLQuery = "${parseGraphQLQuery}";`;

const requestBody = `string requestBody = "${convertResponse(requestJson, '{')}"`;

const parsedRequest = `${graphQLQuery}${endOfRealLine}${requestBody};`;
copyPaste.copy(parsedRequest);
console.log(parsedRequest);

string graphQLQuery = "query getConsumerOrderReceipt($orderCartId: ID!) {\\n  getConsumerOrderReceipt(orderCartId: $orderCartId) {\\n    lineItems {\\n      ...lineItemFragment\\n      __typename\\n    }\\n    splitBillLineItems {\\n      consumerId\\n      lineItems {\\n        ...lineItemFragment\\n        __typename\\n      }\\n      __typename\\n    }\\n    commissionMessage\\n    storeName\\n    receiptOrders {\\n      ...ConvReceiptOrdersFragment\\n      __typename\\n    }\\n    orders {\\n      creator {\\n        id\\n        localizedNames {\\n          formalName\\n          informalName\\n          formalNameAbbreviated\\n          __typename\\n        }\\n        __typename\\n      }\\n      orderItemsList {\\n        id\\n        specialInstructions\\n        substitutionPreference\\n        quantity\\n        originalQuantity\\n        weightedActualQuantity\\n        item {\\n          id\\n          name\\n          price\\n          description\\n          priceMonetaryFields {\\n            unitAmount\\n            currency\\n            displayString\\n            decimalPlaces\\n            sign\\n            __typename\\n          }\\n          __typename\\n        }\\n        unitPriceMonetaryFields {\\n          currency\\n          unitAmount\\n          displayString\\n          __typename\\n        }\\n        optionsList {\\n          itemExtraOption {\\n            name\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      orderItemLineDetails {\\n        ...orderLineItemDetailsFragment\\n        __typename\\n      }\\n      __typename\\n    }\\n    doordashEntityInfo {\\n      entityName\\n      entityAddress\\n      entityVatId\\n      __typename\\n    }\\n    disclaimer\\n    liquorLicense {\\n      url\\n      label\\n      __typename\\n    }\\n    overauthTotal {\\n      ...priceFragment\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment ConvReceiptOrdersFragment on OrderReceipt {\\n  creatorId\\n  orderCartItemId\\n  removedList {\\n    ...ConvItemReceiptFragment\\n    __typename\\n  }\\n  itemsList {\\n    ...ConvItemReceiptFragment\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ConvItemReceiptFragment on ItemReceipt {\\n  id\\n  specialInstructions\\n  substitutionPreference\\n  quantity\\n  originalQuantity\\n  weightedActualQuantity\\n  item {\\n    ...ConvItemReceiptDetailsFragment\\n    __typename\\n  }\\n  unitPriceMonetaryFields {\\n    displayString\\n    __typename\\n  }\\n  unitPriceWithOptionsMonetaryFields {\\n    displayString\\n    __typename\\n  }\\n  substitutedReceiptItem {\\n    quantity\\n    originalQuantity\\n    weightedActualQuantity\\n    item {\\n      ...ConvItemReceiptDetailsFragment\\n      __typename\\n    }\\n    unitPriceMonetaryFields {\\n      displayString\\n      __typename\\n    }\\n    unitPriceWithOptionsMonetaryFields {\\n      displayString\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ConvItemReceiptDetailsFragment on ItemReceiptDetails {\\n  id\\n  name\\n  description\\n  price\\n  priceMonetaryFields {\\n    displayString\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment orderLineItemDetailsFragment on OrderItemLineDetailsReceipt {\\n  ...orderLineItemDetailsBaseFragment\\n  substituteItem {\\n    ...orderLineItemDetailsBaseFragment\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment orderLineItemDetailsBaseFragment on OrderItemLineDetailsReceipt {\\n  itemName\\n  subTotal {\\n    ...priceFragment\\n    __typename\\n  }\\n  specialInstructions\\n  substitutionPreference\\n  purchaseType\\n  isOutOfStock\\n  itemOptionDetailsList\\n  weightedSoldPriceInfo\\n  requestedQuantity {\\n    ...quantityInfoFragment\\n    __typename\\n  }\\n  fulfilledQuantity {\\n    ...quantityInfoFragment\\n    __typename\\n  }\\n  lineItemToolTipModal {\\n    title\\n    paragraphs {\\n      title\\n      description\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment priceFragment on AmountMonetaryFields {\\n  currency\\n  displayString\\n  unitAmount\\n  decimalPlaces\\n  sign\\n  __typename\\n}\\n\\nfragment quantityInfoFragment on Quantity {\\n  discreteQuantity {\\n    quantity\\n    unit\\n    __typename\\n  }\\n  continuousQuantity {\\n    quantity\\n    unit\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment lineItemFragment on LineItem {\\n  label\\n  labelIcon\\n  discountIcon\\n  chargeId\\n  finalMoney {\\n    unitAmount\\n    displayString\\n    __typename\\n  }\\n  originalMoney {\\n    unitAmount\\n    displayString\\n    __typename\\n  }\\n  tooltip {\\n    title\\n    paragraphs {\\n      description\\n      __typename\\n    }\\n    __typename\\n  }\\n  note\\n  __typename\\n}\\n\\n";

string requestBody = "{\n\t\"operationName\": \"getConsumerOrderReceipt\"\n\"variables\": {\n\t\t\"orderCartId\": \"326807ff-6a8e-4a7e-9b2d-9e5356945e80\"\n	}\n\t\"query\": " + graphQLQuery + " \n	}\n";