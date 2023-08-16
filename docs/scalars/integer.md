# Integer

The `Integer` scalar type represents non-fractional signed whole numeric values. Integer can represent values between -(2^53 - 1) and 2^53 - 1.

## Signature

```states
Integer(
  min?: Integer,
  max?: Integer,
  before?: Integer,
  after?: Integer,
)
```

### Arguments

- `min` - The minimum value of the integer.
- `max` - The maximum value of the integer.
- `before` - The maximum value of the integer.
- `after` - The minimum value of the integer.

## Examples

### Numeric ID

`Integer(min: 1)`

### Person age

`Integer(min: 18, max: 99)`

### Positive number

`Integer(after: 0)`
