# Buffer

The `Buffer` scalar type represents a binary data with a variable length.

## Signature

```states
Buffer(
  min?: Integer(min: 0),
  max?: Integer(min: 0),
)
```

### Arguments

- `min` - The minimum byte length of the buffer.
- `max` - The maximum byte length of the buffer.

## Examples

### MongoDB ObjectId

`Buffer(min: 12, max: 12)`

### Varchar

`Buffer(max: 255)`

### Text

`Buffer` or `Buffer(max: 65535)`
