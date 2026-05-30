import { useState, useRef, useEffect } from "react";

// =============================================================================
// Trace v2 — Stage 1
// About screen, text input, result screen (Science Bridge + body status)
// Voice input and biosignal measurement (Stage 2) are stubbed for now.
// =============================================================================

// ----- Inject Google Fonts ---------------------------------------------------
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

// ----- Design tokens ---------------------------------------------------------
const C = {
  bg:           "#f7f7f5",
  surface:      "#ffffff",
  border:       "#e4e4e0",
  borderLight:  "#eeeeea",
  text:         "#18181a",
  sub:          "#555555",
  mute:         "#888888",
  faint:        "#aaaaaa",
  accent:       "#1a56db",
  accentBg:     "#e0f2fe",
  accentBorder: "#7dd3fc",
  accentDark:   "#0369a1",
  match:        "#86efac",
  matchDark:    "#15803d",
  matchBg:      "#dcfce7",
  mismatch:     "#f97316",
  mismatchDark: "#9a3412",
  highlight:    "#fef3c7",
  highlightBd:  "#fcd34d",
  warn:         "#92400e",
  danger:       "#dc2626",
  mono:         "'DM Mono',monospace",
  sans:         "'Outfit','Apple SD Gothic Neo','Malgun Gothic',sans-serif",
};

// ----- Localized text (Korean + English) ------------------------------------
// Language is selected at runtime; default is Korean
const STRINGS = {
  ko: {
    appName:     "TRACE",
    version:     "v2",
    tabNow:      "지금",
    tabRecord:   "기록",
    // About screen — paragraph style with section titles
    aboutWord:        "trace.",
    aboutTagline:     "학습하는 순간을 기록하는 앱",
    aboutSec1Title:   "무엇을 하는 앱인가요",
    aboutSec1Para1:   "공부나 작업 중에 막히거나 떠오른 순간을 글이나 말로 기록합니다. 입력한 내용에서 관련된 과학·기술 개념을 찾아주고, 다음에 무엇을 시도해볼지 단서를 보여줍니다.",
    aboutSec1Para2:   "말하기를 선택하면 카메라와 마이크로 심박수와 음성 톤을 측정합니다. 본인의 인지-정서 상태를 이해하고 패턴을 파악할 수 있도록 도와줍니다.",
    aboutSec2Title:   "데이터는 어떻게 되나요",
    aboutSec2Body:    "모든 기록과 측정값은 본인 기기에만 저장되며, 외부로 전송되지 않습니다.",
    aboutCta:         "기록 시작하기",
    // Input — longer guidance line
    inputGuide:       "지금 하고 있는 작업, 막힌 부분이나 떠오르는 의문, 그리고 현재 상태를 적거나 말해 주세요. 사이언스 브릿지가 힌트를 제공하고 바이오센서와 텍스트 분석이 정서 상태를 알려드립니다.",
    inputPh:          "여기에 적어주세요...",
    actionVoice:      "말하기",
    actionVoiceSub:   "카메라·마이크 측정",
    actionText:       "텍스트",
    actionTextSub:    "글로 입력",
    // Submit
    submit:           "기록하기",
    submitting:       "분석 중...",
    // Result
    resultHeader:     "결과",
    relatedLabel:     "자세히 알아보기",
    selfLabel:        "본인 상태",
    saved:            "기록 저장됨",
    close:            "닫기",
    bridgeNone:       "이 기록에서 연결할 과학 개념을 찾지 못했습니다.",
    bridgeFinding:    "개념 연결 찾는 중...",
    diagPrefix:       "이 상황에서",
    // Body
    emoStuck:         "막힘/답답함",
    emoAnxious:       "불안/긴장",
    emoConfused:      "혼란/의문",
    emoCurious:       "궁금/탐색",
    emoUnstuck:       "이해됨",
    emoOther:         "+ 직접 입력",
    bodyHrLabel:      "심박수",
    bodyVoiceLabel:   "음성 톤",
    matchLabel:       "신호 일치",
    matchText:        "두 신호가 같은 방향. 신뢰도 높음.",
    mismatchLabel:    "신호 불일치",
    mismatchText:     "두 신호가 다른 방향을 가리킵니다.",
    // Voice stage 2 stub
    voiceStubMsg:     "음성 입력은 다음 단계에서 추가됩니다.",
  },
  en: {
    appName:     "TRACE",
    version:     "v2",
    tabNow:      "Now",
    tabRecord:   "Record",
    aboutWord:        "trace.",
    aboutTagline:     "An app to log your learning moments",
    aboutSec1Title:   "What it does",
    aboutSec1Para1:   "Log moments while you're studying or working — stuck points, ideas, anything that comes up — by typing or speaking. Trace finds related science or technical concepts and suggests what to look into next.",
    aboutSec1Para2:   "If you choose to speak, your camera and microphone measure heart rate and voice tone. This helps you understand your cognitive-emotional state and notice patterns over time.",
    aboutSec2Title:   "About your data",
    aboutSec2Body:    "All entries and measurements stay on your device. Nothing is sent anywhere.",
    aboutCta:         "Start recording",
    inputGuide:       "Tell us what you're working on, what's stuck, what you're wondering, and how you feel. The Science Bridge will offer hints while biosensors and text analysis reflect your emotional state.",
    inputPh:          "Type here...",
    actionVoice:      "Speak",
    actionVoiceSub:   "Camera·mic measure",
    actionText:       "Type",
    actionTextSub:    "Write it out",
    submit:           "Record",
    submitting:       "Analyzing...",
    resultHeader:     "Result",
    relatedLabel:     "Learn more",
    selfLabel:        "Your state",
    saved:            "Entry saved",
    close:            "Close",
    bridgeNone:       "No science concept connection found for this entry.",
    bridgeFinding:    "Finding concept connections...",
    diagPrefix:       "In this situation,",
    emoStuck:         "Stuck",
    emoAnxious:       "Anxious",
    emoConfused:      "Confused",
    emoCurious:       "Curious",
    emoUnstuck:       "Got it",
    emoOther:         "+ Other",
    bodyHrLabel:      "Heart rate",
    bodyVoiceLabel:   "Voice tone",
    matchLabel:       "Signals match",
    matchText:        "Both signals point in the same direction.",
    mismatchLabel:    "Signals mismatch",
    mismatchText:     "Two signals point in different directions.",
    voiceStubMsg:     "Voice input is coming in the next stage.",
  },
};

// ----- Emotion tag colors ----------------------------------------------------
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
  body { margin: 0; }
  button { font-family: ${C.sans}; cursor: pointer; }
  textarea:focus, input:focus { outline: none; border-color: ${C.text} !important; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .fade-in { animation: fadeIn 0.25s ease; }
`;
document.head.appendChild(cssEl);

// ----- Spinner ---------------------------------------------------------------
function Spinner({ size = 12 }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: `2px solid ${C.border}`,
        borderTopColor: C.text,
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

// Science Bridge prompt: ask Claude for concept + diagnosis + reference links
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

// =============================================================================
// SCREENS
// =============================================================================

// ----- About screen ----------------------------------------------------------
function AboutScreen({ t, onStart }) {
  return (
    <div style={{ padding: "0 22px", maxWidth: 520, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ padding: "28px 0 22px", textAlign: "center" }}>
        <div style={{ fontFamily: C.mono, fontSize: 32, fontWeight: 600, color: C.text, letterSpacing: "0.06em" }}>
          {t.aboutWord}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginTop: 10, lineHeight: 1.6 }}>
          {t.aboutTagline}
        </div>
      </div>

      <div style={{ height: 1, background: C.borderLight, margin: "4px 0 22px" }} />

      {/* Section 1: What it does */}
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            fontFamily: C.mono,
            fontSize: 10,
            color: C.accentDark,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
            fontWeight: 600,
          }}
        >
          {t.aboutSec1Title}
        </div>
        <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.75, margin: "0 0 12px" }}>
          {t.aboutSec1Para1}
        </p>
        <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.75, margin: 0 }}>
          {t.aboutSec1Para2}
        </p>
      </div>

      {/* Section 2: Data */}
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            fontFamily: C.mono,
            fontSize: 10,
            color: C.accentDark,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
            fontWeight: 600,
          }}
        >
          {t.aboutSec2Title}
        </div>
        <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.75, margin: 0 }}>
          {t.aboutSec2Body}
        </p>
      </div>

      <button
        onClick={onStart}
        style={{
          marginTop: 8,
          width: "100%",
          padding: "13px",
          background: C.text,
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {t.aboutCta}
      </button>
    </div>
  );
}

// ----- Now tab: input selection screen ---------------------------------------
function InputScreen({ t, text, setText, onSubmit, loading, onVoiceStub }) {
  return (
    <div style={{ padding: "0 20px", maxWidth: 480, margin: "0 auto" }}>
      <div
        style={{
          fontSize: 12.5,
          color: C.sub,
          marginBottom: 14,
          lineHeight: 1.7,
          padding: "12px 14px",
          background: "#f9f9f7",
          borderRadius: 8,
          border: `1px solid ${C.borderLight}`,
        }}
      >
        {t.inputGuide}
      </div>

      <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 4, background: C.surface }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.inputPh}
          style={{
            width: "100%",
            minHeight: 110,
            padding: "12px 14px",
            fontFamily: C.sans,
            fontSize: 13,
            color: C.text,
            background: "#fafafa",
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
            icon="mic"
            label={t.actionVoice}
            sub={t.actionVoiceSub}
            onClick={onVoiceStub}
            active
          />
          <ActionButton
            icon="text"
            label={t.actionText}
            sub={t.actionTextSub}
            onClick={() => {}}
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !text.trim()}
        style={{
          width: "100%",
          marginTop: 14,
          padding: 13,
          background: !text.trim() || loading ? C.border : C.text,
          color: !text.trim() || loading ? C.mute : "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Spinner /> {t.submitting}
          </span>
        ) : (
          t.submit
        )}
      </button>
    </div>
  );
}

function ActionButton({ icon, label, sub, onClick, active }) {
  const isMic = icon === "mic";
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "10px 6px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        border: "none",
        borderLeft: isMic ? "none" : `1px solid ${C.borderLight}`,
        background: "transparent",
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: active ? C.text : "#f0f0ee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isMic ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "#555"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="17" y1="10" x2="3" y2="10" />
            <line x1="21" y1="6" x2="3" y2="6" />
            <line x1="21" y1="14" x2="3" y2="14" />
            <line x1="17" y1="18" x2="3" y2="18" />
          </svg>
        )}
      </div>
      <div style={{ fontFamily: C.mono, fontSize: 9.5, color: C.sub }}>{label}</div>
      <div style={{ fontFamily: C.mono, fontSize: 8.5, color: C.faint }}>{sub}</div>
    </button>
  );
}

// ----- Result screen: Science Bridge + Your state ----------------------------
function ResultScreen({ t, text, bridge, bridgeLoading, selectedEmos, onToggleEmo, onClose }) {
  return (
    <div style={{ padding: "0 16px", maxWidth: 480, margin: "0 auto" }}>
      {/* Science Bridge */}
      <div style={{ marginBottom: 8 }}>
        {bridgeLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 0" }}>
            <Spinner />
            <span style={{ fontSize: 12, color: C.mute }}>{t.bridgeFinding}</span>
          </div>
        )}

        {!bridgeLoading && bridge && (
          <div className="fade-in">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: C.accentBg,
                  color: C.accentDark,
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
                <div style={{ fontFamily: C.mono, fontSize: 9.5, color: C.accentDark, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {bridge.domain}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginTop: 2 }}>
                  {bridge.concept}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.7, marginBottom: 13, padding: "0 2px" }}>
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
                        borderRadius: 7,
                        background: "#f9f9f7",
                        border: `1px solid ${C.borderLight}`,
                        fontSize: 11.5,
                        color: C.sub,
                        textDecoration: "none",
                      }}
                    >
                      <span style={{ fontFamily: C.mono, fontSize: 9.5, color: C.mute, flexShrink: 0 }}>
                        {link.source}
                      </span>
                      <span>{link.title}</span>
                      <span style={{ marginLeft: "auto", color: C.faint, fontSize: 11 }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!bridgeLoading && !bridge && (
          <div style={{ padding: "14px 0", fontSize: 12, color: C.mute, lineHeight: 1.6 }}>
            {t.bridgeNone}
          </div>
        )}
      </div>

      {/* Divider with label */}
      <div style={{ position: "relative", margin: "20px 0 14px" }}>
        <div style={{ borderTop: `1px dashed ${C.border}` }} />
        <div style={{ display: "flex", justifyContent: "center", marginTop: -8 }}>
          <span
            style={{
              background: C.bg,
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
          const label = t["emo" + e.key.charAt(0).toUpperCase() + e.key.slice(1)];
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
            border: `1px dashed ${C.border}`,
          }}
        >
          {t.emoOther}
        </button>
      </div>

      {/* Body signal placeholder (Stage 2) */}
      <div
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          background: "#fafaf8",
          border: `1px dashed ${C.border}`,
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
          borderTop: `1px solid ${C.borderLight}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: C.mono, fontSize: 10, color: C.mute }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.match }} />
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
  // 'about' | 'input' | 'result'
  const [view, setView] = useState("about");
  const [lang, setLang] = useState("ko");
  const t = STRINGS[lang];

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [bridgeLoading, setBridgeLoading] = useState(false);
  const [bridge, setBridge] = useState(null);
  const [selectedEmos, setSelectedEmos] = useState([]);

  // Voice stub message handler
  const handleVoiceStub = () => {
    alert(t.voiceStubMsg);
  };

  // Submit entry: trigger Science Bridge analysis, then show result
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

  // Close result screen and reset
  const handleClose = () => {
    setText("");
    setBridge(null);
    setSelectedEmos([]);
    setView("input");
  };

  // Toggle emotion tag selection
  const toggleEmo = (key) => {
    setSelectedEmos((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div style={{ fontFamily: C.sans, background: C.bg, minHeight: "100vh", color: C.text }}>
      {/* Header */}
      <header
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          padding: "14px 20px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: C.mono, fontSize: 14, fontWeight: 600, letterSpacing: "0.05em" }}>
            {t.appName}
          </span>
          {view === "about" && (
            <span style={{ fontSize: 10, color: C.faint }}>{t.version}</span>
          )}
          {view === "result" && (
            <span style={{ fontSize: 11, color: C.mute }}>{t.resultHeader}</span>
          )}
        </div>

        {/* Tabs visible only when not in 'about' */}
        {view !== "about" && (
          <div style={{ display: "flex", gap: 16 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.text,
                borderBottom: `2px solid ${C.text}`,
                paddingBottom: 2,
              }}
            >
              {t.tabNow}
            </span>
            <span style={{ fontSize: 12, color: C.faint }}>{t.tabRecord}</span>
          </div>
        )}

        {/* Language toggle (small, top-right when on about) */}
        {view === "about" && (
          <button
            onClick={() => setLang(lang === "ko" ? "en" : "ko")}
            style={{
              fontFamily: C.mono,
              fontSize: 10,
              color: C.mute,
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 5,
              padding: "3px 8px",
            }}
          >
            {lang === "ko" ? "EN" : "KO"}
          </button>
        )}
      </header>

      <main style={{ padding: "20px 0 40px" }}>
        {view === "about" && <AboutScreen t={t} onStart={() => setView("input")} />}
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
            text={text}
            bridge={bridge}
            bridgeLoading={bridgeLoading}
            selectedEmos={selectedEmos}
            onToggleEmo={toggleEmo}
            onClose={handleClose}
          />
        )}
      </main>
    </div>
  );
}
