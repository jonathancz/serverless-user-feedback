const { request, response, logger } = require('@cot/lambda-helpers')
const AWS = require('aws-sdk')

module.exports.handler = async event => {
  const log = logger()
  try{
    const tableName = process.env.USER_FEEDBACK_TABLE_NAME
    const dynamodb = new AWS.DynamoDB.DocumentClient()

    var params = {
        TableName: tableName,
    }

    console.log('Scanning contacts table')
    const result = await dynamodb.scan(params).promise()
    return response.success(result.Items)
  } catch(error) {
    log.error('something went wrong in `getFeedback`, message: ', error)
    return response.error('Something went wrong')
  }
}