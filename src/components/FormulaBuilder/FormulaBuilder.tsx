import { useMemo, useRef, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { variables } from './variables'
import { operators } from './binaryOperators'
import { Input } from '../ui/input'
import { useClickAway } from 'react-use'
import { validateFormula } from './validateFormula'
import { FieldNames, FormulaValues } from './utils'

export function FormulaBuilder() {
  const [values, setValues] = useState<FormulaValues>({
    variable: undefined,
    operator: undefined,
    variableOrConstant: '',
  })
  const [showInputSuggestions, setShowInputSuggestions] = useState(false)
  const inputContainerRef = useRef<HTMLInputElement>(null)
  useClickAway(inputContainerRef, () => {
    setShowInputSuggestions(false)
  })

  const suggestions = useMemo(
    () =>
      variables.filter((variable) =>
        values.variableOrConstant ? variable.includes(values.variableOrConstant) : variables
      ),
    [values.variableOrConstant]
  )

  const validationErrors = useMemo(() => {
    const NUMBER_OF_FIELDS = 3
    const errors = validateFormula(values)
    // Ensure we don't show as many errors as we show fields (the user might not have started yet)
    if (errors && Object.keys(errors).length > 0 && Object.keys(errors).length !== NUMBER_OF_FIELDS) {
      return errors
    }
  }, [values])

  console.log({ values })
  console.log({ validationErrors })

  function handleVariableChange(value: string) {
    setValues((prevValues) => ({
      ...prevValues,
      variable: value as FormulaValues['variable'],
    }))
  }

  function handleOperatorChange(value: string) {
    setValues((prevValues) => ({
      ...prevValues,
      operator: value as FormulaValues['operator'],
    }))
  }

  function handleVariableOrConstantChange(value: string) {
    setValues((prevValues) => ({
      ...prevValues,
      variableOrConstant: value,
    }))
  }

  return (
    <div className='bg-white px-3 pt-3 pb-6 flex flex-col gap-2'>
      <div className='flex items-start justify-start rounded-md gap-3'>
        <span className='text-gray-400 text-sm mt-2'>If</span>
        <div className='w-[250px] flex flex-col gap-2'>
          <Select name={FieldNames.Variable} value={values.variable} onValueChange={handleVariableChange}>
            <SelectTrigger className='w-[250px]'>
              <SelectValue placeholder='Select a variable' />
            </SelectTrigger>
            <SelectContent>
              {variables.map((variable) => (
                <SelectItem key={variable} value={variable}>
                  {variable}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors && validationErrors['variable'] && (
            <p className='text-sm text-red-500'>{validationErrors['variable']}</p>
          )}
        </div>

        <div className='w-[250px] flex flex-col gap-2'>
          <Select name={FieldNames.Operator} value={values.operator} onValueChange={handleOperatorChange}>
            <SelectTrigger className='w-[250px]'>
              <SelectValue placeholder='Select an operator' />
            </SelectTrigger>
            <SelectContent>
              {operators.map((operator) => (
                <SelectItem key={operator} value={operator}>
                  {operator}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors && validationErrors['operator'] && (
            <p className='text-sm text-red-500'>{validationErrors['operator']}</p>
          )}
        </div>

        <div ref={inputContainerRef} className='relative w-[350px] flex flex-col gap-2'>
          <Input
            className='w-full'
            name={FieldNames.VariableOrConstant}
            placeholder='Variable or constants'
            value={values.variableOrConstant}
            onFocus={() => setShowInputSuggestions(true)}
            onChange={(e) => handleVariableOrConstantChange(e.target.value)}
          />
          {showInputSuggestions && (
            <div className='absolute top-[50px] w-[450px] z-10 bg-white rounded-md shadow-md flex flex-col gap-2'>
              {suggestions.map((variable) => (
                <button
                  key={variable}
                  className='text-sm w-full text-left px-3 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                  onClick={() => {
                    handleVariableOrConstantChange(variable)
                    setShowInputSuggestions(false)
                  }}
                >
                  {variable}
                </button>
              ))}
            </div>
          )}
          {validationErrors && validationErrors['variableOrConstant'] && (
            <p className='text-sm text-red-500'>{validationErrors['variableOrConstant']}</p>
          )}
        </div>
      </div>
      {validationErrors && validationErrors['form'] && (
        <p className='text-sm text-red-500'>{validationErrors['form']}</p>
      )}
    </div>
  )
}
