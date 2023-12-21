import { FC } from "react";
import { observer } from "mobx-react-lite";
import { AlertCircle, SignalHigh, SignalMedium, SignalLow, Ban } from "lucide-react";
// components
import { HeaderGroupByCard } from "./group-by-card";
import { EProjectStore } from "store/command-palette.store";
import { IIssue } from "types";

export interface IPriorityHeader {
  column_id: string;
  column_value: any;
  issues_count: number;
  disableIssueCreation?: boolean;
  currentStore: EProjectStore;
  addIssuesToView?: (issueIds: string[]) => Promise<IIssue>;
}

const Icon = ({ priority }: any) => (
  <div className="h-full w-full">
    {priority === "urgent" ? (
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-sm border border-red-500 bg-red-500 text-white">
        <AlertCircle size={14} strokeWidth={2} />
      </div>
    ) : priority === "high" ? (
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-sm border border-red-500/20 bg-red-500/10 text-red-500">
        <SignalHigh size={14} strokeWidth={2} className="pl-[3px]" />
      </div>
    ) : priority === "medium" ? (
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-sm border border-orange-500/20 bg-orange-500/10 text-orange-500">
        <SignalMedium size={14} strokeWidth={2} className="pl-[3px]" />
      </div>
    ) : priority === "low" ? (
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-sm border border-green-500/20 bg-green-500/10 text-green-500">
        <SignalLow size={14} strokeWidth={2} className="pl-[3px]" />
      </div>
    ) : (
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-sm border border-custom-border-400/20 bg-custom-text-400/10 text-custom-text-400">
        <Ban size={14} strokeWidth={2} />
      </div>
    )}
  </div>
);

export const PriorityHeader: FC<IPriorityHeader> = observer((props) => {
  const { column_value, issues_count, disableIssueCreation, currentStore, addIssuesToView } = props;

  const priority = column_value ?? null;

  return (
    <>
      {priority && (
        <HeaderGroupByCard
          icon={<Icon priority={priority?.key} />}
          title={priority?.title || ""}
          count={issues_count}
          issuePayload={{ priority: priority?.key }}
          disableIssueCreation={disableIssueCreation}
          currentStore={currentStore}
          addIssuesToView={addIssuesToView}
        />
      )}
    </>
  );
});
