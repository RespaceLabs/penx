import Joi from 'joi'

type Options = {
  message?: string
  type?: string
}

export default class IDBError extends Error {
  constructor([errorDetail]: Joi.ValidationErrorItem[], options?: Options) {
    super(options?.message || errorDetail.message)
    this.name = options?.type || 'IDBValidationError'
  }

  public static is(error: Error): error is IDBError {
    return error.name === 'IDBValidationError'
  }

  public static compose(message: string): Joi.ValidationErrorItem[] {
    return [
      {
        message: message,
        path: ['unknown'],
        type: 'string',
      },
    ]
  }
}
