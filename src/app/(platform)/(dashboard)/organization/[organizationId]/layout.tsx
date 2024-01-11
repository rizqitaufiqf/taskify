import { OrgControl } from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/org-control";
import { PropsWithChildren } from "react";

const OrganizationIdLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default OrganizationIdLayout;
