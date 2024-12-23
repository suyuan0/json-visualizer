import clsx from "clsx";

interface GridBackgroundProps extends BaseProps {
  className?: string;
  gridSize?: number;
  lightModeLineColor?: string;
  darkModeLineColor?: string;
}

export default function GridBackground({
  children,
  className,
  gridSize = 20,
  lightModeLineColor = "rgba(0, 0, 0, 0.1)",
  darkModeLineColor = "rgba(255, 255, 255, 0.1)"
}: GridBackgroundProps) {
  return (
    <div className={clsx(className, "relative h-full")}>
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-light" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={lightModeLineColor}
              strokeWidth={0.5}
              className="dark:hidden"
            />
          </pattern>

          <pattern id="grid-dark" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={darkModeLineColor}
              strokeWidth={0.5}
              className="hidden dark:inline"
            />
          </pattern>
        </defs>
        <rect width={"100%"} height={"100%"} fill="url(#grid-light)" className="dark:hidden" />
        <rect width={"100%"} height={"100%"} fill="url(#grid-dark)" className="hidden dark:inline" />
      </svg>
      {children}
    </div>
  );
}
