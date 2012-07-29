var redis = require("redis");
module.exports = redis.createClient("6379", "ec2-54-248-25-104.ap-northeast-1.compute.amazonaws.com");