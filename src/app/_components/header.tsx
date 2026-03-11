import Link from "next/link";

export function Header() {
    return (
        <>
            {/* socials */}
            <div className="mb-6 flex items-center gap-3 text-sm text-white/80">
                <SocialLink href="https://open.spotify.com/artist/404Up20souVmA4SABPIAgI?si=bkavQmOPSvuDLsd3cc2QRg">
                    Spotify
                </SocialLink>
                <span className="opacity-40">/</span>
                <SocialLink href="https://www.instagram.com/oliverkeenanlyu">
                    Instagram
                </SocialLink>
                <span className="opacity-40">/</span>
                <SocialLink href="https://www.youtube.com/@oliverkeenanlyu">
                    YouTube
                </SocialLink>
            </div>

            <header className="mb-10">
                <Link href="/"><h1 className="text-xl">Oliver Lyu</h1></Link>
                <p className="mt-3 max-w-2xl text-sm text-white/80">
                   Film, TV & sync composer. Indie, electronic, neoclassical and ambient. Edinburgh, UK.{" "}
                    <a
                        href="mailto:oliver@oliverkeenanlyu.com"
                        className="underline underline-offset-4 hover:text-white"
                    >
                        oliver@oliverkeenanlyu.com
                    </a>
                </p>
            </header></>
    )
}

function SocialLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="hover:text-white"
    >
      {children}
    </a>
  );
}