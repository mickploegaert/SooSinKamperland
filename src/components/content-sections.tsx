import type { WebsiteContent } from "@/lib/data/types";

export function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph, index) => (
          <p key={index} className={`whitespace-pre-line ${className}`}>
            {paragraph}
          </p>
        ))}
    </>
  );
}

/** Toont de blokken die beheerders via het dashboard op een pagina zetten. */
export function ContentSections({ items }: { items: WebsiteContent[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-12">
      {items.map((item) => (
        <section
          key={item.id}
          aria-labelledby={`inhoud-${item.id}`}
          className="overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(17,17,43,0.08)] sm:flex"
        >
          {item.imageUrl ? (
            // Afbeeldingen komen van door beheerders opgegeven URL's, daarom geen next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt=""
              className="aspect-video w-full object-cover sm:aspect-auto sm:w-72 sm:shrink-0"
            />
          ) : null}
          <div className="space-y-3 p-6">
            <h2 id={`inhoud-${item.id}`} className="text-xl font-semibold text-soos-navy">
              {item.title}
            </h2>
            <Paragraphs text={item.body} className="text-base leading-relaxed" />
          </div>
        </section>
      ))}
    </div>
  );
}
