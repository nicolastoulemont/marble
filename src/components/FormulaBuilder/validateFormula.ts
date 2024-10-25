import {
  bothSizesOperatorsValidationFns,
  FlexibleBinaryOperators,
  IntOnlyBinaryOperator,
  isOperator,
  singleSideOperatorsValidationFns,
  StringOnlyBinaryOperator,
} from './binaryOperators'
import { isConstantType } from './constants'
import { FieldNames, FormulaValues } from './utils'
import { isVariable } from './variables'

type ValidationErrors = Record<string, string>

const validateFieldsFilledStatus = (input: FormulaValues) => {
  const validationErrors: ValidationErrors = {}
  for (const [key, value] of Object.entries(input)) {
    if (!value || value.trim().length === 0) {
      validationErrors[key] = 'Missing field'
    }
  }

  return validationErrors
}

const validateFieldsIndividualType = (input: FormulaValues) => {
  const validationErrors: ValidationErrors = {}
  for (const [key, value] of Object.entries(input)) {
    switch (key) {
      case FieldNames.Variable:
        if (!isVariable(value)) {
          validationErrors[key] = `Invalid field type for field:${key} - value:${value}`
        }
        break
      case FieldNames.Operator:
        if (!isOperator(value)) {
          validationErrors[key] = `Invalid field type for field:${key} - value:${value}`
        }
        break
      case FieldNames.VariableOrConstant:
        if (!isConstantType(value) && !isVariable(value)) {
          validationErrors[key] = `Invalid field type for field:${key} - value:${value}`
        }
        break
      default:
        throw new Error(`Unsupported field key:${key} - value:${value}`)
    }
  }

  return validationErrors
}

const validateBinaryOperatorLeftFieldType = ({ variable, operator }: FormulaValues) => {
  if (!operator) {
    throw new Error('Missing operator')
  }

  if (operator === FlexibleBinaryOperators.Different || operator === FlexibleBinaryOperators.Equal) {
    return
  }

  const { leftValidation } = singleSideOperatorsValidationFns[operator]
  const { ok, type } = leftValidation(variable)
  if (!ok) {
    return {
      form: `Invalid type for operator: ${operator} can’t be applied to value ${variable} of type ${type} on the left side`,
    } as ValidationErrors
  }
}

const validateBinaryOperatorRightFieldType = ({ operator, variableOrConstant }: FormulaValues) => {
  if (!operator) {
    throw new Error('Missing operator')
  }

  if (operator === FlexibleBinaryOperators.Different || operator === FlexibleBinaryOperators.Equal) {
    return
  }

  const { rightValidation } = singleSideOperatorsValidationFns[operator]
  const { ok, type } = rightValidation(variableOrConstant)
  if (!ok) {
    return {
      form: `Invalid type for operator: ${operator} can’t be applied to value ${variableOrConstant} of type ${type} on the right side`,
    } as ValidationErrors
  }
}

const validateBinaryOperatorBothFieldType = ({ variable, operator, variableOrConstant }: FormulaValues) => {
  if (!operator) {
    throw new Error('Missing operator')
  }

  if (operator === IntOnlyBinaryOperator.GreaterOrEqual || operator === StringOnlyBinaryOperator.IsCloseMatch) {
    return
  }

  const { bothValidation } = bothSizesOperatorsValidationFns[operator]
  const result = bothValidation(variable, variableOrConstant)

  if (!result.ok) {
    return {
      form: `Incompatible types for operator: ${operator} can’t be
applied to a value ${variable} of type ${result.type.left} on the left side and a value ${variableOrConstant} of type ${result.type.right} on the right side`,
    } as ValidationErrors
  }
}

// Validation Fns ordered by priority
const validationFns = [
  validateFieldsFilledStatus,
  validateFieldsIndividualType,
  validateBinaryOperatorLeftFieldType,
  validateBinaryOperatorRightFieldType,
  validateBinaryOperatorBothFieldType,
]

export function validateFormula(input: FormulaValues) {
  for (const validationFn of validationFns) {
    const errors = validationFn(input)
    if (errors && Object.keys(errors).length > 0) {
      return errors
    }
  }
}
