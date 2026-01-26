import AppImage from "@/components/AppImage";

type BannerProps = {
    image: string;
    title?: string;
    subtitle?: string;
    height?: "sm" | "md" | "lg";
    overlay?: boolean;
    children?: React.ReactNode;
    textSize?: "sm" | "md" | "lg" | "xl";
    textAlign?: "left" | "center" | "right";
};

const HEIGHTS = {
    sm: "h-[200px]",
    md: "h-[320px]",
    lg: "h-[450px]",
};

const TITLE_SIZES = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl",
};

const SUBTITLE_SIZES = {
    sm: "text-sm md:text-base",
    md: "text-base md:text-lg",
    lg: "text-lg md:text-xl",
    xl: "text-xl md:text-2xl",
};

export default function Banner({
    image,
    title,
    subtitle,
    height = "md",
    overlay = true,
    children,
    textSize = "md",
    textAlign = "left",
}: BannerProps) {
    const alignmentClasses =
        textAlign === "center"
            ? "text-center items-center"
            : textAlign === "right"
              ? "text-right items-end"
              : "text-left items-start";

    return (
        <header
            className={`relative w-full ${HEIGHTS[height]} overflow-hidden`}
        >
            {/* Background image */}
            <AppImage
                src={image}
                alt={title ?? "Banner image"}
                fill
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay */}
            {overlay && <div className="absolute inset-0 bg-black/40 z-10" />}

            {/* Content */}
            <div
                className={`absolute top-0 left-0 w-full z-20 flex h-full ${alignmentClasses}`}
            >
                <div className="container mx-auto px-5 flex flex-col justify-center h-full">
                    {title && (
                        <h1
                            className={`${TITLE_SIZES[textSize]} font-bold text-white`}
                        >
                            {title}
                        </h1>
                    )}

                    {subtitle && (
                        <p
                            className={`mt-5 max-w-xl text-white/90 ${SUBTITLE_SIZES[textSize]} ${
                                textAlign === "center"
                                    ? "mx-auto text-center"
                                    : textAlign === "right"
                                      ? "ml-auto text-right"
                                      : "text-left"
                            }`}
                        >
                            {subtitle}
                        </p>
                    )}

                    {children && <div className="mt-10">{children}</div>}
                </div>
            </div>
        </header>
    );
}
