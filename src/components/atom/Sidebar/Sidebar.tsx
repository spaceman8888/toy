import {  Sidebar as SidebarComponent, SidebarHeader, SidebarGroup, SidebarContent, SidebarGroupLabel, SidebarFooter, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton} from "@/components/ui/sidebar";
import items from "./items";
import Link from "next/link";

export default function Sidebar(){
    return (
        <SidebarComponent collapsible="none">
            <SidebarHeader/>
            <SidebarContent>
                {items.map((groupItem)=>{
                    return (
                        <SidebarGroup key={groupItem.id}>
                            <SidebarGroupLabel>
                                {groupItem.groupTitle}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {groupItem.items.map((item)=>{
                                        return (
                                            <SidebarMenuItem key={item.id}>
                                                <SidebarMenuButton>
                                                    <Link href={item.href}>
                                                        {item.title}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )
                })}
                
            </SidebarContent>
            <SidebarFooter/>
        </SidebarComponent>
    )
}