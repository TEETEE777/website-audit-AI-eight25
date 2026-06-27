import json
import google.generativeai as genai
from app.scoring import calculate_score
from app.config import GEMINI_API_KEY

from app.prompts import (
    SYSTEM_PROMPT,
    build_audit_prompt
)


genai.configure(
    api_key=GEMINI_API_KEY
)


model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def generate_ai_analysis(metrics, content):

    content = content[:12000]
    score = calculate_score(metrics)
    user_prompt = build_audit_prompt(
        metrics,
        content
    )

    response = model.generate_content(
        f"""
{SYSTEM_PROMPT}

{user_prompt}
""",
    generation_config={
        "temperature": 0.2
    }
    )
    print(response.text)
    raw_output = response.text

    clean_output = (
        raw_output
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    try:
        analysis = json.loads(clean_output)
        print("ANALYSIS")
        print(json.dumps(analysis, indent=2))
        for rec in analysis.get("recommendations", []):
            rec.setdefault("priority", "Medium")
            rec.setdefault("recommendation", "")
            rec.setdefault("reasoning", "")
            rec.setdefault("affected_metric", "Overall")
    except Exception:
        analysis = {
            "error": "Invalid JSON from model",
            "raw": raw_output
        }


    return {
    "score": score,

    "prompt_logs": {
        "system_prompt": SYSTEM_PROMPT,

        "user_prompt": user_prompt,

        "structured_input": {
            "metrics": metrics,
            "content": content
        },

        "raw_model_output": raw_output
    },

    "analysis": analysis
}