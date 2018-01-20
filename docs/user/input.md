# Input Component Reference

A component that actually displays and collects data. An input results in a collected value of any JavaScript data type.

## Usage

An input component may render pretty much anything that displays and/or allows editing of data. Each input package's documentation should explain what it looks like and how a user interacts with it.

To use an input component, you just have to put it within a Form or FormList (potentially surrounded by a Field if needed), and supply a `name` for it, which is a string that identifies the object path at which the input's value can be retrieved and stored.

React JSX example:

```js
<Form>
  <Input type="text" name="title" placeholder="Title" />
  <Input type="text" name="author.firstName" placeholder="Author First Name" />
  <Input type="text" name="author.lastName" placeholder="Author Last Name" />
</Form>
```

Or with fields:

```js
<Form>
  <Field name="title" label="Title">
    <Input type="text" name="title" />
  </Field>
  <Field name="title" label="Title">
    <Input type="text" name="author.firstName" placeholder="Author First Name" />
  </Field>
  <Field name="title" label="Title">
    <Input type="text" name="author.lastName" placeholder="Author Last Name" />
  </Field>
</Form>
```

Don't think of inputs as being exactly like the `<input>` element in HTML. An input may be that, but it also may be a select box, a group of check boxes or radios, a canvas the user can draw on, a map, or anything else you can imagine. If it can display a value and allow the user to edit it somehow, it can satisfy the Input specification.

## Properties

All properties are optional. The properties listed here are governed by this specification, but components are free to add any number of additional properties as necessary.

### name

```js
PropTypes.string
```

Set this to the desired object path where the value should be stored, using object path notation.

### value

If necessary, provide a default input value here. Typically you do not need to do this but instead you would set the top-level Form's `value` property to the current object (for an update form) or a default object (for a create form).

### onChanging

```js
PropTypes.func
```

As the input value changes, the input component will call `onChanging(newValue)`, where `newValue` is the new value after the most recent user entry. For example, this may be called as a user types or as they move a pointing device or range slider.

Calls to `onChanging` may be throttled as necessary by the input. Thus, you should never expect that every single value change is passed to `onChanging`. For example, a throttled text input may call `onChanging` on every typed letter for a slow typer, but call only every third typed letter for a fast typer.

### onChange

```js
PropTypes.func
```

After the input value changes, the input component will call `onChange(newValue)`, where `newValue` is the new value after the most recent user entry. For example, a text entry input may call `onChanging` repeatedly while a user types, and then call `onChange` after they stop typing for a bit, or after they click, tap, or tab off the field.

### isRequired

```js
PropTypes.bool
```

Some implementations of `Input` may show a requiredness indicator if you pass `true` here. This is not used for validation; it is for display only.

### isReadOnly

```js
PropTypes.bool
```

Pass `true` to make the input visually appear disabled and not respond to user input. Note that the HTML spec distinguishes between "readonly" and "disabled" for inputs, where "disabled" inputs are not included upon form submission. This specification includes no such distinction, and all input values are included in the form object.

### Additional Properties

These properties are not strictly governed by this specification, but in order to make it easy to swap similar components, we recommend the following naming conventions:

- `className` (string): For inputs that render HTML, to be used as the `className` prop on the outermost element.
- `maxLength` (integer): For inputs that support limiting the number of characters the user can type.
- `placeholder` (string): For inputs that show placeholder text when blank
- `style` (object): For inputs that render HTML, to be used as the `style` prop on the outermost element.

## Instance Properties

### isDirty()

Returns a boolean indicating whether anything has been entered/changed by the user.

### getValue()

Returns the current value of the input in state

### resetValue()

Forces a reset of the value state to match the value prop

### setValue(value)

Update the value state to be the provided value. This is similar to passing a new value to the `value` prop except that `isDirty()` will return true after setting it this way if the set value doesn't match the prop value, so this is the best way to simulate the user having entered/chosen a value.

## More Details By Type

### Date Inputs

Inputs that have a `Date` instance as their value accept an optional string property `timezone` that you can set to the IANA timezone string that should be used to interpret the user-entered time, and/or an optional `offset` string property that you can set to the offset string, e.g. "+00:00". If neither are supplied, the timezone/offset of the local machine is used.

Some may accept `max` and `min` properties that will be set to a `Date` object representing the earliest and latest times that may be selected.

### Selection Inputs

Inputs that show multiple values to the user and allow selection get those options from a property called `options`. All such components expect options in one of two valid formats:

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

The value is a number in these examples but could be a string, a boolean, a Date, or anything. A selection input can limit the data types it supports for values. Refer to the input package's documentation.

In addition to `label` and `value`, which are required, `id` can be added if any values are duplicated. `id` is used for array tracking (e.g., `key` prop in React) if supplied; otherwise `value` is used.

Dropdown-type selection inputs will add a first option that is shown when the value is empty (undefined, null, empty string, etc.). You can define the label for this option using a string property called `emptyLabel`.
