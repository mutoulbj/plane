import { action, observable, makeObservable, computed, runInAction, autorun } from "mobx";
// base class
import { IssueBaseStore } from "store/issues";
// services
import { IssueService } from "services/issue/issue.service";
// types
import { TIssueGroupByOptions } from "types";
import { IIssue } from "types/issues";
import { IIssueResponse, TLoader, IGroupedIssues, ISubGroupedIssues, TUnGroupedIssues, ViewFlags } from "../../types";
import { RootStore } from "store/root";

export interface IProjectIssuesStore {
  // observable
  loader: TLoader;
  issues: { [project_id: string]: IIssueResponse } | undefined;
  // computed
  getIssues: IIssueResponse | undefined;
  getIssuesIds: IGroupedIssues | ISubGroupedIssues | TUnGroupedIssues | undefined;
  // actions
  fetchIssues: (workspaceSlug: string, projectId: string, loadType: TLoader) => Promise<IIssueResponse>;
  createIssue: (workspaceSlug: string, projectId: string, data: Partial<IIssue>) => Promise<IIssue>;
  updateIssue: (workspaceSlug: string, projectId: string, issueId: string, data: Partial<IIssue>) => Promise<IIssue>;
  removeIssue: (workspaceSlug: string, projectId: string, issueId: string) => Promise<IIssue>;
  quickAddIssue: (workspaceSlug: string, projectId: string, data: IIssue) => Promise<IIssue>;

  viewFlags: ViewFlags;
}

export class ProjectIssuesStore extends IssueBaseStore implements IProjectIssuesStore {
  loader: TLoader = "init-loader";
  issues: { [project_id: string]: IIssueResponse } | undefined = undefined;
  // root store
  rootStore;
  // service
  issueService;

  //viewData
  viewFlags = {
    enableQuickAdd: true,
    enableIssueCreation: true,
    enableInlineEditing: true,
  };

  constructor(_rootStore: RootStore) {
    super(_rootStore);

    makeObservable(this, {
      // observable
      loader: observable.ref,
      issues: observable.ref,
      // computed
      getIssues: computed,
      getIssuesIds: computed,
      // action
      fetchIssues: action,
      createIssue: action,
      updateIssue: action,
      removeIssue: action,
      quickAddIssue: action,
    });

    this.rootStore = _rootStore;
    this.issueService = new IssueService();

    autorun(() => {
      const workspaceSlug = this.rootStore.workspace.workspaceSlug;
      const projectId = this.rootStore.project.projectId;
      const hasPermissionToCurrentProject = this.rootStore.user.hasPermissionToCurrentProject;
      if (!workspaceSlug || !projectId || !hasPermissionToCurrentProject) return;

      const userFilters = this.rootStore?.projectIssuesFilter?.issueFilters?.filters;
      if (userFilters) this.fetchIssues(workspaceSlug, projectId, "mutation");
    });
  }

  get getIssues() {
    const projectId = this.rootStore?.project.projectId;
    if (!projectId || !this.issues || !this.issues[projectId]) return undefined;

    return this.issues[projectId];
  }

  get getIssuesIds() {
    const projectId = this.rootStore?.project.projectId;
    const displayFilters = this.rootStore?.projectIssuesFilter?.issueFilters?.displayFilters;
    if (!displayFilters) return undefined;

    const subGroupBy = displayFilters?.sub_group_by;
    const groupBy = displayFilters?.group_by;
    const orderBy = displayFilters?.order_by;
    const layout = displayFilters?.layout;

    if (!projectId || !this.issues || !this.issues[projectId]) return undefined;

    let issues: IIssueResponse | IGroupedIssues | ISubGroupedIssues | TUnGroupedIssues | undefined = undefined;

    if (layout === "list" && orderBy) {
      if (groupBy) issues = this.groupedIssues(groupBy, orderBy, this.issues[projectId]);
      else issues = this.unGroupedIssues(orderBy, this.issues[projectId]);
    } else if (layout === "kanban" && groupBy && orderBy) {
      if (subGroupBy) issues = this.subGroupedIssues(subGroupBy, groupBy, orderBy, this.issues[projectId]);
      else issues = this.groupedIssues(groupBy, orderBy, this.issues[projectId]);
    } else if (layout === "calendar")
      issues = this.groupedIssues("target_date" as TIssueGroupByOptions, "target_date", this.issues[projectId], true);
    else if (layout === "spreadsheet") issues = this.unGroupedIssues(orderBy ?? "-created_at", this.issues[projectId]);
    else if (layout === "gantt_chart") issues = this.unGroupedIssues(orderBy ?? "sort_order", this.issues[projectId]);

    return issues;
  }

  fetchIssues = async (workspaceSlug: string, projectId: string, loadType: TLoader = "init-loader") => {
    try {
      this.loader = loadType;

      const params = this.rootStore?.projectIssuesFilter?.appliedFilters;
      const response = await this.issueService.getIssues(workspaceSlug, projectId, params);

      const _issues = { ...this.issues, [projectId]: { ...response } };

      runInAction(() => {
        this.issues = _issues;
        this.loader = undefined;
      });

      return response;
    } catch (error) {
      console.error(error);
      this.loader = undefined;
      throw error;
    }
  };

  createIssue = async (workspaceSlug: string, projectId: string, data: Partial<IIssue>) => {
    try {
      const response = await this.issueService.createIssue(workspaceSlug, projectId, data);

      let _issues = this.issues;
      if (!_issues) _issues = {};
      if (!_issues[projectId]) _issues[projectId] = {};
      _issues[projectId] = { ..._issues[projectId], ...{ [response.id]: response } };

      runInAction(() => {
        this.issues = _issues;
      });

      return response;
    } catch (error) {
      this.fetchIssues(workspaceSlug, projectId, "mutation");
      throw error;
    }
  };

  updateIssue = async (workspaceSlug: string, projectId: string, issueId: string, data: Partial<IIssue>) => {
    try {
      let _issues = { ...this.issues };
      if (!_issues) _issues = {};
      if (!_issues[projectId]) _issues[projectId] = {};
      _issues[projectId][issueId] = { ..._issues[projectId][issueId], ...data };

      runInAction(() => {
        this.issues = _issues;
      });

      const response = await this.issueService.patchIssue(workspaceSlug, projectId, issueId, data);

      runInAction(() => {
        _issues = { ...this.issues };
        _issues[projectId][issueId] = { ..._issues[projectId][issueId], ...response };
        this.issues = _issues;
      });

      return response;
    } catch (error) {
      this.fetchIssues(workspaceSlug, projectId, "mutation");
      throw error;
    }
  };

  removeIssue = async (workspaceSlug: string, projectId: string, issueId: string) => {
    try {
      let _issues = { ...this.issues };
      if (!_issues) _issues = {};
      if (!_issues[projectId]) _issues[projectId] = {};
      delete _issues?.[projectId]?.[issueId];
      _issues[projectId] = { ..._issues[projectId] };

      runInAction(() => {
        this.issues = _issues;
      });

      const response = await this.issueService.deleteIssue(workspaceSlug, projectId, issueId);

      return response;
    } catch (error) {
      this.fetchIssues(workspaceSlug, projectId, "mutation");
      throw error;
    }
  };

  quickAddIssue = async (workspaceSlug: string, projectId: string, data: IIssue) => {
    try {
      let _issues = { ...this.issues };
      if (!_issues) _issues = {};
      if (!_issues[projectId]) _issues[projectId] = {};
      _issues[projectId] = { ..._issues[projectId], ...{ [data.id as keyof IIssue]: data } };

      runInAction(() => {
        this.issues = _issues;
      });

      const response = await this.issueService.createIssue(workspaceSlug, projectId, data);

      if (this.issues) {
        delete this.issues[projectId][data.id as keyof IIssue];

        let _issues = { ...this.issues };
        if (!_issues) _issues = {};
        if (!_issues[projectId]) _issues[projectId] = {};
        _issues[projectId] = { ..._issues[projectId], ...{ [response.id as keyof IIssue]: response } };

        runInAction(() => {
          this.issues = _issues;
        });
      }

      return response;
    } catch (error) {
      this.fetchIssues(workspaceSlug, projectId, "mutation");
      throw error;
    }
  };
}
