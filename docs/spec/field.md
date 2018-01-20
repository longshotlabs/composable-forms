# Field Component Specification

A block of components that are all related to a single piece of data. Typically a label, an input, help text, and an error message.

## Implementation

To comply with this spec, a Field type component must:

- expect one or more children, at least one of which must be an Input-type component. Children may also be descriptive text elements placed above or below the input, for example.
- render all the children with anything it wants around them (usually labels, margin, etc.)
- Accept content in the `label` property and render it somewhere

## Properties

ALL properties are optional. The properties listed here are governed by this specification, but components are free to add any number of additional properties as necessary.

### label

```js
PropTypes.node
```

A label string or element to render. You may accept only strings if necessary.

### errors

```js
PropTypes.arrayOf(PropTypes.shape({
  message: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}))
```

The containing form will supply this if you specify a value for the `name` property. You may, but do not have to, add classes or adjust styles based on the errors passed in here.

### isRequired

```js
PropTypes.bool
```

If a field has the ability to show an indication that it is required, it must determine requiredness from the `isRequired` property. Note that this is unrelated to actual validation; it is for display purposes only.

### Additional Properties

These properties are not strictly governed by this specification, but in order to make it easy to swap similar components, we recommend the following naming conventions:

- `className` (string): For inputs that render HTML, to be used as the `class` attribute on the outermost element.
- `labelClassName` (string): For inputs that render HTML, to be used as the `class` attribute on the label element.
- `labelStyle` (object): For inputs that render HTML, to be used as the `style` attribute on the label element.
- `labelFor` (string): For inputs that render HTML, to be used as the `for` attribute on the label element.
- `style` (object): For inputs that render HTML, to be used as the `style` attribute on the outermost element.

## Static Properties

### defaultProps

You must include the `defaultProps` static property, even if it is only an empty object.

### isFormField

Set this to `true` so that the containing form and other components know that your component implements the Field specification.

## Example

[ReactoForm Field](https://github.com/DairyStateDesigns/reacto-form/blob/master/lib/components/Field.jsx)
