import { lazy } from "react";

export function lazyPage<T extends Record<string, React.ComponentType>>(factory: () => Promise<T>, name: keyof T) {
  return lazy(() => factory().then((m) => ({ default: m[name] })));
}
