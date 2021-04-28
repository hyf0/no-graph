import { camelCase, upperFirst } from "lodash-es"

export const getBlockType = (recordValue: any): string => {
  const v = recordValue
  if (typeof v.type !== 'undefined') {
    return ([v.type] as const).map(camelCase).map(upperFirst)[0] as string
  }
  if (typeof v.pages !== 'undefined') {
    return 'Space'
  }
  return 'Unkown'
}
