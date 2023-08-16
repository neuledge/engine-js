# Email

The `Email` scalar type represents a string email address.

## Signature

```states
Email(
  at?: String,
  lowercase?: Boolean,
)
```

### Arguments

- `at` - Limit the email address to a specific domain.
- `lowercase` - Convert the email address to lowercase.

## Examples

### Basic

`Email`

### Normalized

`Email(lowercase: true)`

### Gmail only

`Email(at: "gmail.com")`
