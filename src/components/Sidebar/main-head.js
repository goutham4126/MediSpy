import { IoLogoDocker } from "react-icons/io5";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { checkUser } from "@/lib/auth";

export async function MainHead() {
  const user = await checkUser();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-300 text-blue-600">
                <IoLogoDocker className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold mb-0.5">
                  {user?.name}
                </span>
                <span className="truncate text-xs text-slate-700">{user?.role}</span>
              </div>
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
