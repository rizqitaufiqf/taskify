import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
}

export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = auth();
    const user = await currentUser();
    console.log(user);

    if (!user || !orgId) return Promise.reject("User not found!");

    const { entityId, entityType, entityTitle, action } = props;

    const auditLogs = await db.auditLog.create({
      data: {
        orgId,
        entityType,
        entityId,
        entityTitle,
        action,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: user?.username
          ? user.username
          : user?.firstName + " " + user?.lastName,
      },
    });

    return NextResponse.json(auditLogs);
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
};
