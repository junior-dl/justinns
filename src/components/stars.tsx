import clsx from "clsx";

/** Rating shown as five dots, filled in salmon — the remastered design's style. */
export function Stars({ value, size = 10 }: { value: number; size?: number }) {
  const filled = Math.floor(value);
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ width: size, height: size }}
          className={clsx("inline-block rounded-full border border-salmon", i <= filled && "bg-salmon")} />
      ))}
    </span>
  );
}
