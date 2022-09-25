import { IdentifierNode } from './identifier.js';
import { ParameterNode } from './parameter.js';

export interface FunctionNode {
  type: 'Function';
  source?: IdentifierNode;
  identifier: IdentifierNode;
  parameters: ParameterNode[];
  returnType: IdentifierNode;
  body: []; // TODO body
}

// export interface FunctionObjectNode {
//   type: 'FunctionObject';
//   properties:
// }
