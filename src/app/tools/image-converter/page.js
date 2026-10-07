import ImageConverter from "@/components/ImageConverter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { CONVERT } from "@/lib/tools-content";

export const metadata = toolMetadata(CONVERT);

export default function Page() {
  return (
    <ToolShell t={CONVERT} crumbs={[["Image Format Converter", CONVERT.path]]}>
      <ImageConverter />
    </ToolShell>
  );
}
