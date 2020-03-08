import { SiteConfig } from './config'
import siteConfigJSON from './site-config.json'
import { checkStock, StockResult } from './check-stock'

const siteConfigList: SiteConfig[] = siteConfigJSON

async function main() {
  siteConfigList.forEach(async siteConfig => {
    const result: StockResult = await checkStock(siteConfig)
    console.log(result)
  })
}

main()
