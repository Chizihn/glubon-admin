import React from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PageRouterProps {
  parentPath: string;
  parentLabel: string;
}

const PageRouter: React.FC<PageRouterProps> = ({ parentPath, parentLabel }) => {
  return (
    <div className="mb-6">
      <Link
        to={parentPath}
        className="inline-flex items-center text-md text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {parentLabel}
      </Link>
    </div>
  );
};

export default PageRouter;
