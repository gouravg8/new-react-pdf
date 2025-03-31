type SinglePageProps = {
  url: string;
  scale?: number;
  title?: string;
  loading?: string | React.ReactNode;
  canvasStyle?: string;
  previousButtonStyle?: string;
  nextButtonStyle?: string;
  previousButtonText?: string;
  nextButtonText?: string;
  buttonsStyle?: string;
};

type ScrollableProps = {
  url: string;
  scale?: number;
  title?: React.ReactNode;
  loading?: string | React.ReactNode;
  titleStyle?: string;
  canvasStyle?: string;
  totalPagesStyle?: string;
  totalPagesCustomize?: React.ReactNode;
};

export type { SinglePageProps, ScrollableProps };
