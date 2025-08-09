import ThemeToggle from "../components/ThemeToggle";


import { Group, Title, Button } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";

export default function HeaderBar({ onFeedback, rightSlot }: { onFeedback?: () => void; rightSlot?: React.ReactNode; }) {
  return (
    <Group justify="space-between" mb="lg" wrap="wrap">
      <Group>
        <IconSparkles size={28} />
        <Title order={2}>AI Comment Moderation</Title>
      </Group>
      {rightSlot ?? (
        <Group>
          <ThemeToggle />
          <Button variant="light" size="xs" onClick={onFeedback}>Feedback</Button>
        </Group>
      )}
    </Group>
  );
}

