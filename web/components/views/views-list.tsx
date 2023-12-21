import { useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";

// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { ProjectViewListItem } from "components/views";
import { NewEmptyState } from "components/common/new-empty-state";
// ui
import { Input, Loader } from "@plane/ui";
// assets
import emptyView from "public/empty-state/empty_view.webp";
// icons
import { Plus, Search } from "lucide-react";
// constants
import { EUserWorkspaceRoles } from "constants/workspace";

export const ProjectViewsList = observer(() => {
  const [query, setQuery] = useState("");

  const router = useRouter();
  const { projectId } = router.query;

  const {
    projectViews: projectViewsStore,
    commandPalette: commandPaletteStore,
    user: { currentProjectRole },
  } = useMobxStore();

  const viewsList = projectId ? projectViewsStore.viewsList[projectId.toString()] : undefined;

  const isEditingAllowed = !!currentProjectRole && currentProjectRole >= EUserWorkspaceRoles.MEMBER;

  if (!viewsList)
    return (
      <Loader className="space-y-4 p-4">
        <Loader.Item height="72px" />
        <Loader.Item height="72px" />
        <Loader.Item height="72px" />
        <Loader.Item height="72px" />
      </Loader>
    );

  const filteredViewsList = viewsList.filter((v) => v.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      {viewsList.length > 0 ? (
        <div className="flex h-full w-full flex-col">
          <div className="flex w-full flex-col overflow-hidden">
            <div className="flex w-full items-center gap-2.5 border-b border-custom-border-200 px-5 py-3">
              <Search className="text-custom-text-200" size={14} strokeWidth={2} />
              <Input
                className="w-full bg-transparent !p-0 text-xs leading-5 text-custom-text-200 placeholder:text-custom-text-400 focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                mode="true-transparent"
              />
            </div>
          </div>
          {filteredViewsList.length > 0 ? (
            filteredViewsList.map((view) => <ProjectViewListItem key={view.id} view={view} />)
          ) : (
            <p className="mt-10 text-center text-sm text-custom-text-300">No results found</p>
          )}
        </div>
      ) : (
        <NewEmptyState
          title="Save filtered views for your project. Create as many as you need."
          description="Views are a set of saved filters that you use frequently or want easy access to. All your colleagues in a project can see everyone’s views and choose whichever suits their needs best."
          image={emptyView}
          comicBox={{
            title: "Views work atop Issue properties.",
            description: "You can create a view from here with as many properties as filters as you see fit.",
            direction: "right",
          }}
          primaryButton={
            isEditingAllowed
              ? {
                  icon: <Plus size={14} strokeWidth={2} />,
                  text: "Build your first view",
                  onClick: () => commandPaletteStore.toggleCreateViewModal(true),
                }
              : null
          }
          disabled={!isEditingAllowed}
        />
      )}
    </>
  );
});
