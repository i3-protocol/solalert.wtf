const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");
const moment = require("moment");


const app = express();

const DDB_TABLE = process.env.DDB_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get("/address/:addr", async function (req, res) {
  const params = {
    TableName: DDB_TABLE,
    Key: {
      PK: `ADDRESS#${req.params.addr}`,
      SK: 'Metadata'
    },
  };

  try {
    let identifications = [];
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { PK, category, name, description, url, createdAt } = Item;
      identifications.push({ PK, category, name, description, url, createdAt });
    }

    // Query chainalysis api for address
    const { data } = await axios.get(`https://public.chainalysis.com/api/v1/address/${req.params.addr}`, {
      headers: {
        'X-API-KEY': process.env.CHAINALYSIS_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (data && data.identifications && data.identifications.length > 0) {
      identifications = identifications.concat(data.identifications);
    }

    res.json({ wallet_address: req.params.addr, identifications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive address" });
  }
});

app.post("/address", async function (req, res) {
  const { wallet_address, network = 'SOL' } = req.body;
  if (typeof wallet_address !== "string") {
    res.status(400).json({ error: '"wallet_address" must be a string' });
  } else if (typeof network !== "string") {
    res.status(400).json({ error: '"network" must be a string' });
  }

  const params = {
    TableName: DDB_TABLE,
    Item: {
      PK: wallet_address,
      SK: 'Metadata',
      network,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
  };

  try {
    await dynamoDbClient.send(new PutCommand(params));
    res.json({ wallet_address, network });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create record" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
