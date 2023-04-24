import React from "react";
import { useTranslation } from "react-i18next";
import useMediaQuery from "@mui/material/useMediaQuery";
import Theme from "../../themes/theme";
import { KeyPrefix, TFuncKey } from "i18next";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const ComplexContentItem = ({
  index,
  keyPrefix,
  final = false,
}: {
  index: number;
  keyPrefix: KeyPrefix<"about">;
  final?: boolean;
}) => {
  const { t } = useTranslation("about");
  const isMobile = useMediaQuery((theme: typeof Theme) =>
    theme.breakpoints.down("sm")
  );

  const generateDesktopContent = (index: number) => {
    const content = [];
    for (let i = 1; i <= 2; i++) {
      const odd = i % 2 === 1;
      content.push(
        <Box
          key={`image_${i}`}
          sx={
            odd
              ? {
                  float: "right",
                  mb: 5,
                  ml: 2,
                }
              : {
                  float: "left",
                  mt: 5,
                  mr: 2,
                }
          }
        >
          <img
            src={require(`../../../public/images/${keyPrefix}_${
              index * 2 + i
            }.png`)}
            alt={t("image", { content: `$t(${keyPrefix}.header)` })}
            width="400px"
            height="400px"
          />
        </Box>,
        <Typography
          key={`text_${i}`}
          textAlign={odd ? "right" : "left"}
          sx={{ mt: 5 }}
        >
          {
            t(
              `${keyPrefix}.listItem${index * 2 + i}` as TFuncKey<"about">
            ) as string
          }
        </Typography>
      );
    }
    return <div>{content}</div>;
  };

  const generateMobileContent = (index: number) => {
    const content = [];
    for (let i = 1; i <= 2; i++) {
      const odd = i % 2 === 1;
      content.push(
        <Grid
          key={`item_${i}`}
          container
          spacing={2}
          alignItems="center"
          flexDirection={odd ? "row-reverse" : "row"}
          flexWrap="nowrap"
        >
          <Grid item>
            <img
              src={require(`../../../public/images/${keyPrefix}_${
                index * 2 + i
              }.png`)}
              alt={t("image", { content: `$t(${keyPrefix}.header)` })}
              width="200px"
              height="200px"
            />
          </Grid>
          <Grid item>
            <Typography textAlign={odd ? "right" : "left"}>
              {
                t(
                  `${keyPrefix}.listItem${index * 2 + i}` as TFuncKey<"about">
                ) as string
              }
            </Typography>
          </Grid>
        </Grid>
      );
    }
    return content;
  };

  const content = final ? (
    <Stack spacing={2} alignItems="center">
      <Typography textAlign="center">
        {
          t(
            `${keyPrefix}.listItem${index * 2 + 1}` as TFuncKey<"about">
          ) as string
        }
      </Typography>
      <img
        src={require(`../../../public/images/${keyPrefix}_${
          index * 2 + 1
        }.png`)}
        alt={t("image", { content: `$t(${keyPrefix}.header)` })}
        width={isMobile ? "200px" : "400px"}
        height={isMobile ? "200px" : "400px"}
      />
      <Typography textAlign="center">
        {t(`${keyPrefix}.text` as TFuncKey<"about">) as string}
      </Typography>
    </Stack>
  ) : isMobile ? (
    generateMobileContent(index)
  ) : (
    generateDesktopContent(index)
  );

  return (
    <>
      {index == 0 && (
        <Typography variant="h3">
          {t(`${keyPrefix}.header` as TFuncKey<"about">) as string}
        </Typography>
      )}
      {content}
    </>
  );
};

export default ComplexContentItem;
