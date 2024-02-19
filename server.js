const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();

// Configuración de la conexión a la base de datos MongoDB
const url = process.env.MONGODB || 'mongodb://localhost:27017'; // Cambiar la URL según la configuración de tu MongoDB
const client = new MongoClient(url, { useUnifiedTopology: true });

// Conectar a MongoDB y luego iniciar el servidor
async function startServer() {
    try {
        // Conectar a la base de datos
        await client.connect();
        console.log('Connected to MongoDB');

        // Definición del esquema GraphQL
        const schema = buildSchema(`
            type Ticket {
                _id: ID!
                user: String!
                createdAt: String!
                updatedAt: String!
                status: String!
                title: String!
                description: String!
            }

            type Query {
                getTicket(id: ID!): Ticket
                getAllTickets(limit: Int, offset: Int): [Ticket]
            }

            type Mutation {
                createTicket(user: String!, title: String!, description: String!): Ticket
                updateTicket(id: ID!, user: String!, title: String!, description: String!): Ticket
                deleteTicket(id: ID!): String
                updateTicketStatus(id: ID!, status: String!): Ticket
            }
        `);

        // Funciones para resolver las consultas y mutaciones
        const root = {
            getTicket: async ({ id }) => {
                const db = client.db('tickets_db');
                const collection = db.collection('tickets');
                return await collection.findOne({ _id: new ObjectId(id) });
            },
            getAllTickets: async ({ limit = 10, offset = 0 }) => {
                const db = client.db('tickets_db');
                const collection = db.collection('tickets');
                return await collection.find().skip(offset).limit(limit).toArray();
            },
            createTicket: async ({ user, title, description }) => {
                const db = client.db('tickets_db');
                const collection = db.collection('tickets');
                const result = await collection.insertOne({ user, title, description, createdAt: new Date(), updatedAt: new Date(), status: 'abierto' });
                return await collection.findOne({ _id: result.insertedId });
            },
            updateTicket: async ({ id, user, title, description }) => {
                const db = client.db('tickets_db');
                const collection = db.collection('tickets');
                await collection.updateOne({ _id: new ObjectId(id) }, { $set: { user, title, description, updatedAt: new Date() } });
                return await collection.findOne({ _id: new ObjectId(id) });
            },
            deleteTicket: async ({ id }) => {
                const db = client.db('tickets_db');
                const collection = db.collection('tickets');
                await collection.deleteOne({ _id: new ObjectId(id) });
                return 'Ticket deleted';
            },
            updateTicketStatus: async ({ id, status }) => {
                const db = client.db('tickets_db');
                const collection = db.collection('tickets');
                await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status: status, updatedAt: new Date() } });
                return await collection.findOne({ _id: new ObjectId(id) });
            },
        };

        app.use('/graphql', graphqlHTTP({
            schema: schema,
            rootValue: root,
            graphiql: true // Habilita el editor GraphQL en http://localhost:3000/graphql
        }));

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}/graphql`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
}

startServer();

