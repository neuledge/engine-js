import { NumberToken } from './number.js';
import { PunctuationToken } from './punctuation.js';
import { StringToken } from './string.js';
import { WordToken } from './word.js';

export type Token = StringToken | NumberToken | WordToken | PunctuationToken;
