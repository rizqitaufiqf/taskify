import { OrgControl } from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/org-control";
import { auth } from "@clerk/nextjs";
import { startCase } from "lodash";
import { PropsWithChildren } from "react";

export async function generateMetadata() {
  const { orgSlug } = auth();

  return {
    title: startCase(orgSlug || "organization"),
  };
}

const OrganizationIdLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default OrganizationIdLayout;
