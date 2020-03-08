import axios, { AxiosResponse } from 'axios'
import { config } from 'dotenv'

config()

const API_URL: string = 'https://api.line.me/v2/bot/message/broadcast'
const ACCESS_TOKEN: string = process.env.LINE_ACCESS_TOKEN

export async function sendMessageToLine(
  message: string
): Promise<AxiosResponse> {
  try {
    const res = await axios.post(
      API_URL,
      { messages: [{ type: 'text', text: message }] },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      }
    )
    return res
  } catch (err) {
    return err
  }
}
