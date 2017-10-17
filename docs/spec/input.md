# Input Component Specification

A component that actually displays and collects data. An input results in any JavaScript data type.

## Basics

- Must either display existing data, collect new or changed data, or both
- Uses value prop as initial value and forcefully updates the input's value whenever the value prop changes, but otherwise retains typed/selected data on rerun
- The data type of the `value` property and the data type of the argument passed to the `onChanging`, `onChanged`, and `onSubmit` functions must be the same, but can be any data type.
- If its initial value (based on the `value` prop or internal logic or some combination) is not `undefined`, it must call `onChanging` and `onChanged` with that value exactly once just before the component mounts.
- Whenever its internal value changes due to the `value` prop changing, it must call `onChanging` and `onChanged` with that value.
- Visually, an input SHOULD NOT have any margin (no whitespace above, below, or to either side of it). Exceptions can be made, but know that fields and forms in general will expect this.

## Properties

All properties are optional. The properties listed here are governed by this specification, but components are free to add any number of additional properties as necessary.

### name

```js
PropTypes.string
```

This will be set to the desired object path where the value should be stored, using dot notation. This is the purview of the parent form, so nothing need be done with this property directly.

If you are wrapping an HTML input, you may or may not want to pass this through to the HTML `name` attribute. We leave that choice to you.

### value

If the input's corresponding data has a current value or a default value, it will be provided in this property by either the coder or the parent form.

While we recommend that any change to this value should reset the internally stored, work-in-progress value, it is not required. If you update the value in state, you must call `onChanging` and `onChanged` with the new value.

### onChanging

```js
PropTypes.func
```

As the input value changes, the input component must call `onChanging(newValue)`, where `newValue` is the new value after the most recent user entry. For example, this may be called as a user types or as they move a pointing device or range slider.

`onChanging` must never be called with the exact same value as the last time it was called.

Calls to `onChanging` may be throttled as necessary by the input. Users can of course add additional throttling, but they can't reduce built-in throttling, so therefore it's best if input components throttle only the minimum amount necessary to achieve good default performance.

### onChanged

```js
PropTypes.func
```

After the input value changes, the input component must call `onChanged(newValue)`, where `newValue` is the new value after the most recent user entry. For example, a text entry input may call `onChanging` repeatedly while a user types, and then call `onChanged` after they stop typing for a bit, or after they click, tap, or tab off the field.

`onChanged` must never be called with the exact same value as the last time it was called.

`onChanged` may never be called with a `newValue` that hasn't been first passed to `onChanging`. (In other words, consumers can safely use ONLY `onChanging`.)

If an input has no logical difference between "changing" and "changed", it should call both at the same time, `onChanging` first.

### onSubmit

```js
PropTypes.func
```

An input may choose to call `onSubmit()`, passing no arguments. For example, a text field may do this when you press Enter.

### isRequired

```js
PropTypes.bool
```

If an input has the ability to show an indication that it is required, it must determine requiredness from the `isRequired` property. Note that this is unrelated to actual validation; it is for display purposes only.

### isReadOnly

```js
PropTypes.bool
```

If possible, an input should support being read-only. If `isReadOnly` is `true`, it should visually appear disabled and should not allow the user to edit the value.

### errors

```js
PropTypes.arrayOf(PropTypes.shape({
  message: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
}))
```

Array of error objects for this input. The containing form will supply this. Inputs do not have to use this, but they can if they want to display visual indication of validity (for example, turning the background or border of a text field red).

### Additional Properties

These properties are not strictly governed by this specification, but in order to make it easy to swap similar components, we recommend the following naming conventions:

- `className` (string): For inputs that render HTML, to be used as the `className` prop on the outermost element.
- `maxLength` (integer): For inputs that support limiting the number of characters the user can type.
- `placeholder` (string): For inputs that show placeholder text when blank
- `style` (object): For inputs that render HTML, to be used as the `style` prop on the outermost element.

## Static Properties

### isComposableFormInput

Set this to `true` so that the containing form and other components know that your component implements the Input specification.

## Instance Properties

### isDirty()

Returns a boolean indicating whether anything has been entered/changed by the user.

### getValue()

Returns the current value of the input in state

### resetValue()

Forces a reset of the value state to match the value prop

## Additional Specs

Depending on what an input value's data type is and other factors, there are additional rules and recommendations to follow. These help ensure that it it easy to swap one input for another that is similar.

### Inputs With String Value

Must accept an optional boolean property `convertEmptyStringToNull`, which if `true` should always call `onChanged` and `onChanging` with `null` rather than `""`. The default value for this property can be either `true` or `false`, as the component author prefers. This feature is useful for some validation libraries where an empty string does not result in a "required" error, or to avoid storing empty strings in your database.

Must accept an optional boolean property `trimValue`, which if `true` should always call `onChanged` and `onChanging` with a string that has no whitespace at the beginning or end. The default value for this property can be either `true` or `false`, as the component author prefers.

If both `trimValue` and `convertEmptyStringToNull` are `true`, the component should first trim, and then convert to null.

### Inputs With Date Value

Must accept an optional string property `timezone` that will be set to the IANA timezone string that should be used to interpret the user-entered time, and/or an optional `offset` string property that will be set to the offset string, e.g. "+00:00". If neither are supplied, the timezone/offset of the local machine should be assumed.

May accept `max` and `min` properties that will be set to a Date object representing the earliest and latest times that may be selected.

NOTE: Inputs with `Date` values should be limited to inputs that are intended to have the user select an exact moment in time, such as an appointment start time. If an input has the user choose only a date and not a time, or only a time and not a date, or a date and time that are intended to be relative, then it's best to have the data type be a string, a number, or an object, to which you can apply a timezone later when displaying it.

### Selection Inputs

Inputs that show multiple values to the user and allow selection must get those options from a property called `options`. The component should expect options in one of two valid formats:

```js
[
  { label: '2013', value: 2013 },
  { label: '2014', value: 2014 },
  { label: '2015', value: 2015 },
]
```

or

```js
[
  {
    optgroup: 'Fun Years',
    options: [
      { label: '2013', value: 2013 },
      { label: '2014', value: 2014 },
      { label: '2015', value: 2015 },
    ]
  },
  {
    optgroup: "Boring Years",
    options: [
      { label: '2016', value: 2016 },
      { label: '2017', value: 2017 },
      { label: '2018', value: 2018 },
    ]
  }
]
```

Components can choose not to support the `optgroup` format if it doesn't make sense.

The value is a number in these examples but could be a string, a boolean, a Date, or anything. A selection input can limit the data types it supports for values.

Selection input UI can be anything, for example, toggle buttons, check boxes, a dropdown list, etc.

In addition to `label` and `value`, which are required, `id` can be added if any values are duplicated. `id` should be used for array tracking (e.g., `key` prop in React) if supplied, otherwise use `value`.

Dropdown-type selection inputs must add a first option that is shown when the value is empty (undefined, null, empty string, etc.). Allow the user to set the label for this option using a string property called `emptyLabel`.
