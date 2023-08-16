# String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used to represent free-form human-readable text.

## Signature

```states
String(
  min?: Integer(min: 0),
  max?: Integer(min: 0),
  trim?: Boolean,
  lowercase?: Boolean,
  uppercase?: Boolean,
  normalize?: Boolean,
  startsWith?: String,
  endsWith?: String,
  regex?: String,
)
```

### Arguments

- `min` - The minimum byte length of the string.
- `max` - The maximum byte length of the string.
- `trim` - Whether to trim the string from whitespace characters before validation.
- `lowercase` - Whether to lowercase the string before validation.
- `uppercase` - Whether to uppercase the string before validation.
- `normalize` - Whether to normalize the string before validation.
- `startsWith` - The string must start with this value.
- `endsWith` - The string must end with this value.
- `regex` - The string must match this regular expression.

## Examples

### Basic

`String`

### Currency

`String(min: 3, max: 3)`

### Zip Code

`String(trim: true, regex: "[0-9]{1,5}")`
