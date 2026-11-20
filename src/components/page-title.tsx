export function PageTitle({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="text-4xl font-bold tracking-tight text-soos-dark sm:text-5xl">
        {title}
      </h1>
    </div>
  );
}
