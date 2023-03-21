import { PasswordInput, PasswordInputProps } from "@mantine/core";

const PasswordInputSetStyles = (props: PasswordInputProps) => {
  const width: string | number = props.width;

  return (
    <PasswordInput
      variant="filled"
      size="xs"
      {...props}
      styles={{
        input: {
          minHeight: "1.5rem",
          height: "1.5rem",
          paddingLeft: "6px",
          paddingRight: "6px",
          letterSpacing: "0.3px",
          lineHeight: "calc(1.5rem - 0.125rem)",
          backgroundColor: "#E5E5E5",
          width: width && width,
        },
        innerInput: {
          minHeight: "1.5rem",
          height: "1.5rem",
          paddingLeft: "6px",
          paddingRight: "6px",
          letterSpacing: "0.3px",
          lineHeight: "calc(1.5rem - 0.125rem)",
          backgroundColor: "#E5E5E5",
          width: width && width,
        },
      }}
    />
  );
};

export default PasswordInputSetStyles;
