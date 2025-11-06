import { createClient } from "redis";

const redisClient = createClient();

try{
    await redisClient.connect();
    console.log("Redis connected successfully");


}catch(err){
    console.log("Redis Client Error", err);
}


export default redisClient;