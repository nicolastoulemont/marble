import { Operator } from './binaryOperators'
import { Variable } from './variables'

export enum FieldNames {
  Variable = 'variable',
  Operator = 'operator',
  VariableOrConstant = 'variableOrConstant',
}

export type FormulaValues = {
  variable: Variable | undefined
  operator: Operator | undefined
  variableOrConstant: string | undefined
}
