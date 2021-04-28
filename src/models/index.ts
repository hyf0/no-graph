import { getBlockType } from '@/utils'

// const ignoreGNodeTypes = [
//   'TableOfContents',
//   'Text',
//   'Quote',
//   'Embed',
//   'Image',
//   'Code',
//   'Divider',
//   'Callout',
//   'Calendar',
//   // special
//   // 'Unkown',
//   // TODO: support
//   'NumberedList',
//   'BulletedList',
//   'Table',
//   'ColumnList',
//   'Column',
//   'Board',
//   'List',
// ] as const
// export type IgnoreGNodeType = typeof ignoreGNodeTypes[number]
// export const ignoreGNodeTypeSet = new Set(ignoreGNodeTypes)


export const gNodeTypes = [
  'Unkown',
  'Space',
  'Page',
] as const
export type GNodeType = typeof gNodeTypes[number]
export const GNodeTypeSet = new Set(gNodeTypes)

export class GNode {
  static nodes: { [id: string]: GNode } = {}
  static types = gNodeTypes
  get type(): GNodeType {
    switch (this.opts.type) {
      case 'Space':
        return 'Space'
      case 'CollectionViewPage':
      case 'Page':
        return 'Page'
      default:
        return 'Unkown'
    }
  }
  get size() {
    switch (this.type) {
      case 'Space':
        return 80
      case 'Page':
        return 30
      case 'Unkown':
      default:
        return 10
    }
  }

  get name() {
    switch (this.opts.type) {
      case 'Space':
        return this.source.name
      case 'Bookmark': {
        return (
          this.source.properties.title ?? this.source.properties.link
        ).join(' ')
      };
      case 'File': {
        return this.source.properties?.title.join(' ') ?? 'Unkown File'
      }
      case 'Header':
      case 'SubHeader':
      case 'SubSubHeader':
      case 'ToDo':
      case 'Page':
        return this.source.properties?.title.join(' ') ?? 'Unkown Title'
      case 'CollectionViewPage': {
        const c = GNode.nodes[this.source.collection_id]
        return c?.source.name?.join(' ') ?? 'Unkown CollectionView'
      }
      case 'Unkown': return 'Unkown'
      default: {
        let check = this.opts.type
        return this.opts.type ?? 'Unkown Block'
      }
    }
  }

  constructor(
    public opts: {
      type: string
      id: string
    },
    public source: any
  ) {}

  static from(value: any) {
    const type = getBlockType(value)
    const n = new GNode(
      {
        type,
        id: value.id,
      },
      value
    )
    GNode.nodes[n.opts.id] = n
    return n
  }
}

export class GEdge {
  constructor(
    public opts: {
      from: string
      to: string
    }
  ) {}

  static of(from: string, to: string) {
    const e = new GEdge({ from, to })
    return e
  }
}
