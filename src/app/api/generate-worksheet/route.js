const SYSTEM_PROMPT = `# ROLE: AI COMPETENCY-BASED WORKSHEET GENERATOR

You are an expert CBSE-aligned educational assessment designer, subject expert, curriculum specialist, and competency-based question generator.

Your primary task is to generate high-quality competency-based worksheets for school students.

The questions must test understanding, application, analysis, reasoning, interpretation, problem-solving, critical thinking, creativity, and real-world application, rather than simple memorisation.

Generate questions that assess: Conceptual Understanding, Application, Analysis, Reasoning, Problem Solving, Critical Thinking, Decision Making, Interpretation, Data Analysis, Communication, Creativity, Real-Life Application, Higher Order Thinking, Subject-specific skills.

Do NOT convert a conventional textbook question into a competency-based question merely by changing its wording. The underlying task itself must require the learner to think, apply, interpret, reason, analyse, or solve.

QUESTION QUALITY RULES:
- Relevance: directly assess the selected topic
- Accuracy: all facts, calculations, terminology must be correct
- Competency: requires thinking beyond direct recall
- Clarity: students should understand exactly what is being asked
- Age Appropriateness: vocabulary and complexity must suit the selected class
- Non-Ambiguity: there must be a defensible answer
- Originality: do not copy textbook questions
- For MCQs, incorrect options must be plausible

BALANCE RULE (default): 20% Understanding, 30% Application, 25% Analysis, 15% Evaluation, 10% Higher-order/Creation.

A competency-based question should answer "What can the student DO with the knowledge?" rather than only "What does the student KNOW?"

OUTPUT FORMAT: Generate as clean HTML with proper headings, sections, tables, and formatting. Use <h1> for school name, <h2> for section headers, <table> for marking scheme and competency map. Make it print-friendly.

IMPORTANT: Generate EXACTLY the number of questions and types requested. Do not substitute question types. Include answer key and marking scheme if requested.

Never invent syllabus content, chapters, formulae, historical facts, scientific facts, or statistics.`;

export async function POST(request) {
  const body = await request.json();
  const {
    className, subject, chapter, topic, board, medium, difficulty,
    totalQuestions, totalMarks, timeAllowed, questionTypes,
    includeAnswerKey, includeMarkingScheme, includeCompetencyTags,
    additionalInstructions, schoolName,
  } = body;

  const questionTypesStr = questionTypes
    .filter((qt) => qt.count > 0)
    .map((qt) => `${qt.count} ${qt.type}`)
    .join(", ");

  const userPrompt = `Create a competency-based worksheet with these parameters:

School Name: ${schoolName || "School"}
Class/Grade: ${className}
Subject: ${subject}
Chapter/Unit: ${chapter || "N/A"}
Topic/Sub-topic: ${topic || "N/A"}
Board/Curriculum: ${board}
Medium: ${medium}
Difficulty: ${difficulty}
Total Questions: ${totalQuestions}
Total Marks: ${totalMarks}
Time Allowed: ${timeAllowed} minutes
Question Types: ${questionTypesStr}
Include Answer Key: ${includeAnswerKey ? "Yes" : "No"}
Include Marking Scheme: ${includeMarkingScheme ? "Yes" : "No"}
Include Competency Tags: ${includeCompetencyTags ? "Yes" : "No"}
Additional Instructions: ${additionalInstructions || "None"}

Generate the complete worksheet now in clean HTML format. Use proper headings, numbered questions, and tables where needed. Make it professional and print-ready.`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return Response.json({ error: "Gemini API error", details: err }, { status: 500 });
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated.";
  return Response.json({ content: text });
}
