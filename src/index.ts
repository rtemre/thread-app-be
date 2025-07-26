import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';


async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json())

    // Create Graphql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
        `, //Schema
        resolvers: {
            Query: {
                hello: () => "Hello there!!",
                say: (_, { name }: { name: string }) => `Hey ${name}`
            }
        },
    });

    // Start Graphql Server
    await gqlServer.start()

    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        expressMiddleware(gqlServer),
    );


    app.get("/", (req, res) => {
        res.json({ message: "Serve is up" })
    })

    app.listen(PORT, () => {
        console.log("Server is running")
    })
}

init();