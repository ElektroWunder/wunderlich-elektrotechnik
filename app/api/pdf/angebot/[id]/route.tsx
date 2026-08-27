import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import React from 'react'

const C = {
  primary: '#0F2A4A', accent: '#E8732A', gray: '#6B7280',
  lightGray: '#F3F4F6', border: '#E5E7EB', white: '#FFFFFF',
  amber: '#FEF3C7', amberBorder: '#F59E0B',
}

const s = StyleSheet.create({
  page: { fontSize: 9, color: C.primary, paddingTop: 40, paddingBottom: 50, paddingHorizontal: 45 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 },
  logo: { fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  logoSub: { fontSize: 7, color: C.gray, marginTop: 2, letterSpacing: 1 },
  companyInfo: { fontSize: 7.5, color: C.gray, textAlign: 'right', lineHeight: 1.6 },
  addressBlock: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  senderLine: { fontSize: 6.5, color: C.gray, paddingBottom: 2, marginBottom: 5, borderBottom: '0.5pt solid #E5E7EB' },
  recipientBlock: { width: '48%' },
  recipientAddress: { fontSize: 9, lineHeight: 1.6 },
  offerInfoBlock: { width: '40%' },
  offerInfoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 3 },
  offerInfoLabel: { color: C.gray, fontSize: 8 },
  offerInfoValue: { fontWeight: 'bold', fontSize: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 3, marginBottom: 20, alignSelf: 'flex-start' },
  typeBadgeWarning: { backgroundColor: C.amber },
  typeBadgeBlue: { backgroundColor: '#DBEAFE' },
  typeBadgeGreen: { backgroundColor: '#D1FAE5' },
  typeBadgeText: { fontWeight: 'bold', fontSize: 8 },
  subject: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 8.5, color: C.gray, marginBottom: 20, lineHeight: 1.5 },
  legalBox: { backgroundColor: C.lightGray, padding: 10, marginBottom: 20, borderRadius: 2, borderLeft: '3pt solid #E8732A' },
  legalBoxWarning: { backgroundColor: C.amber, borderLeft: '3pt solid #F59E0B' },
  legalBoxTitle: { fontWeight: 'bold', fontSize: 8, marginBottom: 3 },
  legalBoxText: { fontSize: 7.5, color: '#374151', lineHeight: 1.5 },
  coverSummary: { borderTop: '0.5pt solid #E5E7EB', paddingTop: 16, marginTop: 16 },
  coverSummaryTitle: { fontSize: 7.5, fontWeight: 'bold', color: C.gray, marginBottom: 8 },
  coverSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  coverSummaryLabel: { fontSize: 8.5, color: C.gray },
  coverSummaryValue: { fontSize: 8.5, fontWeight: 'bold' },
  coverGrossRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6, borderTop: '1pt solid #0F2A4A', marginTop: 4 },
  coverGrossLabel: { fontSize: 11, fontWeight: 'bold' },
  coverGrossValue: { fontSize: 13, fontWeight: 'bold', color: C.accent },
  validityNote: { fontSize: 8, color: C.gray, marginTop: 20, lineHeight: 1.5 },
  tableHeader: { flexDirection: 'row', borderBottom: '1pt solid #E5E7EB', paddingVertical: 5, paddingHorizontal: 4, backgroundColor: C.lightGray },
  tableHeaderText: { fontSize: 7, fontWeight: 'bold', color: C.gray },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #E5E7EB', paddingVertical: 5, paddingHorizontal: 4 },
  tableRowAlt: { backgroundColor: '#F9FAFB' },
  tableHeadingRow: { flexDirection: 'row', backgroundColor: '#E8F0FB', paddingVertical: 4, paddingHorizontal: 4, borderBottom: '0.5pt solid #E5E7EB' },
  tableHeadingText: { fontWeight: 'bold', fontSize: 8.5, color: C.primary },
  cellPos: { width: '6%', fontSize: 8, color: C.gray },
  cellDesc: { width: '46%', fontSize: 8 },
  cellQty: { width: '8%', fontSize: 8, textAlign: 'right' },
  cellUnit: { width: '8%', fontSize: 8, color: C.gray },
  cellEP: { width: '14%', fontSize: 8, textAlign: 'right' },
  cellGP: { width: '18%', fontSize: 8, textAlign: 'right', fontWeight: 'bold' },
  totalsBox: { marginTop: 16, alignSelf: 'flex-end', width: 230, borderTop: '0.5pt solid #E5E7EB' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal: 4 },
  totalLabel: { fontSize: 8, color: C.gray },
  totalValue: { fontSize: 8 },
  totalGrossRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, paddingHorizontal: 4, backgroundColor: C.primary, borderRadius: 2 },
  totalGrossLabel: { fontSize: 9, fontWeight: 'bold', color: C.white },
  totalGrossValue: { fontSize: 9, fontWeight: 'bold', color: C.white },
  paymentBox: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' },
  paymentSection: { flex: 1 },
  paymentTitle: { fontSize: 7.5, fontWeight: 'bold', color: C.gray, marginBottom: 4 },
  paymentText: { fontSize: 8, lineHeight: 1.5, color: '#374151' },
  footer: { position: 'absolute', bottom: 20, left: 45, right: 45, borderTop: '0.5pt solid #E5E7EB', paddingTop: 6, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 6.5, color: C.gray, lineHeight: 1.4 },
  legalNote: { marginTop: 20, padding: 8, backgroundColor: C.lightGray, borderRadius: 2 },
  legalNoteText: { fontSize: 7, color: C.gray, lineHeight: 1.5 },
})

function fmt(n: number | null | undefined) {
  if (n == null) return '–'
  return n.toFixed(2).replace('.', ',') + ' €'
}
function fmtDate(d: string | null | undefined) {
  if (!d) return '–'
  return new Date(d).toLocaleDateString('de-DE')
}

interface OfferItem {
  id: string; position: number; type: string; description: string
  quantity: number | null; unit: string | null; unit_price: number | null; labor_hours: number | null
}
interface Offer {
  id: string; offer_number: string; title: string; type: string; status: string
  inspection_date: string | null; valid_until: string | null
  discount_percent: number | null; hourly_rate: number | null
  notes: string | null; created_at: string
  customers: { name: string; company: string | null; street: string | null; zip: string | null; city: string | null; email: string | null } | null
  offer_items: OfferItem[]
}

function OfferPDF({ offer }: { offer: Offer }) {
  const items = [...(offer.offer_items ?? [])].sort((a, b) => a.position - b.position)
  const mat = items.filter(i => i.type === 'material').reduce((s, i) => s + (i.quantity ?? 0) * (i.unit_price ?? 0), 0)
  const laborHours = items.filter(i => i.type === 'labor').reduce((s, i) => s + (i.labor_hours ?? 0), 0)
  const labor = laborHours * (offer.hourly_rate ?? 0)
  const sub = mat + labor
  const disc = sub * ((offer.discount_percent ?? 0) / 100)
  const net = sub - disc
  const vat = net * 0.19
  const gross = net + vat

  const typeLabel = offer.type === 'schaetzung' ? 'Schätzung' : offer.type === 'kva' ? 'Kostenvoranschlag' : 'Festpreisangebot'
  const c = offer.customers

  const legalText = offer.type === 'schaetzung'
    ? 'Diese Schätzung ist unverbindlich und dient der ersten Orientierung. Die tatsächlichen Kosten können abweichen (erfahrungsgemäß ±30%). Für ein verbindliches Angebot empfehlen wir eine Vor-Ort-Besichtigung.'
    : offer.type === 'kva'
    ? 'Dies ist ein Kostenvoranschlag gemäß § 650 BGB. Der tatsächlich abzurechnende Betrag kann den Voranschlag um bis zu 15% überschreiten. Wesentliche Überschreitungen werden unverzüglich angezeigt.'
    : 'Dies ist ein verbindliches Festpreisangebot. Der genannte Preis ist abschließend und bindend für den beschriebenen Leistungsumfang.'

  const badgeStyle = offer.type === 'schaetzung' ? s.typeBadgeWarning : offer.type === 'kva' ? s.typeBadgeBlue : s.typeBadgeGreen
  const legalBoxStyle = offer.type === 'schaetzung' ? s.legalBoxWarning : s.legalBox

  const FooterComp = () => (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>
        Wunderlich Elektrotechnik · Inhaber: Dominik Wunderlich · Elektromeister{'\n'}Steuernummer: 348/5226/3898 · USt-IdNr.: DE463092826
      </Text>
      <Text style={{ fontSize: 6.5, color: C.gray, textAlign: 'right' }} render={({ pageNumber, totalPages }) => `Seite ${pageNumber} / ${totalPages}`} />
    </View>
  )

  return (
    <Document title={`${offer.offer_number} – ${offer.title}`} author="Wunderlich Elektrotechnik">
      {/* SEITE 1: Deckblatt */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.logo}>WUNDERLICH</Text>
            <Text style={s.logoSub}>ELEKTROTECHNIK</Text>
          </View>
          <Text style={s.companyInfo}>
            Wunderlich Elektrotechnik{'\n'}Inhaber: Dominik Wunderlich{'\n'}Elektromeister mit Kälteanlagenschein{'\n'}www.wunderlich-elektrotechnik.de
          </Text>
        </View>

        <View style={s.addressBlock}>
          <View style={s.recipientBlock}>
            <Text style={s.senderLine}>Wunderlich Elektrotechnik · [Straße] · [PLZ Ort]</Text>
            <View style={s.recipientAddress}>
              {c?.company ? <Text style={{ fontWeight: 'bold', fontSize: 9 }}>{c.company}</Text> : null}
              <Text style={{ fontWeight: c?.company ? 'normal' : 'bold', fontSize: 9 }}>{c?.name ?? ''}</Text>
              {c?.street ? <Text>{c.street}</Text> : null}
              {c?.zip ? <Text>{c.zip} {c.city}</Text> : null}
              {c?.email ? <Text style={{ color: C.gray, marginTop: 4 }}>{c.email}</Text> : null}
            </View>
          </View>
          <View style={s.offerInfoBlock}>
            <View style={s.offerInfoRow}>
              <Text style={s.offerInfoLabel}>Dokument-Nr.</Text>
              <Text style={s.offerInfoValue}>{offer.offer_number}</Text>
            </View>
            <View style={s.offerInfoRow}>
              <Text style={s.offerInfoLabel}>Datum</Text>
              <Text style={s.offerInfoValue}>{fmtDate(offer.created_at)}</Text>
            </View>
            {offer.inspection_date ? (
              <View style={s.offerInfoRow}>
                <Text style={s.offerInfoLabel}>Besichtigung</Text>
                <Text style={s.offerInfoValue}>{fmtDate(offer.inspection_date)}</Text>
              </View>
            ) : null}
            <View style={s.offerInfoRow}>
              <Text style={s.offerInfoLabel}>Gültig bis</Text>
              <Text style={s.offerInfoValue}>{fmtDate(offer.valid_until)}</Text>
            </View>
          </View>
        </View>

        <View style={[s.typeBadge, badgeStyle]}>
          <Text style={s.typeBadgeText}>{typeLabel.toUpperCase()}</Text>
        </View>

        <Text style={s.subject}>{offer.title}</Text>
        <Text style={s.subtitle}>
          Sehr geehrte Damen und Herren,{'\n'}vielen Dank für Ihr Interesse. Nachfolgend unterbreiten wir Ihnen unser Angebot für die beschriebenen Leistungen.
        </Text>

        <View style={[s.legalBox, legalBoxStyle]}>
          <Text style={s.legalBoxTitle}>Wichtiger Hinweis – {typeLabel}</Text>
          <Text style={s.legalBoxText}>{legalText}</Text>
        </View>

        <View style={s.coverSummary}>
          <Text style={s.coverSummaryTitle}>KOSTENÜBERSICHT</Text>
          <View style={s.coverSummaryRow}>
            <Text style={s.coverSummaryLabel}>Material (netto)</Text>
            <Text style={s.coverSummaryValue}>{fmt(mat)}</Text>
          </View>
          <View style={s.coverSummaryRow}>
            <Text style={s.coverSummaryLabel}>Arbeitsleistung (netto, {laborHours.toFixed(2)} Std. × {(offer.hourly_rate ?? 0).toFixed(2)} €)</Text>
            <Text style={s.coverSummaryValue}>{fmt(labor)}</Text>
          </View>
          {disc > 0 ? (
            <View style={s.coverSummaryRow}>
              <Text style={[s.coverSummaryLabel, { color: '#DC2626' }]}>Nachlass {offer.discount_percent}%</Text>
              <Text style={[s.coverSummaryValue, { color: '#DC2626' }]}>−{fmt(disc)}</Text>
            </View>
          ) : null}
          <View style={s.coverSummaryRow}>
            <Text style={s.coverSummaryLabel}>Nettobetrag</Text>
            <Text style={s.coverSummaryValue}>{fmt(net)}</Text>
          </View>
          <View style={s.coverSummaryRow}>
            <Text style={s.coverSummaryLabel}>Mehrwertsteuer 19%</Text>
            <Text style={s.coverSummaryValue}>{fmt(vat)}</Text>
          </View>
          <View style={s.coverGrossRow}>
            <Text style={s.coverGrossLabel}>Gesamtbetrag (brutto)</Text>
            <Text style={s.coverGrossValue}>{fmt(gross)}</Text>
          </View>
        </View>

        <Text style={s.validityNote}>
          Dieses Angebot gilt bis zum {fmtDate(offer.valid_until)}.{'\n'}Mit freundlichen Grüßen, Dominik Wunderlich – Wunderlich Elektrotechnik
        </Text>

        <FooterComp />
      </Page>

      {/* SEITE 2+: Leistungsverzeichnis */}
      <Page size="A4" style={s.page}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 11, fontWeight: 'bold' }}>Leistungsverzeichnis</Text>
            <Text style={{ fontSize: 8, color: C.gray }}>{offer.offer_number} · {offer.title}</Text>
          </View>
          <Text style={{ fontSize: 8, color: C.gray }}>{fmtDate(offer.created_at)}</Text>
        </View>

        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderText, s.cellPos]}>Pos.</Text>
          <Text style={[s.tableHeaderText, s.cellDesc]}>Bezeichnung</Text>
          <Text style={[s.tableHeaderText, s.cellQty]}>Menge</Text>
          <Text style={[s.tableHeaderText, s.cellUnit]}>Einh.</Text>
          <Text style={[s.tableHeaderText, s.cellEP]}>EP netto</Text>
          <Text style={[s.tableHeaderText, s.cellGP]}>GP netto</Text>
        </View>

        {items.map((item, idx) => {
          if (item.type === 'heading') return (
            <View key={item.id} style={s.tableHeadingRow} wrap={false}>
              <Text style={[s.tableHeadingText, { width: '100%' }]}>{item.description}</Text>
            </View>
          )
          if (item.type === 'text') return (
            <View key={item.id} style={[s.tableRow, idx % 2 === 0 ? s.tableRowAlt : {}]} wrap={false}>
              <Text style={[s.cellPos, { color: C.gray }]}>{idx + 1}</Text>
              <Text style={[s.cellDesc, { color: C.gray, width: '94%' }]}>{item.description}</Text>
            </View>
          )
          if (item.type === 'labor') {
            const gp = (item.labor_hours ?? 0) * (offer.hourly_rate ?? 0)
            return (
              <View key={item.id} style={[s.tableRow, idx % 2 === 0 ? s.tableRowAlt : {}]} wrap={false}>
                <Text style={s.cellPos}>{idx + 1}</Text>
                <Text style={s.cellDesc}>{item.description}</Text>
                <Text style={s.cellQty}>{(item.labor_hours ?? 0).toFixed(2)}</Text>
                <Text style={s.cellUnit}>Std.</Text>
                <Text style={s.cellEP}>{fmt(offer.hourly_rate)}</Text>
                <Text style={s.cellGP}>{fmt(gp)}</Text>
              </View>
            )
          }
          const gp = (item.quantity ?? 0) * (item.unit_price ?? 0)
          return (
            <View key={item.id} style={[s.tableRow, idx % 2 === 0 ? s.tableRowAlt : {}]} wrap={false}>
              <Text style={s.cellPos}>{idx + 1}</Text>
              <Text style={s.cellDesc}>{item.description}</Text>
              <Text style={s.cellQty}>{(item.quantity ?? 0).toFixed(2)}</Text>
              <Text style={s.cellUnit}>{item.unit ?? ''}</Text>
              <Text style={s.cellEP}>{fmt(item.unit_price)}</Text>
              <Text style={s.cellGP}>{fmt(gp)}</Text>
            </View>
          )
        })}

        <View style={s.totalsBox}>
          <View style={s.totalRow}><Text style={s.totalLabel}>Material netto</Text><Text style={s.totalValue}>{fmt(mat)}</Text></View>
          <View style={s.totalRow}><Text style={s.totalLabel}>Arbeitsleistung netto</Text><Text style={s.totalValue}>{fmt(labor)}</Text></View>
          {disc > 0 ? (
            <View style={s.totalRow}>
              <Text style={[s.totalLabel, { color: '#DC2626' }]}>Nachlass {offer.discount_percent}%</Text>
              <Text style={[s.totalValue, { color: '#DC2626' }]}>−{fmt(disc)}</Text>
            </View>
          ) : null}
          <View style={[s.totalRow, { borderTop: '0.5pt solid #E5E7EB', marginTop: 2, paddingTop: 5 }]}>
            <Text style={s.totalLabel}>Nettobetrag</Text><Text style={s.totalValue}>{fmt(net)}</Text>
          </View>
          <View style={s.totalRow}><Text style={s.totalLabel}>MwSt. 19%</Text><Text style={s.totalValue}>{fmt(vat)}</Text></View>
          <View style={[s.totalGrossRow, { marginTop: 4 }]}>
            <Text style={s.totalGrossLabel}>Gesamtbetrag brutto</Text>
            <Text style={s.totalGrossValue}>{fmt(gross)}</Text>
          </View>
        </View>

        <View style={s.paymentBox}>
          <View style={s.paymentSection}>
            <Text style={s.paymentTitle}>ZAHLUNGSBEDINGUNGEN</Text>
            <Text style={s.paymentText}>Zahlbar innerhalb von 14 Tagen nach Rechnungserhalt ohne Abzug.</Text>
          </View>
          <View style={s.paymentSection}>
            <Text style={s.paymentTitle}>BANKVERBINDUNG</Text>
            <Text style={s.paymentText}>Wunderlich Elektrotechnik{'\n'}IBAN: DE[IBAN]{'\n'}BIC: [BIC]{'\n'}[Bankname]</Text>
          </View>
        </View>

        <View style={s.legalNote}>
          <Text style={s.legalNoteText}>
            {offer.type === 'kva'
              ? 'Kostenvoranschlag gem. § 650 BGB. Überschreitungen von mehr als 15% werden unverzüglich angezeigt.'
              : offer.type === 'festpreis'
              ? 'Festpreisangebot. Dieser Preis ist verbindlich für den beschriebenen Leistungsumfang.'
              : 'Schätzung (unverbindlich). Die tatsächlichen Kosten können abweichen.'}
            {' '}Gerichtsstand: [Ort] · Steuernummer: 348/5226/3898 · USt-IdNr.: DE463092826
          </Text>
        </View>

        <FooterComp />
      </Page>
    </Document>
  )
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: offer } = await supabase
    .from('offers')
    .select('*, customers(*), offer_items(*)')
    .eq('id', id)
    .order('position', { referencedTable: 'offer_items' })
    .single()

  if (!offer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const buffer = await renderToBuffer(<OfferPDF offer={offer as Offer} />)
  return new NextResponse(new Uint8Array(buffer), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="${offer.offer_number}.pdf"` },
  })
}
