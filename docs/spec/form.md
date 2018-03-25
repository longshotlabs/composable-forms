# Form Component Specification

A group of one or more fields, inputs, lists, or other forms. A form results in a JavaScript object.

## Implementation

A `Form` type component is the most complicated component to create. It must do the following:

- Expect one or more children and render them in order. Children that are part of this spec must be treated specially. They must be cloned with additional properties passed to them.
- Track the current form object in internal component state, updating it as `onChanging` or `onChange` props of its children are called. (Each form implementation can choose whether to use `onChanging` or `onChange` to update its state, or can make it configurable.) The object keys are derived from the `name` property of each descendant that is a field, input, list, or form.
- By listening for `onChange` and `onChanging` and `onSubmit` calls from descendants, bubble up these calls but also leave in place any listener functions provided by the user (so both would receive `onChange` for example).
- Automatically set the `value` property for input, list, or form descendants based on the form object value tracked in state, only if child value prop isn’t already set by the user.
- Enforce that every input, list, or form must have a `name` property that is set to a non-empty string.

## Rendering Descendants

A form component, when rendering its descendants recursively, must check whether any of them implement this spec, and if so pass additional properties to them. What follows is an explanation of which properties to pass for each component type.

### ErrorsBlock (isFormErrors is `true`)

- Check `names` array prop
- If `errors` prop is `undefined`, pass the form's `errors` array, filtered to only those where `name` exactly matches one or more of the strings in the `names` array. If `names` is falsy, do not pass any errors.

### Input (isFormInput is `true`)

- Check `name` string prop
- If no name, ignore
- Pass functions for `onChange` and `onChanging` props:
  - Retain any functions already supplied for those props and call them first.
  - Update the form's value object using lodash.set, the value (first argument), and the `name` prop. `set(obj, name, value);`
  - Examine `validateOn` and `revalidateOn` to determine whether the object should be revalidated. If so, call `this.validate()`.
  - Call the form's `onChange` or `onChanging` as required, passing both the new form object and the validaty boolean as arguments.
- Pass functions for `onSubmit` prop
  - First call the user-supplied `onSubmit` for the component, if there is one
  - Then call `this.submit()` for the form
- If `value` prop is `undefined`, pass in the current value `get(formValueObject, name)`
- If `errors` prop is `undefined`, pass the form's `errors` array, filtered to only those where the error `name` either exactly matches the component `name` or starts with the component `name` plus a dot or open bracket. If `name` is falsy, do not pass any errors.
- If `isReadOnly` prop is a function, call it passing the current form value and pass the return value to the component instead

### Form (isForm is `true`)

Same logic as Input but no `isReadOnly` prop

### FormList (isFormList is `true`)

Same logic as Input but no `isReadOnly` prop

### Field (isFormField is `true`)

- If `errors` prop is `undefined`, pass the form's `errors` array, filtered to only those where the error `name` either exactly matches the Field `name` or starts with the Field `name` plus a dot or open bracket. If `name` is falsy, do not pass any errors.

## Properties

ALL properties are optional, but the `name` property is required on forms that are nested under other forms. The properties listed here are governed by this specification, but components are free to add any number of additional properties as necessary.

### errors

```js
PropTypes.arrayOf(PropTypes.shape({
  message: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}))
```

Array of error objects for all inputs on this form, as returned from the `validator` function.

A top-level form would track the errors array in state while nested forms would receive them as props (since validation is done by the highest level form). A form component must handle the case where errors come from props and state by merging the two arrays into one before passing down to descendants.

### onChanging

```js
PropTypes.func
```

As any input anywhere within the form or any of its subforms is changing, the form must call `onChanging(newValue, isValid)`, where `newValue` is the new value of the form object after the most recent user entry.

`onChanging` must never be called with the exact same value as the last time it was called.

### onChange

```js
PropTypes.func
```

After any input anywhere within the form or any of its subforms has finished changing, the form must call `onChange(newValue, isValid)`, where `newValue` is the new value of the form object after the most recent user entry.

`onChange` must never be called with the exact same value as the last time it was called.

`onChange` must never be called with a `newValue` that hasn't been first passed to `onChanging`. (In other words, consumers can safely use ONLY `onChanging` without fear of missing any change.)

### value

```js
PropTypes.obj
```

If the form is editing an existing object, it will be provided here. This is a basic JavaScript object which you can expect to match the structure of the object that the form component builds and passes to `onChanging`, `onChange`, and `onSubmit`.

While we recommend that any change to this value should reset the internally stored, work-in-progress value, it is not required. If you update the value in state, you must call `onChanging` and `onChange` with the new value.

### validateOn

```js
PropTypes.oneOf(['changing', 'changed', 'submit'])
```

The form must validate prior to calling one of these event functions. Default property value must be "submit". To skip validation, a user would simply not provide a `validator` function.

### revalidateOn

```js
PropTypes.oneOf(['changing', 'changed', 'submit'])
```

This is like `validateOn` but this value is used instead of `validateOn` whenever the form has already been validated once since it was first mounted or since the `resetValue` instance method was called. Default property value must be "changing".

### validator

```js
PropTypes.func
```

The form must call `validator(value)` whenever it needs to validate. It needs to validate whenever `validateOn` and `revalidateOn` props say that it should.

### hasBeenValidated

```js
PropTypes.bool
```

If this property is set, it must override the internal tracking of whether the `validator` function has been called. This is used by parent forms when they are handling the validation for a child form.

## Static Properties

### defaultProps [REQUIRED]

You must include the `defaultProps` static property, even if it is only an empty object.

### isForm [REQUIRED]

Set this to `true` so that other components know that your component implements the Form specification.

## Instance Properties

### isDirty() [REQUIRED]

Returns a boolean indicating whether anything has been entered/changed by the user.

### getValue() [REQUIRED]

Returns the current value of the form in state

### validate() [REQUIRED]

This function must call the `validator` function and then update the errors tracked in state. It must also return a Promise that resolves with the errors array.

See the ReactoForm Form component's validate function for an example.

### submit() [REQUIRED]

This function must call the `validator` function and then potentially call the `onSubmit` function.

The object to pass to both functions is the most recent object representing all the form values, which you should be tracking in state. A form object may not be passed to `onSubmit` unless it has first been passed to both `onChanging` and `onChange`.

1. If `validator` prop isn't a function, exit.
1. Call `validator` and expect it to return an array of error objects a Promise that resolves with an array of error objects.
1. If `validator` rejects or throws, optionally log the error, and then exit.
1. Store the errors array for passing down to child components.
1. If the errors array is empty or (the errors array is non-empty and `shouldSubmitWhenInvalid` is `true`), call `onSubmit`.
1. If `onSubmit` returns or resolves with `undefined`, `null`, or an object with property `ok` set to `true`, consider the submission successfully completed. Call the `resetValue` method, and then exit.
1. If `onSubmit` returns or resolves with an object with property `ok` NOT set to `true`, consider the submission failed. If the result object also contains an `errors` property set to an errors array, store the errors array for passing down to child components. Exit without calling the `resetValue` method.
1. If `onSubmit` rejects or throws, optionally log the error, and then exit. Do not call `resetValue` method.

See the ReactoForm Form component's submit function for an example.

### resetValue() [REQUIRED]

This function must do the following:

- Reset the value state to match the value prop
- Clear all validation errors in state
- Call `element.resetValue()` on all descendant Inputs, Forms, and FormLists, down to exactly one level of nesting.

## Example

[ReactoForm Form](https://github.com/DairyStateDesigns/reacto-form/blob/master/lib/components/Form.jsx)
