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
  row3: { flexDirection: 'row', gap: 8 },
  col: { flex: 1 },
  label: { fontSize: 7, color: C.gray, marginBottom: 1.5 },
  value: { fontSize: 8.5, fontWeight: 'bold' },
  valueNormal: { fontSize: 8.5 },
  // Prüftabelle
  tableHeader: { flexDirection: 'row', backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 4 },
  tableHeaderText: { color: C.white, fontSize: 7, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #E5E7EB', paddingVertical: 6, paddingHorizontal: 4, minHeight: 28 },
  tableRowAlt: { backgroundColor: '#F9FAFB' },
  col1: { width: '12%', fontSize: 8 },
  col2: { width: '18%', fontSize: 8 },
  col3: { width: '14%', fontSize: 8 },
  col4: { width: '16%', fontSize: 8 },
  col5: { width: '28%', fontSize: 8 },
  col6: { width: '12%', fontSize: 8 },
  legalBox: { marginTop: 16, padding: 8, backgroundColor: C.lightGray, borderRadius: 2, borderLeft: '3pt solid #E8732A' },
  legalText: { fontSize: 7, color: C.gray, lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 16, left: 40, right: 40, borderTop: '0.5pt solid #E5E7EB', paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 6, color: C.gray },
})

function fmtDate(d: string) {
  if (!d) return '–'
  try { return new Date(d).toLocaleDateString('de-DE') } catch { return d }
}

interface Pruefung {
  datum: string; pruefer: string; kaeltemittelMenge: string
  leckagebefund: string; massnahmen: string
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  let data: { anlagenDaten: Record<string, string>; pruefungen: Pruefung[] } = { anlagenDaten: {}, pruefungen: [] }
  try { data = JSON.parse(url.searchParams.get('data') ?? '{}') } catch { /* ignore */ }

  const a = data.anlagenDaten ?? {}
  const pruefungen = data.pruefungen ?? []

  const buffer = await renderToBuffer(
    <Document title="Prüfbuch Kleinkälteanlage" author="Wunderlich Elektrotechnik">
      {/* SEITE 1: Deckblatt + Anlagendaten */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.logo}>WUNDERLICH ELEKTROTECHNIK</Text>
            <Text style={s.logoSub}>Elektromeister mit Kälteanlagenschein · Steuernummer: 348/5226/3898 · USt-IdNr.: DE463092826</Text>
          </View>
          <View>
            <Text style={s.docTitle}>PRÜFBUCH</Text>
            <Text style={s.docNorm}>Kleinkälteanlage / Wärmepumpe{'\n'}EU-VO Nr. 517/2014 (F-Gase)</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>Anlagendaten</Text>
        <View style={[s.card, s.row2]}>
          <View style={s.col}>
            <Text style={s.label}>Betreiber</Text>
            <Text style={s.value}>{a.betreiber || '–'}</Text>
            <Text style={[s.label, { marginTop: 6 }]}>Standort / Adresse</Text>
            <Text style={s.valueNormal}>{a.standort || '–'}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.label}>Anlagentyp</Text>
            <Text style={s.value}>{a.anlagenTyp || '–'}</Text>
            <Text style={[s.label, { marginTop: 6 }]}>Fabrikat / Hersteller</Text>
            <Text style={s.valueNormal}>{a.fabrikat || '–'}</Text>
          </View>
        </View>
        <View style={[s.card, s.row3, { marginTop: 4 }]}>
          <View style={s.col}>
            <Text style={s.label}>Kältemittel</Text>
            <Text style={s.value}>{a.kaeltemittel || '–'}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.label}>Füllmenge (kg)</Text>
            <Text style={s.value}>{a.fuellmenge || '–'}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.label}>CO₂-Äquivalent (t)</Text>
            <Text style={s.value}>{a.co2Aequivalent || '–'}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.label}>Baujahr</Text>
            <Text style={s.value}>{a.baujahr || '–'}</Text>
          </View>
        </View>
        <View style={[s.card, s.row2, { marginTop: 4 }]}>
          <View style={s.col}>
            <Text style={s.label}>Erstinbetriebnahme</Text>
            <Text style={s.value}>{fmtDate(a.erstInbetriebnahme)}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.label}>Nächste Pflichtprüfung</Text>
            <Text style={[s.value, { color: C.accent }]}>{fmtDate(a.naechstePruefung)}</Text>
          </View>
        </View>

        <View style={s.legalBox}>
          <Text style={s.legalText}>
            Prüfpflicht gem. Art. 4 Abs. 3 EU-VO 517/2014: Anlagen mit ≥ 3 t CO₂e: jährliche Leckageprüfung · ≥ 30 t CO₂e: halbjährlich · ≥ 300 t CO₂e: vierteljährlich.
            Hermetisch geschlossene Anlagen &lt; 10 t CO₂e: keine Pflichtprüfung, Dokumentation empfohlen.
            Der Betreiber ist für die regelmäßige Durchführung der Leckageprüfungen verantwortlich (Art. 3 Abs. 2 EU-VO 517/2014).
            Kältemitteltechniker-Zertifikat erforderlich (Kategorie I gem. VO EU 2015/2067).
          </Text>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Wunderlich Elektrotechnik · Prüfbuch Kleinkälteanlage · {a.betreiber || ''} · {a.standort || ''}</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Seite ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      {/* SEITE 2+: Leckageprüfungen */}
      <Page size="A4" style={s.page}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 11, fontWeight: 'bold' }}>Leckageprüfungen</Text>
            <Text style={{ fontSize: 8, color: C.gray }}>{a.kaeltemittel} · {a.fuellmenge ? `${a.fuellmenge} kg` : ''} · {a.betreiber}</Text>
          </View>
        </View>

        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderText, s.col1]}>Datum</Text>
          <Text style={[s.tableHeaderText, s.col2]}>Prüfer / Zertifikat-Nr.</Text>
          <Text style={[s.tableHeaderText, s.col3]}>KM nachgefüllt (kg)</Text>
          <Text style={[s.tableHeaderText, s.col4]}>Leckagekontrolle</Text>
          <Text style={[s.tableHeaderText, s.col5]}>Maßnahmen</Text>
          <Text style={[s.tableHeaderText, s.col6]}>Unterschrift</Text>
        </View>

        {pruefungen.map((p, idx) => {
          const befundColor = p.leckagebefund === 'kein Befund' ? C.green : p.leckagebefund === 'Leckage' ? C.red : C.amber
          return (
            <View key={idx} style={[s.tableRow, idx % 2 === 0 ? s.tableRowAlt : {}]} wrap={false}>
              <Text style={s.col1}>{fmtDate(p.datum)}</Text>
              <Text style={s.col2}>{p.pruefer || '–'}</Text>
              <Text style={s.col3}>{p.kaeltemittelMenge || '0'}</Text>
              <Text style={[s.col4, { color: befundColor, fontWeight: 'bold' }]}>{p.leckagebefund}</Text>
              <Text style={s.col5}>{p.massnahmen || '–'}</Text>
              <Text style={s.col6}>{' '}</Text>
            </View>
          )
        })}

        {/* Leerzeilen für handschriftliche Einträge */}
        {Array.from({ length: Math.max(0, 8 - pruefungen.length) }).map((_, idx) => (
          <View key={`empty-${idx}`} style={[s.tableRow, (pruefungen.length + idx) % 2 === 0 ? s.tableRowAlt : {}]}>
            <Text style={s.col1}>{' '}</Text>
            <Text style={s.col2}>{' '}</Text>
            <Text style={s.col3}>{' '}</Text>
            <Text style={s.col4}>{' '}</Text>
            <Text style={s.col5}>{' '}</Text>
            <Text style={s.col6}>{' '}</Text>
          </View>
        ))}

        <View style={[s.legalBox, { marginTop: 20 }]}>
          <Text style={s.legalText}>
            Dieses Prüfbuch ist gemäß Art. 6 EU-VO Nr. 517/2014 mindestens 5 Jahre aufzubewahren und den zuständigen Behörden auf Verlangen vorzulegen.
            Alle Einträge sind vom zertifizierten Kältemitteltechniker zu unterzeichnen. Bei Leckage: unverzügliche Reparatur und Nachkontrolle erforderlich.
            Wunderlich Elektrotechnik · Dominik Wunderlich · Elektromeister mit Kälteanlagenschein · USt-IdNr.: DE463092826
          </Text>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Wunderlich Elektrotechnik · Prüfbuch Kleinkälteanlage · EU-VO 517/2014</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Seite ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )

  return new NextResponse(new Uint8Array(buffer), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename="Pruefbuch-Kaelteanlage.pdf"' },
  })
}
