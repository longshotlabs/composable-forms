# ReactoForm

ReactoForm is our React implementation of the [Composable Form Specification](user.md). It provides Form, FormList, Field, and ErrorsBlock components, as well as several basic Input components. The Form component should meet the needs of most developers. The other components are somewhat opinionated examples that many developers will be fine with and can style as necessary. Those that need something different can publish their own components in a separate package following the spec.

## Installation

```bash
$ npm i --save reacto-form
```

## Example

```js
import React, { Component } from 'react';
import {
  BooleanCheckboxInput,
  DateTimeInput,
  ErrorsBlock,
  Field,
  Form,
  FormList,
  Input,
  SelectCheckboxInput,
} from 'reacto-form';
import moment from 'moment-timezone';

import createPlace from '../createPlace';
import validatePlace from '../validatePlace';

const dayOptions = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];
const disableBasedOnAllDayValue = ({ openAllDay }) => !!openAllDay;

export default class PlacesCreateForm extends Component {
  render() {
    const midnightThisMorning = moment().tz('America/Chicago').hour(0).minute(0).second(0).millisecond(0).toDate();
    return (
      <Form ref={i => { this.form = i; }} onSubmit={createPlace} validator={validatePlace}>
        <Field name="name" label="Name">
          <Input name="name" type="text" />
          <ErrorsBlock names={['name']} />
        </Field>
        <Field name="website" label="Website">
          <Input name="website" type="url" />
          <ErrorsBlock names={['website']} />
        </Field>
        <h3>Hours</h3>
        <ErrorsBlock names={['hours']} />
        <FormList name="hours">
          <ErrorsBlock />
          <Form>
            <Field name="startDate" label="Start date">
              <DateTimeInput name="startDate" moment={moment} timezone="America/Chicago" value={midnightThisMorning} />
              <ErrorsBlock names={['startDate']} />
            </Field>
            <Field name="days" label="Days">
              <SelectCheckboxInput name="days" options={dayOptions} />
              <ErrorsBlock names={['days']} />
            </Field>
            <Field name="openAllDay">
              <BooleanCheckboxInput name="openAllDay" label="Open all day" />
              <ErrorsBlock names={['openAllDay']} />
            </Field>
            <Field name="openTime" label="Opens at">
              <Input type="time" name="openTime" className="form-control" placeholder="HH:MM" isReadOnly={disableBasedOnAllDayValue} />
              <ErrorsBlock names={['openTime']} />
            </Field>
            <Field name="closeTime" label="Closes at">
              <Input type="time" name="closeTime" placeholder="HH:MM" isReadOnly={disableBasedOnAllDayValue} />
              <ErrorsBlock names={['closeTime']} />
            </Field>
          </Form>
        </FormList>
        <button type="button" onClick={() => { this.form.submit(); }}>Add</button>
      </Form>
    );
  }
}
```

## Component Reference

### Form

Implements the [Form spec](spec/form.md).

In addition to following the spec, these props are supported:

- Use `style` or `className` props to help style the HTML form container, which is a DIV rather than a FORM.
- Set `logErrorsOnSubmit` to `true` to log validation errors to the console when submitting. This can help you figure out why your form isn't submitting if, for example, you forgot to include an ErrorsBlock somewhere so there is an error not shown to the user.

### FormList

Implements the [FormList spec](spec/list.md).

This implementation appears as a list with the item template on the right and remove buttons on the left, plus a final row with an add button in it.

In addition to following the spec, you can use the following props to help style the component:

- addButtonText: String to use as the text of the add button. Default "+"
- addItemRowStyle: Style object for the row after the last item, where the add button is
- buttonClassName: String of space-delimited classes to use on the add and remove buttons
- buttonStyle: Style object for the add and remove buttons
- className: String of space-delimited classes to use on the list container
- itemAreaClassName: String of space-delimited classes to use on the inner container of each item
- itemAreaStyle: Style object for the inner container of each item
- itemClassName: String of space-delimited classes to use on the outer container of each item
- itemStyle: Style object for the outer container of each item
- itemRemoveAreaClassName: String of space-delimited classes to use on the remove button area of each item
- itemRemoveAreaStyle: Style object for the remove button area of each item
- removeButtonText: String to use as the text of the remove buttons. Default "–"
- style: Style object for the list container

If you want a different add/remove experience that can't be acheived with classes or styles, then you'll need to make your own implementation of FormList.

### Field

Implements the [Field spec](spec/field.md).

Renders something like

```js
<div>
  <label>{label}</label>
  {children}
</div>
```

You can use the following props to customize:

- className: String of space-delimited classes to use on the div
- labelClassName: String of space-delimited classes to use on the label
- labelFor: The "for" attribute to use on the label
- style: Style object for the div

If you set the `name` prop, then when there are errors for that name, the "has-error" class will be added to the div.

If you set the `isRequired` prop to `true`, then the "required" class will be added to the div, which you can use to add an asterisk or to show requiredness in some other way.

Note that the `label` prop can be any React node. Typically it's a string, but you could provide HTML or even another React component to render inside the `label` element.

### ErrorsBlock

Implements the [ErrorsBlock spec](spec/errors.md).

Renders something like

```js
<div>
  <!-- One of the following divs for each error -->
  <div data-name={error.name}>{error.message}</div>
</div>
```

You can use the following props to customize:

- className: String of space-delimited classes to use on the outer div
- errorClassName: String of space-delimited classes to use on each error message div
- errorStyle: Style object for each error message div
- style: Style object for the outer div

### BooleanCheckboxInput

Implements the [Input spec](spec/form.md) with a Boolean data type.

Renders something like

```js
<div>
  <label><input type="checkbox"> {label}</label>
</div>
```

This renders a check box with a label, so if using it within a Field, you would not usually pass a `label` to Field.

You can use the following props to customize:

- className: String of space-delimited classes to use on the div
- style: Style object for the div

### DateTimeInput

Implements the [Input spec](spec/form.md) with a Date data type.

Renders multiple HTML inputs that together allow the user to enter a specific date + time in a given timezone. This includes a month select, with month names in English.

There are many ways that datetime entry can be done and this represents just one example. If you need something different, it should be easy to copy this example component and make a new one conforming to the Input spec.

### Input

Implements the [Input spec](spec/form.md) with a String data type.

This renders as an HTML input element or a textarea element. Specify the `type` prop as you would for HTML, but only the following types are allowed:

- color
- date
- datetime-local
- email
- file
- hidden
- month
- password
- range
- search
- tel
- text
- time
- url
- week

If you want multi-line input, set `allowLineBreaks={true}` and you don't need a `type`.

By default, the string value entered by the user is trimmed. Set `trimValue={false}` to skip this.

By default, empty strings (after trimming) are converted to `null` instead. This can help make validation more logical and reduce space used in your database. If it isn't what you want, you can set `convertEmptyStringToNull={false}`.

Use `maxLength` prop to set a maximum number of characters the user can enter.

Use `placeholder` prop to set placeholder text.

You can use the following props to customize:

- className: String of space-delimited classes to use on the input or textarea
- style: Style object for the input or text area

### SelectInput

Implements the [Input spec](spec/form.md) with user-defined options that may have a Boolean, Number, or String data type. Single selection.

See the "Selection Inputs" section of [the Input Component Reference](user/input.md) for details about passing options.

You can use the following props to customize:

- className: String of space-delimited classes to use on the select
- style: Style object for the select

### SelectCheckboxInput

Implements the [Input spec](spec/form.md) with user-defined options that may have a Boolean, Number, or String data type. Multiple selection.

See the "Selection Inputs" section of [the Input Component Reference](user/input.md) for details about passing options.

You can use the following props to customize:

- className: String of space-delimited classes to use on the container div
- itemClassName: String of space-delimited classes to use on each item div
- itemStyle: Style object for each item div
- labelClassName: String of space-delimited classes to use on each item label
- labelStyle: Style object for each item label
- checkboxClassName: String of space-delimited classes to use on each item checkbox input
- checkboxStyle: Style object for each item checkbox input
- style: Style object for the container div
