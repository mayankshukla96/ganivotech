import ShortLinkMaker from "@/components/ShortLinkMaker";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { SHORT } from "@/lib/tools-content";

export const metadata = toolMetadata(SHORT);

export default function Page() {
  return (
    <ToolShell t={SHORT} crumbs={[["Short Link Maker", SHORT.path]]}>
      <ShortLinkMaker />
    </ToolShell>
  );
}
