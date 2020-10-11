import { CronJob } from 'cron'
import { checkStock, StockResult } from './check-stock'
import { logger } from './log'
import { sendMessageToLine } from './notification'
import { SiteConfig } from './config'
import siteConfigJSON from './site-config.json'

const siteConfigList: SiteConfig[] = siteConfigJSON
const job: CronJob = new CronJob('0 0 * * * *', main)

async function main() {
  siteConfigList.forEach(async (siteConfig) => {
    sleep(Math.random() * 3600)
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

async function sleep(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s))
}

job.start()
