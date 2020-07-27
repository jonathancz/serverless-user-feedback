const { request, response, logger } = require('@cot/lambda-helpers')
const AWS = require('aws-sdk')
const cuid = require('cuid')

module.exports.handler = async event => {
  // Create log for debugging
  const log = logger()
  
  try {
    // Use cases: if event body is empty and if parameters are not provided by user
    if(!event.body) {
      // Return a 400 error code
      return response.error('Missing event body', 400)
    }

    /**
     * TODO:
     * Justin: I want an API written in JS using AWS lambda and our serverless
     * framework that lets a user submit feedback with the following information:
     * - Who the user is (if we know)
     * - Where the button was when they clicked it
     * - Whether it was a positive or negative feedback
     * - Their feedback
     * - Their analytics tracking ID if we have one
     * - Store data in a DynamoDB table
     */

    // Get input from user
    const {name, isPositive, comment} = JSON.parse(event.body)

    // If input is empty
    if(!(name, isPositive, comment)) {
      return response.error('Missing parameters')
    }

    // Key for every feedback entry
    const feedbackId = cuid()

    // Create entry object
    const entry = {
      // https://medium.com/@oprearocks/what-do-the-three-dots-mean-in-javascript-bc5749439c9a
      // spread operator: Spread over the object and get all its properties,
      // then overwrite the existing properties with the ones we're passing
      // in this case, id
      ...JSON.parse(event.body),
      id: feedackId
    }

    log.progress('Inserting entry into table')

    // Create instance of dynamodb object
    const dynamodb = new AWS.DynamoDB.DocumentClient()

    // Pass in parameters
    const dynamoParams = {
      TableName: process.env.USER_FEEDBACK_TABLE_NAME,
      Item: entry
    }

    // Async store item in dynamodb table
    await dynamodb.put(dynamoParams).promise()

    // Return entry ID if successfully stored in table
    return response.success({
      id: feedbackId
    })

  // Else, error
  } catch(error) {
    // Log error

    // Cloudwatch
    log.error('Something went wrong in `submitFeedback` message: ',error)
    // Console
    return response.error('Something went wrong')
  }
  
}

