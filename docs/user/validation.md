# Validator Reference

Validator functions take an object and return an array of errors or a Promise that resolves with an array of errors. They can be passed directly to the `validator` property of a `Form` component.

Typically, a validator package might have you define a schema and then allow you to create a validator function from that schema.
