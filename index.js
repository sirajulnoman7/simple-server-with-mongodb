
const express = require('express')
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
// middleware
app.use(cors())
app.use(express.json())

// user name: mdsirajulnoman
// pass:zzBHUfHy9awgtvoI



const uri = "mongodb+srv://mdsirajulnoman:zzBHUfHy9awgtvoI@reastatdatabase.gcudm.mongodb.net/?retryWrites=true&w=majority&appName=reastatDatabase";

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

        //multiline code
        // const database = client.db("users_DB");
        // const userCollection = database.collection("userCollection");

        // one line code  
        const userCollection = client.db("users_DB").collection('userCollection')

        // get /read user in the client side 
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        //  get uniq  user 
        app.get('/users/:id', async (req, res) => {
            const { id } = req.params;
            const objectId = new ObjectId(id);
            const query = { _id: objectId };
            const user = await userCollection.findOne(query)
            res.send(user)
        })


        //  update user
        app.put('/users/:id', async(req, res) => {
            const id = req.params.id
            const user = req.body
            console.log(id, user)
            // create a filter for a movie to update
            const filter = { _id: new ObjectId(id) };
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
           
            const updateUser = {
                $set: {
                 name:user.name,
                 email:user.email
                },
              };
              const result = await userCollection.updateOne(filter, updateUser, options);
              res.send(result)
        })

        // create user and set to database 
        app.post('/users', async (req, res) => {
            const user = req.body
            console.log('new user create', user)
            // create a document to be inserted
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        // delete users
        app.delete('/users/:id', async (req, res) => {
            id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)

        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})