import { useState } from "react";

// =============================================================================
// Trace v2 — Stage 1 (D design: Sky Fresh + dinosaur footprint logo)
// About screen, text input, result screen (Science Bridge + body status)
// Voice input and biosignal measurement (Stage 2) are stubbed for now.
// =============================================================================

// ----- Inject Google Fonts ---------------------------------------------------
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap";
document.head.appendChild(fontLink);

// ----- Design tokens (D: Sky Fresh) ------------------------------------------
const C = {
  // Backgrounds
  bg:            "#e8eef2",
  surface:       "#ffffff",
  surfaceSoft:   "#fafcff",
  card:          "rgba(255,255,255,0.6)",
  // Borders
  border:        "rgba(74,108,212,0.15)",
  borderLight:   "rgba(74,108,212,0.08)",
  borderSoft:    "rgba(74,108,212,0.12)",
  // Text
  text:          "#18181a",
  textStrong:    "#3a4858",
  sub:           "#5a6878",
  subSoft:       "#5a6a82",
  mute:          "#7a8aa0",
  faint:         "#a0aabe",
  // Accents (blue + pink gradient)
  accent:        "#4a6cd4",
  accentLight:   "#6b88e8",
  accentBg:      "#dceaff",
  accentBgSoft:  "#eef2f8",
  // Status colors
  match:         "#86efac",
  matchDark:     "#15803d",
  matchBg:       "#dcfce7",
  mismatch:      "#f97316",
  mismatchDark:  "#9a3412",
  // Fonts
  mono:          "'DM Mono',monospace",
  sans:          "'Inter','Apple SD Gothic Neo','Malgun Gothic',sans-serif",
  // Gradients
  gradAccent:    "linear-gradient(135deg,#4a6cd4 0%,#6b88e8 100%)",
  shadowAccent:  "0 6px 18px rgba(74,108,212,0.3)",
  shadowCard:    "0 20px 60px rgba(50,90,140,0.15),0 2px 6px rgba(50,90,140,0.04)",
  shadowInput:   "0 2px 8px rgba(50,90,140,0.05)",
};

// ----- Localized strings -----------------------------------------------------
const STRINGS = {
  ko: {
    appName:        "TRACE",
    tabNow:         "지금",
    tabRecord:      "기록",
    // About
    aboutWord:      "trace.",
    aboutTagline:   "학습하는 순간을 기록하는 앱",
    aboutSec1Title: "무엇을 하는 앱인가요",
    aboutSec1Para1: "공부나 작업 중에 막히거나 떠오른 순간을 글이나 말로 기록합니다. 입력한 내용에서 관련된 과학·기술 개념을 찾아주고, 다음에 무엇을 시도해볼지 단서를 보여줍니다.",
    aboutSec1Para2: "말하기를 선택하면 카메라와 마이크로 심박수와 음성 톤을 측정합니다. 본인의 인지-정서 상태를 이해하고 패턴을 파악할 수 있도록 도와줍니다.",
    aboutSec2Title: "데이터는 어떻게 되나요",
    aboutSec2Body:  "모든 기록과 측정값은 본인 기기에만 저장되며, 외부로 전송되지 않습니다.",
    aboutCta:       "기록 시작하기",
    // Input
    inputGuide:     "지금 하고 있는 작업, 막힌 부분이나 떠오르는 의문, 그리고 현재 상태를 적거나 말해 주세요. 사이언스 브릿지가 힌트를 제공하고 바이오센서와 텍스트 분석이 정서 상태를 알려드립니다.",
    inputGuideMarks: ["사이언스 브릿지", "바이오센서와 텍스트 분석"],
    inputPh:        "여기에 적어주세요...",
    actionVoice:    "말하기",
    actionVoiceSub: "카메라·마이크 측정",
    actionText:     "텍스트",
    actionTextSub:  "글로 입력",
    submit:         "기록하기",
    submitting:     "분석 중...",
    // Result
    resultHeader:   "결과",
    relatedLabel:   "자세히 알아보기",
    selfLabel:      "본인 상태",
    saved:          "기록 저장됨",
    close:          "닫기",
    bridgeNone:     "이 기록에서 연결할 과학 개념을 찾지 못했습니다.",
    bridgeFinding:  "개념 연결 찾는 중...",
    emoStuck:       "막힘",
    emoAnxious:     "불안",
    emoConfused:    "혼란",
    emoCurious:     "궁금",
    emoUnstuck:     "이해됨",
    emoOther:       "+ 직접 입력",
    voiceStubMsg:   "음성 입력은 다음 단계에서 추가됩니다.",
  },
  en: {
    appName:        "TRACE",
    tabNow:         "Now",
    tabRecord:      "Record",
    aboutWord:      "trace.",
    aboutTagline:   "An app to log your learning moments",
    aboutSec1Title: "What it does",
    aboutSec1Para1: "Log moments while you're studying or working — stuck points, ideas, anything that comes up — by typing or speaking. Trace finds related science or technical concepts and suggests what to look into next.",
    aboutSec1Para2: "If you choose to speak, your camera and microphone measure heart rate and voice tone. This helps you understand your cognitive-emotional state and notice patterns over time.",
    aboutSec2Title: "About your data",
    aboutSec2Body:  "All entries and measurements stay on your device. Nothing is sent anywhere.",
    aboutCta:       "Start recording",
    inputGuide:     "Tell us what you're working on, what's stuck, what you're wondering, and how you feel. The Science Bridge will offer hints while biosensors and text analysis reflect your emotional state.",
    inputGuideMarks: ["Science Bridge", "biosensors and text analysis"],
    inputPh:        "Type here...",
    actionVoice:    "Speak",
    actionVoiceSub: "Camera·mic measure",
    actionText:     "Type",
    actionTextSub:  "Write it out",
    submit:         "Record",
    submitting:     "Analyzing...",
    resultHeader:   "Result",
    relatedLabel:   "Learn more",
    selfLabel:      "Your state",
    saved:          "Entry saved",
    close:          "Close",
    bridgeNone:     "No science concept connection found for this entry.",
    bridgeFinding:  "Finding concept connections...",
    emoStuck:       "Stuck",
    emoAnxious:     "Anxious",
    emoConfused:    "Confused",
    emoCurious:     "Curious",
    emoUnstuck:     "Got it",
    emoOther:       "+ Other",
    voiceStubMsg:   "Voice input is coming in the next stage.",
  },
};

const EMOTIONS = [
  { key: "stuck",    color: "#b45309", bg: "#fef3c7", border: "#fcd34d" },
  { key: "anxious",  color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
  { key: "confused", color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
  { key: "curious",  color: "#0369a1", bg: "#e0f2fe", border: "#7dd3fc" },
  { key: "unstuck",  color: "#166534", bg: "#dcfce7", border: "#86efac" },
];

// ----- Global CSS ------------------------------------------------------------
const cssEl = document.createElement("style");
cssEl.textContent = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: ${C.sans}; background: ${C.bg}; }
  button { font-family: ${C.sans}; cursor: pointer; }
  textarea:focus, input:focus { outline: none; border-color: ${C.accent} !important; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .fade-in { animation: fadeIn 0.25s ease; }
`;
document.head.appendChild(cssEl);

// ----- Dinosaur footprint trail (small SVG) ----------------------------------
// Trail walks from bottom-left to top-right across the trace. logo
function FootprintTrail() {
  const path = `M 30 4 C 23 6, 22 24, 27 47 C 28 51, 33 51, 33 47 C 38 24, 37 6, 30 4 Z`;
  const pathLeft = `M 9 14 C 5 18, 7 36, 19 49 C 23 51, 26 48, 24 43 C 20 28, 14 12, 9 14 Z`;
  const pathRight = `M 51 14 C 55 18, 53 36, 41 49 C 37 51, 34 48, 36 43 C 40 28, 46 12, 51 14 Z`;

  const Footprint = ({ scale = 1, opacity = 1, color = C.accent }) => (
    <g transform={`scale(${scale})`} opacity={opacity}>
      <path d={path} fill={color} />
      <path d={pathLeft} fill={color} />
      <path d={pathRight} fill={color} />
    </g>
  );

  return (
    <>
      {/* Tiny footprint at bottom-left of t */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 60 60"
        style={{ position: "absolute", bottom: 0, left: 0, pointerEvents: "none" }}
      >
        <g transform="rotate(20 30 30)" opacity="0.3">
          <path d={path} fill={C.accent} />
          <path d={pathLeft} fill={C.accent} />
          <path d={pathRight} fill={C.accent} />
        </g>
      </svg>

      {/* 3-print trail walking up to right (gradient size + opacity) */}
      <svg
        width="160"
        height="36"
        viewBox="0 0 200 60"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-30%)",
          pointerEvents: "none",
        }}
      >
        <g transform="translate(20,30) rotate(20) scale(0.42)" opacity="0.35">
          <path d={path} fill={C.accent} />
          <path d={pathLeft} fill={C.accent} />
          <path d={pathRight} fill={C.accent} />
        </g>
        <g transform="translate(75,15) rotate(20) scale(0.58)" opacity="0.6">
          <path d={path} fill={C.accent} />
          <path d={pathLeft} fill={C.accent} />
          <path d={pathRight} fill={C.accent} />
        </g>
        <g transform="translate(135,0) rotate(20) scale(0.75)" opacity="0.85">
          <path d={path} fill={C.accent} />
          <path d={pathLeft} fill={C.accent} />
          <path d={pathRight} fill={C.accent} />
        </g>
      </svg>
    </>
  );
}

// ----- Background blobs (decorative gradient circles) ------------------------
function BackgroundBlobs() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,#a8d8ff 0%,#d4eaff 60%,transparent 100%)",
          opacity: 0.45,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -120,
          left: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,#ffd4e8 0%,#ffe8f1 60%,transparent 100%)",
          opacity: 0.35,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

// ----- Spinner ---------------------------------------------------------------
function Spinner({ size = 12 }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: `2px solid ${C.borderSoft}`,
        borderTopColor: C.accent,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

// ----- API call --------------------------------------------------------------
async function callAPI(messages) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, max_tokens: 1000 }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return await res.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// Science Bridge prompt
function bridgePrompt(text, lang) {
  const langTag = lang === "ko" ? "Respond in Korean." : "Respond in English.";
  return `You are a Learning Sciences expert. Analyze the student input and connect it to a science or CS concept if relevant.
${langTag}
Student input: "${text}"
Return ONLY valid JSON — no markdown, no preamble.
If relevant:
{"relevant":true,"domain":"e.g., Machine Learning","domainShort":"ML","concept":"e.g., Bias-Variance Tradeoff","diagnosis":"1-2 sentences explaining the likely issue in middle-school-level language","links":[{"source":"e.g., scikit-learn","title":"Underfitting vs Overfitting","url":"https://example.com"},{"source":"StatQuest","title":"Bias-Variance Tradeoff (video)","url":"https://example.com"}]}
If not relevant: {"relevant":false}
Important: domainShort must be a 2-3 letter code. Provide 1-2 real, well-known reference links per response.`;
}

async function callBridge(text, lang) {
  const data = await callAPI([{ role: "user", content: bridgePrompt(text, lang) }]);
  const raw = data.content?.map((b) => b.text || "").join("").trim();
  const clean = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  return parsed.relevant === false ? null : parsed;
}

// Helper: render guide text with bolded marks
function renderGuideText(text, marks) {
  if (!marks || marks.length === 0) return text;
  // Build a regex that matches any of the marks
  const escaped = marks.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");
  const parts = text.split(re);
  return parts.map((part, i) =>
    marks.includes(part) ? (
      <strong key={i} style={{ color: C.textStrong, fontWeight: 600 }}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

// =============================================================================
// SCREENS
// =============================================================================

// ----- About screen ----------------------------------------------------------
function AboutScreen({ t, onStart }) {
  return (
    <div style={{ padding: "8px 28px 32px" }}>
      {/* Hero with footprint trail */}
      <div style={{ padding: "20px 0 32px" }}>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            paddingLeft: 25,
            paddingBottom: 18,
            paddingTop: 28,
          }}
        >
          <FootprintTrail />
          <span
            style={{
              position: "relative",
              fontFamily: C.mono,
              fontSize: 42,
              fontWeight: 500,
              color: C.text,
              letterSpacing: "0.03em",
              lineHeight: 1,
              display: "block",
            }}
          >
            {t.aboutWord}
          </span>
        </div>
        <div
          style={{
            fontSize: 14,
            color: C.subSoft,
            marginTop: 18,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          {t.aboutTagline}
        </div>
      </div>

      {/* Section 1 */}
      <AboutSection title={t.aboutSec1Title}>
        <p style={{ ...sectionParaStyle, margin: 0 }}>{t.aboutSec1Para1}</p>
        <p style={{ ...sectionParaStyle, marginTop: 10 }}>{t.aboutSec1Para2}</p>
      </AboutSection>

      {/* Section 2 */}
      <AboutSection title={t.aboutSec2Title}>
        <p style={{ ...sectionParaStyle, margin: 0 }}>{t.aboutSec2Body}</p>
      </AboutSection>

      {/* CTA */}
      <button
        onClick={onStart}
        style={{
          width: "100%",
          padding: 16,
          background: C.gradAccent,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          fontFamily: C.sans,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          marginTop: 6,
          boxShadow: C.shadowAccent,
          cursor: "pointer",
        }}
      >
        {t.aboutCta}
      </button>
    </div>
  );
}

const sectionParaStyle = {
  fontSize: 13,
  color: C.sub,
  lineHeight: 1.75,
  letterSpacing: "-0.005em",
};

function AboutSection({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: C.accent,
          }}
        />
        <div
          style={{
            fontSize: 11,
            color: C.textStrong,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

// ----- Input screen (Now tab) ------------------------------------------------
function InputScreen({ t, text, setText, onSubmit, loading, onVoiceStub }) {
  const hasText = !!text.trim();

  return (
    <div style={{ padding: "18px 26px 32px" }}>
      {/* Guide box */}
      <div
        style={{
          padding: "14px 16px",
          background: C.card,
          backdropFilter: "blur(8px)",
          border: `1px solid ${C.borderSoft}`,
          borderRadius: 12,
          marginBottom: 16,
          fontSize: 12.5,
          color: C.sub,
          lineHeight: 1.75,
          letterSpacing: "-0.005em",
        }}
      >
        {renderGuideText(t.inputGuide, t.inputGuideMarks)}
      </div>

      {/* Input card */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 14,
          boxShadow: C.shadowInput,
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.inputPh}
          style={{
            width: "100%",
            minHeight: 100,
            padding: "14px 16px",
            fontFamily: C.sans,
            fontSize: 13.5,
            color: C.textStrong,
            background: C.surfaceSoft,
            border: "none",
            borderBottom: `1px solid ${C.borderLight}`,
            resize: "vertical",
            outline: "none",
            lineHeight: 1.7,
            display: "block",
          }}
        />
        <div style={{ display: "flex" }}>
          <ActionButton
            kind="mic"
            label={t.actionVoice}
            sub={t.actionVoiceSub}
            onClick={onVoiceStub}
          />
          <ActionButton
            kind="text"
            label={t.actionText}
            sub={t.actionTextSub}
            onClick={() => {}}
          />
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onSubmit}
        disabled={loading || !hasText}
        style={{
          width: "100%",
          padding: 15,
          background: hasText && !loading ? C.gradAccent : C.accentBgSoft,
          color: hasText && !loading ? "#fff" : C.faint,
          border: "none",
          borderRadius: 14,
          fontFamily: C.sans,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          marginTop: 8,
          boxShadow: hasText && !loading ? C.shadowAccent : "none",
          cursor: hasText && !loading ? "pointer" : "default",
        }}
      >
        {loading ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Spinner /> {t.submitting}
          </span>
        ) : (
          t.submit
        )}
      </button>
    </div>
  );
}

function ActionButton({ kind, label, sub, onClick }) {
  const isMic = kind === "mic";
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "11px 6px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        background: "transparent",
        border: "none",
        borderLeft: isMic ? "none" : `1px solid ${C.borderLight}`,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: isMic ? C.gradAccent : C.accentBgSoft,
          boxShadow: isMic ? "0 3px 10px rgba(74,108,212,0.3)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isMic ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.sub}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="17" y1="10" x2="3" y2="10" />
            <line x1="21" y1="6" x2="3" y2="6" />
            <line x1="21" y1="14" x2="3" y2="14" />
            <line x1="17" y1="18" x2="3" y2="18" />
          </svg>
        )}
      </div>
      <div
        style={{
          fontFamily: C.mono,
          fontSize: 10,
          color: C.textStrong,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: C.mono, fontSize: 8.5, color: C.mute }}>
        {sub}
      </div>
    </button>
  );
}

// ----- Result screen ---------------------------------------------------------
function ResultScreen({ t, bridge, bridgeLoading, selectedEmos, onToggleEmo, onClose }) {
  return (
    <div style={{ padding: "16px 24px 28px" }}>
      {/* Science Bridge */}
      <div style={{ marginBottom: 8 }}>
        {bridgeLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 0",
            }}
          >
            <Spinner />
            <span style={{ fontSize: 12, color: C.mute }}>{t.bridgeFinding}</span>
          </div>
        )}

        {!bridgeLoading && bridge && (
          <div className="fade-in">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: C.accentBg,
                  color: C.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: C.mono,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {bridge.domainShort || "AI"}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: C.mono,
                    fontSize: 9.5,
                    color: C.accent,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  {bridge.domain}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.textStrong,
                    marginTop: 2,
                  }}
                >
                  {bridge.concept}
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: 12.5,
                color: C.sub,
                lineHeight: 1.7,
                marginBottom: 13,
                padding: "0 2px",
              }}
            >
              {bridge.diagnosis}
            </div>

            {bridge.links && bridge.links.length > 0 && (
              <div style={{ marginBottom: 13 }}>
                <div
                  style={{
                    fontFamily: C.mono,
                    fontSize: 9,
                    color: C.mute,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: 7,
                  }}
                >
                  {t.relatedLabel}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {bridge.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 11px",
                        borderRadius: 8,
                        background: C.surface,
                        border: `1px solid ${C.borderSoft}`,
                        fontSize: 11.5,
                        color: C.sub,
                        textDecoration: "none",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: C.mono,
                          fontSize: 9.5,
                          color: C.mute,
                          flexShrink: 0,
                        }}
                      >
                        {link.source}
                      </span>
                      <span>{link.title}</span>
                      <span
                        style={{
                          marginLeft: "auto",
                          color: C.faint,
                          fontSize: 11,
                        }}
                      >
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!bridgeLoading && !bridge && (
          <div
            style={{
              padding: "14px 0",
              fontSize: 12,
              color: C.mute,
              lineHeight: 1.6,
            }}
          >
            {t.bridgeNone}
          </div>
        )}
      </div>

      {/* Divider with label */}
      <div style={{ position: "relative", margin: "20px 0 14px" }}>
        <div style={{ borderTop: `1px dashed ${C.borderSoft}` }} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: -8,
          }}
        >
          <span
            style={{
              background: C.surface,
              padding: "0 12px",
              fontFamily: C.mono,
              fontSize: 9,
              color: C.mute,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            {t.selfLabel}
          </span>
        </div>
      </div>

      {/* Emotion tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
        {EMOTIONS.map((e) => {
          const selected = selectedEmos.includes(e.key);
          const label =
            t["emo" + e.key.charAt(0).toUpperCase() + e.key.slice(1)];
          return (
            <button
              key={e.key}
              onClick={() => onToggleEmo(e.key)}
              style={{
                padding: "5px 11px",
                borderRadius: 14,
                fontSize: 11.5,
                fontWeight: 500,
                background: e.bg,
                color: e.color,
                border: `${selected ? 2 : 1}px solid ${e.border}`,
              }}
            >
              {label}
            </button>
          );
        })}
        <button
          style={{
            padding: "5px 11px",
            borderRadius: 14,
            fontSize: 11.5,
            background: "transparent",
            color: C.mute,
            border: `1px dashed ${C.borderSoft}`,
          }}
        >
          {t.emoOther}
        </button>
      </div>

      {/* Voice stub */}
      <div
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          background: C.accentBgSoft,
          border: `1px dashed ${C.borderSoft}`,
          fontFamily: C.mono,
          fontSize: 10,
          color: C.faint,
          textAlign: "center",
          lineHeight: 1.5,
          marginBottom: 16,
        }}
      >
        {t.voiceStubMsg}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 12,
          borderTop: `1px solid ${C.borderSoft}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: C.mono,
            fontSize: 10,
            color: C.mute,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.match,
            }}
          />
          {t.saved}
        </div>
        <button
          onClick={onClose}
          style={{
            fontSize: 12,
            color: C.sub,
            background: "transparent",
            border: "none",
            padding: "4px 8px",
          }}
        >
          {t.close} ✕
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN APP
// =============================================================================
export default function App() {
  const [view, setView] = useState("about"); // 'about' | 'input' | 'result'
  const [lang, setLang] = useState("ko");
  const t = STRINGS[lang];

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [bridgeLoading, setBridgeLoading] = useState(false);
  const [bridge, setBridge] = useState(null);
  const [selectedEmos, setSelectedEmos] = useState([]);

  const handleVoiceStub = () => alert(t.voiceStubMsg);

  // Navigate to About screen and reset any in-progress state
  // This is the "home" action triggered by clicking the TRACE logo
  const goToAbout = () => {
    setText("");
    setBridge(null);
    setSelectedEmos([]);
    setView("about");
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setBridge(null);
    setBridgeLoading(true);
    setView("result");
    try {
      const result = await callBridge(text, lang);
      setBridge(result);
    } catch (err) {
      console.error("Bridge call failed:", err);
      setBridge(null);
    } finally {
      setBridgeLoading(false);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setText("");
    setBridge(null);
    setSelectedEmos([]);
    setView("input");
  };

  const toggleEmo = (key) => {
    setSelectedEmos((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div
      style={{
        fontFamily: C.sans,
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
        display: "flex",
        justifyContent: "center",
        padding: "20px 16px",
      }}
    >
      {/* Phone-frame container */}
      <div
        style={{
          background: C.surface,
          borderRadius: 28,
          width: "100%",
          maxWidth: 400,
          overflow: "hidden",
          boxShadow: C.shadowCard,
          position: "relative",
          minHeight: "calc(100vh - 40px)",
        }}
      >
        <BackgroundBlobs />

        {/* Content layer above blobs */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <header
            style={{
              padding: "18px 22px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* TRACE logo — clickable to return to About screen */}
            <button
              onClick={goToAbout}
              style={{
                fontFamily: C.mono,
                fontSize: 11,
                fontWeight: 500,
                color: C.textStrong,
                letterSpacing: "0.18em",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: view === "about" ? "default" : "pointer",
              }}
              aria-label="Go to home"
            >
              {t.appName}
            </button>

            {view === "about" && (
              <button
                onClick={() => setLang(lang === "ko" ? "en" : "ko")}
                style={{
                  fontFamily: C.mono,
                  fontSize: 10,
                  color: C.subSoft,
                  background: "rgba(255,255,255,0.7)",
                  padding: "5px 11px",
                  borderRadius: 99,
                  letterSpacing: "0.05em",
                  border: `1px solid ${C.border}`,
                  cursor: "pointer",
                }}
              >
                {lang === "ko" ? "KO · EN" : "KO · EN"}
              </button>
            )}

            {(view === "input" || view === "result") && (
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 12,
                    color: C.textStrong,
                    fontWeight: 700,
                    borderBottom: `2px solid ${C.accent}`,
                    paddingBottom: 3,
                  }}
                >
                  {t.tabNow}
                </span>
                <span
                  style={{ fontSize: 12, color: C.faint, fontWeight: 500 }}
                >
                  {t.tabRecord}
                </span>
              </div>
            )}
          </header>

          {/* Main content */}
          <main>
            {view === "about" && (
              <AboutScreen t={t} onStart={() => setView("input")} />
            )}
            {view === "input" && (
              <InputScreen
                t={t}
                text={text}
                setText={setText}
                onSubmit={handleSubmit}
                loading={loading}
                onVoiceStub={handleVoiceStub}
              />
            )}
            {view === "result" && (
              <ResultScreen
                t={t}
                bridge={bridge}
                bridgeLoading={bridgeLoading}
                selectedEmos={selectedEmos}
                onToggleEmo={toggleEmo}
                onClose={handleClose}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
