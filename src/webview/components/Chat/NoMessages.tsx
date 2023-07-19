import { clsx, useMantineTheme } from "@mantine/core";
import { IconBrandOpenai, IconCircleCheckFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const RenderFuncIntro = ({ text }: { text: string }) => {
  const { colorScheme } = useMantineTheme();

  return (
    <div className="flex gap-2 items-center py-2">
      <IconCircleCheckFilled size={20} className="text-green-600" />
      <div
        className={clsx(
          "font-greycliff",
          colorScheme === "dark" ? "text-dark-300" : "text-gray-600"
        )}
      >
        {text}
      </div>
    </div>
  );
};

export const NoMessages = () => {
  const { colorScheme } = useMantineTheme();
  const { t } = useTranslation();

  return (
    <div className="w-full flex h-full justify-center items-center absolute z-50 font-greycliff">
      No Messages, input something and start...
    </div>
  );

  return (
    <div className="w-full flex h-full justify-center items-center absolute z-50">
      <div
        className="flex flex-col justify-center items-start"
        style={{ height: "calc(100% - 37px)" }}
      >
        <div className="flex flex-col items-center justify-center">
          <IconBrandOpenai
            size={48}
            strokeWidth={1}
            className=" bg-violet-500 p-1 text-white rounded-xl shadow animate-bounce"
          />
          <div
            className={clsx(
              "mt-2 font-greycliff font-bold",
              colorScheme === "dark" ? "text-dark-300" : "text-gray-600"
            )}
          >
            <div>{t("app_intro")}</div>
          </div>
        </div>
        <div className="mt-2">
          <RenderFuncIntro text={t("func_intro_1")} />
          <RenderFuncIntro text={t("func_intro_2")} />
          <RenderFuncIntro text={t("func_intro_3")} />
          <RenderFuncIntro text={t("func_intro_4")} />
          <RenderFuncIntro text={t("func_intro_5")} />
        </div>
      </div>
    </div>
  );
};
