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
  checkCell: { width: '50%', fontSize: 8 },
  resultCell: { width: '50%', flexDirection: 'row', justifyContent: 'flex-end', gap: 6 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  badgeGreen: { backgroundColor: '#DCFCE7' },
  badgeRed: { backgroundColor: '#FEE2E2' },
  badgeGray: { backgroundColor: '#F3F4F6' },
  badgeText: { fontSize: 7, fontWeight: 'bold' },
  bmTable: { marginTop: 4 },
  bmHeader: { flexDirection: 'row', backgroundColor: C.lightGray, paddingVertical: 3, paddingHorizontal: 4 },
  bmHeaderText: { fontSize: 7, fontWeight: 'bold', color: C.gray },
  bmRow: { flexDirection: 'row', borderBottom: '0.5pt solid #E5E7EB', paddingVertical: 4, paddingHorizontal: 4 },
  bmCell1: { width: '30%', fontSize: 8 },
  bmCell2: { width: '22%', fontSize: 8 },
  bmCell3: { width: '22%', fontSize: 8 },
  bmCell4: { width: '16%', fontSize: 8 },
  bmCell5: { width: '10%', fontSize: 8, textAlign: 'right' },
  gesamtBox: { marginTop: 10, padding: 10, borderRadius: 3, flexDirection: 'row', alignItems: 'center', gap: 8 },
  gesamtBestanden: { backgroundColor: '#DCFCE7', borderLeft: '3pt solid #16A34A' },
  gesamtMaengel: { backgroundColor: '#FEF3C7', borderLeft: '3pt solid #D97706' },
  gesamtNicht: { backgroundColor: '#FEE2E2', borderLeft: '3pt solid #DC2626' },
  gesamtLabel: { fontSize: 9, fontWeight: 'bold' },
  unterzeichnung: { flexDirection: 'row', gap: 20, marginTop: 20 },
  unterschriftBox: { flex: 1, borderTop: '0.5pt solid #6B7280', paddingTop: 6 },
  unterschriftLabel: { fontSize: 7, color: C.gray },
  footer: { position: 'absolute', bottom: 16, left: 40, right: 40, borderTop: '0.5pt solid #E5E7EB', paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 6, color: C.gray },
})

function fmtDate(d: string) {
  if (!d) return '–'
  return new Date(d).toLocaleDateString('de-DE')
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const variant = url.searchParams.get('variant') ?? 'klein'
  let data: { form: Record<string, unknown>; betriebsmittel: Record<string, string>[] } = { form: {}, betriebsmittel: [] }
  try { data = JSON.parse(url.searchParams.get('data') ?? '{}') } catch { /* ignore */ }

  const f = data.form as Record<string, unknown>
  const bm = data.betriebsmittel ?? []

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
    <Document title={`E-Check Protokoll ${variant === 'klein' ? 'Klein' : 'Groß'}`} author="Wunderlich Elektrotechnik">
      <Page size="A4" style={s.page}>
        {/* Header */}
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

        {/* Prüfer & Anlage */}
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
        <View style={[s.card, s.row2, { marginTop: 4 }]}>
          <View style={s.halfBox}>
            <Text style={s.label}>Prüfdatum</Text>
            <Text style={s.value}>{fmtDate(f.pruefDatum as string)}</Text>
          </View>
          <View style={s.halfBox}>
            <Text style={s.label}>Nächste Prüfung</Text>
            <Text style={s.value}>{fmtDate(f.naechstePruefung as string)}</Text>
          </View>
        </View>

        {/* Prüfergebnisse */}
        <Text style={s.sectionTitle}>2. Prüfergebnisse</Text>
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

        {/* Gesamtergebnis */}
        <View style={[s.gesamtBox, gesamtStyle]}>
          <Text style={[s.gesamtLabel, { color: gesamtColor }]}>
            Gesamtergebnis: {String(f.gesamtergebnis ?? '–').toUpperCase()}
          </Text>
        </View>

        {/* Betriebsmittel */}
        {bm.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>3. Geprüfte Betriebsmittel</Text>
            <View style={s.bmTable}>
              <View style={s.bmHeader}>
                <Text style={[s.bmHeaderText, s.bmCell1]}>Bezeichnung</Text>
                <Text style={[s.bmHeaderText, s.bmCell2]}>Fabrikat</Text>
                <Text style={[s.bmHeaderText, s.bmCell3]}>Typ/Modell</Text>
                <Text style={[s.bmHeaderText, s.bmCell4]}>Serien-Nr.</Text>
                <Text style={[s.bmHeaderText, s.bmCell5]}>Ergebnis</Text>
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
          </View>
        )}

        {/* Bemerkungen */}
        {f.bemerkungen ? (
          <View>
            <Text style={s.sectionTitle}>4. Bemerkungen / Mängel</Text>
            <View style={s.card}>
              <Text style={{ fontSize: 8.5, lineHeight: 1.5 }}>{f.bemerkungen as string}</Text>
            </View>
          </View>
        ) : null}

        {/* Rechtlicher Hinweis */}
        <View style={{ marginTop: 12, padding: 6, backgroundColor: C.lightGray, borderRadius: 2 }}>
          <Text style={{ fontSize: 6.5, color: C.gray, lineHeight: 1.4 }}>
            Dieses Protokoll wurde gemäß DGUV Vorschrift 3 (ehem. BGV A3) / VDE 0701-0702 erstellt. Die Prüfung bestätigt den ordnungsgemäßen Zustand der elektrischen Anlage/Betriebsmittel zum Zeitpunkt der Prüfung.
            Wunderlich Elektrotechnik · Dominik Wunderlich · Elektromeister · Steuernummer: 348/5226/3898 · USt-IdNr.: DE463092826
          </Text>
        </View>

        {/* Unterschriften */}
        <View style={s.unterzeichnung}>
          <View style={s.unterschriftBox}>
            <Text style={s.unterschriftLabel}>Datum, Unterschrift Prüfer</Text>
          </View>
          <View style={s.unterschriftBox}>
            <Text style={s.unterschriftLabel}>Datum, Unterschrift Auftraggeber</Text>
          </View>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Wunderlich Elektrotechnik · E-Check Protokoll · Erstellt: {new Date().toLocaleDateString('de-DE')}</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Seite ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )

  return new NextResponse(new Uint8Array(buffer), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename="E-Check-Protokoll.pdf"' },
  })
}
