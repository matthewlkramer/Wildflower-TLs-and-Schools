/**
 * School “Summary” tab. This is the landing view when opening a school detail.
 * The top card shows branding: the school logo (several possible Airtable
 * fields are checked), the full and short name, governance model, ages served,
 * open date, and membership status. If the Airtable `about` or
 * `aboutSpanish` fields are populated, an About/Descripción toggle is rendered
 * allowing language switching without leaving the page. Below the hero card a
 * `DetailGrid` organizes read‑only `InfoCard` sections for a map, contact
 * information, and leadership. The map uses the school’s active latitude and
 * longitude and falls back to the active physical address when coordinates are
 * missing. Contact info lists phone, email, and website (hyperlinked). The
 * leadership card lists founders and current teacher leaders. Everything in this
 * tab is display‑only; there is no editing or server interaction here.
 */
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { InfoCard } from '@/components/shared/InfoCard';
import { DetailGrid } from '@/components/shared/DetailGrid';
// Types handled inline to avoid import issues
import { GoogleMap } from '@/components/google-map';

export function SummaryTab({ school }: { school: any }) {
  const [aboutLang, setAboutLang] = useState<'en' | 'es'>('en');
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-md overflow-hidden flex items-center justify-center">
              {(school as any).logoMainRectangle || (school as any).logoMainSquare || (school as any).logo ? (
                <img
                  src={(school as any).logoMainRectangle || (school as any).logoMainSquare || (school as any).logo}
                  alt={`${school.name} logo`}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-center">
                  <svg className="w-10 h-10 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{school.name}</h2>
                <p className="text-lg text-gray-600 mt-1">{school.shortName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Governance</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{(school as any).governanceModel || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Ages Served</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{Array.isArray((school as any).agesServed) ? (school as any).agesServed.join(', ') : ((school as any).agesServed || 'Not specified')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Open Date</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{(school as any).openDate || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Membership</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{(school as any).membershipStatus || 'Not specified'}</p>
              </div>
            </div>
            {((school as any).about || (school as any).aboutSpanish) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <button type="button" onClick={() => setAboutLang('en')} className={`text-xs uppercase tracking-wider ${aboutLang === 'en' ? 'text-gray-700 font-medium' : 'text-gray-500 hover:text-gray-700'}`}>About</button>
                  {(school as any).aboutSpanish && (
                    <>
                      <span className="text-gray-300">•</span>
                      <button type="button" onClick={() => setAboutLang('es')} className={`text-xs uppercase tracking-wider ${aboutLang === 'es' ? 'text-gray-700 font-medium' : 'text-gray-500 hover:text-gray-700'}`}>descripción</button>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {aboutLang === 'es' && (school as any).aboutSpanish ? (school as any).aboutSpanish : ((school as any).about || '')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailGrid>
        <InfoCard
          title="Leadership"
          columns={1}
          editable={false}
          fields={[
            { key: 'founders', label: 'Founders', type: 'readonly', value: (school as any)?.foundersFullNames ?? (school as any)?.founders ?? [], render: (v: any[]) => (v && v.length ? v.join(', ') : <span className="text-slate-400">Not specified</span>) },
            { key: 'currentTLs', label: 'Current TLs', type: 'readonly', value: (school as any)?.currentTLs ?? [], render: () => {
              const v = (school as any)?.currentTLs;
              if (typeof v === 'string') return v || <span className="text-slate-400">None assigned</span>;
              if (Array.isArray(v) && v.length > 0) return v.join(', ');
              return <span className="text-slate-400">None assigned</span>;
            } },
          ]}
        />

        <InfoCard
          title="Size and Program"
          columns={1}
          editable={false}
          fields={[
            { key: 'enrollmentCap', label: 'Enrollment Capacity', type: 'readonly', value: (school as any)?.enrollmentCap ?? '' },
            { key: 'numberOfClassrooms', label: 'Number of Classrooms', type: 'readonly', value: (school as any)?.numberOfClassrooms ?? '' },
            { key: 'programFocus', label: 'Program Focus', type: 'readonly', value: Array.isArray((school as any)?.programFocus) ? (school as any).programFocus.join(', ') : ((school as any)?.programFocus || '') },
          ]}
        />

        <InfoCard title="Location" columns={1} editable={false} fields={[]}> 
          <GoogleMap 
            latitude={(school as any).activeLatitude}
            longitude={(school as any).activeLongitude}
            schoolName={school.name}
            shortName={school.shortName}
            fallbackAddress={(school as any).activePhysicalAddress}
            schoolLogo={(school as any).logoFlowerOnly || (school as any).logoMainSquare || (school as any).logo}
          />
        </InfoCard>
        <InfoCard
          title="Contact Info"
          columns={1}
          editable={false}
          fields={[
            { key: 'schoolPhone', label: 'School Phone', type: 'readonly', value: (school as any)?.schoolPhone || '' },
            { key: 'schoolEmail', label: 'School Email', type: 'readonly', value: (school as any)?.schoolEmail || '' },
            { key: 'website', label: 'Website', type: 'readonly', value: (school as any)?.website || '', render: (url) => url ? (<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>) : (<span className="text-slate-400">-</span>) },
          ]}
        />
        <InfoCard
          title="Support"
          columns={1}
          editable={false}
          fields={[]}
          // fields={[
          //   { key: 'supportContact', label: 'Support Contact', type: 'readonly', value: (school as any)?.supportContact || '' },
          //  { key: 'supportEmail', label: 'Support Email', type: 'readonly', value: (school as any)?.supportEmail || '' },
          //]}
        />

        <InfoCard
          title="Status and Monitoring"
          columns={1}
          editable={false}
          fields={[
            { key: 'riskFactors', label: 'Risk Factors', type: 'readonly', value: (school as any)?.riskFactors ?? [], render: (v: any[]) => v && v.length ? (
              <div className="flex flex-wrap gap-1">{v.map((x: string, i: number) => <Badge key={i} variant="destructive" className="text-xs">{x}</Badge>)}</div>
            ) : <span className="text-slate-400">None</span> },
            { key: 'watchlist', label: 'Watchlist', type: 'readonly', value: (school as any)?.watchlist ?? [], render: (v: any[]) => v && v.length ? (
              <div className="flex flex-wrap gap-1">{v.map((x: string, i: number) => <Badge key={i} variant="outline" className="text-xs border-orange-300 text-orange-700">{x}</Badge>)}</div>
            ) : <span className="text-slate-400">None</span> },
            { key: 'errors', label: 'Errors', type: 'readonly', value: (school as any)?.errors ?? [], render: (v: any[]) => v && v.length ? (
              <div className="flex flex-wrap gap-1">{v.map((x: string, i: number) => <Badge key={i} variant="destructive" className="text-xs">{x}</Badge>)}</div>
            ) : <span className="text-slate-400">None</span> },
          ]}
        />
      </DetailGrid>

    </div>
  );
}

