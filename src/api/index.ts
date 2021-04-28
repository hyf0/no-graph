import './_init'

import { GNode } from '@/models'
import pLimit from 'p-limit'
import { loadCachedPageChunk, loadUserContent } from './raw'

export * from './raw'

// export const getSpaces = async () => Axios.post('/getSpaces', {})

const runWithLimit = pLimit(2)
let readedPidSet = new Set<string>()

// const parseCollection = async (value: any, path: string[]) => {
//   // if (readedPidSet.has(pid)) return
//   // readedPidSet.add(pid)
//   try {
//     const resp = await runWithLimit(() => queryCollection(value))
//     console.log('resp', resp)
//     const { recordMap: pageChunk } = resp
//     const blocks = Object.values(pageChunk)
//       .map((item: any) => Object.values(item))
//       .flat(1)
//       .map((item: any) => item.value)
//       // .filter((value) => value != null && !ignoreGNodeTypeSet.has(getBlockType(value) as any))
//     const nodeMap = new Map(
//       blocks.map((b) => GNode.from(b)).map((n) => [n.opts.id, n])
//     )
//     console.log('nodeMap', nodeMap)
//     ;[...nodeMap.values()].forEach((child) => {
//       if (path.includes(child.opts.id)) {
//         return
//       }
//       const pid = path[path.length - 1]
//       GEdge.of(pid, child.opts.id)

//       switch (child.opts.type) {
//         case 'Page':
//           {
//             thunks.push(() => parsePage(child.opts.id, [...path, pid]))
//           }
//           break
//       }
//     })
//   } catch (err) {
//     console.log('parsePage error')
//     console.error(err)
//   }
// }

const parsePage = async (pid: string) => {
  if (readedPidSet.has(pid)) return
  readedPidSet.add(pid)
  try {
    const resp = await runWithLimit(() => loadCachedPageChunk(pid))
    const { recordMap: pageChunk } = resp
    const blocks = Object.values(pageChunk)
      .map((item: any) => Object.values(item))
      .flat(1)
      .map((item: any) => item.value)
      .filter((value) => value != null)

    const nodes = blocks.map((b) => GNode.from(b))
    const thunks: (() => Promise<void>)[] = []
    nodes.forEach((child) => {
      switch (child.opts.type) {
        case 'CollectionView':
          {
            // TODO: parse CollectionView
            // thunks.push(() => parseCollection(child.source, [...path, pid]))
          }
          break
        case 'Page':
          {
            thunks.push(() => parsePage(child.opts.id))
          }
          break
      }
    })
    await Promise.all(thunks.map(fn => fn()))
  } catch (err) {
    console.log('parsePage error')
    console.error(err)
  }
}

export const makeWorld = async () => {
  try {
    const { recordMap: userContent } = await loadUserContent()
    if (userContent.space) {
      await Promise.all(
        Object.values(userContent.space).map(async (item: any) => {
          // const spaceNode = GNode.from(item.value)
          const pids = [...item.value.pages]
          await Promise.all(pids.map((pid) => parsePage(pid)))
        })
      )
    }
  } catch (err) {
    console.log('makeWorld error')
    console.error(err)
  }
}
if (__DEV__) {
  setInterval(() => {
    console.log(
      'runWithLimit.activeCount, runWithLimit.pendingCount',
      runWithLimit.activeCount,
      runWithLimit.pendingCount
    )
  }, 1000)
}
