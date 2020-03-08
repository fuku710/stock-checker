import { JSDOM } from 'jsdom'
import axios from 'axios'
import * as iconv from 'iconv-lite'
import { SiteConfig } from './config'

interface StockResult {
  hasStock: boolean
  status: string
  text: string
  config: SiteConfig
}

async function fetchHTML(url: string, encoding = 'utf-8'): Promise<JSDOM> {
  if (encoding !== 'utf-8') {
    const res = await axios.get(url, { responseType: 'arraybuffer' })
    const dom = new JSDOM(iconv.decode(res.data, 'Shift_JIS'))
    return dom
  } else {
    const res = await axios.get(url)
    const dom = new JSDOM(res.data)
    return dom
  }
}

function getResultStatus(element: Element, noStockWord: string): string {
  if (element === null) {
    return 'ELEMENT_IS_REMOVED'
  } else if (element.textContent.trim() !== noStockWord) {
    return 'TEXT_IS_CHANGED'
  } else {
    return 'NO_CHANGE'
  }
}

async function checkStock(config: SiteConfig): Promise<StockResult> {
  try {
    const { url, encoding, selector, noStockWord } = config

    const dom: JSDOM = await fetchHTML(url, encoding)
    const document: Document = dom.window.document
    const targetElement: Element = document.querySelector(selector)

    const status: string = getResultStatus(targetElement, noStockWord)
    const text: string =
      status === 'ELEMENT_IS_REMOVED' ? null : targetElement.textContent.trim()
    const hasStock: boolean = status !== 'NO_CHANGE'
    const result: StockResult = { status, text, hasStock, config }
    return result
  } catch (err) {
    return err
  }
}

export { StockResult, checkStock }
