import type { Availability } from "../lib/types";

const STYLES: Record<Availability, string> = {
  DISPONIBLE: "bg-ok-bg text-ok",
  AGOTADO: "bg-danger-bg text-danger",
  PROXIMAMENTE: "bg-warn-bg text-warn",
};

const LABELS: Record<Availability, string> = {
  DISPONIBLE: "Disponible",
  AGOTADO: "Agotado",
  PROXIMAMENTE: "Próximamente",
};

export default function AvailabilityBadge({ value }: { value: Availability }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[value]}`}>
      {LABELS[value]}
    </span>
  );
}
