# FormList Component Specification

A dynamic list of inputs or forms. A FormList results in a JavaScript array.

## Implementation

A FormList is probably the most complicated component type to create. The only requirements are to use the `value` array to render the proper number of child components, allowing the user to add and remove items. In doing so, you must clone the children and pass them properties as necessary to be able to track the array value state.

It's best to start with the FormList component from ReactoForm and make modifications until it meets your needs.

## Example

[ReactoForm FormList](https://github.com/DairyStateDesigns/reacto-form/blob/master/lib/components/FormList.jsx)
