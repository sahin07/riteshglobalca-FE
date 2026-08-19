import clsx from 'clsx'

export interface ComparisonFeatureItem {
  featureName: string
  basicValue?: string
  standardValue?: string
  premiumValue?: string
}

export interface ComparisonTableProps {
  title: string
  features: ComparisonFeatureItem[]
}

export function ComparisonTable({ title, features }: ComparisonTableProps) {
    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="container-prose">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">{title}</h2>

                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full text-left bg-white text-sm">
                        <thead className="bg-[#0f283d] text-white">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Features</th>
                                <th className="px-6 py-4 font-semibold w-1/4">Basic</th>
                                <th className="px-6 py-4 font-semibold w-1/4">Standard</th>
                                <th className="px-6 py-4 font-semibold w-1/4">Premium</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {features.map((f, index) => (
                                <tr key={f.featureName || index} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{f.featureName}</td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        <span className={clsx(
                                            f.basicValue === 'Included' && 'text-emerald-600',
                                            f.basicValue === 'Not Included' && 'text-slate-400'
                                        )}>{f.basicValue}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        <span className={clsx(
                                            f.standardValue === 'Included' && 'text-emerald-600 md:font-bold',
                                            f.standardValue === 'Not Included' && 'text-slate-400'
                                        )}>{f.standardValue}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        <span className={clsx(
                                            f.premiumValue === 'Included' && 'text-emerald-600 md:font-bold',
                                            f.premiumValue === 'Not Included' && 'text-slate-400'
                                        )}>{f.premiumValue}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
