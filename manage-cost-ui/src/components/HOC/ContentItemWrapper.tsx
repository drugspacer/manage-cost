import React, { memo } from "react";
import ComplexContentItem from "../about/ComplexContentItem";
import Stack from "@mui/material/Stack";
import Content from "../about/Content";
import { KeyPrefix } from "i18next";

const ContentItemWrapper = ({
  keyPrefix,
  size,
  hasText = false,
  simple = true,
}: {
  keyPrefix: KeyPrefix<"about">;
  size: number;
  hasText?: boolean;
  simple?: boolean;
}) => {
  const renderContent = () => {
    const result = [];
    if (simple) {
      return [
        <Stack
          key={keyPrefix}
          spacing={2}
          sx={(theme) => ({
            [theme.breakpoints.up("sm")]: {
              mt: 2,
              mb: 2,
              ml: 4,
              mr: 4,
              height: "610px",
            },
            [theme.breakpoints.down("sm")]: {
              height: "calc(100vh - 76px - 40px - 16px - 56px)",
            },
          })}
        >
          <Content keyPrefix={keyPrefix} hasText={hasText} listCount={size} />
        </Stack>,
      ];
    }
    for (let i = 0; i < size; i++) {
      result.push(
        <Stack
          key={`${keyPrefix}_${i}`}
          spacing={2}
          sx={(theme) => ({
            [theme.breakpoints.up("sm")]: {
              mt: 2,
              mb: 2,
              ml: 4,
              mr: 4,
              height: "610px",
            },
            [theme.breakpoints.down("sm")]: {
              height: "calc(100vh - 76px - 40px - 16px - 56px)",
            },
          })}
        >
          <ComplexContentItem
            index={i}
            final={i == size - 1}
            keyPrefix={keyPrefix}
          />
        </Stack>
      );
    }
    return result;
  };

  return <>{renderContent()}</>;
};

ContentItemWrapper.muiName = "Stack";

export default memo(ContentItemWrapper);
