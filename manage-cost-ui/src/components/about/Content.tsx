import React, { memo, useMemo } from "react";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import { KeyPrefix, TFuncKey } from "i18next";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import Theme from "../../themes/theme";
import ImagePreload from "../UI/ImagePreload";

const Content = ({
  keyPrefix,
  hasText = false,
  listCount,
}: {
  keyPrefix: KeyPrefix<"about">;
  hasText?: boolean;
  listCount: number;
}) => {
  const { t } = useTranslation("about");
  const isMobile = useMediaQuery((theme: typeof Theme) =>
    theme.breakpoints.down("sm")
  );

  const generateList = useMemo(() => {
    const result = [];
    for (let i = 1; i <= listCount; i++) {
      result.push(
        <ListItem key={i}>
          <ListItemIcon sx={{ minWidth: "48px" }}>
            <RemoveOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            key={i}
            primary={
              t(`${keyPrefix}.listItem${i}` as TFuncKey<"about">) as string
            }
          />
        </ListItem>
      );
    }
    return result;
  }, [listCount, keyPrefix, t]);

  return (
    <>
      <Typography variant="h3">
        {t(`${keyPrefix}.header` as TFuncKey<"about">) as string}
      </Typography>
      <Grid container spacing={2}>
        <Grid item sx={{ flex: "1 1 300px" }}>
          <Stack spacing={2}>
            <div>
              {hasText && (
                <Typography>
                  {t(`${keyPrefix}.text` as TFuncKey<"about">) as string}
                </Typography>
              )}
              <List dense={isMobile}>{generateList}</List>
            </div>
          </Stack>
        </Grid>
        <Grid item margin="auto">
          <ImagePreload
            src={require(`../../../public/images/${keyPrefix}.png`)}
            alt={t("image", { content: `$t(${keyPrefix}.header)` })}
            width={isMobile ? 200 : 400}
            height={isMobile ? 200 : 400}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default memo(Content);
