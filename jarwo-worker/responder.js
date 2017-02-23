const Http = require('./src/utils/Http');
const Responder = require('./src/Responder');

export const respondMessage = (event, context, callback) => {
    console.log(JSON.stringify(event, null, 2));
    Responder.handleInboundEvent(event);
    callback(
        null,
        Http.createResponse({ OK: true }, 200)
    );
};
