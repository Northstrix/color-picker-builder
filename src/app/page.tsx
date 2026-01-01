import Configurator from "@/components/configurator";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <Configurator />
    </SidebarProvider>
  );
}
