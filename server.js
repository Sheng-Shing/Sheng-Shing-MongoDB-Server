const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ /ping 不需要 API Key（給 FastCron 喚醒 Render）
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// ✅ 其他 API 需要 API Key
app.use((req, res, next) => {
  const clientKey = req.headers["x-api-key"];
  if (clientKey && clientKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized: invalid API key" });
  }
});

// ✅ 連兩個 MongoDB Cluster
const client_customer = new MongoClient(process.env.MONGO_URI_CUSTOMER);
const client_memory = new MongoClient(process.env.MONGO_URI_MEMORY);

async function init() {
  try {
    await Promise.all([
      client_customer.connect(),
      client_memory.connect()
    ]);

    console.log("✅ Connected to both MongoDB Clusters");

    const db_customer = client_customer.db(process.env.DB_NAME_CUSTOMER);
    const db_memory = client_memory.db(process.env.DB_NAME_MEMORY);

    const collection_customer =
      db_customer.collection(process.env.COLLECTION_NAME_CUSTOMER);

    const collection_memory =
      db_memory.collection(process.env.COLLECTION_NAME_MEMORY);

    // ✅ API (customer)
    app.get(`/${process.env.COLLECTION_NAME_CUSTOMER}`, async (req, res) => {
      const data = await collection_customer.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_CUSTOMER}`, async (req, res) => {
      const result = await collection_customer.insertOne(req.body);
      res.json(result);
    });

    // ✅ API (memory)
    app.get(`/${process.env.COLLECTION_NAME_MEMORY}`, async (req, res) => {
      const data = await collection_memory.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_MEMORY}`, async (req, res) => {
      const result = await collection_memory.insertOne(req.body);
      res.json(result);
    });

    // ✅ 正確使用 port（必要！）
    app.listen(port, () =>
      console.log(`🚀 Server running on port ${port}`)
    );

  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

init();
