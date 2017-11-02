# Input Component Specification

A component that actually displays and collects data. An input results in any JavaScript data type.

## Implementation

Because the closest `Form` type component does much of the heavy work, creating your own `Input` type component is not difficult.

- When the component is mounting, first store the current value, based on the incoming `value` property, in internal state. Then call `onChanging` followed by `onChanged` with that value. Your component may have a default value that is used when the `value` prop is undefined.
- Render the value from state for the user to see and edit. If the `isReadOnly` prop is `true`, do not allow editing it. If you want your component to always be read only, you do not have to provide any way to edit. (Make sure to document this.)
- Document the expected data type of your `value`, and throw errors whenever the data type is incorrect.
- If the user edits the value and you believe that their editing is in progress, update your internal value state and then call `onChanging`, passing it the new value.
- If the user edits the value and you believe that their editing is done for now, update your internal value state and then call `onChanging` AND `onChanged`, in that order, passing them the new value.
- If the `value` prop changes after the initial render, update your internal value state to match the new value and then call `onChanging` AND `onChanged`, in that order, passing them the new value.
- Visually, do not include any margin (no whitespace above, below, or to either side of your component). Exceptions can be made, but know that fields and forms in general will expect no margin.
- Optionally call `onSubmit` property if the user does something that makes you think they want to submit the form.
- Optionally show an indication or alter styles when the `isRequired` property is `true`
- Optionally show an indication or alter styles when the `errors` property has errors

## Additional Properties

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

Returns a boolean indicating whether anything has been entered/changed by the user. Return `true` if the value state does not match the value prop.

### getValue()

Returns the current value of the input in state

### resetValue()

Update the value state to match the value prop, erasing any user changes

### setValue(value)

Update the value state to be the provided value. This is similar to passing a new value to the `value` prop except that `isDirty()` will return true after setting it this way if the set value doesn't match the prop value, so this is the best way to simulate the user having entered/chosen a value.

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

## Example

[ReactoForm Input](https://github.com/DairyStateDesigns/reacto-form/blob/master/lib/components/Input.jsx)
