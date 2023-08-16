import { Callout } from 'nextra-theme-docs';

# State inheritance

State inheritance is a powerful feature in Neuledge Schema Language that allows you to define a base state that contains common properties, and then define other states that inherit from the base state and add additional properties. This makes it easier to define similar states without repeating code or creating redundant definitions. In this section, we'll explore the syntax for state inheritance and provide examples of how to use it.

## Syntax

To define a state that inherits from another state, you use the `from` keyword followed by the name of the base state. Here's an example of defining a "VerifiedUser" state that inherits from a "CreatedUser" state:

```states
state CreatedUser {
  name: String = 1
  email: Email = 2
}

state VerifiedUser from CreatedUser {
  verifiedAt: DateTime = 1
}
```

In this example, the "VerifiedUser" state inherits from the "CreatedUser" state and adds a "verifiedAt" property. The resulting "VerifiedUser" state will have the "name", "email", and "verifiedAt" properties.

Note that the "verifiedAt" property is defined with a [field number](states#field-numbers) of `1`. This is because each
state has its own field number space unrelated to the field numbers of other states that it inherits from.

## Overriding properties from the base state

In addition to adding new properties, you can also override properties from the base state. To do this, you simply redefine the property in the inheriting state. Here's an example of overriding a property from a base state:

```states
state CreatedUser {
  name: String = 1
  email: String = 2
}

state VerifiedUser from CreatedUser {
  email: Email = 1
  verifiedAt: DateTime = 2
}
```

In this example, the "VerifiedUser" state overrides the "email" property from the "CreatedUser" state with a new definition that sets the type to "Email". The "VerifiedUser" state will have the "name", "email", and "verifiedAt" properties.

This seems like a trivial example, but it's important to understand that behind the scenes, the new "email" property is a completely different property from the "email" property in the base state and Neuledge Engine will rewrite all your
queries automatically to use the correct underline property for each state.

## Removing properties from the base state

In some cases, you may want to remove a property from a state that is inherited from a base state. This can be done using the `-` symbol followed by the name of the property you want to remove.

```states
state Employee {
  name: String = 1
  salary: Int = 2
  startDate: DateTime = 3
}

state Intern from Employee {
  -salary
  endOfInternship: DateTime = 1
}
```

In this example, the "Intern" state inherits from the "Employee" state, but removes the "salary" property. It also adds the "endOfInternship" property. This allows us to define a more specific state for interns while still reusing the common properties defined in the "Employee" state.

## Reuse fields from other states

In addition to defining properties directly in a state, you can also reference properties from other states. This feature allows you to reference fields from other states without having to inherit from multiple states.

To reuse a field from another state, you use the `OtherState.field = number` syntax, where `OtherState` is the name of the state that contains the field you want to reuse, `field` is the name of the field you want to reuse, and number is the field number you want to use for the field.

```states
state User {
  name: String = 1
  email: Email = 2
}

state Employee from User {
  salary: Integer = 1
  socialSecurityNumber: String = 2
}

state Contractor from User {
  hourlyRate: Integer = 1
  Employee.socialSecurityNumber = 2
}
```

In this example, the "Contractor" state inherits from the "User" state and adds the "hourlyRate" property. It also reuses the "socialSecurityNumber" property from the "Employee" state without having to inherit all the properties from the "Employee" state.

You will learn more about the benefits of field references in the [state indexing](indexes#indexes-and-inheritance) section.

<Callout type="info" emoji="👀">

We believe that this feature will be useful and more accurate than multi-state inheritance, but we would like to hear your feedback and thoughts whether we should support multi-state inheritance as well.

</Callout>
