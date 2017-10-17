# Form Component Specification

A group of one or more fields, inputs, lists, or other forms. A form results in a JavaScript object.

## Basics

- Expects one or more children
- Renders but ignores children that are not fields, inputs, lists, or forms
- Keeps the current form object in internal component state, updating it as `onChanging` or `onChanged` props of its direct children are called. (Each form implementation can choose whether to use `onChanging` or `onChanged`, or can make it configurable.) The object keys are taken from the `name` property of each direct child that is a field, input, list, or form.
- Bubbles up child function calls but also leaves in place any function provided by the user (so both would receive `onChanged` for example)
- Automatically passes `value` to each direct child that is a field, input, list, or form based on its own value, only if child value prop isn’t already set.
- Enforces that every direct child that is a field, input, list, or form must have a `name` property that is set to a non-empty string.

## Rendering Descendants

A form component, when rendering its descendants recursively, must check whether any of them implement this spec, and if so pass additional properties to them. What follows is an explanation of which properties to pass for each component type.

### ErrorsBlock (isComposableFormErrors is `true`)

- Check `names` array prop
- If `errors` prop is `undefined`, pass the form's `errors` array, filtered to only those where `name` exactly matches one or more of the strings in the `names` array. If `names` is falsy, do not pass any errors.

### Input (isComposableFormInput is `true`)

- Check `name` string prop
- If no name, ignore
- Pass functions for `onChanged`, `onChanging`, and `onSubmit` props.
  - Retain any functions already supplied for those props and call them first.
  - Update the form's value object using lodash.set, the value (first argument), and the `name` prop. `set(obj, name, value);`
  - Examine `validateOn` and `validateOnWhenInvalid` to determine whether the object should be revalidated. If so, validate and update errors state.
  - Call the form's `onChanged`, `onChanging`, and/or `onSubmit` props as required
- If `value` prop is `undefined`, pass in the current value `get(formValueObject, name)`
- If `errors` prop is `undefined`, pass the form's `errors` array, filtered to only those where the error `name` either exactly matches the component `name` or starts with the component `name` plus a dot or open bracket. If `name` is falsy, do not pass any errors.
- If `isReadOnly` prop is a function, call it passing the current form value and pass the return value to the component instead

### Form (isComposableForm is `true`)

Same logic as Input but no `isReadOnly` prop

### FormList (isComposableFormList is `true`)

Same logic as Input but no `isReadOnly` prop

### Field (isComposableFormField is `true`)

- If `errors` prop is `undefined`, pass the form's `errors` array, filtered to only those where the error `name` either exactly matches the Field `name` or starts with the Field `name` plus a dot or open bracket. If `name` is falsy, do not pass any errors.

## Properties

ALL properties are optional, but the `name` property is required on forms that are nested under other forms. The properties listed here are governed by this specification, but components are free to add any number of additional properties as necessary.

### errors

```js
PropTypes.arrayOf(PropTypes.shape({
  message: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
}))
```

Array of error objects for all inputs on this form, as returned from the `validator` function.

A top-level form would track the errors array in state while nested forms would receive them as props (since validation is done by the highest level form). A form component must handle the case where errors come from props and state by merging the two arrays into one before passing down to descendants.

### name

```js
PropTypes.string
```

This will be set to the desired object path where the value should be stored, using dot notation. This is the purview of the parent form, so nothing need be done with this property directly.

### onChanging

```js
PropTypes.func
```

As any input anywhere within the form or any of its subforms is changing, the form must call `onChanging(newValue, isValid)`, where `newValue` is the new value of the form object after the most recent user entry.

Essentially, this means bubbling up the `onChanging` calls of all direct children that are fields, inputs, lists, or forms.

`onChanging` must never be called with the exact same value as the last time it was called.

### onChanged

```js
PropTypes.func
```

After any input anywhere within the form or any of its subforms has finished changing, the form must call `onChanged(newValue, isValid)`, where `newValue` is the new value of the form object after the most recent user entry.

Essentially, this means bubbling up the `onChanged` calls of all direct children that are fields, inputs, lists, or forms.

`onChanged` must never be called with the exact same value as the last time it was called.

`onChanged` may never be called with a `newValue` that hasn't been first passed to `onChanging`. (In other words, consumers can safely use ONLY `onChanging` without fear of missing any change.)

If an input has no logical difference between "changing" and "changed", it should call both at the same time, `onChanging` first.

### onSubmit

```js
PropTypes.func
```

A form must call `onSubmit(value, isValid)` with the most recent object representing all the form values. It must do this when:
- `onSubmit` is called by any direct child that is a field, input, list, or form.
- Some component of the form, such as a built-in Submit button, requests submission
- For any other reason the form wants to submit (for example, submit automatically after a delay or once the current value matches some expected value)

A value may not be passed to `onSubmit` unless it has first been passed to both `onChanging` and `onChanged`.

`onSubmit` must return a Promise that resolves if submission was successful and the Form component should reset all input values to match the values in the object in the Form's `value` property. If unsuccessful, the Promise should reject.

### value

```js
PropTypes.obj
```

If the form is editing an existing object, it will be provided here. This is a basic JavaScript object which you can expect to match the structure of the object that the form component builds and passes to `onChanging`, `onChanged`, and `onSubmit`.

While we recommend that any change to this value should reset the internally stored, work-in-progress value, it is not required. If you update the value in state, you must call `onChanging` and `onChanged` with the new value.

### validateOn

```js
PropTypes.oneOf(['changing', 'changed', 'submit'])
```

The form must validate prior to calling one of these event functions. Default property value must be "submit". To skip validation, a user would simply not provide a `validator` function.

### validateOnWhenInvalid

```js
PropTypes.oneOf(['changing', 'changed', 'submit'])
```

This is like `validateOn` but this value is used instead of `validateOn` whenever the form is currently invalid. Default property value must be "changing".

### validator

```js
PropTypes.func
```

The form must call `validator(value)` whenever it needs to validate. It needs to validate whenever `validateOn` and `validateOnWhenInvalid` props say that it should.

## Static Properties

### isComposableForm

Set this to `true` so that other components know that your component implements the Form specification.

## Instance Properties

### isDirty()

Returns a boolean indicating whether anything has been entered/changed by the user.

### getValue()

Returns the current value of the form in state

### resetValue()

Forces a reset of the value state to match the value prop, which also clears all validation errors.
