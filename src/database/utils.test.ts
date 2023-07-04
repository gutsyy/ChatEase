import { camelToHyphen } from "./utils";

test("camelToHyphen", () => {
  const result = camelToHyphen("getChatById");
  expect(result).toBe("get-chat-by-id");
});
