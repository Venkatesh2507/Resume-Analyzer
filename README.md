# Resume Analyzer — n8n Workflow
## Overview
The Resume Analyzer uses an n8n automation workflow powered by Google Gemini AI to optimize resumes according to specific job descriptions. It analyzes the candidate's existing resume, incorporates relevant job-specific keywords, improves content clarity, and generates a professionally formatted PDF designed to be ATS-friendly and fit on a single A4 page.

## Workflow Architecture
The workflow consists of six main stages:
**Resume Upload → Document Analysis → AI-Powered Optimization → Structured Output → HTML Generation → PDF Conversion**
### 1. Resume Upload — Webhook
The workflow starts with an n8n Webhook node configured to accept `POST` requests through the `resume-upload` endpoint.
It receives the uploaded resume as a binary file and the target job description in the request body. This triggers the automated resume-processing pipeline.

### 2. Resume Parsing — Google Gemini
The **Analyze document1** node uses Google Gemini to analyze the uploaded resume document.
It extracts the available resume information into structured JSON, including:
- Personal details such as name, email, and phone number.
- Technical and professional skills.
- Work experience, roles, companies, and achievements.
- Educational qualifications.
- Projects and certifications.
This extracted content provides the input for the resume optimization stage.

### 3. AI-Powered Resume Optimization — AI Agent
The **AI Agent** uses a Google Gemini chat model to compare the extracted resume content against the job description supplied through the webhook.
It then rewrites and optimizes the resume according to the workflow's predefined instructions:
- **Keyword optimization:** Incorporates relevant skills and keywords from the job description naturally into existing resume content.
- **Content improvement:** Refines descriptions to improve clarity, professionalism, and relevance to the target role.
- **Truthfulness:** Prohibits inventing experience, qualifications, or other candidate information.
- **ATS-friendly formatting:** Uses standard resume sections and straightforward, readable content.
- **One-page constraint:** Prioritizes relevant information and compresses redundant content to target a single A4 page.
The agent organizes the optimized resume into sections: personal information, About Me, Education, Skills, Experience, Projects, and Achievements.

### 4. Structured Output Validation — Output Parser
The **Structured Output Parser** is connected to the AI Agent to enforce a predefined JSON structure for the generated resume content.
A Google Gemini chat model is connected to this parser to support automatic correction when the output does not match the expected structure.
This structured response allows the next stage to insert the optimized content into the HTML template.

### 5. Resume Layout Generation — HTML
The **HTML** node combines the optimized resume sections with an HTML template.
The template defines the layout and presentation of the resume, including:
- Candidate name and contact information.
- Standard section headings.
- Bold formatting for important labels and role titles.
- Consistent spacing, typography, and bullet points.
- A4 page dimensions and print-friendly styling.

The content is inserted dynamically from the AI Agent's output, producing an HTML representation of the optimized resume.

### 6. PDF Generation — HTML/CSS to PDF
The **Convert HTML to PDF** node converts the generated HTML into a PDF document using the configured HTML-to-PDF service.
It applies CSS styling for typography, margins, section spacing, and print layout. The node is configured with `output_file` as the output filename.
The resulting PDF is the final document produced by the workflow, ready for use as an optimized, job-specific resume.

## Technologies Used
- **n8n:** Workflow automation and orchestration.
- **Google Gemini:** Resume document extraction and AI-powered content optimization.
- **Structured Output Parser:** Enforces the expected JSON output format.
- **HTML & CSS:** Resume layout and formatting.
- **HTML/CSS to PDF service:** Converts the generated HTML into a PDF document.

## Key Features
- Automated resume processing through a webhook.
- Job-description-specific resume optimization.
- Relevant keyword integration for improved ATS compatibility.
- Structured extraction of resume information.
- Concise, professional resume content.
- Standardized resume sections and clean formatting.
- PDF generation with a single-page A4 layout target.
- Content optimization designed to preserve factual accuracy.

## Workflow Goal
The goal of this workflow is to reduce the manual effort involved in tailoring resumes for different job opportunities. By combining document extraction, AI-driven optimization, structured output, and automated PDF generation, Resume Analyzer provides a streamlined way to create resumes better aligned with specific job requirements.


<img width="1882" height="623" alt="Screenshot 2026-10-12 112319" src="https://github.com/user-attachments/assets/2381d672-e47e-44c7-bf64-e6be9344609c" />
