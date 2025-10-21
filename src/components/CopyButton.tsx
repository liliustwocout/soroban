import { Button, Tooltip, useClipboard } from "@chakra-ui/react";
import { IconCopy } from "@tabler/icons-react";
import { useState } from "react";

type CopyButtonProps = {
  str: string;
  value: string;
  size: "sm" | "md" | "xs";
};

const CopyButton = ({ str, value, size = "xs" }: CopyButtonProps) => {
  const [hasCopied, setHasCopied] = useState(false);
  const { onCopy } = useClipboard(value);

  const handleCopy = () => {
    onCopy();
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Tooltip closeOnClick={false} label={hasCopied ? "Copied!" : "Copy"}>
      <Button
        colorScheme={hasCopied ? "teal" : "gray"}
        size={size}
        rightIcon={<IconCopy size={15} />}
        onClick={handleCopy}
      >
        {str}
      </Button>
    </Tooltip>
  );
};

export default CopyButton;