import { School, Landmark, CheckCircle2 } from 'lucide-react';

export function UserRoles() {
  const roles = [
    {
      title: 'Õpetajale',
      icon: School,
      color: 'bg-blue-600',
      benefits: [
        'Leia kiirelt õppekavaga seotud programme',
        'Broneeri kogu klassile ühe klikiga',
        'Automaatne arveldus Kultuuriranitsa eelarvest',
        'Personaalsed soovitused vastavalt vanusegrupile'
      ],
      buttonText: 'Alusta otsingut',
      link: '/programs'
    },
    {
      title: 'Kultuuriasutusele',
      icon: Landmark,
      color: 'bg-green-600',
      benefits: [
        'Jõua tuhandete õpilaste ja õpetajateni',
        'Lihtne broneeringute ja kalendri haldus',
        'Kiire ja paberivaba asjaajamine riigiga',
        'Detailne statistika külastatavuse kohta'
      ],
      buttonText: 'Liitu platvormiga',
      link: '/signup'
    }
  ];

  return (
    <div className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kellele Kultuuriranits mõeldud on?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kultuuriranits on loodud sildade loomiseks hariduse ja kultuuri vahel, pakkudes väärtust mõlemale poolele.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className={`${role.color} p-3 rounded-2xl text-white shadow-lg shadow-${role.color.split('-')[1]}-200`}>
                  <role.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{role.title}</h3>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {role.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 ease-out transform active:scale-95 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${role.color} hover:opacity-90`}>
                {role.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}