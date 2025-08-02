import { removeStopwords } from 'stopword';
import { singular } from 'pluralize';

const customStopwords = [
  'the',
  'a',
  'an',
  'of',
  'on',
  'and',
  'or',
  'with',
  'to',
  'for',
  'in',
  'by',
];

const punctuationRegex = /[^\w\s]|_/g;

const removePunctuation = (str: string): string => {
  return str.replace(punctuationRegex, '');
};

const collapseSpaces = (str: string): string => {
  return str.replace(/\s+/g, ' ').trim();
};

export const normalizeTopic = (raw: string): string => {
  let s = raw.toLowerCase();
  s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  s = removePunctuation(s);
  s = collapseSpaces(s);
  s = singular(s);
  return s;
};

export const normalizeIntent = (
  raw: string,
  removeStopWords = true,
): string => {
  let s = raw.toLowerCase();
  s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  s = removePunctuation(s);
  s = collapseSpaces(s);
  if (removeStopWords) {
    const words = s.split(' ');
    s = removeStopwords(words, customStopwords).join(' ');
  }
  return s;
};
