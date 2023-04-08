import { Select, Switch, useMantineTheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { changeLanguage } from "i18next";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { lans } from "@/webview/i18n/i18n";
import SettingItem, { SettingItemProps } from "./SettingItem";
import { toggleAppTheme } from "@/webview/reducers/appSlice";
import { setFontSize, setLanguage } from "@/webview/reducers/settingSlice";

const AppearanceSettings = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();

  const language = useAppSelector((state) => state.settings.language);
  const fontSize = useAppSelector((state) => state.settings.fontSize);

  const settings: SettingItemProps[] = [
    {
      label: t("settings_appearance_language"),
      input: () => (
        <Select
          styles={{
            input: {
              minHeight: "1.5rem",
              height: "1.5rem",
              paddingLeft: "6px",
              paddingRight: "6px",
              letterSpacing: "0.3px",
              lineHeight: "calc(1.5rem - 0.125rem)",
              width: "80px",
            },
          }}
          value={language}
          size="xs"
          variant="filled"
          data={lans.map((lan) => ({ label: lan, value: lan }))}
          onChange={(value) => {
            dispatch(setLanguage(value as "en"));
            changeLanguage(value);
          }}
        ></Select>
      ),
    },
    {
      label: t("settings_appearance_theme"),
      input: () => (
        <Switch
          size="md"
          checked={theme.colorScheme === "dark"}
          color={theme.colorScheme === "dark" ? "gray" : "dark"}
          onLabel={
            <IconSun size="1rem" stroke={2.5} color={theme.colors.yellow[4]} />
          }
          offLabel={
            <IconMoonStars
              size="1rem"
              stroke={2.5}
              color={theme.colors.blue[6]}
            />
          }
          onChange={(e) => {
            const isDarkMode = e.currentTarget.checked;
            dispatch(toggleAppTheme(isDarkMode ? "dark" : "light"));
          }}
        />
      ),
    },
    {
      label: t("settings_appearance_fontSize"),
      input: () => (
        <Select
          styles={{
            input: {
              minHeight: "1.5rem",
              height: "1.5rem",
              paddingLeft: "6px",
              paddingRight: "6px",
              letterSpacing: "0.3px",
              lineHeight: "calc(1.5rem - 0.125rem)",
              width: "100px",
            },
          }}
          value={fontSize}
          size="xs"
          variant="filled"
          data={[
            { label: t("settings_appearance_fontSize_sm"), value: "16" },
            { label: t("settings_appearance_fontSize_md"), value: "18" },
            { label: t("settings_appearance_fontSize_lg"), value: "20" },
          ]}
          onChange={(value) => {
            dispatch(setFontSize(value));
            const root = document.documentElement;
            if (root) {
              root.style.fontSize = `${value}px`;
            }
          }}
        ></Select>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {settings.map((setting, i) => (
        <SettingItem key={i} {...setting} />
      ))}
    </div>
  );
};

export default AppearanceSettings;
