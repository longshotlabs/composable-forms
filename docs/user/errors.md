# ErrorsBlock Component Reference

Renders one or more validation errors

## Usage

To comply with this spec, an ErrorsBlock type component only needs to display at least one of the error messages passed to it. We recommend that you display all of them in some way, but you can display some subset of them (for example, only the first error) if your documentation is clear about what you display and why.

React JSX example:

```jsx
<ErrorsBlock names={['name', 'hours']} />
```

## Properties

### names

```js
PropTypes.arrayOf(PropTypes.string)
```

Specify one or more names (paths). Only validation errors that exactly match these names will be shown. Paths must be relative to the nearest ancestor form.

### errors

```js
PropTypes.arrayOf(PropTypes.shape({
  message: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
}))
```

The array of error objects. It is usually not necessary to pass these errors yourself because the closest ancestor form will do it, but you might want to pass them in when developing or testing.
