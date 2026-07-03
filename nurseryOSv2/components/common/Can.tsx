type CanProps = {
  allowed: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/** Client-safe conditional render when caller already computed permission. */
export function Can({ allowed, children, fallback = null }: CanProps) {
  return allowed ? <>{children}</> : <>{fallback}</>;
}
