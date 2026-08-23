type PropertyStatus = "available" | "reserved" | "sold";

/**
 * Listing status. `available` uses the brand green, `sold` a muted blue, and `reserved`
 * the warm highlight — the one place that colour still appears, because "reserved" is a
 * genuine caution state that neither green nor blue communicates.
 *
 * Status is carried by the label text, not by colour alone.
 */
const STATUS_STYLES: Record<PropertyStatus, string> = {
  available: "bg-brand-secondary text-white",
  reserved: "bg-brand-highlight text-brand-ink",
  sold: "bg-brand-primary/85 text-white",
};

const STATUS_LABEL: Record<PropertyStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <span
      className={`font-display inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6875rem] font-bold tracking-[0.12em] uppercase shadow-soft ${STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABEL[status]}
    </span>
  );
}
