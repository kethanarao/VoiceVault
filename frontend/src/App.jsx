import { useState } from 'react';
import axios from 'axios';

// ---- Palette (paper + pencil + one marker + one highlighter) --------
const c = {
  paper: '#FBF6EA',
  paperLine: '#E4DCC4',
  ink: '#2B2A28',
  coral: '#FF6A5B',
  yellow: '#FFD866',
  sky: '#6FA3D8',
  white: '#FFFFFF',
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=IBM+Plex+Mono:wght@400;500&display=swap');`;

const GLOBAL_CSS = `
  .wiggle:hover { transform: rotate(-1deg) translateY(-2px); }
  @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes wave { 0%,100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }
  @keyframes blink { 0%,49% { opacity:1; } 50%,100% { opacity:0; } }
  .bob { animation: bob 1.8s ease-in-out infinite; }
`;

// ---- Hand-drawn icons -------------------------------------------------
const strokeProps = { fill: 'none', stroke: c.ink, strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

const IconMic = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...strokeProps}>
    <path d="M12 2.5c-2 0-3.3 1.4-3.3 3.2v6.1c0 1.8 1.3 3.2 3.3 3.2s3.3-1.4 3.3-3.2V5.7C15.3 3.9 14 2.5 12 2.5z" />
    <path d="M5.5 11c0 3.6 2.9 6.3 6.5 6.3s6.5-2.7 6.5-6.3" />
    <path d="M12 17.3v3.6M8.7 21h6.6" />
  </svg>
);
const IconUpload = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 22} height={p.size || 22} {...strokeProps}>
    <path d="M12 15.5V4M8 8l4-4 4 4" />
    <path d="M4.5 15.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
  </svg>
);
const IconCopy = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 15} height={p.size || 15} {...strokeProps}>
    <path d="M8.5 8.5h9.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5H9a1.5 1.5 0 0 1-1.5-1.5V10a1.5 1.5 0 0 1 1.5-1.5z" />
    <path d="M5.5 15.5H4A1.5 1.5 0 0 1 2.5 14V4.5A1.5 1.5 0 0 1 4 3h9.5A1.5 1.5 0 0 1 15 4.5v1.7" />
  </svg>
);
const IconDownload = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 15} height={p.size || 15} {...strokeProps}>
    <path d="M12 3.5v11M8 11l4 4 4-4" />
    <path d="M4.5 17v2.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V17" />
  </svg>
);
const IconClock = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 15} height={p.size || 15} {...strokeProps}>
    <circle cx="12" cy="12.5" r="8.3" />
    <path d="M12 7.5v5.3l3.6 2" />
    <path d="M9 2.7h6" />
  </svg>
);

// ---- Stick figure mascot ----------------------------------------------
function StickFigure({ pose = 'idle', size = 100 }) {
  return (
    <svg viewBox="0 0 90 110" width={size} height={size * 1.1} {...strokeProps}>
      {/* head */}
      <circle cx="34" cy="20" r="12" />
      {/* face */}
      {pose === 'success' ? (
        <path d="M28 21c1.5 2 8 2 10 0" />
      ) : (
        <>
          <circle cx="30" cy="19" r="1.4" fill={c.ink} />
          <circle cx="38" cy="19" r="1.4" fill={c.ink} />
        </>
      )}
      {/* body */}
      <path d="M34 32v34" />
      {/* legs */}
      {pose === 'success' ? (
        <>
          <path d="M34 66 22 92" />
          <path d="M34 66 46 92" />
        </>
      ) : (
        <>
          <path d="M34 66 24 96" />
          <path d="M34 66 44 96" />
        </>
      )}

      {pose === 'idle' && (
        <>
          <path d="M34 42 18 52" />
          <path d="M34 42 54 36" />
          <rect x="10" y="47" width="9" height="14" rx="3.5" transform="rotate(-18 14 54)" />
        </>
      )}

      {pose === 'listening' && (
        <>
          <path d="M34 42 16 46" />
          <path d="M34 42 52 46" />
          <path d="M20 12a14 14 0 0 1 28 0" />
          <rect x="16" y="10" width="8" height="12" rx="3" />
          <rect x="44" y="10" width="8" height="12" rx="3" />
        </>
      )}

      {pose === 'success' && (
        <>
          <path d="M34 42 14 24" />
          <path d="M34 42 54 24" />
        </>
      )}

      {pose === 'shrug' && (
        <>
          <path d="M34 42 20 30" />
          <path d="M34 42 48 30" />
        </>
      )}

      {pose === 'point' && (
        <>
          <path d="M34 42 60 50" />
          <path d="M34 42 18 50" />
        </>
      )}
    </svg>
  );
}

function SoundWave({ active }) {
  const bars = [10, 22, 16, 26, 12, 20, 14];
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 26 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: h,
            borderRadius: 2,
            background: c.coral,
            transformOrigin: 'bottom',
            animation: active ? `wave ${0.6 + (i % 3) * 0.15}s ease-in-out infinite` : 'none',
            animationDelay: `${i * 70}ms`,
          }}
        />
      ))}
    </div>
  );
}

function SquigglyUnderline({ width = 160, color = c.coral }) {
  return (
    <svg viewBox={`0 0 ${width} 14`} width={width} height={14}>
      <path
        d={`M2 8 Q ${width * 0.15} 1, ${width * 0.3} 7 T ${width * 0.6} 7 T ${width - 2} 7`}
        fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round"
      />
    </svg>
  );
}

// ---- Doodle-styled containers -----------------------------------------
function DoodleCard({ children, rotate = 0, style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{
        background: c.white,
        border: `2.5px solid ${c.ink}`,
        borderRadius: '14px 18px 15px 20px / 18px 14px 20px 15px',
        boxShadow: `4px 4px 0 ${c.ink}`,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function DoodleButton({ children, onClick, disabled, big }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="wiggle"
      style={{
        fontFamily: "'Kalam', cursive",
        fontWeight: 700,
        fontSize: big ? 20 : 15,
        color: c.ink,
        background: disabled ? '#EFE9D8' : c.yellow,
        border: `2.5px solid ${c.ink}`,
        borderRadius: '10px 14px 10px 14px / 14px 10px 14px 10px',
        boxShadow: disabled ? 'none' : `3.5px 3.5px 0 ${c.ink}`,
        padding: big ? '12px 26px' : '8px 14px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'transform 0.15s',
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}
    >
      {children}
    </button>
  );
}

function IconButton({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 30, height: 30, borderRadius: '50%',
        border: `2px solid ${c.ink}`, background: c.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function SpeechBubble({ children }) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          border: `2.5px solid ${c.ink}`, borderRadius: 18, background: c.white,
          padding: '10px 16px', fontFamily: "'Kalam', cursive", fontSize: 15, color: c.ink,
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: 'absolute', bottom: -9, left: 26, width: 16, height: 16,
          background: c.white, borderRight: `2.5px solid ${c.ink}`, borderBottom: `2.5px solid ${c.ink}`,
          transform: 'rotate(45deg)',
        }}
      />
    </div>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timedTranscript, setTimedTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [info, setInfo] = useState('');
  const [modelSize, setModelSize] = useState('base');
  const [summaryStyle, setSummaryStyle] = useState('meeting');
  const [copied, setCopied] = useState('');

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const transcribeRes = await axios.post('http://localhost:8000/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { language: 'auto' },
      });
      setTranscript(transcribeRes.data.text);
      setTimedTranscript(
        transcribeRes.data.segments.map(s => `[${s.start.toFixed(1)}s - ${s.end.toFixed(1)}s] ${s.text}`).join('\n')
      );
      setInfo(`${transcribeRes.data.language.toUpperCase()} · ${transcribeRes.data.duration}s`);

      const summaryRes = await axios.post('http://localhost:8000/summarize', {
        transcript: transcribeRes.data.text,
        style: summaryStyle,
      });
      setSummary(summaryRes.data.summary);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 1400);
  };

  const downloadText = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen" style={{ background: c.paper, fontFamily: "'Kalam', cursive" }}>
      <style>{FONTS + GLOBAL_CSS}</style>
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-1">
          <StickFigure pose={loading ? 'listening' : summary ? 'success' : 'idle'} size={64} />
          <div>
            <h1 style={{ fontSize: 40, fontWeight: 700, color: c.ink, lineHeight: 1 }}>VoiceVault</h1>
            <SquigglyUnderline width={190} />
          </div>
        </div>
        <p style={{ color: c.ink, opacity: 0.65, fontSize: 16, marginBottom: 34, marginLeft: 4 }}>
          scribble in your audio, get a tidy summary back
        </p>

        {/* Upload + controls */}
        <DoodleCard rotate={-0.4} style={{ padding: 26, marginBottom: 26 }}>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
              <p style={{ fontSize: 15, color: c.ink, marginBottom: 8 }}>drop your file here! ✎</p>
              <label
                className="wiggle"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 6, padding: '26px 10px', cursor: 'pointer',
                  border: `2.5px dashed ${c.ink}`, borderRadius: '16px 10px 16px 10px',
                  background: c.paper, transition: 'transform 0.15s',
                }}
              >
                <input type="file" accept="audio/*,video/*" onChange={e => setFile(e.target.files[0])} className="hidden" />
                <IconUpload />
                <span style={{ fontSize: 14.5, color: c.ink, textAlign: 'center' }}>
                  {file ? file.name : 'click to browse'}
                </span>
                <span style={{ fontSize: 11.5, color: c.ink, opacity: 0.55 }}>mp3 · wav · m4a · mp4</span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label style={{ fontSize: 13.5, color: c.ink, opacity: 0.8, display: 'block', marginBottom: 4 }}>model size</label>
                <select
                  value={modelSize} onChange={e => setModelSize(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 10px', fontFamily: "'Kalam', cursive", fontSize: 14.5,
                    border: `2px solid ${c.ink}`, borderRadius: 10, background: c.white, color: c.ink,
                  }}
                >
                  <option value="base">base — fast &amp; light</option>
                  <option value="small">small — good balance</option>
                  <option value="medium">medium — extra careful</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13.5, color: c.ink, opacity: 0.8, display: 'block', marginBottom: 4 }}>summary style</label>
                <select
                  value={summaryStyle} onChange={e => setSummaryStyle(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 10px', fontFamily: "'Kalam', cursive", fontSize: 14.5,
                    border: `2px solid ${c.ink}`, borderRadius: 10, background: c.white, color: c.ink,
                  }}
                >
                  <option value="meeting">meeting notes</option>
                  <option value="bullet">bullet points</option>
                  <option value="action_items">action items only</option>
                  <option value="detailed">the whole story</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <DoodleButton big onClick={handleUpload} disabled={loading || !file}>
              <IconMic size={20} />
              {loading ? 'listening…' : 'transcribe it!'}
            </DoodleButton>
            {loading && <SoundWave active />}
          </div>
        </DoodleCard>

        {info && (
          <div className="flex items-center gap-2 mb-6" style={{ color: c.ink, fontSize: 14.5 }}>
            <IconClock /> {info}
          </div>
        )}

        {/* Transcript — notebook page */}
        {transcript && (
          <DoodleCard rotate={0.3} style={{ marginBottom: 26, overflow: 'hidden' }}>
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <h3 style={{ fontSize: 20, fontWeight: 700, color: c.ink }}>the full transcript</h3>
              <div className="flex gap-2">
                <IconButton title="Copy" onClick={() => copyToClipboard(transcript, 'transcript')}><IconCopy /></IconButton>
                <IconButton title="Download" onClick={() => downloadText(transcript, 'transcript.txt')}><IconDownload /></IconButton>
              </div>
            </div>
            <div
              style={{
                position: 'relative', maxHeight: 380, overflow: 'auto', padding: '14px 24px 24px 44px',
                background: `repeating-linear-gradient(${c.white}, ${c.white} 27px, ${c.paperLine} 28px)`,
              }}
            >
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 28, width: 2, background: c.coral, opacity: 0.5 }} />
              <p style={{ fontSize: 16, lineHeight: '28px', color: c.ink, whiteSpace: 'pre-wrap' }}>{transcript}</p>
            </div>
            {copied === 'transcript' && <Toast />}
          </DoodleCard>
        )}

        {/* Timestamps — sticky note */}
        {timedTranscript && (
          <div style={{ transform: 'rotate(-1.2deg)', marginBottom: 30 }}>
            <DoodleCard rotate={0} style={{ background: c.yellow, padding: 20, boxShadow: `4px 4px 0 ${c.ink}` }}>
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ fontSize: 17, fontWeight: 700, color: c.ink }}>timestamps</h3>
                <IconButton title="Copy" onClick={() => copyToClipboard(timedTranscript, 'timed')}><IconCopy /></IconButton>
              </div>
              <div style={{ maxHeight: 220, overflow: 'auto' }}>
                <pre style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: c.ink, whiteSpace: 'pre-wrap', lineHeight: '20px' }}>
                  {timedTranscript}
                </pre>
              </div>
            </DoodleCard>
          </div>
        )}

        {/* Summary — pinned card */}
        {summary && (
          <div style={{ position: 'relative', marginBottom: 30 }}>
            <div style={{
              position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
              width: 16, height: 16, borderRadius: '50%', background: c.coral, border: `2px solid ${c.ink}`, zIndex: 2,
            }} />
            <DoodleCard rotate={-0.5} style={{ padding: 26 }}>
              <div className="flex items-center gap-3 mb-4">
                <StickFigure pose="success" size={40} />
                <h3 style={{ fontSize: 20, fontWeight: 700, color: c.ink }}>here's the gist</h3>
                <div style={{ marginLeft: 'auto' }}>
                  <IconButton title="Copy" onClick={() => copyToClipboard(summary, 'summary')}><IconCopy /></IconButton>
                </div>
              </div>
              <p style={{ fontSize: 16.5, lineHeight: '27px', color: c.ink, whiteSpace: 'pre-wrap' }}>{summary}</p>
            </DoodleCard>
          </div>
        )}

        {/* Empty state */}
        {!transcript && !loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <StickFigure pose="shrug" size={90} />
            <SpeechBubble>nothing here yet — upload something!</SpeechBubble>
          </div>
        )}

        <div className="flex justify-center mt-16 mb-4" style={{ opacity: 0.5 }}>
          <SquigglyUnderline width={100} color={c.ink} />
        </div>
        <p style={{ textAlign: 'center', fontSize: 12.5, color: c.ink, opacity: 0.5 }}>made with a pencil, by Kethana</p>
      </div>
    </div>
  );
}

function Toast() {
  return (
    <div style={{
      position: 'absolute', top: 14, right: 60, background: c.ink, color: c.paper,
      padding: '4px 10px', borderRadius: 8, fontSize: 12,
    }}>
      copied!
    </div>
  );
}

export default App;