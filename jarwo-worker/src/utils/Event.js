// @flow

const sns = require('./sns');

type SnsEvent = {
    topic: string,
    event: Object,
};

const topicArnPrefix = process.env.JARWO_SNS_ARN_TOPIC_PREFIX;

export const createEvent = (topic: string, event: Object): SnsEvent => ({
    topic,
    event,
});

export const emit = (topic: string, event: Object) => Promise
    .resolve(createEvent(topic, event))
    .then(snsEvent => sns
        .publish({
            Message: JSON.stringify(snsEvent.event),
            TopicArn: `${topicArnPrefix}${snsEvent.topic}`,
        })
        .promise()
    );
