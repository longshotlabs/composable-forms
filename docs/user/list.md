# FormList Component Reference

A fixed or dynamic list of inputs or forms. A FormList results in a JavaScript array.

## Usage

A FormList wraps the following:

- Exactly one child that is an input OR exactly one child that is a form
- At most one ErrorsBlock child
- Any number of additional child elements that are not part of the form spec, such as help text to show above or below every item

The contents of a FormList element act as a template for each item in the list. The child form or input must not have the `name` property, and the child ErrorsBlock must not have the `names` property. The parent FormList will figure these out and add them.

A FormList will render as many items as necessary to display the current data, as well as "add" and "remove" buttons or some interface for adding and removing items.

## Properties

Only the `name` property is required. The properties listed here are governed by this specification, but components are free to add any number of additional properties as necessary.

### name

```js
PropTypes.string
```

Set this to the desired object path where the value should be stored, using object path notation.

### onChanging

```js
PropTypes.func
```

This function will be called as the FormList array changes, for example while a user is typing in one of the inputs. This is called more frequently than `onChange` but not necessarily on every single character change.

This may also be called on initial render to update default and hard coded input values.

### onChange

```js
PropTypes.func
```

This function will be called after the FormList array changes, whenever the user appears to be done changing one of the inputs, for example, after a user finishes typing and tabs off the field. It is also called as items are added or removed from the array. This is called less frequently than `onChanging`.

This may also be called on initial render to update default and hard coded input values.

### minCount

```js
PropTypes.number
```

Set this to the minimum number of items that must be in the list and shown in the UI. If `minCount` and `maxCount` are set to the same number, this would hide "add" and "remove" buttons and disable the ability for the user to change the number of items in the array.

### maxCount

```js
PropTypes.number
```

Set this to the maximum number of items that can be in the list and shown in the UI. If `minCount` and `maxCount` are set to the same number, this would hide "add" and "remove" buttons and disable the ability for the user to change the number of items in the array.

## Instance Properties

### getValue()

Returns the current array value of the list in state

### resetValue()

Forces a reset of the value state to match the value prop
