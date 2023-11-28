// react
import { useEffect, useState, FC } from "react";
// next
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
// images
import githubLightModeImage from "/public/logos/github-black.png";
import githubDarkModeImage from "/public/logos/github-dark.svg";
import { AuthType } from "components/page-views";

export interface GithubLoginButtonProps {
  handleSignIn: React.Dispatch<string>;
  clientId: string;
  authType: AuthType;
}

export const GithubLoginButton: FC<GithubLoginButtonProps> = (props) => {
  const { handleSignIn, clientId, authType } = props;
  // states
  const [loginCallBackURL, setLoginCallBackURL] = useState(undefined);
  const [gitCode, setGitCode] = useState<null | string>(null);
  // router
  const {
    query: { code },
  } = useRouter();
  // theme
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (code && !gitCode) {
      setGitCode(code.toString());
      handleSignIn(code.toString());
    }
  }, [code, gitCode, handleSignIn]);

  useEffect(() => {
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
    setLoginCallBackURL(`${origin}/` as any);
  }, []);
  return (
    <div className="w-full flex justify-center items-center">
      <Link
        href={`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${loginCallBackURL}&scope=read:user,user:email`}
      >
        <button
          className={`flex w-full items-center justify-center gap-2 hover:bg-onboarding-background-300 rounded border px-2 text-sm font-medium text-custom-text-100 duration-300 h-[42px] ${
            resolvedTheme === "dark" ? "bg-[#2F3135] border-[#43484F]" : "border-[#D9E4FF]"
          }`}
        >
          <Image
            src={resolvedTheme === "dark" ? githubDarkModeImage : githubLightModeImage}
            height={20}
            width={20}
            alt="GitHub Logo"
          />
          <span className="text-onboarding-text-200">{authType == "sign-in" ? "Sign-in" : "Sign-up"} with GitHub</span>
        </button>
      </Link>
    </div>
  );
};
