# Validator Specification

To be compatible with this specification, validation functions exported by a package must pass the following tests:

- The function expects a single argument, which is a plain JavaScript object to be validated.
- The function returns an array of error objects or a Promise that resolves with an array of error objects that match this specification. If the object is valid, it returns or resolves with an empty array.

A validation package will usually need the user to specify a schema or validation rules in some way. One method might be to export a function, which when called with a schema will return a compatible validator function.

Each error object in the returned array must have at least these two properties:

- `name`: The name of the field that is invalid, in object path notation. For example, an error with `name` "authors[0].firstName" would be for invalid data in the `firstName` property of the object that is the first item in the `authors` array.
- `message`: The human-readable error message, already translated into the user's language.

If you create a validator package, you can choose to handle translation within it, or to output errors in one language and expect the developer to wrap your function output with another function that does the translation.

The error objects may have any other useful properties, too, but only `name` and `message` are currently used by this specification.

## Example

Here is a function that returns a simple requiredness validator:

```js
import get from 'lodash.get';

export default function getRequiredValidator(...requiredFields) {
  return (obj) => {
    const errors = [];
    requiredFields.forEach((requiredField) => {
      const value = get(obj, requiredField);
      if (value === null || value === undefined) {
        errors.push({ name: requiredField, message: `${requiredField} is required` });
      }
    });
    return errors;
  };
}
```

You would use it like this:

```js
import React, { Component } from 'react';
import { Form } from 'reacto-form';
import { Field, Input } from 'reacto-form-inputs';
import getRequiredValidator from './getRequiredValidator';

const validator = getRequiredValidator('firstName', 'lastName');

class SomePage extends Component {
  render() {
    return (
      <Form validator={validator}>
        <Field label="First Name">
          <Input name="firstName" type="text" />
        </Field>
        <Field label="Last Name">
          <Input name="lastName" type="text" />
        </Field>
      </Form>
    );
  }
}
```
