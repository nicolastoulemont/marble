export enum ConstantTypes {
  Int = 'int',
  String = 'string',
}

export const isStringConstant = (input: string | undefined) => input && input.startsWith(`"`) && input.endsWith(`"`)
export const isIntConstant = (input: string | undefined) => input && !Number.isNaN(parseInt(input))

export function isConstantType(input: string | undefined) {
  return isStringConstant(input) || isIntConstant(input)
}
