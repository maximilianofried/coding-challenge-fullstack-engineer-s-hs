import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './schemas';
import resolvers from './resolver';
import connectDB from './db';
import dotenv from 'dotenv';

// Load environment variables from the correct file
if (process.env.NODE_ENV === 'local') {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config({ path: '.env.development.local' });
}

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI:', process.env.MONGO_URI);

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
