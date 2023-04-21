import React, { MouseEventHandler, useMemo } from "react";
import SvgIcon from "@mui/material/SvgIcon";
import { gsap } from "gsap";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { TFuncKey } from "i18next";
import useMediaQuery from "@mui/material/useMediaQuery";

const colors = [
  "#f94144",
  "#f9844a",
  "#f9c74f",
  "#43aa8b",
  "#4d908e",
  "#577590",
  "#277da1",
] as const;

type Opts = {
  cx: number;
  cy: number;
  radius: number;
  start_angle: number;
  end_angle: number;
};

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

const Sector = ({
  stroke,
  percent,
  degree,
  index,
}: {
  stroke: string;
  percent: number;
  active?: boolean;
  degree: [number, number];
  index: number;
}) => {
  const opts: Opts = {
    cx: 128,
    cy: 128,
    radius: 120,
    start_angle: degree[0],
    end_angle: degree[1],
  };

  const calculateD = (opts: Opts) => {
    const start = polarToCartesian(
      opts.cx,
      opts.cy,
      opts.radius,
      opts.end_angle
    );
    const end = polarToCartesian(
      opts.cx,
      opts.cy,
      opts.radius,
      opts.start_angle
    );
    const largeArcFlag = opts.end_angle - opts.start_angle <= 180 ? "0" : "1";
    return [
      "M",
      start.x,
      start.y,
      "A",
      opts.radius,
      opts.radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      opts.cx,
      opts.cy,
      "Z",
    ].join(" ");
  };

  const originalD = useMemo(() => calculateD(opts), []);
  const hoverD = useMemo(() => calculateD({ ...opts, radius: 128 }), []);

  const mouseEnterHandler: MouseEventHandler<SVGCircleElement> = ({
    currentTarget,
  }) => {
    gsap.to(".liTxt", { opacity: (i) => (i === index ? 1 : 0.33) });
    gsap.to(currentTarget, {
      ease: "expo",
      attr: { d: hoverD },
    });
    gsap.to("#nTxt", {
      ease: "power2.inOut",
      opacity: 1,
      attr: { fill: stroke },
      innerHTML: percent + "%",
      snap: "innerHTML",
    });
  };

  const mouseLeaveHandler: MouseEventHandler<SVGCircleElement> = ({
    currentTarget,
  }) => {
    gsap.to(".liTxt", { opacity: 1 });
    gsap.to(currentTarget, {
      ease: "expo",
      attr: { d: originalD },
    });
    gsap.to("#nTxt", { opacity: 0, ease: "power2.inOut" });
  };

  return (
    <path
      d={originalD}
      fill={stroke}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      fillRule="evenodd"
    />
  );
};

const Chart = ({ data }: { data: Map<string, number> }) => {
  const { t } = useTranslation("trip");
  const isTight = useMediaQuery("(max-width:819px)");
  const sum = useMemo(
    () => Array.from(data.values()).reduce((acc, item) => acc + item, 0),
    [data]
  );
  const degree: number[] = useMemo(
    () =>
      Array.from(data.values()).reduce<number[]>((acc, item, index) => {
        acc.push((index !== 0 ? acc[index - 1] : 0) + (item / sum) * 360);
        return acc;
      }, []),
    [sum]
  );

  return (
    <Stack
      direction="row-reverse"
      justifyContent="center"
      flexWrap="wrap"
      spacing={2}
    >
      <SvgIcon
        viewBox="0 0 256 256"
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: "272px",
          maxHeight: "272px",
          minWidth: "200px",
          minHeight: "200px",
          fontSize: "36px",
        }}
      >
        <g id="pieChart" rotate={-90}>
          {Array.from(data.values()).map((value, index) => (
            <Sector
              key={index}
              stroke={colors[index % colors.length]}
              degree={[index === 0 ? 0 : degree[index - 1], degree[index]]}
              percent={Math.round((value / sum) * 100)}
              index={index}
            />
          ))}
          <circle
            id="center"
            cx={128}
            cy={128}
            r={50}
            fill="#efefe5"
            stroke="#fff"
            strokeWidth="8"
          />
        </g>
        <text id="nTxt" x={128} y={140} textAnchor="middle"></text>
      </SvgIcon>
      <Stack
        flexDirection={isTight ? "row" : "column"}
        flexWrap={isTight ? "wrap" : "nowrap"}
        spacing={1}
        sx={(theme) => ({
          paddingTop: isTight ? undefined : theme.spacing(1),
          paddingBottom: isTight ? undefined : theme.spacing(1),
        })}
      >
        {Array.from(data.entries()).map(([label, value], index) => (
          <ListItemText
            sx={{
              marginTop: isTight ? 0 : undefined,
              flex: "0",
              minWidth: "auto",
            }}
            className="liTxt"
            key={index}
            primary={
              <Typography color={colors[index % colors.length]}>
                {t(`tag.${label}` as TFuncKey<"trip">) as string}
              </Typography>
            }
            secondary={value}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default Chart;
