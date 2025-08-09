import { Card, Group, Skeleton } from "@mantine/core";

export default function HistorySkeleton() {
  return (
    <Card withBorder mt="lg">
      <Skeleton height={16} width={120} mb="sm" />
      {[0,1,2].map((i) => (
        <Group key={i} justify="space-between" mb="xs">
          <Skeleton height={12} width="70%" />
          <Skeleton height={22} width={64} radius="sm" />
        </Group>
      ))}
    </Card>
  );
}
