const Http = require('./src/utils/Http');
const Messenger = require('./src/Messenger');

export const handleInbound = (event, context, callback) => {
    // TODO: x-hub signature
    const request = Http.parseRequest(event);
    Messenger.handleRequestBody(request.body);
    callback(
        null,
        Http.createResponse(request.query['hub.challenge'], 200)
    );
};

export const handleVerification = (event, context, callback) => {
    const request = Http.parseRequest(event);
    callback(
        null,
        Http.createResponse(request.query['hub.challenge'], 200)
    );
};

export const handleOutbound = (event, context, callback) => {
    Messenger.handleOutbound(event);
};

