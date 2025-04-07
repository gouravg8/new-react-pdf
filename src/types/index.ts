// Base type for common properties
type BasePdfProps = {
  url: string;
  scale?: number;
  title?: React.ReactNode;
  loading?: string | React.ReactNode;
  canvasStyle?: string;
};

// Specific props for SinglePage component
type SinglePageProps = BasePdfProps & {
  previousButtonStyle?: string;
  nextButtonStyle?: string;
  previousButtonText?: string;
  nextButtonText?: string;
  buttonsStyle?: string;
};

// Specific props for Scrollable component
type ScrollableProps = BasePdfProps & {
  titleStyle?: string;
  totalPagesStyle?: string;
  totalPagesCustomize?: React.ReactNode;
};

export type { BasePdfProps, SinglePageProps, ScrollableProps };
