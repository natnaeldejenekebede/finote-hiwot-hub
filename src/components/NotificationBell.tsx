import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const NotificationBell = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { i18n } = useTranslation();
  const isAm = i18n.language === "am";

  // 1. Initial Fetch
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);
    
    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }
    if (data) setNotifications(data);
  };

  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    // 2. Realtime Subscription
    const channel = supabase
      .channel(`user_notifications_${userId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications', 
          filter: `user_id=eq.${userId}` 
        },
        (payload) => {
          console.log("New notification received live:", payload.new);
          // Update state instantly by adding the new row to the top
          setNotifications((prev) => [payload.new, ...prev.slice(0, 4)]);
        }
      )
      .subscribe((status) => {
        console.log(`Notification subscription status for ${userId}:`, status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
    
    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-card rounded-full animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2">
        <div className="flex items-center justify-between p-2 border-b border-border">
           <h3 className="font-bold text-sm">
            {isAm ? "ማሳወቂያዎች" : "Notifications"}
          </h3>
          {unreadCount > 0 && (
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
              {unreadCount} New
            </span>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="p-4 text-center text-xs text-muted-foreground">
            {isAm ? "ምንም አዲስ ማሳወቂያ የለም" : "No new updates"}
          </p>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem 
              key={n.id} 
              className={`flex flex-col items-start p-3 cursor-pointer mb-1 rounded-lg transition-colors ${
                !n.is_read ? 'bg-primary/5 border-l-2 border-primary' : 'opacity-70'
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <p className="font-bold text-xs">
                {isAm ? (n.title_am || n.title_en) : n.title_en}
              </p>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                {isAm ? (n.message_am || n.message_en) : n.message_en}
              </p>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuItem asChild className="border-t border-border mt-2 focus:bg-transparent">
          <Link to="/profile" className="w-full text-center text-xs text-primary font-bold hover:underline">
            {isAm ? "ሁሉንም አሳይ" : "View All"}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;