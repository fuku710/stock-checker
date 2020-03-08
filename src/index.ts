import { CronJob } from 'cron'
import { checkStock, StockResult } from './check-stock'
import { sendMessageToLine } from './notification'
import { SiteConfig } from './config'
import siteConfigJSON from './site-config.json'

function runCheckingAllStock() {
  const siteConfigList: SiteConfig[] = siteConfigJSON

  siteConfigList.forEach(async siteConfig => {
    const result: StockResult = await checkStock(siteConfig)
    if (result.hasStock) {
      const message = `在庫が存在する可能性があります[${result.config.name}]:${result.config.url}`
      await sendMessageToLine(message)
    }
    console.log(result)
  })
}

async function main() {
  const job: CronJob = new CronJob('* 0 * * * *', runCheckingAllStock)
  job.start()
}

main()
