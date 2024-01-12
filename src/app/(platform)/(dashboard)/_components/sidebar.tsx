"use client";

import { NavItem } from "@/app/(platform)/(dashboard)/_components/nav-item";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TOrganization } from "@/utils/types/organization.types";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";

// used for accordion state is in collapse or expand state and store in local storage
interface SidebarProps {
  storageKey?: string;
}

export const Sidebar = ({
  storageKey = "t-desktop-sidebar-state",
}: SidebarProps) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {},
  );
  const { organization: activeOrg, isLoaded: isLoadedOrg } = useOrganization();
  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) acc.push(key);

      return acc;
    },
    [],
  );

  const onExpand = (id: string) => {
    setExpanded((currVal) => ({
      ...currVal,
      [id]: !expanded[id],
    }));
  };

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return (
      <>
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-1 flex items-center text-xs font-medium">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto"
        >
          <Link href="/select-org">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {userMemberships.data?.map(({ organization }) => (
          <NavItem
            key={organization.id}
            isActive={activeOrg?.id === organization.id}
            isExpanded={expanded[organization.id]}
            organization={organization as TOrganization}
            onExpand={onExpand}
          />
        ))}
      </Accordion>
    </>
  );
};
