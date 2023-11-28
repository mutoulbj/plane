import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Control, Controller, UseFormSetValue, UseFormWatch } from "react-hook-form";
import {
  BarChart2,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ContrastIcon,
  FileText,
  LayersIcon,
  LayoutGrid,
  PenSquare,
  Search,
  Settings,
  Bell,
} from "lucide-react";
import { Avatar, DiceIcon, PhotoFilterIcon } from "@plane/ui";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";

// types
import { IWorkspace } from "types";
// assets
import projectEmoji from "public/emoji/project-emoji.svg";

const workspaceLinks = [
  {
    Icon: LayoutGrid,
    name: "Dashboard",
  },
  {
    Icon: BarChart2,
    name: "Analytics",
  },
  {
    Icon: Briefcase,
    name: "Projects",
  },
  {
    Icon: CheckCircle,
    name: "All Issues",
  },
  {
    Icon: Bell,
    name: "Notifications",
  },
];

const projectLinks = [
  {
    name: "Issues",
    Icon: LayersIcon,
  },
  {
    name: "Cycles",

    Icon: ContrastIcon,
  },
  {
    name: "Modules",
    Icon: DiceIcon,
  },
  {
    name: "Views",

    Icon: PhotoFilterIcon,
  },
  {
    name: "Pages",

    Icon: FileText,
  },
  {
    name: "Settings",

    Icon: Settings,
  },
];

type Props = {
  workspaceName: string;
  showProject: boolean;
  control?: Control<IWorkspace, any>;
  setValue?: UseFormSetValue<IWorkspace>;
  watch?: UseFormWatch<IWorkspace>;
  userFullName?: string;
};
var timer: number = 0;
var lastWorkspaceName: string = "";

export const OnboardingSidebar: React.FC<Props> = (props) => {
  const { workspaceName, showProject, control, setValue, watch, userFullName } = props;
  const {
    workspace: workspaceStore,
    user: { currentUser },
  } = useMobxStore();
  const workspace = workspaceStore.workspaces ? workspaceStore.workspaces[0] : null;

  const { resolvedTheme } = useTheme();

  const handleZoomWorkspace = (value: string) => {
    // console.log(lastWorkspaceName,value);
    if (lastWorkspaceName === value) return;
    lastWorkspaceName = value;
    if (timer > 0) {
      timer += 2;
      timer = Math.min(timer, 2);
    } else {
      timer = 2;
      timer = Math.min(timer, 2);
      const interval = setInterval(() => {
        if (timer < 0) {
          setValue!("name", lastWorkspaceName);
          clearInterval(interval);
        }
        timer--;
      }, 1000);
    }
  };

  useEffect(() => {
    if (watch) {
      watch("name");
    }
  });

  return (
    <div className="border-r h-full border-onboarding-border-100 relative ">
      <div>
        {control && setValue ? (
          <Controller
            control={control}
            name="name"
            render={({ field: { value } }) => {
              if (value.length > 0) {
                handleZoomWorkspace(value);
              } else {
                lastWorkspaceName = "";
              }
              return timer > 0 ? (
                <div
                  className={`top-3 mt-4 transition-all bg-onboarding-background-200 w-full max-w-screen-sm flex items-center ml-6 border-[6px] ${
                    resolvedTheme == "dark" ? "border-onboarding-background-100" : "border-custom-primary-20"
                  } rounded-xl`}
                >
                  <div className="border rounded-lg py-6 pl-4 w-full border-onboarding-background-400">
                    <div
                      className={`${
                        resolvedTheme == "light" ? "bg-[#F5F5F5]" : "bg-[#363A40]"
                      }  w-full p-1 flex items-center`}
                    >
                      <div className="flex flex-shrink-0">
                        <Avatar
                          name={value.length > 0 ? value : "New Workspace"}
                          src={""}
                          size={30}
                          shape="square"
                          fallbackBackgroundColor="black"
                          className="!text-base capitalize"
                        />
                      </div>

                      <span className="text-xl font-medium text-onboarding-text-100 ml-2 truncate">{value}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex transition-all w-full border border-transparent items-center gap-y-2 px-4 pt-6 truncate">
                  <div className="flex flex-shrink-0">
                    <Avatar
                      name={value.length > 0 ? value : workspace ? workspace.name : "New Workspace"}
                      src={""}
                      size={24}
                      shape="square"
                      fallbackBackgroundColor="black"
                      className="!text-base capitalize"
                    />
                  </div>
                  <div className="w-full mx-2 items-center flex justify-between flex-shrink truncate">
                    <h4 className="text-custom-text-100 font-medium text-base truncate">{workspaceName}</h4>
                    <ChevronDown className={`h-4 w-4 mx-1 flex-shrink-0 text-custom-sidebar-text-400 duration-300`} />
                  </div>
                  <div className="flex flex-shrink-0">
                    <Avatar
                      name={currentUser?.email}
                      src={currentUser?.avatar}
                      size={24}
                      shape="square"
                      fallbackBackgroundColor="#FCBE1D"
                      className="!text-base capitalize"
                    />
                  </div>
                </div>
              );
            }}
          />
        ) : (
          <div className="flex transition-all w-full items-center gap-y-2 px-4 pt-6 truncate">
            <div className="flex flex-shrink-0">
              <Avatar
                name={workspace ? workspace.name : "New Workspace"}
                src={""}
                size={24}
                shape="square"
                fallbackBackgroundColor="black"
                className="!text-base capitalize"
              />
            </div>
            <div className="w-full mx-2 items-center flex justify-between flex-shrink truncate">
              <h4 className="text-custom-text-100 font-medium text-base truncate">{workspaceName}</h4>
              <ChevronDown className={`h-4 w-4 mx-1 flex-shrink-0 text-custom-sidebar-text-400 duration-300`} />
            </div>
            <div className="flex flex-shrink-0">
              <Avatar
                name={userFullName ?? currentUser?.email}
                src={currentUser?.avatar}
                size={24}
                shape="square"
                fallbackBackgroundColor="#FCBE1D"
                className="!text-base capitalize"
              />
            </div>
          </div>
        )}
      </div>

      <div className={`space-y-1 p-4`}>
        <div className={`flex items-center justify-between w-full px-1 mb-3 gap-2 mt-4 `}>
          <div
            className={`relative flex items-center justify-between w-full rounded gap-1 group
             px-3 shadow-custom-shadow-2xs border-onboarding-border-100 border 
          `}
          >
            <div className={`relative flex items-center gap-2 flex-grow rounded flex-shrink-0 py-1.5 outline-none`}>
              <PenSquare className="h-4 w-4 text-custom-sidebar-text-300" />
              {<span className="text-sm font-medium">New Issue</span>}
            </div>
          </div>

          <div
            className={`flex items-center justify-center rounded flex-shrink-0 p-2 outline-none
            shadow-custom-shadow-2xs border border-onboarding-border-100
            `}
          >
            <Search className="h-4 w-4 text-onboarding-text-200" />
          </div>
        </div>
        {workspaceLinks.map((link) => (
          <a className="block w-full">
            <div
              className={`group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-base font-medium outline-none 
                text-onboarding-text-200  focus:bg-custom-sidebar-background-80
                `}
            >
              {<link.Icon className="h-4 w-4" />}
              {link.name}
            </div>
          </a>
        ))}
      </div>

      {showProject && (
        <div className="px-4 pt-4">
          <p className="text-base pb-4 font-semibold text-custom-text-300">Projects</p>

          <div className="px-3">
            {" "}
            <div className="w-4/5 flex items-center text-base font-medium text-custom-text-200 mb-3 justify-between">
              <div className="flex items-center gap-x-2">
                <Image src={projectEmoji} alt="Plane Logo" className="h-4 w-4" />
                <span> Plane</span>
              </div>

              <ChevronDown className="h-4 w-4" />
            </div>
            {projectLinks.map((link) => (
              <a className="block ml-6 w-full">
                <div
                  className={`group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-base font-medium outline-none 
                    text-custom-sidebar-text-200  focus:bg-custom-sidebar-background-80
                `}
                >
                  {<link.Icon className="h-4 w-4" />}
                  {link.name}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
