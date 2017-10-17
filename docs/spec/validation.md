# Validator Specification

To be compatible with this specification, validation functions exported by a package must pass the following tests:

- The function can be passed as the `validator` function of a form.
- The function expects a single argument, which is a plain JavaScript object to be validated.
- The function return a promise that returns an array of error objects that match this specification. If the object is valid, it returns an empty array.

A validation package will usually need the user to specify a schema, too. One method might be to export a function, which when called with a schema will return a compatible validator function.
