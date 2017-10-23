# Form Component Reference

A group of one or more fields, inputs, lists, or other forms. A form results in a JavaScript object.

## Usage

To use a Form type component, render it with nested children based on what you want the form to look like. The components within the form dictate the resulting data structure. Inputs typically result in scalar values, while Forms map to objects and FormLists map to arrays. Through nesting these various things you can create any schema. This usually works great, but if your design requires a different layout, you can always adjust the resulting object before validating or submitting it.

React JSX example:

```js
import React, { Component } from 'react';
import { Form, Input } from 'reacto-form';
import mySubmissionFunction from './mySubmissionFunction';
import myValidationFunction from './myValidationFunction';

class SomePage extends Component {
  onSubmit = (data, isValid) => {
    if (isValid) mySubmissionFunction(data);
  };

  render() {
    return (
      <Form ref={i => { this.form = i; }} onSubmit={this.onSubmit} validator={myValidationFunction}>
        <Input name="firstName" type="text" />
        <Input name="lastName" type="text" />
        <button type="button" onClick={() => { this.form.submit(); }}>Submit</button>
      </Form>
    );
  }
}
```

There are typically only three things you need to do:

- Pass a validator function to the `validator` property
- Pass a submission function to the `onSubmit` property
- Call `form.submit()` on the form instance when you want to submit it

## Properties

ALL properties are optional, but the `name` property is required on forms that are nested under other forms. The properties listed here are governed by the specification, but components are free to add any number of additional properties as necessary.

### errors

```js
PropTypes.arrayOf(PropTypes.shape({
  message: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}))
```

Array of error objects for all inputs on this form. It is usually not necessary to pass these errors yourself because the Form component will track them based on calls to `validator`, or they will be passed down by a parent Form or FormList. But you might want to pass them in directly when developing or testing.

### name

```js
PropTypes.string
```

If using a Form within another Form, set this to the desired object path where the value should be stored.

```js
<Form>
  <Input name="nickname" type="text" />
  <Form name="address">
    ...
  </Form>
</Form>
```

### onChanging

```js
PropTypes.func
```

This function will be called as the form object changes, for example while a user is typing in one of the inputs. This is called more frequently than `onChanged` but not necessarily on every single character change.

This may also be called on initial render to update default and hard coded input values.

### onChanged

```js
PropTypes.func
```

This function will be called after the form object changes, whenever the user appears to be done changing one of the inputs, for example, after a user finishes typing and tabs off the field. This is called less frequently than `onChanging`.

This may also be called on initial render to update default and hard coded input values.

### onSubmit

```js
PropTypes.func
```

Provide a function that returns a Promise that resolves if submission was successful. If unsuccessful, the Promise should reject. On success, the Form component will reset all input values to match the values in the object in the Form's `value` property (by calling `form.resetValue()`).

### value

```js
PropTypes.obj
```

If the form is editing an existing object, provide it here. You can also provide an object with default values for a creation form. This is a basic JavaScript object which must match the structure of the object that the form component builds and passes to `onChanging`, `onChanged`, and `onSubmit`.

### validateOn

```js
PropTypes.oneOf(['changing', 'changed', 'submit'])
```

This determines how often the form will run the `validator` function when the form's value is currently VALID. The default is "submit". To skip validation, simply do not provide a `validator` function.

### validateOnWhenInvalid

```js
PropTypes.oneOf(['changing', 'changed', 'submit'])
```

This determines how often the form will run the `validator` function when the form's value is currently INVALID. The default is "changing". To skip validation, simply do not provide a `validator` function.

### validator

```js
PropTypes.func
```

If you want to use the built-in validation and error message handling, provide a validator function. This is a function that accepts a single argument that is the object to be validated and returns a Promise that resolves with a potentially empty errors array (see the `errors` property and `validator` spec).

## Instance Properties

### isDirty()

Returns a boolean indicating whether anything has been entered/changed by the user.

### getValue()

Returns the current value of the form in state

### validate()

Calls the `validator` function and then updates the errors tracked in state. Return a Promise that resolves with the errors array.

### submit()

Calls `this.validate()` and then the `onSubmit` function.

### resetValue()

Forces a reset of the value state to match the value prop, which also clears all validation errors.
