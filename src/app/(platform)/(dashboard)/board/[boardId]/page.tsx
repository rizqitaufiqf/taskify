import { ListContainer } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { orgId } = auth();
  if (!orgId) redirect("/select-org");

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        orgId,
      },
    },
    include: {
      cards: {
        orderBy: {
          position: "asc",
        },
      },
    },
    orderBy: {
      position: "asc",
    },
  });
  return (
    <div className="h-full overflow-x-auto p-4">
      <ListContainer data={lists} boardId={params.boardId} />
    </div>
  );
};

export default BoardIdPage;
