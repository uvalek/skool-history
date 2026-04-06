type HeroVariant = "default" | "secundaria" | "universidad";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  variant?: HeroVariant;
}

const variantStyles: Record<
  HeroVariant,
  { gradient: string; shadow: string; titleColor: string; subtitleColor: string }
> = {
  default: {
    gradient: "linear-gradient(135deg, #c2b9ff 0%, #fef7ff 100%)",
    shadow: "0 4px 24px rgba(93, 72, 206, 0.12), 0 1.5px 6px rgba(93, 72, 206, 0.08)",
    titleColor: "#392b53",
    subtitleColor: "#665883",
  },
  secundaria: {
    gradient: "linear-gradient(135deg, #6ee7b7 0%, #d1fae5 40%, #f0fdf4 100%)",
    shadow: "0 4px 24px rgba(5, 150, 105, 0.14), 0 1.5px 6px rgba(5, 150, 105, 0.08)",
    titleColor: "#065f46",
    subtitleColor: "#047857",
  },
  universidad: {
    gradient: "linear-gradient(135deg, #fbbf24 0%, #fde68a 40%, #fffbeb 100%)",
    shadow: "0 4px 24px rgba(180, 83, 9, 0.14), 0 1.5px 6px rgba(180, 83, 9, 0.08)",
    titleColor: "#78350f",
    subtitleColor: "#92400e",
  },
};

export function HeroSection({
  title,
  subtitle,
  variant = "default",
}: HeroSectionProps) {
  const styles = variantStyles[variant];

  return (
    <section className="px-6 pt-6 pb-2">
      <div className="mx-auto max-w-7xl">
        <div
          className="rounded-2xl px-8 py-12 md:px-12 md:py-16"
          style={{
            background: styles.gradient,
            boxShadow: styles.shadow,
          }}
        >
          <h1
            className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl"
            style={{ color: styles.titleColor }}
          >
            {title}
          </h1>
          <p
            className="mt-4 max-w-2xl text-lg"
            style={{ color: styles.subtitleColor }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
