export const metadata = { title: 'Kalender – Wunderlich Admin' }

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID ?? ''
const embedUrl = CALENDAR_ID
  ? `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=Europe%2FBerlin&hl=de&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&mode=WEEK`
  : ''

export default function KalenderPage() {
  if (!CALENDAR_ID) {
    return (
      <div className="p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-primary mb-4">Kalender</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-sm text-amber-800 space-y-3">
          <p className="font-semibold">Kalender-ID noch nicht konfiguriert.</p>
          <p>So einrichten:</p>
          <ol className="list-decimal list-inside space-y-2 text-amber-700">
            <li>Google Calendar öffnen → Einstellungen → deinen Kalender wählen</li>
            <li>Unter &quot;Zugriffsberechtigungen&quot;: &quot;Öffentlich zugänglich machen&quot; aktivieren</li>
            <li>Die <strong>Kalender-ID</strong> aus dem Abschnitt &quot;Kalender integrieren&quot; kopieren</li>
            <li>In Vercel unter &quot;Environment Variables&quot; den Wert <code className="bg-amber-100 px-1 rounded">GOOGLE_CALENDAR_ID</code> setzen</li>
            <li>Vercel-Deployment neu starten</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Kalender</h1>
          <p className="text-gray-500 text-sm mt-1">Team-Kalender (vollständige Ansicht)</p>
        </div>
        <a
          href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(CALENDAR_ID)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent text-sm hover:underline"
        >
          In Google Calendar öffnen →
        </a>
      </div>
      <div className="flex-1 bg-white rounded-xl border border-gray-100 overflow-hidden min-h-[600px]">
        <iframe
          src={embedUrl}
          style={{ border: 0 }}
          width="100%"
          height="100%"
          className="min-h-[600px]"
          title="Team Kalender"
        />
      </div>
    </div>
  )
}
