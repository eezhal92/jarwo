// TODO: create new service for this component
const Promise = require('bluebird');
const R = require('ramda');
const Event = require('./utils/Event');
const Tracker = require('./utils/Tracker');

const createTextResponse = text => ({
    text,
});

export const resolveReplyFromText = R.cond([
    [R.test(/(halo|hoi|hi|he)/ig), () => createTextResponse(
        'Oyi sam, eyip-eyip?'
    )],
    [R.T, () => createTextResponse(
        ':)'
    )],
]);

const emitMessageToOutbound = messaging => Event
    .emit('messenger-outbound', messaging)
    .then(Tracker.track('emitMessageToOutbound'))
    .catch(Tracker.trackError('emitMessageToOutbound'));

const emitMessagesToOutbound = R.map(emitMessageToOutbound);

const handleQuickReplyMessage = R.identity;

const handleTextMessage = messaging => Object.assign({}, messaging, {
    reply: resolveReplyFromText(messaging.message.text),
});

const replyGeneralMessage = R.cond([
    [R.pathOr(null, ['message', 'quick_reply']), handleQuickReplyMessage],
    [R.pathOr(null, ['message', 'text']), handleTextMessage],
    [R.T, R.identity],
]);

const replyPostbackMessage = R.identity;

const replyMessage = R.cond([
    [R.prop('message'), replyGeneralMessage],
    [R.prop('postback'), replyPostbackMessage],
]);

const replyMessages = R.map(replyMessage);

const parseMessagingEvents = R.map(eventString => {
    try {
        return JSON.parse(eventString);
    } catch (error) {
        return null;
    }
});

const filterValidEvents = R.filter(R.identity);

const getEvents = event => R.map(
    R.pathOr(null, ['Sns', 'Message']),
    event.Records
);

export const handleInboundEvent = event => Promise
    .resolve(getEvents(event))
    .then(parseMessagingEvents)
    .then(filterValidEvents)
    .then(replyMessages)
    .then(emitMessagesToOutbound);
