import { observer } from "mobx-react-lite";

// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { CalendarHeader, CalendarWeekDays, CalendarWeekHeader } from "components/issues";
// ui
import { Spinner } from "@plane/ui";
// types
import { ICalendarWeek } from "./types";
import { IIssue } from "types";
import { IGroupedIssues, IIssueResponse } from "store/issues/types";
import {
  ICycleIssuesFilterStore,
  IModuleIssuesFilterStore,
  IProjectIssuesFilterStore,
  IViewIssuesFilterStore,
} from "store/issues";
// constants
import { EUserWorkspaceRoles } from "constants/workspace";

type Props = {
  issuesFilterStore:
    | IProjectIssuesFilterStore
    | IModuleIssuesFilterStore
    | ICycleIssuesFilterStore
    | IViewIssuesFilterStore;
  issues: IIssueResponse | undefined;
  groupedIssueIds: IGroupedIssues;
  layout: "month" | "week" | undefined;
  showWeekends: boolean;
  quickActions: (issue: IIssue, customActionButton?: React.ReactElement) => React.ReactNode;
  quickAddCallback?: (
    workspaceSlug: string,
    projectId: string,
    data: IIssue,
    viewId?: string
  ) => Promise<IIssue | undefined>;
  viewId?: string;
};

export const CalendarChart: React.FC<Props> = observer((props) => {
  const { issuesFilterStore, issues, groupedIssueIds, layout, showWeekends, quickActions, quickAddCallback, viewId } =
    props;

  const {
    calendar: calendarStore,
    projectIssues: issueStore,
    user: { currentProjectRole },
  } = useMobxStore();

  const { enableIssueCreation } = issueStore?.viewFlags || {};
  const isEditingAllowed = !!currentProjectRole && currentProjectRole >= EUserWorkspaceRoles.MEMBER;

  const calendarPayload = calendarStore.calendarPayload;

  const allWeeksOfActiveMonth = calendarStore.allWeeksOfActiveMonth;

  if (!calendarPayload)
    return (
      <div className="grid h-full w-full place-items-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="flex h-full w-full flex-col overflow-hidden">
        <CalendarHeader issuesFilterStore={issuesFilterStore} />
        <CalendarWeekHeader isLoading={!issues} showWeekends={showWeekends} />
        <div className="h-full w-full overflow-y-auto">
          {layout === "month" && (
            <div className="grid h-full w-full grid-cols-1 divide-y-[0.5px] divide-custom-border-200">
              {allWeeksOfActiveMonth &&
                Object.values(allWeeksOfActiveMonth).map((week: ICalendarWeek, weekIndex) => (
                  <CalendarWeekDays
                    issuesFilterStore={issuesFilterStore}
                    key={weekIndex}
                    week={week}
                    issues={issues}
                    groupedIssueIds={groupedIssueIds}
                    enableQuickIssueCreate
                    disableIssueCreation={!enableIssueCreation || !isEditingAllowed}
                    quickActions={quickActions}
                    quickAddCallback={quickAddCallback}
                    viewId={viewId}
                  />
                ))}
            </div>
          )}
          {layout === "week" && (
            <CalendarWeekDays
              issuesFilterStore={issuesFilterStore}
              week={calendarStore.allDaysOfActiveWeek}
              issues={issues}
              groupedIssueIds={groupedIssueIds}
              enableQuickIssueCreate
              disableIssueCreation={!enableIssueCreation || !isEditingAllowed}
              quickActions={quickActions}
              quickAddCallback={quickAddCallback}
              viewId={viewId}
            />
          )}
        </div>
      </div>
    </>
  );
});
