import React from "react";

interface Props {
  children: React.ReactNode;
}

const LandingLayout = ({ children }: Props) => {
  return (
    <>
      <main className="z-40 w-full max-w-2xl">
        {children}
      </main>
    </>
  );
};

export default LandingLayout;
