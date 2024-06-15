import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './schemas';
import resolvers from './resolver';
import connectDB from './db';
import dotenv from 'dotenv';

dotenv.config();

const startServer = async () => {
  // Connect to the database
  await connectDB();

  // Create Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start the standalone server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`Server ready at ${url}`);
};

// Start the server
startServer().catch(error => {
  console.error('Server startup error:', error);
});
