"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

const SAMPLE_CSV = `Name,Phone,Email,Organization,Tag
Rahul Sharma,9876543210,rahul@example.com,ABC Corp,Client
Priya Singh,9123456789,priya@example.com,XYZ School,Teacher
Amit Patel,9988776655,amit@example.com,Tech Solutions,Vendor
Sunita Gupta,9871234567,sunita@example.com,Green NGO,Partner`;

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const obj = {};
    headers.forEach((h, i) => (obj[h] = values[i] || ""));
    return obj;
  });
}

function contactToVCard(c, tag) {
  const name = c.name || "";
  const parts = name.split(" ");
  const first = parts[0] || "";
  const last = parts.slice(1).join(" ") || "";
  const fullName = tag ? `${tag}. ${name}` : name;
  const fn = tag ? `${tag}. ${first}` : first;

  let vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\n`;
  vcard += `FN:${fullName}\r\n`;
  vcard += `N:${last};${fn};;;\r\n`;
  if (c.phone) vcard += `TEL;TYPE=CELL:${c.phone}\r\n`;
  if (c.email) vcard += `EMAIL:${c.email}\r\n`;
  if (c.organization) vcard += `ORG:${c.organization}\r\n`;
  if (c.tag) vcard += `CATEGORIES:${c.tag}\r\n`;
  if (c.tag) vcard += `NOTE:${c.tag}\r\n`;
  vcard += `END:VCARD\r\n`;
  return vcard;
}

export default function VCFMaker() {
  const [contacts, setContacts] = useState([]);
  const [tag, setTag] = useState("g");
  const [fileName, setFileName] = useState("contacts");
  const [step, setStep] = useState("upload");
  const fileRef = useRef(null);

  function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sample_contacts.csv";
    a.click();
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const parsed = parseCSV(ev.target.result);
      if (parsed.length === 0) {
        alert("No contacts found. Make sure your CSV has headers: Name, Phone, Email, Organization, Tag");
        return;
      }
      setContacts(parsed);
      setStep("preview");
    };
    reader.readAsText(file);
  }

  function removeContact(i) {
    setContacts((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateContact(i, field, value) {
    setContacts((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }

  function generateVCF() {
    if (contacts.length === 0) return;
    const vcf = contacts.map((c) => contactToVCard(c, tag)).join("\r\n");
    const blob = new Blob([vcf], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${fileName || "contacts"}.vcf`;
    a.click();
  }

  function addEmptyContact() {
    setContacts((prev) => [
      ...prev,
      { name: "", phone: "", email: "", organization: "", tag: "" },
    ]);
  }

  function reset() {
    setContacts([]);
    setStep("upload");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Free Tool
          </p>
          <h1 className="text-4xl font-bold mb-4">
            VCF Contact <span className="gradient-text">Maker</span>
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Download a sample CSV, fill in your contacts, upload it, and get a
            ready-to-import .vcf file. Add a prefix tag to every name.
          </p>
        </motion.div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Upload CSV", "Preview & Edit", "Download VCF"].map((label, i) => {
            const active =
              (i === 0 && step === "upload") ||
              (i === 1 && step === "preview") ||
              (i === 2 && step === "preview");
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    active
                      ? "gradient-bg-orange text-white"
                      : "bg-surface border border-border text-muted"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${active ? "font-semibold" : "text-muted"}`}>
                  {label}
                </span>
                {i < 2 && (
                  <div className="w-8 h-px bg-border mx-1" />
                )}
              </div>
            );
          })}
        </div>

        {step === "upload" && (
          <motion.div
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold mb-2">Step 1: Get the CSV Template</h2>
            <p className="text-sm text-muted mb-5">
              Download the sample CSV, open in Excel or Google Sheets, fill in
              your contacts, then upload it below.
            </p>

            <button
              onClick={downloadSample}
              className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity mb-8"
            >
              Download Sample CSV
            </button>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold mb-2">Step 2: Upload Your CSV</h2>
              <p className="text-sm text-muted mb-4">
                CSV must have columns: <strong>Name, Phone, Email, Organization, Tag</strong>
              </p>
              <label className="flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer bg-background">
                <svg
                  className="w-10 h-10 text-muted mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm text-muted">Click to upload CSV file</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <p className="text-sm text-muted mb-3">Or add contacts manually:</p>
              <button
                onClick={() => {
                  addEmptyContact();
                  setStep("preview");
                }}
                className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors"
              >
                + Add Contacts Manually
              </button>
            </div>
          </motion.div>
        )}

        {step === "preview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Tag & filename options */}
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-6">
              <h2 className="text-lg font-semibold mb-4">Options</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Name Prefix Tag
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. g, GT, School"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  <p className="text-xs text-muted mt-1">
                    Each name will start with &quot;{tag || "..."}.&quot; e.g. &quot;{tag}. Rahul Sharma&quot;
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Output File Name
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="contacts"
                      className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                    <span className="text-sm text-muted">.vcf</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contacts table */}
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Contacts ({contacts.length})
                </h2>
                <button
                  onClick={addEmptyContact}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  + Add Row
                </button>
              </div>

              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-2 font-medium text-muted">#</th>
                      <th className="text-left py-2 pr-2 font-medium">Name</th>
                      <th className="text-left py-2 pr-2 font-medium">Phone</th>
                      <th className="text-left py-2 pr-2 font-medium">Email</th>
                      <th className="text-left py-2 pr-2 font-medium">Organization</th>
                      <th className="text-left py-2 pr-2 font-medium">Tag</th>
                      <th className="py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 pr-2 text-muted">{i + 1}</td>
                        <td className="py-2 pr-2">
                          <input
                            type="text"
                            value={c.name}
                            onChange={(e) => updateContact(i, "name", e.target.value)}
                            placeholder="Name"
                            className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            type="text"
                            value={c.phone}
                            onChange={(e) => updateContact(i, "phone", e.target.value)}
                            placeholder="Phone"
                            className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            type="text"
                            value={c.email}
                            onChange={(e) => updateContact(i, "email", e.target.value)}
                            placeholder="Email"
                            className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            type="text"
                            value={c.organization}
                            onChange={(e) => updateContact(i, "organization", e.target.value)}
                            placeholder="Organization"
                            className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            type="text"
                            value={c.tag}
                            onChange={(e) => updateContact(i, "tag", e.target.value)}
                            placeholder="Tag"
                            className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary"
                          />
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => removeContact(i)}
                            className="text-red-500 hover:text-red-700 text-lg"
                            title="Remove"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {contacts.length === 0 && (
                <p className="text-center text-muted py-8">
                  No contacts yet. Add rows or go back to upload a CSV.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={generateVCF}
                disabled={contacts.length === 0}
                className="flex-1 py-3.5 rounded-xl gradient-bg-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Download VCF ({contacts.length} contacts)
              </button>
              <button
                onClick={reset}
                className="px-6 py-3.5 rounded-xl border border-border font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
