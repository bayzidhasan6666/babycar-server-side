const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g4e8qzr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysCollection = client.db('BabyCar').collection('carToys');
    const addToyCollection = client.db('BabyCar').collection('addToys');

    app.get('/carToys', async (req, res) => {
      const toys = await toysCollection.find({}).toArray();
      res.send(toys);
    });

    app.get('/addToys', async (req, res) => {
      // pagination
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 20;
      const skip = page * limit;

      const addToys = await addToyCollection
        .find()
        .skip(skip)
        .limit(limit)
        .toArray();
      res.send(addToys);
    });

    app.post('/addToys', async (req, res) => {
      const addToyData = req.body;
      console.log(addToyData);
      const addToy = await addToyCollection.insertOne(addToyData);
      res.send(addToy);
    });

    app.get('/addToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addToyCollection.findOne(query);
      res.send(result);
    });

    app.get('/myToys/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await addToyCollection
        .find({ sellerEmail: req.params.email })
        .toArray();
      res.send(result);
    });
    app.get('/updateToy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addToyCollection.findOne(query);
      res.send(result);
    });
    app.put('/updateToy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = req.body;
      const toy = {
        $set: {
          price: updatedToy.price,
          description: updatedToy.description,
          quantity: updatedToy.quantity,
        },
      };
      const result = await addToyCollection.updateOne(query, toy, options);
      res.send(result);
    });

    app.get('/totalToys', async (req, res) => {
      const result = await addToyCollection.estimatedDocumentCount();
      res.send({ totalToys: result });
    });

    app.delete('/myToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addToyCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

// Define a route
app.get('/', (req, res) => {
  res.send('Toy marketplace server is running....');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
