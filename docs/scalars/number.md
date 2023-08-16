# Number

The `Number` scalar type represents signed double-precision fractional values as specified by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).

## Signature

```states
Number(
  min?: Number,
  max?: Number,
  before?: Number,
  after?: Number,
  finite?: Boolean,
  precision?: Integer(min: 1, max: 1000),
  scale?: Integer(min: 1, max: 1000),
)
```

### Arguments

- `min` - The minimum value of the number.
- `max` - The maximum value of the number.
- `before` - The maximum value of the number.
- `after` - The minimum value of the number.
- `finite` - Whether the number is finite.
- `precision` - The maximum number of digits in the number.
- `scale` - The maximum number of digits after the decimal point.

## Examples

## Probability (0-1)

`Number(min: 0, max: 1)`

## Positive number

`Number(after: 0, finite: true)`

## Percentage (0-100%)

`Number(min: 0, max: 1, scale: 2)`
