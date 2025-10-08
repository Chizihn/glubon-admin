// Type declarations for modules

declare module "@/components/ui/*" {
  import { ComponentType } from "react";
  const Component: ComponentType<any>;
  export default Component;
}

declare module "@/graphql/queries/*" {
  import { DocumentNode } from "@apollo/client";
  const query: DocumentNode;
  export default query;
}

declare module "@/graphql/mutations/*" {
  import { DocumentNode } from "@apollo/client";
  const mutation: DocumentNode;
  export default mutation;
}
