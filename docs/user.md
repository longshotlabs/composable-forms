# An Overview For Users

This documentation is for developers who just want to learn enough about this specification to be able to use all form packages that implement it.

If you are interested in creating a compatible package, you'll also want to read [the full spec](spec.md).

The Composable Form Specification is not tied to any framework or library, but we're going to use React for the code examples here.

## The "Form" Type

Not surprisingly, the core of the Composable Form Specification is the "Form" component. Any component exported by a package can be used as a "Form" component if it properly implements the specification.

When using [reacto-form](https://github.com/DairyStateDesigns/reacto-form), code that uses a simple empty Form component looks something like this:

```js
import React, { Component } from 'react';
import { Form } from 'reacto-form';
import mySubmissionFunction from './mySubmissionFunction';

class SomePage extends Component {
  onSubmit = (data, isValid) => {
    if (isValid) mySubmissionFunction(data);
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
      </Form>
    );
  }
}
```

Now let's pretend I decide I like the features of another "Form" component from a different package better. I update the code:

```js
import React, { Component } from 'react';
import { Form } from 'other-form';
import mySubmissionFunction from './mySubmissionFunction';

class SomePage extends Component {
  onSubmit = (data, isValid) => {
    if (isValid) mySubmissionFunction(data);
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
      </Form>
    );
  }
}
```

Note that only one thing changed here: `reacto-form` package name became `other-form`. Because both components conform to the specification for a Form-type component, I can rely on my form to continue working without any further changes.

(In reality, competing components may have other non-spec properties that differ, but the spec attempts to cover as many important properties as possible.)

For additional user documentation, refer to the [Form Type Reference](user/form.md).

## The "Input" Type

Anyway, let's add some inputs to our form.

```js
import React, { Component } from 'react';
import { Form, Input } from 'reacto-form';
import mySubmissionFunction from './mySubmissionFunction';

class SomePage extends Component {
  onSubmit = (data, isValid) => {
    if (isValid) mySubmissionFunction(data);
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Input name="firstName" type="text" />
        <Input name="lastName" type="text" />
      </Form>
    );
  }
}
```

Only the `name` property is required on inputs. An input can render pretty much anything (and it's not limited to HTML either, so, for example, React Native implementations are possible).

Inputs can output a value of any data type, so you would have to read package documentation to know what the resulting value will be. In the example here, the values will be strings.

For additional user documentation, refer to the [Input Type Reference](user/input.md).

## Submission

We will now add a Submit button:

```js
import React, { Component } from 'react';
import { Form, Input } from 'reacto-form';
import mySubmissionFunction from './mySubmissionFunction';

class SomePage extends Component {
  onSubmit = (data, isValid) => {
    if (isValid) mySubmissionFunction(data);
  };

  render() {
    return (
      <Form ref={i => { this.form = i; }} onSubmit={this.onSubmit}>
        <Input name="firstName" type="text" />
        <Input name="lastName" type="text" />
        <button type="button" onClick={() => { this.form.submit(); }}>Submit</button>
      </Form>
    );
  }
}
```

As per the specification, the Form component (regardless of which package provides it) will have a `submit()` instance function and will call the `onSubmit` function based on that.

The `data` passed to `onSubmit` is an object created by combining all of the descendant values. In this case:

```js
{
  firstName: 'John',
  lastName: 'Candy',
}
```

## Object Path Notation

But you are not limited to simple key names for the `name` properties; you can use object path notation to provide any property accessor. These are parsed with `lodash.get` and `lodash.set`.

For example:

```js
<Input name="addresses[0].city" type="text" value="Anchorage" />
<Input name="addresses[0].postalCode" type="text" value="99501" />
```

Would result in a submission of:

```js
{
  addresses: [
    {
      city: 'Anchorage',
      postalCode: '99501',
    },
  ],
}
```

NOTE: Numeric keys are not supported.

## The "Field" Type

In most cases, you'll want some additional stuff around your input: a label, error messages, descriptive text, a requiredness indicator, an icon, borders, padding. A Field-type component provides these things.

```js
import React, { Component } from 'react';
import { Field, Form, Input } from 'reacto-form';
import mySubmissionFunction from './mySubmissionFunction';

class SomePage extends Component {
  onSubmit = (data, isValid) => {
    if (isValid) mySubmissionFunction(data);
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Field label="First Name">
          <Input name="firstName" type="text" />
        </Field>
        <Field label="Last Name">
          <Input name="lastName" type="text" />
        </Field>
      </Form>
    );
  }
}
```

Field components don't have many requirements or restrictions. They can do pretty much anything they want as long as they render their children.

For additional user documentation, refer to the [Field Type Reference](user/field.md).

## Nesting Forms

A Form component is really just a group of inputs resulting in a single JavaScript object. As such, you can put forms within forms. Forms that have parent forms will track and gather their descendant input values just as top-level forms do, but they'll delegate validation and submission to the top-level form.

A nested form must have a `name` property with an object path notation string like an input.

A nesting example:

```js
import React, { Component } from 'react';
import { Field, Form, Input } from 'reacto-form';
import mySubmissionFunction from './mySubmissionFunction';

class SomePage extends Component {
  onSubmit = (data, isValid) => {
    if (isValid) mySubmissionFunction(data);
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Field label="First Name">
          <Input name="firstName" type="text" />
        </Field>
        <Field label="Last Name">
          <Input name="lastName" type="text" />
        </Field>
        <h2>Mailing Address</h2>
        <Form name="addresses[0]">
          <Field label="City">
            <Input name="city" type="text" />
          </Field>
          <Field label="Postal Code">
            <Input name="postalCode" type="text" />
          </Field>
        </Form>
      </Form>
    );
  }
}
```

Note that object path notation begins from the closest form, so the "city" input value is saved to the path `addresses[0].city` in the onSubmit data.

Packages can choose to export entire premade forms as long as they conform the the specification for Form-type components. So for example, you might be able to plug in an open source address form component like this:

```js
import React, { Component } from 'react';
import { Field, Form, Input } from 'reacto-form';
import AddressForm from 'nifty-address-form-package';
import mySubmissionFunction from './mySubmissionFunction';

class SomePage extends Component {
  onSubmit = (data, isValid) => {
    if (isValid) mySubmissionFunction(data);
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Field label="First Name">
          <Input name="firstName" type="text" />
        </Field>
        <Field label="Last Name">
          <Input name="lastName" type="text" />
        </Field>
        <h2>Mailing Address</h2>
        <AddressForm name="addresses.mailing" />
        <h2>Physical Address</h2>
        <AddressForm name="addresses.physical" />
      </Form>
    );
  }
}
```

## Forms vs Inputs

You may have noticed that forms and inputs have many of the same properties. They are very similar, with the following differences:

- A form must handle validation and track validation errors
- A form must have a plain JavaScript object as its value. (An input CAN have a plain JavaScript object as its value, or any other data type.)
- A form must allow, be aware of, and pass data to other arbitrary components in its descendant tree (both those governed by this spec and those not)
- Generally a form is expected to contain fields while an input is expected to be contained by a field.
- An input will always be a descendant of a form while a form may or may not be a descendant of another form.

## The "FormList" Type

A FormList maps to an array in your data structure, that is, some arbitrary number of similar items that can be added, edited, and removed.

When using a FormList, you include children that serve as the template for each item in the list. Among these children can be at most one ErrorsBlock and exactly one item data element, which is either an input (for an array of scalar data) or a form (for an array of objects).

When using an ErrorsBlock as a child of FormList, omit the `names` property. When using an Input or Form as a child of FormList, omit the `name` property. These properties are added by FormList, which specifies the correct index for each item.

Here is a twist on an earlier example, if we wanted to let a user enter any number of addresses:

```js
import React, { Component } from 'react';
import { Field, Form, FormList, Input } from 'reacto-form';
import AddressForm from 'nifty-address-form-package';
import mySubmissionFunction from './mySubmissionFunction';

class SomePage extends Component {
  onSubmit = (data, isValid) => {
    if (isValid) mySubmissionFunction(data);
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Field label="First Name">
          <Input name="firstName" type="text" />
        </Field>
        <Field label="Last Name">
          <Input name="lastName" type="text" />
        </Field>
        <h2>Addresses</h2>
        <FormList name="addresses">
          <AddressForm />
        </FormList>
      </Form>
    );
  }
}
```

For additional user documentation, refer to the [FormList Type Reference](user/list.md).

## Validation and Displaying Errors

TODO
