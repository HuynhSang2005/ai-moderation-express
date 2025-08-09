import { Card, Group, Text, Badge, Divider } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import type { ModerationResp } from "../libs/api";
import { highlightText } from "../libs/highlight";

type Props = {
  originalText: string;
  resp: ModerationResp;
  showDebug?: boolean;
};

export default function ModerationResult({ originalText, resp, showDebug }: Props) {
  return (
    <Card withBorder mt="lg">
      <Group justify="space-between">
        <Text fw={600}>Kết quả kiểm duyệt</Text>
        <Badge
          size="lg"
          color={resp.allowed ? "green" : "red"}
          leftSection={resp.allowed ? <IconCheck size={14} /> : <IconX size={14} />}
        >
          {resp.allowed ? "ĐƯỢC DUYỆT" : "BỊ CHẶN"}
        </Badge>
      </Group>

      {/* Nội dung kèm highlight */}
      <Text mt="sm">{highlightText(originalText, resp.reasons)}</Text>

      <Group mt="sm">
        {resp.reasons.length
          ? resp.reasons.map((r) => <Badge key={r}>{r}</Badge>)
          : <Badge variant="light">Clean</Badge>}
      </Group>

      {showDebug && Boolean(resp.debug) && (
        <>
          <Divider my="sm" />
          <Text size="sm" c="dimmed">Debug</Text>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(resp.debug, null, 2)}
          </pre>
        </>
      )}
    </Card>
  );
}
