const R = require('ramda');

export const track = R.curry((tag, x) => {
    console.log('TRACK', tag, x);
    return x;
});

export const trackError = R.curry((tag, err) => {
    console.log('TRACK_ERROR', tag, err);
    throw err;
});
