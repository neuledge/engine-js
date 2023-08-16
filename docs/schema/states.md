# Defining States

Neuledge Schema Language is a powerful tool for defining your data schema and business logic in a precise and customizable way. At the core of Neuledge Schema Language is the ability to define the state of an object with a set of properties. In this document, we'll explore how to define states using Neuledge Schema Language.

## What is a state?

A state is a representation of the current status of an object in your application. It is a set of properties that define the object's attributes at a given point in time. For example, you might have a "user" entity with different states like "unverified", "active", and "suspended". Each state would have its own set of properties that define the user's attributes in that state.

## Defining a state

To define a state, you use the `state` keyword followed by the name of the state and a set of properties enclosed in curly braces. Here's an example of defining an "UnverifiedUser" state with a "name" and "email" properties:

```states
state UnverifiedUser {
  name: String = 1
  email: Email = 2
}
```

## Field numbers

The numbers after each property in the state definition represent the **field number** of the property. This feature is inspired by [Protocol Buffers (protobuf)](https://developers.google.com/protocol-buffers), a binary serialization format developed by Google.

Using field numbers allows Neuledge Schema Language to keep track of the fields of each state, even if the names of the fields are renamed or changed. This is important for maintaining backwards compatibility when updating your schema over time. When a field is added or removed, the field numbers of the other fields can remain the same, ensuring that existing code that uses the schema can still correctly read and write data.

## Field types

Each property in a state definition also has a scalar type associated with it. In the example above, the "name" property has a scalar type of `String`, while the "email" property has a scalar type of `Email`. The scalar type specifies the raw data type of the property, including any validation rules and restrictions that apply to the property.

### Built-in scalar types

Neuledge Schema Language supports a wide range of scalar types, including `String`, `Integer`, `Float`, `Boolean`, `DateTime`, `Email`, `URL`, and more. You can learn more about all of the built-in scalar types in the [Scalar Types](../scalars/) section of the documentation.

### Custom scalar types

Each scalar type can also have its own set of customizations. For example, the `Email` scalar type can be customized to only allow email addresses with a specific domain.

```states
  email: Email(at: "my-company.com") = 2
```

In the example above, the `Email` scalar type is customized to only allow email addresses with the domain `my-company.com`.

You can learn more about customizing each of the built-in scalar types in the [Scalar Types](../scalars/) section of the documentation.

## Optional fields

By default, all properties in a state definition are required. This means that when you create a new object in that state, you must provide a value for each property. However, you can make a property optional by adding a question mark (`?`) after the property name. For example, the "email" property in the "UnverifiedUser" state can be made optional by changing it to:

```states
  email?: Email = 2
```

Optional properties can be omitted (`undefined`) when creating a new object in that state. However, if you do provide a value for an optional property, it must be a valid value for that property or `null`.

## Default values

Default values are NOT supported in Neuledge Schema Language by design. If you want to set a default value for a property, you can do so via the state mutations defined in your schema. See the [Mutations](./mutations.md) section in the next chapters for more information.
