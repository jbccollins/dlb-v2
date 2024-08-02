import ArmorProcessor from "./_components/ArmorProcessor";
import DesiredStatsSelector from "./_components/DesiredStatsSelector/DesiredStatsSelector";
import FileFetcher from "./_components/FileFetcher";

export default function Page() {
  return (
    <div>
      <h1>Playground</h1>
      <FileFetcher />
      <DesiredStatsSelector />
      <ArmorProcessor />
    </div>
  );
}
