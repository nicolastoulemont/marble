import { isIntConstant, isStringConstant } from './constants'
import { isIntVariable, isStringVariable } from './variables'

export enum IntOnlyBinaryOperator {
  GreaterOrEqual = '>=',
}

export enum StringOnlyBinaryOperator {
  IsCloseMatch = 'is_close_match',
}

export enum FlexibleBinaryOperators {
  Equal = '=',
  Different = '!=',
}

export type Operator = `${FlexibleBinaryOperators}` | `${StringOnlyBinaryOperator}` | `${IntOnlyBinaryOperator}`

export const operators = [
  ...Object.values(IntOnlyBinaryOperator),
  ...Object.values(StringOnlyBinaryOperator),
  ...Object.values(FlexibleBinaryOperators),
]

export function isOperator(input: string | undefined) {
  return Boolean(operators.find((value) => value === input))
}

type Input = string | undefined
enum Type {
  IntVariable = 'integer variable',
  StringVariable = 'string variable',
  IntConstant = 'integer constant',
  StringConstant = 'string constant',
}

export const singleSideOperatorsValidationFns = {
  [IntOnlyBinaryOperator.GreaterOrEqual]: {
    leftValidation: (left: Input) => ({
      ok: isIntVariable(left),
      type: isIntVariable(left) ? Type.IntVariable : isStringVariable(left) ? Type.StringVariable : null,
    }),
    rightValidation: (right: Input) => ({
      ok: isIntConstant(right) || isIntVariable(right),
      type: isIntConstant(right)
        ? Type.IntConstant
        : isStringConstant(right)
        ? Type.StringConstant
        : isIntVariable(right)
        ? Type.IntVariable
        : null,
    }),
  },
  [StringOnlyBinaryOperator.IsCloseMatch]: {
    leftValidation: (left: Input) => ({
      ok: isStringVariable(left),
      type: isStringVariable(left) ? Type.StringVariable : isIntVariable(left) ? Type.IntVariable : null,
    }),
    rightValidation: (right: Input) => ({
      ok: isStringConstant(right),
      type: isStringConstant(right) ? Type.StringVariable : isIntConstant(right) ? Type.IntConstant : null,
    }),
  },
} as const

export const bothSizesOperatorsValidationFns = {
  [FlexibleBinaryOperators.Equal]: {
    bothValidation: (left: Input, right: Input) => ({
      ok:
        (isStringVariable(left) && isStringConstant(right)) ||
        (isIntVariable(left) && isIntConstant(right)) ||
        (isIntVariable(left) && isIntVariable(right)),
      type: {
        left: isStringVariable(left) ? Type.StringVariable : isIntVariable(left) ? Type.IntVariable : null,
        right: isStringConstant(right)
          ? Type.StringConstant
          : isIntConstant(right)
          ? Type.IntConstant
          : isIntVariable(right)
          ? Type.IntVariable
          : null,
      },
    }),
  },
  [FlexibleBinaryOperators.Different]: {
    bothValidation: (left: Input, right: Input) => ({
      ok:
        (isStringVariable(left) && isStringConstant(right)) ||
        (isIntVariable(left) && isIntConstant(right)) ||
        (isIntVariable(left) && isIntVariable(right)),
      type: {
        left: isStringVariable(left) ? Type.StringVariable : isIntVariable(left) ? Type.IntVariable : null,
        right: isStringConstant(right)
          ? Type.StringConstant
          : isIntConstant(right)
          ? Type.IntConstant
          : isIntVariable(right)
          ? Type.IntVariable
          : null,
      },
    }),
  },
}
