import { NumberInputProps, NumberInput } from "@mantine/core";

const NumberInputSetStyles = (props: NumberInputProps) => {
  const width: string | number = props.width;
  return (
    <NumberInput
      styles={{
        input: {
          minHeight: "1.5rem",
          height: "1.5rem",
          paddingLeft: "6px",
          paddingRight: "6px",
          letterSpacing: "0.3px",
          lineHeight: "calc(1.5rem - 0.125rem)",
          width: width && width,
        },
      }}
      variant="filled"
      size="xs"
      {...props}
    />
  );
};

export default NumberInputSetStyles;
