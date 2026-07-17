import mongoose from "mongoose";

const MONGODB_URI =
  process.env.NEXT_PUBLIC_DB_URL ||
  "mongodb+srv://sajjany47:s%40JJAN888@cluster0.g6om3i4.mongodb.net/sport-predict?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}
const dbConnect = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        dbName: "sport-predict", // optional
      })
      .then((mongoose) => {
        console.log("MongoDB connected");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
