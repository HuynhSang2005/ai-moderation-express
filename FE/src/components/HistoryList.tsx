import { Card, Text, Group, Badge, ActionIcon, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

export type HistoryItem = { text: string; allowed: boolean; reasons: string[] };

type Props = {
  items: HistoryItem[];
  onRemove?: (index: number) => void;
};

export default function HistoryList({ items, onRemove }: Props) {
  if (!items.length) return null;

  return (
    <Card withBorder mt="lg">
      <Group justify="space-between" mb="sm">
        <Text fw={600}>Lịch sử gần đây</Text>
      </Group>

      {items.map((h, i) => (
        <Group key={i} justify="space-between" mb="xs" wrap="nowrap">
          <Text size="sm" style={{ maxWidth: "70%" }} lineClamp={2} title={h.text}>
            {h.text}
          </Text>
          <Group gap="xs">
            <Badge color={h.allowed ? "green" : "red"}>
              {h.allowed ? "DUYỆT" : "CHẶN"}
            </Badge>
            {onRemove && (
              <Tooltip label="Xoá mục này">
                <ActionIcon variant="subtle" onClick={() => onRemove(i)} aria-label="remove">
                  <IconTrash size={16} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Group>
      ))}
    </Card>
  );
}
