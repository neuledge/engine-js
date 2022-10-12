export interface BuiltInScalar<Name extends string = string> {
  type: 'BuiltInScalar';
  id: { type: 'Identifier'; name: Name };
  description?: { type: 'Description'; value: string };
}
