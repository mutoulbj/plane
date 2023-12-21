import { observer } from "mobx-react-lite";

// icons
import { X } from "lucide-react";
// types
import { IProject } from "types";
import { renderEmoji } from "helpers/emoji.helper";

type Props = {
  handleRemove: (val: string) => void;
  projects: IProject[] | undefined;
  values: string[];
  editable: boolean | undefined;
};

export const AppliedProjectFilters: React.FC<Props> = observer((props) => {
  const { handleRemove, projects, values, editable } = props;

  return (
    <>
      {values.map((projectId) => {
        const projectDetails = projects?.find((p) => p.id === projectId);

        if (!projectDetails) return null;

        return (
          <div key={projectId} className="flex items-center gap-1 rounded bg-custom-background-80 p-1 text-xs">
            {projectDetails.emoji ? (
              <span className="grid flex-shrink-0 place-items-center">{renderEmoji(projectDetails.emoji)}</span>
            ) : projectDetails.icon_prop ? (
              <div className="-my-1 grid flex-shrink-0 place-items-center">{renderEmoji(projectDetails.icon_prop)}</div>
            ) : (
              <span className="mr-1 grid flex-shrink-0 place-items-center rounded bg-gray-700 uppercase text-white">
                {projectDetails?.name.charAt(0)}
              </span>
            )}
            <span className="normal-case">{projectDetails.name}</span>
            {editable && (
              <button
                type="button"
                className="grid place-items-center text-custom-text-300 hover:text-custom-text-200"
                onClick={() => handleRemove(projectId)}
              >
                <X size={10} strokeWidth={2} />
              </button>
            )}
          </div>
        );
      })}
    </>
  );
});
