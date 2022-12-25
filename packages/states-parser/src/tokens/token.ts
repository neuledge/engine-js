import { NumberToken } from './number';
import { PunctuationToken } from './punctuation';
import { StringToken } from './string';
import { WordToken } from './word';

export type Token = StringToken | NumberToken | WordToken | PunctuationToken;
