import { StudyRoomShell } from "@/components/study-room-shell";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudyRoomShell roomId={id} />;
}
