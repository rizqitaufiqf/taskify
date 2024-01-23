import { OrganizationList, UserButton } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
  return (
    <div className="flex flex-col items-center">
      <UserButton />
      <OrganizationList
        hidePersonal
        afterSelectOrganizationUrl="/organization/:id"
        afterCreateOrganizationUrl="/organization/:id"
      />
    </div>
  );
}
