import Controller from 'cerebral'
import Model from 'cerebral-baobab'
import signals from './signals'
import state from './state'

const baobabOptions = {
  //tnr: put any special baobab options here
}

const model = Model(state, baobabOptions)
const services = {}
var controller = Controller(model, services)
signals(controller)
export default controller
