import Anthropic from '@anthropic-ai/sdk';
import {DataAPIClient} from "@datastax/astra-db-ts"
import { VoyageAIClient } from "voyageai";


const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    ANTHROPIC_API_KEY,
    VOYAGE_API_KEY
 } = process.env

 const anthropic = new Anthropic(
    {
        apiKey: ANTHROPIC_API_KEY
    }
 );

 if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_APPLICATION_TOKEN || !ASTRA_DB_NAMESPACE || !ASTRA_DB_COLLECTION) {
    throw new Error('Missing required Astra DB environment variables');
}

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
 
const voyageClient = new VoyageAIClient({
    apiKey: VOYAGE_API_KEY
})

const db = client.db(ASTRA_DB_API_ENDPOINT, {
    namespace: ASTRA_DB_NAMESPACE
})

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()
        const latestMessage = messages[messages.length - 1]?.content

        let docContext = ""

        const embeddingResponse = await voyageClient.embed({
            model: "voyage-3",
            input: latestMessage,
        })

        if (!embeddingResponse.data) {
            throw new Error('No embedding data received');
        }

        if (!embeddingResponse.data[0].embedding) {
            throw new Error('No embedding received');
        }

        const vector = embeddingResponse.data[0].embedding

        if (!ASTRA_DB_COLLECTION) {
            throw new Error('Missing required Astra DB environment variables');
        }

        try {
            const collection = await db.collection(ASTRA_DB_COLLECTION)

            const cursor = collection.find(
                {}, {
                    sort: {
                        $vector: vector
                    },
                    limit: 10
            })

            const documents = await cursor.toArray()

            const docMap = documents?.map(doc => doc.text)

            docContext = JSON.stringify(docMap)

        } catch (err) {
            console.log(err)
            console.log("Error querying db....")
            docContext = ""
        }

        const template = {
            content: `You are an AI Assistant that knows everything
            about Formula One. Use the below context to augment everything you know 
            about Formula One racing. The context will provide the most 
            recent data from Wikipedia, the offical F1 website, and others.
            If the context doesn't know the information you need to answer based 
            on existing knowledge and don't mention the source of information.
        --------------
        START CONTEXT
        ${docContext}
        END CONTEXT
        --------------
        QUESTION: ${latestMessage}
        --------------`
        }

        const response = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            messages: [{
                "role": "user",
                "content": template.content
            }],
            max_tokens: 1024,
            stream: true
        })
        console.log(response)

        return response.toReadableStream()
    } catch (err) {
        console.log(err)
        throw err
    }
}