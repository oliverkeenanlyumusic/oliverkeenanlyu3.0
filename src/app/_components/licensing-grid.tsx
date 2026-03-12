import Image from "next/image";
import { publishers } from "@/server/publishers";

export function LicensingGrid() {
    if (publishers.length === 0) return null;

    return (
        <section className="mt-16">
            <div className="mb-6 flex items-center items-baseline gap-4">
                <h2 className="text-sm uppercase tracking-widest text-white/60">
                    Licencing & Publishing
                </h2>
                <div className="h-px flex-1 bg-white/40" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {publishers.map((pub) => (
                    <a
                        key={pub.name}
                        href={pub.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative block overflow-hidden rounded-sm bg-white/5 aspect-square hover:bg-white/10 transition-colors"
                    >
                        <Image
                            src={pub.logo}
                            alt={pub.name}
                            fill
                            className="object-contain p-6 transition duration-300 group-hover:scale-[1.03] opacity-70 group-hover:opacity-100"
                        />
                    </a>
                ))}
            </div>
        </section>
    );
}