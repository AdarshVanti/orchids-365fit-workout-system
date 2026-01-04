import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // DuckDuckGo Instant Answer API
    // format=json: returns structured data
    // no_html=1: strip HTML from results
    // skip_disambig=1: don't return disambiguation results
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(message)}&format=json&no_html=1&skip_disambig=1`,
      {
        headers: {
          "User-Agent": "365Fit-Chatbot/1.0",
        },
      }
    );
    
    if (!response.ok) {
      throw new Error("DuckDuckGo API responded with error");
    }

    const data = await response.json();

    let answer = "";

    // Priority 1: Abstract Text (Direct summary)
    if (data.AbstractText) {
      answer = data.AbstractText;
    } 
    // Priority 2: Answer (Short factual answer)
    else if (data.Answer) {
      answer = data.Answer;
    }
    // Priority 3: Related Topics (Snippet from a related topic)
    else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      const firstTopic = data.RelatedTopics.find((t: any) => t.Text);
      if (firstTopic) {
        answer = firstTopic.Text;
      }
    }

    // If still no answer, fallback to a generic message
    if (!answer) {
      answer = "I couldn't find a precise summary for that. Try asking something about exercises, nutrition facts, or health tips!";
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { answer: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later!" },
      { status: 200 } // Return 200 so the UI can show the error gracefully
    );
  }
}
