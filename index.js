const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5010;

// middlewares:
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.we6nhxz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // connect to collection  of brands:
    const brandCollection   = client.db('TechWave').collection('brandCollection');
    const userCollection    =  client.db('TechWave').collection('userCollection');
    const productCollection = client.db('TechWave').collection('productCollection');
    const cartCollection    = client.db('TechWave').collection('cartCollection');

    app.get('/brands', async(req, res) => {
        const cursor = brandCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });
    app.get('/brands/:brandName', async(req, res) => {
      const brand = req.params.brandName;
      const query = { brand: brand};
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    app.get('/:email', async(req, res) => {
      const email = req.params.email;
      const query = {email: email};
      const cursor =  cartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/users', async(req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.post('/products', async(req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });
    app.post('/carts', async(req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });

    app.put('/products/:id', async(req, res) => {
      const product = req.body;
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedInfo = {
        $set: {
          name       : product.name,
          brand      : product.brand,
          type       : product.type,
          rating     : product.rating,
          price      : product.price,
          description: product.description,
          image      : product.image
        }
      };
      const result = await productCollection.updateOne(filter, updatedInfo, options);
      res.send(result);
    })

    app.delete('/carts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Hello Bangladesh");
})
app.listen(port, () => {
    console.log(`server is running from port ${port}`);
})
