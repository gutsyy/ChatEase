import { Textarea, TextareaProps } from "@mantine/core";

const TextareaSetStyles = (props: TextareaProps) => {
  return (
    <Textarea
      styles={{
        input: {
          paddingLeft: "6px",
          paddingRight: "6px",
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
