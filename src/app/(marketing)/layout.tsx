import { PropsWithChildren } from "react";

const MarketingLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-full bg-slate-100">
      {/* Navbar */}
      <main className="bg-slate-100 pb-20 pt-40">{children}</main>
      {/* Footer */}
    </div>
  );
};

export default MarketingLayout;
