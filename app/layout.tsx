import "./global.css"
import React from 'react'

export const metadata = {
    title: "F1GPT",
    description: "The website to go for all your Formula One Questions!"
}

const RootLayout = ({
    children
}) => {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

export default RootLayout