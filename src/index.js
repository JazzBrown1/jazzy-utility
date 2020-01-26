import forEachCallbacks from './forEachCallbacks';
import doAll from './doAll';
import deleteArrayEl from './deleteArrayEl';
import Stash from './stash';
import randomInt from './randomInt';
import randomEl from './randomEl';
import randomEls from './randomEls';
import Workflow from './workflow';
import extractRandomEls from './extractRandomEls';
import store from './store';

export {
  forEachCallbacks,
  doAll,
  deleteArrayEl,
  Stash,
  randomEls,
  randomEl,
  randomInt,
  Workflow,
  extractRandomEls,
  deleteArrayEl as arrayDelete,
  store
};

export default {
  forEachCallbacks,
  doAll,
  deleteArrayEl,
  Stash,
  randomEl,
  randomEls,
  randomInt,
  Workflow,
  extractRandomEls,
  // to be deprecated
  arrayDelete: deleteArrayEl
};
