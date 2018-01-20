# ErrorsBlock Component Specification

Renders one or more validation errors

## Implementation

To comply with this spec, an ErrorsBlock type component only needs to display at least one of the error messages passed to it. We recommend that you display all of them in some way, but you can display some subset of them (for example, only the first error) if your documentation is clear about what you display and why.

## Properties

### errors

```js
PropTypes.arrayOf(PropTypes.shape({
  message: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}))
```

The array of error objects. Display the `message` string from each. You should assume this text has already been translated.

## Static Properties

### defaultProps [OPTIONAL]

Setting the `defaultProps` static property is recommended but not required.

### isFormErrors [REQUIRED]

Set this to `true` so that the containing form and other components know that your component implements the ErrorsBlock specification.

## Example

[ReactoForm ErrorsBlock](https://github.com/DairyStateDesigns/reacto-form/blob/master/lib/components/ErrorsBlock.jsx)
