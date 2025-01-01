"use client"
import Image from "next/image"
import f1GPTLogo from "./assets/F1-logo.png"
import { useChat } from "ai/react"
import { Message } from "ai"

const Home = () => {
    const noMessages = true
    return (
        <main>
            <Image src={f1GPTLogo} width="250" alt="f1GPTLogo"/>
            <section>
                {noMessages ? (
                    <>
                        <p className="starter-text">

                        </p>
                        <br/>
                    </>

                ) : (

                )}
            </section>
        </main>
    )
}

export default Home