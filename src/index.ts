import { CronJob, CronTime } from 'cron'
import { checkStock, StockResult } from './check-stock'
import { SiteConfig } from './config'
import siteConfigJSON from './site-config.json'

function runCheckingAllStock() {
  const siteConfigList: SiteConfig[] = siteConfigJSON

  siteConfigList.forEach(async siteConfig => {
    const result: StockResult = await checkStock(siteConfig)
    console.log(result)
  })
}

async function main() {
  const job: CronJob = new CronJob('* 0 * * * *', runCheckingAllStock)
  job.start()
}

main()
