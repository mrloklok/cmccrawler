const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
exports.handler = async (event, context, callback) => {
  // const requestId = context.awsRequestId;
  // await createJSONData(requestId).then(e=>{
  //     callback(null,{
  //         statusCode: 200,
  //         body: '',
  //         headers:{
  //             'Access-Control-Allow-Orgin': '*'
  //         }
  //     });
  // }).catch(err=>{
  //     console.error(err);
  // })
  await readJSONData().then(data => {
    data.Items.forEach((e) => {
      console.log(e);
    })
    callback(null, {
      statusCode: 200,
      body: '',
      headers: {
        'Access-Control-Allow-Orgin': '*'
      }
    });
  }).catch(err => {
    console.error(err);
  })
};

function createJSONData(cmcData) {
  const params = {
    TableName: "cmcdb",
    Item: cmcData
  }
  return ddb.put(params).promise();
}

function readJSONData() {
  const params = {
    TableName: "cmcdb",
    Limit: 20000
  }
  return ddb.scan(params).promise();
}
module.exports = {
  createJSONData,
  readJSONData
};