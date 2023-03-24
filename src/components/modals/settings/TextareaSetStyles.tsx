import { Textarea, TextareaProps } from "@mantine/core";

const TextareaSetStyles = (props: TextareaProps) => {
  return (
    <Textarea
      styles={{
        input: {
          paddingLeft: "6px",
          paddingRight: "6px",
          paddingTop: "0.25rem !important",
          paddingBottom: "0.25rem !important",
          letterSpacing: "0.3px",
        },
      }}
      variant="filled"
      size="xs"
      {...props}
    />
  );
};

export default TextareaSetStyles;
