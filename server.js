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

// ✅ 連 9 個 MongoDB Cluster
const client_customer = new MongoClient(process.env.MONGO_URI_CUSTOMER);
const client_memory = new MongoClient(process.env.MONGO_URI_MEMORY);

const client_member = new MongoClient(process.env.MONGO_URI_MEMBER);

const client_ballexercise = new MongoClient(process.env.MONGO_URI_BALLEXERCISE);
const client_griptrainer = new MongoClient(process.env.MONGO_URI_GRIPTRAINER);
const client_balldrum = new MongoClient(process.env.MONGO_URI_BALLDRUM);

const client_ballsquid = new MongoClient(process.env.MONGO_URI_BALLSQUID);

const client_ocarina = new MongoClient(process.env.MONGO_URI_OCARINA);
//const client_balltrip = new MongoClient(process.env.MONGO_URI_BALLTRIP);

async function init() {
  try {
    await Promise.all([
      client_customer.connect(),
      client_memory.connect()
    ]);

    console.log("✅ Connected to both MongoDB Clusters");

    const db_customer = client_customer.db(process.env.DB_NAME_CUSTOMER);
    const db_memory = client_memory.db(process.env.DB_NAME_MEMORY);
    const db_member = client_customer.db(process.env.DB_NAME_MEMBER);
    const db_ballexercise = client_memory.db(process.env.DB_NAME_BALLEXERCISE);
    const db_ballsquid = client_customer.db(process.env.DB_NAME_BALLSQUID);
    //const db_balltrip= client_customer.db(process.env.DB_NAME_BALLTRIP);
    const db_balldrum = client_memory.db(process.env.DB_NAME_BALLDRUM);
    const db_griptrainer = client_customer.db(process.env.DB_NAME_GRIPTRAINER);
    const db_product= client_customer.db(process.env.DB_NAME_PRODUCT);

    const collection_customer =
      db_customer.collection(process.env.COLLECTION_NAME_CUSTOMER);

    const collection_product =
      db_product.collection(process.env.COLLECTION_NAME_PRODUCT);

    const collection_memory =
      db_memory.collection(process.env.COLLECTION_NAME_MEMORY);

    const collection_member =
      db_member.collection(process.env.COLLECTION_NAME_MEMBER);

    const collection_device =
      db_member.collection(process.env.COLLECTION_NAME_DEVICE);

    const collection_group =
      db_member.collection(process.env.COLLECTION_NAME_GROUP);

    const collection_ballexercise =
      db_ballexercise.collection(process.env.COLLECTION_NAME_BALLEXERCISE);

    const collection_redlight =
      db_squid.collection(process.env.COLLECTION_NAME_REDLIGHT);

    const collection_dragonboat =
      db_squid.collection(process.env.COLLECTION_NAME_DRAGONBOAT);

    const collection_dragontug =
      db_squid.collection(process.env.COLLECTION_NAME_DRAGONTUG);

    const collection_griptrainer =
      db_griptrainer.collection(process.env.COLLECTION_NAME_GRIPTRAINER);

    const collection_balldrum =
      db_balldrum.collection(process.env.COLLECTION_NAME_BALLDRUM);

    /*const collection_balltrip =
      db_balltrip.collection(process.env.COLLECTION_NAME_BALLTRIP);*/

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

    // ✅ API (balldrum)
    app.get(`/${process.env.COLLECTION_NAME_BALLDRUM}`, async (req, res) => {
      const data = await collection_balldrum.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_BALLDRUM}`, async (req, res) => {
      const result = await collection_balldrum.insertOne(req.body);
      res.json(result);
    });

    /* ✅ API (balltrip)
    app.get(`/${process.env.COLLECTION_NAME_BALLTRIP}`, async (req, res) => {
      const data = await collection_balltrip.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_BALLTRIP}`, async (req, res) => {
      const result = await collection_balltrip.insertOne(req.body);
      res.json(result);
    });*/

    // ✅ API (product)
    app.get(`/${process.env.COLLECTION_NAME_PRODUCT}`, async (req, res) => {
      const data = await collection_product.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_PRODUCT}`, async (req, res) => {
      const result = await collection_product.insertOne(req.body);
      res.json(result);
    });

    // ✅ API (griptrainer)
    app.get(`/${process.env.COLLECTION_NAME_GRIPTRAINER}`, async (req, res) => {
      const data = await collection_griptrainer.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_GRIPTRAINER}`, async (req, res) => {
      const result = await collection_griptrainer.insertOne(req.body);
      res.json(result);
    });

    // ✅ API (ballexercise)
    app.get(`/${process.env.COLLECTION_NAME_BALLEXERCISE}`, async (req, res) => {
      const data = await collection_ballexercise.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_BALLEXERCISE}`, async (req, res) => {
      const result = await collection_ballexercise.insertOne(req.body);
      res.json(result);
    });

    // ✅ API (ballsquid red_light)
    app.get(`/${process.env.COLLECTION_NAME_REDLIGHT}`, async (req, res) => {
      const data = await collection_redlight.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_REDLIGHT}`, async (req, res) => {
      const result = await collection_redlight.insertOne(req.body);
      res.json(result);
    });

    // ✅ API (ballsquid dragon_boat)
    app.get(`/${process.env.COLLECTION_NAME_DRAGONBOAT}`, async (req, res) => {
      const data = await collection_dragonboat.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_DRAGONBOAT}`, async (req, res) => {
      const result = await collection_dragonboat.insertOne(req.body);
      res.json(result);
    });

    // ✅ API (ballsquid dragon_tug)
    app.get(`/${process.env.COLLECTION_NAME_DRAGONTUG}`, async (req, res) => {
      const data = await collection_dragontug.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_DRAGONTUG}`, async (req, res) => {
      const result = await collection_dragontug.insertOne(req.body);
      res.json(result);
    });

    // ✅ API (member member)
    app.get(`/${process.env.COLLECTION_NAME_MEMBER}`, async (req, res) => {
      const data = await collection_member.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_MEMBER}`, async (req, res) => {
      const result = await collection_member.insertOne(req.body);
      res.json(result);
    });

    /*app.put(`/${process.env.COLLECTION_NAME_CUSTOMER}/:id`, async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;

      const result = await collection_customer.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      res.json(result);
    });

    
    app.delete(`/${process.env.COLLECTION_NAME_CUSTOMER}/:id`, async (req, res) => {
      const id = req.params.id;

      const result = await collection_customer.deleteOne({
        _id: new ObjectId(id)
      });

      res.json(result);
    });*/

    // ✅ API (member group)
    app.get(`/${process.env.COLLECTION_NAME_GROUP}`, async (req, res) => {
      const data = await collection_group.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_GROUP}`, async (req, res) => {
      const result = await collection_group.insertOne(req.body);
      res.json(result);
    });

    // ✅ API (member device)
    app.get(`/${process.env.COLLECTION_NAME_DEVICE`, async (req, res) => {
      const data = await collection_device.find().toArray();
      res.json(data);
    });

    app.post(`/${process.env.COLLECTION_NAME_DEVICE}`, async (req, res) => {
      const result = await collection_device.insertOne(req.body);
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
