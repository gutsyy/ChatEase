import { IconHelpOctagon } from "@tabler/icons-react";
import { TooltipSetStyles } from "../../../pureComponents/TooltipSetStyles";

export interface SettingItemProps {
  label: string;
  input: () => JSX.Element;
  questionInfo?: string;
  moreinfo?: JSX.Element;
}

const SettingItem = ({
  label,
  input: Input,
  moreinfo,
  questionInfo,
}: SettingItemProps) => {
  const MoreInfo = () => moreinfo;

  return (
    <div className="mt-1">
      <div className="flex w-full justify-between items-center px-1 my-1">
        <div className="flex items-center">
          <div className="text-xs">{label}</div>
          {questionInfo && (
            <TooltipSetStyles label={questionInfo}>
              <IconHelpOctagon className="text-gray-500 ml-1" size={12} />
            </TooltipSetStyles>
          )}
        </div>
        <Input />
      </div>

      <div
        className="text-gray-500 mt-1 flex justify-end mr-1"
        style={{
          fontSize: "12px",
        }}
      >
        {MoreInfo ? <MoreInfo /> : null}
      </div>
    </div>
  );
};

export default SettingItem;
