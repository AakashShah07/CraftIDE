import Image from "next/image";
import { useState, useEffect } from "react";


const ShrimmerMesage =() =>{
    const messages = [
        "Thinking...",
        "Generating response...",
        "Analyzing data...",
        "Processing request...",
        "Working on it...",
        "Crafting components...",
        "Building UI...",
        "Rendering view...",
        "Optimizing layout...",
        "Finalizing design...",
        "Loading content...",
        "Fetching information...",
        "Compiling results...",
        "Calculating answer...",
        "Preparing response...",
        "Almost done...",
    ]

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);{

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev +1) % messages.length);
        },2000);

        return () => clearInterval(interval);
    },[messages.length]);

    return (
        <div className="flex items-center gap-2">
            <span className="text-base text-muted-foreground animate-pulse">
                {messages[currentMessageIndex]}
            </span>
        </div>
    )
}
}
const MessageLoading = () => {
  return (
    <div className="flex -flex-col group px-2 pb-4">
        <div className="flex items-center gap-2 pl-2 mb-2">
            <Image
            src="/logo.svg"
            alt="CraftIDE"
            width={18}
            height={18}
            className="shrink-0"
            />
            <span className="text-sm font-medium"> CraftIDE</span>
 </div>
            <div className="pl-8.5 flex flex-col gap-y-4"> 
                <ShrimmerMesage/>
            </div>

       
      
    </div>
  )
}

export default MessageLoading


