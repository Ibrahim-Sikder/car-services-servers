const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fomplst.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const verifyJWT=( req, res, next)=>{
  const authorization =  req.headers.authorization
  if(!authorization){
    return res.status(402).send({error: true, message: 'unauthorized access '})
   
  }
  const token = authorization.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (error, decoded)=>{
    if(error){
      return res.status(402).send({error: true, message: 'unauthorized access'})
    }
    req.decoded = decoded;
    next()
  })
}


async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("Car-Doctors").collection("services");
    const bookCollection = client.db("Car-Doctors").collection("bookings");


     // JWT API
    app.post('/jwt', (req, res)=>{
      const user = req.body;
      console.log(user)
      const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {expiresIn: '1h'})
      console.log(token)
      res.send({token})
    })

    app.get("/services", async (req, res) => {
      const service = await serviceCollection.find().toArray();
      res.send(service);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      // specific data load er ketre mane amar je datagolue lagbe segolu nibo
      //  option = {
      //   projection : {title: 1, id: 1, img: 1 }
      //  }

      const result = await serviceCollection.findOne(filter);
      res.send(result);
    });

    // boook api
    app.post("/book", async (req, res) => {
      const book = req.body;
      const result = await bookCollection.insertOne(book);
      res.send(result);
    });

    // query api
    app.get("/book",verifyJWT, async (req, res) => {
      // console.log(req.headers.authorization)
      const decoded = req.decoded 
      if(decoded.email !== req.query.email){
        return res.status(403).send({error: 1, message: 'forbiden access '})
      }
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await bookCollection.find(query).toArray();
      res.send(result);
    });

    app.delete('/book/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await bookCollection.deleteOne(filter);
      res.send(result) 
    })

// updated api 
app.patch('/book/:id', async (req, res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const book = req.body;
  const newBooking = {
    $set: {
      status: book.status
    }
  }


 
















  const result = await bookCollection.updateOne(filter, newBooking);
  res.send(result);

})





    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Doctor server app running now !");
});

app.listen(port, () => {
  console.log("Coffee server running now!");
});
