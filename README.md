# Website Audit AI

An AI-powered website auditing tool that analyzes a webpage, extracts factual website metrics, and generates structured SEO, UX, accessibility insights and recommendations.

This project was built as part of the **AI-Native Software Engineer Assignment**.

---

# Overview

Website Audit AI helps evaluate a website page by combining:

- Traditional webpage analysis
- Structured metric extraction
- AI-powered interpretation

The system accepts a single URL, analyzes the webpage, extracts measurable data, and sends the collected information to an AI model to generate actionable recommendations.

The focus is not just using AI, but designing an AI workflow where insights are grounded in extracted website facts.

---

# Features

## Website Metric Extraction

The scraper extracts:

- Total word count
- Heading counts:
  - H1
  - H2
  - H3
- CTA count
- Internal links
- External links
- Image count
- Missing image alt text percentage
- Meta title
- Meta description

These metrics are displayed separately from AI-generated content to maintain transparency.

---

## AI Generated Insights

The AI analyzes the extracted metrics and page content to generate:

### SEO Structure

Evaluates:

- Heading hierarchy
- Metadata quality
- Page structure

### Messaging Clarity

Evaluates:

- Content clarity
- Page messaging
- Information structure

### CTA Usage

Evaluates:

- CTA presence
- CTA quantity
- Conversion opportunities

### Content Depth

Evaluates:

- Content amount
- Content usefulness
- Topic coverage

### UX Concerns

Evaluates:

- Accessibility issues
- Structural concerns
- Usability problems

---

## Recommendations

The system generates prioritized recommendations containing:

- Priority level
- Recommendation
- Reasoning
- Related metric

Example:

```
Priority:
High

Recommendation:
Add missing image alt attributes

Reason:
72% of images are missing alt text, creating an accessibility issue.

Affected Metric:
Accessibility
```

---

# Architecture Overview


```
                 User
                  |
                  |
                  v

          React Frontend
          (TypeScript + Tailwind)

                  |
                  |
                  v

          FastAPI Backend

                  |
        -----------------------
        |                     |
        v                     v

 Website Scraper          AI Analysis Layer

 BeautifulSoup            Gemini 2.5 Flash

        |                     |
        |                     |
        v                     v

 Extracted Metrics      Structured Insights

        |
        |
        v

 SQLite Database
```

---

# System Flow

1. User enters a website URL

2. Backend validates the URL

3. Website content is fetched

4. HTML content is analyzed

5. Metrics are extracted

6. A structured AI prompt is created

7. Gemini receives:
   - extracted metrics
   - webpage content
   - analysis instructions

8. AI returns structured JSON output

9. Results are stored and displayed

---

# AI Design Decisions

## Grounded AI Approach

The AI model does not independently guess website problems.

Instead, it receives:

- Extracted website metrics
- Relevant page content
- Clear analysis instructions


This reduces hallucination and ensures recommendations are connected to actual website data.

---

## Structured Prompt Design

The system prompt instructs the model to:

- Only use provided information
- Avoid inventing facts
- Reference extracted metrics
- Generate actionable recommendations
- Return valid JSON

Example:

```
Only use provided data.
Do not invent facts.
Every insight must reference extracted metrics.
```

---

## Structured Output

The AI response follows a predefined schema:

```json
{
  "insights": {
    "seo_structure": "",
    "messaging_clarity": "",
    "cta_usage": "",
    "content_depth": "",
    "ux_concerns": ""
  },
  "recommendations": [
    {
      "priority": "",
      "recommendation": "",
      "reasoning": "",
      "affected_metric": ""
    }
  ]
}
```

This allows the frontend to reliably display AI results.

---

# Prompt Logs

For transparency, the application stores:

- System prompt used
- Generated user prompt
- Structured input sent to AI
- Raw model response


This provides visibility into how the AI layer was designed and orchestrated.

---

# Technology Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- React Router

## Backend

- FastAPI
- Python
- BeautifulSoup
- Requests
- SQLAlchemy

## Database

- SQLite

## AI

- Google Gemini 2.5 Flash

---

# API

## Create Audit

```
POST /audit
```

Request:

```json
{
  "url": "https://example.com"
}
```

Response contains:

- Audit score
- Extracted metrics
- AI insights
- Recommendations
- Prompt logs

---

## Audit History

```
GET /audits
```

Returns previous website audits.

---

# Trade-offs

Due to the 24-hour assignment scope, the following trade-offs were made:

## Single Page Analysis Only

The system analyzes only one webpage.

A full crawler was intentionally avoided to keep the solution focused.

---

## No Browser Rendering

The scraper analyzes HTML responses.

JavaScript-heavy websites may not expose all dynamically generated content.

---

## SQLite Database

SQLite was selected for simplicity and fast setup.

A production version would use a managed database.

---

## Lightweight Scoring

The scoring system uses extracted metrics rather than complex SEO algorithms.

This keeps the logic transparent and easy to explain.

---

# What I Would Improve With More Time

## Advanced Crawling

Add:

- Multi-page crawling
- Sitemap support
- Website-wide analysis

---

## Better Accessibility Checks

Add:

- ARIA validation
- Keyboard navigation checks
- Color contrast analysis

---

## Performance Analysis

Integrate:

- Lighthouse metrics
- Core Web Vitals
- Page load analysis

---

## Better AI Evaluation

Add:

- Multiple AI agents
- Confidence scores
- Human feedback loop

---

## Production Improvements

Add:

- Authentication
- Background job processing
- Caching
- Rate limiting
- Monitoring

---

# Running Locally

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

Create:

```
.env
```

Add:

```
GEMINI_API_KEY=your_api_key
```

---

# Conclusion

Website Audit AI demonstrates an AI-native approach by combining deterministic webpage analysis with grounded AI reasoning.

The system separates factual extraction from AI interpretation, making the results transparent, structured, and useful for practical website evaluation.