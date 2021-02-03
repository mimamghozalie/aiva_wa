import { randomBytes } from 'crypto';
const pool = 31 * 128; // 36 chars minus 4 dashes and 1 four
let r = randomBytes(pool);
let j = 0;
const str = '10000000-1000-4000-8000-100000000000';
const len = str.length; // 36
const strs = [];

strs.length = len;
strs[8] = '-';
strs[13] = '-';
strs[18] = '-';
strs[23] = '-';

export const uuid = () => {
  let ch;
  let chi;

  for (chi = 0; chi < len; chi++) {
    ch = str[chi];
    if ('-' === ch || '4' === ch) {
      strs[chi] = ch;
      continue;
    }

    // no idea why, but this is almost 4x slow if either
    // the increment is moved below or the >= is changed to >
    j++;
    if (j >= r.length) {
      r = randomBytes(pool);
      j = 0;
    }

    if ('8' === ch) {
      strs[chi] = (8 + (r[j] % 4)).toString(16);
      continue;
    }

    strs[chi] = (r[j] % 16).toString(16);
  }

  return strs.join('');
};

export const uuidTest: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
