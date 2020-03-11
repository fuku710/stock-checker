import { getLogger, configure } from 'log4js'

configure({
  appenders: {
    result: { type: 'file', filename: './logs/result.log' },
    error: { type: 'file', filename: './logs/error.log' }
  },
  categories: {
    default: { appenders: ['result'], level: 'info' },
    error: { appenders: ['error'], level: 'error' }
  }
})

export const logger = getLogger()
