const express = require("express");
const cors = require("cors");
const { MongoClient} = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const clientKey = req.headers["x-api-key"];
  if (clientKey && clientKey === process.env.API_KEY) {
    next(); // 通過驗證
  } else {
    res.status(401).json({ error: "Unauthorized: invalid API key" });
  }
});

const client_customer = new MongoClient(process.env.MONGO_URI_CUSTOMER);
const client_memory = new MongoClient(process.env.MONGO_URI_MEMORY);

async function init() {
try {
    await Promise.all([client_customer.connect(), client_memory.connect()]);
    console.log("✅ Connected to both MongoDB Clusters");

    const db_customer = client_customer.db(process.env.DB_NAME_CUSTOMER); // clusterA 對應的資料庫
    const db_memory = client_memory.db(process.env.DB_NAME_MEMORY); // clusterB 對應的資料庫

    const collection_customer = db_customer.collection(process.env.COLLECTION_NAME_CUSTOMER);
    const collection_memory = db_memory.collection(process.env.COLLECTION_NAME_MEMORY);

    // === 測試 API ===
    //app.get("/", (req, res) => res.send("✅ Multi-cluster API is running!"));

    // 讀取使用者（Cluster customer）
    app.get("/"+process.env.COLLECTION_NAME_CUSTOMER, async (req, res) => {
      const data = await collection_customer.find().toArray();
      res.json(data);
    });

    // 讀取訂單（Cluster memory）
    app.get("/"+process.env.COLLECTION_NAME_MEMORY, async (req, res) => {
      const data = await collection_memory.find().toArray();
      res.json(data);
    });

    // 新增使用者（Cluster customer）
    app.post("/"+process.env.COLLECTION_NAME_CUSTOMER, async (req, res) => {
      const result = await collection_customer.insertOne(req.body);
      res.json(result);
    });

    // 新增訂單（Cluster memory）
    app.post("/"+process.env.COLLECTION_NAME_MEMORY, async (req, res) => {
      const result = await collection_memory.insertOne(req.body);
      res.json(result);
    });

    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

init();


/*client.connect().then(() => {
  const db_customer = client.db(process.env.DB_NAME_CUSTOMER);
  const collections_customer = db.collection(process.env.COLLECTION_NAME_CUSTOMER);

  app.get("/"+process.env.COLLECTION_NAME_CUSTOMER, async (req, res) => {
    const allCollections = await collections_customer().toArray();
    res.json(allCollections);
  });

  app.post("/"+process.env.COLLECTION_NAME_CUSTOMER, async (req, res) => {
    const collection = req.body;
    await collections_customer.insertOne(collection);
    res.status(201).json({ message: "Collection created", collection });
  });

  const db_memory = client.db(process.env.DB_NAME_MEMORY);
  const collections_memory = db.collection(process.env.COLLECTION_NAME_MEMORY);

  app.get("/"+ process.env.COLLECTION_NAME_MEMORY, async (req, res) => {
    const allCollections = await collections_memory().toArray();
    res.json(allCollections);
  });

  app.post("/"+ process.env.COLLECTION_NAME_MEMORY, async (req, res) => {
    const collection = req.body;
    await collections_memory.insertOne(collection);
    res.status(201).json({ message: "Collection created", collection });
  });


  app.listen(port, () =>
    console.log(`✅ Server running on port ${port}`)
  );
});*/
