# FormList Component Specification

A fixed or dynamic list of inputs or forms. A FormList results in a JavaScript array.

## Basics

- MAY have the following children:
  - Exactly one child that is an input OR exactly one child that is a form
  - Exactly one ErrorsBlock child
  - Any number of additional child elements that are not part of the form spec, such as help text to show above or below every item
- The child form or input must not have the `name` property. The child ErrorsBlock must not have the `names` property. (The parent FormList will figure these out and add them.)
- Must render one copy of `children` for each item in the `value` array, plus remove buttons and an add button, or some method of allowing the user to add and remove items.

## Properties

Only the `name` property is required. The properties listed here are governed by this specification, but components are free to add any number of additional properties as necessary.

### name

```js
PropTypes.string
```

This will be set to the desired object path where the value should be stored, using dot notation. This is the purview of the parent form, so nothing need be done with this property directly.

### value

If the list's corresponding data array has a current value or a default value, it will be provided in this property by either the coder or the parent form.

While we recommend that any change to this value should reset the internally stored, work-in-progress value, it is not required. If you update the value in state, you must call `onChanging` and `onChanged` with the new value.

When rendering copies of the child, pass the `value` prop to the child based on this value (i.e., `value[index]`).

### onChanging

```js
PropTypes.func
```

A list component must listen for `onChanging` calls from its only child (input or form type), update the list array in internal state, and then pass the whole changed array to its own `onChanging` function.

### onChanged

```js
PropTypes.func
```

A list component must listen for `onChanged` calls from its only child (input or form type) and then pass the whole changed array to its own `onChanged` function.

### onSubmit

```js
PropTypes.func
```

A list component must listen for `onSubmit` calls from its only child (input or form type) and then pass the whole array to its own `onSubmit` function.

### minCount

```js
PropTypes.number
```

Allows the user to say that at least N items must be in the list and shown in the UI.

### maxCount

```js
PropTypes.number
```

Allows the user to say that no more than N items must be in the list and shown in the UI.

## Static Properties

### isComposableFormList

Set this to `true` so that the containing form and other components know that your component implements the List specification.

## Instance Properties

### getValue()

Returns the current array value of the list in state

### resetValue()

Forces a reset of the value state to match the value prop
