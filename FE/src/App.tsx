import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Container,
  Title,
  Stack,
  Textarea,
  Group,
  Button,
  Card,
  Badge,
  Text,
  Loader,
} from "@mantine/core";
import { moderateText, type ModerationResp } from "./libs/api";
import { highlightText } from "./libs/highlight";

type HistoryItem = { text: string; allowed: boolean; reasons: string[] };

export default function App() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const { mutate, data, isPending, isError, error } = useMutation<
    ModerationResp,
    Error,
    string
  >({
    mutationFn: (t: string) => moderateText(t),
    onSuccess: (resp) => {
      setHistory((prev) => [
        { text, allowed: resp.allowed, reasons: resp.reasons },
        ...prev,
      ]);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) mutate(text);
  };

  const resp = data;

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="md">
        AI Comment Moderation
      </Title>

      <form onSubmit={onSubmit}>
        <Stack>
          <Textarea
            placeholder="Nhập bình luận…"
            autosize
            minRows={4}
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
          <Group>
            <Button type="submit" loading={isPending}>
              Kiểm tra
            </Button>
            <Button variant="default" onClick={() => setText("")}>
              Clear
            </Button>
            {history.length > 0 && (
              <Button
                variant="subtle"
                onClick={() => setHistory([])}
                title="Xoá lịch sử"
              >
                Clear history
              </Button>
            )}
          </Group>
        </Stack>
      </form>

      {isPending && (
        <Group mt="md">
          <Loader size="sm" /> <Text>Đang kiểm tra...</Text>
        </Group>
      )}

      {isError && (
        <Card withBorder mt="lg">
          <Text c="red">Lỗi: {error.message}</Text>
        </Card>
      )}

      {resp && (
        <Card withBorder mt="lg">
          <Group justify="space-between">
            <Text fw={600}>Kết quả</Text>
            <Badge color={resp.allowed ? "green" : "red"}>
              {resp.allowed ? "ALLOWED" : "BLOCKED"}
            </Badge>
          </Group>

          {/* Highlight nội dung đã gửi dựa trên reasons */}
          <Text mt="sm">{highlightText(text, resp.reasons)}</Text>

          <Group mt="sm">
            {resp.reasons.length ? (
              resp.reasons.map((r) => <Badge key={r}>{r}</Badge>)
            ) : (
              <Badge variant="light">clean</Badge>
            )}
          </Group>

          {Boolean(resp.debug) && (
            <>
              <Text size="sm" c="dimmed" mt="sm">
                Debug
              </Text>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(resp.debug, null, 2)}
              </pre>
            </>
          )}
        </Card>
      )}

      {history.length > 0 && (
        <Card withBorder mt="lg">
          <Text fw={600} mb="sm">
            Lịch sử
          </Text>
          {history.map((h, i) => (
            <Group key={i} justify="space-between" mb="xs">
              <Text size="sm" style={{ maxWidth: "70%" }}>
                {h.text}
              </Text>
              <Badge color={h.allowed ? "green" : "red"}>
                {h.allowed ? "ALLOWED" : "BLOCKED"}
              </Badge>
            </Group>
          ))}
        </Card>
      )}
    </Container>
  );
}
