import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
// packages
import { RichTextEditor } from "@plane/rich-text-editor";
// components
import { TextArea } from "@plane/ui";
import { IssueReaction } from "./reactions";
// hooks
import { useDebouncedCallback } from "use-debounce";
import useReloadConfirmations from "hooks/use-reload-confirmation";
import useEditorSuggestions from "hooks/use-editor-suggestions";
// types
import { IIssue } from "types";
// services
import { FileService } from "services/file.service";
import { useMobxStore } from "lib/mobx/store-provider";

const fileService = new FileService();

interface IPeekOverviewIssueDetails {
  workspaceSlug: string;
  issue: IIssue;
  issueReactions: any;
  user: any;
  issueUpdate: (issue: Partial<IIssue>) => void;
  issueReactionCreate: (reaction: string) => void;
  issueReactionRemove: (reaction: string) => void;
}

export const PeekOverviewIssueDetails: FC<IPeekOverviewIssueDetails> = (props) => {
  const { workspaceSlug, issue, issueReactions, user, issueUpdate, issueReactionCreate, issueReactionRemove } = props;
  // store
  const { user: userStore } = useMobxStore();
  const { currentProjectRole } = userStore;
  const isAllowed = [15, 20].includes(currentProjectRole || 0);
  // states
  const [isSubmitting, setIsSubmitting] = useState<"submitting" | "submitted" | "saved">("saved");
  const [characterLimit, setCharacterLimit] = useState(false);
  // hooks
  const { setShowAlert } = useReloadConfirmations();
  const editorSuggestions = useEditorSuggestions();

  const {
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<IIssue>({
    defaultValues: {
      name: "",
      description_html: "",
    },
  });

  const handleDescriptionFormSubmit = useCallback(
    async (formData: Partial<IIssue>) => {
      if (!formData?.name || formData?.name.length === 0 || formData?.name.length > 255) return;

      await issueUpdate({
        ...issue,
        name: formData.name ?? "",
        description_html: formData.description_html ?? "<p></p>",
      });
    },
    [issue, issueUpdate]
  );

  const [localTitleValue, setLocalTitleValue] = useState("");
  const issueTitleCurrentValue = watch("name");
  useEffect(() => {
    if (localTitleValue === "" && issueTitleCurrentValue !== "") {
      setLocalTitleValue(issueTitleCurrentValue);
    }
  }, [issueTitleCurrentValue, localTitleValue]);

  const debouncedFormSave = useDebouncedCallback(async () => {
    handleSubmit(handleDescriptionFormSubmit)().finally(() => setIsSubmitting("submitted"));
  }, 1500);

  useEffect(() => {
    if (isSubmitting === "submitted") {
      setShowAlert(false);
      setTimeout(async () => {
        setIsSubmitting("saved");
      }, 2000);
    } else if (isSubmitting === "submitting") {
      setShowAlert(true);
    }
  }, [isSubmitting, setShowAlert]);

  // reset form values
  useEffect(() => {
    if (!issue) return;

    reset({
      ...issue,
    });
  }, [issue, reset]);

  return (
    <>
      <span className="font-medium text-base text-custom-text-400">
        {issue?.project_detail?.identifier}-{issue?.sequence_id}
      </span>

      <div className="relative">
        {isAllowed ? (
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange } }) => (
              <TextArea
                id="name"
                name="name"
                value={localTitleValue}
                placeholder="Enter issue name"
                onFocus={() => setCharacterLimit(true)}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setCharacterLimit(false);
                  setIsSubmitting("submitting");
                  setLocalTitleValue(e.target.value);
                  onChange(e.target.value);
                  debouncedFormSave();
                }}
                required={true}
                className="min-h-10 block w-full resize-none overflow-hidden rounded border-none bg-transparent  text-xl outline-none ring-0 focus:ring-1 focus:ring-custom-primary !p-0 focus:!px-3 focus:!py-2"
                hasError={Boolean(errors?.description)}
                role="textbox"
                disabled={!true}
              />
            )}
          />
        ) : (
          <h4 className="break-words text-2xl font-semibold">{issue.name}</h4>
        )}
        {characterLimit && true && (
          <div className="pointer-events-none absolute bottom-1 right-1 z-[2] rounded bg-custom-background-100 text-custom-text-200 p-0.5 text-xs">
            <span className={`${watch("name").length === 0 || watch("name").length > 255 ? "text-red-500" : ""}`}>
              {watch("name").length}
            </span>
            /255
          </div>
        )}
      </div>
      <span>{errors.name ? errors.name.message : null}</span>
      <div className="relative">
        <Controller
          name="description_html"
          control={control}
          render={({ field: { value, onChange } }) => (
            <RichTextEditor
              cancelUploadImage={fileService.cancelUpload}
              uploadFile={fileService.getUploadFileFunction(workspaceSlug)}
              deleteFile={fileService.deleteImage}
              restoreFile={fileService.restoreImage}
              value={value}
              setShouldShowAlert={setShowAlert}
              setIsSubmitting={setIsSubmitting}
              dragDropEnabled
              customClassName={isAllowed ? "min-h-[150px] shadow-sm" : "!p-0 !pt-2 text-custom-text-200"}
              noBorder={!isAllowed}
              onChange={(description: Object, description_html: string) => {
                setShowAlert(true);
                setIsSubmitting("submitting");
                onChange(description_html);
                debouncedFormSave();
              }}
              mentionSuggestions={editorSuggestions.mentionSuggestions}
              mentionHighlights={editorSuggestions.mentionHighlights}
            />
          )}
        />
        <div
          className={`absolute right-5 bottom-5 text-xs text-custom-text-200 border border-custom-border-400 rounded-xl w-[6.5rem] py-1 z-10 flex items-center justify-center ${
            isSubmitting === "saved" ? "fadeOut" : "fadeIn"
          }`}
        >
          {isSubmitting === "submitting" ? "Saving..." : "Saved"}
        </div>
      </div>
      <IssueReaction
        issueReactions={issueReactions}
        user={user}
        issueReactionCreate={issueReactionCreate}
        issueReactionRemove={issueReactionRemove}
      />
    </>
  );
};
