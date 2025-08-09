import { Group, Title, Button, Box } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import ThemeToggle from "../components/ThemeToggle";

type Props = { onFeedback?: () => void; rightSlot?: React.ReactNode };

export default function HeaderBar({ onFeedback, rightSlot }: Props) {
  return (
    <Box pos="relative" mb="lg">
      {/* Glow layer (decorative) */}
      <Box
        aria-hidden
        pos="absolute"
        top={-30}
        left="50%"
        w={280}
        h={120}
        style={{
          transform: "translateX(-50%)",
          filter: "blur(42px)",
          opacity: 0.55,
          background:
            "linear-gradient(90deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.5) 50%, rgba(59,130,246,0.5) 100%)",
          borderRadius: 24,
          pointerEvents: "none",
        }}
      />

      <Group justify="space-between" pos="relative" wrap="wrap">
        <Group>
          <IconSparkles size={28} />
          <Title order={2}>AI Comment Moderation</Title>
        </Group>

        {rightSlot ?? (
          <Group>
            <ThemeToggle />
            <Button variant="light" size="xs" onClick={onFeedback}>
              Feedback
            </Button>
          </Group>
        )}
      </Group>
    </Box>
  );
}
