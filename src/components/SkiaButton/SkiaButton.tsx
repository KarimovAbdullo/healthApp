import {
  FitBox,
  Group,
  Paint,
  rect,
  RoundedRect,
  rrect,
  Shadow,
} from "@shopify/react-native-skia";

const border = rrect(rect(0, 0, 24, 24), 5, 5);
const container = rrect(rect(1, 1, 22, 22), 5, 5);
const src = rect(0, 0, 24, 24);

interface SkiaButtonProps {
  x: number;
  y: number;
  size: number;
}

export function SkiaButton({ x, y, size }: SkiaButtonProps) {
  return (
    <FitBox src={src} dst={rect(x, y, size, size)}>
      <Group>
        <Paint>
          <Shadow dx={-1} dy={-1} blur={3} color="#FEFCFF" />
          <Shadow dx={1} dy={1} blur={3} color="rgba(174, 174, 192, 0.4)" />
        </Paint>
        <RoundedRect rect={border} color="white" />
      </Group>

      <Group>
        <Paint>
          <Shadow
            dx={-1}
            dy={-1}
            blur={1}
            color="rgba(255, 255, 255, 0.2)"
            inner
          />
          <Shadow
            dx={1.5}
            dy={1.5}
            blur={3}
            color="rgba(174, 174, 192, 0.2)"
            inner
          />
        </Paint>
        <RoundedRect rect={container} color="#FEFCFF" />
      </Group>
    </FitBox>
  );
}
