import { Card, Group, Skeleton } from "@mantine/core";

export default function ResultSkeleton() {
  return (
    <Card withBorder mt="lg">
      <Group justify="space-between" mb="sm">
        <Skeleton height={18} width={140} />
        <Skeleton height={26} width={110} radius="sm" />
      </Group>
      <Skeleton height={12} my="xs" />
      <Skeleton height={12} width="90%" mb="xs" />
      <Group mt="sm" gap="xs">
        <Skeleton height={22} width={64} radius="sm" />
        <Skeleton height={22} width={72} radius="sm" />
        <Skeleton height={22} width={58} radius="sm" />
      </Group>
    </Card>
  );
}
