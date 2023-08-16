# DateTime

The `DateTime` scalar type represents a date and time following the ISO-8601 standard.

## Signature

```states
DateTime(
  min?: DateTime,
  max?: DateTime,
)
```

### Arguments

- `min` - The minimum value of the date and time.
- `max` - The maximum value of the date and time.

## Examples

### Basic

`DateTime`

### With min and max

`DateTime(min: "2020-01-01T00:00:00Z", max: "2020-12-31T23:59:59Z")`

### Since epoch

`DateTime(min: 0)`
