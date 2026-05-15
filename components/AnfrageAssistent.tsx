'use client'

import { useState } from 'react'
import { ArrowLeft, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const WEB3FORMS_KEY = 'ee3e1d2d-cb9e-4c4d-a0c7-2c17578fdcd4'

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceId = 'klimaanlage' | 'elektroinstallation' | 'photovoltaik' | 'waermepumpe' | 'wallbox' | 'wartung'
type Phase = 'service' | 'questions' | 'contact' | 'success'

interface Option {
  id: string
  emoji: string
  label: string
  hint?: string
}

interface Question {
  id: string
  question: string
  hint?: string
  options: Option[]
  showIf?: (answers: Record<string, string>) => boolean
}

interface Service {
  id: ServiceId
  emoji: string
  label: string
  description: string
  questions: Question[]
}

interface Contact {
  name: string
  email: string
  phone: string
  message: string
  privacy: boolean
}

type ContactErrors = Partial<Record<'name' | 'email' | 'privacy', string>>

// ─── Service Data ─────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
  {
    id: 'klimaanlage',
    emoji: '❄️',
    label: 'Klimaanlage',
    description: 'Kühlen, heizen, Luftqualität verbessern',
    questions: [
      {
        id: 'nutzung',
        question: 'Wofür soll die Klimaanlage sein?',
        options: [
          { id: 'wohnen',  emoji: '🏠', label: 'Zuhause',           hint: 'Wohnung oder Haus' },
          { id: 'buero',   emoji: '💼', label: 'Büro / Praxis' },
          { id: 'gewerbe', emoji: '🏪', label: 'Gewerbe / Laden' },
          { id: 'gastro',  emoji: '🍽️', label: 'Gastronomie' },
        ],
      },
      {
        id: 'bereich_privat',
        question: 'Welchen Raum möchten Sie kühlen?',
        options: [
          { id: 'wohnzimmer',   emoji: '🛋️', label: 'Wohnzimmer' },
          { id: 'schlafzimmer', emoji: '🛏️', label: 'Schlafzimmer' },
          { id: 'arbeitszimmer',emoji: '🖥️', label: 'Arbeitszimmer' },
          { id: 'mehrere',      emoji: '🏘️', label: 'Mehrere Räume' },
        ],
        showIf: (a) => a.nutzung === 'wohnen',
      },
      {
        id: 'bereich_gewerbe',
        question: 'Was soll klimatisiert werden?',
        options: [
          { id: 'einzelbuero', emoji: '🪑', label: 'Einzelbüro' },
          { id: 'grossraum',   emoji: '👥', label: 'Großraumbüro' },
          { id: 'server',      emoji: '🖥️', label: 'Serverraum / IT' },
          { id: 'mehrere',     emoji: '🏢', label: 'Mehrere Bereiche' },
        ],
        showIf: (a) => ['buero', 'gewerbe', 'gastro'].includes(a.nutzung),
      },
      // Einzelraum: Raumgröße fragen
      {
        id: 'raumgroesse',
        question: 'Wie groß ist der Raum?',
        options: [
          { id: 'bis20',   emoji: '📦', label: 'bis 20 m²',   hint: 'z. B. kleines Schlafzimmer' },
          { id: '20bis35', emoji: '🛋️', label: '20–35 m²',   hint: 'normales Wohnzimmer' },
          { id: '35bis50', emoji: '🏠', label: '35–50 m²',   hint: 'großes Zimmer' },
          { id: 'ueber50', emoji: '🏢', label: 'über 50 m²', hint: 'offene Fläche / Gewerbe' },
        ],
        showIf: (a) =>
          (a.bereich_privat !== undefined && a.bereich_privat !== 'mehrere') ||
          (a.bereich_gewerbe !== undefined && a.bereich_gewerbe !== 'mehrere'),
      },
      // Einzelraum: Stockwerk
      {
        id: 'stockwerk',
        question: 'In welchem Stockwerk befindet sich der Raum?',
        hint: 'Wichtig für die Leitungsführung zum Außengerät',
        options: [
          { id: 'eg',  emoji: '🏠', label: 'Erdgeschoss' },
          { id: 'og1', emoji: '1️⃣', label: '1. Obergeschoss' },
          { id: 'og2', emoji: '⬆️', label: '2. OG oder höher' },
          { id: 'dg',  emoji: '🏔️', label: 'Dachgeschoss' },
        ],
        showIf: (a) =>
          (a.bereich_privat !== undefined && a.bereich_privat !== 'mehrere') ||
          (a.bereich_gewerbe !== undefined && a.bereich_gewerbe !== 'mehrere'),
      },
      // Mehrere Räume: Anzahl
      {
        id: 'anzahl_raeume',
        question: 'Wie viele Räume sollen klimatisiert werden?',
        options: [
          { id: '2',     emoji: '2️⃣', label: '2 Räume' },
          { id: '3',     emoji: '3️⃣', label: '3 Räume' },
          { id: '4plus', emoji: '4️⃣', label: '4 oder mehr' },
          { id: 'unklar',emoji: '🤔', label: 'Noch unklar' },
        ],
        showIf: (a) => a.bereich_privat === 'mehrere' || a.bereich_gewerbe === 'mehrere',
      },
      // Mehrere Räume: größter Raum (für Leistungsauslegung)
      {
        id: 'groesster_raum',
        question: 'Wie groß ist der größte Raum?',
        hint: 'Bestimmt die Leistung des stärksten Innengeräts',
        options: [
          { id: 'bis20',   emoji: '📦', label: 'bis 20 m²' },
          { id: '20bis35', emoji: '🛋️', label: '20–35 m²' },
          { id: '35bis50', emoji: '🏠', label: '35–50 m²' },
          { id: 'ueber50', emoji: '🏢', label: 'über 50 m²' },
        ],
        showIf: (a) => a.bereich_privat === 'mehrere' || a.bereich_gewerbe === 'mehrere',
      },
      // Mehrere Räume: Außengerät-Standort (statt Stockwerk)
      {
        id: 'aussengeraet',
        question: 'Wo soll das Außengerät aufgestellt werden?',
        hint: 'Bei Multisplit versorgt ein Außengerät alle Räume',
        options: [
          { id: 'wand',       emoji: '🏠', label: 'An der Hauswand' },
          { id: 'dach',       emoji: '🏔️', label: 'Auf dem Dach / Flachdach' },
          { id: 'garten',     emoji: '🌿', label: 'Im Garten / ebenerdig' },
          { id: 'weiss_nicht',emoji: '🤔', label: 'Noch unklar' },
        ],
        showIf: (a) => a.bereich_privat === 'mehrere' || a.bereich_gewerbe === 'mehrere',
      },
      {
        id: 'gebaeude_alter',
        question: 'Wie alt ist das Gebäude ungefähr?',
        options: [
          { id: 'neubau',     emoji: '✨', label: 'Neubau',      hint: 'unter 10 Jahre' },
          { id: 'mittel',     emoji: '🔧', label: '10–30 Jahre' },
          { id: 'altbau',     emoji: '🧱', label: 'Altbau',      hint: 'über 30 Jahre' },
          { id: 'weiss_nicht',emoji: '🤔', label: 'Weiß ich nicht' },
        ],
      },
      {
        id: 'zeitpunkt',
        question: 'Wann soll installiert werden?',
        options: [
          { id: 'sofort',      emoji: '⚡', label: 'So schnell wie möglich' },
          { id: 'bald',        emoji: '📅', label: 'In 1–3 Monaten' },
          { id: 'saison',      emoji: '🌞', label: 'Nächste Saison planen' },
          { id: 'nur_angebot', emoji: '📋', label: 'Nur Angebot einholen' },
        ],
      },
    ],
  },
  {
    id: 'elektroinstallation',
    emoji: '⚡',
    label: 'Elektroinstallation',
    description: 'Steckdosen, Leitungen, Verteiler',
    questions: [
      {
        id: 'art',
        question: 'Worum geht es?',
        options: [
          { id: 'steckdosen',     emoji: '🔌', label: 'Steckdosen / Leitungen', hint: 'neue Punkte, Verlängerungen' },
          { id: 'verteiler',      emoji: '⚡', label: 'Sicherungskasten',        hint: 'Erneuerung oder Erweiterung' },
          { id: 'neuinstallation',emoji: '🔧', label: 'Neuinstallation',          hint: 'komplett neu oder Sanierung' },
          { id: 'smarthome',      emoji: '📱', label: 'Smart Home',               hint: 'Schalten, Dimmen, Automatisierung' },
        ],
      },
      {
        id: 'gebaeudetyp',
        question: 'Um welches Gebäude handelt es sich?',
        options: [
          { id: 'efh',     emoji: '🏠', label: 'Einfamilienhaus' },
          { id: 'wohnung', emoji: '🏢', label: 'Wohnung / ETW' },
          { id: 'mfh',     emoji: '🏘️', label: 'Mehrfamilienhaus' },
          { id: 'gewerbe', emoji: '🏪', label: 'Gewerbe / Büro' },
        ],
      },
      {
        id: 'installation_alter',
        question: 'Wie alt ist die vorhandene Elektroinstallation?',
        options: [
          { id: 'neu',       emoji: '✨', label: 'Unter 10 Jahre', hint: 'neuwertig' },
          { id: 'mittel',    emoji: '🔧', label: '10–30 Jahre' },
          { id: 'alt',       emoji: '⚠️', label: 'Über 30 Jahre',  hint: 'sanierungsbedürftig' },
          { id: 'unbekannt', emoji: '🤔', label: 'Weiß ich nicht' },
        ],
      },
      {
        id: 'flaeche',
        question: 'Wie groß ist die betroffene Fläche?',
        options: [
          { id: 'bis60',    emoji: '📦', label: 'bis 60 m²' },
          { id: '60bis100', emoji: '🏠', label: '60–100 m²' },
          { id: '100bis150',emoji: '🏡', label: '100–150 m²' },
          { id: 'ueber150', emoji: '🏰', label: 'über 150 m²' },
        ],
        showIf: (a) => a.art !== 'steckdosen',
      },
      {
        id: 'zeitpunkt',
        question: 'Wann planen Sie die Maßnahme?',
        options: [
          { id: 'dringend', emoji: '⚡', label: 'Dringend',           hint: 'innerhalb 2 Wochen' },
          { id: 'bald',     emoji: '📅', label: 'In 1–3 Monaten' },
          { id: 'planung',  emoji: '📋', label: 'Noch in der Planung' },
        ],
      },
    ],
  },
  {
    id: 'photovoltaik',
    emoji: '☀️',
    label: 'Photovoltaik',
    description: 'Solaranlage & Stromspeicher',
    questions: [
      {
        id: 'fuer_wen',
        question: 'Für wen ist die Solaranlage?',
        options: [
          { id: 'privat',       emoji: '🏠', label: 'Eigenheim',       hint: 'Einfamilienhaus' },
          { id: 'gewerbe',      emoji: '🏭', label: 'Gewerbe / Betrieb' },
          { id: 'mfh',          emoji: '🏘️', label: 'Mehrfamilienhaus' },
          { id: 'landwirtschaft',emoji: '🌾', label: 'Landwirtschaft' },
        ],
      },
      {
        id: 'dach',
        question: 'Wie ist das Dach ausgerichtet?',
        options: [
          { id: 'sued',    emoji: '☀️', label: 'Süd',          hint: 'optimal, maximaler Ertrag' },
          { id: 'ostwest', emoji: '🔄', label: 'Ost / West',   hint: 'gut, gleichmäßiger Ertrag' },
          { id: 'flach',   emoji: '⬜', label: 'Flachdach',    hint: 'Ausrichtung frei wählbar' },
          { id: 'nord',    emoji: '🧭', label: 'Nord / unklar', hint: 'ggf. eingeschränkt' },
        ],
      },
      {
        id: 'dachflaeche',
        question: 'Wie viel Dachfläche steht zur Verfügung?',
        options: [
          { id: 'bis30',    emoji: '📦', label: 'bis 30 m²',    hint: 'ca. 3–4 kWp' },
          { id: '30bis60',  emoji: '🏠', label: '30–60 m²',    hint: 'ca. 4–7 kWp' },
          { id: '60bis100', emoji: '🏡', label: '60–100 m²',   hint: 'ca. 7–12 kWp' },
          { id: 'ueber100', emoji: '🏭', label: 'über 100 m²', hint: 'große Anlage' },
        ],
      },
      {
        id: 'speicher',
        question: 'Soll ein Stromspeicher dabei sein?',
        options: [
          { id: 'ja',        emoji: '🔋', label: 'Ja, unbedingt',        hint: 'maximale Eigenversorgung' },
          { id: 'beratung',  emoji: '🤔', label: 'Beratung gewünscht',   hint: 'bin noch unsicher' },
          { id: 'nein',      emoji: '⚡', label: 'Erst nur PV',           hint: 'Speicher später nachrüsten' },
        ],
      },
      {
        id: 'eauto',
        question: 'Haben Sie ein Elektroauto oder planen das?',
        options: [
          { id: 'ja',      emoji: '🚗', label: 'Ja, vorhanden' },
          { id: 'geplant', emoji: '🔜', label: 'In Planung' },
          { id: 'nein',    emoji: '🚫', label: 'Nein' },
        ],
      },
      {
        id: 'zeitpunkt',
        question: 'Wann soll die Anlage in Betrieb gehen?',
        options: [
          { id: 'saison',       emoji: '⚡', label: 'Diese Saison' },
          { id: 'naechstes_j',  emoji: '📅', label: 'Nächstes Jahr' },
          { id: 'nur_angebot',  emoji: '📋', label: 'Nur Angebot einholen' },
        ],
      },
    ],
  },
  {
    id: 'waermepumpe',
    emoji: '♨️',
    label: 'Wärmepumpe',
    description: 'Elektroanschluss & §14a EnWG',
    questions: [
      {
        id: 'gebaeudetyp',
        question: 'Um welches Gebäude handelt es sich?',
        options: [
          { id: 'efh',      emoji: '🏠', label: 'Einfamilienhaus' },
          { id: 'reihen',   emoji: '🏡', label: 'Doppel- / Reihenhaus' },
          { id: 'mfh',      emoji: '🏘️', label: 'Mehrfamilienhaus' },
          { id: 'gewerbe',  emoji: '🏢', label: 'Gewerbe' },
        ],
      },
      {
        id: 'flaeche',
        question: 'Wie groß ist die zu beheizende Fläche?',
        options: [
          { id: 'bis100',    emoji: '📦', label: 'bis 100 m²' },
          { id: '100bis150', emoji: '🏠', label: '100–150 m²' },
          { id: '150bis250', emoji: '🏡', label: '150–250 m²' },
          { id: 'ueber250',  emoji: '🏰', label: 'über 250 m²' },
        ],
      },
      {
        id: 'daemmung',
        question: 'Wie gut ist das Gebäude gedämmt?',
        options: [
          { id: 'gut',       emoji: '✨', label: 'Gut gedämmt',      hint: 'Neubau oder saniert' },
          { id: 'mittel',    emoji: '🔧', label: 'Mittel',            hint: 'Baujahr 1990+' },
          { id: 'schlecht',  emoji: '🧱', label: 'Wenig gedämmt',    hint: 'Altbau, unsaniert' },
          { id: 'weiss',     emoji: '🤔', label: 'Weiß ich nicht' },
        ],
      },
      {
        id: 'heizung',
        question: 'Was ist die aktuelle Heizungsart?',
        options: [
          { id: 'oel',         emoji: '⛽', label: 'Öl' },
          { id: 'gas',         emoji: '🔥', label: 'Gas' },
          { id: 'nachtspeicher',emoji: '⚡', label: 'Nachtspeicher / Strom' },
          { id: 'neubau',      emoji: '🏗️', label: 'Neubau (kein Heizsystem)' },
        ],
      },
      {
        id: 'zeitpunkt',
        question: 'Wann soll der Anschluss erfolgen?',
        options: [
          { id: 'sofort',  emoji: '⚡', label: 'So schnell wie möglich' },
          { id: 'bald',    emoji: '📅', label: 'In 3–6 Monaten' },
          { id: 'planung', emoji: '📋', label: 'Noch in der Planung' },
        ],
      },
    ],
  },
  {
    id: 'wallbox',
    emoji: '🔌',
    label: 'Wallbox / E-Laden',
    description: 'Ladestation für Elektroauto',
    questions: [
      {
        id: 'fuer_wen',
        question: 'Für wen ist die Wallbox?',
        options: [
          { id: 'eigen',  emoji: '🏠', label: 'Eigenheim',        hint: 'Eigentümer' },
          { id: 'mieter', emoji: '🏢', label: 'Mieter / WEG',     hint: 'Mietwohnung oder Gemeinschaft' },
          { id: 'gewerbe',emoji: '🏭', label: 'Gewerbe / Fuhrpark',hint: 'mehrere Fahrzeuge' },
        ],
      },
      {
        id: 'anzahl',
        question: 'Wie viele Ladepunkte werden benötigt?',
        options: [
          { id: '1',     emoji: '1️⃣', label: '1 Ladepunkt' },
          { id: '2',     emoji: '2️⃣', label: '2 Ladepunkte' },
          { id: '3plus', emoji: '➕', label: '3 oder mehr' },
          { id: 'unklar',emoji: '🤔', label: 'Noch unklar' },
        ],
      },
      {
        id: 'standort',
        question: 'Wo wird die Wallbox installiert?',
        options: [
          { id: 'garage',   emoji: '🏠', label: 'Garage (innen)' },
          { id: 'carport',  emoji: '🏕️', label: 'Carport / überdacht' },
          { id: 'freiluft', emoji: '🌧️', label: 'Außen / Freiluft' },
          { id: 'parkplatz',emoji: '🅿️', label: 'Parkplatz / Betrieb' },
        ],
      },
      {
        id: 'leistung',
        question: 'Welche Ladeleistung ist gewünscht?',
        options: [
          { id: '11kw',    emoji: '⚡', label: '11 kW',             hint: 'Standard, 3-phasig' },
          { id: '22kw',    emoji: '🔋', label: '22 kW',             hint: 'Schnellladen, 3-phasig' },
          { id: 'beratung',emoji: '🤔', label: 'Beratung gewünscht', hint: 'bin noch unsicher' },
        ],
      },
      {
        id: 'zeitpunkt',
        question: 'Wann soll die Wallbox montiert werden?',
        options: [
          { id: 'sofort',     emoji: '⚡', label: 'So schnell wie möglich' },
          { id: 'bald',       emoji: '📅', label: 'In 1–3 Monaten' },
          { id: 'nur_angebot',emoji: '📋', label: 'Nur Angebot einholen' },
        ],
      },
    ],
  },
  {
    id: 'wartung',
    emoji: '🔧',
    label: 'Wartung & E-Check',
    description: 'Klimawartung, DGUV V3 Prüfung',
    questions: [
      {
        id: 'service',
        question: 'Was wird benötigt?',
        options: [
          { id: 'klimawartung', emoji: '❄️', label: 'Klimaanlage warten', hint: 'Filter, Kältemittel, Check' },
          { id: 'echeck',       emoji: '✅', label: 'E-Check / DGUV V3',  hint: 'elektrische Prüfung' },
          { id: 'beides',       emoji: '🔧', label: 'Beides' },
          { id: 'reparatur',    emoji: '🛠️', label: 'Reparatur / Störung', hint: 'Anlage läuft nicht mehr' },
        ],
      },
      {
        id: 'anzahl_anlagen',
        question: 'Wie viele Klimaanlagen sollen gewartet werden?',
        options: [
          { id: '1',     emoji: '1️⃣', label: '1 Anlage' },
          { id: '2bis3', emoji: '2️⃣', label: '2–3 Anlagen' },
          { id: '4plus', emoji: '4️⃣', label: '4 oder mehr' },
        ],
        showIf: (a) => ['klimawartung', 'beides', 'reparatur'].includes(a.service),
      },
      {
        id: 'betrieb',
        question: 'Welche Art von Betrieb?',
        options: [
          { id: 'buero',    emoji: '💼', label: 'Büro / Praxis' },
          { id: 'werkstatt',emoji: '🔧', label: 'Werkstatt / Produktion' },
          { id: 'gastro',   emoji: '🍽️', label: 'Gastronomie' },
          { id: 'sonstiges',emoji: '🏢', label: 'Sonstiges Gewerbe' },
        ],
        showIf: (a) => ['echeck', 'beides'].includes(a.service),
      },
      {
        id: 'zeitpunkt',
        question: 'Wann soll der Termin stattfinden?',
        options: [
          { id: 'dringend',     emoji: '⚡', label: 'Dringend',              hint: 'Störung oder Termin läuft ab' },
          { id: 'bald',         emoji: '📅', label: 'Innerhalb 3 Monate' },
          { id: 'jahresplanung',emoji: '🗓️', label: 'Jahreswartung planen' },
        ],
      },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getEffective(service: Service, answers: Record<string, string>): Question[] {
  return service.questions.filter(q => !q.showIf || q.showIf(answers))
}

function buildMessage(service: Service, answers: Record<string, string>, contact: Contact): string {
  const effective = getEffective(service, answers)
  const lines: string[] = [`Leistung: ${service.label}`, '']
  for (const q of effective) {
    const opt = q.options.find(o => o.id === answers[q.id])
    if (opt) lines.push(`${q.question}\n→ ${opt.label}`)
  }
  lines.push('', `Name: ${contact.name}`)
  if (contact.phone) lines.push(`Telefon: ${contact.phone}`)
  lines.push(`E-Mail: ${contact.email}`)
  if (contact.message) lines.push(`\nAnmerkungen: ${contact.message}`)
  return lines.join('\n')
}

function validateContact(c: Contact): ContactErrors {
  const e: ContactErrors = {}
  if (!c.name.trim() || c.name.trim().length < 2) e.name = 'Name ist erforderlich'
  if (!c.email.trim() || !/^[^@]+@[^@.]+\.[^@]+$/.test(c.email)) e.email = 'Gültige E-Mail-Adresse erforderlich'
  if (!c.privacy) e.privacy = 'Bitte stimmen Sie der Datenschutzerklärung zu'
  return e
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnfrageAssistent() {
  const [phase, setPhase] = useState<Phase>('service')
  const [serviceId, setServiceId] = useState<ServiceId | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [qIndex, setQIndex] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [contact, setContact] = useState<Contact>({
    name: '', email: '', phone: '', message: '', privacy: false,
  })
  const [contactErrors, setContactErrors] = useState<ContactErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const service = serviceId ? SERVICES.find(s => s.id === serviceId)! : null
  const effective = service ? getEffective(service, answers) : []
  const currentQ = effective[qIndex] ?? null

  function selectService(id: ServiceId) {
    setServiceId(id)
    setAnswers({})
    setQIndex(0)
    setAnimKey(k => k + 1)
    setPhase('questions')
  }

  function selectOption(qId: string, optId: string) {
    const newAnswers = { ...answers, [qId]: optId }
    setAnswers(newAnswers)
    const newEffective = service!.questions.filter(q => !q.showIf || q.showIf(newAnswers))
    const next = qIndex + 1
    if (next < newEffective.length) {
      setQIndex(next)
      setAnimKey(k => k + 1)
    } else {
      setPhase('contact')
    }
  }

  function goBack() {
    if (phase === 'contact') {
      setPhase('questions')
      setAnimKey(k => k + 1)
    } else if (phase === 'questions' && qIndex > 0) {
      setQIndex(q => q - 1)
      setAnimKey(k => k + 1)
    } else if (phase === 'questions' && qIndex === 0) {
      setPhase('service')
    }
  }

  function reset() {
    setPhase('service')
    setServiceId(null)
    setAnswers({})
    setQIndex(0)
    setContact({ name: '', email: '', phone: '', message: '', privacy: false })
    setContactErrors({})
    setSubmitError(null)
    setFile(null)
  }

  async function handleSubmit() {
    const errors = validateContact(contact)
    if (Object.keys(errors).length > 0) { setContactErrors(errors); return }
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const fd = new FormData()
      fd.append('access_key', WEB3FORMS_KEY)
      fd.append('from_name', contact.name)
      fd.append('replyto', contact.email)
      fd.append('subject', `Anfrageassistent: ${service!.label}`)
      fd.append('botcheck', '')
      fd.append('message', buildMessage(service!, answers, contact))
      if (contact.phone) fd.append('phone', contact.phone)
      if (file) fd.append('attachment', file, file.name)
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        setPhase('success')
      } else {
        setSubmitError('Übermittlung fehlgeschlagen. Bitte versuchen Sie es erneut oder rufen Sie uns an.')
      }
    } catch {
      setSubmitError('Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Success ────────────────────────────────────────────────────────────────

  if (phase === 'success') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Anfrage erhalten!</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Danke, <strong>{contact.name.split(' ')[0]}</strong>!{' '}
          Wir melden uns innerhalb von 24 Stunden bei Ihnen.
        </p>
        <button onClick={reset} className="text-sm text-accent hover:underline font-semibold">
          Neue Anfrage stellen
        </button>
      </div>
    )
  }

  // ── Service selection ──────────────────────────────────────────────────────

  if (phase === 'service') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h2 className="text-xl font-bold text-primary mb-1 text-center">Was können wir für Sie tun?</h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          Wählen Sie eine Leistung – wir führen Sie Schritt für Schritt durch die Details.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SERVICES.map(s => (
            <button
              key={s.id}
              onClick={() => selectService(s.id)}
              className="flex flex-col items-center gap-2 p-5 bg-gray-50 hover:bg-accent/5 border-2 border-transparent hover:border-accent rounded-2xl transition-all duration-150 text-center active:scale-[0.97]"
            >
              <span className="text-4xl">{s.emoji}</span>
              <span className="font-bold text-primary text-sm leading-tight">{s.label}</span>
              <span className="text-xs text-gray-400 leading-tight">{s.description}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Questions ──────────────────────────────────────────────────────────────

  if (phase === 'questions' && currentQ) {
    const total = effective.length
    const progressPct = Math.round(((qIndex) / total) * 100)
    const cols = currentQ.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Progress bar */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-sm font-bold text-primary">
              <span>{service!.emoji}</span>
              <span>{service!.label}</span>
            </span>
            <span className="text-xs text-gray-400 tabular-nums">
              {qIndex + 1} / {total}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progressPct, 6)}%` }}
            />
          </div>
        </div>

        {/* Question + options */}
        <div key={animKey} className="px-6 py-6">
          <h2 className="text-lg sm:text-xl font-bold text-primary mb-1">{currentQ.question}</h2>
          {currentQ.hint && (
            <p className="text-sm text-gray-400 mb-5">{currentQ.hint}</p>
          )}
          {!currentQ.hint && <div className="mb-5" />}

          <div className={cn('grid gap-3', cols)}>
            {currentQ.options.map(opt => (
              <button
                key={opt.id}
                onClick={() => selectOption(currentQ.id, opt.id)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 sm:p-5',
                  'bg-gray-50 hover:bg-accent/5',
                  'border-2 border-transparent hover:border-accent',
                  'rounded-2xl transition-all duration-150 text-center',
                  'active:scale-95 cursor-pointer',
                  answers[currentQ.id] === opt.id && 'border-accent bg-accent/5',
                )}
              >
                <span className="text-3xl sm:text-4xl leading-none">{opt.emoji}</span>
                <span className="font-semibold text-primary text-sm leading-tight">{opt.label}</span>
                {opt.hint && (
                  <span className="text-xs text-gray-400 leading-tight">{opt.hint}</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={goBack}
            className="mt-6 flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </button>
        </div>
      </div>
    )
  }

  // ── Contact ────────────────────────────────────────────────────────────────

  if (phase === 'contact') {
    const summaryChips = effective
      .map(q => q.options.find(o => o.id === answers[q.id]))
      .filter(Boolean) as Option[]

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        {/* Answer summary */}
        <div className="mb-7">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ihre Auswahl</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full">
              {service!.emoji} {service!.label}
            </span>
            {summaryChips.map(opt => (
              <span
                key={opt.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {opt.emoji} {opt.label}
              </span>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold text-primary mb-6">Wie können wir Sie erreichen?</h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contact.name}
              onChange={e => { setContact(c => ({ ...c, name: e.target.value })); setContactErrors(e => ({ ...e, name: undefined })) }}
              placeholder="Vor- und Nachname"
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition',
                contactErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white',
              )}
            />
            {contactErrors.name && <p className="text-xs text-red-500 mt-1">{contactErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              E-Mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={e => { setContact(c => ({ ...c, email: e.target.value })); setContactErrors(e => ({ ...e, email: undefined })) }}
              placeholder="ihre@email.de"
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition',
                contactErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white',
              )}
            />
            {contactErrors.email && <p className="text-xs text-red-500 mt-1">{contactErrors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Telefon <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              value={contact.phone}
              onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
              placeholder="0152 …"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
            />
          </div>

          {/* File upload for relevant services */}
          {(serviceId === 'elektroinstallation' || serviceId === 'waermepumpe') && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Grundriss / Plan{' '}
                <span className="text-gray-400 font-normal">(optional, max. 5 MB)</span>
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f && f.size > 5 * 1024 * 1024) {
                    alert('Die Datei darf maximal 5 MB groß sein.')
                    e.target.value = ''
                    return
                  }
                  setFile(f ?? null)
                }}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent/10 file:text-accent file:font-semibold hover:file:bg-accent/20 cursor-pointer"
              />
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Anmerkungen <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={contact.message}
              onChange={e => setContact(c => ({ ...c, message: e.target.value }))}
              placeholder="Besonderheiten, offene Fragen oder weitere Informationen…"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition resize-none"
            />
          </div>

          {/* Privacy */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={contact.privacy}
                onChange={e => { setContact(c => ({ ...c, privacy: e.target.checked })); setContactErrors(e => ({ ...e, privacy: undefined })) }}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent/50 cursor-pointer shrink-0"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                Ich stimme der Verarbeitung meiner Daten zur Bearbeitung dieser Anfrage zu.{' '}
                <a href="/datenschutz" className="text-accent hover:underline">Datenschutzerklärung</a>
              </span>
            </label>
            {contactErrors.privacy && (
              <p className="text-xs text-red-500 mt-1">{contactErrors.privacy}</p>
            )}
          </div>
        </div>

        {submitError && (
          <div className="mt-5 flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        <div className="mt-7 flex items-center justify-between gap-4">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Wird gesendet…</>
            ) : (
              <><Send className="w-4 h-4" /> Anfrage absenden</>
            )}
          </button>
        </div>
      </div>
    )
  }

  return null
}
