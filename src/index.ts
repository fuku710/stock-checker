import { CronJob } from 'cron'
import { getLogger, configure } from 'log4js'
import { checkStock, StockResult } from './check-stock'
import { sendMessageToLine } from './notification'
import { SiteConfig } from './config'
import siteConfigJSON from './site-config.json'

const siteConfigList: SiteConfig[] = siteConfigJSON
const logger = getLogger()
const job: CronJob = new CronJob('0 0 * * * *', main)

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

async function main() {
  siteConfigList.forEach(async siteConfig => {
    try {
      const result: StockResult = await checkStock(siteConfig)
      if (result.hasStock) {
        const message = `在庫が存在する可能性があります[${result.config.name}]:${result.config.url}`
        await sendMessageToLine(message)
      }
      logger.info(JSON.stringify(result))
    } catch (err) {
      logger.error(err)
    }
  })
}

job.start()
