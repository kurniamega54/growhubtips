"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

type NodeContent = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: NodeContent[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
};

type SeoSidebarProps = {
  title: string;
  slug: string;
  focusKeyword: string;
  seoTitle: string;
  metaDescription: string;
  contentJson?: NodeContent | null;
  isSaving?: boolean;
  lastSavedAt?: string | null;
  onSeoScoreChange?: (score: number) => void;
};

const FOREST_GREEN = "#2D5A27";
const YELLOW = "#F59E0B";
const RED = "#DC2626";

// ============================================
// Utility Functions for SEO Analysis
// ============================================

function collectText(node: NodeContent | undefined, text: string[] = []) {
  if (!node) return text;
  if (node.type === "text" && node.text) text.push(node.text);
  node.content?.forEach((child) => collectText(child, text));
  return text;
}

function findFirstHeading(node?: NodeContent | null, level = 1): string {
  if (!node) return "";
  if (node.type === "heading" && Number(node.attrs?.level) === level) {
    return collectText(node).join(" ").trim();
  }
  for (const child of node.content ?? []) {
    const found = findFirstHeading(child, level);
    if (found) return found;
  }
  return "";
}

function countKeywordOccurrences(text: string, keyword: string): number {
  if (!keyword.trim()) return 0;
  const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, "gi");
  return (text.match(regex) || []).length;
}

function calculateKeywordDensity(
  contentJson: NodeContent | null,
  keyword: string
): number {
  if (!contentJson || !keyword.trim()) return 0;
  const allText = collectText(contentJson).join(" ");
  const wordCount = allText.trim().split(/\s+/).length;
  const keywordCount = countKeywordOccurrences(allText, keyword);
  
  if (wordCount === 0) return 0;
  return (keywordCount / wordCount) * 100;
}

function checkImagesForAltText(node?: NodeContent | null): {
  total: number;
  withAlt: number;
  withoutAlt: number;
} {
  let total = 0;
  let withAlt = 0;
  let withoutAlt = 0;

  const walk = (n?: NodeContent | null) => {
    if (!n) return;
    if (n.type === "smartImage" || n.type === "image") {
      total += 1;
      const alt = String(n.attrs?.alt ?? "").trim();
      if (alt) withAlt += 1;
      else withoutAlt += 1;
    }
    n.content?.forEach(walk);
  };

  walk(node);
  return { total, withAlt, withoutAlt };
}

function calculateReadability(contentJson: NodeContent | null): {
  avgSentenceLength: number;
  totalSentences: number;
  totalWords: number;
} {
  if (!contentJson) return { avgSentenceLength: 0, totalSentences: 0, totalWords: 0 };

  const allText = collectText(contentJson).join(" ");
  
  // Split by sentence-ending punctuation
  const sentences = allText
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  
  const totalSentences = sentences.length;
  const totalWords = allText.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const avgSentenceLength = totalSentences > 0 ? totalWords / totalSentences : 0;

  return { avgSentenceLength, totalSentences, totalWords };
}

function countLinks(node?: NodeContent | null) {
  let internal = 0;
  let external = 0;
  const walk = (n?: NodeContent | null) => {
    if (!n) return;
    if (n.marks) {
      n.marks.forEach((mark) => {
        if (mark.type === "link") {
          const href = String(mark.attrs?.href ?? "");
          if (href.startsWith("/")) internal += 1;
          else if (href.startsWith("http")) external += 1;
        }
      });
    }
    n.content?.forEach(walk);
  };
  walk(node);
  return { internal, external };
}

// ============================================
// SEO Score Calculation
// ============================================

function calculateSeoScore(params: {
  title: string;
  focusKeyword: string;
  seoTitle: string;
  metaDescription: string;
  contentJson: NodeContent | null;
}): {
  score: number;
  keywordDensity: number;
  keywordInH1: boolean;
  keywordInTitle: boolean;
  keywordInMeta: boolean;
  imagesAudit: { total: number; withAlt: number; withoutAlt: number };
  readability: { avgSentenceLength: number; totalSentences: number; totalWords: number };
  linkCounts: { internal: number; external: number };
  wordCount: number;
} {
  const keyword = params.focusKeyword.trim().toLowerCase();
  const titleLower = params.title.toLowerCase();
  const seoTitleLower = params.seoTitle.toLowerCase();
  const metaLower = params.metaDescription.toLowerCase();
  const h1Text = findFirstHeading(params.contentJson, 1).toLowerCase();
  
  const keywordDensity = calculateKeywordDensity(params.contentJson, keyword);
  const keywordInH1 = keyword ? h1Text.includes(keyword) : false;
  const keywordInTitle = keyword ? titleLower.includes(keyword) : false;
  const keywordInMeta = keyword ? metaLower.includes(keyword) : false;
  
  const imagesAudit = checkImagesForAltText(params.contentJson);
  const readability = calculateReadability(params.contentJson);
  const linkCounts = countLinks(params.contentJson);
  const wordCount = readability.totalWords;

  let score = 0;

  // Title optimization (20 points)
  if (keywordInTitle) score += 15;
  if (params.title.length >= 30 && params.title.length <= 60) score += 5;

  // H1 optimization (15 points)
  if (keywordInH1) score += 15;

  // Meta description (10 points)
  if (keywordInMeta) score += 5;
  if (params.metaDescription.length >= 120 && params.metaDescription.length <= 160) score += 5;

  // Keyword density (15 points)
  if (keywordDensity >= 0.5 && keywordDensity <= 2.5) score += 15;
  else if (keywordDensity > 0 && keywordDensity < 3) score += 8;

  // Content length (15 points)
  if (wordCount >= 300) score += 5;
  if (wordCount >= 700) score += 5;
  if (wordCount >= 1500) score += 5;

  // Image optimization (10 points)
  if (imagesAudit.total > 0) {
    const altPercentage = (imagesAudit.withAlt / imagesAudit.total) * 100;
    if (altPercentage === 100) score += 10;
    else if (altPercentage >= 75) score += 7;
    else if (altPercentage >= 50) score += 4;
  }

  // Readability (10 points)
  if (readability.avgSentenceLength > 0) {
    if (readability.avgSentenceLength >= 15 && readability.avgSentenceLength <= 20) score += 10;
    else if (readability.avgSentenceLength >= 12 && readability.avgSentenceLength <= 25) score += 6;
    else if (readability.avgSentenceLength < 30) score += 3;
  }

  // Internal links (5 points)
  if (linkCounts.internal >= 2) score += 5;
  else if (linkCounts.internal === 1) score += 3;

  // External links (5 points)
  if (linkCounts.external >= 1) score += 5;

  return {
    score: Math.min(score, 100),
    keywordDensity,
    keywordInH1,
    keywordInTitle,
    keywordInMeta,
    imagesAudit,
    readability,
    linkCounts,
    wordCount,
  };
}

// ============================================
// SEO Score Color
// ============================================

function getSeoScoreColor(score: number): string {
  if (score >= 80) return FOREST_GREEN;
  if (score >= 50) return YELLOW;
  return RED;
}

// ============================================
// Component
// ============================================

export function SeoSidebar({
  title,
  slug,
  focusKeyword,
  seoTitle,
  metaDescription,
  contentJson,
  isSaving,
  lastSavedAt,
  onSeoScoreChange,
}: SeoSidebarProps) {
  const [open, setOpen] = useState(true);
  const [showChecklist, setShowChecklist] = useState(true);
  const [serpView, setSerpView] = useState<"desktop" | "mobile">("desktop");

  const analysis = useMemo(
    () =>
      calculateSeoScore({
        title,
        focusKeyword,
        seoTitle,
        metaDescription,
        contentJson: contentJson ?? null,
      }),
    [title, focusKeyword, seoTitle, metaDescription, contentJson]
  );

  // Notify parent of score changes
  useMemo(() => {
    if (onSeoScoreChange) {
      onSeoScoreChange(analysis.score);
    }
  }, [analysis.score, onSeoScoreChange]);

  const scoreColor = getSeoScoreColor(analysis.score);
  const circumference = 2 * Math.PI * 54; // radius = 54
  const strokeDashoffset = circumference - (analysis.score / 100) * circumference;

  // Generate actionable tips
  const tips = useMemo(() => {
    const result: Array<{ text: string; status: "pass" | "warn" | "fail" }> = [];

    // Title checks
    if (!analysis.keywordInTitle) {
      result.push({ text: "Add focus keyword to title", status: "fail" });
    } else {
      result.push({ text: "Focus keyword in title ✓", status: "pass" });
    }

    if (title.length < 30) {
      result.push({ text: "Title is too short (min 30 chars)", status: "fail" });
    } else if (title.length > 60) {
      result.push({ text: "Title is too long (max 60 chars)", status: "warn" });
    } else {
      result.push({ text: "Title length is optimal ✓", status: "pass" });
    }

    // H1 check
    if (!analysis.keywordInH1) {
      result.push({ text: "Add focus keyword to first H1 heading", status: "fail" });
    } else {
      result.push({ text: "Focus keyword in H1 ✓", status: "pass" });
    }

    // Meta description
    if (!analysis.keywordInMeta) {
      result.push({ text: "Add focus keyword to meta description", status: "fail" });
    }

    if (metaDescription.length < 120) {
      result.push({ text: "Meta description is too short (min 120 chars)", status: "fail" });
    } else if (metaDescription.length > 160) {
      result.push({ text: "Meta description is too long (max 160 chars)", status: "warn" });
    } else if (analysis.keywordInMeta) {
      result.push({ text: "Meta description is optimal ✓", status: "pass" });
    }

    // Keyword density
    if (analysis.keywordDensity === 0) {
      result.push({ text: "Add focus keyword to content", status: "fail" });
    } else if (analysis.keywordDensity < 0.5) {
      result.push({ text: "Keyword density too low (aim for 0.5-2.5%)", status: "warn" });
    } else if (analysis.keywordDensity > 2.5) {
      result.push({ text: "Keyword density too high (risk of over-optimization)", status: "warn" });
    } else {
      result.push({ text: `Keyword density optimal (${analysis.keywordDensity.toFixed(2)}%) ✓`, status: "pass" });
    }

    // Word count
    if (analysis.wordCount < 300) {
      result.push({ text: "Add more content (min 300 words)", status: "fail" });
    } else if (analysis.wordCount < 700) {
      result.push({ text: "Consider adding more content (aim for 700+ words)", status: "warn" });
    } else {
      result.push({ text: `Word count is great (${analysis.wordCount} words) ✓`, status: "pass" });
    }

    // Images alt text
    if (analysis.imagesAudit.withoutAlt > 0) {
      result.push({
        text: `${analysis.imagesAudit.withoutAlt} image(s) missing alt text`,
        status: "fail",
      });
    } else if (analysis.imagesAudit.total > 0) {
      result.push({ text: "All images have alt text ✓", status: "pass" });
    }

    // Readability
    if (analysis.readability.avgSentenceLength > 25) {
      result.push({ text: "Sentences are too long (aim for 15-20 words)", status: "warn" });
    } else if (analysis.readability.avgSentenceLength > 0) {
      result.push({
        text: `Readability is good (avg ${analysis.readability.avgSentenceLength.toFixed(1)} words/sentence) ✓`,
        status: "pass",
      });
    }

    // Internal links
    if (analysis.linkCounts.internal === 0) {
      result.push({ text: "Add internal links to related content", status: "fail" });
    } else if (analysis.linkCounts.internal === 1) {
      result.push({ text: "Add more internal links (min 2 recommended)", status: "warn" });
    } else {
      result.push({ text: `Internal links added (${analysis.linkCounts.internal}) ✓`, status: "pass" });
    }

    // External links
    if (analysis.linkCounts.external === 0) {
      result.push({ text: "Add external authoritative links", status: "warn" });
    } else {
      result.push({ text: `External links added (${analysis.linkCounts.external}) ✓`, status: "pass" });
    }

    return result;
  }, [analysis, title, metaDescription]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="absolute -left-4 top-6 z-20 rounded-full px-3 py-1 text-xs shadow-lg transition-all hover:scale-105"
        style={{ backgroundColor: scoreColor, color: "white" }}
      >
        {open ? "Hide" : "SEO"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-80 shrink-0 space-y-6"
          >
            {/* Circular SEO Score */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xl"
            >
              <h3 className="font-bold text-gray-800 mb-4 text-center">SEO Score</h3>
              
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  {/* Background circle */}
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      stroke="#E5E7EB"
                      strokeWidth="12"
                      fill="none"
                    />
                    {/* Animated progress circle */}
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="54"
                      stroke={scoreColor}
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{
                        strokeDasharray: circumference,
                      }}
                    />
                  </svg>
                  
                  {/* Score text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="text-4xl font-bold"
                      style={{ color: scoreColor }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      {analysis.score}
                    </motion.span>
                    <span className="text-sm text-gray-500">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Status indicator */}
              <div className="text-center">
                <motion.p
                  className="text-sm font-semibold"
                  style={{ color: scoreColor }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {analysis.score >= 80 && "Excellent SEO!"}
                  {analysis.score >= 50 && analysis.score < 80 && "Good, keep improving"}
                  {analysis.score < 50 && "Needs improvement"}
                </motion.p>
              </div>
            </motion.div>

            {/* Actionable Tips Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowChecklist((prev) => !prev)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-b from-white to-gray-50 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <AlertTriangle size={18} style={{ color: scoreColor }} />
                  Actionable Tips
                </h3>
                {showChecklist ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              <AnimatePresence>
                {showChecklist && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                      {tips.map((tip, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 text-sm"
                        >
                          {tip.status === "pass" && (
                            <Check
                              size={18}
                              className="flex-shrink-0 mt-0.5"
                              style={{ color: FOREST_GREEN }}
                            />
                          )}
                          {tip.status === "warn" && (
                            <AlertTriangle
                              size={18}
                              className="flex-shrink-0 mt-0.5"
                              style={{ color: YELLOW }}
                            />
                          )}
                          {tip.status === "fail" && (
                            <X
                              size={18}
                              className="flex-shrink-0 mt-0.5"
                              style={{ color: RED }}
                            />
                          )}
                          <span
                            className={
                              tip.status === "pass"
                                ? "text-gray-600"
                                : tip.status === "warn"
                                ? "text-gray-700 font-medium"
                                : "text-gray-800 font-semibold"
                            }
                          >
                            {tip.text}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Detailed Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg"
            >
              <h3 className="font-bold text-gray-800 mb-4">Detailed Analysis</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Keyword Density</span>
                  <span className="font-semibold" style={{ color: scoreColor }}>
                    {analysis.keywordDensity.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Word Count</span>
                  <span className="font-semibold text-gray-800">{analysis.wordCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Sentence Length</span>
                  <span className="font-semibold text-gray-800">
                    {analysis.readability.avgSentenceLength.toFixed(1)} words
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Images (with alt)</span>
                  <span className="font-semibold text-gray-800">
                    {analysis.imagesAudit.withAlt}/{analysis.imagesAudit.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Internal Links</span>
                  <span className="font-semibold text-gray-800">{analysis.linkCounts.internal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">External Links</span>
                  <span className="font-semibold text-gray-800">{analysis.linkCounts.external}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reading Time</span>
                  <span className="font-semibold text-gray-800">
                    {Math.max(1, Math.ceil(analysis.wordCount / 200))} min
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Autosave Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-center text-gray-500"
            >
              {isSaving ? "Auto-saving..." : lastSavedAt ? `Last saved ${lastSavedAt}` : "Not saved yet"}
            </motion.div>

            {/* SERP Preview with Mobile/Desktop Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700 text-sm">Google Search Preview</h3>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setSerpView("desktop")}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      serpView === "desktop"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setSerpView("mobile")}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      serpView === "mobile"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              {serpView === "desktop" ? (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <div className="text-sm text-gray-600">
                      <span className="inline-block w-4 h-4 rounded-full bg-blue-500 mr-1" style={{ fontSize: "0" }}>G</span>
                      <span className="font-normal">growhubtips.com</span>
                      <span className="mx-1">›</span>
                      <span className="text-gray-700">{slug || "post-slug"}</span>
                    </div>
                  </div>
                  <h3
                    className="text-blue-600 hover:underline cursor-pointer font-normal leading-snug"
                    style={{ fontSize: "20px", fontFamily: "Arial, sans-serif" }}
                  >
                    {seoTitle || title || "Your title will appear here"}
                  </h3>
                  <p
                    className="text-gray-600 leading-relaxed line-clamp-2"
                    style={{ fontSize: "14px", fontFamily: "Arial, sans-serif" }}
                  >
                    {metaDescription || "Your meta description will appear here. Make it compelling to increase click-through rate from search results."}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 max-w-sm">
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500" style={{ fontSize: "0" }}>G</span>
                    <span className="font-normal">growhubtips.com</span>
                  </div>
                  <h3
                    className="text-blue-600 font-normal leading-tight line-clamp-2"
                    style={{ fontSize: "16px", fontFamily: "Arial, sans-serif" }}
                  >
                    {seoTitle || title || "Your title will appear here"}
                  </h3>
                  <p
                    className="text-gray-600 leading-snug line-clamp-2"
                    style={{ fontSize: "12px", fontFamily: "Arial, sans-serif" }}
                  >
                    {metaDescription || "Your meta description will appear here."}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
