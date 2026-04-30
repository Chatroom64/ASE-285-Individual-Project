import dotenv from "dotenv";
process.env.MONGO_URI="test_value";

dotenv.config();

console.log("FULL ENV:", process.env);
console.log("MONGO_URI:", process.env.MONGO_URI);