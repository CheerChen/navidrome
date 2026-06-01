import { parse, stringify } from 'query-string'

const LIST_PARAM_RESOURCES = ['album', 'song']

const getPersistableParams = (params) => {
  if (!params) {
    return undefined
  }

  const persistable = {}
  if (params.sort && params.order) {
    persistable.sort = params.sort
    persistable.order = params.order
  }
  if (params.perPage != null) {
    persistable.perPage = params.perPage
  }

  return Object.keys(persistable).length ? persistable : undefined
}

export const pickListParams = (resources = {}) =>
  LIST_PARAM_RESOURCES.reduce((acc, resource) => {
    const params = getPersistableParams(resources[resource]?.list?.params)
    if (params) {
      acc[resource] = params
    }
    return acc
  }, {})

export const getPersistedListParams = (resource) => {
  try {
    const state = JSON.parse(localStorage.getItem('state'))
    return state?.listParams?.[resource]
  } catch (err) {
    return undefined
  }
}

export const listParamsToSearch = (params, fallbackSearch = '') => {
  const fallbackParams = fallbackSearch
    ? parse(fallbackSearch.startsWith('?') ? fallbackSearch.slice(1) : fallbackSearch)
    : {}
  const persistableParams = getPersistableParams(params)
  const searchParams = {
    ...fallbackParams,
    ...persistableParams,
  }

  if (!Object.keys(searchParams).length) {
    return ''
  }
  return stringify(searchParams)
}
