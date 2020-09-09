# Jazzy Utility

[![Build Status](https://travis-ci.org/JazzBrown1/jazzy-utility.svg?branch=master)](https://travis-ci.org/JazzBrown1/jazzy-utility)
[![Coverage Status](https://coveralls.io/repos/github/JazzBrown1/jazzy-utility/badge.svg)](https://coveralls.io/github/JazzBrown1/jazzy-utility)
[![Dependencies](https://img.shields.io/david/jazzbrown1/jazzy-utility)](https://npmjs.org/package/jazzy-utility)
[![Version](https://img.shields.io/npm/v/jazzy-utility)](https://npmjs.org/package/jazzy-utility)

A small utility library for use with... Well anything really.

### Table of contents

1. [ Installation](#Install)
2. [ Stash](#stash)
3. [ doAllAsync](#doAllAsync)
4. [ doAllCallbacks](#doAllCallbacks)
5. [ drill](#drill)
6. [ deleteArrayElement](#deleteArrayElement)
7. [ randomInt](#randomInt)
8. [ randomArrayElement](#randomArrayElement)
9. [ randomArrayElements](#randomArrayElements)
10. [ extractRandomArrayElements](#extractRandomArrayElements)
11. [ Workflow](#workflow)
12. [ Report Bug](#bugs)

<a name="Install"></a>

## Installation

### Installing

```
npm install 'jazzy-utility'
```

### Importing

Cjs

```
const jazzy-utility = require('jazzy-utility');
const Stash = jazzy-utility.Stash;
```

Es Module

```
import {Stash} from 'jazzy-utility';
```

<a name="stash"></a>

## Stash

A class that you can place data in and it returns an id as an integer. The data can then be retrieved with the integer. Particularly useful when interacting with external systems where a reference is required to relate a response to a query.

### _class_ Stash()

Methods:
<br/>put(_any_ value) => _text_ id
<br/>see(_text_ id) => _any_ value
<br/>take(_text_ id) => _any_ value
<br/>replace(_text_ id, _any_ value) => _void_
<br/>size() => _int_ size
<br/>isEmpty() => _boolean_ result
<br/>clear() => _void_
<br/>iterate(_function_ forEachFunction(_any_ item)) => _void_

Usage:

```
const myStash = new Stash();
const myId = myStash.put('My Message');
console.log(myStash.see(myId)); // output 'My Message'
console.log(myStash.size()); // output 1
myStash.take(myId);
console.log(myStash.isEmpty()); // output true
```

<a name="doAllAsync"></a>

## doAllAsync

### _function_ doAllAsync(_array_ array, _function_ doAllFunction) => Promise

Usage:

```
const urls = ['www.someurl.com/path', 'www.someurl.com/path', 'www.someurl.com/path'];
const data = new Array(urls.length);

await doAllAsync(urls, async (url, index) => {
  response = await fetch(url);
  if(!response.ok) throw new Error('Request Failed');
  const data[index] = response.text();
});

console.log(data)
```

<a name="doAllCallbacks"></a>

## doAllCallbacks

### _function_ doAllCallbacks(_array_ array, _function_ forEachFunction, _function_ thenFunction) => _void_

Usage:

```
const displayDelayedMessage = (delay, message, cb) => {
  setTimeout(() => {
    console.log(message);
    cb();
  }, delay)
}

const messages = [
  {delay: '200', text: 'Message 1'},
  {delay: '150', text: 'Message 2'},
  {delay: '100', text: 'Message 3'}
];

doAll(messages, (message, index, done) => {
  displayDelayedMessage(message.delay, message.text, () => {
    done();
  });
}, () => {
  console.log('Job Complete');
});
```

<a name="drill"></a>

## drill

### _function_ drill(_array_ path, _object_ object) => _any_ result

Usage:

```
const path = ['some', 'path', 'into', 'some', 'object'];
const obj = { some: { path: { into: { some: { object: 'success' } } } } };
console.log(drill(path, obj)); // output: success
```
<a name="deleteArrayElement"></a>

## deleteArrayElement

### _function_ deleteArrayElement(_array_ array, _any_ value) => _boolean_ result

Usage:

```
const myArr = ['y', 'e', 'l', 'l', 'o'];
deleteArrayElement(myArr, 'l');
console.log(myArr); // output: ['y', 'e', 'l', 'o']
```

<a name="randomInt"></a>

## randomInt

### _function_ randomInt(_int_ min, _int_ max) => _int_ result

Usage:

```
console.log(randomInt(0, 5)); // outputs an integer between 0 and 5 inclusive.
```

<a name="randomArrayElement"></a>

## randomArrayElement

### _function_ randomArrayElement(_array_ array) => _any_ result

Usage:

```
const myArr = ['y', 'e', 'l', 'l', 'o'];
console.log(randomArrayElement(myArr)); // outputs a random element from the input array.
```

<a name="randomArrayElements"></a>

## randomArrayElements

### _function_ randomArrayElements(_number_ multiplier, _array_ array) => _array_ result

Usage:

```
const myArr = [0, 1, 2, 3, 4];
console.log(randomArrayElements(0.4, myArr)); // outputs an array with two random elements.
console.log(myArr.length) // Outputs 5 as original array is not affected.
```

<a name="extractRandomArrayElements"></a>

## extractRandomArrayElements

### _function_ extractRandomArrayElements((_number_ multiplier, _array_ array) => _array_ result

Usage:

```
const myArr = [0, 1, 2, 3, 4];
console.log(extractRandomArrayElements(0.4, myArr)); // outputs an array with two random elements.
console.log(myArr.length) // Outputs 3 as 2 elements have been extracted
```

<a name="workflow"></a>

## Workflow

### _class_ Workflow()

A class that allows developers to build and dynamically update workflows. This enables developers to build dynamic flows and add steps at runtime making versatile and easily extendable code.

A work flow is made up of tasks which run sequentially; A task object contains an action which is a function, and optionally you can id for searching and an options object:

```
{
  action: (data, control) => {
    control.next(data);
  },
  options: {
    skipError: true, // task will be skipped if an error is thrown
    unblock: true, // will run the task at the end of the event queue good for spreading load when running cpu heavy workflows
  },
  id: 'some id'
}
```

You can just pass the action function instead of the task object if you do not requires ids to search or additional options.

Methods:
<br/>run(data) => _void_
<br/>add(_Object_ action) => _int_ insertedIndex
<br/>insertAfter(_function_ findFunction, _Object_ action) => _int_ insertedIndex
<br/>insertBefore(_function_ findFunction, _Object_ action) => _int_ insertedIndex
<br/>findAndDelete(_function_ findFunction) => _int_ deletedIndex

Usage:

```
const myTask = (taskID) => (arr, control) => {
  arr.push(taskID);
  control.next(arr);
};

const myWorkflow = new Workflow([
  { action: myTask('b'), id: 'b' },
  { action: myTask('c'), id: 'c' }
]);

myWorkflow.add({
  action: myTask('e'), id: 'e'
});

myWorkflow.insertBefore((el) => el.id === 'b', {
  action: myTask('a'), id: 'a'
});

myWorkflow.insertAfter((el) => el.id === 'c', {
  action: myTask('d'), id: 'd'
});

myWorkflow.add(myTask('f'));

myWorkflow.run([], (arr) => {
  console.log(arr) // output: ['a', 'b', 'c', 'd', 'e', 'f']
});
```

<a name="bugs"></a>

## Issues

If you encounter any issues please report them on the Library's [Github](https://github.com/JazzBrown1/jazzy-utility/issues).
