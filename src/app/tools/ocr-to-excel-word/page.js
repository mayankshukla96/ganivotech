import OcrTool from "@/components/OcrTool";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { OCR } from "@/lib/tools-content";

export const metadata = toolMetadata(OCR);

export default function Page() {
  return (
    <ToolShell t={OCR} crumbs={[["OCR to Excel & Word", OCR.path]]}>
      <OcrTool />
    </ToolShell>
  );
}
