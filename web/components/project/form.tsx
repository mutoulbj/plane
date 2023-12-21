import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
// components
import EmojiIconPicker from "components/emoji-icon-picker";
import { ImagePickerPopover } from "components/core";
import { Button, CustomSelect, Input, TextArea } from "@plane/ui";
// types
import { IProject, IWorkspace } from "types";
// helpers
import { renderEmoji } from "helpers/emoji.helper";
import { renderShortDateWithYearFormat } from "helpers/date-time.helper";
// constants
import { NETWORK_CHOICES } from "constants/project";
// services
import { ProjectService } from "services/project";
// hooks
import useToast from "hooks/use-toast";
import { useMobxStore } from "lib/mobx/store-provider";

export interface IProjectDetailsForm {
  project: IProject;
  workspaceSlug: string;
  isAdmin: boolean;
}

const projectService = new ProjectService();

export const ProjectDetailsForm: FC<IProjectDetailsForm> = (props) => {
  const { project, workspaceSlug, isAdmin } = props;
  // store
  const {
    project: projectStore,
    trackEvent: { postHogEventTracker },
    workspace: { currentWorkspace },
  } = useMobxStore();
  // toast
  const { setToastAlert } = useToast();
  // form data
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IProject>({
    defaultValues: {
      ...project,
      emoji_and_icon: project.emoji ?? project.icon_prop,
      workspace: (project.workspace as IWorkspace).id,
    },
  });

  const handleIdentifierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");
    const formattedValue = alphanumericValue.toUpperCase();

    setValue("identifier", formattedValue);
  };

  const updateProject = async (payload: Partial<IProject>) => {
    if (!workspaceSlug || !project) return;

    return projectStore
      .updateProject(workspaceSlug.toString(), project.id, payload)
      .then((res) => {
        postHogEventTracker(
          "PROJECT_UPDATED",
          { ...res, state: "SUCCESS" },
          {
            isGrouping: true,
            groupType: "Workspace_metrics",
            gorupId: res.workspace,
          }
        );
        setToastAlert({
          type: "success",
          title: "Success!",
          message: "Project updated successfully",
        });
      })
      .catch((error) => {
        postHogEventTracker(
          "PROJECT_UPDATED",
          {
            state: "FAILED",
          },
          {
            isGrouping: true,
            groupType: "Workspace_metrics",
            gorupId: currentWorkspace?.id!,
          }
        );
        setToastAlert({
          type: "error",
          title: "Error!",
          message: error?.error ?? "Project could not be updated. Please try again.",
        });
      });
  };

  const onSubmit = async (formData: IProject) => {
    if (!workspaceSlug) return;

    const payload: Partial<IProject> = {
      name: formData.name,
      network: formData.network,
      identifier: formData.identifier,
      description: formData.description,
      cover_image: formData.cover_image,
    };

    if (typeof formData.emoji_and_icon === "object") {
      payload.emoji = null;
      payload.icon_prop = formData.emoji_and_icon;
    } else {
      payload.emoji = formData.emoji_and_icon;
      payload.icon_prop = null;
    }

    if (project.identifier !== formData.identifier)
      await projectService
        .checkProjectIdentifierAvailability(workspaceSlug as string, payload.identifier ?? "")
        .then(async (res) => {
          if (res.exists) setError("identifier", { message: "Identifier already exists" });
          else await updateProject(payload);
        });
    else await updateProject(payload);
  };

  const currentNetwork = NETWORK_CHOICES.find((n) => n.key === project?.network);
  const selectedNetwork = NETWORK_CHOICES.find((n) => n.key === watch("network"));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative mt-6 h-44 w-full">
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/50 to-transparent" />

        <img src={watch("cover_image")!} alt={watch("cover_image")!} className="h-44 w-full rounded-md object-cover" />
        <div className="absolute bottom-4 z-10 flex w-full items-end justify-between gap-3 px-4">
          <div className="flex flex-grow gap-3 truncate">
            <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-lg bg-custom-background-90">
              <div className="grid h-7 w-7 place-items-center">
                <Controller
                  control={control}
                  name="emoji_and_icon"
                  render={({ field: { value, onChange } }) => (
                    <EmojiIconPicker
                      label={value ? renderEmoji(value) : "Icon"}
                      value={value}
                      onChange={onChange}
                      disabled={!isAdmin}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 truncate text-white">
              <span className="truncate text-lg font-semibold">{watch("name")}</span>
              <span className="flex items-center gap-2 text-sm">
                <span>
                  {watch("identifier")} . {currentNetwork?.label}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-shrink-0 justify-center">
            <div>
              <Controller
                control={control}
                name="cover_image"
                render={({ field: { value, onChange } }) => (
                  <ImagePickerPopover
                    label={"Change cover"}
                    control={control}
                    onChange={onChange}
                    value={value}
                    disabled={!isAdmin}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="my-8 flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm">Project Name</h4>
          <Controller
            control={control}
            name="name"
            rules={{
              required: "Name is required",
            }}
            render={({ field: { value, onChange, ref } }) => (
              <Input
                id="name"
                name="name"
                type="text"
                ref={ref}
                value={value}
                onChange={onChange}
                hasError={Boolean(errors.name)}
                className="rounded-md !p-3 font-medium"
                placeholder="Project Name"
                disabled={!isAdmin}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm">Description</h4>
          <Controller
            name="description"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextArea
                id="description"
                name="description"
                value={value}
                placeholder="Enter project description"
                onChange={onChange}
                className="min-h-[102px] text-sm font-medium"
                hasError={Boolean(errors?.description)}
                disabled={!isAdmin}
              />
            )}
          />
        </div>

        <div className="flex w-full items-baseline justify-between gap-10">
          <div className="flex w-1/2 flex-col gap-1">
            <h4 className="text-sm">Identifier</h4>
            <Controller
              control={control}
              name="identifier"
              rules={{
                required: "Identifier is required",
                validate: (value) => /^[A-Z0-9]+$/.test(value.toUpperCase()) || "Identifier must be in uppercase.",
                minLength: {
                  value: 1,
                  message: "Identifier must at least be of 1 character",
                },
                maxLength: {
                  value: 6,
                  message: "Identifier must at most be of 6 characters",
                },
              }}
              render={({ field: { value, ref } }) => (
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={value}
                  onChange={handleIdentifierChange}
                  ref={ref}
                  hasError={Boolean(errors.identifier)}
                  placeholder="Enter identifier"
                  className="w-full font-medium"
                  disabled={!isAdmin}
                />
              )}
            />
            <span className="text-xs text-red-500">{errors?.identifier?.message}</span>
          </div>

          <div className="flex w-1/2 flex-col gap-1">
            <h4 className="text-sm">Network</h4>
            <Controller
              name="network"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomSelect
                  value={value}
                  onChange={onChange}
                  label={selectedNetwork?.label ?? "Select network"}
                  buttonClassName="!border-custom-border-200 !shadow-none font-medium rounded-md"
                  input
                  disabled={!isAdmin}
                  optionsClassName="w-full"
                >
                  {NETWORK_CHOICES.map((network) => (
                    <CustomSelect.Option key={network.key} value={network.key}>
                      {network.label}
                    </CustomSelect.Option>
                  ))}
                </CustomSelect>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <>
            <Button variant="primary" type="submit" loading={isSubmitting} disabled={!isAdmin}>
              {isSubmitting ? "Updating Project..." : "Update Project"}
            </Button>
            <span className="text-sm italic text-custom-sidebar-text-400">
              Created on {renderShortDateWithYearFormat(project?.created_at)}
            </span>
          </>
        </div>
      </div>
    </form>
  );
};
