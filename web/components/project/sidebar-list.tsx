import React, { useState, FC, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";
import { Disclosure, Transition } from "@headlessui/react";
import { observer } from "mobx-react-lite";
// hooks
import useToast from "hooks/use-toast";
// components
import { CreateProjectModal, ProjectSidebarListItem } from "components/project";

// icons
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
// helpers
import { copyUrlToClipboard } from "helpers/string.helper";
import { orderArrayBy } from "helpers/array.helper";
// types
import { IProject } from "types";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// constants
import { EUserWorkspaceRoles } from "constants/workspace";

export const ProjectSidebarList: FC = observer(() => {
  // states
  const [isFavoriteProjectCreate, setIsFavoriteProjectCreate] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // scroll animation state
  // refs
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    theme: { sidebarCollapsed },
    project: { joinedProjects, favoriteProjects, orderProjectsWithSortOrder, updateProjectView },
    commandPalette: { toggleCreateProjectModal },
    trackEvent: { setTrackElement },
    user: { currentWorkspaceRole },
  } = useMobxStore();
  // router
  const router = useRouter();
  const { workspaceSlug } = router.query;

  // toast
  const { setToastAlert } = useToast();

  const isAuthorizedUser = !!currentWorkspaceRole && currentWorkspaceRole >= EUserWorkspaceRoles.MEMBER;

  const orderedJoinedProjects: IProject[] | undefined = joinedProjects
    ? orderArrayBy(joinedProjects, "sort_order", "ascending")
    : undefined;

  const orderedFavProjects: IProject[] | undefined = favoriteProjects
    ? orderArrayBy(favoriteProjects, "sort_order", "ascending")
    : undefined;

  const handleCopyText = (projectId: string) => {
    copyUrlToClipboard(`${workspaceSlug}/projects/${projectId}/issues`).then(() => {
      setToastAlert({
        type: "success",
        title: "Link Copied!",
        message: "Project link copied to clipboard.",
      });
    });
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination || !workspaceSlug) return;

    if (source.index === destination.index) return;

    const updatedSortOrder = orderProjectsWithSortOrder(source.index, destination.index, draggableId);

    updateProjectView(workspaceSlug.toString(), draggableId, { sort_order: updatedSortOrder }).catch(() => {
      setToastAlert({
        type: "error",
        title: "Error!",
        message: "Something went wrong. Please try again.",
      });
    });
  };

  const isCollapsed = sidebarCollapsed || false;

  /**
   * Implementing scroll animation styles based on the scroll length of the container
   */
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        setIsScrolled(scrollTop > 0);
      }
    };
    const currentContainerRef = containerRef.current;
    if (currentContainerRef) {
      currentContainerRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentContainerRef) {
        currentContainerRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <>
      {workspaceSlug && (
        <CreateProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => {
            setIsProjectModalOpen(false);
          }}
          setToFavorite={isFavoriteProjectCreate}
          workspaceSlug={workspaceSlug.toString()}
        />
      )}
      <div
        ref={containerRef}
        className={`h-full space-y-2 overflow-y-auto px-4 ${
          isScrolled ? "border-t border-custom-sidebar-border-300" : ""
        }`}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="favorite-projects">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {orderedFavProjects && orderedFavProjects.length > 0 && (
                  <Disclosure as="div" className="flex flex-col" defaultOpen>
                    {({ open }) => (
                      <>
                        {!isCollapsed && (
                          <div className="group flex w-full items-center justify-between rounded p-1.5 text-xs text-custom-sidebar-text-400 hover:bg-custom-sidebar-background-80">
                            <Disclosure.Button
                              as="button"
                              type="button"
                              className="group flex w-full items-center gap-1 whitespace-nowrap rounded px-1.5 text-left text-sm font-semibold text-custom-sidebar-text-400 hover:bg-custom-sidebar-background-80"
                            >
                              Favorites
                              {open ? (
                                <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                              ) : (
                                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                              )}
                            </Disclosure.Button>
                            {isAuthorizedUser && (
                              <button
                                className="opacity-0 group-hover:opacity-100"
                                onClick={() => {
                                  setTrackElement("APP_SIDEBAR_FAVORITES_BLOCK");
                                  setIsFavoriteProjectCreate(true);
                                  setIsProjectModalOpen(true);
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                        <Transition
                          enter="transition duration-100 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <Disclosure.Panel as="div" className="space-y-2">
                            {orderedFavProjects.map((project, index) => (
                              <Draggable
                                key={project.id}
                                draggableId={project.id}
                                index={index}
                                isDragDisabled={!project.is_member}
                              >
                                {(provided, snapshot) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps}>
                                    <ProjectSidebarListItem
                                      key={project.id}
                                      project={project}
                                      provided={provided}
                                      snapshot={snapshot}
                                      handleCopyText={() => handleCopyText(project.id)}
                                      shortContextMenu
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </Disclosure.Panel>
                        </Transition>
                        {provided.placeholder}
                      </>
                    )}
                  </Disclosure>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="joined-projects">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {orderedJoinedProjects && orderedJoinedProjects.length > 0 && (
                  <Disclosure as="div" className="flex flex-col" defaultOpen>
                    {({ open }) => (
                      <>
                        {!isCollapsed && (
                          <div className="group flex w-full items-center justify-between rounded p-1.5 text-xs text-custom-sidebar-text-400 hover:bg-custom-sidebar-background-80">
                            <Disclosure.Button
                              as="button"
                              type="button"
                              className="group flex w-full items-center gap-1 whitespace-nowrap rounded px-1.5 text-left text-sm font-semibold text-custom-sidebar-text-400 hover:bg-custom-sidebar-background-80"
                            >
                              Projects
                              {open ? (
                                <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                              ) : (
                                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                              )}
                            </Disclosure.Button>
                            {isAuthorizedUser && (
                              <button
                                className="opacity-0 group-hover:opacity-100"
                                onClick={() => {
                                  setIsFavoriteProjectCreate(false);
                                  setIsProjectModalOpen(true);
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                        <Transition
                          enter="transition duration-100 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <Disclosure.Panel as="div" className="space-y-2">
                            {orderedJoinedProjects.map((project, index) => (
                              <Draggable key={project.id} draggableId={project.id} index={index}>
                                {(provided, snapshot) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps}>
                                    <ProjectSidebarListItem
                                      key={project.id}
                                      project={project}
                                      provided={provided}
                                      snapshot={snapshot}
                                      handleCopyText={() => handleCopyText(project.id)}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </Disclosure.Panel>
                        </Transition>
                        {provided.placeholder}
                      </>
                    )}
                  </Disclosure>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {isAuthorizedUser && joinedProjects && joinedProjects.length === 0 && (
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 text-sm text-custom-sidebar-text-200"
            onClick={() => {
              setTrackElement("APP_SIDEBAR");
              toggleCreateProjectModal(true);
            }}
          >
            <Plus className="h-5 w-5" />
            {!isCollapsed && "Add Project"}
          </button>
        )}
      </div>
    </>
  );
});
