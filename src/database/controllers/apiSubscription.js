const axios = require("axios");

async function createLink(request, response) {
  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/links",
      {
        data: {
          attribute: {
            amount: 12900,
            description: "Subscription for VerdiQuest",
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            "sk_test_Po7Yyc5yDxdHNgNxWbgMsRTq"
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createLink,
};
