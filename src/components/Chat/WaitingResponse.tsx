import { Loader } from "@mantine/core";
import { useAppSelector } from "../../hooks/redux";

const WaitingResponse = () => {
  const isWaitingRes = useAppSelector((state) => state.chat.isWaitingRes);

  return (
    <>{isWaitingRes && <Loader variant="dots" size={20} className="ml-2" />}</>
  );
};

export default WaitingResponse;
