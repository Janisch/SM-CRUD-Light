const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const updateLocale = require('dayjs/plugin/updateLocale');
require('dayjs/locale/de');

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.locale('de');

dayjs.updateLocale('de', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: '1 Min.',
    m: '1 Min.',
    mm: '%d Min.',
    h: '1 Std.',
    hh: '%d Std.',
    d: '1 Tag',
    dd: '%d Tage',
    M: '1 Mon.',
    MM: '%d Mon.',
    y: '1 Jahr',
    yy: '%d Jahre',
  },
});

module.exports = dayjs;
