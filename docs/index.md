# Introduction

The Composable Form Specification defines a standard API contract among the components that make up a web form, specifically inputs, fields, lists, and forms. The benefit of a common, strict, and well-defined specification is that various authors can create discreet components that conform to the specification, and an app developer can then mix and match these components as necessary without any further markup or code changes.

## Features

- Not tied to HTML, standard HTML `<form>` elements, or standard HTML form inputs
- Not tied to any particular UI framework
- Form inputs can be swapped out in seconds
- Forms can be nested within other forms and are themselves componentized
- As long as components implement the required API with the required logic, they are free to do anything else as they wish
- Client-side validation handlers are interchangable
- No dependencies on certain servers or databases
- Complexities are compartmentalized and abstracted away as much as possible. In particular, "input" type components are the easiest to make because the containing "form" type component handles most of the tricky logic.

## Why It's Useful

Say you are a developer who has been asked to create a Web form that collects business information. You make the following rough map of what you need:

```
Business Name (string)
Contact Name (string)
Location (object with latitude and longitude)
Mailing Address (street1, street2, city, state/province, country, countryCode, postal code, attn, all strings)
Hours (ordered list of day of week + hours, ability to add/remove)
Email (string)
Phone (string)
Logo (upload, resulting in ID or URL string)
```

There is a lot to do here. You'll want some sort of map input for the latitude and longitude; a block of fields for the address, perhaps with address validation; a way of adding, removing, and editing the hours entries; image upload and validation; possibly some email or phone regular expression validation. These things are more easily accomplished by using readily available packages, so you decide to take a look at what's available.

Now let's assume you're using React and you're specifically looking for React components. While you might be able to find what you need, it's unlikely that they all handle their data in the same way, some may look different from others and be tricky to style, and some might require a lot of custom hookup code, which you'd then need to redo if you decide to swap in a different component instead.

Also, you'll have to write some custom logic for validating and displaying those validation errors to the user.

Wouldn't it be nice if all the form components could work together seamlessly? What if you could even import the entire address entry form from a package and drop it into your main form without any extra work? And wouldn't it be great if validating and displaying validity was automatic?

This is why we've created the Composable Form Specification.

## Author

This specification is maintained by [Dairy State Designs](http://dairystatedesigns.com/) and open to modification requests from the community. The spec author is [Eric Dobbertin](https://github.com/aldeed), who created [AutoForm](https://github.com/aldeed/meteor-autoform), a widely used form package for [Meteor](https://www.meteor.com/)/[Blaze](http://blazejs.org/).

## License

MIT

## A Reference Implementation for React

While this specification is intended to be generic, we are initially concentrating on React. Please try out our NPM package, [reacto-form](reacto-form.md), and let us know what you think.

## Documentation

For developers who just want to learn enough about this specification to be able to use all form packages that implement it, have a look at the [user documentation](user.md).

For developers who want to create components that implement the specification, check out the [actual specs](spec.md).
