import { ActionIcon, Tooltip } from "@mantine/core";
import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("light"); // fallback khi system không hỗ trợ
  const next = computed === "dark" ? "light" : "dark";

  return (
    <Tooltip label={`Switch to ${next} mode`}>
      <ActionIcon
        variant="light"
        aria-label="Toggle color scheme"
        onClick={() => setColorScheme(next)}
      >
        {computed === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Tooltip>
  );
}
