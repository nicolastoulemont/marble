export enum IntVariables {
  Amount = 'transaction.amount',
  Balance = 'transaction.account.balance',
  MaxAmountAuthorized = 'transaction.account.max_transaction_amount_authorized',
}

export enum StringVariables {
  SenderLastName = 'transaction.sender.last_name',
  ReceiverLastName = 'transaction.receiver.last_name',
  OwnerLastName = 'transaction.account.owner.last_name',
}

export type Variable = `${IntVariables}` | `${StringVariables}`

export const variables = [...Object.values(IntVariables), ...Object.values(StringVariables)]

export function isIntVariable(input: string | undefined) {
  return Boolean(Object.values(IntVariables).find((value) => value === input))
}

export function isStringVariable(input: string | undefined) {
  return Boolean(Object.values(StringVariables).find((value) => value === input))
}

export function isVariable(input: string | undefined) {
  return Boolean(variables.find((value) => value === input))
}
