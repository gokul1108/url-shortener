import {Redis} from 'ioredis';

const redisClient = new Redis();

try{
    
    console.log("Redis connected successfully");


}catch(err){
    console.log("Redis Client Error", err);
}


export default redisClient;