import { LucideAngularModule, BookPlus, CheckSquare, CalendarDays, Target, PenLine, Home, BookOpen, Calendar, Clock, Settings, Sparkles, Bookmark, CalendarClock, Timer, UserCog, LogOut } from 'lucide-angular';

export const ICONS = {
  BookPlus,
  CheckSquare,
  CalendarDays,
  Target,
  PenLine,
  Home,
  BookOpen,
  Calendar,
  Clock,
  Settings,
  Sparkles,
  Bookmark,
  CalendarClock,
  Timer,
  UserCog,
  LogOut
};

// Export a configured Lucide module
export const LucideIconModule = LucideAngularModule.pick(ICONS);
