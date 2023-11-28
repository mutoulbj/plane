import { HeadingComp, SubheadingComp } from "./heading-component";
import { IMarking } from "..";
import { Editor } from "@tiptap/react";
import { scrollSummary } from "../utils/editor-summary-utils";

interface ContentBrowserProps {
  editor: Editor;
  markings: IMarking[];
}

export const ContentBrowser = (props: ContentBrowserProps) => {
  const { editor, markings } = props;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h2 className="font-medium">Table of Contents</h2>
      <div className="h-full overflow-y-auto">
        {markings.length !== 0 ? (
          markings.map((marking) =>
            marking.level === 1 ? (
              <HeadingComp
                onClick={() => scrollSummary(editor, marking)}
                heading={marking.text}
              />
            ) : (
              <SubheadingComp
                onClick={() => scrollSummary(editor, marking)}
                subHeading={marking.text}
              />
            ),
          )
        ) : (
          <p className="mt-3 text-xs text-custom-text-400">
            Headings will be displayed here for navigation
          </p>
        )}
      </div>
    </div>
  );
};
