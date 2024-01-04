import isEmpty from "lodash/isEmpty";
// types
import {
  IIssueDisplayFilterOptions,
  IIssueDisplayProperties,
  IIssueFilterOptions,
  IIssueFilters,
  IIssueFiltersResponse,
  TIssueParams,
} from "@plane/types";
// constants
import { isNil } from "constants/common";
import { EIssueFilterType, EIssuesStoreType } from "constants/issue";
// lib
import { storage } from "lib/local-storage";

interface ILocalStoreIssueFilters {
  key: EIssuesStoreType;
  workspaceSlug: string;
  projectId: string | undefined;
  userId: string | undefined;
  filters: IIssueFilters;
}

export interface IIssueFilterHelperStore {
  computedIssueFilters(filters: IIssueFilters): IIssueFilters;
  computedFilteredParams(
    filters: IIssueFilterOptions,
    displayFilters: IIssueDisplayFilterOptions,
    filteredParams: TIssueParams[]
  ): Partial<Record<TIssueParams, string | boolean>>;
  computedFilters(filters: IIssueFilterOptions): IIssueFilterOptions;
  computedDisplayFilters(displayFilters: IIssueDisplayFilterOptions): IIssueDisplayFilterOptions;
  computedDisplayProperties(filters: IIssueDisplayProperties): IIssueDisplayProperties;
}

export class IssueFilterHelperStore implements IIssueFilterHelperStore {
  constructor() {}

  /**
   * @description This method is used to apply the display filters on the issues
   * @param {IIssueFilters} filters
   * @returns {IIssueFilters}
   */
  computedIssueFilters = (filters: IIssueFilters): IIssueFilters => ({
    filters: isEmpty(filters?.filters) ? undefined : filters?.filters,
    displayFilters: isEmpty(filters?.displayFilters) ? undefined : filters?.displayFilters,
    displayProperties: isEmpty(filters?.displayProperties) ? undefined : filters?.displayProperties,
  });

  /**
   * @description This method is used to convert the filters array params to string params
   * @param {IIssueFilterOptions} filters
   * @param {IIssueDisplayFilterOptions} displayFilters
   * @param {string[]} acceptableParamsByLayout
   * @returns {Partial<Record<TIssueParams, string | boolean>>}
   */
  computedFilteredParams = (
    filters: IIssueFilterOptions,
    displayFilters: IIssueDisplayFilterOptions,
    acceptableParamsByLayout: TIssueParams[]
  ) => {
    const computedFilters: Partial<Record<TIssueParams, undefined | string[] | boolean | string>> = {
      // issue filters
      priority: filters?.priority || undefined,
      state_group: filters?.state_group || undefined,
      state: filters?.state || undefined,
      assignees: filters?.assignees || undefined,
      mentions: filters?.mentions || undefined,
      created_by: filters?.created_by || undefined,
      labels: filters?.labels || undefined,
      start_date: filters?.start_date || undefined,
      target_date: filters?.target_date || undefined,
      // display filters
      type: displayFilters?.type || undefined,
      sub_issue: isNil(displayFilters?.sub_issue) ? true : displayFilters?.sub_issue,
      start_target_date: isNil(displayFilters?.start_target_date) ? true : displayFilters?.start_target_date,
    };

    const issueFiltersParams: Partial<Record<TIssueParams, boolean | string>> = {};
    Object.keys(computedFilters).forEach((key) => {
      const _key = key as TIssueParams;
      const _value: string | boolean | string[] | undefined = computedFilters[_key];
      if (_value != undefined && acceptableParamsByLayout.includes(_key))
        issueFiltersParams[_key] = Array.isArray(_value) ? _value.join(",") : _value;
    });

    return issueFiltersParams;
  };

  /**
   * @description This method is used to apply the filters on the issues
   * @param {IIssueFilterOptions} filters
   * @returns {IIssueFilterOptions}
   */
  computedFilters = (filters: IIssueFilterOptions): IIssueFilterOptions => ({
    priority: filters?.priority || null,
    state: filters?.state || null,
    state_group: filters?.state_group || null,
    assignees: filters?.assignees || null,
    mentions: filters?.mentions || null,
    created_by: filters?.created_by || null,
    labels: filters?.labels || null,
    start_date: filters?.start_date || null,
    target_date: filters?.target_date || null,
    project: filters?.project || null,
    subscriber: filters?.subscriber || null,
  });

  /**
   * @description This method is used to apply the display filters on the issues
   * @param {IIssueDisplayFilterOptions} displayFilters
   * @returns {IIssueDisplayFilterOptions}
   */
  computedDisplayFilters = (displayFilters: IIssueDisplayFilterOptions): IIssueDisplayFilterOptions => ({
    calendar: {
      show_weekends: displayFilters?.calendar?.show_weekends || false,
      layout: displayFilters?.calendar?.layout || "month",
    },
    layout: displayFilters?.layout || "list",
    order_by: displayFilters?.order_by || "sort_order",
    group_by: displayFilters?.group_by || null,
    sub_group_by: displayFilters?.sub_group_by || null,
    type: displayFilters?.type || null,
    sub_issue: displayFilters?.sub_issue || false,
    show_empty_groups: displayFilters?.show_empty_groups || false,
    start_target_date: displayFilters?.start_target_date || false,
  });

  /**
   * @description This method is used to apply the display properties on the issues
   * @param {IIssueDisplayProperties} displayProperties
   * @returns {IIssueDisplayProperties}
   */
  computedDisplayProperties = (displayProperties: IIssueDisplayProperties): IIssueDisplayProperties => ({
    assignee: displayProperties?.assignee || false,
    start_date: displayProperties?.start_date || false,
    due_date: displayProperties?.due_date || false,
    labels: displayProperties?.labels || false,
    priority: displayProperties?.priority || false,
    state: displayProperties?.state || false,
    sub_issue_count: displayProperties?.sub_issue_count || false,
    attachment_count: displayProperties?.attachment_count || false,
    estimate: displayProperties?.estimate || false,
    link: displayProperties?.link || false,
    key: displayProperties?.key || false,
    created_on: displayProperties?.created_on || false,
    updated_on: displayProperties?.updated_on || false,
  });

  handleIssuesLocalFilters = {
    fetchFiltersFromStorage: () => {
      const _filters = storage.get("issue_local_filters");
      return _filters ? JSON.parse(_filters) : [];
    },

    get: (
      currentView: EIssuesStoreType,
      workspaceSlug: string,
      projectId: string | undefined,
      userId: string | undefined
    ) => {
      const storageFilters = this.handleIssuesLocalFilters.fetchFiltersFromStorage();
      const currentFilterIndex = storageFilters.findIndex(
        (filter: ILocalStoreIssueFilters) =>
          filter.key === currentView &&
          filter.workspaceSlug === workspaceSlug &&
          filter.projectId === projectId &&
          filter.userId === userId
      );
      if (!currentFilterIndex && currentFilterIndex.length < 0) return undefined;

      return storageFilters[currentFilterIndex];
    },

    set: (
      currentView: EIssuesStoreType,
      filterType: EIssueFilterType,
      workspaceSlug: string,
      projectId: string | undefined,
      userId: string | undefined,
      filters: Partial<IIssueFiltersResponse>
    ) => {
      const storageFilters = this.handleIssuesLocalFilters.fetchFiltersFromStorage();
      const currentFilterIndex = storageFilters.findIndex(
        (filter: ILocalStoreIssueFilters) =>
          filter.key === currentView &&
          filter.workspaceSlug === workspaceSlug &&
          filter.projectId === projectId &&
          filter.userId === userId
      );

      if (currentFilterIndex < 0)
        storageFilters.push({
          key: currentView,
          workspaceSlug: workspaceSlug,
          projectId: projectId,
          userId: userId,
          filters: filters,
        });
      else
        storageFilters[currentFilterIndex] = {
          ...storageFilters[currentFilterIndex],
          [filterType]: filters,
        };

      storage.set("issue_local_filters", JSON.stringify(storageFilters));
    },
  };
}
