# BigInt

The `BigInt` scalar type represents non-fractional signed whole numeric values that may be larger than 2^53.

## Signature

```states
Integer(
  min?: BigInt,
  max?: BigInt,
  before?: BigInt,
  after?: BigInt,
)
```

### Arguments

- `min` - The minimum value of the integer.
- `max` - The maximum value of the integer.
- `before` - The maximum value of the integer.
- `after` - The minimum value of the integer.

## Examples

### Numeric ID

`BigInt(min: 1)`

### 64-bit integer

`Integer(min: -9223372036854775808, max: 9223372036854775807)`

### 64-bit unsigned integer

`Integer(min: 0, max: 18446744073709551615)`
