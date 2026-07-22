import ollama

class Summarizer:
    def __init__(self, model: str = "llama3.1"):
        self.model = model

    def summarize(self, transcript: str, style: str = "detailed") -> str:
        """
        style options: detailed, bullet, action_items, meeting
        """
        if not transcript or len(transcript.strip()) < 20:
            return "Transcript is too short to summarize."

        prompts = {
            "detailed": f"""You are an expert note-taker. Create a clear, well-structured summary of the following transcript.

Include:
- Main topic / context
- Key points discussed
- Important decisions (if any)
- Overall conclusion

Transcript:
{transcript}

Summary:""",

            "bullet": f"""Summarize the following transcript into clean bullet points.
Focus only on the most important information. Be concise.

Transcript:
{transcript}

Bullet Point Summary:""",

            "action_items": f"""Extract all action items, tasks, and next steps from this transcript.
Format them as a clear checklist. If none exist, say "No clear action items found."

Transcript:
{transcript}

Action Items:""",

            "meeting": f"""You are a professional meeting assistant. Create structured meeting notes from this transcript.

Use this exact format:

**Meeting Summary**
- ...

**Key Discussion Points**
- ...

**Decisions Made**
- ...

**Action Items**
- [ ] ...

**Open Questions**
- ...

Transcript:
{transcript}

Meeting Notes:"""
        }

        prompt = prompts.get(style, prompts["detailed"])

        try:
            response = ollama.chat(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                options={"temperature": 0.3}
            )
            return response["message"]["content"].strip()
        except Exception as e:
            return f"Error generating summary: {str(e)}\n\nMake sure Ollama is running and the model '{self.model}' is pulled."