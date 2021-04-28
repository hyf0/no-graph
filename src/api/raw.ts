import Axios from 'axios'

const storeKey = 'noGraph$cacheStore'
export const cacheStore = {
  cacheObj: JSON.parse(
    localStorage.getItem(storeKey) ?? JSON.stringify({})
  ) as { [key: string]: any },
  get<T = any>(key: string): T | null {
    return this.cacheObj[key] ?? null
  },
  set(key: string, value: any) {
    this.cacheObj[key] = value
    localStorage.setItem(storeKey, JSON.stringify(this.cacheObj))
  },
  clear() {
    this.cacheObj = {}
    localStorage.setItem(storeKey, JSON.stringify({}))
  }
}
if (__DEV__) {
  // @ts-ignore
  window.c = cacheStore
}

export const loadUserContent = async () => {
  const cacheResult = cacheStore.get(`loadUserContent`)
  if (cacheResult !== null) {
    return cacheResult
  }
  const { data } = await Axios.post<{
    recordMap: {
      [key: string]: any
    }
  }>('/loadUserContent', {
    cursor: { stack: [] },
    chunkNumber: 0,
    limit: 50,
    verticalColumns: false,
  })
  cacheStore.set('loadUserContent', data)
  return data
}

export const loadCachedPageChunk = async (pid: string) => {
  const cacheResult = cacheStore.get(`loadCachedPageChunk/${pid}`)
  if (cacheResult !== null) {
    return cacheResult
  }
  const { data } = await Axios.post<{
    stack: any[]
    recordMap: {
      [key: string]: any
    }
  }>('/loadCachedPageChunk', {
    pageId: pid,
    limit: 30,
    cursor: { stack: [] },
    chunkNumber: 0,
    verticalColumns: false,
  })
  cacheStore.set(`loadCachedPageChunk/${pid}`, data)

  return data
}

export const getBacklinksForBlock = async (bid: string) => {
  const cacheResult = cacheStore.get(`getBacklinksForBlock/${bid}`)
  if (cacheResult !== null) {
    return cacheResult
  }
  const { data } = await Axios.post('/getBacklinksForBlock', {
    blockId: bid,
  })
  cacheStore.set(`getBacklinksForBlock/${bid}`, data)
  return data
}

export const queryCollection = async (value: {
  id: string
  collection_id: string
}) => {
  const cacheResult = cacheStore.get(
    `queryCollection/${value.id}${value.collection_id}`
  )
  if (cacheResult !== null) {
    return cacheResult
  }
  const { data } = await Axios.post('/queryCollection', {
    collectionId: value.collection_id,
    collectionViewId:  value.id,
    query: { sort: [{ property: 'xYf?', direction: 'descending' }] },
    loader: {
      type: 'table',
      limit: 50,
      searchQuery: '',
      userTimeZone: 'Asia/Hong_Kong',
      loadContentCover: true,
    },
  })
  cacheStore.set(`queryCollection/${value.id}${value.collection_id}`, data)
  return data
}
