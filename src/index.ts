import { CronJob } from 'cron'
import { getLogger, configure } from 'log4js'
import { checkStock, StockResult } from './check-stock'
import { sendMessageToLine } from './notification'
import { SiteConfig } from './config'
import siteConfigJSON from './site-config.json'

const siteConfigList: SiteConfig[] = siteConfigJSON
const logger = getLogger()
configure({
  appenders: {
    result: { type: 'file', filename: 'result.log' }
  },
  categories: {
    default: { appenders: ['result'], level: 'info' }
  }
})

async function main() {
  const job: CronJob = new CronJob('* 0 * * * *', () => {
    siteConfigList.forEach(async siteConfig => {
      const result: StockResult = await checkStock(siteConfig)
      if (result.hasStock) {
        const message = `在庫が存在する可能性があります[${result.config.name}]:${result.config.url}`
        await sendMessageToLine(message)
      }
      logger.info(JSON.stringify(result))
    })
  })
  job.start()
}

main()
