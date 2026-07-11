import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
} else {
  // Defer throwing to prevent build-time failures when env variables are absent
  clientPromise = Promise.reject(
    new Error("Please add MONGO_URI or MONGODB_URI to your environment variables.")
  );
}

export default clientPromise;
