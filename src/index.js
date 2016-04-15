import bootstrap, {BOOT} from './lib/bootstrap'
import processModules from './process-modules'
import combineReducers from './combine-reducers'
import configureStore from './configure-store'

export default bootstrap

export {
  bootstrap,
  processModules,
  combineReducers,
  configureStore,
  BOOT
}
