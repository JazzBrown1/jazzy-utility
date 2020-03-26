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

module.exports = {
  forEachCallbacks,
  doAll,
  Stash,
  randomArrayElement: randomEl,
  randomArrayElements: randomEls,
  randomInt,
  extractRandomArrayElements: extractRandomEls,
  deleteArrayElement: deleteArrayEl,
  // experimental
  store,
  Workflow,
  // to be deprecated for more explanatory names
  randomEl,
  randomEls,
  extractRandomEls,
  arrayDelete: deleteArrayEl,
  deleteArrayEl,
};
