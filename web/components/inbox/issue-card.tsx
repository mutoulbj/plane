import { useRouter } from "next/router";
import Link from "next/link";
import { AlertTriangle, CalendarDays, CheckCircle2, Clock, Copy, XCircle } from "lucide-react";
// ui
import { Tooltip, PriorityIcon } from "@plane/ui";
// hooks
import { useInboxIssues, useProject } from "hooks/store";
// helpers
import { renderFormattedDate } from "helpers/date-time.helper";
// constants
import { INBOX_STATUS } from "constants/inbox";

type Props = {
  active: boolean;
  issueId: string;
};

export const InboxIssueCard: React.FC<Props> = (props) => {
  const { active } = props;
  // router
  const router = useRouter();
  const { workspaceSlug, projectId, inboxId } = router.query;
  // store hooks
  const { getIssueById } = useInboxIssues();
  const { getProjectById } = useProject();
  // derived values
  const issue = getIssueById(inboxId as string, props.issueId);
  const issueStatus = issue?.issue_inbox[0].status;

  if (!issue) return null;

  return (
    <Link href={`/${workspaceSlug}/projects/${projectId}/inbox/${inboxId}?inboxIssueId=${issue.issue_inbox[0].id}`}>
      <div
        id={issue.id}
        className={`relative min-h-[5rem] cursor-pointer select-none space-y-3 border-b border-custom-border-200 px-4 py-2 hover:bg-custom-primary/5 ${
          active ? "bg-custom-primary/5" : " "
        } ${issue.issue_inbox[0].status !== -2 ? "opacity-60" : ""}`}
      >
        <div className="flex items-center gap-x-2">
          <p className="flex-shrink-0 text-xs text-custom-text-200">
            {getProjectById(issue.project_id)?.identifier}-{issue.sequence_id}
          </p>
          <h5 className="truncate text-sm">{issue.name}</h5>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tooltip tooltipHeading="Priority" tooltipContent={`${issue.priority ?? "None"}`}>
            <PriorityIcon priority={issue.priority ?? null} className="h-3.5 w-3.5" />
          </Tooltip>
          <Tooltip tooltipHeading="Created on" tooltipContent={`${renderFormattedDate(issue.created_at ?? "")}`}>
            <div className="flex items-center gap-1 rounded border border-custom-border-200 px-2 py-[0.19rem] text-xs text-custom-text-200 shadow-sm">
              <CalendarDays size={12} strokeWidth={1.5} />
              <span>{renderFormattedDate(issue.created_at ?? "")}</span>
            </div>
          </Tooltip>
        </div>
        <div
          className={`flex w-full items-center justify-end gap-1 text-xs ${
            issueStatus === 0 && new Date(issue.issue_inbox[0].snoozed_till ?? "") < new Date()
              ? "text-red-500"
              : INBOX_STATUS.find((s) => s.value === issueStatus)?.textColor
          }`}
        >
          {issueStatus === -2 ? (
            <>
              <AlertTriangle size={14} strokeWidth={2} />
              <span>Pending</span>
            </>
          ) : issueStatus === -1 ? (
            <>
              <XCircle size={14} strokeWidth={2} />
              <span>Declined</span>
            </>
          ) : issueStatus === 0 ? (
            <>
              <Clock size={14} strokeWidth={2} />
              <span>
                {new Date(issue.issue_inbox[0].snoozed_till ?? "") < new Date() ? "Snoozed date passed" : "Snoozed"}
              </span>
            </>
          ) : issueStatus === 1 ? (
            <>
              <CheckCircle2 size={14} strokeWidth={2} />
              <span>Accepted</span>
            </>
          ) : (
            <>
              <Copy size={14} strokeWidth={2} />
              <span>Duplicate</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};
