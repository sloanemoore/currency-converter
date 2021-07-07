// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const axios = require("axios");

const handler = async (event) => {
  const {currencyFromAbbrev, currencyToAbbrev} = event.queryStringParameters;
  const API_SECRET = process.env.API_SECRET
  const url = `https://v6.exchangerate-api.com/v6/${API_SECRET}/pair/${currencyFromAbbrev}/${currencyToAbbrev}`
  try {
    const {data} = await axios.get(url)
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
