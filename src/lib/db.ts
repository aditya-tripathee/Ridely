import mongoose from "mongoose";

const mongoDBUrl = process.env.MONGO_URI;
if (!mongoDBUrl) {
  throw new Error("DB url not found!");
}

let cached = global.mongooseConn;
if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoDBUrl).then((c) => c.connection);
  }
  try {
    const conn = await cached.promise;
    cached.conn = conn; 
    return conn;
  } catch (error) {
    console.log(error);
    throw new Error("DB connection failed");
  }
};

export default connectDB;
