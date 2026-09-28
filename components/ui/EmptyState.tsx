export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="pixel-panel rounded-xl px-6 py-16 text-center">
      <p className="font-display text-sm text-ink sm:text-base">{title}</p>
      <p className="mt-3 text-sm text-ink-soft">{description}</p>
    </div>
  );
}
