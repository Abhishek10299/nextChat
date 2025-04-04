import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
console.log(MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error("Please define the mongodb string");
}

let cached = global.mongose;

if (!cached) {
  cached = global.mongose = { conn: null, promise: null };
}

export async function connectToDb() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opt = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opt)
      .then(() => mongoose.connection);
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
