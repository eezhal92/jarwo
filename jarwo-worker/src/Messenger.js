// TODO: separate inbound and outbond to 2 different component

const axios = require('axios');
const R = require('ramda');
const Promise = require('bluebird');
const Tracker = require('./utils/Tracker');
const Event = require('./utils/Event');

export const sendMessageToFB = messaging => axios
    .post('https://graph.facebook.com/v2.6/me/messages', {
        recipient: {
            id: messaging.sender.id,
        },
        message: messaging.reply || { text: ':D' },
    }, {
        params: {
            access_token: process.env.JARWO_FB_PAGE_ACCESS_TOKEN,
        },
    })
    .then(resp => resp.data)
    .then(Tracker.track('sendMessageToFB'))
    .catch(Tracker.trackError('sendMessageToFB'));

const sendMessagesToFB = messages => Promise.all(R.map(sendMessageToFB)(messages));

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

export const handleOutbound = event => Promise
    .resolve(getEvents(event))
    .then(parseMessagingEvents)
    .then(filterValidEvents)
    .then(sendMessagesToFB);

const emitMessageToInbound = messaging => Event
    .emit('messenger-inbound', messaging)
    .then(Tracker.track('emitMessageToInbound'))
    .catch(Tracker.trackError('emitMessageToInbound'));

const handleMessagingEvents = R.compose(
    R.map(emitMessageToInbound),
    R.propOr([], 'messaging')
);

const handleEvent = R.cond([
    [R.prop('messaging'), handleMessagingEvents],
    [R.T, R.identity],
]);

const handleEvents = R.map(handleEvent);

const getEventsFromJarwo = R.compose(
    R.filter(R.propEq('id', process.env.JARWO_FB_PAGE_ID)),
    R.propOr([], 'entry')
);

const handlePageEvent = pageEvent => Promise
    .resolve(getEventsFromJarwo(pageEvent))
    .then(handleEvents);

export const handleRequestBody = event => Promise
    .resolve(R.cond([
        [R.propEq('object', 'page'), handlePageEvent],
        [R.T, () => { console.log('Unrecognized event'); }],
    ])(event));
