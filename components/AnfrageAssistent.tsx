'use client'

import { useState, ChangeEvent } from 'react'
import { AirVent, Thermometer, Zap, Sun, Car, Wrench, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type ServiceId = 'klimaanlage' | 'elektroinstallation' | 'photovoltaik' | 'waermepumpe' | 'wallbox' | 'wartung'
type WizardStep = 'service' | 'questions' | 'contact' | 'summary' | 'success'
type QuestionType = 'radio' | 'multiselect' | 'file'
type AnswerValue = string | string[] | null

interface QuestionOption {
  value: string
  label: string
}

interface Question {
  id: string
  label: string
  type: QuestionType
  options?: QuestionOption[]
  required: boolean
  hint?: string
}

interface ServiceDef {
  id: ServiceId
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  questions: Question[]
}

interface QuizState {
  service: ServiceId | null
  answers: Record<string, AnswerValue>
  contact: { name: string; email: string; phone: string; message: string; privacy: boolean }
  file: File | null
}

// ── Service Definitions ───────────────────────────────────────────────────────

const SERVICES: ServiceDef[] = [
  {
    id: 'klimaanlage',
    label: 'Klimaanlage',
    description: 'Split- und Multisplitanlagen, Kühlen und Heizen',
    icon: AirVent,
    questions: [
      {
        id: 'verwendungszweck',
        label: 'Wofür soll die Anlage genutzt werden?',
        type: 'radio',
        required: true,
        options: [
          { value: 'nur_kuehlen', label: 'Nur kühlen' },
          { value: 'kuehlen_heizen', label: 'Kühlen und Heizen' },
        ],
      },
      {
        id: 'raumgroesse',
        label: 'Wie groß ist der Raum, den Sie klimatisieren möchten?',
        type: 'radio',
        required: true,
        hint: 'Wir zeigen Ihnen die passende Leistungsklasse.',
        options: [
          { value: 'bis_20', label: 'bis 20 m²' },
          { value: '20_35', label: '20 – 35 m²' },
          { value: '35_50', label: '35 – 50 m²' },
          { value: 'ueber_50', label: 'über 50 m²' },
        ],
      },
      {
        id: 'anzahl_raeume',
        label: 'Wie viele Räume sollen klimatisiert werden?',
        type: 'radio',
        required: true,
        options: [
          { value: '1', label: '1 Raum' },
          { value: '2_3', label: '2 – 3 Räume' },
          { value: '4_plus', label: '4 oder mehr Räume (Multisplit)' },
        ],
      },
    ],
  },
  {
    id: 'elektroinstallation',
    label: 'Elektroinstallation',
    description: 'Neuinstallation, Sanierung, Schaltschrankbau',
    icon: Zap,
    questions: [
      {
        id: 'art_massnahme',
        label: 'Um welche Art von Maßnahme geht es?',
        type: 'radio',
        required: true,
        options: [
          { value: 'neubau', label: 'Neuinstallation / Neubau' },
          { value: 'sanierung', label: 'Sanierung Bestandsbau' },
          { value: 'erweiterung', label: 'Erweiterung (Steckdosen, Licht, Schaltschrank)' },
        ],
      },
      {
        id: 'was_benoetigt',
        label: 'Was wird benötigt? (Mehrfachauswahl möglich)',
        type: 'multiselect',
        required: false,
        options: [
          { value: 'steckdosen', label: 'Steckdosen & Schalter' },
          { value: 'beleuchtung', label: 'Beleuchtung' },
          { value: 'schaltschrank', label: 'Schaltschrankbau' },
          { value: 'sonstiges', label: 'Sonstiges' },
        ],
      },
      {
        id: 'wohnflaeche',
        label: 'Wie groß ist das Objekt?',
        type: 'radio',
        required: true,
        options: [
          { value: 'bis_80', label: 'bis 80 m²' },
          { value: '80_150', label: '80 – 150 m²' },
          { value: '150_300', label: '150 – 300 m²' },
          { value: 'ueber_300', label: 'über 300 m²' },
        ],
      },
      {
        id: 'grundriss',
        label: 'Grundriss hochladen (optional)',
        type: 'file',
        required: false,
        hint: 'PDF, JPG oder PNG, max. 5 MB. Hilft uns bei der Einschätzung.',
      },
    ],
  },
  {
    id: 'photovoltaik',
    label: 'Photovoltaik',
    description: 'PV-Anlage mit Speicher, Netzanmeldung inklusive',
    icon: Sun,
    questions: [
      {
        id: 'dachausrichtung',
        label: 'Wie ist Ihr Dach ausgerichtet?',
        type: 'radio',
        required: true,
        options: [
          { value: 'sued', label: 'Süd' },
          { value: 'ost_west', label: 'Ost / West' },
          { value: 'flachdach', label: 'Flachdach' },
          { value: 'unbekannt', label: 'Weiß ich nicht' },
        ],
      },
      {
        id: 'dachflaeche',
        label: 'Wie groß ist Ihre nutzbare Dachfläche ungefähr?',
        type: 'radio',
        required: true,
        options: [
          { value: 'bis_30', label: 'bis 30 m²' },
          { value: '30_60', label: '30 – 60 m²' },
          { value: '60_100', label: '60 – 100 m²' },
          { value: 'ueber_100', label: 'über 100 m²' },
        ],
      },
      {
        id: 'speicher',
        label: 'Möchten Sie einen Batteriespeicher?',
        type: 'radio',
        required: true,
        options: [
          { value: 'ja', label: 'Ja' },
          { value: 'nein', label: 'Nein' },
          { value: 'weiss_nicht', label: 'Noch nicht sicher' },
        ],
      },
    ],
  },
  {
    id: 'waermepumpe',
    label: 'Wärmepumpe',
    description: 'Elektroanschluss, §14a EnWG, Netzbetreiber-Anmeldung',
    icon: Thermometer,
    questions: [
      {
        id: 'gebaeudezustand',
        label: 'Wie ist der Zustand des Gebäudes?',
        type: 'radio',
        required: true,
        options: [
          { value: 'neubau', label: 'Neubau' },
          { value: 'altbau_unsaniert', label: 'Altbau, unsaniert' },
          { value: 'altbau_saniert', label: 'Altbau, gut gedämmt' },
        ],
      },
      {
        id: 'wohnflaeche',
        label: 'Wie groß ist die Wohnfläche?',
        type: 'radio',
        required: true,
        options: [
          { value: 'bis_100', label: 'bis 100 m²' },
          { value: '100_150', label: '100 – 150 m²' },
          { value: '150_250', label: '150 – 250 m²' },
          { value: 'ueber_250', label: 'über 250 m²' },
        ],
      },
      {
        id: 'grundriss',
        label: 'Grundriss hochladen (optional)',
        type: 'file',
        required: false,
        hint: 'PDF, JPG oder PNG, max. 5 MB. Hilft uns bei der Planung.',
      },
    ],
  },
  {
    id: 'wallbox',
    label: 'Wallbox & E-Laden',
    description: 'AC-Laden mit 11 oder 22 kW, privat und gewerblich',
    icon: Car,
    questions: [
      {
        id: 'anzahl_ladepunkte',
        label: 'Wie viele Ladepunkte werden benötigt?',
        type: 'radio',
        required: true,
        options: [
          { value: '1', label: '1 Stellplatz' },
          { value: '2', label: '2 Stellplätze' },
          { value: '3_plus', label: '3 oder mehr Stellplätze' },
        ],
      },
      {
        id: 'nutzung',
        label: 'Wie wird die Wallbox genutzt?',
        type: 'radio',
        required: true,
        options: [
          { value: 'privat', label: 'Privat' },
          { value: 'gewerblich', label: 'Gewerblich / Firmenparkplatz' },
        ],
      },
    ],
  },
  {
    id: 'wartung',
    label: 'Wartung & E-Check',
    description: 'Klimawartung und DGUV-V3-Prüfungen',
    icon: Wrench,
    questions: [
      {
        id: 'art_service',
        label: 'Welche Leistung benötigen Sie?',
        type: 'radio',
        required: true,
        options: [
          { value: 'klimawartung', label: 'Klimaanlage warten' },
          { value: 'echeck', label: 'E-Check (DGUV V3)' },
          { value: 'beides', label: 'Beides' },
        ],
      },
      {
        id: 'anzahl_geraete',
        label: 'Wie viele Geräte / Anlagen sollen geprüft oder gewartet werden?',
        type: 'radio',
        required: true,
        options: [
          { value: '1', label: '1 Gerät' },
          { value: '2_5', label: '2 – 5 Geräte' },
          { value: '6_plus', label: '6 oder mehr Geräte' },
        ],
      },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const WEB3FORMS_KEY = 'ee3e1d2d-cb9e-4c4d-a0c7-2c17578fdcd4'

function getKwRecommendation(value: string | null): { text: string; type: 'info' | 'warning' } | null {
  switch (value) {
    case 'bis_20':   return { text: 'Empfohlene Leistung: ca. 2 kW – für kleine Räume gut geeignet.', type: 'info' }
    case '20_35':    return { text: 'Empfohlene Leistung: ca. 2,5 kW – die gängigste Einstiegsgröße.', type: 'info' }
    case '35_50':    return { text: 'Empfohlene Leistung: ca. 3,5 kW – für mittelgroße Räume.', type: 'info' }
    case 'ueber_50': return { text: 'Bei über 50 m² empfehlen wir eine Einschätzung vor Ort. Wir nennen Ihnen nach der Besichtigung die passende Leistung.', type: 'warning' }
    default:         return null
  }
}

function getServiceDef(id: ServiceId): ServiceDef {
  return SERVICES.find(s => s.id === id)!
}

function resolveOptionLabel(question: Question, value: string): string {
  return question.options?.find(o => o.value === value)?.label ?? value
}

function buildMessageText(state: QuizState): string {
  const svc = getServiceDef(state.service!)
  const lines: string[] = [`Leistung: ${svc.label}`, '']

  for (const q of svc.questions) {
    if (q.type === 'file') continue
    const raw = state.answers[q.id]
    if (!raw) continue
    let display: string
    if (q.type === 'multiselect' && Array.isArray(raw)) {
      display = raw.map(v => resolveOptionLabel(q, v)).join(', ')
    } else if (typeof raw === 'string') {
      display = resolveOptionLabel(q, raw)
      if (q.id === 'raumgroesse') {
        const kw = getKwRecommendation(raw)
        if (kw) display += ` (${kw.text})`
      }
    } else {
      display = String(raw)
    }
    lines.push(`${q.label}: ${display}`)
  }

  lines.push('')
  lines.push('--- Kontakt ---')
  lines.push(`Name: ${state.contact.name}`)
  lines.push(`E-Mail: ${state.contact.email}`)
  if (state.contact.phone) lines.push(`Telefon: ${state.contact.phone}`)
  if (state.contact.message) lines.push(`Anmerkungen: ${state.contact.message}`)
  if (state.file) lines.push(`Dateianhang: ${state.file.name}`)

  return lines.join('\n')
}

function validateQuestions(svc: ServiceDef, answers: Record<string, AnswerValue>): string[] {
  return svc.questions
    .filter(q => q.required && q.type !== 'file')
    .filter(q => {
      const v = answers[q.id]
      return !v || (Array.isArray(v) && v.length === 0)
    })
    .map(q => q.id)
}

type ContactErrors = Partial<Record<'name' | 'email' | 'privacy', string>>

function validateContact(c: QuizState['contact']): ContactErrors {
  const e: ContactErrors = {}
  if (!c.name.trim() || c.name.trim().length < 2) e.name = 'Bitte vollständigen Namen eingeben'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) e.email = 'Bitte gültige E-Mail-Adresse eingeben'
  if (!c.privacy) e.privacy = 'Bitte Datenschutzerklärung akzeptieren'
  return e
}

const STEP_LABELS = ['Leistung', 'Details', 'Kontakt', 'Zusammenfassung']

function stepIndex(step: WizardStep): number {
  return { service: 0, questions: 1, contact: 2, summary: 3, success: 3 }[step] ?? 0
}

const inputClass = 'w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors text-sm'
const errorClass = 'text-red-500 text-xs mt-1'

// ── Main Component ────────────────────────────────────────────────────────────

export default function AnfrageAssistent() {
  const [step, setStep] = useState<WizardStep>('service')
  const [quiz, setQuiz] = useState<QuizState>({
    service: null,
    answers: {},
    contact: { name: '', email: '', phone: '', message: '', privacy: false },
    file: null,
  })
  const [questionErrors, setQuestionErrors] = useState<string[]>([])
  const [contactErrors, setContactErrors] = useState<ContactErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleServiceSelect(id: ServiceId) {
    setQuiz(prev => ({
      ...prev,
      service: id,
      answers: id !== prev.service ? {} : prev.answers,
      file: id !== prev.service ? null : prev.file,
    }))
    setQuestionErrors([])
    setStep('questions')
  }

  function handleRadioChange(questionId: string, value: string) {
    setQuiz(prev => ({ ...prev, answers: { ...prev.answers, [questionId]: value } }))
    setQuestionErrors(prev => prev.filter(id => id !== questionId))
  }

  function handleMultiToggle(questionId: string, value: string) {
    setQuiz(prev => {
      const current = (prev.answers[questionId] as string[]) ?? []
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, answers: { ...prev.answers, [questionId]: updated } }
    })
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (file && file.size > 5 * 1024 * 1024) {
      alert('Die Datei ist zu groß (max. 5 MB). Bitte wählen Sie eine kleinere Datei.')
      e.target.value = ''
      return
    }
    if (file && !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      alert('Nur PDF, JPG oder PNG erlaubt.')
      e.target.value = ''
      return
    }
    setQuiz(prev => ({ ...prev, file }))
  }

  function handleContactChange(field: keyof QuizState['contact'], value: string | boolean) {
    setQuiz(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }))
    setContactErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function handleQuestionsNext() {
    const svc = getServiceDef(quiz.service!)
    const errors = validateQuestions(svc, quiz.answers)
    if (errors.length > 0) { setQuestionErrors(errors); return }
    setQuestionErrors([])
    setStep('contact')
  }

  function handleContactNext() {
    const errors = validateContact(quiz.contact)
    if (Object.keys(errors).length > 0) { setContactErrors(errors); return }
    setContactErrors({})
    setStep('summary')
  }

  function handleBack() {
    setQuestionErrors([])
    setContactErrors([])
    setSubmitError(null)
    if (step === 'questions') setStep('service')
    else if (step === 'contact') setStep('questions')
    else if (step === 'summary') setStep('contact')
  }

  async function handleSubmit() {
    if (isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const fd = new FormData()
      fd.append('access_key', WEB3FORMS_KEY)
      fd.append('from_name', quiz.contact.name)
      fd.append('replyto', quiz.contact.email)
      fd.append('subject', `Anfrageassistent: ${getServiceDef(quiz.service!).label}`)
      fd.append('botcheck', '')
      fd.append('message', buildMessageText(quiz))
      if (quiz.file) fd.append('attachment', quiz.file, quiz.file.name)

      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
      const json = await res.json()
      if (!json.success) throw new Error(json.message ?? 'Unbekannter Fehler')
      setStep('success')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Bitte versuchen Sie es erneut.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetWizard() {
    setStep('service')
    setQuiz({ service: null, answers: {}, contact: { name: '', email: '', phone: '', message: '', privacy: false }, file: null })
    setQuestionErrors([])
    setContactErrors({})
    setSubmitError(null)
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      {step !== 'success' && (
        <div className="flex items-center gap-2">
          {STEP_LABELS.map((label, i) => {
            const current = stepIndex(step)
            const done = i < current
            const active = i === current
            return (
              <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                    done  && 'bg-accent text-white',
                    active && 'bg-accent text-white ring-4 ring-accent/20',
                    !done && !active && 'bg-gray-100 text-gray-400'
                  )}>
                    {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={cn('text-xs hidden sm:block', active ? 'text-accent font-semibold' : 'text-gray-400')}>
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={cn('h-0.5 flex-1 mb-4 transition-all', done ? 'bg-accent' : 'bg-gray-200')} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Step: Service Selection ─────────────────────────────────────────── */}
      {step === 'service' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-primary mb-2">Was können wir für Sie tun?</h2>
          <p className="text-gray-500 text-sm mb-6">Wählen Sie die Leistung, zu der Sie eine Anfrage stellen möchten.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SERVICES.map(svc => {
              const Icon = svc.icon
              const selected = quiz.service === svc.id
              return (
                <button
                  key={svc.id}
                  onClick={() => handleServiceSelect(svc.id)}
                  className={cn(
                    'flex flex-col items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 hover:border-accent/50 hover:bg-accent/5',
                    selected ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', selected ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500')}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={cn('font-semibold text-sm', selected ? 'text-accent' : 'text-primary')}>{svc.label}</p>
                    <p className="text-gray-400 text-xs mt-0.5 leading-tight">{svc.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Step: Questions ─────────────────────────────────────────────────── */}
      {step === 'questions' && quiz.service && (() => {
        const svc = getServiceDef(quiz.service)
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
            <div>
              <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">{svc.label}</p>
              <h2 className="text-xl font-bold text-primary">Ein paar Details zu Ihrem Vorhaben</h2>
            </div>

            {svc.questions.map(q => (
              <div key={q.id}>
                <p className="font-semibold text-gray-800 text-sm mb-1">{q.label}</p>
                {q.hint && <p className="text-gray-400 text-xs mb-3">{q.hint}</p>}

                {/* Radio */}
                {q.type === 'radio' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options!.map(opt => {
                      const selected = quiz.answers[q.id] === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleRadioChange(q.id, opt.value)}
                          className={cn(
                            'px-4 py-3 rounded-lg border-2 text-sm font-medium text-left transition-all',
                            selected ? 'border-accent bg-accent/5 text-accent' : 'border-gray-200 text-gray-700 hover:border-accent/40'
                          )}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Multiselect */}
                {q.type === 'multiselect' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options!.map(opt => {
                      const selected = (quiz.answers[q.id] as string[] ?? []).includes(opt.value)
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleMultiToggle(q.id, opt.value)}
                          className={cn(
                            'px-4 py-3 rounded-lg border-2 text-sm font-medium text-left transition-all',
                            selected ? 'border-accent bg-accent/5 text-accent' : 'border-gray-200 text-gray-700 hover:border-accent/40'
                          )}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* File */}
                {q.type === 'file' && (
                  <div>
                    {quiz.file ? (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Upload className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-sm text-gray-700 flex-1 truncate">{quiz.file.name}</span>
                        <button
                          type="button"
                          onClick={() => setQuiz(prev => ({ ...prev, file: null }))}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Datei auswählen …</span>
                        <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="sr-only" onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                )}

                {/* kW Callout for Klimaanlage */}
                {q.id === 'raumgroesse' && quiz.answers['raumgroesse'] && (() => {
                  const kw = getKwRecommendation(quiz.answers['raumgroesse'] as string)
                  if (!kw) return null
                  return (
                    <div className={cn(
                      'mt-3 flex items-start gap-3 p-3 rounded-xl border text-sm',
                      kw.type === 'info'
                        ? 'bg-accent/5 border-accent/20 text-accent'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    )}>
                      <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{kw.text}</span>
                    </div>
                  )
                })()}

                {questionErrors.includes(q.id) && (
                  <p className={errorClass}>Bitte eine Option wählen.</p>
                )}
              </div>
            ))}

            <div className="flex justify-between pt-2">
              <button onClick={handleBack} className="flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Zurück
              </button>
              <button onClick={handleQuestionsNext} className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-bold text-sm transition-all hover:shadow-lg">
                Weiter <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })()}

      {/* ── Step: Contact ────────────────────────────────────────────────────── */}
      {step === 'contact' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5">
          <h2 className="text-xl font-bold text-primary">Wie können wir Sie erreichen?</h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name <span className="text-accent">*</span></label>
              <input
                type="text"
                placeholder="Max Mustermann"
                value={quiz.contact.name}
                onChange={e => handleContactChange('name', e.target.value)}
                className={cn(inputClass, contactErrors.name && 'border-red-400')}
              />
              {contactErrors.name && <p className={errorClass}>{contactErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-Mail <span className="text-accent">*</span></label>
              <input
                type="email"
                placeholder="max@beispiel.de"
                value={quiz.contact.email}
                onChange={e => handleContactChange('email', e.target.value)}
                className={cn(inputClass, contactErrors.email && 'border-red-400')}
              />
              {contactErrors.email && <p className={errorClass}>{contactErrors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              type="tel"
              placeholder="+49 152 …"
              value={quiz.contact.phone}
              onChange={e => handleContactChange('phone', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Anmerkungen <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              rows={3}
              placeholder="Gibt es noch etwas, das wir wissen sollten?"
              value={quiz.contact.message}
              onChange={e => handleContactChange('message', e.target.value)}
              className={cn(inputClass, 'resize-none')}
            />
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={quiz.contact.privacy}
                onChange={e => handleContactChange('privacy', e.target.checked)}
                className={cn('mt-1 w-4 h-4 accent-accent shrink-0', contactErrors.privacy && 'outline outline-red-400')}
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                Ich habe die{' '}
                <a href="/datenschutz" target="_blank" className="text-accent hover:underline">Datenschutzerklärung</a>{' '}
                gelesen und bin mit der Verarbeitung meiner Daten einverstanden. <span className="text-accent">*</span>
              </span>
            </label>
            {contactErrors.privacy && <p className={errorClass}>{contactErrors.privacy}</p>}
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={handleBack} className="flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Zurück
            </button>
            <button onClick={handleContactNext} className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-bold text-sm transition-all hover:shadow-lg">
              Weiter <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step: Summary ────────────────────────────────────────────────────── */}
      {step === 'summary' && quiz.service && (() => {
        const svc = getServiceDef(quiz.service)
        const Icon = svc.icon
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-primary">Alles korrekt?</h2>

            {/* Service */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <span className="font-bold text-primary">{svc.label}</span>
                <button onClick={() => setStep('service')} className="ml-auto text-xs text-accent hover:underline">Ändern</button>
              </div>

              {svc.questions.filter(q => q.type !== 'file').map(q => {
                const raw = quiz.answers[q.id]
                if (!raw) return null
                let display: string
                if (q.type === 'multiselect' && Array.isArray(raw)) {
                  display = raw.length > 0 ? raw.map(v => resolveOptionLabel(q, v)).join(', ') : '–'
                } else {
                  display = resolveOptionLabel(q, raw as string)
                }
                return (
                  <div key={q.id} className="flex justify-between text-sm gap-4">
                    <span className="text-gray-500">{q.label}</span>
                    <span className="text-gray-800 font-medium text-right">{display}</span>
                  </div>
                )
              })}
              {quiz.file && (
                <div className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500">Dateianhang</span>
                  <span className="text-gray-800 font-medium">{quiz.file.name}</span>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-primary text-sm">Kontaktdaten</span>
                <button onClick={() => setStep('contact')} className="text-xs text-accent hover:underline">Ändern</button>
              </div>
              {[
                { label: 'Name', value: quiz.contact.name },
                { label: 'E-Mail', value: quiz.contact.email },
                { label: 'Telefon', value: quiz.contact.phone || '–' },
                ...(quiz.contact.message ? [{ label: 'Anmerkungen', value: quiz.contact.message }] : []),
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="text-gray-800 font-medium text-right">{row.value}</span>
                </div>
              ))}
            </div>

            {submitError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 text-sm">Fehler beim Senden</p>
                  <p className="text-red-700 text-sm mt-0.5">{submitError} – oder rufen Sie uns an: <a href="tel:+4915207541151" className="underline">0152 07541151</a></p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button onClick={handleBack} className="flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Zurück
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-bold text-sm transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <span className="animate-pulse">Wird gesendet …</span> : <><CheckCircle className="w-4 h-4" /> Anfrage absenden</>}
              </button>
            </div>
          </div>
        )
      })()}

      {/* ── Step: Success ────────────────────────────────────────────────────── */}
      {step === 'success' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Vielen Dank, {quiz.contact.name.split(' ')[0]}!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Ihre Anfrage für <strong>{quiz.service ? getServiceDef(quiz.service).label : ''}</strong> ist bei uns eingegangen.
            Wir melden uns in der Regel innerhalb von 24 Stunden bei Ihnen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 hover:border-primary hover:text-primary px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
              Zur Startseite
            </Link>
            <button onClick={resetWizard} className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:shadow-lg">
              Neue Anfrage starten
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
