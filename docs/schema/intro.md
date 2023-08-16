# Introduction to Neuledge Schema Language

Neuledge Schema Language is a powerful tool for defining your data schema and business logic in a precise and customizable way. It allows you to define exactly how your data will look like on each state, avoiding data migrations and making it easy to handle complex data models and workflows.

## What is a schema?

A schema is a blueprint of how your data is structured and organized in your application. It defines the entities and their relationships, the fields and their types, and any validation rules or business logic associated with them. A schema provides a standardized way of interacting with your data, making it easy to understand and maintain.

## Problems with data modeling

Before the advent of schema languages like Neuledge, developers had to use various methods to define and manage data models. Some common approaches include:

- **Using ORM frameworks:** Object-Relational Mapping (ORM) frameworks like Hibernate, Django ORM, and Sequelize provide an abstraction layer that maps database tables to classes or objects. While this can simplify the task of working with databases, it also introduces overhead, complexity, and limitations on the flexibility and performance of queries.
- **Writing raw SQL queries:** Some developers prefer to write raw SQL queries for database access. While this approach provides maximum flexibility and control over queries, it also requires a lot of manual effort, increases the risk of SQL injection attacks, and may result in hard-to-maintain code.
- **Defining models in application code:** Another approach is to define data models as classes or structures within the application code. While this can be convenient and provide a lot of flexibility, it can also lead to coupling between the data model and application logic, making the code harder to refactor or evolve over time.

These methods can also result in inconsistencies and ambiguities in data models, as well as lead to data migrations and schema changes that can cause downtime or data loss. Additionally, these approaches can be difficult to scale and maintain, especially as the application grows and the data model becomes more complex.

Thankfully, Neuledge schema language provides a robust and flexible solution for defining and managing data models that overcomes many of these limitations. In the next section, we'll explore the benefits of Neuledge schema in more detail.

## Benefits of using Neuledge Schema

### Precise data modeling

Neuledge Schema Language allows you to define your data model in a precise and customizable way. You can define each state of your entities and describe the exact fields and their types that are available in each state. This can be especially useful for complex data models and workflows where different validation rules are required at different stages.

### Zero data migrations

With Neuledge Schema Language, you can avoid data migrations by allowing the engine to transform the user query and apply it for each state individually. This saves time and effort and makes it easier to handle changes to your data model over time.

### Precise field types

Neuledge Schema Language allows you to define precise field types for each field in your schema. For example, you can define an `Integer` field with a `min` and `max` value or an `Email(at: "my-company.com")` field. This provides better data integrity and makes it easier to work with your data.

### Allowed mutations and data validation

Neuledge Schema Language allows you to define the allowed mutations and prevent making invalid changes to the data. You can define rules for creating, updating, and deleting entities, and specify the required fields and their types for each operation. This ensures that your data remains consistent and valid over time.

### Database and language agnostic

Neuledge schema language is language agnostic, which means that it can be used with any programming language or database system. This makes it highly flexible and adaptable to different environments and use cases, and allows you to work with your data in the way that suits you best.

## Conclusion

We've covered the basics of Neuledge schema language and how it can be used to define and manage complex data models with precise control over data validation and querying.

In the next chapters, we'll dive deeper into defining states, mutations, and queries using Neuledge schema, and explore some advanced features like references, unions, and custom types. So let's continue our journey and explore the power and flexibility of Neuledge schema language!
