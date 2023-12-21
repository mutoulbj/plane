import { Fragment, useState } from "react";

import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";

// hooks
import { usePopper } from "react-popper";
// ui
import { Combobox } from "@headlessui/react";
import { StateGroupIcon, Tooltip } from "@plane/ui";
import { Check, ChevronDown, Search } from "lucide-react";
// types
import { IState } from "types";
import { Placement } from "@popperjs/core";
import { RootStore } from "store/root";

export interface IIssuePropertyState {
  projectId: string | null;
  value: any | string | null;
  defaultOptions?: any;
  onChange: (state: IState) => void;
  disabled?: boolean;
  hideDropdownArrow?: boolean;
  className?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  placement?: Placement;
}

export const IssuePropertyState: React.FC<IIssuePropertyState> = observer((props) => {
  const {
    projectId,
    value,
    defaultOptions = [],
    onChange,
    disabled,
    hideDropdownArrow = false,
    className = "",
    buttonClassName = "",
    optionsClassName = "",
    placement,
  } = props;

  const { workspace: workspaceStore, projectState: projectStateStore }: RootStore = useMobxStore();
  const workspaceSlug = workspaceStore?.workspaceSlug;

  const [query, setQuery] = useState("");
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  let projectStates: IState[] = defaultOptions;
  const storeStates = projectId ? projectStateStore.states[projectId] : [];
  if (storeStates && storeStates.length > 0) projectStates = storeStates;

  const fetchProjectStates = () => {
    setIsLoading(true);
    if (workspaceSlug && projectId)
      workspaceSlug &&
        projectId &&
        projectStateStore.fetchProjectStates(workspaceSlug, projectId).then(() => setIsLoading(false));
  };

  const selectedOption: IState | undefined =
    (projectStates && value && projectStates?.find((state) => state.id === value)) || undefined;

  const dropdownOptions = projectStates?.map((state) => ({
    value: state.id,
    query: state.name,
    content: (
      <div className="flex w-full items-center gap-2 overflow-hidden">
        <StateGroupIcon stateGroup={state.group} color={state.color} />
        <div className="line-clamp-1 inline-block w-full truncate">{state.name}</div>
      </div>
    ),
  }));

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: placement ?? "bottom-start",
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          padding: 12,
        },
      },
    ],
  });

  const filteredOptions =
    query === ""
      ? dropdownOptions
      : dropdownOptions?.filter((option) => option.query.toLowerCase().includes(query.toLowerCase()));

  const label = (
    <Tooltip tooltipHeading="State" tooltipContent={selectedOption?.name ?? ""} position="top">
      <div className="flex w-full items-center gap-2 text-custom-text-200">
        {selectedOption && <StateGroupIcon stateGroup={selectedOption?.group as any} color={selectedOption?.color} />}
        <span className="line-clamp-1 inline-block truncate">{selectedOption?.name ?? "State"}</span>
      </div>
    </Tooltip>
  );

  return (
    <>
      {workspaceSlug && projectId && (
        <Combobox
          as="div"
          className={`w-auto max-w-full flex-shrink-0 text-left ${className}`}
          value={selectedOption?.id}
          onChange={(data: string) => {
            const selectedState = projectStates?.find((state) => state.id === data);
            if (selectedState) onChange(selectedState);
          }}
          disabled={disabled}
        >
          <Combobox.Button as={Fragment}>
            <button
              ref={setReferenceElement}
              type="button"
              className={`flex h-5 w-full items-center justify-between gap-1 rounded border-[0.5px] border-custom-border-300 px-2.5 py-1 text-xs ${
                disabled ? "cursor-not-allowed text-custom-text-200" : "cursor-pointer hover:bg-custom-background-80"
              } ${buttonClassName}`}
              onClick={(e) => {
                e.stopPropagation();
                !storeStates && fetchProjectStates();
              }}
            >
              {label}
              {!hideDropdownArrow && !disabled && <ChevronDown className="h-3 w-3" aria-hidden="true" />}
            </button>
          </Combobox.Button>
          <Combobox.Options className="fixed z-10">
            <div
              className={`my-1 w-48 whitespace-nowrap rounded border border-custom-border-300 bg-custom-background-100 px-2 py-2.5 text-xs shadow-custom-shadow-rg focus:outline-none ${optionsClassName}`}
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              <div className="flex w-full items-center justify-start rounded border border-custom-border-200 bg-custom-background-90 px-2">
                <Search className="h-3.5 w-3.5 text-custom-text-300" />
                <Combobox.Input
                  className="w-full bg-transparent px-2 py-1 text-xs text-custom-text-200 placeholder:text-custom-text-400 focus:outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  displayValue={(assigned: any) => assigned?.name}
                />
              </div>
              <div className={`mt-2 max-h-48 space-y-1 overflow-y-scroll`}>
                {isLoading ? (
                  <p className="text-center text-custom-text-200">Loading...</p>
                ) : filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <Combobox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active, selected }) =>
                        `flex cursor-pointer select-none items-center justify-between gap-2 truncate rounded px-1 py-1.5 ${
                          active ? "bg-custom-background-80" : ""
                        } ${selected ? "text-custom-text-100" : "text-custom-text-200"}`
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      {({ selected }) => (
                        <>
                          {option.content}
                          {selected && (
                            <div className="flex-shrink-0">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                ) : (
                  <span className="flex items-center gap-2 p-1">
                    <p className="text-left text-custom-text-200 ">No matching results</p>
                  </span>
                )}
              </div>
            </div>
          </Combobox.Options>
        </Combobox>
      )}
    </>
  );
});
