import axios from 'axios'
import { checkStock, StockResult } from '../src/check-stock'
import { SiteConfig } from '../src/config'
import { JSDOM } from 'jsdom'

jest.mock('axios')

const axiosMock = axios as jest.Mocked<typeof axios>

test('Out of stock', async () => {
  const res = { data: '<div>Out of stock</div>' }
  const siteConfig: SiteConfig = {
    name: 'test',
    url: 'http://example.com',
    encoding: 'utf-8',
    selector: 'div',
    noStockWord: 'Out of stock',
  }
  axiosMock.get.mockResolvedValue(res)
  const stockResult = await checkStock(siteConfig)
  expect(stockResult.hasStock).toBeFalsy()
})

test('In stock', async () => {
  const res = { data: '<div>In Stock</div>' }
  const siteConfig: SiteConfig = {
    name: 'test',
    url: 'http://example.com',
    encoding: 'utf-8',
    selector: 'div',
    noStockWord: 'Out of stock',
  }
  axiosMock.get.mockResolvedValue(res)
  const stockResult = await checkStock(siteConfig)
  expect(stockResult.hasStock).toBeTruthy()
})
