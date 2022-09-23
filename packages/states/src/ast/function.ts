import { IdentifierNode } from './identifier.js';
import { PropertyNode } from './property.js';

export interface FunctionNode {
  type: 'Function';
  source?: IdentifierNode;
  identifier: IdentifierNode;
  arguments: PropertyNode[];
  returnType: IdentifierNode;
  body: []; // TODO body
}

// export interface FunctionObjectNode {
//   type: 'FunctionObject';
//   properties:
// }
