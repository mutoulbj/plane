import { FC, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { CalendarChart } from "components/issues";
// types
import { IIssue } from "types";
import {
  ICycleIssuesFilterStore,
  ICycleIssuesStore,
  IModuleIssuesFilterStore,
  IModuleIssuesStore,
  IProjectIssuesFilterStore,
  IProjectIssuesStore,
  IViewIssuesFilterStore,
  IViewIssuesStore,
} from "store/issues";
import { IIssueCalendarViewStore } from "store/issue";
import { IQuickActionProps } from "../list/list-view-types";
import { EIssueActions } from "../types";
import { IGroupedIssues } from "store/issues/types";

interface IBaseCalendarRoot {
  issueStore: IProjectIssuesStore | IModuleIssuesStore | ICycleIssuesStore | IViewIssuesStore;
  issuesFilterStore:
    | IProjectIssuesFilterStore
    | IModuleIssuesFilterStore
    | ICycleIssuesFilterStore
    | IViewIssuesFilterStore;
  calendarViewStore: IIssueCalendarViewStore;
  QuickActions: FC<IQuickActionProps>;
  issueActions: {
    [EIssueActions.DELETE]: (issue: IIssue) => void;
    [EIssueActions.UPDATE]?: (issue: IIssue) => void;
    [EIssueActions.REMOVE]?: (issue: IIssue) => void;
  };
  viewId?: string;
}

export const BaseCalendarRoot = observer((props: IBaseCalendarRoot) => {
  const { issueStore, issuesFilterStore, calendarViewStore, QuickActions, issueActions, viewId } = props;

  const displayFilters = issuesFilterStore.issueFilters?.displayFilters;

  const issues = issueStore.getIssues;
  const groupedIssueIds = (issueStore.getIssuesIds ?? {}) as IGroupedIssues;

  const onDragEnd = (result: DropResult) => {
    if (!result) return;

    // return if not dropped on the correct place
    if (!result.destination) return;

    // return if dropped on the same date
    if (result.destination.droppableId === result.source.droppableId) return;

    calendarViewStore?.handleDragDrop(result.source, result.destination);
  };

  const handleIssues = useCallback(
    (date: string, issue: IIssue, action: EIssueActions) => {
      if (issueActions[action]) {
        issueActions[action]!(issue);
      }
    },
    [issueStore]
  );

  return (
    <div className="h-full w-full pt-4 bg-custom-background-100 overflow-hidden">
      <DragDropContext onDragEnd={onDragEnd}>
        <CalendarChart
          issues={issues}
          groupedIssueIds={groupedIssueIds}
          layout={displayFilters?.calendar?.layout}
          showWeekends={displayFilters?.calendar?.show_weekends ?? false}
          handleIssues={handleIssues}
          quickActions={(issue) => (
            <QuickActions
              issue={issue}
              handleDelete={async () => handleIssues(issue.target_date ?? "", issue, EIssueActions.DELETE)}
              handleUpdate={
                issueActions[EIssueActions.UPDATE]
                  ? async (data) => handleIssues(issue.target_date ?? "", data, EIssueActions.UPDATE)
                  : undefined
              }
              handleRemoveFromView={
                issueActions[EIssueActions.REMOVE]
                  ? async () => handleIssues(issue.target_date ?? "", issue, EIssueActions.REMOVE)
                  : undefined
              }
            />
          )}
          quickAddCallback={issueStore.quickAddIssue}
          viewId={viewId}
        />
      </DragDropContext>
    </div>
  );
});
