# URL

The `URL` scalar type represents a string URL.

## Signature

```states
URL(
  domain?: String,
  protocol?: String,
  secure?: Boolean,
)
```

### Arguments

- `domain` - The domain of the URL. If provided, the URL must match this domain.
- `protocol` - The protocol of the URL. If provided, the URL must match this protocol.
- `secure` - If `true`, the URL must be secure.

## Examples

### Basic

`URL`

### LinkedIn URL

`URL(domain: "linkedin.com")`

### Secure URL

`URL(secure: true)`
