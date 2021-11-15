const { extractNewListingsFromHTML, extractDataFromListing, extractDatumFromListing } = require('./html/parseHtml');
const { createJSONData, readJSONData } = require('./ddb/db');
const { sendMessage } = require('./telegram/tele-bot');
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
const fncHandler = async (event, context, callback) => {
    // let itemCount = 0;
    // await readJSONData().then(data => {
    //     itemCount = data.Items.length;
    // }).catch(err => {
    //     console.error(err);
    //     callback(null, {
    //         statusCode: 400,
    //         message: 'Read DDB failed'
    //     })
    // });

    const coins = await extractNewListingsFromHTML(callback);
    const jsonData = coins.map(async e => {
        return await extractDatumFromListing(e, callback);
    });
    Promise.all(jsonData).then(async (val) => {
        console.log("🚀 ~ file: app.js ~ line 33 ~ Promise.all ~ val", val);
        await createJSONData(val).then(e => {
            console.log('Successfully inserted', val);
        }).catch(err => {
            console.error(err);
            callback(null, {
                statusCode: 400,
                message: 'Insert DDB failed'
            })
        })
        await readJSONData().then(data => {
            if (data.Items.length > itemCount) {
                for (let i = 0; i < data.Item.length - itemCount; ++i) {
                    sendMessage('Greetings! Check out!', val[i]);
                }
            }
        }).catch(err => {
            console.error(err);
            callback(null, {
                statusCode: 400,
                message: 'Read DDB failed'
            })
        });
    })

};
exports.lambdaHandler = fncHandler;

lambdaHandler = fncHandler;
lambdaHandler();