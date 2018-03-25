# Input Component Specification

A component that displays and collects data. An input results in any JavaScript data type.

## Implementation

Because the closest `Form` type component does much of the heavy work, creating your own `Input` type component is not difficult.

### An Input MUST (Requirements)

- Have a static class property named `isFormInput` that is set to `true`
- Take a prop named `value` and render it for the user to see.
- Call `onChanging` (if it supports an `onChanging` prop) AND `onChange`, in that order, on mount. Pass them the incoming `value` prop value.
- If the user edits the value and you believe that their editing is done for now, update your internal value state and then call `onChanging` (if it supports an `onChanging` prop) AND `onChange`, in that order, passing them the new value.
- When the `value` prop changes and doesn't match the current shown value, update the shown value to the value from the incoming `value` prop.
- May not have a default value for the `value` or `errors` props.

### An Input SHOULD (Recommendations)

- If the `isReadOnly` prop is falsy, allow editing the value in some way. If you want your component to always be read only, you do not have to provide any way to edit and you can ignore the `isReadOnly` prop. Make sure to document this.
- Document the expected data type of your `value`, and throw errors whenever the data type is incorrect.
- Visually, do not include any margin (no whitespace above, below, or to either side of your component). Exceptions can be made, but know that fields and forms in general will expect no margin.

### An Input MAY (As Necessary)

- Keep internal state
- If the user edits the value and you believe that their editing is in progress, update your internal value state and then call `onChanging`, passing it the new value.
- Accept an `onSubmit` property and call the passed function if the user does something that makes you think they want to submit the form (for example, presses Enter).
- Show an indication or alter styles when the `isRequired` property is `true`
- Show an indication or alter styles when the `errors` property is a non-empty array (error styling)
- Show an indication or alter styles when the `errors` property is an empty array and the `hasBeenValidated` property is `true` (success styling)

## Additional Properties

These properties are not strictly governed by this specification, but in order to make it easy to swap similar components, we recommend the following naming conventions if you support these features:

- `className` (string): For inputs that render HTML, to be used as the `className` prop on the outermost element.
- `maxLength` (integer): For inputs that support limiting the number of characters the user can type.
- `placeholder` (string): For inputs that show placeholder text when blank
- `style` (object): For inputs that render HTML, to be used as the `style` prop on the outermost element.

## Static Properties

### defaultProps [OPTIONAL]

Setting the `defaultProps` static property is recommended but not required.

### isFormInput [REQUIRED]

Set this to `true` so that the containing form and other components know that your component implements the Input specification.

## Instance Methods

These instance methods are optional for inputs, but you should use these names for them if you support these functions. Also, if you provide one of them, you should provide all four.

### isDirty() [OPTIONAL]

Returns a boolean indicating whether anything has been entered/changed by the user or by a call to the `setValue` instance method.

### getValue() [OPTIONAL]

Returns the current value the input is showing

### resetValue() [OPTIONAL]

Update the shown value to match the value prop, erasing any user changes

### setValue(value) [OPTIONAL]

Update the value state to be the provided value. This is similar to passing a new value to the `value` prop except that `isDirty()` will return true after setting it this way if the set value doesn't match the prop value, so this is the best way to simulate the user having entered/chosen a value.

## Additional Specs

Depending on what an input value's data type is and other factors, there are additional rules and recommendations to follow. These help ensure that it it easy to swap one input for another that is similar.

### Inputs With String Value

Must accept an optional boolean property `convertEmptyStringToNull`, which if `true` should always call `onChange` and `onChanging` with `null` rather than `""`. The default value for this property can be either `true` or `false`, as the component author prefers. This feature is useful for some validation libraries where an empty string does not result in a "required" error, or to avoid storing empty strings in your database.

Must accept an optional boolean property `trimValue`, which if `true` should always call `onChange` and `onChanging` with a string that has no whitespace at the beginning or end. The default value for this property can be either `true` or `false`, as the component author prefers.

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

## Example

[ReactoForm Input](https://github.com/DairyStateDesigns/reacto-form/blob/master/lib/components/Input.jsx)

## FAQ

### Why is `isReadOnly` prop supported but not `isDisabled`?

In HTML, the form `input` element has both a `readonly` attribute and a `disabled` attribute. They are subtly different. The primary difference is that values from disabled inputs are not included when you serialize an HTML form. Also, disabled inputs do not receive focus and cannot be tabbed to. Read-only inputs, on the other hand, can be tabbed to, can receive focus, and are included in the serialized form values.

These distinctions do not really matter when doing forms this way, so we include only a single prop, `isReadOnly`. We use this rather than `isDisabled` because it is a clearer description. If you create an input component that ultimately renders an HTML input, you may choose to map `isReadOnly` to either HTML attribute. You can also add `isDisabled` if you really need to.

## Testing Your Component

To add tests that help ensure your input properly implements the spec, use the [composable-form-tests](https://github.com/DairyStateDesigns/composable-form-tests) package.
