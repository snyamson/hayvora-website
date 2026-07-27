type PropertyStatus = "available" | "reserved" | "sold";

const STATUS_STYLES: Record<PropertyStatus, string> = {
  available: "bg-brand-primary text-brand-text-on-primary",
  reserved: "bg-amber-500 text-white",
  sold: "bg-slate-500 text-white",
};

const STATUS_LABEL: Record<PropertyStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
