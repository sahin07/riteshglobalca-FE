import { Section } from './Section'

export interface OurStoryProps {
    title: string
    content: string
    imageUrl?: string
}

export function OurStory({ title, content, imageUrl }: OurStoryProps) {
    return (
        <section className="py-16 md:py-24 bg-white text-slate-900">
            <div className="container-prose">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="prose prose-lg text-slate-600">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-12">{title}</h2>
                        {content.split('\n').filter(Boolean).map((para, index) => (
                            <><p key={index}>{para}</p> <br /></>
                        ))}
                    </div>
                    <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden bg-slate-100 shadow-xl">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover object-center"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
