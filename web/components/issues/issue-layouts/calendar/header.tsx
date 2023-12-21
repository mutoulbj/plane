import { observer } from "mobx-react-lite";

// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { CalendarMonthsDropdown, CalendarOptionsDropdown } from "components/issues";
// icons
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  ICycleIssuesFilterStore,
  IModuleIssuesFilterStore,
  IProjectIssuesFilterStore,
  IViewIssuesFilterStore,
} from "store/issues";

interface ICalendarHeader {
  issuesFilterStore:
    | IProjectIssuesFilterStore
    | IModuleIssuesFilterStore
    | ICycleIssuesFilterStore
    | IViewIssuesFilterStore;
}

export const CalendarHeader: React.FC<ICalendarHeader> = observer((props) => {
  const { issuesFilterStore } = props;

  const { calendar: calendarStore } = useMobxStore();

  const calendarLayout = issuesFilterStore.issueFilters?.displayFilters?.calendar?.layout ?? "month";

  const { activeMonthDate, activeWeekDate } = calendarStore.calendarFilters;

  const handlePrevious = () => {
    if (calendarLayout === "month") {
      const previousMonthYear =
        activeMonthDate.getMonth() === 0 ? activeMonthDate.getFullYear() - 1 : activeMonthDate.getFullYear();
      const previousMonthMonth = activeMonthDate.getMonth() === 0 ? 11 : activeMonthDate.getMonth() - 1;

      const previousMonthFirstDate = new Date(previousMonthYear, previousMonthMonth, 1);

      calendarStore.updateCalendarFilters({
        activeMonthDate: previousMonthFirstDate,
      });
    } else {
      const previousWeekDate = new Date(
        activeWeekDate.getFullYear(),
        activeWeekDate.getMonth(),
        activeWeekDate.getDate() - 7
      );

      calendarStore.updateCalendarFilters({
        activeWeekDate: previousWeekDate,
      });
    }
  };

  const handleNext = () => {
    if (calendarLayout === "month") {
      const nextMonthYear =
        activeMonthDate.getMonth() === 11 ? activeMonthDate.getFullYear() + 1 : activeMonthDate.getFullYear();
      const nextMonthMonth = (activeMonthDate.getMonth() + 1) % 12;

      const nextMonthFirstDate = new Date(nextMonthYear, nextMonthMonth, 1);

      calendarStore.updateCalendarFilters({
        activeMonthDate: nextMonthFirstDate,
      });
    } else {
      const nextWeekDate = new Date(
        activeWeekDate.getFullYear(),
        activeWeekDate.getMonth(),
        activeWeekDate.getDate() + 7
      );

      calendarStore.updateCalendarFilters({
        activeWeekDate: nextWeekDate,
      });
    }
  };

  const handleToday = () => {
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    calendarStore.updateCalendarFilters({
      activeMonthDate: firstDayOfCurrentMonth,
      activeWeekDate: today,
    });
  };

  return (
    <div className="mb-4 flex items-center justify-between gap-2 px-3">
      <div className="flex items-center gap-1.5">
        <button type="button" className="grid place-items-center" onClick={handlePrevious}>
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <button type="button" className="grid place-items-center" onClick={handleNext}>
          <ChevronRight size={16} strokeWidth={2} />
        </button>
        <CalendarMonthsDropdown />
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="rounded bg-custom-background-80 px-2.5 py-1 text-xs font-medium text-custom-text-200 hover:text-custom-text-100"
          onClick={handleToday}
        >
          Today
        </button>
        <CalendarOptionsDropdown issuesFilterStore={issuesFilterStore} />
      </div>
    </div>
  );
});
