import { projects, specialLandmarks } from '../data/projects';

const themeColors = {
  warm: '#c9863a',
  cool: '#3a8a7a',
  mystical: '#7a5aaa',
  ancient: '#7a6a4a',
};

const Section = ({ landmark }) => {
  const color = themeColors[landmark.theme] || '#c9863a';
  return (
    <div
      className="mb-12 pb-12 border-b last:border-0"
      style={{ borderColor: `${color}30` }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-2 self-stretch rounded-full flex-shrink-0"
          style={{ background: color }}
        />
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-1 font-semibold"
            style={{ color: `${color}cc` }}
          >
            {landmark.subtitle}
          </p>
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: '#1a1208', fontFamily: '"Georgia", serif' }}
          >
            {landmark.name}
          </h2>
          <p className="text-base leading-relaxed mb-4" style={{ color: '#4a3820' }}>
            {landmark.description}
          </p>

          {/* Tech stack */}
          {landmark.tech && landmark.tech[0] !== '???' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {landmark.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}40`,
                    color: color,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Skills */}
          {landmark.skills && (
            <div className="grid grid-cols-4 gap-3 mb-4 max-w-sm">
              {landmark.skills.map((s) => (
                <div
                  key={s.name}
                  className="flex flex-col items-center p-3 rounded-lg"
                  style={{ background: `${color}10`, border: `1px solid ${color}30` }}
                >
                  <span className="text-2xl mb-1">{s.icon}</span>
                  <span className="text-xs text-center" style={{ color: '#4a3820' }}>{s.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Contact */}
          {landmark.contact && (
            <div className="flex flex-col gap-2 mb-4">
              {landmark.contact.email && (
                <a href={`mailto:${landmark.contact.email}`} className="hover:underline" style={{ color }}>
                  ✉️ {landmark.contact.email}
                </a>
              )}
              {landmark.contact.github && (
                <a href={landmark.contact.github} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color }}>
                  ⚙️ GitHub
                </a>
              )}
              {landmark.contact.linkedin && (
                <a href={landmark.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color }}>
                  🔗 LinkedIn
                </a>
              )}
            </div>
          )}

          {/* Link */}
          {landmark.link && landmark.link !== '#' && (
            <a
              href={landmark.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}aa)`,
                color: '#fff8e8',
                boxShadow: `0 4px 15px ${color}40`,
              }}
            >
              View Project →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const TextFallback = () => {
  return (
    <div
      className="min-h-screen overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #f8f0dc 0%, #f0e4c0 100%)', height: '100vh' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(240,228,192,0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(180,140,80,0.2)',
        }}
      >
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: '#1a1208', fontFamily: '"Georgia", serif' }}
          >
            Mohamed SharShar
          </h1>
          <p className="text-xs" style={{ color: 'rgba(100,70,30,0.7)' }}>Full-Stack Developer</p>
        </div>
        <a
          href="/"
          className="text-xs px-4 py-2 rounded-lg transition-all hover:scale-105"
          style={{
            background: 'rgba(180,140,80,0.2)',
            border: '1px solid rgba(180,140,80,0.4)',
            color: '#6a4a20',
            fontFamily: '"Georgia", serif',
          }}
        >
          ⚔ Enter the World
        </a>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* About */}
        <Section landmark={specialLandmarks.find((l) => l.id === 'about')} />

        {/* Projects */}
        <div className="mb-6">
          <h2
            className="text-lg uppercase tracking-widest mb-8"
            style={{ color: 'rgba(100,70,30,0.5)', fontFamily: '"Georgia", serif' }}
          >
            — Projects —
          </h2>
          {projects.map((p) => (
            <Section key={p.id} landmark={p} />
          ))}
        </div>

        {/* Skills */}
        <Section landmark={specialLandmarks.find((l) => l.id === 'skills')} />

        {/* Contact */}
        <Section landmark={specialLandmarks.find((l) => l.id === 'contact')} />
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs" style={{ color: 'rgba(100,70,30,0.4)', fontFamily: '"Georgia", serif' }}>
        <p>Crafted with patience and curiosity.</p>
        <p className="mt-1">© 2025 Mohamed SharShar</p>
      </footer>
    </div>
  );
};

export default TextFallback;
