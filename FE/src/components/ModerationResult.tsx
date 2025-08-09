import {
  Card,
  Group,
  Text,
  Badge,
  Divider,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconCheck,
  IconX,
  IconCopy,
  IconCheck as IconCheckMini,
} from "@tabler/icons-react";
import type { ModerationResp } from "../libs/api";
import { highlightText } from "../libs/highlight";
import ConfettiBurst from "../components/ConfettiBurst";
import SuccessLottie from "../components/SuccessLottie";
import { useClipboard } from "@mantine/hooks";

type Props = {
  originalText: string;
  resp: ModerationResp;
  showDebug?: boolean;
};

export default function ModerationResult({
  originalText,
  resp,
  showDebug,
}: Props) {
  const allowed = resp.allowed;

  const clipboard = useClipboard({ timeout: 1200 });

  return (
    <Card withBorder mt="lg" pos="relative">
      {/* Confetti (ẩn nếu blocked) */}
      <ConfettiBurst active={allowed} />

      <Group justify="space-between">
        <Text fw={600}>Kết quả kiểm duyệt</Text>
        <Badge
          size="lg"
          variant={allowed ? "filled" : "gradient"}
          color={allowed ? "green" : undefined}
          gradient={allowed ? undefined : { from: "red", to: "grape", deg: 45 }}
          leftSection={allowed ? <IconCheck size={14} /> : <IconX size={14} />}
        >
          {allowed ? "ĐƯỢC DUYỆT" : "BỊ CHẶN"}
        </Badge>
      </Group>

      {/* Lottie nhỏ xinh khi allowed */}
      <Group mt="xs">
        <SuccessLottie show={allowed} />
      </Group>

      <Text mt="sm">
        {highlightText(originalText, resp.reasons, {
          tokensFromBE:
            resp.offending ??
            resp.debug?.offending ??
            resp.debug?.badwordsMatched,
        })}
      </Text>

      <Group mt="sm">
        {resp.reasons.length ? (
          resp.reasons.map((r) => <Badge key={r}>{r}</Badge>)
        ) : (
          <Badge variant="light">Clean</Badge>
        )}
      </Group>

      {showDebug && Boolean(resp.debug) && (
        <>
          <Divider my="sm" />
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Debug
            </Text>
            <Tooltip label={clipboard.copied ? "Đã copy!" : "Copy debug JSON"}>
              <ActionIcon
                variant="light"
                onClick={() =>
                  clipboard.copy(JSON.stringify(resp.debug, null, 2))
                }
                aria-label="Copy debug payload"
              >
                {clipboard.copied ? (
                  <IconCheckMini size={16} />
                ) : (
                  <IconCopy size={16} />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(resp.debug, null, 2)}
          </pre>
        </>
      )}
    </Card>
  );
}
