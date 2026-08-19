export function EntityComparison() {
    return (
        <section className="py-16 bg-slate-50">
            <div className="container-prose">

                <div className="mb-16">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-orange-500 pl-4">
                        Comparison of Business Entities (Features)
                    </h3>
                    <p className="text-slate-600 mb-6">Understanding the structural differences between various business entities.</p>

                    <div className="overflow-x-auto rounded-lg shadow-sm border border-slate-200 bg-white">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-orange-500 text-white uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Features</th>
                                    <th className="px-6 py-4 font-bold">Pvt Ltd Company</th>
                                    <th className="px-6 py-4 font-bold">LLP</th>
                                    <th className="px-6 py-4 font-bold">Partnership Firm</th>
                                    <th className="px-6 py-4 font-bold">Proprietorship</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { feat: 'Registration', pvt: 'Compulsory (MCA)', llp: 'Compulsory (MCA)', part: 'Optional', prop: 'Easy (No formal reg)' },
                                    { feat: 'Separate Legal Entity', pvt: 'Yes', llp: 'Yes', part: 'No', prop: 'No' },
                                    { feat: 'Liability', pvt: 'Limited', llp: 'Limited', part: 'Unlimited', prop: 'Unlimited' },
                                    { feat: 'Min Members', pvt: '2 Directors', llp: '2 Partners', part: '2 Partners', prop: '1 Owner' },
                                    { feat: 'Foreign Ownership', pvt: 'Allowed (FDI)', llp: 'Allowed (FDI)', part: 'Review Required', prop: 'Not Allowed' },
                                    { feat: 'Transferability', pvt: 'Transferable', llp: 'Transferable', part: 'Not Transferable', prop: 'Not Transferable' },
                                ].map((row, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-slate-100'}>
                                        <td className="px-6 py-4 font-semibold text-slate-700">{row.feat}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.pvt}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.llp}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.part}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.prop}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-orange-500 pl-4">
                        Compliance & Tax Comparison
                    </h3>
                    <p className="text-slate-600 mb-6">Analyzing the regulatory and tax implications for each entity type.</p>

                    <div className="overflow-x-auto rounded-lg shadow-sm border border-slate-200 bg-white">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#003B49] text-white uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Compliance</th>
                                    <th className="px-6 py-4 font-bold">Pvt Ltd Company</th>
                                    <th className="px-6 py-4 font-bold">LLP</th>
                                    <th className="px-6 py-4 font-bold">Partnership / Prop.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { comp: 'Statutory Audit', pvt: 'Mandatory', llp: 'If Turnover > 40L', part: 'If Turnover > 1Cr (Tax Audit)' },
                                    { comp: 'Annual Filing', pvt: 'Mandatory (MGT-7, AOC-4)', llp: 'Mandatory (Form 8, 11)', part: 'Income Tax Return Only' },
                                    { comp: 'Board Meetings', pvt: '4 per year', llp: 'Not Required', part: 'Not Required' },
                                    { comp: 'Tax Rate', pvt: '25% - 30% + Cess', llp: '30% + Cess', part: 'Slab Rates / 30%' },
                                    { comp: 'Penalty for Non-Compliance', pvt: 'High', llp: 'High', part: 'Moderate' },
                                ].map((row, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-slate-100'}>
                                        <td className="px-6 py-4 font-semibold text-slate-700">{row.comp}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.pvt}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.llp}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.part}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </section>
    )
}
