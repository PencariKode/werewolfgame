import { frijole } from "@/app/ui/fonts";

const AboutPage = () => {
    return (
        <div className="min-h-screen text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className={`text-3xl md:text-5xl font-bold md:mb-4 ${frijole.className}`}>WOLFMAN</h1>
                    <p className="text-xl text-gray-300">The Digital Werewolf Game Experience</p>
                </div>

                {/* Main Content */}
                <div className="space-y-12">
                    {/* Project Overview */}
                    <section className="space-y-4">
                        <h2 className="text-3xl font-semibold text-dark-text md:mb-6">Tentang Proyek</h2>
                        <p className="text-gray-300 leading-relaxed">
                            <b>WOLFMAN</b> adalah adaptasi digital dari permainan klasik Werewolf yang dirancang untuk
                            meningkatkan pengalaman bermain secara luring (tatap muka). Proyek ini dikembangkan
                            menggunakan teknologi web modern seperti Next.js, React.js, dan TailwindCSS untuk
                            memberikan pengalaman bermain yang optimal.
                        </p>
                    </section>

                    {/* Why WOLFMAN */}
                    <section className="space-y-4">
                        <h2 className="text-3xl font-semibold text-dark-text md:mb-6">Mengapa WOLFMAN?</h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="bg-dark-primary p-6 rounded-lg flex-1">
                                <h3 className="text-xl font-semibold mb-3 text-dark-secondary">Kemudahan Akses</h3>
                                <p className="text-gray-300">
                                    Berbasis web yang dapat diakses dari berbagai perangkat tanpa perlu instalasi tambahan.
                                </p>
                            </div>
                            <div className="bg-dark-primary p-6 rounded-lg flex-1">
                                <h3 className="text-xl font-semibold mb-3 text-dark-secondary">Fitur Real-time</h3>
                                <p className="text-gray-300">
                                    Dilengkapi dengan sistem chat real-time dan voting yang terintegrasi untuk pengalaman bermain yang lebih lancar.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="space-y-4">
                        <h2 className="text-3xl font-semibold text-dark-text md:mb-6">Fitur Utama</h2>
                        <div className="flex flex-col gap-4">
                            {[
                                'Real-time Chat untuk komunikasi antar pemain',
                                'Sistem voting in-game yang terintegrasi',
                                'Aturan dan peran yang sudah tertanam dalam sistem',
                                'Aturan yang dapat disesuaikan',
                                'Fitur khusus Gamemaster',
                                'Notifikasi otomatis untuk Gamemaster'
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center bg-dark-primary/90 p-4 rounded-lg">
                                    <div className="w-2 h-2 bg-dark-secondary rounded-full mr-4" />
                                    <p className="text-gray-300">{feature}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Technical Stack */}
                    <section className="space-y-4">
                        <h2 className="text-3xl font-semibold text-dark-text md:mb-6">Tech Stack</h2>
                        <div className="bg-dark-primary p-6 rounded-lg">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-3 text-dark-secondary">Front-end</h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li>• Next.js & React.js</li>
                                        <li>• TailwindCSS</li>
                                    </ul>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-3 text-dark-secondary">Back-end</h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li>• Node.js</li>
                                        <li>• Server-Side Events (SSE)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>


                </div>
            </div>
        </div>
    );
};

export default AboutPage;