import { notFound } from "next/navigation";
import { StickerBoard } from "@/components/StickerBoard";
import type { ChildId } from "@/hooks/useStickerStorage";

const VALID_CHILDREN: ChildId[] = ["junwoo", "jiwoo"];

type Props = { params: Promise<{ child: string }> };

export default async function ChildPage({ params }: Props) {
  const { child } = await params;
  if (!VALID_CHILDREN.includes(child as ChildId)) notFound();
  return <StickerBoard childId={child as ChildId} />;
}
