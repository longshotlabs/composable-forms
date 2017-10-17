# Field Component Specification

A block of components that are all related to a single piece of data. Typically a label, an input, help text, and an error message.

## Basics

- Expects one or more children, at least one of which must be an input component. Children may also be descriptive text elements placed above or below the input, for example.
- Renders the children with anything it wants around them (usually labels, margin, etc.)
- Must render `label` if provided, though it need not be visible

## Properties

ALL properties are optional. The properties listed here are governed by this specification, but components are free to add any number of additional properties as necessary.

### name

```js
PropTypes.string
```

Specify a name if you want the `errors` array provided. This should be the same name as the input within the field. Some Field components might not do anything with errors and therefore don't need a name.

### label

```js
PropTypes.string
```

A label string to render

### errors

```js
PropTypes.arrayOf(PropTypes.shape({
  message: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
}))
```

Array of error objects for all inputs related to this field. The containing form will supply this if you specify a value for the `name` property. Use this for setting classes or styles to change the appearance of invalid fields/labels.

### isRequired

```js
PropTypes.bool
```

If a field has the ability to show an indication that it is required, it must determine requiredness from the `isRequired` property. Note that this is unrelated to actual validation; it is for display purposes only.

### Additional Properties

These properties are not strictly governed by this specification, but in order to make it easy to swap similar components, we recommend the following naming conventions:

- `className` (string): For inputs that render HTML, to be used as the `class` attribute on the outermost element.
- `labelClassName` (string): For inputs that render HTML, to be used as the `class` attribute on the label element.
- `labelFor` (string): For inputs that render HTML, to be used as the `for` attribute on the label element.
- `style` (object): For inputs that render HTML, to be used as the `style` attribute on the outermost element.

## Static Properties

### isComposableFormField

Set this to `true` so that the containing form and other components know that your component implements the Field specification.
