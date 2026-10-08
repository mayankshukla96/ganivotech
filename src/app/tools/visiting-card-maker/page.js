import VisitingCardMaker from "@/components/VisitingCardMaker";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { VCARD_MAKER } from "@/lib/tools-content";

export const metadata = toolMetadata(VCARD_MAKER);

export default function Page() {
  return (
    <ToolShell t={VCARD_MAKER} crumbs={[["Visiting Card Maker", VCARD_MAKER.path]]}>
      <VisitingCardMaker />
    </ToolShell>
  );
}
