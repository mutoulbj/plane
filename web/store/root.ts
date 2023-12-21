import { enableStaticRendering } from "mobx-react-lite";
// store imports
import { InstanceStore, IInstanceStore } from "./instance";
import AppConfigStore, { IAppConfigStore } from "./app-config.store";
import CommandPaletteStore, { ICommandPaletteStore } from "./command-palette.store";
import UserStore, { IUserStore } from "store/user.store";
import ThemeStore, { IThemeStore } from "store/theme.store";
import {
  DraftIssuesStore,
  IIssueDetailStore,
  IIssueFilterStore,
  IIssueKanBanViewStore,
  IIssueStore,
  IssueDetailStore,
  IssueFilterStore,
  IssueKanBanViewStore,
  IIssueCalendarViewStore,
  IssueCalendarViewStore,
  IssueStore,
  IIssueQuickAddStore,
  IssueQuickAddStore,
} from "store/issue";
import {
  IWorkspaceFilterStore,
  IWorkspaceStore,
  WorkspaceFilterStore,
  WorkspaceStore,
  WorkspaceMemberStore,
  IWorkspaceMemberStore,
} from "store/workspace";
import {
  IProjectPublishStore,
  IProjectStore,
  ProjectPublishStore,
  ProjectStore,
  IProjectStateStore,
  ProjectStateStore,
  IProjectLabelStore,
  ProjectLabelStore,
  ProjectEstimatesStore,
  IProjectEstimateStore,
  ProjectMemberStore,
  IProjectMemberStore,
} from "store/project";
import {
  IModuleFilterStore,
  IModuleIssueKanBanViewStore,
  IModuleIssueStore,
  IModuleStore,
  ModuleFilterStore,
  ModuleIssueKanBanViewStore,
  ModuleIssueStore,
  IModuleIssueCalendarViewStore,
  ModuleIssueCalendarViewStore,
  ModuleStore,
} from "store/module";
import {
  CycleIssueFilterStore,
  CycleIssueKanBanViewStore,
  CycleIssueStore,
  CycleStore,
  ICycleIssueFilterStore,
  ICycleIssueKanBanViewStore,
  ICycleIssueCalendarViewStore,
  CycleIssueCalendarViewStore,
  ICycleIssueStore,
  ICycleStore,
} from "store/cycle";
import {
  IProjectViewFiltersStore,
  IProjectViewIssuesStore,
  IProjectViewsStore,
  ProjectViewFiltersStore,
  ProjectViewIssuesStore,
  ProjectViewsStore,
  IProjectViewIssueCalendarViewStore,
  ProjectViewIssueCalendarViewStore,
} from "store/project-view";
import CalendarStore, { ICalendarStore } from "store/calendar.store";
import {
  GlobalViewFiltersStore,
  GlobalViewIssuesStore,
  GlobalViewsStore,
  IGlobalViewFiltersStore,
  IGlobalViewIssuesStore,
  IGlobalViewsStore,
} from "store/global-view";
import {
  ProfileIssueStore,
  IProfileIssueStore,
  ProfileIssueFilterStore,
  IProfileIssueFilterStore,
} from "store/profile-issues";
import {
  ArchivedIssueStore,
  IArchivedIssueStore,
  ArchivedIssueFilterStore,
  IArchivedIssueFilterStore,
  ArchivedIssueDetailStore,
  IArchivedIssueDetailStore,
} from "store/archived-issues";
import { DraftIssueStore, IDraftIssueStore, DraftIssueFilterStore, IDraftIssueFilterStore } from "store/draft-issues";
import {
  IInboxFiltersStore,
  IInboxIssueDetailsStore,
  IInboxIssuesStore,
  IInboxStore,
  InboxFiltersStore,
  InboxIssueDetailsStore,
  InboxIssuesStore,
  InboxStore,
} from "store/inbox";
import { IWebhookStore, WebhookStore } from "./webhook.store";

import {
  // global
  IIssuesFilterStore,
  IssuesFilterStore,
  // project issues
  IProjectIssuesStore,
  ProjectIssuesStore,
  // project issues filter
  IProjectIssuesFilterStore,
  ProjectIssuesFilterStore,
  // module issues
  IModuleIssuesStore,
  ModuleIssuesStore,
  // module issues filter
  IModuleIssuesFilterStore,
  ModuleIssuesFilterStore,
  // cycle issues
  ICycleIssuesStore,
  CycleIssuesStore,
  // cycle issues filter
  ICycleIssuesFilterStore,
  CycleIssuesFilterStore,
  // project view issues
  IViewIssuesStore,
  ViewIssuesStore,
  // project view issues filter
  IViewIssuesFilterStore,
  ViewIssuesFilterStore,
  // archived issues
  IProjectArchivedIssuesStore,
  ProjectArchivedIssuesStore,
  // archived issues filter
  IProjectArchivedIssuesFilterStore,
  ProjectArchivedIssuesFilterStore,
  // draft issues
  IProjectDraftIssuesStore,
  ProjectDraftIssuesStore,
  // draft issues filter
  IProjectDraftIssuesFilterStore,
  ProjectDraftIssuesFilterStore,
  // profile issues
  IProfileIssuesStore,
  ProfileIssuesStore,
  // profile issues filter
  IProfileIssuesFilterStore,
  ProfileIssuesFilterStore,
  // global issues
  IGlobalIssuesStore,
  GlobalIssuesStore,
  // global issues filter
  IGlobalIssuesFilterStore,
  GlobalIssuesFilterStore,
  // helpers
  ICalendarHelpers,
  CalendarHelpers,
  IKanBanHelpers,
  KanBanHelpers,
} from "store/issues";

import { CycleIssueFiltersStore, ICycleIssueFiltersStore } from "store/cycle-issues";
import { ModuleIssueFiltersStore, IModuleIssueFiltersStore } from "store/module-issues";

import { IMentionsStore, MentionsStore } from "store/editor";
// pages
import { PageStore, IPageStore } from "store/page.store";
// event tracking
import { TrackEventStore, ITrackEventStore } from "./event-tracker.store";

enableStaticRendering(typeof window === "undefined");

export class RootStore {
  instance: IInstanceStore;

  user: IUserStore;
  theme: IThemeStore;
  appConfig: IAppConfigStore;
  commandPalette: ICommandPaletteStore;

  workspace: IWorkspaceStore;
  workspaceFilter: IWorkspaceFilterStore;
  workspaceMember: IWorkspaceMemberStore;

  projectPublish: IProjectPublishStore;
  project: IProjectStore;
  projectState: IProjectStateStore;
  projectLabel: IProjectLabelStore;
  projectEstimates: IProjectEstimateStore;
  projectMember: IProjectMemberStore;

  issue: IIssueStore;

  module: IModuleStore;
  moduleIssue: IModuleIssueStore;
  moduleFilter: IModuleFilterStore;
  moduleIssueKanBanView: IModuleIssueKanBanViewStore;
  moduleIssueCalendarView: IModuleIssueCalendarViewStore;

  cycle: ICycleStore;
  cycleIssue: ICycleIssueStore;
  cycleIssueFilter: ICycleIssueFilterStore;
  cycleIssueKanBanView: ICycleIssueKanBanViewStore;
  cycleIssueCalendarView: ICycleIssueCalendarViewStore;

  projectViews: IProjectViewsStore;
  projectViewIssues: IProjectViewIssuesStore;
  projectViewFilters: IProjectViewFiltersStore;
  projectViewIssueCalendarView: IProjectViewIssueCalendarViewStore;

  issueFilter: IIssueFilterStore;

  issueDetail: IIssueDetailStore;
  issueKanBanView: IIssueKanBanViewStore;
  issueCalendarView: IIssueCalendarViewStore;
  draftIssuesStore: DraftIssuesStore;
  quickAddIssue: IIssueQuickAddStore;

  calendar: ICalendarStore;

  globalViews: IGlobalViewsStore;
  globalViewIssues: IGlobalViewIssuesStore;
  globalViewFilters: IGlobalViewFiltersStore;

  profileIssues: IProfileIssueStore;
  profileIssueFilters: IProfileIssueFilterStore;

  archivedIssues: IArchivedIssueStore;
  archivedIssueDetail: IArchivedIssueDetailStore;
  archivedIssueFilters: IArchivedIssueFilterStore;

  draftIssues: IDraftIssueStore;
  draftIssueFilters: IDraftIssueFilterStore;

  inbox: IInboxStore;
  inboxIssues: IInboxIssuesStore;
  inboxIssueDetails: IInboxIssueDetailsStore;
  inboxFilters: IInboxFiltersStore;

  webhook: IWebhookStore;

  mentionsStore: IMentionsStore;

  // project v3 issue and issue-filters starts
  issuesFilter: IIssuesFilterStore;

  projectIssues: IProjectIssuesStore;
  projectIssuesFilter: IProjectIssuesFilterStore;

  moduleIssues: IModuleIssuesStore;
  moduleIssuesFilter: IModuleIssuesFilterStore;

  cycleIssues: ICycleIssuesStore;
  cycleIssuesFilter: ICycleIssuesFilterStore;

  viewIssues: IViewIssuesStore;
  viewIssuesFilter: IViewIssuesFilterStore;

  projectArchivedIssues: IProjectArchivedIssuesStore;
  projectArchivedIssuesFilter: IProjectArchivedIssuesFilterStore;

  projectDraftIssues: IProjectDraftIssuesStore;
  projectDraftIssuesFilter: IProjectDraftIssuesFilterStore;

  workspaceProfileIssues: IProfileIssuesStore;
  workspaceProfileIssuesFilter: IProfileIssuesFilterStore;

  workspaceGlobalIssues: IGlobalIssuesStore;
  workspaceGlobalIssuesFilter: IGlobalIssuesFilterStore;

  calendarHelpers: ICalendarHelpers;

  kanBanHelpers: IKanBanHelpers;
  // project v3 issue and issue-filters ends

  cycleIssueFilters: ICycleIssueFiltersStore;
  moduleIssueFilters: IModuleIssueFiltersStore;

  page: IPageStore;

  trackEvent: ITrackEventStore;

  constructor() {
    this.instance = new InstanceStore(this);

    this.appConfig = new AppConfigStore(this);
    this.commandPalette = new CommandPaletteStore(this);
    this.user = new UserStore(this);
    this.theme = new ThemeStore(this);

    this.workspace = new WorkspaceStore(this);
    this.workspaceFilter = new WorkspaceFilterStore(this);
    this.workspaceMember = new WorkspaceMemberStore(this);

    this.project = new ProjectStore(this);
    this.projectState = new ProjectStateStore(this);
    this.projectLabel = new ProjectLabelStore(this);
    this.projectEstimates = new ProjectEstimatesStore(this);
    this.projectPublish = new ProjectPublishStore(this);
    this.projectMember = new ProjectMemberStore(this);

    this.module = new ModuleStore(this);
    this.moduleIssue = new ModuleIssueStore(this);
    this.moduleFilter = new ModuleFilterStore(this);
    this.moduleIssueKanBanView = new ModuleIssueKanBanViewStore(this);
    this.moduleIssueCalendarView = new ModuleIssueCalendarViewStore(this);

    this.cycle = new CycleStore(this);
    this.cycleIssue = new CycleIssueStore(this);
    this.cycleIssueFilter = new CycleIssueFilterStore(this);
    this.cycleIssueKanBanView = new CycleIssueKanBanViewStore(this);
    this.cycleIssueCalendarView = new CycleIssueCalendarViewStore(this);

    this.projectViews = new ProjectViewsStore(this);
    this.projectViewIssues = new ProjectViewIssuesStore(this);
    this.projectViewFilters = new ProjectViewFiltersStore(this);
    this.projectViewIssueCalendarView = new ProjectViewIssueCalendarViewStore(this);

    this.issue = new IssueStore(this);
    this.issueFilter = new IssueFilterStore(this);
    this.issueDetail = new IssueDetailStore(this);
    this.issueKanBanView = new IssueKanBanViewStore(this);
    this.issueCalendarView = new IssueCalendarViewStore(this);
    this.draftIssuesStore = new DraftIssuesStore(this);
    this.quickAddIssue = new IssueQuickAddStore(this);

    this.calendar = new CalendarStore(this);

    this.globalViews = new GlobalViewsStore(this);
    this.globalViewIssues = new GlobalViewIssuesStore(this);
    this.globalViewFilters = new GlobalViewFiltersStore(this);

    this.profileIssues = new ProfileIssueStore(this);
    this.profileIssueFilters = new ProfileIssueFilterStore(this);

    this.archivedIssues = new ArchivedIssueStore(this);
    this.archivedIssueDetail = new ArchivedIssueDetailStore(this);
    this.archivedIssueFilters = new ArchivedIssueFilterStore(this);

    this.draftIssues = new DraftIssueStore(this);
    this.draftIssueFilters = new DraftIssueFilterStore(this);

    this.inbox = new InboxStore(this);
    this.inboxIssues = new InboxIssuesStore(this);
    this.inboxIssueDetails = new InboxIssueDetailsStore(this);
    this.inboxFilters = new InboxFiltersStore(this);

    this.webhook = new WebhookStore(this);

    this.mentionsStore = new MentionsStore(this);

    // project v3 issue and issue-filters starts
    this.issuesFilter = new IssuesFilterStore(this);

    this.projectIssues = new ProjectIssuesStore(this);
    this.projectIssuesFilter = new ProjectIssuesFilterStore(this);

    this.moduleIssues = new ModuleIssuesStore(this);
    this.moduleIssuesFilter = new ModuleIssuesFilterStore(this);

    this.cycleIssues = new CycleIssuesStore(this);
    this.cycleIssuesFilter = new CycleIssuesFilterStore(this);

    this.viewIssues = new ViewIssuesStore(this);
    this.viewIssuesFilter = new ViewIssuesFilterStore(this);

    this.projectArchivedIssues = new ProjectArchivedIssuesStore(this);
    this.projectArchivedIssuesFilter = new ProjectArchivedIssuesFilterStore(this);

    this.projectDraftIssues = new ProjectDraftIssuesStore(this);
    this.projectDraftIssuesFilter = new ProjectDraftIssuesFilterStore(this);

    this.workspaceProfileIssues = new ProfileIssuesStore(this);
    this.workspaceProfileIssuesFilter = new ProfileIssuesFilterStore(this);

    this.workspaceGlobalIssues = new GlobalIssuesStore(this);
    this.workspaceGlobalIssuesFilter = new GlobalIssuesFilterStore(this);

    this.calendarHelpers = new CalendarHelpers();

    this.kanBanHelpers = new KanBanHelpers();
    // project v3 issue and issue-filters ends

    this.cycleIssueFilters = new CycleIssueFiltersStore(this);

    this.moduleIssueFilters = new ModuleIssueFiltersStore(this);

    this.page = new PageStore(this);

    this.trackEvent = new TrackEventStore(this);
  }
}
