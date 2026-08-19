export interface CoreValueCard {
  title: string
  description: string
  iconImage?: string
}

export interface MissionVisionProps {
  title: string
  cards: CoreValueCard[]
}

export function MissionVision({ title, cards }: MissionVisionProps) {
    return (
        <section className="py-16 md:py-24 bg-white text-slate-900">
            <div className="container-prose">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-12">{title}</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {cards.map((card, idx) => {
                        const iconBg = idx % 2 === 0 ? 'bg-blue-100' : 'bg-orange-100'
                        return (
                            <div key={idx} className="p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                {card.iconImage && (
                                    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-6 overflow-hidden`}>
                                        <img 
                                            src={card.iconImage} 
                                            alt={`About - ${card.title}`} 
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                )}
                                <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {card.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
