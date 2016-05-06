# Modules

A module is made of a reducer and/or a middleware. Its basic signature is the following:

```js
const module = {

  reducer: (state, action) => {

  },
  
  middleware: store => next => action => {

  }
  
}
```