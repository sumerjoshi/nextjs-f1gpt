"use client"
import Image from "next/image"
import f1GPTLogo from "./assets/F1-logo.png"
import { useChat } from "ai/react"
import { Message } from "ai"
import Bubble from "./components/bubble"
import LoadingBubble from "./components/loadingBubble"
import PromptSuggestionRow from "./components/promptSuggestionsRow"

const Home = () => {

    const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat()

    const noMessages = !messages || messages.length == 0

    const handlePrompt = (promptText: string) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user"

        }
        append(msg)
    }
    return (
        <main>
            <Image src={f1GPTLogo} width="150" alt="f1GPTLogo"/>
            <section className={noMessages ? "" : "populated"}/>
            <section>
                {noMessages ? (
                    <>
                        <p className="starter-text">
                            The Ultimate place for Formula F1 superfans! 
                            Ask F1GPT anything about the fantastic topic of F1 racing.
                            It will come back with the most up to date answers.
                            We hope you enjoy!
                        </p>
                        <br/>
                        <PromptSuggestionRow onPromptClick={handlePrompt}/>
                    </>

                ) : (
                    <>
                        {messages.map((message, index) => <Bubble key={`message-${index}`} message={message}/>)}
                        {isLoading && <LoadingBubble/>}
                    </>
                )}
            </section>
            <form onSubmitCapture={handleSubmit}>
                    <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask Me Here"/>
                    <input type="submit"/>
            </form>
        </main>
    )
}

export default Home