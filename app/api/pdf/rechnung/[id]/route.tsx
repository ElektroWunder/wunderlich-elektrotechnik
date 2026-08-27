import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import React from 'react'

const C = {
  primary: '#0F2A4A', accent: '#E8732A', gray: '#6B7280',
  lightGray: '#F3F4F6', border: '#E5E7EB', white: '#FFFFFF',
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
  invoiceInfoBlock: { width: '40%' },
  invoiceInfoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 3 },
  invoiceInfoLabel: { color: C.gray, fontSize: 8 },
  invoiceInfoValue: { fontWeight: 'bold', fontSize: 8 },
  subject: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  invoiceSubtitle: { fontSize: 9, color: C.gray, marginBottom: 20 },
  paymentCoverBox: { marginTop: 20, backgroundColor: C.lightGray, padding: 12, borderRadius: 3, borderLeft: '3pt solid #E8732A' },
  paymentCoverTitle: { fontSize: 7.5, fontWeight: 'bold', color: C.gray, marginBottom: 6 },
  paymentCoverRow: { flexDirection: 'row', marginBottom: 3 },
  paymentCoverLabel: { fontSize: 8, color: C.gray, width: 110 },
  paymentCoverValue: { fontSize: 8, fontWeight: 'bold' },
  coverSummary: { borderTop: '0.5pt solid #E5E7EB', paddingTop: 16, marginTop: 16 },
  coverSummaryTitle: { fontSize: 7.5, fontWeight: 'bold', color: C.gray, marginBottom: 8 },
  coverSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  coverSummaryLabel: { fontSize: 8.5, color: C.gray },
  coverSummaryValue: { fontSize: 8.5, fontWeight: 'bold' },
  coverGrossRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6, borderTop: '1pt solid #0F2A4A', marginTop: 4 },
  coverGrossLabel: { fontSize: 11, fontWeight: 'bold' },
  coverGrossValue: { fontSize: 13, fontWeight: 'bold', color: C.accent },
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
  totalsBox: { marginTop: 16, alignSelf: 'flex-end', width: 240, borderTop: '0.5pt solid #E5E7EB' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal: 4 },
  totalLabel: { fontSize: 8, color: C.gray },
  totalValue: { fontSize: 8 },
  totalGrossRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, paddingHorizontal: 4, backgroundColor: C.primary, borderRadius: 2 },
  totalGrossLabel: { fontSize: 9, fontWeight: 'bold', color: C.white },
  totalGrossValue: { fontSize: 9, fontWeight: 'bold', color: C.white },
  legalNote: { marginTop: 20, padding: 8, backgroundColor: C.lightGray, borderRadius: 2 },
  legalNoteText: { fontSize: 7, color: C.gray, lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 20, left: 45, right: 45, borderTop: '0.5pt solid #E5E7EB', paddingTop: 6, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 6.5, color: C.gray, lineHeight: 1.4 },
})

function fmt(n: number | null | undefined) {
  if (n == null) return '–'
  return n.toFixed(2).replace('.', ',') + ' €'
}
function fmtDate(d: string | null | undefined) {
  if (!d) return '–'
  return new Date(d).toLocaleDateString('de-DE')
}

interface InvoiceItem {
  id: string; position: number; type: string; description: string
  quantity: number | null; unit: string | null; unit_price: number | null; labor_hours: number | null
}
interface Invoice {
  id: string; invoice_number: string; status: string
  issue_date: string | null; due_date: string | null; paid_date: string | null
  customers: { name: string; company: string | null; street: string | null; zip: string | null; city: string | null; email: string | null } | null
  invoice_items: InvoiceItem[]
  offers: { offer_number: string; title: string; hourly_rate: number; discount_percent: number } | null
}

function InvoicePDF({ invoice }: { invoice: Invoice }) {
  const offer = invoice.offers
  const c = invoice.customers
  const items = [...(invoice.invoice_items ?? [])].sort((a, b) => a.position - b.position)
  const hourlyRate = offer?.hourly_rate ?? 0
  const mat = items.filter(i => i.type === 'material').reduce((s, i) => s + (i.quantity ?? 0) * (i.unit_price ?? 0), 0)
  const laborHours = items.filter(i => i.type === 'labor').reduce((s, i) => s + (i.labor_hours ?? 0), 0)
  const labor = laborHours * hourlyRate
  const sub = mat + labor
  const discPct = offer?.discount_percent ?? 0
  const disc = sub * (discPct / 100)
  const net = sub - disc
  const vat = net * 0.19
  const gross = net + vat

  const FooterComp = () => (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>
        Wunderlich Elektrotechnik · Inhaber: Sebastian Wunderlich · Elektromeister{'\n'}
        Steuernummer: 348/5226/3898 · USt-IdNr.: DE463092826 · IBAN: DE[IBAN] · BIC: [BIC]
      </Text>
      <Text
        style={{ fontSize: 6.5, color: C.gray, textAlign: 'right' }}
        render={({ pageNumber, totalPages }) => `Seite ${pageNumber} / ${totalPages}`}
      />
    </View>
  )

  return (
    <Document title={invoice.invoice_number} author="Wunderlich Elektrotechnik">
      {/* SEITE 1: Deckblatt */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.logo}>WUNDERLICH</Text>
            <Text style={s.logoSub}>ELEKTROTECHNIK</Text>
          </View>
          <Text style={s.companyInfo}>
            Wunderlich Elektrotechnik{'\n'}Inhaber: Sebastian Wunderlich{'\n'}Elektromeister mit Kälteanlagenschein{'\n'}Steuernummer: 348/5226/3898{'\n'}USt-IdNr.: DE463092826
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
          <View style={s.invoiceInfoBlock}>
            <View style={s.invoiceInfoRow}>
              <Text style={s.invoiceInfoLabel}>Rechnungs-Nr.</Text>
              <Text style={s.invoiceInfoValue}>{invoice.invoice_number}</Text>
            </View>
            <View style={s.invoiceInfoRow}>
              <Text style={s.invoiceInfoLabel}>Rechnungsdatum</Text>
              <Text style={s.invoiceInfoValue}>{fmtDate(invoice.issue_date)}</Text>
            </View>
            <View style={s.invoiceInfoRow}>
              <Text style={s.invoiceInfoLabel}>Zahlungsziel</Text>
              <Text style={[s.invoiceInfoValue, { color: C.accent }]}>{fmtDate(invoice.due_date)}</Text>
            </View>
            {offer?.offer_number ? (
              <View style={s.invoiceInfoRow}>
                <Text style={s.invoiceInfoLabel}>Angebot-Nr.</Text>
                <Text style={s.invoiceInfoValue}>{offer.offer_number}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <Text style={s.subject}>Rechnung</Text>
        <Text style={s.invoiceSubtitle}>{offer?.title ? `Leistung: ${offer.title}` : 'für erbrachte Leistungen'}</Text>

        <View style={s.paymentCoverBox}>
          <Text style={s.paymentCoverTitle}>ZAHLUNGSAUFFORDERUNG</Text>
          <View style={s.paymentCoverRow}>
            <Text style={s.paymentCoverLabel}>Zahlbar bis:</Text>
            <Text style={s.paymentCoverValue}>{fmtDate(invoice.due_date)}</Text>
          </View>
          <View style={s.paymentCoverRow}>
            <Text style={s.paymentCoverLabel}>IBAN:</Text>
            <Text style={s.paymentCoverValue}>DE[IBAN]</Text>
          </View>
          <View style={s.paymentCoverRow}>
            <Text style={s.paymentCoverLabel}>BIC:</Text>
            <Text style={s.paymentCoverValue}>[BIC]</Text>
          </View>
          <View style={s.paymentCoverRow}>
            <Text style={s.paymentCoverLabel}>Verwendungszweck:</Text>
            <Text style={s.paymentCoverValue}>{invoice.invoice_number}</Text>
          </View>
          <View style={s.paymentCoverRow}>
            <Text style={s.paymentCoverLabel}>Bank:</Text>
            <Text style={s.paymentCoverValue}>[Bankname]</Text>
          </View>
        </View>

        <View style={s.coverSummary}>
          <Text style={s.coverSummaryTitle}>RECHNUNGSÜBERSICHT</Text>
          <View style={s.coverSummaryRow}>
            <Text style={s.coverSummaryLabel}>Material (netto)</Text>
            <Text style={s.coverSummaryValue}>{fmt(mat)}</Text>
          </View>
          <View style={s.coverSummaryRow}>
            <Text style={s.coverSummaryLabel}>Arbeitsleistung (netto, {laborHours.toFixed(2)} Std. × {hourlyRate.toFixed(2)} €)</Text>
            <Text style={s.coverSummaryValue}>{fmt(labor)}</Text>
          </View>
          {disc > 0 ? (
            <View style={s.coverSummaryRow}>
              <Text style={[s.coverSummaryLabel, { color: '#DC2626' }]}>Nachlass {discPct}%</Text>
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
            <Text style={s.coverGrossLabel}>Zu zahlender Betrag</Text>
            <Text style={s.coverGrossValue}>{fmt(gross)}</Text>
          </View>
        </View>

        <FooterComp />
      </Page>

      {/* SEITE 2+: Leistungsverzeichnis */}
      <Page size="A4" style={s.page}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 11, fontWeight: 'bold' }}>Leistungsverzeichnis</Text>
            <Text style={{ fontSize: 8, color: C.gray }}>{invoice.invoice_number} · {offer?.title ?? ''}</Text>
          </View>
          <Text style={{ fontSize: 8, color: C.gray }}>{fmtDate(invoice.issue_date)}</Text>
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
            const gp = (item.labor_hours ?? 0) * hourlyRate
            return (
              <View key={item.id} style={[s.tableRow, idx % 2 === 0 ? s.tableRowAlt : {}]} wrap={false}>
                <Text style={s.cellPos}>{idx + 1}</Text>
                <Text style={s.cellDesc}>{item.description}</Text>
                <Text style={s.cellQty}>{(item.labor_hours ?? 0).toFixed(2)}</Text>
                <Text style={s.cellUnit}>Std.</Text>
                <Text style={s.cellEP}>{fmt(hourlyRate)}</Text>
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
              <Text style={[s.totalLabel, { color: '#DC2626' }]}>Nachlass {discPct}%</Text>
              <Text style={[s.totalValue, { color: '#DC2626' }]}>−{fmt(disc)}</Text>
            </View>
          ) : null}
          <View style={[s.totalRow, { borderTop: '0.5pt solid #E5E7EB', marginTop: 2, paddingTop: 5 }]}>
            <Text style={s.totalLabel}>Nettobetrag</Text><Text style={s.totalValue}>{fmt(net)}</Text>
          </View>
          <View style={s.totalRow}><Text style={s.totalLabel}>MwSt. 19% (§ 12 Abs. 1 UStG)</Text><Text style={s.totalValue}>{fmt(vat)}</Text></View>
          <View style={[s.totalGrossRow, { marginTop: 4 }]}>
            <Text style={s.totalGrossLabel}>Zu zahlender Betrag</Text>
            <Text style={s.totalGrossValue}>{fmt(gross)}</Text>
          </View>
        </View>

        <View style={s.legalNote}>
          <Text style={s.legalNoteText}>
            Bitte überweisen Sie {fmt(gross)} bis zum {fmtDate(invoice.due_date)} unter Angabe der Rechnungsnummer {invoice.invoice_number}.{'\n'}
            Zahlbar ohne Abzug innerhalb von 14 Tagen. Bei Zahlungsverzug werden Verzugszinsen gem. § 288 BGB berechnet.{'\n'}
            Wunderlich Elektrotechnik · Sebastian Wunderlich · Elektromeister · Steuernummer: 348/5226/3898 · USt-IdNr.: DE463092826 · Gerichtsstand: [Ort]
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
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, customers(*), invoice_items(*), offers(offer_number, title, hourly_rate, discount_percent)')
    .eq('id', id)
    .order('position', { referencedTable: 'invoice_items' })
    .single()

  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const buffer = await renderToBuffer(<InvoicePDF invoice={invoice as Invoice} />)
  return new NextResponse(new Uint8Array(buffer), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="${invoice.invoice_number}.pdf"` },
  })
}
