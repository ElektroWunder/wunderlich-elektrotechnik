import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import React from 'react'

const C = { primary: '#0F2A4A', accent: '#E8732A', gray: '#6B7280', lightGray: '#F3F4F6', border: '#E5E7EB', white: '#FFFFFF', green: '#16A34A', red: '#DC2626', amber: '#D97706' }

const s = StyleSheet.create({
  page: { fontSize: 9, color: C.primary, paddingTop: 35, paddingBottom: 45, paddingHorizontal: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, borderBottom: '1.5pt solid #0F2A4A', paddingBottom: 12 },
  logo: { fontSize: 14, fontWeight: 'bold' },
  logoSub: { fontSize: 6.5, color: C.gray, marginTop: 1, letterSpacing: 0.8 },
  docTitle: { fontSize: 11, fontWeight: 'bold', textAlign: 'right' },
  docNorm: { fontSize: 7, color: C.gray, textAlign: 'right', marginTop: 2 },
  sectionTitle: { fontSize: 7.5, fontWeight: 'bold', color: C.gray, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 12, marginBottom: 4 },
  card: { backgroundColor: C.lightGray, borderRadius: 3, padding: 8, marginBottom: 2 },
  row2: { flexDirection: 'row', gap: 8 },
  halfBox: { flex: 1 },
  label: { fontSize: 7, color: C.gray, marginBottom: 1.5 },
  value: { fontSize: 8.5, fontWeight: 'bold' },
  valueNormal: { fontSize: 8.5 },
  tableHeader: { flexDirection: 'row', backgroundColor: C.primary, paddingVertical: 4, paddingHorizontal: 6, borderRadius: 2 },
  tableHeaderText: { color: C.white, fontSize: 7, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #E5E7EB', paddingVertical: 5, paddingHorizontal: 6 },
  tableRowAlt: { backgroundColor: '#F9FAFB' },
  checkCell: { width: '55%', fontSize: 8 },
  resultCell: { width: '45%', flexDirection: 'row', justifyContent: 'flex-end' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  badgeGreen: { backgroundColor: '#DCFCE7' },
  badgeRed: { backgroundColor: '#FEE2E2' },
  badgeText: { fontSize: 7, fontWeight: 'bold' },
  skHeader: { flexDirection: 'row', backgroundColor: C.primary, paddingVertical: 4, paddingHorizontal: 3 },
  skHeaderText: { color: C.white, fontSize: 6, fontWeight: 'bold', textAlign: 'center' },
  skRow: { flexDirection: 'row', borderBottom: '0.5pt solid #E5E7EB', paddingVertical: 4, paddingHorizontal: 3, minHeight: 22 },
  skRowAlt: { backgroundColor: '#F9FAFB' },
  skCell: { fontSize: 7, textAlign: 'center' },
  bmHeader: { flexDirection: 'row', backgroundColor: C.lightGray, paddingVertical: 3, paddingHorizontal: 4 },
  bmHeaderText: { fontSize: 7, fontWeight: 'bold', color: C.gray },
  bmRow: { flexDirection: 'row', borderBottom: '0.5pt solid #E5E7EB', paddingVertical: 4, paddingHorizontal: 4 },
  bmCell1: { width: '30%', fontSize: 8 },
  bmCell2: { width: '22%', fontSize: 8 },
  bmCell3: { width: '22%', fontSize: 8 },
  bmCell4: { width: '16%', fontSize: 8 },
  bmCell5: { width: '10%', fontSize: 8, textAlign: 'right' },
  gesamtBox: { marginTop: 10, padding: 10, borderRadius: 3, flexDirection: 'row', alignItems: 'center' },
  gesamtBestanden: { backgroundColor: '#DCFCE7', borderLeft: '3pt solid #16A34A' },
  gesamtMaengel: { backgroundColor: '#FEF3C7', borderLeft: '3pt solid #D97706' },
  gesamtNicht: { backgroundColor: '#FEE2E2', borderLeft: '3pt solid #DC2626' },
  gesamtLabel: { fontSize: 9, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 16, left: 40, right: 40, borderTop: '0.5pt solid #E5E7EB', paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 6, color: C.gray },
})

function fmtDate(d: string) {
  if (!d) return '–'
  try { return new Date(d).toLocaleDateString('de-DE') } catch { return d }
}

interface Stromkreis {
  nr: string; bezeichnung: string; sicherung: string
  schutzleiterR: string; isolationR: string; schleifenimpedanz: string
  kurzschlussstrom: string; rcdNennstrom: string; rcdAusloesezeit: string
  ergebnis: string
}

const SK = { nr: '5%', bez: '18%', sich: '12%', schutz: '9%', isol: '9%', schlei: '10%', kurz: '9%', rcdI: '9%', rcdT: '9%', erg: '10%' }

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const variant = url.searchParams.get('variant') ?? 'klein'
  let data: { form: Record<string, unknown>; betriebsmittel: Record<string, string>[]; stromkreise: Stromkreis[] } = { form: {}, betriebsmittel: [], stromkreise: [] }
  try { data = JSON.parse(url.searchParams.get('data') ?? '{}') } catch { /* ignore */ }

  const f = data.form as Record<string, unknown>
  const bm = data.betriebsmittel ?? []
  const stromkreise: Stromkreis[] = data.stromkreise ?? []

  const checks = [
    { label: 'Sichtprüfung (Zustand, Isolierung, Beschädigungen)', ok: f.sichtpruefungOk },
    { label: 'Isolationswiderstand (≥ 1 MΩ zwischen L/N und PE)', ok: f.isolationOk },
    { label: 'Schutzleiterwiderstand (≤ 0,3 Ω, bei Verlängerung ≤ 1 Ω)', ok: f.schutzleiterOk },
    { label: 'Fehlerstrom-Schutzeinrichtung RCD (Auslösezeit ≤ 300 ms)', ok: f.fehlerstromOk },
    { label: 'Funktionsprüfung (Gerät/Anlage im Betrieb)', ok: f.funktionOk },
    { label: 'Kennzeichnung, Dokumentation und Schaltpläne', ok: f.kennzeichnungOk },
  ]

  const gesamtStyle = f.gesamtergebnis === 'bestanden' ? s.gesamtBestanden : f.gesamtergebnis === 'mit Mängeln' ? s.gesamtMaengel : s.gesamtNicht
  const gesamtColor = f.gesamtergebnis === 'bestanden' ? C.green : f.gesamtergebnis === 'mit Mängeln' ? C.amber : C.red

  const buffer = await renderToBuffer(
    <Document title="E-Check Protokoll" author="Wunderlich Elektrotechnik">

      {/* SEITE 1: Stammdaten + Allgemeine Prüfung */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.logo}>WUNDERLICH ELEKTROTECHNIK</Text>
            <Text style={s.logoSub}>Elektromeister · Steuernummer: 348/5226/3898 · USt-IdNr.: DE463092826</Text>
          </View>
          <View>
            <Text style={s.docTitle}>E-CHECK PROTOKOLL{variant === 'gross' ? '\n(UMFASSEND)' : ''}</Text>
            <Text style={s.docNorm}>DGUV Vorschrift 3 · VDE 0701-0702</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>1. Auftraggeber & Prüfer</Text>
        <View style={[s.card, s.row2]}>
          <View style={s.halfBox}>
            <Text style={s.label}>Anlagenbetreiber</Text>
            <Text style={s.value}>{f.anlagenBetreiber as string || '–'}</Text>
            <Text style={[s.label, { marginTop: 6 }]}>Standort</Text>
            <Text style={s.valueNormal}>{f.anlagenStandort as string || '–'}</Text>
          </View>
          <View style={s.halfBox}>
            <Text style={s.label}>Prüfer</Text>
            <Text style={s.value}>{f.prueferName as string || '–'}</Text>
            <Text style={[s.label, { marginTop: 6 }]}>Qualifikation</Text>
            <Text style={s.valueNormal}>{f.prueferQualifikation as string || '–'}</Text>
          </View>
        </View>
        <View style={[s.card, { flexDirection: 'row', gap: 8, marginTop: 4 }]}>
          <View style={s.halfBox}>
            <Text style={s.label}>Prüfdatum</Text>
            <Text style={s.value}>{fmtDate(f.pruefDatum as string)}</Text>
          </View>
          <View style={s.halfBox}>
            <Text style={s.label}>Nächste Prüfung</Text>
            <Text style={s.value}>{fmtDate(f.naechstePruefung as string)}</Text>
          </View>
          <View style={s.halfBox}>
            <Text style={s.label}>Nennspannung</Text>
            <Text style={s.valueNormal}>{f.nennspannung as string || '230/400 V'}</Text>
          </View>
          <View style={s.halfBox}>
            <Text style={s.label}>Nennfrequenz</Text>
            <Text style={s.valueNormal}>{f.nennfrequenz as string || '50 Hz'}</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>2. Allgemeine Prüfergebnisse</Text>
        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderText, { width: '55%' }]}>Prüfpunkt</Text>
          <Text style={[s.tableHeaderText, { width: '45%', textAlign: 'right' }]}>Ergebnis</Text>
        </View>
        {checks.map((c, idx) => (
          <View key={idx} style={[s.tableRow, idx % 2 === 0 ? s.tableRowAlt : {}]}>
            <Text style={s.checkCell}>{c.label}</Text>
            <View style={s.resultCell}>
              <View style={[s.badge, c.ok ? s.badgeGreen : s.badgeRed]}>
                <Text style={[s.badgeText, { color: c.ok ? C.green : C.red }]}>{c.ok ? 'i.O.' : 'n.i.O.'}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={[s.gesamtBox, gesamtStyle]}>
          <Text style={[s.gesamtLabel, { color: gesamtColor }]}>
            Gesamtergebnis: {String(f.gesamtergebnis ?? '–').toUpperCase()}
          </Text>
        </View>

        {f.bemerkungen ? (
          <View>
            <Text style={s.sectionTitle}>Bemerkungen / Mängel</Text>
            <View style={s.card}>
              <Text style={{ fontSize: 8.5, lineHeight: 1.5 }}>{f.bemerkungen as string}</Text>
            </View>
          </View>
        ) : null}

        <View style={{ marginTop: 12, padding: 6, backgroundColor: C.lightGray, borderRadius: 2 }}>
          <Text style={{ fontSize: 6.5, color: C.gray, lineHeight: 1.4 }}>
            Dieses Protokoll wurde gemäß DGUV Vorschrift 3 (ehem. BGV A3) / VDE 0701-0702 erstellt. Die Prüfung bestätigt den ordnungsgemäßen Zustand zum Zeitpunkt der Prüfung.
            Wunderlich Elektrotechnik · Sebastian Wunderlich · Elektromeister · Steuernummer: 348/5226/3898 · USt-IdNr.: DE463092826
          </Text>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Wunderlich Elektrotechnik · E-Check Protokoll · {f.anlagenBetreiber as string || ''} · Erstellt: {new Date().toLocaleDateString('de-DE')}</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Seite ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      {/* SEITE 2: Stromkreis-Messprotokoll */}
      <Page size="A4" style={[s.page, { paddingHorizontal: 30 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1pt solid #0F2A4A', paddingBottom: 8 }}>
          <View>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Messprotokoll Stromkreise</Text>
            <Text style={{ fontSize: 7.5, color: C.gray }}>VDE 0100-600 · {f.anlagenBetreiber as string || ''} · {fmtDate(f.pruefDatum as string)}</Text>
          </View>
          <Text style={{ fontSize: 7, color: C.gray, textAlign: 'right' }}>
            {f.nennspannung as string || '230/400 V'} · {f.nennfrequenz as string || '50 Hz'}
          </Text>
        </View>

        <View style={s.skHeader}>
          <Text style={[s.skHeaderText, { width: SK.nr }]}>Nr.</Text>
          <Text style={[s.skHeaderText, { width: SK.bez, textAlign: 'left' }]}>Bezeichnung</Text>
          <Text style={[s.skHeaderText, { width: SK.sich }]}>Sicherung</Text>
          <Text style={[s.skHeaderText, { width: SK.schutz }]}>RPE{'\n'}(Ω)</Text>
          <Text style={[s.skHeaderText, { width: SK.isol }]}>RISO{'\n'}(MΩ)</Text>
          <Text style={[s.skHeaderText, { width: SK.schlei }]}>ZS{'\n'}(Ω)</Text>
          <Text style={[s.skHeaderText, { width: SK.kurz }]}>IK{'\n'}(A)</Text>
          <Text style={[s.skHeaderText, { width: SK.rcdI }]}>RCD{'\n'}(mA)</Text>
          <Text style={[s.skHeaderText, { width: SK.rcdT }]}>tA{'\n'}(ms)</Text>
          <Text style={[s.skHeaderText, { width: SK.erg }]}>Erg.</Text>
        </View>

        {stromkreise.length > 0 ? stromkreise.map((sk, idx) => {
          const ergColor = sk.ergebnis === 'i.O.' ? C.green : sk.ergebnis === 'n.i.O.' ? C.red : C.gray
          return (
            <View key={idx} style={[s.skRow, idx % 2 === 0 ? s.skRowAlt : {}]} wrap={false}>
              <Text style={[s.skCell, { width: SK.nr }]}>{sk.nr || String(idx + 1)}</Text>
              <Text style={[s.skCell, { width: SK.bez, textAlign: 'left', fontSize: 7 }]}>{sk.bezeichnung || '–'}</Text>
              <Text style={[s.skCell, { width: SK.sich, fontSize: 6.5 }]}>{sk.sicherung || '–'}</Text>
              <Text style={[s.skCell, { width: SK.schutz }]}>{sk.schutzleiterR || '–'}</Text>
              <Text style={[s.skCell, { width: SK.isol }]}>{sk.isolationR || '–'}</Text>
              <Text style={[s.skCell, { width: SK.schlei }]}>{sk.schleifenimpedanz || '–'}</Text>
              <Text style={[s.skCell, { width: SK.kurz }]}>{sk.kurzschlussstrom || '–'}</Text>
              <Text style={[s.skCell, { width: SK.rcdI }]}>{sk.rcdNennstrom || '–'}</Text>
              <Text style={[s.skCell, { width: SK.rcdT }]}>{sk.rcdAusloesezeit || '–'}</Text>
              <Text style={[s.skCell, { width: SK.erg, fontWeight: 'bold', color: ergColor }]}>{sk.ergebnis}</Text>
            </View>
          )
        }) : Array.from({ length: 15 }).map((_, idx) => (
          <View key={idx} style={[s.skRow, idx % 2 === 0 ? s.skRowAlt : {}]}>
            <Text style={[s.skCell, { width: SK.nr }]}>{idx + 1}</Text>
            <Text style={[s.skCell, { width: SK.bez }]}>{' '}</Text>
            <Text style={[s.skCell, { width: SK.sich }]}>{' '}</Text>
            <Text style={[s.skCell, { width: SK.schutz }]}>{' '}</Text>
            <Text style={[s.skCell, { width: SK.isol }]}>{' '}</Text>
            <Text style={[s.skCell, { width: SK.schlei }]}>{' '}</Text>
            <Text style={[s.skCell, { width: SK.kurz }]}>{' '}</Text>
            <Text style={[s.skCell, { width: SK.rcdI }]}>{' '}</Text>
            <Text style={[s.skCell, { width: SK.rcdT }]}>{' '}</Text>
            <Text style={[s.skCell, { width: SK.erg }]}>{' '}</Text>
          </View>
        ))}

        <View style={{ marginTop: 10, padding: 6, backgroundColor: C.lightGray, borderRadius: 2 }}>
          <Text style={{ fontSize: 6.5, color: C.gray, lineHeight: 1.5 }}>
            RPE = Schutzleiterwiderstand · RISO = Isolationswiderstand · ZS = Schleifenimpedanz · IK = Kurzschlussstrom · RCD = Nenn-Fehlerstrom · tA = Auslösezeit{'\n'}
            Grenzwerte: RPE ≤ 0,3 Ω (Verlängerungsleitung ≤ 1 Ω) · RISO ≥ 1 MΩ · tA (30 mA) ≤ 300 ms · tA (300 mA) ≤ 40 ms
          </Text>
        </View>

        {bm.length > 0 && bm.some(b => b.bezeichnung) && (
          <View>
            <Text style={[s.sectionTitle, { marginTop: 16 }]}>Geprüfte Betriebsmittel</Text>
            <View style={s.bmHeader}>
              <Text style={[s.bmHeaderText, s.bmCell1]}>Bezeichnung</Text>
              <Text style={[s.bmHeaderText, s.bmCell2]}>Fabrikat</Text>
              <Text style={[s.bmHeaderText, s.bmCell3]}>Typ/Modell</Text>
              <Text style={[s.bmHeaderText, s.bmCell4]}>Serien-Nr.</Text>
              <Text style={[s.bmHeaderText, s.bmCell5]}>Erg.</Text>
            </View>
            {bm.map((b, idx) => (
              <View key={idx} style={[s.bmRow, idx % 2 === 0 ? { backgroundColor: '#F9FAFB' } : {}]}>
                <Text style={s.bmCell1}>{b.bezeichnung || '–'}</Text>
                <Text style={s.bmCell2}>{b.fabrikat || '–'}</Text>
                <Text style={s.bmCell3}>{b.typ || '–'}</Text>
                <Text style={s.bmCell4}>{b.serienNr || '–'}</Text>
                <Text style={[s.bmCell5, { color: b.ergebnis === 'i.O.' ? C.green : b.ergebnis === 'n.i.O.' ? C.red : C.gray, fontWeight: 'bold' }]}>{b.ergebnis}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 20, marginTop: 24 }}>
          <View style={{ flex: 1, borderTop: '0.5pt solid #6B7280', paddingTop: 6 }}>
            <Text style={{ fontSize: 7, color: C.gray }}>Datum, Unterschrift Prüfer</Text>
          </View>
          <View style={{ flex: 1, borderTop: '0.5pt solid #6B7280', paddingTop: 6 }}>
            <Text style={{ fontSize: 7, color: C.gray }}>Datum, Unterschrift Auftraggeber</Text>
          </View>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Wunderlich Elektrotechnik · E-Check Messprotokoll · DGUV V3 / VDE 0701-0702</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Seite ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )

  return new NextResponse(new Uint8Array(buffer), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename="E-Check-Protokoll.pdf"' },
  })
}
