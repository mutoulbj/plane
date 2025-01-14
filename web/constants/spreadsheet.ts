import { IIssueDisplayProperties, TIssue, TIssueOrderByOptions } from "@plane/types";
import { LayersIcon, DoubleCircleIcon, UserGroupIcon } from "@plane/ui";
import { CalendarDays, Link2, Signal, Tag, Triangle, Paperclip, CalendarClock, CalendarCheck } from "lucide-react";
import { FC } from "react";
import { ISvgIcons } from "@plane/ui/src/icons/type";
import {
  SpreadsheetAssigneeColumn,
  SpreadsheetAttachmentColumn,
  SpreadsheetCreatedOnColumn,
  SpreadsheetDueDateColumn,
  SpreadsheetEstimateColumn,
  SpreadsheetLabelColumn,
  SpreadsheetLinkColumn,
  SpreadsheetPriorityColumn,
  SpreadsheetStartDateColumn,
  SpreadsheetStateColumn,
  SpreadsheetSubIssueColumn,
  SpreadsheetUpdatedOnColumn,
} from "components/issues/issue-layouts/spreadsheet";

export const SPREADSHEET_PROPERTY_DETAILS: {
  [key: string]: {
    title: string;
    ascendingOrderKey: TIssueOrderByOptions;
    ascendingOrderTitle: string;
    descendingOrderKey: TIssueOrderByOptions;
    descendingOrderTitle: string;
    icon: FC<ISvgIcons>;
    Column: React.FC<{ issue: TIssue; onChange: (issue: TIssue, data: Partial<TIssue>) => void; disabled: boolean }>;
  };
} = {
  assignee: {
    title: "Assignees",
    ascendingOrderKey: "assignees__first_name",
    ascendingOrderTitle: "A",
    descendingOrderKey: "-assignees__first_name",
    descendingOrderTitle: "Z",
    icon: UserGroupIcon,
    Column: SpreadsheetAssigneeColumn,
  },
  created_on: {
    title: "Created on",
    ascendingOrderKey: "-created_at",
    ascendingOrderTitle: "New",
    descendingOrderKey: "created_at",
    descendingOrderTitle: "Old",
    icon: CalendarDays,
    Column: SpreadsheetCreatedOnColumn,
  },
  due_date: {
    title: "Due date",
    ascendingOrderKey: "-target_date",
    ascendingOrderTitle: "New",
    descendingOrderKey: "target_date",
    descendingOrderTitle: "Old",
    icon: CalendarCheck,
    Column: SpreadsheetDueDateColumn,
  },
  estimate: {
    title: "Estimate",
    ascendingOrderKey: "estimate_point",
    ascendingOrderTitle: "Low",
    descendingOrderKey: "-estimate_point",
    descendingOrderTitle: "High",
    icon: Triangle,
    Column: SpreadsheetEstimateColumn,
  },
  labels: {
    title: "Labels",
    ascendingOrderKey: "labels__name",
    ascendingOrderTitle: "A",
    descendingOrderKey: "-labels__name",
    descendingOrderTitle: "Z",
    icon: Tag,
    Column: SpreadsheetLabelColumn,
  },
  priority: {
    title: "Priority",
    ascendingOrderKey: "priority",
    ascendingOrderTitle: "None",
    descendingOrderKey: "-priority",
    descendingOrderTitle: "Urgent",
    icon: Signal,
    Column: SpreadsheetPriorityColumn,
  },
  start_date: {
    title: "Start date",
    ascendingOrderKey: "-start_date",
    ascendingOrderTitle: "New",
    descendingOrderKey: "start_date",
    descendingOrderTitle: "Old",
    icon: CalendarClock,
    Column: SpreadsheetStartDateColumn,
  },
  state: {
    title: "State",
    ascendingOrderKey: "state__name",
    ascendingOrderTitle: "A",
    descendingOrderKey: "-state__name",
    descendingOrderTitle: "Z",
    icon: DoubleCircleIcon,
    Column: SpreadsheetStateColumn,
  },
  updated_on: {
    title: "Updated on",
    ascendingOrderKey: "-updated_at",
    ascendingOrderTitle: "New",
    descendingOrderKey: "updated_at",
    descendingOrderTitle: "Old",
    icon: CalendarDays,
    Column: SpreadsheetUpdatedOnColumn,
  },
  link: {
    title: "Link",
    ascendingOrderKey: "-link_count",
    ascendingOrderTitle: "Most",
    descendingOrderKey: "link_count",
    descendingOrderTitle: "Least",
    icon: Link2,
    Column: SpreadsheetLinkColumn,
  },
  attachment_count: {
    title: "Attachment",
    ascendingOrderKey: "-attachment_count",
    ascendingOrderTitle: "Most",
    descendingOrderKey: "attachment_count",
    descendingOrderTitle: "Least",
    icon: Paperclip,
    Column: SpreadsheetAttachmentColumn,
  },
  sub_issue_count: {
    title: "Sub-issue",
    ascendingOrderKey: "-sub_issues_count",
    ascendingOrderTitle: "Most",
    descendingOrderKey: "sub_issues_count",
    descendingOrderTitle: "Least",
    icon: LayersIcon,
    Column: SpreadsheetSubIssueColumn,
  },
};

export const SPREADSHEET_PROPERTY_LIST: (keyof IIssueDisplayProperties)[] = [
  "state",
  "priority",
  "assignee",
  "labels",
  "start_date",
  "due_date",
  "estimate",
  "created_on",
  "updated_on",
  "link",
  "attachment_count",
  "sub_issue_count",
];
