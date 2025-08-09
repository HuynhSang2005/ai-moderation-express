import { Group, Title, Button } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";

type Props = {
  onFeedback?: () => void;
  rightSlot?: React.ReactNode;
};

export default function HeaderBar({ onFeedback, rightSlot }: Props) {
  return (
    <Group justify="space-between" mb="lg">
      <Group>
        <IconSparkles size={28} />
        <Title order={2}>AI Comment Moderation</Title>
      </Group>
      {rightSlot ?? (
        <Button variant="light" size="xs" onClick={onFeedback}>
          Feedback
        </Button>
      )}
    </Group>
  );
}
