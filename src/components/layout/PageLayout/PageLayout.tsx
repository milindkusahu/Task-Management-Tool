import React from "react";
import { Header } from "../Header";
import { Container } from "../Container";

export interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  headerProps?: any;
  containerProps?: React.ComponentProps<typeof Container>;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  showHeader = true,
  headerProps,
  containerProps,
  className = "",
}) => {
  return (
    <div className={`min-h-screen bg-[#FFFAFB] ${className}`}>
      {showHeader && <Header title={title} {...headerProps} />}

      <main className="py-4 md:py-8">
        <Container {...containerProps}>{children}</Container>
      </main>
    </div>
  );
};

export default PageLayout;
