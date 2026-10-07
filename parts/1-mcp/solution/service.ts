import cds from '@sap/cds'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import registerOrderActions from '../order-operations'

export default class OrdersAssistantService extends cds.ApplicationService {
  init() {
    registerOrderActions(this)
    this.on('buildModel', () => new ChatGoogleGenerativeAI({
      model: cds.env.requires.llm.model,
      maxRetries: 0,
      apiKey: process.env.GEMINI_API_KEY
    }))
    return super.init()
  }
}