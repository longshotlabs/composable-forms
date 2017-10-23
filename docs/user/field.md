# Field Component Reference

A block of components that are all related to a single piece of data. Typically a label, an input, help text, and an error message.

## Usage

Use a `Field` around your inputs, errors, help text, and anything else related to that data. It will provide some kind of grouping such as borders, margin, or styling, as well as a label if you want one.

React JSX example:

```jsx
<Field name="name" className="form-group" labelClassName="control-label" label="Name">
  <Input name="name" type="text" className="form-control" />
  <p className="help-block">Enter your full name</p>
  <ErrorsBlock names={['name']} className="help-block" />
</Field>
```

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

A label string to render. Translate this before passing it in.

### errors

```js
PropTypes.arrayOf(PropTypes.shape({
  message: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}))
```

Array of error objects for all inputs related to this field. It is usually not necessary to pass these errors yourself because the closest ancestor form will do it, but you might want to pass them in when developing or testing.

### isRequired

```js
PropTypes.bool
```

Some implementations of `Field` will show a requiredness indicator if you pass `true` here. This is not used for validation; it is for display only.

### Additional Properties

These properties are not strictly governed by this specification, but in order to make it easy to swap similar components, we recommend the following naming conventions:

- `className` (string): For inputs that render HTML, to be used as the `class` attribute on the outermost element.
- `labelClassName` (string): For inputs that render HTML, to be used as the `class` attribute on the label element.
- `labelStyle` (object): For inputs that render HTML, to be used as the `style` attribute on the label element.
- `labelFor` (string): For inputs that render HTML, to be used as the `for` attribute on the label element.
- `style` (object): For inputs that render HTML, to be used as the `style` attribute on the outermost element.
