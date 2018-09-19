import createApiClient from '../helpers/createApiClient'
import feathersVuex from 'feathers-vuex'

export default async ({app, store, req, res}) => {
  const feathersClient = createApiClient({req, res})
  const { service } = feathersVuex(feathersClient, { idField: '_id' })

  const servicePath = 'usersettings'
  const servicePlugin = service(servicePath, {
    namespace: 'feathers-vuex-usersettings'
  })

  servicePlugin(store);
};
