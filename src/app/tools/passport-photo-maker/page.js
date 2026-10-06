import PassportPhotoMaker from "@/components/PassportPhotoMaker";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { PASSPORT } from "@/lib/tools-content";

export const metadata = toolMetadata(PASSPORT);

export default function Page() {
  return (
    <ToolShell t={PASSPORT} crumbs={[["Passport Photo Maker", PASSPORT.path]]}>
      <PassportPhotoMaker />
    </ToolShell>
  );
}
