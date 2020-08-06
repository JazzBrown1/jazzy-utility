import forEachCallbacks from './forEachCallbacks';
import doAll from './doAll';
import deleteArrayEl from './deleteArrayEl';
import Stash from './stash';
import randomInt from './randomInt';
import randomEl from './randomEl';
import randomEls from './randomEls';
import Workflow from './workflow';
import extractRandomEls from './extractRandomEls';
import { store } from './store';
import doAllAsync from './doAllAsync';
import drill from './drill';
import forEachAsync from './forEachAsync';

export {
  doAllAsync,
  forEachAsync,
  drill,
  forEachCallbacks,
  doAll,
  Stash,
  randomEl as randomArrayElement,
  randomEls as randomArrayElements,
  randomInt,
  extractRandomEls as extractRandomArrayElements,
  deleteArrayEl as deleteArrayElement,
  // experimental
  store,
  Workflow,
  // to be deprecated for more explanatory names
  randomEl,
  randomEls,
  extractRandomEls,
  deleteArrayEl as arrayDelete,
  deleteArrayEl
};

export default {
  forEachCallbacks,
  doAllAsync,
  doAll,
  Stash,
  drill,
  randomArrayElement: randomEl,
  randomArrayElements: randomEls,
  randomInt,
  extractRandomArrayElements: extractRandomEls,
  deleteArrayElement: deleteArrayEl,
  forEachAsync,
  // experimental
  store,
  Workflow,
  // to be deprecated for more explanatory names
  randomEl,
  randomEls,
  extractRandomEls,
  arrayDelete: deleteArrayEl,
  deleteArrayEl
};
