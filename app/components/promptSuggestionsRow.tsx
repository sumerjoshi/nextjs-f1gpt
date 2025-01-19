import PromptSuggestionButton from "./promptSuggestionButton"

const PromptSuggestionRow = ({ onPromptClick }: { onPromptClick: (prompt: string) => void }) => {
    const prompts = [
        "Who is the head of racing for Aston Martin's F1 Academy team?",
        "who is the highest paid F1 driver?",
        "Who will be the newest driver for Ferrari?",
        "Who is the current Formula one World Driver's Champion",
    ]
    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) => 
                <PromptSuggestionButton 
                    key={`suggestion-${index}`}
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}
                />)}
        </div>
    )
}

export default PromptSuggestionRow