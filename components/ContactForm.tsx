'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, AlertCircle, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Bitte vollständigen Namen eingeben'),
  email: z.string().email('Bitte gültige E-Mail-Adresse eingeben'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Bitte Betreff wählen'),
  message: z.string().min(20, 'Nachricht muss mindestens 20 Zeichen lang sein'),
  privacy: z.boolean().refine((val) => val === true, 'Datenschutz muss akzeptiert werden'),
  honeypot: z.string().max(0),
})

type FormData = z.infer<typeof schema>

const subjects = [
  'Anfrage Klimaanlage',
  'Anfrage Wärmepumpe',
  'Anfrage Elektroinstallation',
  'Anfrage Photovoltaik',
  'Anfrage Wallbox',
  'Wartung / E-Check',
  'Sonstiges',
]

const inputClass =
  'w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors text-sm'

const errorClass = 'text-red-500 text-xs mt-1'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { honeypot: '' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          subject: data.subject,
          message: data.message,
          _gotcha: data.honeypot,
        }),
      })

      if (!res.ok) throw new Error('Fehler beim Senden')

      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot (versteckt vor normalen Nutzern) */}
      <input
        {...register('honeypot')}
        type="text"
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Name <span className="text-accent">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="Max Mustermann"
            className={cn(inputClass, errors.name && 'border-red-400')}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            E-Mail <span className="text-accent">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="max@beispiel.de"
            className={cn(inputClass, errors.email && 'border-red-400')}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Telefon <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            {...register('phone')}
            type="tel"
            placeholder="+49 176 …"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Betreff <span className="text-accent">*</span>
          </label>
          <select
            {...register('subject')}
            className={cn(inputClass, errors.subject && 'border-red-400')}
          >
            <option value="">Bitte wählen …</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.subject && <p className={errorClass}>{errors.subject.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Ihre Nachricht <span className="text-accent">*</span>
        </label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="Beschreiben Sie kurz Ihr Vorhaben: Welches Objekt, welche Leistung, bis wann?"
          className={cn(inputClass, 'resize-none', errors.message && 'border-red-400')}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            {...register('privacy')}
            type="checkbox"
            className="mt-1 w-4 h-4 accent-accent shrink-0"
          />
          <span className="text-sm text-gray-600 leading-relaxed">
            Ich habe die{' '}
            <a href="/datenschutz" target="_blank" className="text-accent hover:underline">
              Datenschutzerklärung
            </a>{' '}
            gelesen und bin mit der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage
            einverstanden. <span className="text-accent">*</span>
          </span>
        </label>
        {errors.privacy && <p className={errorClass}>{errors.privacy.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white py-4 rounded-lg font-bold text-base transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg"
      >
        {isSubmitting ? (
          <span className="animate-pulse">Wird gesendet …</span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Anfrage senden
          </>
        )}
      </button>

      {status === 'success' && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800">Anfrage erfolgreich gesendet!</p>
            <p className="text-sm text-green-700 mt-1">
              Ich melde mich in der Regel innerhalb von 24 Stunden bei Ihnen.
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Fehler beim Senden</p>
            <p className="text-sm text-red-700 mt-1">
              Bitte versuchen Sie es erneut oder rufen Sie direkt an:{' '}
              <a href="tel:+49XXXXXXXXXX" className="underline">
                +49 XXX XXXXXXXX
              </a>
            </p>
          </div>
        </div>
      )}
    </form>
  )
}
