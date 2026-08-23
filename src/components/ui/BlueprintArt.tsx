import type { CSSProperties } from "react";

/**
 * Technical line drawings of the equipment the group actually works with — plant for
 * Infrastructure, survey instruments for JHM Geo Consult, growing structures for
 * AgriSystem.
 *
 * These exist to break up the solid colour bands. A flat slab of deep green repeated
 * across the CTA, the vision/mission panel and the divisions index made those sections
 * read as the same block three times; a drawing bled off the corner at low opacity
 * gives each one its own character without adding a photograph (which would compete
 * with the copy) or a new colour.
 *
 * Drawn as outlines rather than fills so they read as blueprints, and hand-authored as
 * a handful of paths each — small enough to inline, so there's no extra request and
 * they inherit `currentColor` from whatever band they sit in.
 */

export type BlueprintArtName =
  | "excavator"
  | "crane"
  | "dumpTruck"
  | "totalStation"
  | "levellingRod"
  | "drone"
  | "greenhouse";

const STROKE: CSSProperties = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/* -------------------------------------------------------------------------- */
/* Infrastructure — plant                                                      */
/* -------------------------------------------------------------------------- */

function Excavator() {
  return (
    <g style={STROKE}>
      {/* Track frame, sprockets and rollers */}
      <path d="M35 132 H89 A17 17 0 0 1 89 166 H35 A17 17 0 0 1 35 132 Z" />
      <circle cx="35" cy="149" r="10" />
      <circle cx="89" cy="149" r="10" />
      <circle cx="51" cy="160" r="4" />
      <circle cx="62" cy="160" r="4" />
      <circle cx="73" cy="160" r="4" />
      {/* House, counterweight and cab glazing */}
      <path d="M28 132 V108 H44 L52 94 H102 V132 Z" />
      <path d="M58 100 H80 V124 H58 Z" />
      {/* Boom, stick and bucket */}
      <path d="M102 114 Q126 74 160 64" />
      <path d="M160 64 L184 104" />
      <path d="M184 104 L192 120 L212 116 L206 98 Z" />
      <path d="M194 120 l2 6 M202 118 l2 6 M209 117 l2 6" />
      {/* Hydraulic rams */}
      <path d="M108 100 L138 80" />
      <path d="M150 72 L176 92" />
    </g>
  );
}

function Crane() {
  return (
    <g style={STROKE}>
      {/* Mast with cross bracing */}
      <path d="M104 164 V46 M120 164 V46" />
      <path d="M104 160 L120 140 L104 120 L120 100 L104 80 L120 60 L104 46" />
      <path d="M104 140 H120 M104 100 H120 M104 60 H120" />
      <path d="M92 164 H132" />
      {/* Slewing cab */}
      <path d="M108 34 H132 V46 H108 Z" />
      {/* Jib and counter-jib */}
      <path d="M118 38 H222 M118 50 H214" />
      <path d="M132 38 L142 50 L154 38 L166 50 L178 38 L190 50 L202 38" />
      <path d="M106 38 H50 M106 50 H58" />
      <path d="M44 34 H62 V52 H44 Z" />
      {/* A-frame and tie bars */}
      <path d="M112 38 L118 12 L124 38" />
      <path d="M118 12 L216 38 M118 12 L52 38" />
      {/* Trolley, cable and hook block */}
      <path d="M180 36 H192 V44 H180 Z" />
      <path d="M186 44 V96" />
      <path d="M180 96 H192 V104 H180 Z" />
      <path d="M186 104 c0 8 -8 9 -8 2" />
    </g>
  );
}

function DumpTruck() {
  return (
    <g style={STROKE}>
      {/* Tipping body */}
      <path d="M88 70 H206 V112 H88 Z" />
      <path d="M110 70 V112 M136 70 V112 M162 70 V112 M184 70 V112" />
      {/* Cab, glazing and bonnet */}
      <path d="M30 84 H82 V126 H30 Z" />
      <path d="M38 90 H64 V108 H38 Z" />
      <path d="M30 110 L18 116 V126" />
      {/* Chassis and wheels */}
      <path d="M18 126 H210 V134 H18 Z" />
      <circle cx="52" cy="142" r="15" />
      <circle cx="52" cy="142" r="6" />
      <circle cx="166" cy="142" r="15" />
      <circle cx="166" cy="142" r="6" />
      <circle cx="198" cy="142" r="15" />
      <circle cx="198" cy="142" r="6" />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* JHM Geo Consult — survey instruments                                        */
/* -------------------------------------------------------------------------- */

function TotalStation() {
  return (
    <g style={STROKE}>
      {/* Tripod, feet and tie */}
      <path d="M120 66 L74 160 M120 66 V162 M120 66 L166 160" />
      <path d="M68 160 H82 M113 162 H127 M160 160 H174" />
      <path d="M96 116 H144" />
      {/* Tribrach and instrument body */}
      <path d="M96 60 H144 V68 H96 Z" />
      <path d="M100 30 H140 V60 H100 Z" />
      {/* Telescope, objective and eyepiece */}
      <path d="M104 38 H136 V52 H104 Z" />
      <circle cx="106" cy="45" r="5" />
      <path d="M136 41 H150 V49 H136 Z" />
      {/* Carry handle and display */}
      <path d="M108 30 C112 18 128 18 132 30" />
      <path d="M104 54 H128" />
    </g>
  );
}

function LevellingRod() {
  return (
    <g style={STROKE}>
      {/* Staff body and foot plate */}
      <path d="M108 14 H132 V150 H108 Z" />
      <path d="M100 150 H140 V160 H100 Z" />
      {/* Decimetre divisions */}
      <path d="M108 32 H132 M108 50 H132 M108 68 H132 M108 86 H132 M108 104 H132 M108 122 H132 M108 140 H132" />
      {/* The E-pattern that makes a levelling staff readable through a telescope —
          alternating which side the spine sits on, as on a real rod. */}
      <path d="M112 18 V32 M112 18 H128 M112 25 H124 M112 32 H128" />
      <path d="M128 54 V68 M128 54 H112 M128 61 H120 M128 68 H112" />
      <path d="M112 90 V104 M112 90 H128 M112 97 H124 M112 104 H128" />
      <path d="M128 126 V140 M128 126 H112 M128 133 H120 M128 140 H112" />
    </g>
  );
}

function Drone() {
  return (
    <g style={STROKE}>
      {/* Fuselage and gimbal camera */}
      <path d="M104 72 H136 V98 H104 Z" />
      <circle cx="120" cy="106" r="8" />
      {/* Arms and motors */}
      <path d="M104 76 L66 54 M136 76 L174 54 M104 94 L66 116 M136 94 L174 116" />
      <path d="M60 48 H72 V58 H60 Z M168 48 H180 V58 H168 Z M60 112 H72 V122 H60 Z M168 112 H180 V122 H168 Z" />
      {/* Rotor discs, dashed to read as motion */}
      <circle cx="66" cy="46" r="24" strokeDasharray="5 7" />
      <circle cx="174" cy="46" r="24" strokeDasharray="5 7" />
      <circle cx="66" cy="124" r="24" strokeDasharray="5 7" />
      <circle cx="174" cy="124" r="24" strokeDasharray="5 7" />
      {/* Landing skids */}
      <path d="M100 98 L94 126 M140 98 L146 126" />
      <path d="M84 126 H104 M136 126 H156" />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* AgriSystem & Analytics — growing structures                                 */
/* -------------------------------------------------------------------------- */

function Greenhouse() {
  return (
    <g style={STROKE}>
      {/* Outer hoop and successive ribs, receding into the tunnel */}
      <path d="M32 146 C32 58 208 58 208 146" />
      <path d="M56 146 C56 76 184 76 184 146" />
      <path d="M80 146 C80 92 160 92 160 146" />
      <path d="M104 146 C104 106 136 106 136 146" />
      {/* Ground line and end door */}
      <path d="M20 146 H220" />
      <path d="M106 146 V116 H134 V146" />
      {/* Beds either side */}
      <path d="M40 156 h26 M74 156 h26 M140 156 h26 M174 156 h26" />
      <path d="M46 156 v-7 M56 156 v-7 M80 156 v-7 M90 156 v-7 M146 156 v-7 M156 156 v-7 M180 156 v-7 M190 156 v-7" />
    </g>
  );
}

const ART: Record<BlueprintArtName, () => React.ReactElement> = {
  excavator: Excavator,
  crane: Crane,
  dumpTruck: DumpTruck,
  totalStation: TotalStation,
  levellingRod: LevellingRod,
  drone: Drone,
  greenhouse: Greenhouse,
};

/**
 * One drawing. Decorative only — `aria-hidden`, and it takes its colour from the
 * surrounding band via `currentColor`.
 */
export function BlueprintArt({ name, className = "" }: { name: BlueprintArtName; className?: string }) {
  const Art = ART[name];

  return (
    <svg viewBox="0 0 240 176" className={className} aria-hidden="true" focusable="false" role="presentation">
      <Art />
    </svg>
  );
}

/**
 * Positions one or two drawings inside a coloured band, bled off the edges so they read
 * as texture rather than as illustrations placed on the page.
 *
 * The parent needs `position: relative` and `overflow: hidden`.
 */
export function BlueprintBackdrop({
  primary,
  secondary,
  tone = "onDark",
}: {
  primary: BlueprintArtName;
  /** Optional second drawing on the opposite side, drawn smaller and fainter. */
  secondary?: BlueprintArtName;
  tone?: "onDark" | "onLight";
}) {
  const colour = tone === "onDark" ? "text-white" : "text-brand-secondary";

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${colour}`}>
      <BlueprintArt
        name={primary}
        className="absolute -right-16 -bottom-12 w-[26rem] opacity-[0.12] sm:-right-10 sm:w-[34rem] lg:w-[42rem]"
      />
      {secondary && (
        <BlueprintArt
          name={secondary}
          className="absolute -top-16 -left-20 hidden w-72 opacity-[0.08] lg:block"
        />
      )}
    </div>
  );
}

/** The drawings that suit each division, used by the division pages. */
export const DIVISION_ART: Record<string, { primary: BlueprintArtName; secondary: BlueprintArtName }> = {
  infrastructure: { primary: "excavator", secondary: "crane" },
  "jhm-geo-consult": { primary: "totalStation", secondary: "drone" },
  "agrisystem-analytics": { primary: "greenhouse", secondary: "drone" },
};
