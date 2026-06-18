import { Search, CheckCircle, CalendarDays } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: '1. Otsi',
    description: 'Leia sobiv kultuuriprogramm vastavalt vanuserühmale, piirkonnale või õppeainele.',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: CheckCircle,
    title: '2. Vali',
    description: 'Tutvu programmi kirjeldusega, vaata hinda ja kättesaadavust ning tee oma valik.',
    color: 'bg-green-50 text-green-600'
  },
  {
    icon: CalendarDays,
    title: '3. Broneeri',
    description: 'Broneeri ühe klikiga. Kultuuriasutus kinnitab hiljem',
    color: 'bg-purple-50 text-purple-600'
  }
];

export function HowItWorks() {
  return (
    <div className="py-16 mb-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Kuidas see toimib?</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
            <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-6`}>
              <step.icon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}