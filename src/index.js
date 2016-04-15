import bootstrap, {BOOT} from './lib/bootstrap'
import processModules from './lib/process-modules'
import combineReducers from './lib/combine-reducers'
import configureStore from './lib/configure-store'

export default bootstrap

export {
  bootstrap,
  processModules,
  combineReducers,
  configureStore,
  BOOT
}
