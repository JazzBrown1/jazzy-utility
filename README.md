# Jazzy Utility

[![Build Status](https://travis-ci.org/JazzBrown1/jazzy-utility.svg?branch=master)](https://travis-ci.org/JazzBrown1/jazzy-utility)
[![Coverage Status](https://coveralls.io/repos/github/JazzBrown1/jazzy-utility/badge.svg)](https://coveralls.io/github/JazzBrown1/jazzy-utility)
[![Dependencies](https://img.shields.io/david/jazzbrown1/jazzy-utility)](https://npmjs.org/package/jazzy-utility)
[![Version](https://img.shields.io/npm/v/jazzy-utility)](https://npmjs.org/package/jazzy-utility)

A small utility library for use with... Well anything really.

## Installation

### Installing

~~~
npm install 'jazzy-utility'
~~~

### Importing

Cjs
~~~
const jazzy-utility = require('jazzy-utility');
const Stash = jazzy-utility.Stash;
~~~

Es Module
~~~
import {Stash} from 'jazzy-utility';
~~~

## jazzy-utility.Stash

### class Stash()

Methods:
<br/>put(*any* value) => *int* id
<br/>see(*int* id) => any value
<br/>take(*int* id) => any value
<br/>replace(*int* id, any value) => *void*
<br/>size() => *int* size
<br/>isEmpty() => *boolean* result
<br/>clear() => *void*

Usage:
~~~
const myStash = new Stash();
const myId = myStash.put('My Message');
console.log(myStash.see(myId)); // output 'My Message'
console.log(myStash.size()); // output 1
myStash.take(myId);
console.log(myStash.isEmpty()); // output true
~~~

## jazzy-utility.asyncForEach

### *function* asyncForEach(*array* array, *function* forEachFunction, *function* thenFunction) => *void*

Usage:
~~~
const actions = ['SaveLogs', 'CheckErrors', 'cleanUpData'];
asyncForEach(actions, (action, index, next) => {
  performAction(action, (result) => {
    if (result) next();
    else console.log('Failed at action ' + action + ' and aborted'); // Will not continue if next is not called
  });
}, () => {
  console.log('Job Complete');
});
~~~

## jazzy-utility.asyncDoAll

### *function* asyncDoAll(*array* array, *function* forEachFunction, *function* thenFunction) => *void*

Usage:
~~~
const messages = [
  {to: 'user1', text: 'hello user1'},
  {to: 'user2', text: 'hello user2'},
  {to: 'user3', text: 'hello user3'}  
];
asyncDoAll(messages, (message, index, done) => {
  sendMessage(message.to, message.text, () => {
    done();
  });
}, () => {
  console.log('Sending Complete');
});
~~~

## jazzy-utility.arrayDelete

### *function* arrayDelete(*array* array, *any* value) => *boolean* result

Usage:
~~~
const myArr = ['y', 'e', 'l', 'l', 'o'];
arrayDelete(myArr, 'l');
console.log(myArr); // output: ['y', 'e', 'l', 'o']
~~~