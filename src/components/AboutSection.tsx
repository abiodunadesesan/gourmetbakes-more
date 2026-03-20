import Image from 'next/image';

export default function AboutSection() {
    return (
        <section id="about" className="py-24 bg-secondary/10 border-y border-white/5 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl rounded-full translate-x-1/2 -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div className="relative h-[500px] sm:h-[600px] w-full group">
                        <Image
                            src="https://images.unsplash.com/photo-1549590143-d5855148a9d5?q=80&w=1000&auto=format&fit=crop"
                            alt="Baker at work"
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
                        />
                        {/* Elegant border offset */}
                        <div className="absolute -bottom-6 -right-6 w-full h-full border border-primary/30 -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 duration-700"></div>
                    </div>

                    <div className="pl-0 lg:pl-4">
                        <span className="text-primary text-xs uppercase tracking-[0.3em] font-semibold mb-4 block">Our Heritage</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">
                            A Legacy of <br /><span className="italic text-primary font-normal">Artisanal Baking</span>
                        </h2>
                        <div className="space-y-6 text-gray-400 leading-relaxed font-light text-lg">
                            <p>
                                Founded on passion and elevated by uncompromising standards, GourmetBakes blends classical French techniques with modern flavor profiles. Every loaf, pastry, and cake that leaves our ovens tells a story of dedication to the craft.
                            </p>
                            <p>
                                We source only the finest ingredients: single-origin chocolates, local organic stone-milled flours, and European-style butter, ensuring that our creations offer an experience that dances on the palate.
                            </p>
                        </div>

                        <div className="mt-12 flex items-center gap-6">
                            <div className="w-16 h-[1px] bg-primary"></div>
                            <div>
                                <p className="font-serif text-white text-xl">Chef Antoine Dubois</p>
                                <p className="text-primary text-sm tracking-widest uppercase mt-1">Master Baker</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
