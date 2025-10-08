import React from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface PageRouterProps {
  parentPath: string;
  parentLabel: string;
}

const PageRouter: React.FC<PageRouterProps> = ({ parentPath, parentLabel }) => {
  return (
    <div className="mb-6">
      <Button
        variant="outline"
        className="inline-flex items-center text-md text-muted-foreground hover:text-foreground transition-colors"
        asChild
      >
        <Link to={parentPath}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          {parentLabel}
        </Link>
      </Button>
    </div>
  );
};

export default PageRouter;
