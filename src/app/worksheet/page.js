"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

const QUESTION_TYPES = [
  "MCQ",
  "Case-Based",
  "Source-Based",
  "Data-Based",
  "Assertion-Reason",
  "Fill in the Blanks",
  "Very Short Answer",
  "Short Answer",
  "Long Answer",
  "HOTS",
  "Match the Following",
  "Error Analysis",
  "Problem Solving",
  "Creative / Open-Ended",
  "Compare and Contrast",
  "Sequencing",
];

const CLASSES = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

const SUBJECTS = [
  "Mathematics",
  "Science",
  "Social Science",
  "English",
  "Hindi",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Business Studies",
  "Accountancy",
  "Computer Science",
  "Political Science",
  "History",
  "Geography",
];

export default function Worksheet() {
  const [form, setForm] = useState({
    schoolName: "",
    className: "10",
    subject: "Mathematics",
    chapter: "",
    topic: "",
    board: "CBSE",
    medium: "English",
    difficulty: "Moderate",
    totalMarks: 40,
    timeAllowed: 60,
    includeAnswerKey: true,
    includeMarkingScheme: true,
    includeCompetencyTags: true,
    additionalInstructions: "",
  });

  const [questionTypes, setQuestionTypes] = useState(
    QUESTION_TYPES.map((type) => ({ type, count: 0 }))
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateQCount(index, count) {
    setQuestionTypes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], count: Math.max(0, count) };
      return next;
    });
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (totalQuestions === 0) {
      setError("Select at least one question type with count > 0");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate-worksheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, totalQuestions, questionTypes }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error + (data.details ? `: ${data.details}` : ""));
      } else {
        let content = data.content || "";
        content = content.replace(/```html\n?/g, "").replace(/```\n?/g, "");
        setResult(content);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch (err) {
      setError("Failed to generate worksheet. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>Worksheet</title>
      <style>
        body { font-family: 'Times New Roman', serif; padding: 40px; color: #000; line-height: 1.6; }
        h1 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; }
        h2 { margin-top: 24px; border-bottom: 1px solid #666; padding-bottom: 4px; }
        table { border-collapse: collapse; width: 100%; margin: 12px 0; }
        th, td { border: 1px solid #333; padding: 6px 10px; text-align: left; }
        th { background: #f0f0f0; }
        @media print { body { padding: 20px; } }
      </style>
    </head><body>${result}</body></html>`);
    w.document.close();
    w.print();
  }

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            AI-Powered Tool
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Competency-Based{" "}
            <span className="gradient-text">Worksheet Generator</span>
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            Generate CBSE-aligned competency-based worksheets powered by AI.
            Select your parameters and get a professional worksheet in seconds.
          </p>
        </motion.div>

        <form onSubmit={handleGenerate}>
          <motion.div
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold mb-5">Basic Details</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="School Name">
                <input
                  type="text"
                  placeholder="Enter school name"
                  value={form.schoolName}
                  onChange={(e) => updateField("schoolName", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Class">
                <select
                  value={form.className}
                  onChange={(e) => updateField("className", e.target.value)}
                  className="input"
                >
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Subject">
                <select
                  value={form.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  className="input"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Chapter / Unit">
                <input
                  type="text"
                  placeholder="e.g. Real Numbers"
                  value={form.chapter}
                  onChange={(e) => updateField("chapter", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Topic / Sub-topic">
                <input
                  type="text"
                  placeholder="e.g. HCF and LCM"
                  value={form.topic}
                  onChange={(e) => updateField("topic", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Board">
                <select
                  value={form.board}
                  onChange={(e) => updateField("board", e.target.value)}
                  className="input"
                >
                  {["CBSE", "ICSE", "State Board", "IB", "Cambridge"].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </Field>
              <Field label="Medium">
                <select
                  value={form.medium}
                  onChange={(e) => updateField("medium", e.target.value)}
                  className="input"
                >
                  {["English", "Hindi", "Bilingual"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </Field>
              <Field label="Difficulty">
                <select
                  value={form.difficulty}
                  onChange={(e) => updateField("difficulty", e.target.value)}
                  className="input"
                >
                  {["Easy", "Moderate", "Difficult", "HOTS", "Mixed"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </Field>
              <Field label="Total Marks">
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={form.totalMarks}
                  onChange={(e) => updateField("totalMarks", Number(e.target.value))}
                  className="input"
                />
              </Field>
              <Field label="Time Allowed (minutes)">
                <input
                  type="number"
                  min="10"
                  max="180"
                  value={form.timeAllowed}
                  onChange={(e) => updateField("timeAllowed", Number(e.target.value))}
                  className="input"
                />
              </Field>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">
                Question Types & Count
              </h2>
              <span className="text-sm font-medium text-primary">
                Total: {totalQuestions} questions
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {questionTypes.map((qt, i) => (
                <div
                  key={qt.type}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-background"
                >
                  <span className="text-sm truncate">{qt.type}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateQCount(i, qt.count - 1)}
                      className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                      {qt.count}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQCount(i, qt.count + 1)}
                      className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-5">Options</h2>
            <div className="flex flex-wrap gap-6 mb-5">
              <Checkbox
                label="Include Answer Key"
                checked={form.includeAnswerKey}
                onChange={(v) => updateField("includeAnswerKey", v)}
              />
              <Checkbox
                label="Include Marking Scheme"
                checked={form.includeMarkingScheme}
                onChange={(v) => updateField("includeMarkingScheme", v)}
              />
              <Checkbox
                label="Include Competency Tags"
                checked={form.includeCompetencyTags}
                onChange={(v) => updateField("includeCompetencyTags", v)}
              />
            </div>
            <Field label="Additional Instructions">
              <textarea
                rows={3}
                placeholder="Any specific instructions for the AI..."
                value={form.additionalInstructions}
                onChange={(e) => updateField("additionalInstructions", e.target.value)}
                className="input resize-none"
              />
            </Field>
          </motion.div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl gradient-bg-orange text-white font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Generating Worksheet..." : "Generate Worksheet"}
          </button>
        </form>

        {result && (
          <motion.div
            ref={resultRef}
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Generated Worksheet</h2>
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-lg gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Print / Save PDF
              </button>
            </div>
            <div
              className="rounded-2xl border border-border bg-white text-black p-8 sm:p-10 prose prose-sm max-w-none [&_table]:border-collapse [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:p-2 [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_h1]:text-center [&_h1]:border-b-2 [&_h1]:border-black [&_h1]:pb-2"
              dangerouslySetInnerHTML={{ __html: result }}
            />
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--background);
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: var(--primary);
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-border accent-primary"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
