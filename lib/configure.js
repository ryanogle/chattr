module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {redisHost: '54.248.113.192'};

        case 'production':
            return {redisHost: 'localhost'};

        default:
            return {};
    }
};