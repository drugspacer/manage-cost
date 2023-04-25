import React, { FC, PropsWithChildren, ReactNode } from "react";
import ComplexContentItem from "../about/ComplexContentItem";
import Stack from "@mui/material/Stack";
import Content from "../about/Content";
import { KeyPrefix } from "i18next";

const ContentItemWrapper = ({ children }: { children?: ReactNode }) => {
  return (
    <Stack
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
      {children}
    </Stack>
  );
};

const renderContent =
  (Wrapper: FC<PropsWithChildren>) =>
  ({
    simple = true,
    keyPrefix,
    hasText = false,
    size,
  }: {
    simple?: boolean;
    keyPrefix: KeyPrefix<"about">;
    hasText?: boolean;
    size: number;
  }) => {
    const result = [];
    if (simple) {
      return [
        <Wrapper key={keyPrefix}>
          <Content keyPrefix={keyPrefix} hasText={hasText} listCount={size} />
        </Wrapper>,
      ];
    }
    for (let i = 0; i < size; i++) {
      result.push(
        <Wrapper key={`${keyPrefix}_${i}`}>
          <ComplexContentItem
            index={i}
            final={i == size - 1}
            keyPrefix={keyPrefix}
          />
        </Wrapper>
      );
    }
    return result;
  };

ContentItemWrapper.muiName = "Stack";

export default renderContent(ContentItemWrapper);
