import { FC } from "react";
import { observer } from "mobx-react-lite";
// components
import { HeaderGroupByCard } from "./group-by-card";
import { HeaderSubGroupByCard } from "./sub-group-by-card";

// Icons
import { PriorityIcon } from "@plane/ui";
import { EProjectStore } from "store/command-palette.store";
import { IIssue } from "types";

export interface IPriorityHeader {
  column_id: string;
  column_value: any;
  sub_group_by: string | null;
  group_by: string | null;
  header_type: "group_by" | "sub_group_by";
  issues_count: number;
  kanBanToggle: any;
  handleKanBanToggle: any;
  disableIssueCreation?: boolean;
  currentStore?: EProjectStore;
  addIssuesToView?: (issueIds: string[]) => Promise<IIssue>;
}

export const PriorityHeader: FC<IPriorityHeader> = observer((props) => {
  const {
    column_id,
    column_value,
    sub_group_by,
    group_by,
    header_type,
    issues_count,
    kanBanToggle,
    handleKanBanToggle,
    disableIssueCreation,
    currentStore,
    addIssuesToView,
  } = props;

  const priority = column_value || null;

  return (
    <>
      {priority &&
        (sub_group_by && header_type === "sub_group_by" ? (
          <HeaderSubGroupByCard
            column_id={column_id}
            icon={<PriorityIcon priority={priority?.key} />}
            title={priority?.title || ""}
            count={issues_count}
            kanBanToggle={kanBanToggle}
            handleKanBanToggle={handleKanBanToggle}
          />
        ) : (
          <HeaderGroupByCard
            sub_group_by={sub_group_by}
            group_by={group_by}
            column_id={column_id}
            icon={<PriorityIcon priority={priority?.key} />}
            title={priority?.title || ""}
            count={issues_count}
            kanBanToggle={kanBanToggle}
            handleKanBanToggle={handleKanBanToggle}
            issuePayload={{ priority: priority?.key }}
            disableIssueCreation={disableIssueCreation}
            currentStore={currentStore}
            addIssuesToView={addIssuesToView}
          />
        ))}
    </>
  );
});
