import { SidebarProvider , SidebarTrigger} from "@/components/ui/sidebar";
import Sidebar from "@/components/atom/Sidebar";

export default function Layout({children}:{children:React.ReactNode}){
    return (
        <div>
            <SidebarProvider>
                <Sidebar/>
                <SidebarTrigger/>
                <main>
                    
                {children}
                </main>
            </SidebarProvider>
        </div>
    )
}