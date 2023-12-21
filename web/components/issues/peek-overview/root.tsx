import { FC, Fragment, ReactNode, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// hooks
import useToast from "hooks/use-toast";
// components
import { IssueView } from "components/issues";
// helpers
import { copyUrlToClipboard } from "helpers/string.helper";
// types
import { IIssue, IIssueLink } from "types";
import { EIssueActions } from "../issue-layouts/types";
// constants
import { EUserWorkspaceRoles } from "constants/workspace";

interface IIssuePeekOverview {
  workspaceSlug: string;
  projectId: string;
  issueId: string;
  handleIssue: (issue: Partial<IIssue>, action: EIssueActions) => Promise<void>;
  isArchived?: boolean;
  children?: ReactNode;
}

export const IssuePeekOverview: FC<IIssuePeekOverview> = observer((props) => {
  const { workspaceSlug, projectId, issueId, handleIssue, children, isArchived = false } = props;

  const router = useRouter();
  const { peekIssueId } = router.query;

  const {
    issueDetail: {
      createIssueComment,
      updateIssueComment,
      removeIssueComment,
      creationIssueCommentReaction,
      removeIssueCommentReaction,
      createIssueReaction,
      removeIssueReaction,
      createIssueSubscription,
      removeIssueSubscription,
      createIssueLink,
      updateIssueLink,
      deleteIssueLink,
      getIssue,
      loader,
      fetchPeekIssueDetails,
      setPeekId,
      fetchIssueActivity,
    },
    archivedIssueDetail: {
      getIssue: getArchivedIssue,
      loader: archivedIssueLoader,
      fetchPeekIssueDetails: fetchArchivedPeekIssueDetails,
    },
    archivedIssues: { deleteArchivedIssue },
    project: { currentProjectDetails },
    workspaceMember: { currentWorkspaceUserProjectsRole },
  } = useMobxStore();

  const { setToastAlert } = useToast();

  const fetchIssueDetail = useCallback(async () => {
    if (workspaceSlug && projectId && peekIssueId) {
      if (isArchived) await fetchArchivedPeekIssueDetails(workspaceSlug, projectId, peekIssueId as string);
      else await fetchPeekIssueDetails(workspaceSlug, projectId, peekIssueId as string);
    }
  }, [fetchArchivedPeekIssueDetails, fetchPeekIssueDetails, workspaceSlug, projectId, peekIssueId, isArchived]);

  useEffect(() => {
    fetchIssueDetail();
  }, [workspaceSlug, projectId, peekIssueId, fetchIssueDetail]);

  const handleCopyText = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    copyUrlToClipboard(
      `${workspaceSlug}/projects/${projectId}/${isArchived ? "archived-issues" : "issues"}/${peekIssueId}`
    ).then(() => {
      setToastAlert({
        type: "success",
        title: "Link Copied!",
        message: "Issue link copied to clipboard.",
      });
    });
  };

  const redirectToIssueDetail = () => {
    router.push({
      pathname: `/${workspaceSlug}/projects/${projectId}/${isArchived ? "archived-issues" : "issues"}/${issueId}`,
    });
  };

  const issue = isArchived ? getArchivedIssue : getIssue;
  const isLoading = isArchived ? archivedIssueLoader : loader;

  const issueUpdate = async (_data: Partial<IIssue>) => {
    if (handleIssue) {
      await handleIssue(_data, EIssueActions.UPDATE);
      fetchIssueActivity(workspaceSlug, projectId, issueId);
    }
  };

  const issueReactionCreate = (reaction: string) => createIssueReaction(workspaceSlug, projectId, issueId, reaction);

  const issueReactionRemove = (reaction: string) => removeIssueReaction(workspaceSlug, projectId, issueId, reaction);

  const issueCommentCreate = (comment: any) => createIssueComment(workspaceSlug, projectId, issueId, comment);

  const issueCommentUpdate = (comment: any) =>
    updateIssueComment(workspaceSlug, projectId, issueId, comment?.id, comment);

  const issueCommentRemove = (commentId: string) => removeIssueComment(workspaceSlug, projectId, issueId, commentId);

  const issueCommentReactionCreate = (commentId: string, reaction: string) =>
    creationIssueCommentReaction(workspaceSlug, projectId, issueId, commentId, reaction);

  const issueCommentReactionRemove = (commentId: string, reaction: string) =>
    removeIssueCommentReaction(workspaceSlug, projectId, issueId, commentId, reaction);

  const issueSubscriptionCreate = () => createIssueSubscription(workspaceSlug, projectId, issueId);

  const issueSubscriptionRemove = () => removeIssueSubscription(workspaceSlug, projectId, issueId);

  const issueLinkCreate = (formData: IIssueLink) => createIssueLink(workspaceSlug, projectId, issueId, formData);

  const issueLinkUpdate = (formData: IIssueLink, linkId: string) =>
    updateIssueLink(workspaceSlug, projectId, issueId, linkId, formData);

  const issueLinkDelete = (linkId: string) => deleteIssueLink(workspaceSlug, projectId, issueId, linkId);

  const handleDeleteIssue = async () => {
    if (isArchived) await deleteArchivedIssue(workspaceSlug, projectId, issue!);
    else await handleIssue(issue!, EIssueActions.DELETE);
    const { query } = router;
    if (query.peekIssueId) {
      setPeekId(null);
      delete query.peekIssueId;
      delete query.peekProjectId;
      router.push({
        pathname: router.pathname,
        query: { ...query },
      });
    }
  };

  const userRole =
    (currentWorkspaceUserProjectsRole && currentWorkspaceUserProjectsRole[projectId]) ?? EUserWorkspaceRoles.GUEST;

  return (
    <Fragment>
      <IssueView
        workspaceSlug={workspaceSlug}
        projectId={projectId}
        issueId={issueId}
        issue={issue}
        isLoading={isLoading}
        isArchived={isArchived}
        handleCopyText={handleCopyText}
        redirectToIssueDetail={redirectToIssueDetail}
        issueUpdate={issueUpdate}
        issueReactionCreate={issueReactionCreate}
        issueReactionRemove={issueReactionRemove}
        issueCommentCreate={issueCommentCreate}
        issueCommentUpdate={issueCommentUpdate}
        issueCommentRemove={issueCommentRemove}
        issueCommentReactionCreate={issueCommentReactionCreate}
        issueCommentReactionRemove={issueCommentReactionRemove}
        issueSubscriptionCreate={issueSubscriptionCreate}
        issueSubscriptionRemove={issueSubscriptionRemove}
        issueLinkCreate={issueLinkCreate}
        issueLinkUpdate={issueLinkUpdate}
        issueLinkDelete={issueLinkDelete}
        handleDeleteIssue={handleDeleteIssue}
        disableUserActions={[5, 10].includes(userRole)}
        showCommentAccessSpecifier={currentProjectDetails?.is_deployed}
      >
        {children}
      </IssueView>
    </Fragment>
  );
});
