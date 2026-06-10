type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-12 text-center">
      <h2 className="text-lg font-medium text-stone-900">{title}</h2>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
